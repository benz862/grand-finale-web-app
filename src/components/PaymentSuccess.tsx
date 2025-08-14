import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Mail, Loader2, ArrowRight, Shield } from 'lucide-react';
import Logo from './Logo';
import { verifyPaymentStatus } from '../lib/stripeService';
import { sendWelcomeEmail, createUserAccount } from '../lib/emailService';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [planId, setPlanId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const email = searchParams.get('email');
    
    if (!sessionId || !email) {
      setError('Missing payment information');
      setIsProcessing(false);
      return;
    }

    setCustomerEmail(email);
    
    // Verify payment with Stripe
    verifyPaymentWithStripe(sessionId, email);
  }, [searchParams]);

  const verifyPaymentWithStripe = async (sessionId: string, email: string) => {
    try {
      // Step 1: Verify payment status with Stripe
      const verificationResult = await verifyPaymentStatus(sessionId);
      
      if (!verificationResult.success) {
        throw new Error(verificationResult.error || 'Failed to verify payment');
      }

      if (!verificationResult.paid) {
        throw new Error('Payment was not completed');
      }

      // Step 2: Extract plan ID from session metadata (you'll need to implement this in your backend)
      // For now, we'll use a default plan
      const planId = 'standard_monthly'; // This should come from your backend
      setPlanId(planId);

      // Step 3: Create user account
      const accountResult = await createUserAccount(email, planId);
      if (!accountResult.success) {
        throw new Error('Failed to create user account');
      }

      // Step 4: Send welcome email
      const emailData = {
        email,
        planId,
        planName: 'Standard Monthly', // This should come from plan details
        planPrice: '$8',
        planPeriod: '/month',
        loginUrl: `${window.location.origin}/?email=${encodeURIComponent(email)}`,
        customerName: email.split('@')[0]
      };

      const emailSent = await sendWelcomeEmail(emailData);
      if (!emailSent) {
        console.warn('Failed to send welcome email, but payment was successful');
      }

      setIsSuccess(true);
      toast({
        title: 'Payment Successful!',
        description: 'Your account has been created and welcome email sent.',
      });

    } catch (error) {
      console.error('Payment verification error:', error);
      setError(error instanceof Error ? error.message : 'Payment verification failed');
      toast({
        title: 'Payment Error',
        description: 'There was an issue verifying your payment. Please contact support.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Processing Your Payment</h2>
            <p className="text-gray-600">Please wait while we verify your payment and set up your account...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-red-800">Payment Verification Failed</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/pricing')}
                className="w-full"
                style={{ backgroundColor: '#E4B64A', color: 'white' }}
              >
                Return to Pricing
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isSuccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: '#153A4B' }}>
            Welcome to The Grand Finale!
          </h1>
          <p className="text-gray-600 mt-2">
            Your payment was successful and your account is ready
          </p>
        </div>

        {/* Success Card */}
        <Card className="shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            
            <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your account has been created and you're all set to start your legacy planning journey.
            </p>

            {/* Email Notice */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-center mb-2">
                <Mail className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Check Your Email</span>
              </div>
              <p className="text-sm text-blue-700">
                We've sent your login credentials to: <strong>{customerEmail}</strong>
              </p>
            </div>

            {/* Plan Details */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Your Plan: Standard Monthly</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ All 16 Legacy Sections</li>
                <li>✓ Unlimited PDF Exports</li>
                <li>✓ Video & Audio Uploads</li>
                <li>✓ Cloud Storage & Backup</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/')}
                className="w-full"
                style={{ backgroundColor: '#E4B64A', color: 'white' }}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Access Your Account
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.open('mailto:support@thegrandfinale.com', '_blank')}
                className="w-full"
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Trust Signals */}
        <div className="mt-8 text-center">
          <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4" />
              <span>Account Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 