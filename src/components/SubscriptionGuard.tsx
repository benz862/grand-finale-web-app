import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ManageBilling from './ManageBilling';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export default function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isBlocked, setIsBlocked] = useState(false);
  const [showBilling, setShowBilling] = useState(false);

  useEffect(() => {
    if (!user) return;

    const checkSubscriptionStatus = () => {
      const now = new Date();
      
      // DEVELOPMENT MODE: Allow all users to access the app
      // Skip subscription checks for development/testing
      setIsBlocked(false);
      return;
      
      // Check if subscription is inactive (immediate block)
      if (user.subscription_status === 'inactive') {
        setIsBlocked(true);
        toast({
          title: "Subscription Inactive",
          description: "Your subscription has been cancelled. Please reactivate to continue.",
          variant: "destructive",
        });
        return;
      }

      // Check if subscription is past_due and grace period has expired
      if (user.subscription_status === 'past_due' && user.subscription_grace_expires) {
        const graceExpires = new Date(user.subscription_grace_expires);
        
        if (now > graceExpires) {
          setIsBlocked(true);
          toast({
            title: "Payment Required",
            description: "Your grace period has expired. Please update your payment method to continue.",
            variant: "destructive",
          });
          return;
        } else {
          // Still in grace period - show warning but allow access
          const daysLeft = Math.ceil((graceExpires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          toast({
            title: "Payment Overdue",
            description: `Your payment is overdue. You have ${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining in your grace period.`,
            variant: "default",
          });
        }
      }

      // Subscription is active or still in grace period
      setIsBlocked(false);
    };

    checkSubscriptionStatus();
  }, [user, toast]);

  if (!user) {
    return <>{children}</>;
  }

  if (isBlocked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md" style={{
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
        }}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {user.subscription_status === 'inactive' ? 'Subscription Cancelled' : 'Payment Required'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-3">
              <div className="text-6xl mb-4">
                {user.subscription_status === 'inactive' ? '🚫' : '⚠️'}
              </div>
              
              <p className="text-gray-600">
                {user.subscription_status === 'inactive' 
                  ? "Your subscription has been cancelled. To continue using The Grand Finale, please reactivate your subscription."
                  : "Your payment method needs to be updated. Please update your billing information to continue."
                }
              </p>
            </div>

            {showBilling ? (
              <ManageBilling />
            ) : (
              <div className="space-y-3">
                <Button
                  onClick={() => setShowBilling(true)}
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
                  {user.subscription_status === 'inactive' ? 'Reactivate Subscription' : 'Update Payment Method'}
                </Button>
                
                {user.subscription_status === 'inactive' && (
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/pricing'}
                    className="w-full py-3"
                    style={{
                      borderRadius: '12px',
                      border: '2px solid #e4b200',
                      color: '#e4b200',
                      backgroundColor: 'transparent'
                    }}
                  >
                    View Plans
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
} 