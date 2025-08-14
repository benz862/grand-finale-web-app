import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './ui/use-toast';

export default function ManageBilling() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleManageBilling = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to manage your billing.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: user.stripe_customer_id,
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to create billing portal session",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Manage billing error:', error);
      toast({
        title: "Error",
        description: "Failed to access billing portal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto" style={{
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
    }}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Manage Billing
        </CardTitle>
        <p className="text-gray-600 mt-2">
          Update your payment method, view invoices, and manage your subscription
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: '#fef3c7' }}>
            <span className="text-lg">💳</span>
            <div>
              <p className="font-medium text-gray-900">Payment Methods</p>
              <p className="text-sm text-gray-600">Update your credit card or add new payment methods</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: '#fef3c7' }}>
            <span className="text-lg">📄</span>
            <div>
              <p className="font-medium text-gray-900">Billing History</p>
              <p className="text-sm text-gray-600">View and download your past invoices</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: '#fef3c7' }}>
            <span className="text-lg">🔄</span>
            <div>
              <p className="font-medium text-gray-900">Subscription Changes</p>
              <p className="text-sm text-gray-600">Upgrade, downgrade, or cancel your plan</p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleManageBilling}
          disabled={isLoading}
          className="w-full py-3 text-lg font-semibold"
          style={{
            backgroundColor: '#e4b200',
            color: '#000',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(228, 178, 0, 0.3)',
            border: 'none',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#d4a200';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(228, 178, 0, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#e4b200';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(228, 178, 0, 0.3)';
          }}
        >
          {isLoading ? 'Loading...' : 'Manage Billing'}
        </Button>
        
        <p className="text-xs text-gray-500 text-center">
          You'll be redirected to Stripe's secure billing portal
        </p>
      </CardContent>
    </Card>
  );
} 