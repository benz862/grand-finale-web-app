import React from 'react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface SurgeriesSectionProps {
  surgeriesProcedures: string;
  hospitalizations: string;
  onSurgeriesProceduresChange: (value: string) => void;
  onHospitalizationsChange: (value: string) => void;
}

const SurgeriesSection: React.FC<SurgeriesSectionProps> = ({
  surgeriesProcedures,
  hospitalizations,
  onSurgeriesProceduresChange,
  onHospitalizationsChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="surgeries-procedures" className="text-sm font-medium text-gray-700">
          List any major surgeries, procedures, or hospital stays
        </Label>
        <Textarea
          id="surgeries-procedures"
          value={surgeriesProcedures}
          onChange={(e) => onSurgeriesProceduresChange(e.target.value)}
          placeholder="Optional but helpful"
          className="min-h-[100px] resize-none"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="hospitalizations" className="text-sm font-medium text-gray-700">
          Hospitalizations
        </Label>
        <Textarea
          id="hospitalizations"
          value={hospitalizations}
          onChange={(e) => onHospitalizationsChange(e.target.value)}
          placeholder="Optional"
          className="min-h-[100px] resize-none"
        />
      </div>
    </div>
  );
};

export default SurgeriesSection;