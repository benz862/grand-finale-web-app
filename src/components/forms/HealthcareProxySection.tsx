import React from 'react';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Textarea } from '../ui/textarea';

interface HealthcareProxySectionProps {
  healthcareProxy: string;
  healthcareProxyContact: string;
  onHealthcareProxyChange: (value: string) => void;
  onHealthcareProxyContactChange: (value: string) => void;
}

const HealthcareProxySection: React.FC<HealthcareProxySectionProps> = ({
  healthcareProxy,
  healthcareProxyContact,
  onHealthcareProxyChange,
  onHealthcareProxyContactChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700">
          Do you have a designated healthcare proxy?
        </Label>
        <RadioGroup value={healthcareProxy} onValueChange={onHealthcareProxyChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Yes" id="healthcare-proxy-yes" />
            <Label htmlFor="healthcare-proxy-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="No" id="healthcare-proxy-no" />
            <Label htmlFor="healthcare-proxy-no">No</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <Label htmlFor="healthcare-proxy-contact" className="text-sm font-medium text-gray-700">
          Name and contact of healthcare proxy
        </Label>
        <Textarea
          id="healthcare-proxy-contact"
          value={healthcareProxyContact}
          onChange={(e) => onHealthcareProxyContactChange(e.target.value)}
          placeholder="Optional but highly recommended"
          className="min-h-[100px] resize-none"
        />
      </div>
    </div>
  );
};

export default HealthcareProxySection;