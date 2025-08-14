import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Lock, Crown, Star } from 'lucide-react';
import { useTrial } from '../contexts/TrialContext';

interface TrialRestrictionProps {
  sectionTitle: string;
  sectionNumber: number;
  feature?: string;
}

const TrialRestriction: React.FC<TrialRestrictionProps> = ({ 
  sectionTitle, 
  sectionNumber, 
  feature 
}) => {
  const { upgradeToPaid } = useTrial();

  return (
    <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gray-200 rounded-full">
            <Lock className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        <CardTitle className="text-xl font-bold" style={{ color: '#153A4B' }}>
          {feature ? `${feature} Locked` : `Section ${sectionNumber} Locked`}
        </CardTitle>
        <p className="text-gray-600 mt-2">
          {feature 
            ? `${feature} is a premium feature. Upgrade to unlock this functionality.`
            : `${sectionTitle} is not available in the free trial. Upgrade to access all 16 sections.`
          }
        </p>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-semibold mb-2" style={{ color: '#153A4B' }}>
            What's included in the upgrade:
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✅ All 16 legacy planning sections</li>
            <li>✅ Video & audio file uploads</li>
            <li>✅ Clean PDF exports (no watermarks)</li>
            <li>✅ QR code generation</li>
            <li>✅ Cloud storage & backup</li>
            <li>✅ Priority customer support</li>
          </ul>
        </div>
        
        <div className="flex justify-center space-x-3">
          <Button 
            onClick={upgradeToPaid}
            size="lg"
            style={{ backgroundColor: '#E4B64A', color: 'white' }}
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade Now
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.location.href = '/pricing'}
          >
            <Star className="h-4 w-4 mr-2" />
            View Plans
          </Button>
        </div>
        
        <p className="text-xs text-gray-500">
          Free trial includes sections 1-2 and read-only access to section 3
        </p>
      </CardContent>
    </Card>
  );
};

export default TrialRestriction; 