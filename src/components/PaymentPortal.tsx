import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, CreditCard, Mail, Shield, ArrowLeft, Loader2 } from 'lucide-react';
import Logo from './Logo';
import { sendWelcomeEmail, createUserAccount } from '../lib/emailService';
import { createCheckoutSession, getPlanPricing } from '../lib/stripeService';

interface PaymentPortalProps {
  onPaymentSuccess: (email: string, planId: string) => void;
}

const PaymentPortal: React.FC<PaymentPortalProps> = ({ onPaymentSuccess }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success'>('form');
  const [customerEmail, setCustomerEmail] = useState('');
  const [planId, setPlanId] = useState('');
  const [planDetails, setPlanDetails] = useState<any>(null);

  // Get plan details from URL params
  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan) {
      setPlanId(plan);
      const planData = getPlanDetails(plan);
      setPlanDetails(planData);
    }
  }, [searchParams]);

  const getPlanDetails = (planId: string) => {
    const plans = {
      'lite_monthly': { name: 'Lite', price: '$4', period: '/month', features: ['Access to Sections 1-3', '1 PDF Export per month (Watermarked)', 'Data Storage (Supabase)', 'Basic Support'] },
      'standard_monthly': { name: 'Standard', price: '$8', period: '/month', features: ['Access to Sections 1-15', '3 PDF Exports per month (No Watermark)', 'Secure Backup'] },
      'premium_monthly': { name: 'Premium', price: '$12', period: '/month', features: ['All Sections with Uploads', 'Unlimited PDF Exports', 'Priority Support (24hr response)', 'Section 12 & 16 File Uploads'] },
      'lifetime': { name: 'Lifetime', price: '$199', period: ' one-time', features: ['Everything Forever', 'All Features Included', 'Priority Support', 'Lifetime Updates'] },
      'lite_yearly': { name: 'Lite', price: '$40', period: '/year', features: ['Access to Sections 1-3', '1 PDF Export per month (Watermarked)', 'Data Storage (Supabase)', 'Basic Support'] },
      'standard_yearly': { name: 'Standard', price: '$80', period: '/year', features: ['Access to Sections 1-15', '3 PDF Exports per month (No Watermark)', 'Secure Backup'] },
      'premium_yearly': { name: 'Premium', price: '$120', period: '/year', features: ['All Sections with Uploads', 'Unlimited PDF Exports', 'Priority Support (24hr response)', 'Section 12 & 16 File Uploads'] }
    };
    return plans[planId as keyof typeof plans] || plans.standard_monthly;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerEmail || !planId) {
      toast({
        title: 'Missing Information',
        description: 'Please provide your email address.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    setPaymentStep('processing');

    try {
      // Simulate Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // In a real implementation, this would be:
      // 1. Create Stripe checkout session
      // 2. Redirect to Stripe hosted checkout
      // 3. Handle webhook for successful payment
      // 4. Send welcome email with credentials

      // For demo purposes, simulate successful payment
      const success = await processPayment(customerEmail, planId);
      
      if (success) {
        setPaymentStep('success');
        onPaymentSuccess(customerEmail, planId);
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      toast({
        title: 'Payment Error',
        description: 'There was an error processing your payment. Please try again.',
        variant: 'destructive'
      });
      setPaymentStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  const processPayment = async (email: string, plan: string): Promise<boolean> => {
    try {
      // Step 1: Create Stripe checkout session
      const planPricing = getPlanPricing(plan);
      const checkoutResult = await createCheckoutSession({
        amount: planPricing.amount,
        currency: planPricing.currency,
        email: email,
        planId: plan,
        successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(email)}`,
        cancelUrl: `${window.location.origin}/pricing`
      });

      if (!checkoutResult.success) {
        throw new Error(checkoutResult.error || 'Failed to create checkout session');
      }

      // Step 2: Redirect to Stripe hosted checkout
      if (checkoutResult.sessionUrl) {
        window.location.href = checkoutResult.sessionUrl;
        return true;
      } else {
        throw new Error('No checkout session URL received');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return false;
    }
  };

  const getPlanAmount = (planId: string): number => {
    const amounts = {
      'lite_monthly': 400, // $4.00 in cents
      'standard_monthly': 800,
      'premium_monthly': 1200,
      'lifetime': 19900,
      'lite_yearly': 4000,
      'standard_yearly': 8000,
      'premium_yearly': 12000
    };
    return amounts[planId as keyof typeof amounts] || 800;
  };

  if (!planDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (paymentStep === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
            <p className="text-gray-600">Please wait while we process your payment securely...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for your purchase. You will receive an email with your login credentials shortly.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="flex items-center mb-2">
                <Mail className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Check Your Email</span>
              </div>
              <p className="text-sm text-blue-700">
                We've sent login instructions to: <strong>{customerEmail}</strong>
              </p>
            </div>
            <Button 
              onClick={() => navigate('/')}
              className="w-full"
              style={{ backgroundColor: '#E4B64A', color: 'white' }}
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo />
            <Button 
              variant="outline" 
              onClick={() => navigate('/pricing')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Plans
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Complete Your Purchase
                </CardTitle>
                <p className="text-gray-600">
                  Enter your email to proceed to secure payment processing.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-red-600 font-bold text-center">
                      This email will be used for your primary account and payment confirmation.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !customerEmail}
                    className="w-full py-3 text-lg font-semibold"
                    style={{
                      backgroundColor: '#17394B',
                      color: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 4px 16px rgba(23, 57, 75, 0.3)',
                      border: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1a4a5f';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(23, 57, 75, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#17394B';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(23, 57, 75, 0.3)';
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Proceed to Payment
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Plan Summary */}
          <div>
            <Card className="shadow-lg h-fit">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Plan Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-900">{planDetails.name}</h3>
                    <div className="text-right">
                      <span className="text-2xl font-bold" style={{ color: '#E3B549' }}>
                        {planDetails.price}
                      </span>
                      <span className="text-gray-500">{planDetails.period}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">What's Included:</h4>
                  {planDetails.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900">Secure Payment</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Your payment is processed securely through Stripe. 
                        You'll receive a confirmation email after successful payment.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPortal; 