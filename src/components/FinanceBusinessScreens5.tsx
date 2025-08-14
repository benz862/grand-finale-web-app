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

export const Screen10: React.FC<ScreenProps> = ({ formData, handleArrayUpdate, addArrayItem, removeArrayItem }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">✅ Screen 10: Business Ownership</h2>
    {formData.businessOwnership.map((business, index) => (
      <Card key={business.id}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label>Business Name</Label>
              <Input
                value={business.business_name}
                onChange={(e) => handleArrayUpdate('businessOwnership', index, 'business_name', e.target.value)}
                placeholder="Name of business"
              />
            </div>
            <div>
              <Label>Type of Ownership</Label>
              <Select
                value={business.ownership_type}
                onValueChange={(value) => handleArrayUpdate('businessOwnership', index, 'ownership_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ownership type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="corporation">Corporation</SelectItem>
                  <SelectItem value="llc">LLC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Successor or Sale Plan</Label>
              <Textarea
                value={business.business_successor_plan}
                onChange={(e) => handleArrayUpdate('businessOwnership', index, 'business_successor_plan', e.target.value)}
                placeholder="Plans for business succession or sale"
              />
            </div>
          </div>
          {formData.businessOwnership.length > 1 && (
            <Button
              onClick={() => removeArrayItem('businessOwnership', index)}
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
      onClick={() => addArrayItem('businessOwnership', { id: '', business_name: '', ownership_type: '', business_successor_plan: '' }, 10)}
      className="w-full bg-white text-foreground hover:bg-gray-50 shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] border border-gray-200"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Business
    </Button>
  </div>
);

export const Screen11: React.FC<ScreenProps> = ({ formData, handleFieldChange }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">✅ Screen 11: Financial Advisor Contact</h2>
    <div>
      <Label>Name</Label>
      <Input
        value={formData.financialAdvisorName}
        onChange={(e) => handleFieldChange('financialAdvisorName', e.target.value)}
        placeholder="Financial advisor name"
      />
    </div>
    <div>
      <Label>Phone / Email</Label>
      <Input
        value={formData.financialAdvisorContact}
        onChange={(e) => handleFieldChange('financialAdvisorContact', e.target.value)}
        placeholder="Contact information"
      />
    </div>
  </div>
);

export const Screen12: React.FC<ScreenProps> = ({ formData, handleFieldChange }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">✅ Screen 12: Access to Statements</h2>
    <div>
      <Label>Paper or Digital?</Label>
      <RadioGroup
        value={formData.statementsStorage}
        onValueChange={(value) => handleFieldChange('statementsStorage', value)}
        className="mt-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="paper" id="paper" />
          <Label htmlFor="paper">Paper</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="digital" id="digital" />
          <Label htmlFor="digital">Digital</Label>
        </div>
      </RadioGroup>
    </div>
    <div>
      <Label>Stored At / Password Info</Label>
      <Input
        value={formData.statementsStorageInfo}
        onChange={(e) => handleFieldChange('statementsStorageInfo', e.target.value)}
        placeholder="Location or access information"
      />
    </div>
  </div>
);