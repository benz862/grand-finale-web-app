import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from './ui/use-toast';

interface PricingPlan {
  name: string;
  price: string;
  originalPrice: string;
  savings: string;
  features: string[];
  popular?: boolean;
  priceId: string;
}

const couplesPlans: PricingPlan[] = [
  {
    name: "Lite Couples",
    price: "$7",
    originalPrice: "$8",
    savings: "15% Savings",
    priceId: "price_1Rok5LE6oTidvpnUSQB2GMCw", // Real Stripe Price ID
    features: [
      "TWO separate accounts",
      "Complete privacy between partners",
      "Access to ALL Sections for both",
      "Section 12: Letters w/ Upload",
      "Section 16: File Uploads",
      "Unlimited PDF Exports",
      "Data Storage (Supabase)",
      "Secure Backup",
      "Priority Support (24hr Response)",
      "Access to Updates"
    ]
  },
  {
    name: "Standard Couples",
    price: "$14",
    originalPrice: "$16",
    savings: "15% Savings",
    priceId: "price_1Rok6AE6oTidvpnUHjp4lPXT", // Real Stripe Price ID
    features: [
      "TWO separate accounts",
      "Complete privacy between partners",
      "Access to ALL Sections for both",
      "Section 12: Letters w/ Upload",
      "Section 16: File Uploads",
      "Unlimited PDF Exports",
      "Data Storage (Supabase)",
      "Secure Backup",
      "Priority Support (24hr Response)",
      "Access to Updates"
    ]
  },
  {
    name: "Premium Couples",
    price: "$20",
    originalPrice: "$24",
    savings: "15% Savings",
    priceId: "price_1RokFkE6oTidvpnUOd5lfhuu", // Real Stripe Price ID
    popular: true,
    features: [
      "TWO separate accounts",
      "Complete privacy between partners",
      "Access to ALL Sections for both",
      "Section 12: Letters w/ Upload",
      "Section 16: File Uploads",
      "Unlimited PDF Exports",
      "Data Storage (Supabase)",
      "Secure Backup",
      "Priority Support (24hr Response)",
      "Access to Updates"
    ]
  },
  {
    name: "Lite Couples Yearly",
    price: "$70",
    originalPrice: "$80",
    savings: "15% Savings",
    priceId: "price_1RokHAE6oTidvpnUnzBNHLNn", // Real Stripe Price ID
    features: [
      "TWO separate accounts",
      "Complete privacy between partners",
      "Access to ALL Sections for both",
      "Section 12: Letters w/ Upload",
      "Section 16: File Uploads",
      "Unlimited PDF Exports",
      "Data Storage (Supabase)",
      "Secure Backup",
      "Priority Support (24hr Response)",
      "Access to Updates",
      "2 months free (billed annually)"
    ]
  },
  {
    name: "Standard Couples Yearly",
    price: "$140",
    originalPrice: "$160",
    savings: "15% Savings",
    priceId: "price_1RokJAE6oTidvpnUeqfK3JDN", // Real Stripe Price ID
    features: [
      "TWO separate accounts",
      "Complete privacy between partners",
      "Access to ALL Sections for both",
      "Section 12: Letters w/ Upload",
      "Section 16: File Uploads",
      "Unlimited PDF Exports",
      "Data Storage (Supabase)",
      "Secure Backup",
      "Priority Support (24hr Response)",
      "Access to Updates",
      "2 months free (billed annually)"
    ]
  },
  {
    name: "Premium Couples Yearly",
    price: "$200",
    originalPrice: "$240",
    savings: "15% Savings",
    priceId: "price_1RokJtE6oTidvpnUFh8Kocvj", // Real Stripe Price ID
    features: [
      "TWO separate accounts",
      "Complete privacy between partners",
      "Access to ALL Sections for both",
      "Section 12: Letters w/ Upload",
      "Section 16: File Uploads",
      "Unlimited PDF Exports",
      "Data Storage (Supabase)",
      "Secure Backup",
      "Priority Support (24hr Response)",
      "Access to Updates",
      "2 months free (billed annually)"
    ]
  },
  {
    name: "Lifetime Couples",
    price: "$340",
    originalPrice: "$400",
    savings: "15% Savings",
    priceId: "price_1Rok3hE6oTidvpnUNU4SHFSA", // Real Stripe Price ID
    features: [
      "TWO separate accounts",
      "Complete privacy between partners",
      "Access to ALL Sections for both",
      "Section 12: Letters w/ Upload",
      "Section 16: File Uploads",
      "Unlimited PDF Exports",
      "Data Storage (Supabase)",
      "Secure Backup",
      "Priority Support (24hr Response)",
      "Lifetime Access & Updates",
      "No recurring payments"
    ]
  }
];

