import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Trash2 } from 'lucide-react';
import { formatPhoneNumber } from '@/lib/phoneNumberFormatter';

interface Contact {
  id: string;
  contact_type: string;
  full_name: string;
  phone: string;
  email: string;
  company: string;
  relationship: string;
  notes: string;
}

interface LegalFinancialContactsSectionProps {
  contacts: Contact[];
  onAddContact: () => void;
  onUpdateContact: (id: string, field: string, value: string) => void;
  onDeleteContact: (id: string) => void;
}

const LegalFinancialContactsSection: React.FC<LegalFinancialContactsSectionProps> = ({ 
  contacts, 
  onAddContact, 
  onUpdateContact, 
  onDeleteContact 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Legal & Financial Contacts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {contacts.map((contact, index) => (
          <div key={contact.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Contact {index + 1}
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onDeleteContact(contact.id)}
                className="rounded-full w-8 h-8 p-0 bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-gray-400"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`contact-type-${contact.id}`}>Contact Type</Label>
                <Select
                  value={contact.contact_type}
                  onValueChange={(value) => onUpdateContact(contact.id, 'contact_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="estate_attorney">Estate Attorney</SelectItem>
                    <SelectItem value="financial_advisor">Financial Advisor</SelectItem>
                    <SelectItem value="accountant">Accountant</SelectItem>
                    <SelectItem value="insurance_agent">Insurance Agent</SelectItem>
                    <SelectItem value="banker">Banker</SelectItem>
                    <SelectItem value="investment_advisor">Investment Advisor</SelectItem>
                    <SelectItem value="tax_preparer">Tax Preparer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`full-name-${contact.id}`}>Full Name</Label>
                <Input
                  id={`full-name-${contact.id}`}
                  value={contact.full_name}
                  onChange={(e) => onUpdateContact(contact.id, 'full_name', e.target.value)}
                  placeholder="Enter contact's full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`phone-${contact.id}`}>Phone Number</Label>
                <Input
                  id={`phone-${contact.id}`}
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => onUpdateContact(contact.id, 'phone', e.target.value)}
                  placeholder="(555) 123-4567 or +1 234 567 8900"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`email-${contact.id}`}>Email</Label>
                <Input
                  id={`email-${contact.id}`}
                  type="email"
                  value={contact.email}
                  onChange={(e) => onUpdateContact(contact.id, 'email', e.target.value)}
                  placeholder="contact@company.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`company-${contact.id}`}>Company/Organization</Label>
                <Input
                  id={`company-${contact.id}`}
                  value={contact.company}
                  onChange={(e) => onUpdateContact(contact.id, 'company', e.target.value)}
                  placeholder="Enter company or organization name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`relationship-${contact.id}`}>Relationship</Label>
                <Input
                  id={`relationship-${contact.id}`}
                  value={contact.relationship}
                  onChange={(e) => onUpdateContact(contact.id, 'relationship', e.target.value)}
                  placeholder="e.g., Primary advisor, Secondary contact"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`notes-${contact.id}`}>Notes</Label>
              <Input
                id={`notes-${contact.id}`}
                value={contact.notes}
                onChange={(e) => onUpdateContact(contact.id, 'notes', e.target.value)}
                placeholder="Any additional notes about this contact"
              />
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={onAddContact}
          className="w-full"
        >
          + Add Another Contact
        </Button>
      </CardContent>
    </Card>
  );
};

export default LegalFinancialContactsSection;