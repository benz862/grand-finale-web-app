import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import Logo from './Logo';

const CouplesSuccessPage: React.FC = () => {
  const customerName = "John Doe";
  const partnerName = "Jane Smith";
  const inviteLink = "https://thegrandfinale.com/register-partner/cb_123456789/demo-token";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo />
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">Couples Bundle</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="neumorphic-card p-8 mb-8 max-w-2xl mx-auto bg-white border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Couples Bundle Purchased!
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Congratulations, {customerName}! You now have access to The Grand Finale Couples Bundle.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                Two Accounts
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Private & Secure
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Complete Access
              </Badge>
            </div>
          </div>
        </div>

        {/* What You've Purchased */}
        <div className="neumorphic-card p-6 mb-8 max-w-2xl mx-auto bg-white border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What You've Purchased</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="font-medium">Two Complete Accounts</span>
                <p className="text-sm text-gray-600">Separate, private accounts for both partners</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="font-medium">Full Legacy Planning</span>
                <p className="text-sm text-gray-600">All 16 sections available for each person</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="font-medium">Lifetime Access</span>
                <p className="text-sm text-gray-600">No recurring fees, access forever</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="font-medium">Secure & Private</span>
                <p className="text-sm text-gray-600">Each account is completely separate</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="font-medium">Document Storage</span>
                <p className="text-sm text-gray-600">Upload and store important documents</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invite Your Partner */}
        <div className="neumorphic-card p-6 mb-8 max-w-2xl mx-auto bg-white border border-gray-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Invite Your Partner
            </h2>
            <p className="text-gray-600">
              Share this invitation with {partnerName} so they can access their private account.
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 mb-1">Partner Invitation Link</p>
                <p className="text-sm text-gray-500 break-all">{inviteLink}</p>
              </div>
              <Button
                onClick={() => navigator.clipboard.writeText(inviteLink)}
                variant="outline"
                size="sm"
                className="ml-4 flex-shrink-0"
              >
                Copy Link
              </Button>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <Button
              onClick={() => window.open(`mailto:?subject=You're invited to join The Grand Finale Couples Bundle!&body=Hi ${partnerName}! I've purchased a Couples Bundle for The Grand Finale. Here's your invitation link: ${inviteLink}`)}
              size="lg"
              className="px-8 py-3 text-lg"
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
              Email Invitation to {partnerName}
            </Button>
            
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => window.location.href = '/app'}>
                Start My Planning
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/couples-pricing'}>
                View Couples Plans
              </Button>
            </div>
          </div>
        </div>

        {/* Bundle Details */}
        <div className="neumorphic-card p-6 mb-8 max-w-2xl mx-auto bg-white border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Bundle Details</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-1">Bundle ID</h3>
              <p className="text-sm text-gray-600">cb_123456789</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-1">Purchased By</h3>
              <p className="text-sm text-gray-600">{customerName}</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-1">Purchase Date</h3>
              <p className="text-sm text-gray-600">December 25, 2024</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => window.location.href = '/app'}
              size="lg"
              className="px-8 py-3"
              style={{
                backgroundColor: '#E3B549',
                color: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(227, 181, 73, 0.3)',
                border: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#d4a940';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(227, 181, 73, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#E3B549';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(227, 181, 73, 0.3)';
              }}
            >
              Access My Account
            </Button>
          </div>
          
          <p className="text-sm text-gray-500">
            Need help? Contact our support team for assistance with your couples bundle.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CouplesSuccessPage; 