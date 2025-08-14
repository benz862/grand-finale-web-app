import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';

interface Lawyer {
  id: string;
  lawyer_name: string;
  lawyer_address: string;
}

interface LawyerCardProps {
  lawyer: Lawyer;
  index: number;
  onUpdate: (id: string, field: string, value: string) => void;
  onDelete: (id: string) => void;
}

const LawyerCard: React.FC<LawyerCardProps> = ({ lawyer, index, onUpdate, onDelete }) => {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Lawyer #{index + 1}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(lawyer.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`lawyer-name-${lawyer.id}`}>Lawyer's Name</Label>
          <Input
            id={`lawyer-name-${lawyer.id}`}
            value={lawyer.lawyer_name}
            onChange={(e) => onUpdate(lawyer.id, 'lawyer_name', e.target.value)}
            placeholder="Enter lawyer's name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`lawyer-address-${lawyer.id}`}>Address</Label>
          <Textarea
            id={`lawyer-address-${lawyer.id}`}
            value={lawyer.lawyer_address}
            onChange={(e) => onUpdate(lawyer.id, 'lawyer_address', e.target.value)}
            placeholder="Enter lawyer's address"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LawyerCard;