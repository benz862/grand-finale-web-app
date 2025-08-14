import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Trash2, Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import EmergencyContactCard from './forms/EmergencyContactCard';

interface EmergencyContact {
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

interface EmergencyContactsFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

const EmergencyContactsForm: React.FC<EmergencyContactsFormProps> = ({ onNext, onPrevious }) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const { syncForm } = useDatabaseSync();

  useEffect(() => {
    // Load from localStorage for now, will be replaced with database loading
    const savedData = localStorage.getItem('emergencyContacts');
    if (savedData) {
      setContacts(JSON.parse(savedData));
    } else {
      // Add initial contact
      addContact();
    }
  }, []);

  const createEmptyContact = (): EmergencyContact => ({
    id: Date.now().toString(),
    full_name: '',
    relationship: '',
    custom_relationship: '',
    phone: '',
    phone_alt: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    is_primary: false,
    notes: ''
  });

  const addContact = () => {
    const newContact = createEmptyContact();
    setContacts(prev => [...prev, newContact]);
  };

  const updateContact = (id: string, field: string, value: string | boolean) => {
    setContacts(prev => prev.map(contact => {
      if (contact.id === id) {
        // Handle primary contact logic
        if (field === 'is_primary' && value === true) {
          // Set all others to false first
          const updated = prev.map(c => ({ ...c, is_primary: false }));
          return updated.find(c => c.id === id) ? { ...updated.find(c => c.id === id)!, [field]: value } : contact;
        }
        return { ...contact, [field]: value };
      }
      // If setting another contact as primary, unset this one
      if (field === 'is_primary' && value === true) {
        return { ...contact, is_primary: false };
      }
      return contact;
    }));
  };

  const deleteContact = (id: string) => {
    if (contacts.length > 1) {
      setContacts(prev => prev.filter(contact => contact.id !== id));
    }
  };

  const validateForm = (): boolean => {
    if (contacts.length === 0) {
      toast({
        title: "Error",
        description: "At least one emergency contact is required.",
        variant: "destructive"
      });
      return false;
    }

    for (const contact of contacts) {
      if (!contact.full_name.trim()) {
        toast({
          title: "Error",
          description: "Full name is required for all emergency contacts.",
          variant: "destructive"
        });
        return false;
      }
      if (!contact.phone.trim()) {
        toast({
          title: "Error",
          description: "Phone number is required for all emergency contacts.",
          variant: "destructive"
        });
        return false;
      }
      if (contact.relationship === 'Other' && !contact.custom_relationship.trim()) {
        toast({
          title: "Error",
          description: "Custom relationship is required when 'Other' is selected.",
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    if (!user?.email) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your data.",
        variant: "destructive",
      });
      return;
    }

    try {
      await syncForm(user.email, 'emergencyContactsData', contacts);
      toast({
        title: "Success",
        description: "Emergency contacts saved to database!"
      });
      onNext();
    } catch (error) {
      console.error('Error saving emergency contacts:', error);
      toast({
        title: "Error",
        description: "Failed to save to database. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-primary">Emergency Contacts</CardTitle>
          <CardDescription className="text-subtext leading-relaxed">
            Please provide trusted contacts who can be reached in case of emergency. This helps ensure your loved ones know who to call.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            {contacts.map((contact) => (
              <EmergencyContactCard
                key={contact.id}
                contact={contact}
                onUpdate={updateContact}
                onDelete={deleteContact}
                canDelete={contacts.length > 1}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={addContact}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Another Emergency Contact</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between sticky bottom-0 bg-background/80 backdrop-blur-sm p-4 rounded-lg">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>
        
        <div className="text-sm text-muted-foreground self-center">
          You're doing great — just a few more steps
        </div>
        
        <Button
          type="button"
          onClick={handleSave}
          className="flex items-center space-x-2 bg-action hover:bg-action/90"
        >
          <span>Save & Continue</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EmergencyContactsForm;