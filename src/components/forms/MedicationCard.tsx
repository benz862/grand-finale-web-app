import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Trash2 } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  reason: string;
}

interface MedicationCardProps {
  medication: Medication;
  onUpdate: (medication: Medication) => void;
  onDelete: (id: string) => void;
  title?: string;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ 
  medication, 
  onUpdate, 
  onDelete, 
  title = "Medication" 
}) => {
  const handleChange = (field: keyof Medication, value: string) => {
    onUpdate({ ...medication, [field]: value });
  };

  return (
    <Card className="border-l-4 border-l-secondary">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(medication.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`name-${medication.id}`}>Medication Name *</Label>
            <Input
              id={`name-${medication.id}`}
              value={medication.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Lisinopril"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`dosage-${medication.id}`}>Dosage *</Label>
            <Input
              id={`dosage-${medication.id}`}
              value={medication.dosage}
              onChange={(e) => handleChange('dosage', e.target.value)}
              placeholder="10mg"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`frequency-${medication.id}`}>Frequency *</Label>
          <Input
            id={`frequency-${medication.id}`}
            value={medication.frequency}
            onChange={(e) => handleChange('frequency', e.target.value)}
            placeholder="Once daily with breakfast"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`reason-${medication.id}`}>Reason for Taking *</Label>
          <Textarea
            id={`reason-${medication.id}`}
            value={medication.reason}
            onChange={(e) => handleChange('reason', e.target.value)}
            placeholder="High blood pressure management"
            className="min-h-[80px] resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationCard;