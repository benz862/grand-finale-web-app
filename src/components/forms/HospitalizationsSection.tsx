import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Plus, Trash2 } from 'lucide-react';

export interface Hospitalization {
  id: string;
  reason: string;
  date: string;
  hospital: string;
  notes: string;
}

interface HospitalizationsSectionProps {
  hospitalizations: Hospitalization[];
  onChange: (hospitalizations: Hospitalization[]) => void;
}

const HospitalizationsSection: React.FC<HospitalizationsSectionProps> = ({ hospitalizations, onChange }) => {
  const handleChange = (id: string, field: keyof Hospitalization, value: string) => {
    onChange(hospitalizations.map(h => h.id === id ? { ...h, [field]: value } : h));
  };
  const handleAdd = () => {
    onChange([
      ...hospitalizations,
      { id: Math.random().toString(36).slice(2), reason: '', date: '', hospital: '', notes: '' }
    ]);
  };
  const handleRemove = (id: string) => {
    onChange(hospitalizations.filter(h => h.id !== id));
  };
  return (
    <div className="space-y-4">
      {hospitalizations.map((hosp, idx) => (
        <Card key={hosp.id} className="border-l-4 border-l-secondary">
          <CardHeader className="pb-2 flex flex-row justify-between items-center">
            <CardTitle className="text-lg">Hospitalization {idx + 1}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => handleRemove(hosp.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor={`hosp-reason-${hosp.id}`}>Reason *</Label>
              <Input id={`hosp-reason-${hosp.id}`} value={hosp.reason} onChange={e => handleChange(hosp.id, 'reason', e.target.value)} placeholder="e.g., Pneumonia, Car Accident, Surgery Recovery" />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`hosp-date-${hosp.id}`}>Date</Label>
              <Input id={`hosp-date-${hosp.id}`} type="date" value={hosp.date} onChange={e => handleChange(hosp.id, 'date', e.target.value)} placeholder="YYYY-MM-DD" />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`hosp-hospital-${hosp.id}`}>Hospital Name</Label>
              <Input id={`hosp-hospital-${hosp.id}`} value={hosp.hospital} onChange={e => handleChange(hosp.id, 'hospital', e.target.value)} placeholder="e.g., St. Mary's Hospital" />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`hosp-notes-${hosp.id}`}>Notes/Details</Label>
              <Textarea id={`hosp-notes-${hosp.id}`} value={hosp.notes} onChange={e => handleChange(hosp.id, 'notes', e.target.value)} placeholder="Any additional details about this hospitalization" />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button type="button" variant="outline" onClick={handleAdd} className="flex items-center space-x-2"><Plus className="h-4 w-4 mr-2" />Add Hospitalization</Button>
    </div>
  );
};

export default HospitalizationsSection; 