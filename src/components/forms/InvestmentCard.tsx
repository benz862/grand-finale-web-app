import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface Investment {
  id: string;
  investment_firm: string;
  investment_contact_info: string;
  investment_doc_location: string;
}

interface InvestmentCardProps {
  investment: Investment;
  index: number;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  investment,
  index,
  onUpdate,
  onRemove,
  canRemove
}) => {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Investment {index + 1}</CardTitle>
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
          <Label htmlFor={`investment_firm_${index}`}>Firm Name</Label>
          <Input
            id={`investment_firm_${index}`}
            value={investment.investment_firm}
            onChange={(e) => onUpdate(index, 'investment_firm', e.target.value)}
            placeholder="Enter firm name"
          />
        </div>
        <div>
          <Label htmlFor={`investment_contact_${index}`}>Account Info / Broker Contact</Label>
          <Textarea
            id={`investment_contact_${index}`}
            value={investment.investment_contact_info}
            onChange={(e) => onUpdate(index, 'investment_contact_info', e.target.value)}
            placeholder="Account details, broker contact information"
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor={`investment_doc_${index}`}>Document Location</Label>
          <Input
            id={`investment_doc_${index}`}
            value={investment.investment_doc_location}
            onChange={(e) => onUpdate(index, 'investment_doc_location', e.target.value)}
            placeholder="Where documents are stored"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentCard;