import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Plus, Trash2 } from 'lucide-react';

export interface SurgeryProcedure {
  id: string;
  name: string;
  date: string;
  notes: string;
}

interface SurgeriesProceduresSectionProps {
  surgeries: SurgeryProcedure[];
  onChange: (surgeries: SurgeryProcedure[]) => void;
}

const SurgeriesProceduresSection: React.FC<SurgeriesProceduresSectionProps> = ({ surgeries, onChange }) => {
  const handleChange = (id: string, field: keyof SurgeryProcedure, value: string) => {
    onChange(surgeries.map(s => s.id === id ? { ...s, [field]: value } : s));
  };
  const handleAdd = () => {
    onChange([
      ...surgeries,
      { id: Math.random().toString(36).slice(2), name: '', date: '', notes: '' }
    ]);
  };
  const handleRemove = (id: string) => {
    onChange(surgeries.filter(s => s.id !== id));
  };
  return (
    <div className="space-y-4">
      {surgeries.map((surgery, idx) => (
        <Card key={surgery.id} className="border-l-4 border-l-primary">
          <CardHeader className="pb-2 flex flex-row justify-between items-center">
            <CardTitle className="text-lg">Surgery/Procedure {idx + 1}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => handleRemove(surgery.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor={`surgery-name-${surgery.id}`}>Name *</Label>
              <Input id={`surgery-name-${surgery.id}`} value={surgery.name} onChange={e => handleChange(surgery.id, 'name', e.target.value)} placeholder="e.g., Appendectomy, Knee Replacement" />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`surgery-date-${surgery.id}`}>Date</Label>
              <Input id={`surgery-date-${surgery.id}`} type="date" value={surgery.date} onChange={e => handleChange(surgery.id, 'date', e.target.value)} placeholder="YYYY-MM-DD" />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`surgery-notes-${surgery.id}`}>Notes/Details</Label>
              <Textarea id={`surgery-notes-${surgery.id}`} value={surgery.notes} onChange={e => handleChange(surgery.id, 'notes', e.target.value)} placeholder="Any additional details about this surgery or procedure" />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button type="button" variant="outline" onClick={handleAdd} className="flex items-center space-x-2"><Plus className="h-4 w-4 mr-2" />Add Surgery/Procedure</Button>
    </div>
  );
};

export default SurgeriesProceduresSection; 