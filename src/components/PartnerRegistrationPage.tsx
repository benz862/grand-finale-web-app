import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from './ui/use-toast';
import { useParams, useNavigate } from 'react-router-dom';

interface InviteInfo {
  bundle_id: string;
  primary_user_email: string;
  plan_type: string;
  invite_email: string;
  expires_at: string;
}

export default function PartnerRegistrationPage() {
  const { bundleId, token } = useParams();
  const navigate = useNavigate();
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (!bundleId || !token) {
      toast({
        title: "Invalid Link",
        description: "This invitation link is invalid or has expired.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    validateInvite();
  }, [bundleId, token, navigate, toast]);

  const validateInvite = async () => {
    try {
      const response = await fetch(`/api/validate-invite/${bundleId}/${token}`);
      
      if (response.ok) {
        const data = await response.json();
        setInviteInfo(data);
        setFormData(prev => ({ ...prev, email: data.invite_email }));
      } else {
        const error = await response.json();
        toast({
          title: "Invalid Invitation",
          description: error.message || "This invitation link is invalid or has expired.",
          variant: "destructive",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Validate invite error:', error);
      toast({
        title: "Error",
        description: "Failed to validate invitation. Please try again.",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setIsValidating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/register-partner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bundleId,
          token,
          userData: {
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
          },
        }),
      });

      if (response.ok) {
        toast({
          title: "Account Created Successfully!",
          description: "Your account has been created and linked to the couples bundle.",
          variant: "default",
        });
        
        // Redirect to login or app after a short delay
        setTimeout(() => {
          navigate('/auth');
        }, 2000);
      } else {
        const error = await response.json();
        toast({
          title: "Registration Failed",
          description: error.message || "Failed to create your account. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: "Failed to create your account. Please try again.",
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

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Validating your invitation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!inviteInfo) {
    return null;
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
              Create Your Account
            </CardTitle>
            <p className="text-gray-600 mt-2">
              You've been invited to join The Grand Finale Couples Bundle. Create your private account to get started.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Invite Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Bundle Information</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Plan:</strong> {getPlanDisplayName(inviteInfo.plan_type)}</p>
                <p><strong>Invited by:</strong> {inviteInfo.primary_user_email}</p>
                <p><strong>Your email:</strong> {inviteInfo.invite_email}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled
                  value={formData.email}
                  className="mt-1 bg-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This email is set by your invitation and cannot be changed.
                </p>
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long.
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
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
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 