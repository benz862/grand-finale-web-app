import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface BankAccount {
  id: string;
  bank_name: string;
  bank_balance: string;
  bank_location: string;
}

interface BankAccountCardProps {
  account: BankAccount;
  index: number;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const BankAccountCard: React.FC<BankAccountCardProps> = ({
  account,
  index,
  onUpdate,
  onRemove,
  canRemove
}) => {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Bank Account {index + 1}</CardTitle>
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
          <Label htmlFor={`bank_name_${index}`}>Bank Name</Label>
          <Input
            id={`bank_name_${index}`}
            value={account.bank_name}
            onChange={(e) => onUpdate(index, 'bank_name', e.target.value)}
            placeholder="Enter bank name"
          />
        </div>
        <div>
          <Label htmlFor={`bank_balance_${index}`}>Approximate Balance</Label>
          <Input
            id={`bank_balance_${index}`}
            type="number"
            step="0.01"
            value={account.bank_balance}
            onChange={(e) => onUpdate(index, 'bank_balance', e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div>
          <Label htmlFor={`bank_location_${index}`}>Account Location (Paper/Digital)</Label>
          <Input
            id={`bank_location_${index}`}
            value={account.bank_location}
            onChange={(e) => onUpdate(index, 'bank_location', e.target.value)}
            placeholder="Paper statements, online banking, etc."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BankAccountCard;