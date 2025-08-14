import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function SubscriptionBanner() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  const [showManageBilling, setShowManageBilling] = useState(false);

  useEffect(() => {
    if (!user) return;

    if (user.subscription_status !== 'past_due' || !user.subscription_grace_expires) {
      setIsVisible(false);
      return;
    }

    const now = new Date();
    const graceExpires = new Date(user.subscription_grace_expires);
    
    if (now <= graceExpires) {
      const days = Math.ceil((graceExpires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      setDaysLeft(days);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [user]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-50 border-b border-yellow-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <span className="text-yellow-600 text-lg">⚠️</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                Payment Overdue
              </p>
              <p className="text-sm text-yellow-700">
                Your payment is overdue. You have {daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining in your grace period.
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowManageBilling(true)}
              size="sm"
              style={{
                backgroundColor: '#e4b200',
                color: '#000',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                padding: '8px 16px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#d4a200';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#e4b200';
              }}
            >
              Update Payment
            </Button>
            
            <button
              onClick={() => setIsVisible(false)}
              className="text-yellow-600 hover:text-yellow-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Manage Billing Modal */}
      {showManageBilling && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Manage Billing</h3>
              <button
                onClick={() => setShowManageBilling(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Update your payment method to avoid losing access to The Grand Finale.
              </p>
              
              <Button
                onClick={() => {
                  window.location.href = '/manage-billing';
                }}
                className="w-full"
                style={{
                  backgroundColor: '#e4b200',
                  color: '#000',
                  borderRadius: '8px',
                  border: 'none'
                }}
              >
                Open Billing Portal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 