import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface LegalNameSectionProps {
  legalFirstName: string;
  legalMiddleName: string;
  legalLastName: string;
  legalSuffix: string;
  dateOfBirth: string;
  placeOfBirth: string;
  countryOfCitizenship: string;
  hasDualCitizenship: string;
  dualCitizenshipCountry: string;
  onLegalFirstNameChange: (value: string) => void;
  onLegalMiddleNameChange: (value: string) => void;
  onLegalLastNameChange: (value: string) => void;
  onLegalSuffixChange: (value: string) => void;
  onDateOfBirthChange: (value: string) => void;
  onPlaceOfBirthChange: (value: string) => void;
  onCountryOfCitizenshipChange: (value: string) => void;
  onHasDualCitizenshipChange: (value: string) => void;
  onDualCitizenshipCountryChange: (value: string) => void;
}

const LegalNameSection: React.FC<LegalNameSectionProps> = ({
  legalFirstName,
  legalMiddleName,
  legalLastName,
  legalSuffix,
  dateOfBirth,
  placeOfBirth,
  countryOfCitizenship,
  hasDualCitizenship,
  dualCitizenshipCountry,
  onLegalFirstNameChange,
  onLegalMiddleNameChange,
  onLegalLastNameChange,
  onLegalSuffixChange,
  onDateOfBirthChange,
  onPlaceOfBirthChange,
  onCountryOfCitizenshipChange,
  onHasDualCitizenshipChange,
  onDualCitizenshipCountryChange,
}) => {
  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan', 'Other'
  ];

  return (
    <Card className="mb-6 shadow-lg border-2 border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardTitle className="text-blue-800">Legal Name & ID Details</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="legalFirstName" className="text-sm font-medium text-gray-700">
              Legal first name *
            </Label>
            <Input
              id="legalFirstName"
              value={legalFirstName}
              onChange={(e) => onLegalFirstNameChange(e.target.value)}
              className="border-blue-300 focus:border-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="legalMiddleName" className="text-sm font-medium text-gray-700">
              Middle name(s)
            </Label>
            <Input
              id="legalMiddleName"
              value={legalMiddleName}
              onChange={(e) => onLegalMiddleNameChange(e.target.value)}
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="legalLastName" className="text-sm font-medium text-gray-700">
              Last name (surname) *
            </Label>
            <Input
              id="legalLastName"
              value={legalLastName}
              onChange={(e) => onLegalLastNameChange(e.target.value)}
              className="border-blue-300 focus:border-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="legalSuffix" className="text-sm font-medium text-gray-700">
              Suffix (Jr., III, etc.)
            </Label>
            <Input
              id="legalSuffix"
              value={legalSuffix}
              onChange={(e) => onLegalSuffixChange(e.target.value)}
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
              Date of birth *
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => onDateOfBirthChange(e.target.value)}
              className="border-blue-300 focus:border-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="placeOfBirth" className="text-sm font-medium text-gray-700">
              Place of birth (city/state/country) *
            </Label>
            <Input
              id="placeOfBirth"
              value={placeOfBirth}
              onChange={(e) => onPlaceOfBirthChange(e.target.value)}
              className="border-blue-300 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="countryOfCitizenship" className="text-sm font-medium text-gray-700">
            Country of citizenship *
          </Label>
          <Select value={countryOfCitizenship} onValueChange={onCountryOfCitizenshipChange}>
            <SelectTrigger className="border-blue-300 focus:border-blue-500">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country.toLowerCase()}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Other citizenships held?
          </Label>
          <RadioGroup value={hasDualCitizenship} onValueChange={onHasDualCitizenshipChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id="dual-yes" />
              <Label htmlFor="dual-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id="dual-no" />
              <Label htmlFor="dual-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        {hasDualCitizenship === 'Yes' && (
          <div className="space-y-2">
            <Label htmlFor="dualCitizenshipCountry" className="text-sm font-medium text-gray-700">
              Other citizenship country
            </Label>
            <Input
              id="dualCitizenshipCountry"
              value={dualCitizenshipCountry}
              onChange={(e) => onDualCitizenshipCountryChange(e.target.value)}
              className="border-blue-300 focus:border-blue-500"
              placeholder="Enter country"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LegalNameSection;