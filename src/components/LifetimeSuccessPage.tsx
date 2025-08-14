import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useToast } from './ui/use-toast';
import Logo from './Logo';

const LifetimeSuccessPage: React.FC = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareableLink = "https://thegrandfinale.com/lifetime-success-demo";
  const customerName = "John Doe";
  const purchaseDate = "December 25, 2024";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Shareable link has been copied to your clipboard.",
        variant: "default",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the link.",
        variant: "destructive",
      });
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent("I've completed my legacy planning with The Grand Finale!");
    const body = encodeURIComponent(`Hi there!

I wanted to share that I've completed my comprehensive legacy planning with The Grand Finale. This is a lifetime membership that covers everything from personal information to final wishes, legal documents, and even digital asset management.

You can see what I've accomplished here: ${shareableLink}

I highly recommend checking it out for yourself or your family. It's a comprehensive solution that gives peace of mind knowing everything is organized and secure.

Best regards,
${customerName}`);
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo />
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">Lifetime Member</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="neumorphic-card p-8 mb-8 max-w-2xl mx-auto bg-white border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Lifetime Membership!
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Congratulations, {customerName}! You now have lifetime access to The Grand Finale.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                Lifetime Access
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Secure & Private
              </Badge>
              <Badge variant="secondary" className="text-sm">
                All Features Unlocked
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* What You've Accomplished */}
          <div className="neumorphic-card p-6 bg-white border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">What You've Accomplished</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Complete Legacy Planning</span>
                  <p className="text-sm text-gray-600">All 16 sections completed and organized</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Personal Information</span>
                  <p className="text-sm text-gray-600">Biographical data, identification, and contact details</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Legal Documents</span>
                  <p className="text-sm text-gray-600">Wills, trusts, power of attorney, and healthcare directives</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Final Wishes</span>
                  <p className="text-sm text-gray-600">Funeral preferences, obituary, and legacy messages</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Digital Assets</span>
                  <p className="text-sm text-gray-600">Online accounts, passwords, and digital legacy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="neumorphic-card p-6 bg-white border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Review Your Information</span>
                  <p className="text-sm text-gray-600">Go through all sections to ensure accuracy</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Share Your Success</span>
                  <p className="text-sm text-gray-600">Let family and friends know about your accomplishment</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Stay Updated</span>
                  <p className="text-sm text-gray-600">Review and update information regularly</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Access Anytime</span>
                  <p className="text-sm text-gray-600">Your information is always available and secure</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Share Your Success */}
        <div className="neumorphic-card p-6 mb-8 max-w-2xl mx-auto bg-white border border-gray-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Share Your Success
            </h2>
            <p className="text-gray-600">
              Let your family and friends know about your accomplishment and encourage them to secure their legacy too.
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 mb-1">Shareable Link</p>
                <p className="text-sm text-gray-500 break-all">{shareableLink}</p>
              </div>
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="sm"
                className="ml-4 flex-shrink-0"
              >
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <Button
              onClick={handleEmailShare}
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
              Email Share
            </Button>
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
            <Button variant="outline" onClick={() => window.location.href = '/pricing'}>
              View Other Plans
            </Button>
          </div>
          
          <p className="text-sm text-gray-500">
            Need help? Contact our support team for assistance with your lifetime membership.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LifetimeSuccessPage; 