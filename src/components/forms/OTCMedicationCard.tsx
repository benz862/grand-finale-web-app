import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Trash2 } from 'lucide-react';

interface OTCMedication {
  id: string;
  name: string;
  brandName: string;
  purpose: string;
}

interface OTCMedicationCardProps {
  medication: OTCMedication;
  onUpdate: (medication: OTCMedication) => void;
  onDelete: (id: string) => void;
}

const OTCMedicationCard: React.FC<OTCMedicationCardProps> = ({ 
  medication, 
  onUpdate, 
  onDelete 
}) => {
  const handleChange = (field: keyof OTCMedication, value: string) => {
    onUpdate({ ...medication, [field]: value });
  };

  return (
    <Card className="border-l-4 border-l-accent">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">OTC Medication/Supplement</CardTitle>
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
            <Label htmlFor={`name-${medication.id}`}>Medication/Supplement Name *</Label>
            <Input
              id={`name-${medication.id}`}
              value={medication.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Vitamin D3"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`brandName-${medication.id}`}>Brand Name (if applicable)</Label>
            <Input
              id={`brandName-${medication.id}`}
              value={medication.brandName}
              onChange={(e) => handleChange('brandName', e.target.value)}
              placeholder="Nature Made"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`purpose-${medication.id}`}>Purpose *</Label>
          <Textarea
            id={`purpose-${medication.id}`}
            value={medication.purpose}
            onChange={(e) => handleChange('purpose', e.target.value)}
            placeholder="Bone health and immune system support"
            className="min-h-[80px] resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default OTCMedicationCard;