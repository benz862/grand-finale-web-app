import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IdentificationSectionProps {
  driversLicenseNumber: string;
  licenseState: string;
  licenseExpiration: string;
  onDriversLicenseNumberChange: (value: string) => void;
  onLicenseStateChange: (value: string) => void;
  onLicenseExpirationChange: (value: string) => void;
}

const IdentificationSection: React.FC<IdentificationSectionProps> = ({
  driversLicenseNumber,
  licenseState,
  licenseExpiration,
  onDriversLicenseNumberChange,
  onLicenseStateChange,
  onLicenseExpirationChange
}) => {
  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia',
    'Puerto Rico', 'US Virgin Islands', 'Guam', 'American Samoa', 'Northern Mariana Islands'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identification & Citizenship</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="driversLicense">US Driver's License Number</Label>
          <Input
            id="driversLicense"
            value={driversLicenseNumber}
            onChange={(e) => onDriversLicenseNumberChange(e.target.value)}
            placeholder="Enter driver's license number"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="licenseState">State or Territory of Issuance</Label>
          <Select value={licenseState} onValueChange={onLicenseStateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select state or territory" />
            </SelectTrigger>
            <SelectContent>
              {usStates.map((state) => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="licenseExpiration">Expiration Date</Label>
          <Input
            id="licenseExpiration"
            type="date"
            value={licenseExpiration}
            onChange={(e) => onLicenseExpirationChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default IdentificationSection;