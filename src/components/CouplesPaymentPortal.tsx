import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, CreditCard, Mail, Shield, ArrowLeft, Loader2 } from 'lucide-react';
import Logo from './Logo';

interface CouplesPaymentPortalProps {
  onPaymentSuccess: (email: string, planId: string) => void;
}

const CouplesPaymentPortal: React.FC<CouplesPaymentPortalProps> = ({ onPaymentSuccess }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success'>('form');
  const [customerEmail, setCustomerEmail] = useState('');
  const [planId, setPlanId] = useState('');
  const [planName, setPlanName] = useState('');
  const [planDetails, setPlanDetails] = useState<any>(null);

  // Get plan details from URL params
  useEffect(() => {
    const plan = searchParams.get('plan');
    const name = searchParams.get('name');
    if (plan) {
      setPlanId(plan);
      setPlanName(name || '');
      const planData = getPlanDetails(plan);
      setPlanDetails(planData);
    }
  }, [searchParams]);

  const getPlanDetails = (planId: string) => {
    const plans = {
      'price_1Rok5LE6oTidvpnUSQB2GMCw': { name: 'Lite Couples', price: '$7', period: '/month', features: ['TWO separate accounts', 'Complete privacy between partners', 'Access to ALL Sections for both', 'Section 12: Letters w/ Upload', 'Section 16: File Uploads', 'Unlimited PDF Exports', 'Data Storage (Supabase)', 'Secure Backup', 'Priority Support (24hr Response)', 'Access to Updates'] },
      'price_1Rok6AE6oTidvpnUHjp4lPXT': { name: 'Standard Couples', price: '$14', period: '/month', features: ['TWO separate accounts', 'Complete privacy between partners', 'Access to ALL Sections for both', 'Section 12: Letters w/ Upload', 'Section 16: File Uploads', 'Unlimited PDF Exports', 'Data Storage (Supabase)', 'Secure Backup', 'Priority Support (24hr Response)', 'Access to Updates'] },
      'price_1RokFkE6oTidvpnUOd5lfhuu': { name: 'Premium Couples', price: '$20', period: '/month', features: ['TWO separate accounts', 'Complete privacy between partners', 'Access to ALL Sections for both', 'Section 12: Letters w/ Upload', 'Section 16: File Uploads', 'Unlimited PDF Exports', 'Data Storage (Supabase)', 'Secure Backup', 'Priority Support (24hr Response)', 'Access to Updates'] },
      'price_1RokHAE6oTidvpnUnzBNHLNn': { name: 'Lite Couples Yearly', price: '$70', period: '/year', features: ['TWO separate accounts', 'Complete privacy between partners', 'Access to ALL Sections for both', 'Section 12: Letters w/ Upload', 'Section 16: File Uploads', 'Unlimited PDF Exports', 'Data Storage (Supabase)', 'Secure Backup', 'Priority Support (24hr Response)', 'Access to Updates', '2 months free (billed annually)'] },
      'price_1RokJAE6oTidvpnUeqfK3JDN': { name: 'Standard Couples Yearly', price: '$140', period: '/year', features: ['TWO separate accounts', 'Complete privacy between partners', 'Access to ALL Sections for both', 'Section 12: Letters w/ Upload', 'Section 16: File Uploads', 'Unlimited PDF Exports', 'Data Storage (Supabase)', 'Secure Backup', 'Priority Support (24hr Response)', 'Access to Updates', '2 months free (billed annually)'] },
      'price_1RokJtE6oTidvpnUFh8Kocvj': { name: 'Premium Couples Yearly', price: '$200', period: '/year', features: ['TWO separate accounts', 'Complete privacy between partners', 'Access to ALL Sections for both', 'Section 12: Letters w/ Upload', 'Section 16: File Uploads', 'Unlimited PDF Exports', 'Data Storage (Supabase)', 'Secure Backup', 'Priority Support (24hr Response)', 'Access to Updates', '2 months free (billed annually)'] },
      'price_1Rok3hE6oTidvpnUNU4SHFSA': { name: 'Lifetime Couples', price: '$340', period: ' one-time', features: ['TWO separate accounts', 'Complete privacy between partners', 'Access to ALL Sections for both', 'Section 12: Letters w/ Upload', 'Section 16: File Uploads', 'Unlimited PDF Exports', 'Data Storage (Supabase)', 'Secure Backup', 'Priority Support (24hr Response)', 'Lifetime Access & Updates', 'No recurring payments'] }
    };
    return plans[planId as keyof typeof plans] || plans['price_1Rok6AE6oTidvpnUHjp4lPXT'];
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
      // Call the couples bundle API
      const response = await fetch('http://localhost:4242/create-couples-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: planId,
          email: customerEmail,
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Error',
        description: error instanceof Error ? error.message : 'There was an error processing your payment. Please try again.',
        variant: 'destructive'
      });
      setPaymentStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  if (!planDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading plan details...</p>
        </div>
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
              onClick={() => navigate('/couples-pricing')}
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
                  Complete Your Couples Bundle Purchase
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
                    <p className="text-xs text-gray-500">
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

export default CouplesPaymentPortal; 