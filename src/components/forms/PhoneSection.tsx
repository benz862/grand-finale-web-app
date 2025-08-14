import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';

interface Phone {
  id: string;
  phoneType: string;
  phoneNumber: string;
  isPrimary: boolean;
}

interface PhoneSectionProps {
  phones: Phone[];
  onPhonesChange: (phones: Phone[]) => void;
}

const PhoneSection: React.FC<PhoneSectionProps> = ({ phones, onPhonesChange }) => {
  const addPhone = () => {
    const newPhone: Phone = {
      id: Date.now().toString(),
      phoneType: '',
      phoneNumber: '',
      isPrimary: phones.length === 0
    };
    onPhonesChange([...phones, newPhone]);
  };

  const removePhone = (id: string) => {
    onPhonesChange(phones.filter(phone => phone.id !== id));
  };

  const updatePhone = (id: string, field: keyof Phone, value: any) => {
    onPhonesChange(phones.map(phone => {
      if (phone.id === id) {
        if (field === 'isPrimary' && value) {
          return { ...phone, [field]: value };
        }
        return { ...phone, [field]: value };
      }
      if (field === 'isPrimary' && value) {
        return { ...phone, isPrimary: false };
      }
      return phone;
    }));
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (id: string, value: string) => {
    const formatted = formatPhoneNumber(value);
    updatePhone(id, 'phoneNumber', formatted);
  };

  return (
    <div className="neumorphic-card p-6">
      <h3 className="text-lg font-serif font-semibold text-primary mb-4">
        Phone Numbers
      </h3>
      
      {phones.map((phone, index) => (
        <div key={phone.id} className="mb-6 p-4 neumorphic-card">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-text">Phone {index + 1}</h4>
            {phones.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removePhone(phone.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-text">Phone type *</Label>
              <Select value={phone.phoneType} onValueChange={(value) => updatePhone(phone.id, 'phoneType', value)}>
                <SelectTrigger className="neumorphic-input mt-2">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-text">Phone number *</Label>
              <Input
                value={phone.phoneNumber}
                onChange={(e) => handlePhoneChange(phone.id, e.target.value)}
                className="neumorphic-input mt-2"
                placeholder="(555) 123-4567"
                maxLength={14}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4">
            <Switch
              checked={phone.isPrimary}
              onCheckedChange={(checked) => updatePhone(phone.id, 'isPrimary', checked)}
            />
            <Label className="text-sm font-medium text-text">
              Is this your primary phone number?
            </Label>
          </div>
        </div>
      ))}
      
      <Button
        onClick={addPhone}
        variant="outline"
        className="w-full mt-4 border-dashed border-2 border-gray-300 hover:border-primary hover:bg-primary/10"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Phone Number
      </Button>
    </div>
  );
};

export default PhoneSection;