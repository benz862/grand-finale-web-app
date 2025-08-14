import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { allCountries } from '../../data/countryRegionData';

export interface EmergencyContact {
  id: string;
  full_name: string;
  relationship: string;
  custom_relationship: string;
  phone: string;
  phone_alt: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_primary: boolean;
  notes: string;
}

interface EmergencyContactCardProps {
  contact: EmergencyContact;
  onUpdate: (id: string, field: string, value: string | boolean) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}

const RELATIONSHIPS = [
  'Spouse', 'Partner', 'Parent', 'Sibling', 'Friend', 'Neighbor', 'Other'
];

const COUNTRIES = allCountries;

import { formatPhoneNumber } from '@/lib/phoneNumberFormatter';

const formatPhone = (value: string) => {
  const formatted = formatPhoneNumber(value);
  return formatted.formatted;
};

const EmergencyContactCard: React.FC<EmergencyContactCardProps> = ({
  contact,
  onUpdate,
  onDelete,
  canDelete
}) => {
  const handlePhoneChange = (field: string, value: string) => {
    const formatted = formatPhone(value);
    onUpdate(contact.id, field, formatted);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Emergency Contact</CardTitle>
        {canDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(contact.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`name-${contact.id}`}>Full name *</Label>
            <Input
              id={`name-${contact.id}`}
              value={contact.full_name}
              onChange={(e) => onUpdate(contact.id, 'full_name', e.target.value)}
              placeholder="Enter full name"
            />
          </div>
          <div>
            <Label htmlFor={`relationship-${contact.id}`}>Relationship to you *</Label>
            <Select
              value={contact.relationship}
              onValueChange={(value) => onUpdate(contact.id, 'relationship', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                {RELATIONSHIPS.map((rel) => (
                  <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {contact.relationship === 'Other' && (
          <div>
            <Label htmlFor={`custom-${contact.id}`}>Custom relationship *</Label>
            <Input
              id={`custom-${contact.id}`}
              value={contact.custom_relationship}
              onChange={(e) => onUpdate(contact.id, 'custom_relationship', e.target.value)}
              placeholder="Specify relationship"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`phone-${contact.id}`}>Phone number *</Label>
            <Input
              id={`phone-${contact.id}`}
              value={contact.phone}
              onChange={(e) => handlePhoneChange('phone', e.target.value)}
              placeholder="(555) 123-4567 or +1 234 567 8900"
            />
          </div>
          <div>
            <Label htmlFor={`phone-alt-${contact.id}`}>Secondary phone (optional)</Label>
            <Input
              id={`phone-alt-${contact.id}`}
              value={contact.phone_alt}
              onChange={(e) => handlePhoneChange('phone_alt', e.target.value)}
              placeholder="(555) 123-4567 or +1 234 567 8900"
            />
          </div>
        </div>

        <div>
          <Label htmlFor={`email-${contact.id}`}>Email address</Label>
          <Input
            id={`email-${contact.id}`}
            type="email"
            value={contact.email}
            onChange={(e) => onUpdate(contact.id, 'email', e.target.value)}
            placeholder="email@example.com"
          />
        </div>

        <div>
          <Label htmlFor={`address-${contact.id}`}>Street address</Label>
          <Input
            id={`address-${contact.id}`}
            value={contact.address}
            onChange={(e) => onUpdate(contact.id, 'address', e.target.value)}
            placeholder="123 Main Street"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor={`city-${contact.id}`}>City</Label>
            <Input
              id={`city-${contact.id}`}
              value={contact.city}
              onChange={(e) => onUpdate(contact.id, 'city', e.target.value)}
              placeholder="City"
            />
          </div>
          <div>
            <Label htmlFor={`state-${contact.id}`}>State/Province</Label>
            <Input
              id={`state-${contact.id}`}
              value={contact.state}
              onChange={(e) => onUpdate(contact.id, 'state', e.target.value)}
              placeholder="State"
            />
          </div>
          <div>
            <Label htmlFor={`zip-${contact.id}`}>Postal/ZIP Code</Label>
            <Input
              id={`zip-${contact.id}`}
              value={contact.zip}
              onChange={(e) => onUpdate(contact.id, 'zip', e.target.value)}
              placeholder="12345"
            />
          </div>
        </div>

        <div>
          <Label htmlFor={`country-${contact.id}`}>Country</Label>
          <Select
            value={contact.country}
            onValueChange={(value) => onUpdate(contact.id, 'country', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id={`primary-${contact.id}`}
            checked={contact.is_primary}
            onCheckedChange={(checked) => onUpdate(contact.id, 'is_primary', checked)}
          />
          <Label htmlFor={`primary-${contact.id}`}>Is this your primary emergency contact?</Label>
        </div>

        <div>
          <Label htmlFor={`notes-${contact.id}`}>Additional notes (optional)</Label>
          <Textarea
            id={`notes-${contact.id}`}
            value={contact.notes}
            onChange={(e) => onUpdate(contact.id, 'notes', e.target.value)}
            placeholder="Any additional notes..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyContactCard;