export default function CouplesPricingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCouplesBundlePurchase = async (plan: PricingPlan) => {
    setIsLoading(plan.priceId);

    try {
      // Redirect to payment portal with plan ID (same approach as individual plans)
      window.location.href = `/couples-payment?plan=${plan.priceId}&name=${encodeURIComponent(plan.name)}`;
    } catch (error) {
      console.error('Navigation error:', error);
      toast({
        title: "Error",
        description: "Unable to navigate to payment page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Couples Bundle Plans
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get two separate, private accounts for you and your partner. 
            Plan together while maintaining individual privacy and security.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="space-y-12">
          {/* Monthly Plans */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Monthly Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {couplesPlans.filter(plan => !plan.name.includes('Yearly') && !plan.name.includes('Lifetime')).map((plan) => (
                <Card
                  key={plan.priceId}
                  className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}
                  style={{
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                  }}
                >
                  {plan.popular && (
                    <Badge 
                      className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10"
                      style={{ backgroundColor: '#17394B', color: 'white' }}
                    >
                      Most Popular
                    </Badge>
                  )}

                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {plan.name}
                    </CardTitle>
                    <div className="mt-4">
                      <span className="text-2xl font-bold" style={{ color: '#E3B549' }}>
                        {plan.price}
                      </span>
                      <span className="text-gray-500"> /mo</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      <span className="text-sm text-gray-500 line-through">
                        {plan.originalPrice}/mo
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {plan.savings}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <span className="text-green-500 text-lg">✓</span>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleCouplesBundlePurchase(plan)}
                      disabled={isLoading === plan.priceId}
                      className="w-full py-3 text-lg font-semibold mt-6"
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
                      {isLoading === plan.priceId ? 'Loading...' : `Get ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Yearly Plans */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Yearly Plans <span className="text-sm font-normal text-green-600">(Save 2 months)</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {couplesPlans.filter(plan => plan.name.includes('Yearly')).map((plan) => (
                <Card
                  key={plan.priceId}
                  className="relative"
                  style={{
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                  }}
                >
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {plan.name}
                    </CardTitle>
                    <div className="mt-4">
                      <span className="text-2xl font-bold" style={{ color: '#E3B549' }}>
                        {plan.price}
                      </span>
                      <span className="text-gray-500"> /year</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      <span className="text-sm text-gray-500 line-through">
                        {plan.originalPrice}/year
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {plan.savings}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <span className="text-green-500 text-lg">✓</span>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleCouplesBundlePurchase(plan)}
                      disabled={isLoading === plan.priceId}
                      className="w-full py-3 text-lg font-semibold mt-6"
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
                      {isLoading === plan.priceId ? 'Loading...' : `Get ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Lifetime Plan */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Lifetime Plan</h2>
            <div className="max-w-md mx-auto">
              {couplesPlans.filter(plan => plan.name.includes('Lifetime')).map((plan) => (
                <Card
                  key={plan.priceId}
                  className="relative"
                  style={{
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                  }}
                >
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {plan.name}
                    </CardTitle>
                    <div className="mt-4">
                      <span className="text-2xl font-bold" style={{ color: '#E3B549' }}>
                        {plan.price}
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      <span className="text-sm text-gray-500 line-through">
                        {plan.originalPrice}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {plan.savings}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <span className="text-green-500 text-lg">✓</span>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleCouplesBundlePurchase(plan)}
                      disabled={isLoading === plan.priceId}
                      className="w-full py-3 text-lg font-semibold mt-6"
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
                      {isLoading === plan.priceId ? 'Loading...' : `Get ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>



        {/* Back to Pricing */}
        <div className="text-center mt-8">
          <Button
            onClick={() => window.location.href = '/pricing'}
            variant="outline"
            className="px-8 py-3"
            style={{
              borderRadius: '12px',
              border: '2px solid #17394B',
              color: '#17394B',
              backgroundColor: 'transparent'
            }}
          >
            Back to All Plans
          </Button>
        </div>

        {/* Support Contact */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Questions about couples bundles? Contact us at{' '}
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
} 