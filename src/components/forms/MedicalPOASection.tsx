import React from 'react';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface MedicalPOASectionProps {
  hasMedicalPOA: string;
  medicalPOALocation: string;
  medicalPOANotes: string;
  onHasMedicalPOAChange: (value: string) => void;
  onMedicalPOALocationChange: (value: string) => void;
  onMedicalPOANotesChange: (value: string) => void;
}

const MedicalPOASection: React.FC<MedicalPOASectionProps> = ({
  hasMedicalPOA,
  medicalPOALocation,
  medicalPOANotes,
  onHasMedicalPOAChange,
  onMedicalPOALocationChange,
  onMedicalPOANotesChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Do you have a Medical Power of Attorney?</Label>
        <RadioGroup value={hasMedicalPOA} onValueChange={onHasMedicalPOAChange} className="mt-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Yes" id="medical-poa-yes" />
            <Label htmlFor="medical-poa-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="No" id="medical-poa-no" />
            <Label htmlFor="medical-poa-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      {hasMedicalPOA === 'Yes' && (
        <>
          <div>
            <Label htmlFor="medical-poa-location" className="text-sm font-medium">
              Where is it stored?
            </Label>
            <Input
              id="medical-poa-location"
              value={medicalPOALocation}
              onChange={(e) => onMedicalPOALocationChange(e.target.value)}
              placeholder="e.g., Safe deposit box, home safe, attorney's office"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="medical-poa-notes" className="text-sm font-medium">
              Notes about your Medical POA (optional)
            </Label>
            <Textarea
              id="medical-poa-notes"
              value={medicalPOANotes}
              onChange={(e) => onMedicalPOANotesChange(e.target.value)}
              placeholder="Any additional information about your Medical POA"
              className="mt-1"
              rows={3}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MedicalPOASection;