import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import Logo from './Logo';

const LifetimeSuccessShareable: React.FC = () => {
  const customerName = "John Doe";
  const purchaseDate = "December 25, 2024";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo />
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">The Grand Finale</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="neumorphic-card p-8 mb-8 max-w-2xl mx-auto bg-white border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Legacy Planning Completed!
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {customerName} has completed their comprehensive legacy planning with The Grand Finale.
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
          {/* What Was Accomplished */}
          <div className="neumorphic-card p-6 bg-white border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">What {customerName} Accomplished</h2>
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

          {/* Why This Matters */}
          <div className="neumorphic-card p-6 bg-white border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Why This Matters</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Peace of Mind</span>
                  <p className="text-sm text-gray-600">Knowing everything is organized and secure</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Family Protection</span>
                  <p className="text-sm text-gray-600">Loved ones won't have to guess your wishes</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Legal Security</span>
                  <p className="text-sm text-gray-600">Proper documentation prevents legal complications</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium">Digital Legacy</span>
                  <p className="text-sm text-gray-600">Online presence and assets are properly managed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="neumorphic-card p-6 mb-8 max-w-2xl mx-auto bg-white border border-gray-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Ready to Secure Your Legacy Too?
            </h2>
            <p className="text-gray-600">
              Join {customerName} and thousands of others who have found peace of mind with The Grand Finale.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Individual Plans</h3>
              <p className="text-sm text-gray-600">
                Complete legacy planning for one person
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Couples Plans</h3>
              <p className="text-sm text-gray-600">
                Separate accounts with complete privacy
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Gift Memberships</h3>
              <p className="text-sm text-gray-600">
                Give the gift of peace of mind
              </p>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <Button
              onClick={() => window.location.href = '/pricing'}
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
              View Plans & Pricing
            </Button>
            
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => window.location.href = '/couples-pricing'}>
                Couples Plans
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Information */}
        <div className="text-center">
          <div className="neumorphic-card p-6 max-w-2xl mx-auto bg-white border border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Shared by:</strong> {customerName} | <strong>Completed:</strong> {purchaseDate}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              This is a shareable page showing what was accomplished with The Grand Finale legacy planning platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifetimeSuccessShareable; 