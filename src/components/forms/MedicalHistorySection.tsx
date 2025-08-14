import React from 'react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface MedicalHistorySectionProps {
  medicalConditions: string;
  healthHistory: string;
  onMedicalConditionsChange: (value: string) => void;
  onHealthHistoryChange: (value: string) => void;
}

const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = ({
  medicalConditions,
  healthHistory,
  onMedicalConditionsChange,
  onHealthHistoryChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="medical-conditions" className="text-sm font-medium text-gray-700">
          Current medical conditions or diagnoses
        </Label>
        <Textarea
          id="medical-conditions"
          value={medicalConditions}
          onChange={(e) => onMedicalConditionsChange(e.target.value)}
          placeholder="Examples: diabetes, asthma"
          className="min-h-[100px] resize-none"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="health-history" className="text-sm font-medium text-gray-700">
          Medical history or past health issues
        </Label>
        <Textarea
          id="health-history"
          value={healthHistory}
          onChange={(e) => onHealthHistoryChange(e.target.value)}
          placeholder="Optional"
          className="min-h-[100px] resize-none"
        />
      </div>
    </div>
  );
};

export default MedicalHistorySection;