import React from 'react';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface GuardianshipSectionProps {
  hasGuardianshipDocs: string;
  guardianshipDocsLocation: string;
  guardianshipDocsNotes: string;
  onHasGuardianshipDocsChange: (value: string) => void;
  onGuardianshipDocsLocationChange: (value: string) => void;
  onGuardianshipDocsNotesChange: (value: string) => void;
}

const GuardianshipSection: React.FC<GuardianshipSectionProps> = ({
  hasGuardianshipDocs,
  guardianshipDocsLocation,
  guardianshipDocsNotes,
  onHasGuardianshipDocsChange,
  onGuardianshipDocsLocationChange,
  onGuardianshipDocsNotesChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Do you have guardianship documents?</Label>
        <RadioGroup value={hasGuardianshipDocs} onValueChange={onHasGuardianshipDocsChange} className="mt-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Yes" id="guardianship-yes" />
            <Label htmlFor="guardianship-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="No" id="guardianship-no" />
            <Label htmlFor="guardianship-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      {hasGuardianshipDocs === 'Yes' && (
        <>
          <div>
            <Label htmlFor="guardianship-location" className="text-sm font-medium">
              Where are they stored?
            </Label>
            <Input
              id="guardianship-location"
              value={guardianshipDocsLocation}
              onChange={(e) => onGuardianshipDocsLocationChange(e.target.value)}
              placeholder="e.g., Safe deposit box, home safe, attorney's office"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="guardianship-notes" className="text-sm font-medium">
              Notes about guardianship (optional)
            </Label>
            <Textarea
              id="guardianship-notes"
              value={guardianshipDocsNotes}
              onChange={(e) => onGuardianshipDocsNotesChange(e.target.value)}
              placeholder="Any additional information about guardianship documents"
              className="mt-1"
              rows={3}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default GuardianshipSection;