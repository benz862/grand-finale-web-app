import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface IncomeSource {
  id: string;
  income_type: string;
  income_contact_details: string;
}

interface IncomeSourceCardProps {
  incomeSource: IncomeSource;
  index: number;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const IncomeSourceCard: React.FC<IncomeSourceCardProps> = ({
  incomeSource,
  index,
  onUpdate,
  onRemove,
  canRemove
}) => {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Income Source {index + 1}</CardTitle>
          {canRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`income_type_${index}`}>Type of Income</Label>
          <Input
            id={`income_type_${index}`}
            value={incomeSource.income_type}
            onChange={(e) => onUpdate(index, 'income_type', e.target.value)}
            placeholder="Salary, pension, rental income, etc."
          />
        </div>
        <div>
          <Label htmlFor={`income_contact_${index}`}>Contact Info / Payment Details</Label>
          <Textarea
            id={`income_contact_${index}`}
            value={incomeSource.income_contact_details}
            onChange={(e) => onUpdate(index, 'income_contact_details', e.target.value)}
            placeholder="Contact information, payment details, account numbers"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeSourceCard;