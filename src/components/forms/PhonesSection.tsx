import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { formatPhoneNumber } from '@/lib/phoneNumberFormatter';

interface Phone {
  number: string;
  type: string;
}

interface PhonesSectionProps {
  phones: Phone[];
  onPhonesChange: (phones: Phone[]) => void;
}

const PhonesSection: React.FC<PhonesSectionProps> = ({
  phones,
  onPhonesChange
}) => {
  const phoneTypes = ['Mobile', 'Home', 'Work', 'Other'];

  const addPhone = () => {
    onPhonesChange([...phones, { number: '', type: '' }]);
  };

  const removePhone = (index: number) => {
    const updated = phones.filter((_, i) => i !== index);
    onPhonesChange(updated);
  };

  const updatePhone = (index: number, field: keyof Phone, value: string) => {
    if (field === 'number') {
      // Use phone number formatting
      const formatted = formatPhoneNumber(value);
      const updated = [...phones];
      updated[index] = { ...updated[index], [field]: formatted.formatted };
      onPhonesChange(updated);
    } else {
      const updated = [...phones];
      updated[index] = { ...updated[index], [field]: value };
      onPhonesChange(updated);
    }
  };

  // Initialize with one phone if empty
  React.useEffect(() => {
    if (phones.length === 0) {
      onPhonesChange([{ number: '', type: '' }]);
    }
  }, [phones.length, onPhonesChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phone Numbers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {phones.map((phone, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h5 className="font-medium">Phone {index + 1}</h5>
              {phones.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removePhone(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  value={phone.number}
                  onChange={(e) => updatePhone(index, 'number', e.target.value)}
                  placeholder="(555) 123-4567 or +1 234 567 8900"
                  type="tel"
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={phone.type} onValueChange={(value) => updatePhone(index, 'type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {phoneTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addPhone}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Phone Number
        </Button>
      </CardContent>
    </Card>
  );
};

export default PhonesSection;