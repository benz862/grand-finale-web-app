import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface SpecialRequestsSectionProps {
  preferredFlowers: string;
  setPreferredFlowers: (value: string) => void;
  memorialDonations: string;
  setMemorialDonations: (value: string) => void;
  otherRequests: string;
  setOtherRequests: (value: string) => void;
}

const SpecialRequestsSection: React.FC<SpecialRequestsSectionProps> = ({
  preferredFlowers,
  setPreferredFlowers,
  memorialDonations,
  setMemorialDonations,
  otherRequests,
  setOtherRequests,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Special Requests or Instructions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Preferred flower types or arrangements
          </Label>
          <Textarea
            value={preferredFlowers}
            onChange={(e) => setPreferredFlowers(e.target.value)}
            placeholder="Enter preferred flowers or arrangements"
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Charities or causes for memorial donations
          </Label>
          <Textarea
            value={memorialDonations}
            onChange={(e) => setMemorialDonations(e.target.value)}
            placeholder="Enter preferred charities or causes"
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Other special requests (open casket, cultural rituals, etc.)
          </Label>
          <Textarea
            value={otherRequests}
            onChange={(e) => setOtherRequests(e.target.value)}
            placeholder="Enter any other special requests"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SpecialRequestsSection;