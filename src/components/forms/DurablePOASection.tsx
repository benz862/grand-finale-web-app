import React from 'react';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface DurablePOASectionProps {
  hasDurablePOA: string;
  durablePOALocation: string;
  durablePOANotes: string;
  onHasDurablePOAChange: (value: string) => void;
  onDurablePOALocationChange: (value: string) => void;
  onDurablePOANotesChange: (value: string) => void;
}

const DurablePOASection: React.FC<DurablePOASectionProps> = ({
  hasDurablePOA,
  durablePOALocation,
  durablePOANotes,
  onHasDurablePOAChange,
  onDurablePOALocationChange,
  onDurablePOANotesChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Do you have a Durable Power of Attorney?</Label>
        <RadioGroup value={hasDurablePOA} onValueChange={onHasDurablePOAChange} className="mt-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Yes" id="durable-poa-yes" />
            <Label htmlFor="durable-poa-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="No" id="durable-poa-no" />
            <Label htmlFor="durable-poa-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      {hasDurablePOA === 'Yes' && (
        <>
          <div>
            <Label htmlFor="durable-poa-location" className="text-sm font-medium">
              Where is it stored?
            </Label>
            <Input
              id="durable-poa-location"
              value={durablePOALocation}
              onChange={(e) => onDurablePOALocationChange(e.target.value)}
              placeholder="e.g., Safe deposit box, home safe, attorney's office"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="durable-poa-notes" className="text-sm font-medium">
              Notes about your Durable POA (optional)
            </Label>
            <Textarea
              id="durable-poa-notes"
              value={durablePOANotes}
              onChange={(e) => onDurablePOANotesChange(e.target.value)}
              placeholder="Any additional information about your Durable POA"
              className="mt-1"
              rows={3}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DurablePOASection;