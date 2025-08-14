import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { getIdentificationLabel, getIdentificationPlaceholder } from '@/lib/countryIdentification';

interface BiographicalSectionProps {
  fullName: string;
  fullNameAtBirth: string;
  dateOfBirth: string;
  placeOfBirthCity: string;
  placeOfBirthCountry: string;
  bornAbroad: boolean;
  bornAbroadSpecify: string;
  socialSecurityNumber: string;
  onFullNameChange: (value: string) => void;
  onFullNameAtBirthChange: (value: string) => void;
  onDateOfBirthChange: (value: string) => void;
  onPlaceOfBirthCityChange: (value: string) => void;
  onPlaceOfBirthCountryChange: (value: string) => void;
  onBornAbroadChange: (checked: boolean) => void;
  onBornAbroadSpecifyChange: (value: string) => void;
  onSocialSecurityNumberChange: (value: string) => void;
  userCountry?: string; // Add country prop for dynamic labels
}

const BiographicalSection: React.FC<BiographicalSectionProps> = ({
  fullName,
  fullNameAtBirth,
  dateOfBirth,
  placeOfBirthCity,
  placeOfBirthCountry,
  bornAbroad,
  bornAbroadSpecify,
  socialSecurityNumber,
  onFullNameChange,
  onFullNameAtBirthChange,
  onDateOfBirthChange,
  onPlaceOfBirthCityChange,
  onPlaceOfBirthCountryChange,
  onBornAbroadChange,
  onBornAbroadSpecifyChange,
  onSocialSecurityNumberChange,
  userCountry = 'United States', // Default to United States
}) => {
  // Get the appropriate identification label and placeholder based on user's country
  const identificationLabel = getIdentificationLabel(userCountry);
  const identificationPlaceholder = getIdentificationPlaceholder(userCountry);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Legal & Biographical Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            placeholder="Enter your full legal name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fullNameAtBirth">Full Name at Birth (if applicable)</Label>
          <Input
            id="fullNameAtBirth"
            value={fullNameAtBirth}
            onChange={(e) => onFullNameAtBirthChange(e.target.value)}
            placeholder="Enter your name at birth if different"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => onDateOfBirthChange(e.target.value)}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="placeOfBirthCity">Place of Birth - City</Label>
            <Input
              id="placeOfBirthCity"
              value={placeOfBirthCity}
              onChange={(e) => onPlaceOfBirthCityChange(e.target.value)}
              placeholder="City"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="placeOfBirthCountry">Place of Birth - Country</Label>
            <Input
              id="placeOfBirthCountry"
              value={placeOfBirthCountry}
              onChange={(e) => onPlaceOfBirthCountryChange(e.target.value)}
              placeholder="Country"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="bornAbroad"
              checked={bornAbroad}
              onCheckedChange={onBornAbroadChange}
            />
            <Label htmlFor="bornAbroad">Born abroad or US territory</Label>
          </div>
          {bornAbroad && (
            <Input
              value={bornAbroadSpecify}
              onChange={(e) => onBornAbroadSpecifyChange(e.target.value)}
              placeholder="Please specify"
            />
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ssn">{identificationLabel}</Label>
          <Input
            id="ssn"
            value={socialSecurityNumber}
            onChange={(e) => onSocialSecurityNumberChange(e.target.value)}
            placeholder={identificationPlaceholder}
            type="password"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BiographicalSection;