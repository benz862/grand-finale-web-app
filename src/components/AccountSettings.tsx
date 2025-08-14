import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './ui/use-toast';
import { supabase } from '../lib/supabase';
import { User, Shield, Mail, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AccountSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update user metadata in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
        }
      });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error('Update profile error:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsPasswordLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
        variant: "default",
      });

      // Clear password form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Change password error:', error);
      toast({
        title: "Password Change Failed",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/app')}
            className="mb-4 flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to App</span>
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account information and security settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card style={{
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" style={{ color: '#17394B' }} />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
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
                    value={formData.email}
                    disabled
                    className="mt-1 bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email address cannot be changed. Contact support if needed.
                  </p>
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                  style={{
                    backgroundColor: '#17394B',
                    color: 'white',
                    borderRadius: '12px',
                    border: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1a4a5f';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#17394B';
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Update Profile</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card style={{
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" style={{ color: '#17394B' }} />
                <span>Change Password</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="mt-1"
                    placeholder="Enter new password"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 6 characters long
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="mt-1"
                    placeholder="Confirm new password"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isPasswordLoading || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="w-full"
                  style={{
                    backgroundColor: '#E3B549',
                    color: '#000',
                    borderRadius: '12px',
                    border: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#d4a200';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#E3B549';
                  }}
                >
                  {isPasswordLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                      <span>Changing Password...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>Change Password</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Additional Settings */}
        <Card className="mt-8" style={{
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
        }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" style={{ color: '#17394B' }} />
              <span>Additional Settings</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-600">
                  Receive updates about your account and important changes
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                style={{
                  borderRadius: '8px',
                  border: '2px solid #17394B',
                  color: '#17394B',
                  backgroundColor: 'transparent'
                }}
              >
                Manage
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Data Export</h3>
                <p className="text-sm text-gray-600">
                  Download all your data in a secure format
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                style={{
                  borderRadius: '8px',
                  border: '2px solid #17394B',
                  color: '#17394B',
                  backgroundColor: 'transparent'
                }}
              >
                Export
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Account Deletion</h3>
                <p className="text-sm text-gray-600">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
                style={{ borderRadius: '8px' }}
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 