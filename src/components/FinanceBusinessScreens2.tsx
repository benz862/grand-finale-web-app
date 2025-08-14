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

export const Screen3: React.FC<ScreenProps> = ({ formData, handleArrayUpdate, addArrayItem, removeArrayItem }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">✅ Screen 3: Investments & Brokerages</h2>
    {formData.investments.map((investment, index) => (
      <Card key={investment.id}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label>Firm Name</Label>
              <Input
                value={investment.investment_firm}
                onChange={(e) => handleArrayUpdate('investments', index, 'investment_firm', e.target.value)}
                placeholder="Investment firm name"
              />
            </div>
            <div>
              <Label>Account Info / Broker Contact</Label>
              <Textarea
                value={investment.investment_contact_info}
                onChange={(e) => handleArrayUpdate('investments', index, 'investment_contact_info', e.target.value)}
                placeholder="Contact information and account details"
              />
            </div>
            <div>
              <Label>Document Location</Label>
              <Input
                value={investment.investment_doc_location}
                onChange={(e) => handleArrayUpdate('investments', index, 'investment_doc_location', e.target.value)}
                placeholder="Where documents are stored"
              />
            </div>
          </div>
          {formData.investments.length > 1 && (
            <Button
              onClick={() => removeArrayItem('investments', index)}
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
    {formData.investments.length < 4 && (
      <Button
        onClick={() => addArrayItem('investments', { id: '', investment_firm: '', investment_contact_info: '', investment_doc_location: '' }, 4)}
        variant="outline"
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Investment
      </Button>
    )}
  </div>
);

export const Screen4: React.FC<ScreenProps> = ({ formData, handleFieldChange }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">✅ Screen 4: Retirement Plans & Pensions</h2>
    <div>
      <Label>Plan Type(s)</Label>
      <Input
        value={formData.retirementPlanType}
        onChange={(e) => handleFieldChange('retirementPlanType', e.target.value)}
        placeholder="401k, IRA, Pension, etc."
      />
    </div>
    <div>
      <Label>Provider(s)</Label>
      <Input
        value={formData.retirementProvider}
        onChange={(e) => handleFieldChange('retirementProvider', e.target.value)}
        placeholder="Company or institution name"
      />
    </div>
    <div>
      <Label>Location of Plan Documents</Label>
      <Input
        value={formData.retirementDocLocation}
        onChange={(e) => handleFieldChange('retirementDocLocation', e.target.value)}
        placeholder="Where documents are stored"
      />
    </div>
  </div>
);

export const Screen5: React.FC<ScreenProps> = ({ formData, handleFieldChange }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">✅ Screen 5: Cryptocurrency & Precious Metals</h2>
    <div>
      <Label>Wallet Location / Access Info</Label>
      <Input
        value={formData.cryptoWalletInfo}
        onChange={(e) => handleFieldChange('cryptoWalletInfo', e.target.value)}
        placeholder="Wallet addresses, keys, exchange info"
      />
    </div>
    <div>
      <Label>Precious Metal Location(s)</Label>
      <Input
        value={formData.preciousMetalLocation}
        onChange={(e) => handleFieldChange('preciousMetalLocation', e.target.value)}
        placeholder="Safe deposit box, home safe, etc."
      />
    </div>
  </div>
);