import React from 'react';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface WillSectionProps {
  hasWill: string;
  willLocation: string;
  willNotes: string;
  onHasWillChange: (value: string) => void;
  onWillLocationChange: (value: string) => void;
  onWillNotesChange: (value: string) => void;
}

const WillSection: React.FC<WillSectionProps> = ({
  hasWill,
  willLocation,
  willNotes,
  onHasWillChange,
  onWillLocationChange,
  onWillNotesChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Do you have a will?</Label>
        <RadioGroup value={hasWill} onValueChange={onHasWillChange} className="mt-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Yes" id="will-yes" />
            <Label htmlFor="will-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="No" id="will-no" />
            <Label htmlFor="will-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      {hasWill === 'Yes' && (
        <>
          <div>
            <Label htmlFor="will-location" className="text-sm font-medium">
              Where is your will stored?
            </Label>
            <Input
              id="will-location"
              value={willLocation}
              onChange={(e) => onWillLocationChange(e.target.value)}
              placeholder="e.g., Safe deposit box, home safe, attorney's office"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="will-notes" className="text-sm font-medium">
              Notes about your will (optional)
            </Label>
            <Textarea
              id="will-notes"
              value={willNotes}
              onChange={(e) => onWillNotesChange(e.target.value)}
              placeholder="Any additional information about your will"
              className="mt-1"
              rows={3}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default WillSection;