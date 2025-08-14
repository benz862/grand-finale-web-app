import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface DispositionSectionProps {
  dispositionType: string;
  setDispositionType: (value: string) => void;
  dispositionDetails: string;
  setDispositionDetails: (value: string) => void;
  hasBurialAssets: string;
  setHasBurialAssets: (value: string) => void;
  burialLocation: string;
  setBurialLocation: (value: string) => void;
}

const DispositionSection: React.FC<DispositionSectionProps> = ({
  dispositionType,
  setDispositionType,
  dispositionDetails,
  setDispositionDetails,
  hasBurialAssets,
  setHasBurialAssets,
  burialLocation,
  setBurialLocation,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Disposition Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Preferred disposition *
          </Label>
          <Select value={dispositionType} onValueChange={setDispositionType}>
            <SelectTrigger>
              <SelectValue placeholder="Select disposition type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="burial">Burial</SelectItem>
              <SelectItem value="cremation">Cremation</SelectItem>
              <SelectItem value="green-burial">Green/Natural Burial</SelectItem>
              <SelectItem value="body-donation">Body Donation</SelectItem>
              <SelectItem value="undecided">Undecided</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Specific wishes about burial/cremation
          </Label>
          <Textarea
            value={dispositionDetails}
            onChange={(e) => setDispositionDetails(e.target.value)}
            placeholder="Enter any specific wishes or instructions"
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Do you already own a burial plot, vault, or urn?
          </Label>
          <RadioGroup
            value={hasBurialAssets}
            onValueChange={setHasBurialAssets}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id="burial-assets-yes" />
              <Label htmlFor="burial-assets-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id="burial-assets-no" />
              <Label htmlFor="burial-assets-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        {hasBurialAssets === 'Yes' && (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Location of burial plot/urn (if owned)
            </Label>
            <Input
              value={burialLocation}
              onChange={(e) => setBurialLocation(e.target.value)}
              placeholder="Enter the location"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DispositionSection;