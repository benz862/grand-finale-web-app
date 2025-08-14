import React from 'react';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface OtherLegalDocsSectionProps {
  hasOtherLegalDocs: string;
  otherLegalDocsDescription: string;
  otherLegalDocsLocation: string;
  onHasOtherLegalDocsChange: (value: string) => void;
  onOtherLegalDocsDescriptionChange: (value: string) => void;
  onOtherLegalDocsLocationChange: (value: string) => void;
}

const OtherLegalDocsSection: React.FC<OtherLegalDocsSectionProps> = ({
  hasOtherLegalDocs,
  otherLegalDocsDescription,
  otherLegalDocsLocation,
  onHasOtherLegalDocsChange,
  onOtherLegalDocsDescriptionChange,
  onOtherLegalDocsLocationChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Do you have other important legal documents?</Label>
        <RadioGroup value={hasOtherLegalDocs} onValueChange={onHasOtherLegalDocsChange} className="mt-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Yes" id="other-legal-yes" />
            <Label htmlFor="other-legal-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="No" id="other-legal-no" />
            <Label htmlFor="other-legal-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      {hasOtherLegalDocs === 'Yes' && (
        <>
          <div>
            <Label htmlFor="other-legal-description" className="text-sm font-medium">
              Describe or list them
            </Label>
            <Textarea
              id="other-legal-description"
              value={otherLegalDocsDescription}
              onChange={(e) => onOtherLegalDocsDescriptionChange(e.target.value)}
              placeholder="List or describe your other important legal documents"
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="other-legal-location" className="text-sm font-medium">
              Where are they stored?
            </Label>
            <Input
              id="other-legal-location"
              value={otherLegalDocsLocation}
              onChange={(e) => onOtherLegalDocsLocationChange(e.target.value)}
              placeholder="e.g., Safe deposit box, home safe, attorney's office"
              className="mt-1"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default OtherLegalDocsSection;