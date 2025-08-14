import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Trash2 } from 'lucide-react';

interface Physician {
  id: string;
  fullName: string;
  specialty: string;
  clinicHospital: string;
  phone: string;
  email: string;
  emergencyContact: string;
}

interface PhysicianCardProps {
  physician: Physician;
  onUpdate: (physician: Physician) => void;
  onDelete: (id: string) => void;
}

const PhysicianCard: React.FC<PhysicianCardProps> = ({ physician, onUpdate, onDelete }) => {
  const handleChange = (field: keyof Physician, value: string) => {
    onUpdate({ ...physician, [field]: value });
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Physician Information</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(physician.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`fullName-${physician.id}`}>Full Name *</Label>
            <Input
              id={`fullName-${physician.id}`}
              value={physician.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="Dr. John Smith"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`specialty-${physician.id}`}>Specialty *</Label>
            <Input
              id={`specialty-${physician.id}`}
              value={physician.specialty}
              onChange={(e) => handleChange('specialty', e.target.value)}
              placeholder="Cardiology"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`clinicHospital-${physician.id}`}>Clinic/Hospital Name *</Label>
          <Input
            id={`clinicHospital-${physician.id}`}
            value={physician.clinicHospital}
            onChange={(e) => handleChange('clinicHospital', e.target.value)}
            placeholder="City Medical Center"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`phone-${physician.id}`}>Phone Number *</Label>
            <Input
              id={`phone-${physician.id}`}
              value={physician.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`email-${physician.id}`}>Email (if known)</Label>
            <Input
              id={`email-${physician.id}`}
              value={physician.email}
              onChange={(e) => handleChange('email', e.target.value)}
                              placeholder="physician@clinic.com"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`emergencyContact-${physician.id}`}>Emergency Contact at Clinic/Hospital</Label>
          <Input
            id={`emergencyContact-${physician.id}`}
            value={physician.emergencyContact}
            onChange={(e) => handleChange('emergencyContact', e.target.value)}
            placeholder="Nurse Jane Doe - (555) 123-4568"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PhysicianCard;