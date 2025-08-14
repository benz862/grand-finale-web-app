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

export const Screen6: React.FC<ScreenProps> = ({ formData, handleArrayUpdate, addArrayItem, removeArrayItem }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">✅ Screen 6: Income Sources</h2>
    {formData.incomeSources.map((source, index) => (
      <Card key={source.id}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label>Type of Income</Label>
              <Input
                value={source.income_type}
                onChange={(e) => handleArrayUpdate('incomeSources', index, 'income_type', e.target.value)}
                placeholder="Salary, Social Security, Rental, etc."
              />
            </div>
            <div>
              <Label>Contact Info / Payment Details</Label>
              <Textarea
                value={source.income_contact_details}
                onChange={(e) => handleArrayUpdate('incomeSources', index, 'income_contact_details', e.target.value)}
                placeholder="Contact information and payment details"
              />
            </div>
          </div>
          {formData.incomeSources.length > 1 && (
            <Button
              onClick={() => removeArrayItem('incomeSources', index)}
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
    {formData.incomeSources.length < 4 && (
      <Button
        onClick={() => addArrayItem('incomeSources', { id: '', income_type: '', income_contact_details: '' }, 4)}
        variant="outline"
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Income Source
      </Button>
    )}
  </div>
);

export const Screen7: React.FC<ScreenProps> = ({ formData, handleArrayUpdate, addArrayItem, removeArrayItem }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">✅ Screen 7: Debts, Mortgages & Liabilities</h2>
    {formData.debts.map((debt, index) => (
      <Card key={debt.id}>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Creditor Name(s)</Label>
              <Input
                value={debt.debt_creditor_name}
                onChange={(e) => handleArrayUpdate('debts', index, 'debt_creditor_name', e.target.value)}
                placeholder="Creditor or lender name"
              />
            </div>
            <div>
              <Label>Outstanding Balance(s)</Label>
              <Input
                type="number"
                step="0.01"
                value={debt.debt_balance}
                onChange={(e) => handleArrayUpdate('debts', index, 'debt_balance', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Payment Due Dates</Label>
              <Input
                value={debt.debt_due_date}
                onChange={(e) => handleArrayUpdate('debts', index, 'debt_due_date', e.target.value)}
                placeholder="Monthly due date or schedule"
              />
            </div>
          </div>
          {formData.debts.length > 1 && (
            <Button
              onClick={() => removeArrayItem('debts', index)}
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
    <Button
      onClick={() => addArrayItem('debts', { id: '', debt_creditor_name: '', debt_balance: '', debt_due_date: '' }, 10)}
      variant="outline"
      className="w-full"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Debt/Liability
    </Button>
  </div>
);