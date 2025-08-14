import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { allCountries } from '../../data/countryRegionData';

interface Address {
  id: string;
  addressType: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isPrimary: boolean;
}

interface AddressSectionProps {
  addresses: Address[];
  onAddressesChange: (addresses: Address[]) => void;
}

const countries = allCountries;

const AddressSection: React.FC<AddressSectionProps> = ({ addresses, onAddressesChange }) => {
  const addAddress = () => {
    const newAddress: Address = {
      id: Date.now().toString(),
      addressType: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      isPrimary: addresses.length === 0
    };
    onAddressesChange([...addresses, newAddress]);
  };

  const removeAddress = (id: string) => {
    onAddressesChange(addresses.filter(addr => addr.id !== id));
  };

  const updateAddress = (id: string, field: keyof Address, value: any) => {
    onAddressesChange(addresses.map(addr => {
      if (addr.id === id) {
        if (field === 'isPrimary' && value) {
          return { ...addr, [field]: value };
        }
        return { ...addr, [field]: value };
      }
      if (field === 'isPrimary' && value) {
        return { ...addr, isPrimary: false };
      }
      return addr;
    }));
  };

  return (
    <div className="neumorphic-card p-6">
      <h3 className="text-lg font-serif font-semibold text-primary mb-4">
        Address Information
      </h3>
      
      {addresses.map((address, index) => (
        <div key={address.id} className="mb-6 p-4 neumorphic-card">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-text">Address {index + 1}</h4>
            {addresses.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeAddress(address.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-text">Address type *</Label>
              <Select value={address.addressType} onValueChange={(value) => updateAddress(address.id, 'addressType', value)}>
                <SelectTrigger className="neumorphic-input mt-2">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-text">Country *</Label>
              <Select value={address.country} onValueChange={(value) => updateAddress(address.id, 'country', value)}>
                <SelectTrigger className="neumorphic-input mt-2">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4">
            <Label className="text-sm font-medium text-text">Street address *</Label>
            <Input
              value={address.street}
              onChange={(e) => updateAddress(address.id, 'street', e.target.value)}
              className="neumorphic-input mt-2"
              placeholder="Enter street address"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <Label className="text-sm font-medium text-text">City *</Label>
              <Input
                value={address.city}
                onChange={(e) => updateAddress(address.id, 'city', e.target.value)}
                className="neumorphic-input mt-2"
                placeholder="City"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-text">State/Province *</Label>
              <Input
                value={address.state}
                onChange={(e) => updateAddress(address.id, 'state', e.target.value)}
                className="neumorphic-input mt-2"
                placeholder="State/Province"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-text">Postal/ZIP Code *</Label>
              <Input
                value={address.zip}
                onChange={(e) => updateAddress(address.id, 'zip', e.target.value)}
                className="neumorphic-input mt-2"
                placeholder="ZIP Code"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4">
            <Switch
              checked={address.isPrimary}
              onCheckedChange={(checked) => updateAddress(address.id, 'isPrimary', checked)}
            />
            <Label className="text-sm font-medium text-text">
              This is my current mailing address
            </Label>
          </div>
        </div>
      ))}
      
      <Button
        onClick={addAddress}
        variant="outline"
        className="w-full mt-4 border-dashed border-2 border-gray-300 hover:border-primary hover:bg-primary/10"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Address
      </Button>
    </div>
  );
};

export default AddressSection;