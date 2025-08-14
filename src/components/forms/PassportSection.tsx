import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { allCountries } from '../../data/countryRegionData';

interface PassportSectionProps {
  passportNumber: string;
  passportCountry: string;
  dualCitizen: boolean;
  citizenshipCountries: string[];
  onPassportNumberChange: (value: string) => void;
  onPassportCountryChange: (value: string) => void;
  onDualCitizenChange: (checked: boolean) => void;
  onCitizenshipCountriesChange: (countries: string[]) => void;
}

const PassportSection: React.FC<PassportSectionProps> = ({
  passportNumber,
  passportCountry,
  dualCitizen,
  citizenshipCountries,
  onPassportNumberChange,
  onPassportCountryChange,
  onDualCitizenChange,
  onCitizenshipCountriesChange
}) => {
  const countries = allCountries;

  const addCountry = () => {
    onCitizenshipCountriesChange([...citizenshipCountries, '']);
  };

  const removeCountry = (index: number) => {
    const updated = citizenshipCountries.filter((_, i) => i !== index);
    onCitizenshipCountriesChange(updated);
  };

  const updateCountry = (index: number, value: string) => {
    const updated = [...citizenshipCountries];
    updated[index] = value;
    onCitizenshipCountriesChange(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Passports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="passportNumber">Passport Number (if applicable)</Label>
          <Input
            id="passportNumber"
            value={passportNumber}
            onChange={(e) => onPassportNumberChange(e.target.value)}
            placeholder="Enter passport number"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="passportCountry">Country of Issuance</Label>
          <Select value={passportCountry} onValueChange={onPassportCountryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dualCitizen"
              checked={dualCitizen}
              onCheckedChange={onDualCitizenChange}
            />
            <Label htmlFor="dualCitizen">Dual or multiple citizenship</Label>
          </div>
          
          {dualCitizen && (
            <div className="space-y-2">
              <Label>Countries of Citizenship</Label>
              {citizenshipCountries.map((country, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Select value={country} onValueChange={(value) => updateCountry(index, value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeCountry(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCountry}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Country
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PassportSection;