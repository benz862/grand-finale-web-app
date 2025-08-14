import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useToast } from './ui/use-toast';

interface EmailVerificationScreenProps {
  email: string;
  onBackToLogin: () => void;
}

const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({ 
  email, 
  onBackToLogin 
}) => {
  const [isResending, setIsResending] = useState(false);
  const [showDevMode, setShowDevMode] = useState(false);
  const { resendVerificationEmail, user } = useAuth();
  const { syncForm } = useDatabaseSync();
  const { toast } = useToast();

  const handleResendEmail = async () => {
    setIsResending(true);
    await resendVerificationEmail(email);
    setIsResending(false);
  };

  const handleDevModeSkip = async () => {
    // For development - skip email verification
    if (user?.email) {
      try {
        await syncForm(user.email, 'dev_skip_verification', { skipped: true, timestamp: new Date().toISOString() });
      } catch (error) {
        console.error('Error saving dev skip status:', error);
      }
    }
    toast({
      title: 'Development Mode',
      description: 'Email verification skipped for development. Redirecting to login...',
    });
    setTimeout(() => {
      window.location.href = '/app';
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* SkillBinder Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/Long_logo_The_Grand_Finale.png" 
              alt="The Grand Finale - A well-planned goodbye starts here" 
              className="h-52 w-auto object-contain"
            />
          </div>
        </div>

        <Card className="w-full max-w-md shadow-xl border-2 border-gray-200">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Verify Your Email
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-3">
            <p className="text-gray-600">
              We've sent a verification email to:
            </p>
            <p className="font-semibold text-gray-900 bg-gray-100 px-3 py-2 rounded">
              {email}
            </p>
            <p className="text-sm text-gray-500">
              Please check your email and click the verification link to activate your account.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Don't see the email?</p>
                  <ul className="text-xs space-y-1">
                    <li>• Check your spam/junk folder</li>
                    <li>• Make sure you entered the correct email</li>
                    <li>• It may take a few minutes to arrive</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleResendEmail}
              disabled={isResending}
              variant="outline"
              className="w-full"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Verification Email
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-50 px-2 text-gray-500">or</span>
              </div>
            </div>

            <Button 
              onClick={onBackToLogin}
              variant="ghost"
              className="w-full"
            >
              Back to Login
            </Button>

            {/* Development Mode Button */}
            <div className="text-center">
              <Button 
                onClick={() => setShowDevMode(!showDevMode)}
                variant="ghost"
                size="sm"
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                {showDevMode ? 'Hide' : 'Show'} Dev Options
              </Button>
            </div>

            {showDevMode && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-center space-y-3">
                  <p className="text-sm text-red-700 font-medium">
                    ⚠️ Development Mode Only
                  </p>
                  <p className="text-xs text-red-600">
                    Skip email verification for testing purposes
                  </p>
                  <Button 
                    onClick={handleDevModeSkip}
                    variant="destructive"
                    size="sm"
                    className="w-full"
                  >
                    Skip Email Verification (Dev Only)
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">After verification:</p>
                <p className="text-xs">
                  Once you click the verification link, you'll be able to log in and start your 7-day free trial.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default EmailVerificationScreen;
