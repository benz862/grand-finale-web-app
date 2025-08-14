import React from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface ScreenProps {
  formData: any;
  handleFieldChange: (field: string, value: string) => void;
  handleArrayUpdate: (arrayName: string, index: number, field: string, value: string) => void;
  addArrayItem: (arrayName: string, template: any, maxItems: number) => void;
  removeArrayItem: (arrayName: string, index: number) => void;
}

export const Screen1: React.FC<ScreenProps> = ({ formData, handleArrayUpdate, addArrayItem, removeArrayItem }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">✅ Screen 1: Bank Accounts</h2>
    {formData.bankAccounts.map((account, index) => (
      <Card key={account.id}>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Bank Name</Label>
              <Input
                value={account.bank_name}
                onChange={(e) => handleArrayUpdate('bankAccounts', index, 'bank_name', e.target.value)}
                placeholder="Bank name"
              />
            </div>
            <div>
              <Label>Approx. Balance</Label>
              <Input
                type="number"
                step="0.01"
                value={account.bank_balance}
                onChange={(e) => handleArrayUpdate('bankAccounts', index, 'bank_balance', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Account Location (Paper/Digital)</Label>
              <Input
                value={account.bank_location}
                onChange={(e) => handleArrayUpdate('bankAccounts', index, 'bank_location', e.target.value)}
                placeholder="Where account info is stored"
              />
            </div>
          </div>
          {formData.bankAccounts.length > 1 && (
            <Button
              onClick={() => removeArrayItem('bankAccounts', index)}
              variant="destructive"
              size="sm"
              className="mt-4"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          )}
        </CardContent>
      </Card>
    ))}
    {formData.bankAccounts.length < 8 && (
      <Button
        onClick={() => addArrayItem('bankAccounts', { id: '', bank_name: '', bank_balance: '', bank_location: '' }, 8)}
        variant="outline"
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Bank Account
      </Button>
    )}
  </div>
);

export const Screen2: React.FC<ScreenProps> = ({ formData, handleFieldChange }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">✅ Screen 2: Cash on Hand</h2>
    <div>
      <Label>Amount</Label>
      <Input
        type="number"
        step="0.01"
        value={formData.cashOnHandAmount}
        onChange={(e) => handleFieldChange('cashOnHandAmount', e.target.value)}
        placeholder="0.00"
      />
    </div>
    <div>
      <Label>Location(s)</Label>
      <Input
        value={formData.cashOnHandLocation}
        onChange={(e) => handleFieldChange('cashOnHandLocation', e.target.value)}
        placeholder="Where cash is stored"
      />
    </div>
  </div>
);