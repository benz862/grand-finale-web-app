import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FileText, CheckCircle, Lock, ArrowRight, Database, Clock, Crown } from 'lucide-react';
import { useTrial } from '../contexts/TrialContext';
import { getAllSavedFormData, getTrialDataStatus } from '../lib/utils';

const DataStatusCard: React.FC = () => {
  const { isTrial, trialDaysLeft, upgradeToPaid } = useTrial();
  const savedData = getAllSavedFormData();
  const trialStatus = getTrialDataStatus();

  // Count sections with data
  const sectionsWithData = Object.keys(savedData).length;
  const totalSections = 16;

  if (!isTrial) {
    return null; // Don't show for paid users
  }

  return (
    <Card className="neumorphic-card border border-gray-200">
      <CardHeader className="text-center">
        <CardTitle className="font-bold" style={{ color: '#E4B64A', fontSize: '24px' }}>
          <Database className="h-6 w-6 mr-2 inline" />
          Your Trial Data Status
        </CardTitle>
        <p className="text-lg" style={{ color: '#153A4B' }}>
          Track your progress and see what you'll unlock with an upgrade
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#E4B64A' }}>
                {sectionsWithData}
              </div>
              <div className="text-sm" style={{ color: '#153A4B' }}>
                Sections with Data
              </div>
              <div className="text-xs text-gray-600 mt-1">
                out of {totalSections} total
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className="h-5 w-5 mr-1" style={{ color: '#E4B64A' }} />
                <div className="text-3xl font-bold" style={{ color: '#E4B64A' }}>
                  {trialDaysLeft}
                </div>
              </div>
              <div className="text-sm" style={{ color: '#153A4B' }}>
                Days Remaining
              </div>
              <div className="text-xs text-gray-600 mt-1">
                in your free trial
              </div>
            </div>
          </div>
        </div>

        {/* What You Keep */}
        <div>
          <h4 className="font-semibold mb-3" style={{ color: '#153A4B' }}>
            What You'll Keep When You Upgrade
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" style={{ color: '#E4B64A' }} />
              <span className="text-sm text-gray-700">All entered information</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" style={{ color: '#E4B64A' }} />
              <span className="text-sm text-gray-700">Form progress & settings</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" style={{ color: '#E4B64A' }} />
              <span className="text-sm text-gray-700">Audio guide preferences</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" style={{ color: '#E4B64A' }} />
              <span className="text-sm text-gray-700">Account & login access</span>
            </div>
          </div>
        </div>

        {/* Upgrade Benefits */}
        <div className="bg-white p-4 rounded-lg border-2 border-gray-100">
          <h4 className="font-semibold mb-4 text-center" style={{ color: '#153A4B' }}>
            Unlock with Upgrade
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex items-center mb-3">
                <Lock className="h-4 w-4 text-gray-400 mr-2" />
                <span className="font-medium text-gray-600">Currently Locked:</span>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>Sections 4-16 (13 additional sections)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>File & document uploads</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>Clean PDF exports (no watermarks)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>QR code generation for sharing</span>
                </li>
              </ul>
            </div>
            <div>
              <div className="flex items-center mb-3">
                <Crown className="h-4 w-4 mr-2" style={{ color: '#E4B64A' }} />
                <span className="font-medium" style={{ color: '#153A4B' }}>Full Access Includes:</span>
              </div>
              <ul className="space-y-2" style={{ color: '#153A4B' }}>
                <li className="flex items-start">
                  <span style={{ color: '#E4B64A' }} className="mr-2">•</span>
                  <span>Complete 16-section legacy planner</span>
                </li>
                <li className="flex items-start">
                  <span style={{ color: '#E4B64A' }} className="mr-2">•</span>
                  <span>Unlimited file uploads & storage</span>
                </li>
                <li className="flex items-start">
                  <span style={{ color: '#E4B64A' }} className="mr-2">•</span>
                  <span>Professional PDF documents</span>
                </li>
                <li className="flex items-start">
                  <span style={{ color: '#E4B64A' }} className="mr-2">•</span>
                  <span>Priority support & guidance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button 
            onClick={upgradeToPaid}
            size="lg"
            className="neumorphic-button skillbinder_yellow px-8 py-4 text-lg font-bold"
          >
            <Crown className="h-5 w-5 mr-2" />
            Upgrade Now & Keep Your Data
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          
          <p className="text-xs text-center text-gray-500 mt-3">
            Zero data loss • Instant access • 30-day money-back guarantee
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataStatusCard; 