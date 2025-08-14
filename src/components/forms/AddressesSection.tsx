import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface AddressesSectionProps {
  currentAddress: Address;
  pastAddresses: Address[];
  onCurrentAddressChange: (address: Address) => void;
  onPastAddressesChange: (addresses: Address[]) => void;
}

const AddressesSection: React.FC<AddressesSectionProps> = ({
  currentAddress,
  pastAddresses,
  onCurrentAddressChange,
  onPastAddressesChange
}) => {
  const addPastAddress = () => {
    onPastAddressesChange([...pastAddresses, {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }]);
  };

  const removePastAddress = (index: number) => {
    const updated = pastAddresses.filter((_, i) => i !== index);
    onPastAddressesChange(updated);
  };

  const updatePastAddress = (index: number, field: keyof Address, value: string) => {
    const updated = [...pastAddresses];
    updated[index] = { ...updated[index], [field]: value };
    onPastAddressesChange(updated);
  };

  const updateCurrentAddress = (field: keyof Address, value: string) => {
    onCurrentAddressChange({ ...currentAddress, [field]: value });
  };

  const AddressForm = ({ address, onChange, title }: {
    address: Address;
    onChange: (field: keyof Address, value: string) => void;
    title: string;
  }) => (
    <div className="space-y-4">
      <h4 className="font-medium">{title}</h4>
      <div className="space-y-2">
        <Label>Street Address</Label>
        <Input
          value={address.street}
          onChange={(e) => onChange('street', e.target.value)}
          placeholder="Enter street address"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>City</Label>
          <Input
            value={address.city}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="City"
          />
        </div>
        <div className="space-y-2">
          <Label>State/Territory</Label>
          <Input
            value={address.state}
            onChange={(e) => onChange('state', e.target.value)}
            placeholder="State/Territory"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>ZIP Code</Label>
          <Input
            value={address.zipCode}
            onChange={(e) => onChange('zipCode', e.target.value)}
            placeholder="ZIP Code"
          />
        </div>
        <div className="space-y-2">
          <Label>Country (if residing abroad)</Label>
          <Input
            value={address.country}
            onChange={(e) => onChange('country', e.target.value)}
            placeholder="Country"
          />
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current & Past Addresses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <AddressForm
          address={currentAddress}
          onChange={updateCurrentAddress}
          title="Present Address"
        />
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Past Addresses</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPastAddress}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Past Address
            </Button>
          </div>
          
          {pastAddresses.map((address, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="font-medium">Past Address {index + 1}</h5>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removePastAddress(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <AddressForm
                address={address}
                onChange={(field, value) => updatePastAddress(index, field, value)}
                title=""
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressesSection;