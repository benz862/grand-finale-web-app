
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocalizationProvider } from './contexts/LocalizationContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TrialProvider } from './contexts/TrialContext';
import { supabase } from './lib/supabase';
import AppLayout from './components/AppLayout';
import './index.css';

// Tier Detection Helper
const getUserTier = (email: string): string => {
  if (email.includes('lite')) return 'lite';
  if (email.includes('standard')) return 'standard';
  if (email.includes('premium')) return 'premium';
  if (email.includes('lifetime')) return 'lifetime';
  return 'lite'; // default
};
const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  const percentage = (currentStep / totalSteps) * 100;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Progress</span>
        <span>{currentStep} of {totalSteps} sections completed</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-yellow-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Enhanced Login Screen for Elderly Users - Now with REAL authentication
const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showForgotEmail, setShowForgotEmail] = useState(false);
  const [showPhoneRecovery, setShowPhoneRecovery] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetStep, setResetStep] = useState('email'); // 'email', 'phone', 'code', 'success'
  const { login, signup, isLoading } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      let success = false;
      
      if (isSignUp) {
        if (!firstName || !lastName) {
          setError('Please enter your first and last name');
          return;
        }
        if (!signupPhone) {
          setError('Please enter your phone number for account recovery');
          return;
        }
        success = await signup({
          firstName,
          lastName,
          email,
          password,
          phone: signupPhone,
          startTrial: true
        });
        if (!success) {
          setError('Failed to create account. Please try again.');
        }
      } else {
        success = await login(email, password);
        if (!success) {
          setError('Invalid email or password. Please check your credentials.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  const handleForgotPassword = async (resetEmail: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        setError(error.message);
        return false;
      }
      
      return true;
    } catch (err: any) {
      setError('Failed to send reset email. Please try again.');
      return false;
    }
  };

  const handlePhoneRecovery = async (phone: string) => {
    // Simulate SMS sending (in real app, this would use Twilio or similar)
    try {
      // Generate a random 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store the code temporarily (in real app, this would be in backend)
      localStorage.setItem('tempVerificationCode', code);
      localStorage.setItem('tempPhoneNumber', phone);
      
      // Simulate SMS delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would send SMS here
      console.log(`SMS would be sent to ${phone} with code: ${code}`);
      
      // For demo purposes, show the code to the user
      alert(`Demo: Your verification code is ${code} (in real app, this would be sent via SMS)`);
      
      return true;
    } catch (err) {
      setError('Failed to send SMS. Please try again.');
      return false;
    }
  };

  const handleVerifyCode = async (enteredCode: string) => {
    const storedCode = localStorage.getItem('tempVerificationCode');
    const storedPhone = localStorage.getItem('tempPhoneNumber');
    
    if (enteredCode === storedCode && storedPhone === phoneNumber) {
      // Clear temporary data
      localStorage.removeItem('tempVerificationCode');
      localStorage.removeItem('tempPhoneNumber');
      
      // In a real app, you would look up the email associated with this phone number
      // For demo, we'll use a dummy email
      const associatedEmail = 'dummy.lite.monthly@epoxydogs.com'; // This would come from database lookup
      
      // Send password reset to the associated email
      return await handleForgotPassword(associatedEmail);
    } else {
      setError('Invalid verification code. Please try again.');
      return false;
    }
  };

  const handleForgotEmail = async (phone: string) => {
    try {
      // Query the Supabase phones table to find the email associated with this phone number
      let { data, error } = await supabase
        .from('phones')
        .select('email')
        .eq('phone', phone)
        .single();
      
      if (error) {
        console.error('Database error:', error);
        // Try with normalized phone number (remove all non-digits and try common formats)
        const normalizedPhone = phone.replace(/[^\d]/g, '');
        
        // Try different phone number formats
        const phoneFormats = [
          normalizedPhone,
          `+1${normalizedPhone}`,
          `+1-${normalizedPhone.slice(0,3)}-${normalizedPhone.slice(3,6)}-${normalizedPhone.slice(6)}`,
          `${normalizedPhone.slice(0,3)}-${normalizedPhone.slice(3,6)}-${normalizedPhone.slice(6)}`,
          `(${normalizedPhone.slice(0,3)}) ${normalizedPhone.slice(3,6)}-${normalizedPhone.slice(6)}`
        ];
        
        let foundData = null;
        for (const format of phoneFormats) {
          const { data: formatData, error: formatError } = await supabase
            .from('phones')
            .select('email')
            .eq('phone', format)
            .single();
            
          if (formatData && !formatError) {
            foundData = formatData;
            break;
          }
        }
        
        if (!foundData) {
          setError('No account found with this phone number. Please check and try again.');
          return false;
        }
        
        data = foundData;
      }
      
      if (data && data.email) {
        // Generate verification code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem('emailLookupCode', code);
        localStorage.setItem('emailLookupPhone', phone);
        localStorage.setItem('foundEmail', data.email);
        
        // Simulate SMS delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log(`SMS would be sent to ${phone} with code: ${code}`);
        alert(`Demo: Your verification code is ${code}. Your email is ${data.email} (in real app, email would be revealed after verification)`);
        
        return true;
      } else {
        setError('No account found with this phone number. Please check and try again.');
        return false;
      }
    } catch (err) {
      console.error('Error looking up email:', err);
      setError('Failed to look up email. Please try again.');
      return false;
    }
  };

  const handleVerifyEmailLookup = async (enteredCode: string) => {
    const storedCode = localStorage.getItem('emailLookupCode');
    const storedPhone = localStorage.getItem('emailLookupPhone');
    const foundEmail = localStorage.getItem('foundEmail');
    
    if (enteredCode === storedCode && storedPhone === phoneNumber) {
      // Clear temporary data
      localStorage.removeItem('emailLookupCode');
      localStorage.removeItem('emailLookupPhone');
      localStorage.removeItem('foundEmail');
      
      // Show the email to the user
      alert(`Your email address is: ${foundEmail}`);
      
      // Pre-fill the email in the login form
      setEmail(foundEmail || '');
      setShowForgotEmail(false);
      setPhoneNumber('');
      setVerificationCode('');
      setResetStep('email');
      
      return true;
    } else {
      setError('Invalid verification code. Please try again.');
      return false;
    }
  };

  // Forgot Password Modal
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          
          {/* Header */}
          <div className="text-center mb-8">
            <button 
              onClick={() => {
                setShowForgotPassword(false);
                setShowPhoneRecovery(false);
                setResetStep('email');
                setError('');
              }}
              className="mb-4 text-blue-600 hover:text-blue-800"
            >
              ← Back to Login
            </button>
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#153A4B' }}>
              Reset Your Password
            </h1>
            <p className="text-lg text-gray-600">
              Choose your recovery method
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Email Recovery */}
          {resetStep === 'email' && (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium mb-3" style={{ color: '#153A4B' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Enter your email address"
                  style={{ fontSize: '18px' }}
                />
              </div>
              
              <button
                onClick={async () => {
                  if (!resetEmail) {
                    setError('Please enter your email address');
                    return;
                  }
                  const success = await handleForgotPassword(resetEmail);
                  if (success) {
                    setResetStep('success');
                  }
                }}
                className="w-full py-4 px-6 text-lg font-semibold text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                style={{ 
                  backgroundColor: '#153A4B',
                  fontSize: '18px'
                }}
              >
                Send Reset Email
              </button>

              <div className="text-center">
                <p className="text-gray-600 mb-4">Don't remember your email?</p>
                <button
                  onClick={() => setShowPhoneRecovery(true)}
                  className="text-lg underline hover:no-underline"
                  style={{ color: '#153A4B' }}
                >
                  Use Phone Number Recovery
                </button>
              </div>
            </div>
          )}

          {/* Phone Recovery */}
          {showPhoneRecovery && resetStep === 'email' && (
            <div className="space-y-6 mt-6 pt-6 border-t">
              <div>
                <label className="block text-lg font-medium mb-3" style={{ color: '#153A4B' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="(555) 123-4567"
                  style={{ fontSize: '18px' }}
                />
              </div>
              
              <button
                onClick={async () => {
                  if (!phoneNumber) {
                    setError('Please enter your phone number');
                    return;
                  }
                  const success = await handlePhoneRecovery(phoneNumber);
                  if (success) {
                    setResetStep('code');
                  }
                }}
                className="w-full py-4 px-6 text-lg font-semibold text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                style={{ 
                  backgroundColor: '#28a745',
                  fontSize: '18px'
                }}
              >
                Send SMS Code
              </button>
            </div>
          )}

          {/* SMS Code Verification */}
          {resetStep === 'code' && (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium mb-3" style={{ color: '#153A4B' }}>
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Enter 6-digit code"
                  style={{ fontSize: '18px' }}
                  maxLength={6}
                />
              </div>
              
              <p className="text-sm text-gray-600">
                We sent a 6-digit code to {phoneNumber}
              </p>
              
              <button
                onClick={async () => {
                  if (!verificationCode || verificationCode.length !== 6) {
                    setError('Please enter the 6-digit verification code');
                    return;
                  }
                  const success = await handleVerifyCode(verificationCode);
                  if (success) {
                    setResetStep('success');
                  }
                }}
                className="w-full py-4 px-6 text-lg font-semibold text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                style={{ 
                  backgroundColor: '#153A4B',
                  fontSize: '18px'
                }}
              >
                Verify Code
              </button>

              <div className="text-center">
                <button
                  onClick={async () => {
                    await handlePhoneRecovery(phoneNumber);
                  }}
                  className="text-lg underline hover:no-underline"
                  style={{ color: '#153A4B' }}
                >
                  Resend Code
                </button>
              </div>
            </div>
          )}

          {/* Success Message */}
          {resetStep === 'success' && (
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-green-600">Reset Email Sent!</h3>
              <p className="text-gray-600">
                Check your email for password reset instructions. The email may take a few minutes to arrive.
              </p>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setShowPhoneRecovery(false);
                  setResetStep('email');
                  setError('');
                }}
                className="w-full py-4 px-6 text-lg font-semibold text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                style={{ 
                  backgroundColor: '#153A4B',
                  fontSize: '18px'
                }}
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Forgot Email Modal
  if (showForgotEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          
          {/* Header */}
          <div className="text-center mb-8">
            <button 
              onClick={() => {
                setShowForgotEmail(false);
                setPhoneNumber('');
                setVerificationCode('');
                setResetStep('email');
                setError('');
              }}
              className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ←
            </button>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#153A4B' }}>
              Forgot Your Email? 📧
            </h2>
            <p className="text-gray-600 text-lg">
              No worries! We'll help you find it using your phone number.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {resetStep === 'email' && (
            <div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setError('');
                
                if (!phoneNumber) {
                  setError('Please enter your phone number');
                  return;
                }
                
                const success = await handleForgotEmail(phoneNumber);
                if (success) {
                  setResetStep('code');
                }
              }}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-lg">
                    Enter Your Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g., 234-567-890 or +1234567890"
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ fontSize: '18px' }}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Enter the phone number associated with your account
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 text-lg font-semibold text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  style={{ 
                    backgroundColor: '#153A4B',
                    fontSize: '18px'
                  }}
                >
                  Find My Email 🔍
                </button>
              </form>
            </div>
          )}

          {resetStep === 'code' && (
            <div>
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#153A4B' }}>
                  Check Your Phone
                </h3>
                <p className="text-gray-600">
                  We've sent a verification code to <strong>{phoneNumber}</strong>
                </p>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                setError('');
                
                if (!verificationCode || verificationCode.length !== 6) {
                  setError('Please enter the 6-digit verification code');
                  return;
                }
                
                const success = await handleVerifyEmailLookup(verificationCode);
                if (success) {
                  setResetStep('success');
                }
              }}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-lg">
                    Enter Verification Code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-mono tracking-widest"
                    style={{ fontSize: '24px' }}
                    maxLength={6}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 text-lg font-semibold text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl mb-4"
                  style={{ 
                    backgroundColor: '#153A4B',
                    fontSize: '18px'
                  }}
                >
                  Verify Code ✓
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    const success = await handleForgotEmail(phoneNumber);
                    if (success) {
                      setVerificationCode('');
                    }
                  }}
                  className="w-full py-3 px-6 text-lg text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Resend Code 🔄
                </button>
              </form>
            </div>
          )}

          {resetStep === 'success' && (
            <div className="text-center">
              <div className="text-6xl mb-6">✅</div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#153A4B' }}>
                Email Found!
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                We've found your email address and pre-filled it in the login form. 
                You can now log in normally.
              </p>
              
              <button
                onClick={() => {
                  setShowForgotEmail(false);
                  setPhoneNumber('');
                  setVerificationCode('');
                  setResetStep('email');
                  setError('');
                }}
                className="w-full py-4 px-6 text-lg font-semibold text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                style={{ 
                  backgroundColor: '#153A4B',
                  fontSize: '18px'
                }}
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
        
        {/* Large SkillBinder Logo */}
        <div className="text-center mb-8">
          <img 
            src="/SkillBinder_Logo_250px_tall.png" 
            alt="SkillBinder - Professional Development Platform"
            className="mx-auto h-24 w-auto object-contain mb-4"
          />
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#153A4B' }}>
            Welcome to The Grand Finale
          </h1>
          <p className="text-lg text-gray-600">
            Your well planned goodbye starts here
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-medium mb-3" style={{ color: '#153A4B' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Your first name"
                    style={{ fontSize: '18px' }}
                    required={isSignUp}
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium mb-3" style={{ color: '#153A4B' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Your last name"
                    style={{ fontSize: '18px' }}
                    required={isSignUp}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-lg font-medium mb-3" style={{ color: '#153A4B' }}>
                  Phone Number 📱
                </label>
                <input
                  type="tel"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="e.g., 234-567-890 or +1234567890"
                  style={{ fontSize: '18px' }}
                  required={isSignUp}
                />
                <p className="text-sm text-gray-500 mt-2">
                  We'll use this to help you recover your account if needed
                </p>
              </div>
            </>
          )}
          
          <div>
            <label className="block text-lg font-medium mb-3" style={{ color: '#153A4B' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Enter your email"
              style={{ fontSize: '18px' }}
              required
            />
          </div>
          
          <div>
            <label className="block text-lg font-medium mb-3" style={{ color: '#153A4B' }}>
              Password {isSignUp && <span className="text-sm text-gray-500">(minimum 8 characters)</span>}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Enter your password"
              style={{ fontSize: '18px' }}
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 text-lg font-semibold text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            style={{ 
              backgroundColor: '#153A4B',
              fontSize: '18px'
            }}
          >
            {isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        {/* Forgot Password & Email Links */}
        {!isSignUp && (
          <div className="mt-4 text-center space-y-2">
            <div>
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-lg underline hover:no-underline mr-4"
                style={{ color: '#153A4B' }}
              >
                Forgot your password? 🔑
              </button>
            </div>
            <div>
              <button
                onClick={() => setShowForgotEmail(true)}
                className="text-lg underline hover:no-underline"
                style={{ color: '#153A4B' }}
              >
                Forgot your email? 📧
              </button>
            </div>
          </div>
        )}

        {/* Toggle between Sign In / Sign Up */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setFirstName('');
              setLastName('');
              setSignupPhone('');
              setEmail('');
              setPassword('');
            }}
            className="text-lg underline hover:no-underline"
            style={{ color: '#153A4B' }}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        {/* Accessibility Note */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-center" style={{ color: '#153A4B' }}>
            🔍 Large fonts and high contrast for better visibility<br/>
            � US/Canadian localization available after login<br/>
            🔒 Real authentication with Supabase database<br/>
            📧 Password recovery via email or phone number
          </p>
        </div>
      </div>
    </div>
  );
};

// Introduction component with Canadian localization and tier support
const IntroductionForm = ({ onNext }: { onNext: () => void }) => {
  const { logout, user } = useAuth();
  const userTier = getUserTier(user?.email || '');
  const tierConfig = TIER_CONFIG[userTier as keyof typeof TIER_CONFIG];
  
  // Determine if user prefers Canadian/British spelling
  // Check user preference, email domain, or default to US spelling
  const getUserLocalization = (): boolean => {
    const email = user?.email || '';
    
    // Check if user has explicitly set Canadian preference
    const savedPreference = localStorage.getItem('preferCanadianSpelling');
    if (savedPreference !== null) {
      return savedPreference === 'true';
    }
    
    // Check email domain or country indicators
    if (email.includes('.ca') || email.includes('canada') || email.includes('canadian')) {
      return true;
    }
    
    // Check browser language/location if available
    const userLanguage = navigator.language || navigator.languages?.[0];
    if (userLanguage?.includes('en-CA') || userLanguage?.includes('en-GB')) {
      return true;
    }
    
    // Default to US spelling
    return false;
  };
  
  const [isCanadian, setIsCanadian] = React.useState(getUserLocalization());
  
  // Save preference when changed
  const toggleSpelling = () => {
    const newPreference = !isCanadian;
    setIsCanadian(newPreference);
    localStorage.setItem('preferCanadianSpelling', newPreference.toString());
  };
  
  const localizeText = (text: string) => {
    if (!isCanadian) return text;
    return text
      .replace(/\bhonor\b/g, 'honour')
      .replace(/\bHonor\b/g, 'Honour')
      .replace(/\bcolor\b/g, 'colour')
      .replace(/\bColor\b/g, 'Colour')
      .replace(/\bfavorite\b/g, 'favourite')
      .replace(/\bFavorite\b/g, 'Favourite')
      .replace(/\borganize\b/g, 'organise')
      .replace(/\bOrganize\b/g, 'Organise');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="max-w-4xl mx-auto">
        {/* Header with Logout and Tier Info */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-sm text-gray-600">
            Welcome, {user?.email}
            <div className="mt-1">
              <span 
                className="px-3 py-1 rounded-full text-white text-xs font-medium"
                style={{ backgroundColor: tierConfig.color }}
              >
                {tierConfig.name}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg mb-8 p-8">
          <div className="text-center">
            <div className="mb-6">
              <img 
                src="/Long_logo_The_Grand_Finale.png" 
                alt="The Grand Finale - A well-planned goodbye starts here" 
                className="mx-auto h-52 w-auto object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-yellow-600">Welcome to The Grand Finale</h2>
            <div className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed space-y-4">
              <p>A guided web app that helps you prepare the most meaningful goodbye.</p>
              <p>This isn't about death. It's about life — and how to {localizeText('honor')} it, protect it, and preserve it for those who love you most.</p>
              <p>This platform walks you through every step of legacy planning with empathy, simplicity, and clarity.</p>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{isCanadian ? '🇨🇦' : '🇺🇸'}</span>
                  <span className="text-sm text-blue-700 font-medium">
                    {isCanadian ? 'Canadian' : 'US'} spelling: {localizeText('honor')} • {localizeText('color')} • {localizeText('favorite')} • {localizeText('organize')}
                  </span>
                </div>
                <button
                  onClick={toggleSpelling}
                  className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Switch to {isCanadian ? 'US' : 'Canadian'} spelling
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-3 text-blue-900">
              Your {tierConfig.name} Features {isCanadian ? '🇨🇦' : '🇺🇸'}
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {tierConfig.features.map((feature, index) => (
                <li key={index}>• {feature}</li>
              ))}
            </ul>
            {userTier !== 'lifetime' && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-xs text-yellow-700">
                  Want more features? Upgrade to unlock additional sections.
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold mb-3 text-blue-900">
              Your Privacy & Security
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Secure encrypted storage with Supabase</li>
              <li>• Only you can access your data</li>
              <li>• Export to PDF when ready</li>
              <li>• Save progress and return anytime</li>
              <li>• Canadian spelling: honour, colour, favourite</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-lg font-semibold mb-3 text-blue-900">
            Ready to Begin Your Legacy Planning Journey?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Take your time with each section. You can save your progress and return at any time.
          </p>
          <button
            onClick={onNext}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Begin My Legacy Planning →
          </button>
        </div>
      </div>
    </div>
  );
};

// Personal Contact Information Form
const PersonalContactForm = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const [formData, setFormData] = useState({
    primaryPhone: '',
    secondaryPhone: '',
    currentAddress: '',
    city: '',
    province: '',
    postalCode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    physicianName: '',
    physicianPhone: '',
    healthCardNumber: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <ProgressBar currentStep={2} totalSteps={4} />
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-8">
            <button 
              onClick={onBack}
              className="mr-4 px-4 py-2 text-blue-600 hover:text-blue-800"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-blue-900">Personal Contact Information</h1>
          </div>

          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium mb-3 text-blue-900">
                  Primary Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.primaryPhone}
                  onChange={(e) => handleInputChange('primaryPhone', e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-lg font-medium mb-3 text-blue-900">
                  Secondary Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.secondaryPhone}
                  onChange={(e) => handleInputChange('secondaryPhone', e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="(555) 987-6543"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-lg font-medium mb-3 text-blue-900">
                  Current Address
                </label>
                <input
                  type="text"
                  value={formData.currentAddress}
                  onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="123 Main Street, Unit 456"
                />
              </div>

              <div>
                <label className="block text-lg font-medium mb-3 text-blue-900">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Toronto"
                />
              </div>

              <div>
                <label className="block text-lg font-medium mb-3 text-blue-900">
                  Province
                </label>
                <select
                  value={formData.province}
                  onChange={(e) => handleInputChange('province', e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="">Select Province</option>
                  <option value="AB">Alberta</option>
                  <option value="BC">British Columbia</option>
                  <option value="MB">Manitoba</option>
                  <option value="NB">New Brunswick</option>
                  <option value="NL">Newfoundland and Labrador</option>
                  <option value="NS">Nova Scotia</option>
                  <option value="ON">Ontario</option>
                  <option value="PE">Prince Edward Island</option>
                  <option value="QC">Quebec</option>
                  <option value="SK">Saskatchewan</option>
                  <option value="NT">Northwest Territories</option>
                  <option value="NU">Nunavut</option>
                  <option value="YT">Yukon</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium mb-3 text-blue-900">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="M5V 3A8"
                />
              </div>
            </div>

            <div className="border-t pt-6 mt-8">
              <h3 className="text-xl font-bold mb-4 text-blue-900">Emergency Contact</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContactRelation}
                    onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Spouse, Child, Friend, etc."
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6 mt-8">
              <h3 className="text-xl font-bold mb-4 text-blue-900">Medical Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Family Physician
                  </label>
                  <input
                    type="text"
                    value={formData.physicianName}
                    onChange={(e) => handleInputChange('physicianName', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Dr. John Smith"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Physician Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.physicianPhone}
                    onChange={(e) => handleInputChange('physicianPhone', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Health Card Number
                  </label>
                  <input
                    type="text"
                    value={formData.healthCardNumber}
                    onChange={(e) => handleInputChange('healthCardNumber', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="1234-567-890"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-8">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 text-lg border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Previous
              </button>
              <button
                type="button"
                onClick={onNext}
                className="px-8 py-3 text-lg bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
              >
                Continue →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
// Simple first form - Legal & Biographical Information
const LegalBiographicalForm = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const [formData, setFormData] = useState({
    legalName: '',
    preferredName: '',
    birthDate: '',
    birthPlace: '',
    province: '',
    postalCode: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <ProgressBar currentStep={1} totalSteps={4} />
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-8">
            <button 
              onClick={onBack}
              className="mr-4 px-4 py-2 text-blue-600 hover:text-blue-800"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-blue-900">Legal & Biographical Information</h1>
          </div>

          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium mb-3 text-blue-900">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={formData.legalName}
                  onChange={(e) => handleInputChange('legalName', e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="As it appears on official documents"
                />
              </div>

              <div>
                <label className="block text-lg font-medium mb-3 text-blue-900">
                  Preferred Name
                </label>
                <input
                  type="text"
                  value={formData.preferredName}
                  onChange={(e) => handleInputChange('preferredName', e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="What you like to be called"
                />
              </div>

              <div>
                <label className="block text-lg font-medium mb-3 text-blue-900">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-lg font-medium mb-3 text-blue-900">
                  Place of Birth
                </label>
                <input
                  type="text"
                  value={formData.birthPlace}
                  onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="City, Province/State, Country"
                />
              </div>

              <div>
                <label className="block text-lg font-medium mb-3 text-blue-900">
                  Province of Birth
                </label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(e) => handleInputChange('province', e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="e.g., Ontario, British Columbia"
                />
              </div>

              <div>
                <label className="block text-lg font-medium mb-3 text-blue-900">
                  Current Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="A1A 1A1"
                />
              </div>
            </div>

            <div className="flex justify-between pt-8">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 text-lg border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Previous
              </button>
              <button
                type="button"
                onClick={onNext}
                className="px-8 py-3 text-lg bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
              >
                Continue →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Financial Information Form
const FinancialInformationForm = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const [formData, setFormData] = useState({
    primaryBank: '',
    primaryBankAccount: '',
    secondaryBank: '',
    secondaryBankAccount: '',
    investmentAdvisor: '',
    investmentAdvisorPhone: '',
    accountant: '',
    accountantPhone: '',
    lawyer: '',
    lawyerPhone: '',
    insuranceAgent: '',
    insuranceAgentPhone: '',
    lifeInsurancePolicy: '',
    lifeInsuranceBeneficiary: '',
    pensionPlan: '',
    pensionContact: '',
    willLocation: '',
    powerOfAttorney: '',
    estimatedNetWorth: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <ProgressBar currentStep={3} totalSteps={4} />
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-8">
            <button 
              onClick={onBack}
              className="mr-4 px-4 py-2 text-blue-600 hover:text-blue-800"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-blue-900">Financial Information</h1>
          </div>

          <form className="space-y-8">
            <div className="border-b pb-6">
              <h3 className="text-xl font-bold mb-4 text-blue-900">Banking Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Primary Bank & Branch
                  </label>
                  <input
                    type="text"
                    value={formData.primaryBank}
                    onChange={(e) => handleInputChange('primaryBank', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Royal Bank - King Street Branch"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Account Number (Last 4 digits)
                  </label>
                  <input
                    type="text"
                    value={formData.primaryBankAccount}
                    onChange={(e) => handleInputChange('primaryBankAccount', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="****1234"
                    maxLength={4}
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Secondary Bank (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.secondaryBank}
                    onChange={(e) => handleInputChange('secondaryBank', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="TD Canada Trust - Main Branch"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Secondary Account (Last 4 digits)
                  </label>
                  <input
                    type="text"
                    value={formData.secondaryBankAccount}
                    onChange={(e) => handleInputChange('secondaryBankAccount', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="****5678"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-xl font-bold mb-4 text-blue-900">Professional Advisors</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Investment Advisor
                  </label>
                  <input
                    type="text"
                    value={formData.investmentAdvisor}
                    onChange={(e) => handleInputChange('investmentAdvisor', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Jane Smith - RBC Wealth Management"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Advisor Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.investmentAdvisorPhone}
                    onChange={(e) => handleInputChange('investmentAdvisorPhone', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="(416) 555-0123"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Accountant
                  </label>
                  <input
                    type="text"
                    value={formData.accountant}
                    onChange={(e) => handleInputChange('accountant', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="John Doe CPA - Doe & Associates"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Accountant Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.accountantPhone}
                    onChange={(e) => handleInputChange('accountantPhone', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="(416) 555-0456"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Lawyer
                  </label>
                  <input
                    type="text"
                    value={formData.lawyer}
                    onChange={(e) => handleInputChange('lawyer', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Sarah Johnson - Johnson Law Firm"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Lawyer Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.lawyerPhone}
                    onChange={(e) => handleInputChange('lawyerPhone', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="(416) 555-0789"
                  />
                </div>
              </div>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-xl font-bold mb-4 text-blue-900">Insurance & Benefits</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Insurance Agent
                  </label>
                  <input
                    type="text"
                    value={formData.insuranceAgent}
                    onChange={(e) => handleInputChange('insuranceAgent', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Mike Wilson - State Farm"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Agent Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.insuranceAgentPhone}
                    onChange={(e) => handleInputChange('insuranceAgentPhone', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="(416) 555-0321"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Life Insurance Policy Number
                  </label>
                  <input
                    type="text"
                    value={formData.lifeInsurancePolicy}
                    onChange={(e) => handleInputChange('lifeInsurancePolicy', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Policy #ABC123456"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Primary Beneficiary
                  </label>
                  <input
                    type="text"
                    value={formData.lifeInsuranceBeneficiary}
                    onChange={(e) => handleInputChange('lifeInsuranceBeneficiary', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Spouse, Child, etc."
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Pension Plan
                  </label>
                  <input
                    type="text"
                    value={formData.pensionPlan}
                    onChange={(e) => handleInputChange('pensionPlan', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Company Pension, CPP, OAS, etc."
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Pension Contact
                  </label>
                  <input
                    type="text"
                    value={formData.pensionContact}
                    onChange={(e) => handleInputChange('pensionContact', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="HR Department or Plan Administrator"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-900">Legal Documents</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Will Location
                  </label>
                  <input
                    type="text"
                    value={formData.willLocation}
                    onChange={(e) => handleInputChange('willLocation', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Lawyer's office, safety deposit box, home safe, etc."
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Power of Attorney
                  </label>
                  <input
                    type="text"
                    value={formData.powerOfAttorney}
                    onChange={(e) => handleInputChange('powerOfAttorney', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Name of person with power of attorney"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Estimated Net Worth (Optional)
                  </label>
                  <select
                    value={formData.estimatedNetWorth}
                    onChange={(e) => handleInputChange('estimatedNetWorth', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="">Select Range</option>
                    <option value="under-100k">Under $100,000</option>
                    <option value="100k-250k">$100,000 - $250,000</option>
                    <option value="250k-500k">$250,000 - $500,000</option>
                    <option value="500k-1m">$500,000 - $1,000,000</option>
                    <option value="1m-2m">$1,000,000 - $2,000,000</option>
                    <option value="over-2m">Over $2,000,000</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-8">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 text-lg border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Previous
              </button>
              <button
                type="button"
                onClick={onNext}
                className="px-8 py-3 text-lg bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
              >
                Continue →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Digital Assets & Online Accounts Form
const DigitalAssetsForm = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const [formData, setFormData] = useState({
    emailAccounts: '',
    socialMediaAccounts: '',
    onlineBanking: '',
    investmentAccounts: '',
    cloudStorage: '',
    subscriptionServices: '',
    cryptoWallets: '',
    digitalPhotos: '',
    importantFiles: '',
    passwordManager: '',
    recoveryInstructions: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <ProgressBar currentStep={4} totalSteps={4} />
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-8">
            <button 
              onClick={onBack}
              className="mr-4 px-4 py-2 text-blue-600 hover:text-blue-800"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-blue-900">Digital Assets & Online Accounts</h1>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <span className="text-yellow-600 mr-3">⚠️</span>
              <div>
                <h3 className="font-semibold text-yellow-800">Security Note</h3>
                <p className="text-yellow-700 text-sm">Never include actual passwords here. Only list account names and recovery hints. Store actual passwords securely in a password manager.</p>
              </div>
            </div>
          </div>

          <form className="space-y-8">
            <div className="border-b pb-6">
              <h3 className="text-xl font-bold mb-4 text-blue-900">Email & Communication</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Email Accounts
                  </label>
                  <textarea
                    value={formData.emailAccounts}
                    onChange={(e) => handleInputChange('emailAccounts', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    rows={3}
                    placeholder="Gmail: john.doe@gmail.com&#10;Work Email: j.doe@company.com&#10;Recovery Email: recovery@hotmail.com"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Social Media Accounts
                  </label>
                  <textarea
                    value={formData.socialMediaAccounts}
                    onChange={(e) => handleInputChange('socialMediaAccounts', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    rows={3}
                    placeholder="Facebook: @johndoe&#10;LinkedIn: john-doe-professional&#10;Instagram: @johndoe123"
                  />
                </div>
              </div>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-xl font-bold mb-4 text-blue-900">Financial & Investment Accounts</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Online Banking
                  </label>
                  <textarea
                    value={formData.onlineBanking}
                    onChange={(e) => handleInputChange('onlineBanking', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    rows={2}
                    placeholder="RBC Online Banking: johndoe123&#10;TD EasyWeb: j.doe.primary"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Investment Accounts
                  </label>
                  <textarea
                    value={formData.investmentAccounts}
                    onChange={(e) => handleInputChange('investmentAccounts', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    rows={2}
                    placeholder="Questrade: username123&#10;Wealthsimple: john.doe@email.com"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Cryptocurrency Wallets (if any)
                  </label>
                  <textarea
                    value={formData.cryptoWallets}
                    onChange={(e) => handleInputChange('cryptoWallets', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    rows={2}
                    placeholder="Coinbase: john.doe@email.com&#10;Hardware wallet stored in: safe location"
                  />
                </div>
              </div>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-xl font-bold mb-4 text-blue-900">Storage & Services</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Cloud Storage
                  </label>
                  <textarea
                    value={formData.cloudStorage}
                    onChange={(e) => handleInputChange('cloudStorage', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    rows={2}
                    placeholder="Google Drive: john.doe@gmail.com&#10;iCloud: john.doe@icloud.com&#10;Dropbox: john.doe@email.com"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Subscription Services
                  </label>
                  <textarea
                    value={formData.subscriptionServices}
                    onChange={(e) => handleInputChange('subscriptionServices', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    rows={3}
                    placeholder="Netflix: john.doe@email.com&#10;Spotify: john.doe@email.com&#10;Amazon Prime: john.doe@email.com&#10;Utility companies online accounts"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Digital Photos & Important Files Location
                  </label>
                  <textarea
                    value={formData.digitalPhotos}
                    onChange={(e) => handleInputChange('digitalPhotos', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    rows={2}
                    placeholder="Google Photos: family photos 2010-2024&#10;External hard drive: backup in bedroom closet&#10;USB drive: important documents in safe"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-900">Access & Recovery Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Password Manager
                  </label>
                  <input
                    type="text"
                    value={formData.passwordManager}
                    onChange={(e) => handleInputChange('passwordManager', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="1Password, LastPass, Bitwarden, etc."
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-3 text-blue-900">
                    Recovery Instructions for Family
                  </label>
                  <textarea
                    value={formData.recoveryInstructions}
                    onChange={(e) => handleInputChange('recoveryInstructions', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    rows={4}
                    placeholder="Master password for password manager is stored in: [location]&#10;Security questions answers can be found: [location]&#10;Two-factor authentication backup codes are stored: [location]&#10;Contact [person] for help with technical recovery"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-8">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 text-lg border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Previous
              </button>
              <button
                type="button"
                onClick={onNext}
                className="px-8 py-3 text-lg bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
              >
                Continue →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated, user } = useAuth();
  
  console.log('AppContent render:', { isAuthenticated, user: user?.email });
  
  if (!isAuthenticated) {
    console.log('Not authenticated, showing AuthScreen');
    return <AuthScreen />;
  }

  console.log('Authenticated, showing AppLayout');
  return <AppLayout />;
};

const App = () => (
  <LocalizationProvider>
    <AuthProvider>
      <TrialProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppContent />} />
          </Routes>
        </BrowserRouter>
      </TrialProvider>
    </AuthProvider>
  </LocalizationProvider>
);

export default App;
