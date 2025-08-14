import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getIdentificationLabel, getIdentificationPlaceholder } from '@/lib/countryIdentification';

interface BiographicalDataSectionProps {
  sinSsn: string;
  govIdType: string;
  govIdNumber: string;
  govIdIssuer: string;
  govIdExpiry: string;
  onSinSsnChange: (value: string) => void;
  onGovIdTypeChange: (value: string) => void;
  onGovIdNumberChange: (value: string) => void;
  onGovIdIssuerChange: (value: string) => void;
  onGovIdExpiryChange: (value: string) => void;
  userCountry?: string; // Add country prop for dynamic labels
}

const BiographicalDataSection: React.FC<BiographicalDataSectionProps> = ({
  sinSsn,
  govIdType,
  govIdNumber,
  govIdIssuer,
  govIdExpiry,
  onSinSsnChange,
  onGovIdTypeChange,
  onGovIdNumberChange,
  onGovIdIssuerChange,
  onGovIdExpiryChange,
  userCountry = 'United States', // Default to United States
}) => {
  // Get the appropriate identification label and placeholder based on user's country
  const identificationLabel = getIdentificationLabel(userCountry);
  const identificationPlaceholder = getIdentificationPlaceholder(userCountry);
  
  const formatSinSsn = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,2})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join('-');
    }
    return value;
  };

  const handleSinSsnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSinSsn(e.target.value);
    onSinSsnChange(formatted);
  };

  const idTypes = [
    'Driver\'s License',
    'Passport',
    'State ID',
    'National ID',
    'Other'
  ];

  return (
    <Card className="mb-6 shadow-lg border-2 border-green-200">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
        <CardTitle className="text-green-800">Additional Biographical Data</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sinSsn" className="text-sm font-medium text-gray-700">
            {identificationLabel}
          </Label>
          <Input
            id="sinSsn"
            value={sinSsn}
            onChange={handleSinSsnChange}
            className="border-green-300 focus:border-green-500"
            placeholder={identificationPlaceholder}
            maxLength={11}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="govIdType" className="text-sm font-medium text-gray-700">
            Government-issued ID (driver's license, passport)
          </Label>
          <Select value={govIdType} onValueChange={onGovIdTypeChange}>
            <SelectTrigger className="border-green-300 focus:border-green-500">
              <SelectValue placeholder="Select ID type" />
            </SelectTrigger>
            <SelectContent>
              {idTypes.map((type) => (
                <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '_')}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="govIdNumber" className="text-sm font-medium text-gray-700">
            ID Number
          </Label>
          <Input
            id="govIdNumber"
            value={govIdNumber}
            onChange={(e) => onGovIdNumberChange(e.target.value)}
            className="border-green-300 focus:border-green-500"
            placeholder="Enter ID number"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="govIdIssuer" className="text-sm font-medium text-gray-700">
              Issuing country/province/state
            </Label>
            <Input
              id="govIdIssuer"
              value={govIdIssuer}
              onChange={(e) => onGovIdIssuerChange(e.target.value)}
              className="border-green-300 focus:border-green-500"
              placeholder="Enter issuing location"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="govIdExpiry" className="text-sm font-medium text-gray-700">
              Expiry date
            </Label>
            <Input
              id="govIdExpiry"
              type="date"
              value={govIdExpiry}
              onChange={(e) => onGovIdExpiryChange(e.target.value)}
              className="border-green-300 focus:border-green-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BiographicalDataSection;