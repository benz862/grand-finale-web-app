import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '../components/ui/use-toast';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  createdAt?: string;
  isAuthenticated: boolean;
  stripe_customer_id?: string;
  subscription_status?: 'active' | 'past_due' | 'inactive';
  subscription_grace_expires?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingEmailVerification: string | null; // Email waiting for verification
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    startTrial: boolean;
  }) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEmailVerification, setPendingEmailVerification] = useState<string | null>(null);
  const { toast } = useToast();

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email_confirmed_at);
        
        if (session?.user) {
          // DEVELOPMENT MODE: Skip email verification entirely
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            createdAt: session.user.created_at,
            isAuthenticated: true
          });
          setPendingEmailVerification(null); // Clear pending verification
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // DEVELOPMENT MODE: Skip email verification entirely
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          createdAt: session.user.created_at,
          isAuthenticated: true
        });
        setPendingEmailVerification(null);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('Login response:', { data, error });

      if (error) {
        // Check if error is due to email not confirmed
        if (error.message.includes('Email not confirmed')) {
          setPendingEmailVerification(email);
          toast({
            title: 'Email Verification Required',
            description: 'Please check your email and click the verification link before logging in.',
            variant: 'destructive'
          });
          return false;
        }
        
        toast({
          title: 'Login Failed',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }

      if (data.user) {
        // Check for development mode skip
        const devSkip = localStorage.getItem('dev_skip_verification');
        
        // DEVELOPMENT MODE: Skip email verification entirely
        // Email verification check disabled for development

        // Clear dev skip flag after successful login
        if (devSkip) {
          localStorage.removeItem('dev_skip_verification');
        }

        console.log('Setting user data:', {
          id: data.user.id,
          email: data.user.email,
          createdAt: data.user.created_at
        });
        
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          createdAt: data.user.created_at,
          isAuthenticated: true
        });
        
        // Clear any pending verification state
        setPendingEmailVerification(null);
        
        console.log('User set successfully, showing welcome toast');
        toast({
          title: 'Welcome!',
          description: 'Successfully logged in.',
        });
        return true;
      }

      return false;
    } catch (error: any) {
      toast({
        title: 'Login Error',
        description: error.message || 'An error occurred during login.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    startTrial: boolean;
  }): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('Attempting signup for:', userData.email);
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
          },
          emailRedirectTo: `${window.location.origin}/app`
        }
      });

      console.log('Signup response:', { data, error });

      if (error) {
        console.error('Signup error:', error);
        toast({
          title: 'Signup Failed',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }

      if (data.user) {
        console.log('User created successfully:', data.user);
        console.log('User ID:', data.user.id);
        console.log('Email confirmed:', data.user.email_confirmed_at);
        console.log('Confirmation sent:', data.user.confirmation_sent_at);
        // DEVELOPMENT MODE: Skip phone insertion during signup to avoid RLS issues
        // Phone numbers can be added later through the Personal Information form
        console.log('Skipping phone insertion during signup for development');

        toast({
          title: 'Account Created!',
          description: 'Account created successfully! You can now log in.',
        });
        
        // Clear pending verification state for development
        setPendingEmailVerification(null);
        
        return true;
      }

      return false;
    } catch (error: any) {
      toast({
        title: 'Signup Error',
        description: error.message || 'An error occurred during signup.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        toast({
          title: 'Resend Failed',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }

      toast({
        title: 'Verification Email Sent',
        description: 'Please check your email for the verification link.',
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to resend verification email.',
        variant: 'destructive'
      });
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/app`
      });

      if (error) {
        toast({
          title: 'Password Reset Failed',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }

      toast({
        title: 'Password Reset Email Sent',
        description: 'Please check your email for the password reset link.',
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send password reset email.',
        variant: 'destructive'
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      
      // Redirect to the app page where the login screen is
      window.location.href = '/app';
      
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if there's an error, clear the local state
      setUser(null);
      // Still redirect to app page
      window.location.href = '/app';
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user?.isAuthenticated,
    isLoading,
    pendingEmailVerification,
    login,
    signup,
    resendVerificationEmail,
    resetPassword,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 