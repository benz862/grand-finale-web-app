import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { PenTool } from 'lucide-react';

interface DigitalSignatureSectionProps {
  signatureName: string;
  signatureDate: string;
  signatureConsent: boolean;
  onSignatureNameChange: (value: string) => void;
  onSignatureDateChange: (value: string) => void;
  onSignatureConsentChange: (value: boolean) => void;
}

const DigitalSignatureSection: React.FC<DigitalSignatureSectionProps> = ({
  signatureName,
  signatureDate,
  signatureConsent,
  onSignatureNameChange,
  onSignatureDateChange,
  onSignatureConsentChange
}) => {
  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <PenTool className="h-5 w-5" />
          Digital Signature (Optional)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="signature-name" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="signature-name"
              type="text"
              placeholder="Enter your full legal name"
              value={signatureName}
              onChange={(e) => onSignatureNameChange(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="signature-date" className="text-sm font-medium">
              Today's Date
            </Label>
            <Input
              id="signature-date"
              type="date"
              value={signatureDate}
              onChange={(e) => onSignatureDateChange(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-start space-x-3 p-4 bg-white/50 rounded-lg">
          <Checkbox
            id="signature-consent"
            checked={signatureConsent}
            onCheckedChange={(checked) => onSignatureConsentChange(checked as boolean)}
          />
          <label
            htmlFor="signature-consent"
            className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            This represents my final wishes to the best of my ability.
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

export default DigitalSignatureSection;