import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { formatPhoneNumber } from '@/lib/phoneNumberFormatter';

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

interface EmergencyContactsSectionProps {
  emergencyContacts: EmergencyContact[];
  onEmergencyContactsChange: (contacts: EmergencyContact[]) => void;
}

const EmergencyContactsSection: React.FC<EmergencyContactsSectionProps> = ({
  emergencyContacts,
  onEmergencyContactsChange
}) => {
  const addContact = () => {
    onEmergencyContactsChange([...emergencyContacts, {
      name: '',
      relationship: '',
      phone: ''
    }]);
  };

  const removeContact = (index: number) => {
    const updated = emergencyContacts.filter((_, i) => i !== index);
    onEmergencyContactsChange(updated);
  };

  const updateContact = (index: number, field: keyof EmergencyContact, value: string) => {
    if (field === 'phone') {
      // Use phone number formatting
      const formatted = formatPhoneNumber(value);
      const updated = [...emergencyContacts];
      updated[index] = { ...updated[index], [field]: formatted.formatted };
      onEmergencyContactsChange(updated);
    } else {
      const updated = [...emergencyContacts];
      updated[index] = { ...updated[index], [field]: value };
      onEmergencyContactsChange(updated);
    }
  };

  // Initialize with one contact if empty
  React.useEffect(() => {
    if (emergencyContacts.length === 0) {
      onEmergencyContactsChange([{ name: '', relationship: '', phone: '' }]);
    }
  }, [emergencyContacts.length, onEmergencyContactsChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Contacts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {emergencyContacts.map((contact, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h5 className="font-medium">Emergency Contact {index + 1}</h5>
              {emergencyContacts.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeContact(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={contact.name}
                  onChange={(e) => updateContact(index, 'name', e.target.value)}
                  placeholder="Enter full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Relationship</Label>
                <Input
                  value={contact.relationship}
                  onChange={(e) => updateContact(index, 'relationship', e.target.value)}
                  placeholder="e.g., Spouse, Child, Parent, Friend"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  value={contact.phone}
                  onChange={(e) => updateContact(index, 'phone', e.target.value)}
                  placeholder="(555) 123-4567 or +1 234 567 8900"
                  type="tel"
                />
              </div>
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addContact}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Emergency Contact
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmergencyContactsSection;