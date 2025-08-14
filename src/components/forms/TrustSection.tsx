import React from 'react';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface TrustSectionProps {
  hasTrustDocs: string;
  trustDocsLocation: string;
  trustDocsNotes: string;
  onHasTrustDocsChange: (value: string) => void;
  onTrustDocsLocationChange: (value: string) => void;
  onTrustDocsNotesChange: (value: string) => void;
}

const TrustSection: React.FC<TrustSectionProps> = ({
  hasTrustDocs,
  trustDocsLocation,
  trustDocsNotes,
  onHasTrustDocsChange,
  onTrustDocsLocationChange,
  onTrustDocsNotesChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Do you have any Trusts?</Label>
        <RadioGroup value={hasTrustDocs} onValueChange={onHasTrustDocsChange} className="mt-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Yes" id="trust-yes" />
            <Label htmlFor="trust-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="No" id="trust-no" />
            <Label htmlFor="trust-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      {hasTrustDocs === 'Yes' && (
        <>
          <div>
            <Label htmlFor="trust-location" className="text-sm font-medium">
              Where are your Trust documents stored?
            </Label>
            <Input
              id="trust-location"
              value={trustDocsLocation}
              onChange={(e) => onTrustDocsLocationChange(e.target.value)}
              placeholder="e.g., Safe deposit box, home safe, attorney's office"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="trust-notes" className="text-sm font-medium">
              Notes about trusts (optional)
            </Label>
            <Textarea
              id="trust-notes"
              value={trustDocsNotes}
              onChange={(e) => onTrustDocsNotesChange(e.target.value)}
              placeholder="Any additional information about your trust documents"
              className="mt-1"
              rows={3}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TrustSection;