import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';

interface TypeOfServiceSectionProps {
  wantsFuneralService: string;
  setWantsFuneralService: (value: string) => void;
  serviceType: string;
  setServiceType: (value: string) => void;
  otherServiceType: string;
  setOtherServiceType: (value: string) => void;
}

const TypeOfServiceSection: React.FC<TypeOfServiceSectionProps> = ({
  wantsFuneralService,
  setWantsFuneralService,
  serviceType,
  setServiceType,
  otherServiceType,
  setOtherServiceType,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Type of Service
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Do you want a funeral or memorial service? *
          </Label>
          <RadioGroup
            value={wantsFuneralService}
            onValueChange={setWantsFuneralService}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id="wants-yes" />
              <Label htmlFor="wants-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id="wants-no" />
              <Label htmlFor="wants-no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="not-sure" id="wants-not-sure" />
              <Label htmlFor="wants-not-sure">Not Sure</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Preferred type of service
          </Label>
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger>
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="funeral">Funeral</SelectItem>
              <SelectItem value="memorial">Memorial</SelectItem>
              <SelectItem value="celebration-of-life">Celebration of Life</SelectItem>
              <SelectItem value="no-service">No Service</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {serviceType === 'other' && (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              If other, please describe
            </Label>
            <Input
              value={otherServiceType}
              onChange={(e) => setOtherServiceType(e.target.value)}
              placeholder="Describe the type of service"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TypeOfServiceSection;