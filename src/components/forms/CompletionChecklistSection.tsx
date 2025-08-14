import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { CheckCircle } from 'lucide-react';

interface CompletionChecklistSectionProps {
  completionStatus: {
    completed_personal_info: boolean;
    completed_medical_info: boolean;
    completed_legal_financial: boolean;
    completed_funeral_wishes: boolean;
    completed_digital_assets: boolean;
    completed_messages: boolean;
    completed_letters: boolean;
    completed_documents: boolean;
    completed_legacy: boolean;
  };
  onToggle: (field: string, value: boolean) => void;
}

const CompletionChecklistSection: React.FC<CompletionChecklistSectionProps> = ({
  completionStatus,
  onToggle
}) => {
  const checklistItems = [
    { key: 'completed_personal_info', label: 'Personal Information Completed' },
    { key: 'completed_medical_info', label: 'Medical & Emergency Details Completed' },
    { key: 'completed_legal_financial', label: 'Legal & Financial Section Completed' },
    { key: 'completed_funeral_wishes', label: 'Funeral & Final Wishes Documented' },
    { key: 'completed_digital_assets', label: 'Digital Assets Logged' },
    { key: 'completed_messages', label: 'Final Messages Written' },
    { key: 'completed_letters', label: 'Letters to Loved Ones Added' },
    { key: 'completed_documents', label: 'Key Documents Logged' },
    { key: 'completed_legacy', label: 'Legacy Reflections Added' }
  ];

  const completedCount = Object.values(completionStatus).filter(Boolean).length;
  const totalCount = checklistItems.length;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <CheckCircle className="h-5 w-5" />
          Completion Checklist ({completedCount}/{totalCount})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {checklistItems.map((item) => (
          <div key={item.key} className="flex items-center space-x-3">
            <Checkbox
              id={item.key}
              checked={completionStatus[item.key as keyof typeof completionStatus]}
              onCheckedChange={(checked) => onToggle(item.key, checked as boolean)}
            />
            <label
              htmlFor={item.key}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {item.label}
            </label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CompletionChecklistSection;