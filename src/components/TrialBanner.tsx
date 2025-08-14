import React from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Clock, Crown, AlertTriangle } from 'lucide-react';
import { useTrial } from '../contexts/TrialContext';

const TrialBanner: React.FC = () => {
  const { isTrial, trialDaysLeft, isTrialExpired, upgradeToPaid } = useTrial();

  if (!isTrial) return null;

  if (isTrialExpired) {
    return (
      <Alert className="border-red-200 bg-red-50 mb-4">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-red-800 font-medium">
            Your free trial has expired. Upgrade now to continue your legacy planning.
          </span>
          <Button 
            onClick={upgradeToPaid}
            size="sm"
            style={{ backgroundColor: '#E4B64A', color: 'white' }}
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade Now
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-yellow-200 bg-yellow-50 mb-4">
      <Clock className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <span className="text-yellow-800 font-medium">
            Free Trial - {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} remaining
          </span>
          <p className="text-yellow-700 text-sm mt-1">
            Access to sections 1-2, read-only section 3. Upgrade to unlock all features.
          </p>
        </div>
        <Button 
          onClick={upgradeToPaid}
          size="sm"
          style={{ backgroundColor: '#E4B64A', color: 'white' }}
        >
          <Crown className="h-4 w-4 mr-2" />
          Upgrade
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default TrialBanner; 