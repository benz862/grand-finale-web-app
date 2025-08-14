import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface PharmacyInfo {
  name: string;
  location: string;
  phone: string;
}

interface PharmacySectionProps {
  pharmacy: PharmacyInfo;
  onUpdate: (pharmacy: PharmacyInfo) => void;
}

const PharmacySection: React.FC<PharmacySectionProps> = ({ pharmacy, onUpdate }) => {
  const handleChange = (field: keyof PharmacyInfo, value: string) => {
    onUpdate({ ...pharmacy, [field]: value });
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader>
        <CardTitle className="text-lg">Pharmacy Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pharmacy-name">Pharmacy Name</Label>
          <Input
            id="pharmacy-name"
            value={pharmacy.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="CVS Pharmacy"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pharmacy-location">Location/Address</Label>
          <Textarea
            id="pharmacy-location"
            value={pharmacy.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="123 Main Street, City, State 12345"
            className="min-h-[80px] resize-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pharmacy-phone">Phone Number</Label>
          <Input
            id="pharmacy-phone"
            value={pharmacy.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PharmacySection;