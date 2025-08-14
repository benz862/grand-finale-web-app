import React from 'react';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface AdvanceDirectiveSectionProps {
  hasAdvanceDirective: string;
  advanceDirectiveLocation: string;
  advanceDirectiveNotes: string;
  onHasAdvanceDirectiveChange: (value: string) => void;
  onAdvanceDirectiveLocationChange: (value: string) => void;
  onAdvanceDirectiveNotesChange: (value: string) => void;
}

const AdvanceDirectiveSection: React.FC<AdvanceDirectiveSectionProps> = ({
  hasAdvanceDirective,
  advanceDirectiveLocation,
  advanceDirectiveNotes,
  onHasAdvanceDirectiveChange,
  onAdvanceDirectiveLocationChange,
  onAdvanceDirectiveNotesChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Do you have an Advance Directive?</Label>
        <RadioGroup value={hasAdvanceDirective} onValueChange={onHasAdvanceDirectiveChange} className="mt-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Yes" id="advance-directive-yes" />
            <Label htmlFor="advance-directive-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="No" id="advance-directive-no" />
            <Label htmlFor="advance-directive-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      {hasAdvanceDirective === 'Yes' && (
        <>
          <div>
            <Label htmlFor="advance-directive-location" className="text-sm font-medium">
              Where is it stored?
            </Label>
            <Input
              id="advance-directive-location"
              value={advanceDirectiveLocation}
              onChange={(e) => onAdvanceDirectiveLocationChange(e.target.value)}
              placeholder="e.g., Safe deposit box, home safe, attorney's office"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="advance-directive-notes" className="text-sm font-medium">
              Notes (optional)
            </Label>
            <Textarea
              id="advance-directive-notes"
              value={advanceDirectiveNotes}
              onChange={(e) => onAdvanceDirectiveNotesChange(e.target.value)}
              placeholder="Any additional information about your advance directive"
              className="mt-1"
              rows={3}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AdvanceDirectiveSection;