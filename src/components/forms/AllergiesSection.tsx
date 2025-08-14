import React from 'react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface AllergiesSectionProps {
  allergies: string;
  onAllergiesChange: (value: string) => void;
}

const AllergiesSection: React.FC<AllergiesSectionProps> = ({
  allergies,
  onAllergiesChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="allergies" className="text-sm font-medium text-gray-700">
          Known allergies (medications, foods, etc.)
        </Label>
        <Textarea
          id="allergies"
          value={allergies}
          onChange={(e) => onAllergiesChange(e.target.value)}
          placeholder="Optional, but critical info"
          className="min-h-[100px] resize-none"
        />
      </div>
    </div>
  );
};

export default AllergiesSection;