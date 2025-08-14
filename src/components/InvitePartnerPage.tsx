import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from './ui/use-toast';
import { useSearchParams } from 'react-router-dom';

interface BundleInfo {
  id: string;
  plan_type: string;
  primary_user_email: string;
  secondary_invite_email?: string;
  status: 'pending' | 'active';
  created_at: string;
}

export default function InvitePartnerPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [bundleInfo, setBundleInfo] = useState<BundleInfo | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!sessionId) {
      toast({
        title: "Error",
        description: "No session ID found. Please complete your purchase first.",
        variant: "destructive",
      });
      return;
    }

    fetchBundleInfo();
  }, [sessionId, toast]);

  const fetchBundleInfo = async () => {
    try {
      const response = await fetch(`/api/bundle/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setBundleInfo(data);
        
        if (data.secondary_invite_email) {
          setPartnerEmail(data.secondary_invite_email);
          setInviteSent(true);
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to load bundle information.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching bundle info:', error);
      toast({
        title: "Error",
        description: "Failed to load bundle information.",
        variant: "destructive",
      });
    }
  };

  const handleSendInvite = async () => {
    if (!partnerEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your partner's email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/send-partner-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          partnerEmail,
        }),
      });

      if (response.ok) {
        toast({
          title: "Invite Sent!",
          description: "Your partner will receive an email with instructions to create their account.",
          variant: "default",
        });
        setInviteSent(true);
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to send invite",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Send invite error:', error);
      toast({
        title: "Error",
        description: "Failed to send invite. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendInvite = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/resend-partner-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
        }),
      });

      if (response.ok) {
        toast({
          title: "Invite Resent!",
          description: "A new invitation has been sent to your partner.",
          variant: "default",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to resend invite",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Resend invite error:', error);
      toast({
        title: "Error",
        description: "Failed to resend invite. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanDisplayName = (planType: string) => {
    const planMap: Record<string, string> = {
      'price_1Rok3hE6oTidvpnUNU4SHFSA': 'Lifetime Couples',
      'price_1Rok5LE6oTidvpnUSQB2GMCw': 'Lite Couples Monthly',
      'price_1Rok6AE6oTidvpnUHjp4lPXT': 'Standard Couples Monthly',
      'price_1RokFkE6oTidvpnUOd5lfhuu': 'Premium Couples Monthly',
      'price_1RokHAE6oTidvpnUnzBNHLNn': 'Lite Couples Yearly',
      'price_1RokJAE6oTidvpnUeqfK3JDN': 'Standard Couples Yearly',
      'price_1RokJtE6oTidvpnUFh8Kocvj': 'Premium Couples Yearly',
    };
    return planMap[planType] || planType;
  };

  if (!bundleInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading bundle information...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card style={{
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
        }}>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Invite Your Partner
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Your Couples Bundle purchase was successful! Now invite your partner to create their own private account.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Bundle Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Bundle Details</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Plan:</strong> {getPlanDisplayName(bundleInfo.plan_type)}</p>
                <p><strong>Primary Email:</strong> {bundleInfo.primary_user_email}</p>
                <p><strong>Status:</strong> {bundleInfo.status === 'active' ? 'Active' : 'Pending Partner Registration'}</p>
              </div>
            </div>

            {!inviteSent ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="partner-email" className="text-sm font-medium text-gray-700">
                    Partner's Email Address
                  </Label>
                  <Input
                    id="partner-email"
                    type="email"
                    placeholder="partner@example.com"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Your partner will receive an email with a secure link to create their account.
                  </p>
                </div>

                <Button
                  onClick={handleSendInvite}
                  disabled={isLoading || !partnerEmail}
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
                  {isLoading ? 'Sending Invite...' : 'Send Invite'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500 text-lg">✓</span>
                    <div>
                      <h3 className="font-semibold text-green-800">Invite Sent Successfully!</h3>
                      <p className="text-green-700 text-sm">
                        An invitation has been sent to {partnerEmail}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">What happens next?</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-500">1.</span>
                      <span>Your partner receives an email with a secure registration link</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-500">2.</span>
                      <span>They click the link and create their own private account</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-500">3.</span>
                      <span>Once both accounts are active, you can start planning together</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleResendInvite}
                    disabled={isLoading}
                    variant="outline"
                    className="flex-1"
                    style={{
                      borderRadius: '12px',
                      border: '2px solid #17394B',
                      color: '#17394B',
                      backgroundColor: 'transparent'
                    }}
                  >
                    {isLoading ? 'Resending...' : 'Resend Invite'}
                  </Button>
                  
                  <Button
                    onClick={() => window.location.href = '/app'}
                    className="flex-1"
                    style={{
                      backgroundColor: '#E3B549',
                      color: '#000',
                      borderRadius: '12px',
                      border: 'none'
                    }}
                  >
                    Go to App
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 