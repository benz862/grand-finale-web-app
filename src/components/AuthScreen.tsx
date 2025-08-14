import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useToast } from './ui/use-toast';
import { Check, Eye, EyeOff, Mail, Lock, User, ArrowRight, Shield, Clock, Users, Phone } from 'lucide-react';
import Logo from './Logo';
import EmailVerificationScreen from './EmailVerificationScreen';
import { useTrial } from '../contexts/TrialContext';
import { useAuth } from '../contexts/AuthContext';
import { formatPhoneNumber } from '@/lib/phoneNumberFormatter';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot-password'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const { startTrial, activateTrial } = useTrial();
  const { login, signup, resetPassword, pendingEmailVerification } = useAuth();

  // Check if user came from pricing page with a selected plan or wants to start trial
  React.useEffect(() => {
    // Load from localStorage for now, will be replaced with database loading
    const selectedPlan = localStorage.getItem('selectedPlan');
    const startingTrial = localStorage.getItem('startingTrial');
    
    if (selectedPlan || startingTrial) {
      setActiveTab('signup');
      localStorage.removeItem('selectedPlan'); // Clear it after use
      
      // If starting trial, update signup form
      if (startingTrial) {
        setSignupForm(prev => ({ ...prev, startTrial: true }));
      }
    }
  }, []);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false,
    startTrial: true
  });

  // Forgot password form state
  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: ''
  });

  const handleLoginChange = (field: string, value: string) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSignupChange = (field: string, value: string | boolean) => {
    if (field === 'phone') {
      // Use phone number formatting for signup phone
      const formatted = formatPhoneNumber(value as string);
      setSignupForm(prev => ({ ...prev, [field]: formatted.formatted }));
    } else {
      setSignupForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleForgotPasswordChange = (field: string, value: string) => {
    setForgotPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate inputs
      if (!loginForm.email || !loginForm.password) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all required fields.',
          variant: 'destructive'
        });
        return;
      }

      if (!validateEmail(loginForm.email)) {
        toast({
          title: 'Invalid Email',
          description: 'Please enter a valid email address.',
          variant: 'destructive'
        });
        return;
      }

      const success = await login(loginForm.email, loginForm.password);
      
      if (success) {
        toast({
          title: 'Welcome Back!',
          description: 'Successfully logged in to The Grand Finale.',
        });
        onAuthSuccess();
      } else {
        // Handle failed login (incorrect credentials)
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password. Please check your credentials and try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Login Error',
        description: 'An error occurred during login. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate inputs
      if (!signupForm.firstName || !signupForm.lastName || !signupForm.email || !signupForm.password || !signupForm.phone) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all required fields.',
          variant: 'destructive'
        });
        return;
      }

      if (!validateEmail(signupForm.email)) {
        toast({
          title: 'Invalid Email',
          description: 'Please enter a valid email address.',
          variant: 'destructive'
        });
        return;
      }

      if (!validatePassword(signupForm.password)) {
        toast({
          title: 'Weak Password',
          description: 'Password must be at least 8 characters long.',
          variant: 'destructive'
        });
        return;
      }

      if (signupForm.password !== signupForm.confirmPassword) {
        toast({
          title: 'Password Mismatch',
          description: 'Passwords do not match. Please try again.',
          variant: 'destructive'
        });
        return;
      }

      if (!signupForm.agreeToTerms) {
        toast({
          title: 'Terms Agreement Required',
          description: 'Please agree to the terms and conditions.',
          variant: 'destructive'
        });
        return;
      }

      const success = await signup({
        firstName: signupForm.firstName,
        lastName: signupForm.lastName,
        email: signupForm.email,
        password: signupForm.password,
        phone: signupForm.phone,
        startTrial: signupForm.startTrial
      });

      if (success) {
        // Start trial if selected
        if (signupForm.startTrial) {
          activateTrial();
          localStorage.removeItem('startingTrial'); // Clear the flag
          toast({
            title: 'Account Created & Trial Started!',
            description: 'Welcome to The Grand Finale! Your 7-day free trial has begun.',
          });
        } else {
          toast({
            title: 'Account Created!',
            description: 'Welcome to The Grand Finale! Please choose a plan to continue.',
          });
        }
        onAuthSuccess();
      } else {
        // Handle failed signup
        toast({
          title: 'Signup Failed',
          description: 'Unable to create account. This email may already be in use or there was a server error.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Signup Error',
        description: 'An error occurred during signup. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate inputs
      if (!forgotPasswordForm.email) {
        toast({
          title: 'Missing Email',
          description: 'Please enter your email address.',
          variant: 'destructive'
        });
        return;
      }

      if (!validateEmail(forgotPasswordForm.email)) {
        toast({
          title: 'Invalid Email',
          description: 'Please enter a valid email address.',
          variant: 'destructive'
        });
        return;
      }

      const success = await resetPassword(forgotPasswordForm.email);
      
      if (success) {
        // Reset form
        setForgotPasswordForm({ email: '' });
        // Go back to login
        setActiveTab('login');
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);
      toast({
        title: 'Error',
        description: error.message || 'An error occurred while processing your request.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // DEVELOPMENT MODE: Skip email verification screen entirely
  // Show email verification screen if user needs to verify email
  if (pendingEmailVerification && false) { // Disabled for development
    return (
      <EmailVerificationScreen 
        email={pendingEmailVerification}
        onBackToLogin={() => {
          // Clear pending verification and go back to login
          window.location.reload();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/Long_logo_The_Grand_Finale.png" 
              alt="The Grand Finale - A well-planned goodbye starts here" 
              className="h-52 w-auto object-contain"
            />
          </div>
        </div>

        {/* Auth Tabs */}
        <Card className="shadow-xl border-2 border-gray-200">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold" style={{ color: '#153A4B' }}>Get Started</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup' | 'forgot-password')}>
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger 
                  value="login" 
                  className="text-lg font-semibold py-3 data-[state=active]:bg-skillbinder-blue data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                  style={{ 
                    color: activeTab === 'login' ? 'white' : '#153A4B',
                    backgroundColor: activeTab === 'login' ? '#17394B' : 'transparent'
                  }}
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="text-lg font-semibold py-3 data-[state=active]:bg-skillbinder-blue data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                  style={{ 
                    color: activeTab === 'signup' ? 'white' : '#153A4B',
                    backgroundColor: activeTab === 'signup' ? '#17394B' : 'transparent'
                  }}
                >
                  Create Account
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="login-email" className="text-base font-semibold" style={{ color: '#153A4B' }}>Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email address"
                        value={loginForm.email}
                        onChange={(e) => handleLoginChange('email', e.target.value)}
                        className="pl-11 py-3 text-base border-2 border-gray-300 focus:border-skillbinder-blue rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="login-password" className="text-base font-semibold" style={{ color: '#153A4B' }}>Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) => handleLoginChange('password', e.target.value)}
                        className="pl-11 pr-11 py-3 text-base border-2 border-gray-300 focus:border-skillbinder-blue rounded-lg"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="skillbinder_yellow"
                    className="w-full skillbinder_yellow py-3 text-lg font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot-password')}
                    className="text-sm font-medium hover:underline"
                    style={{ color: '#17394B' }}
                  >
                    Forgot your password?
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('signup')}
                      className="font-medium"
                      style={{ color: '#17394B' }}
                    >
                      Create one here
                    </button>
                  </p>
                </div>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="signup-firstname" className="text-base font-semibold" style={{ color: '#153A4B' }}>First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                        <Input
                          id="signup-firstname"
                          type="text"
                          placeholder="First name"
                          value={signupForm.firstName}
                          onChange={(e) => handleSignupChange('firstName', e.target.value)}
                          className="pl-11 py-3 text-base border-2 border-gray-300 focus:border-skillbinder-blue rounded-lg"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="signup-lastname" className="text-base font-semibold" style={{ color: '#153A4B' }}>Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                        <Input
                          id="signup-lastname"
                          type="text"
                          placeholder="Last name"
                          value={signupForm.lastName}
                          onChange={(e) => handleSignupChange('lastName', e.target.value)}
                          className="pl-11 py-3 text-base border-2 border-gray-300 focus:border-skillbinder-blue rounded-lg"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="signup-email" className="text-base font-semibold" style={{ color: '#153A4B' }}>Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email address"
                        value={signupForm.email}
                        onChange={(e) => handleSignupChange('email', e.target.value)}
                        className="pl-11 py-3 text-base border-2 border-gray-300 focus:border-skillbinder-blue rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="signup-phone" className="text-base font-semibold" style={{ color: '#153A4B' }}>Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="e.g., +1 (234) 567-8900"
                        value={signupForm.phone}
                        onChange={(e) => handleSignupChange('phone', e.target.value)}
                        className="pl-11 py-3 text-base border-2 border-gray-300 focus:border-skillbinder-blue rounded-lg"
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      📱 We'll use this to help you recover your account if needed
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="signup-password" className="text-base font-semibold" style={{ color: '#153A4B' }}>Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        value={signupForm.password}
                        onChange={(e) => handleSignupChange('password', e.target.value)}
                        className="pl-11 pr-11 py-3 text-base border-2 border-gray-300 focus:border-skillbinder-blue rounded-lg"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="signup-confirm-password" className="text-base font-semibold" style={{ color: '#153A4B' }}>Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                      <Input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={signupForm.confirmPassword}
                        onChange={(e) => handleSignupChange('confirmPassword', e.target.value)}
                        className="pl-11 pr-11 py-3 text-base border-2 border-gray-300 focus:border-skillbinder-blue rounded-lg"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={signupForm.startTrial}
                        onChange={(e) => handleSignupChange('startTrial', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">
                        Start 7-day free trial (no credit card required)
                      </span>
                    </label>

                    <label className="flex items-start space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={signupForm.agreeToTerms}
                        onChange={(e) => handleSignupChange('agreeToTerms', e.target.checked)}
                        className="rounded border-gray-300 mt-1"
                        required
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the{' '}
                        <a href="#" className="text-blue-600 hover:underline">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    variant="skillbinder_yellow"
                    className="w-full skillbinder_yellow py-3 text-lg font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="font-medium"
                      style={{ color: '#17394B' }}
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </TabsContent>

              {/* Forgot Password Tab */}
              <TabsContent value="forgot-password">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold" style={{ color: '#153A4B' }}>Reset Your Password</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="forgot-email" className="text-base font-semibold" style={{ color: '#153A4B' }}>Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="Enter your email address"
                        value={forgotPasswordForm.email}
                        onChange={(e) => handleForgotPasswordChange('email', e.target.value)}
                        className="pl-11 py-3 text-base border-2 border-gray-300 focus:border-skillbinder-blue rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="skillbinder_yellow"
                    className="w-full skillbinder_yellow py-3 text-lg font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Remember your password?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="font-medium"
                      style={{ color: '#17394B' }}
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Pricing Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Want to see our pricing plans?{' '}
            <button
              type="button"
              onClick={() => window.location.href = '/pricing'}
              className="font-medium underline hover:text-blue-600"
              style={{ color: '#17394B' }}
            >
              View Pricing Plans
            </button>
          </p>
        </div>

        {/* Trust Signals */}
        <div className="mt-8 text-center">
          <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Bank-level security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>30-day guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>10,000+ families trust us</span>
            </div>
          </div>
        </div>

        {/* Support Contact */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact us at{' '}
            <a 
              href="mailto:support@skillbinder.com" 
              className="font-medium underline hover:text-blue-600"
              style={{ color: '#17394B' }}
            >
              support@skillbinder.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;