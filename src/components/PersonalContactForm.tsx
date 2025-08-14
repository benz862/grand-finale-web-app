import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDatabaseSync } from '@/lib/databaseSync';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus } from 'lucide-react';
import PrimaryContactSection from './forms/PrimaryContactSection';
import AddressSection from './forms/AddressSection';
import PhoneSection from './forms/PhoneSection';
import EmailSection from './forms/EmailSection';

interface PersonalContactFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

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

interface Phone {
  id: string;
  phoneType: string;
  phoneNumber: string;
  isPrimary: boolean;
}

interface Email {
  id: string;
  email: string;
  emailType: string;
  isPrimary: boolean;
}

const PersonalContactForm: React.FC<PersonalContactFormProps> = ({ onNext, onPrevious }) => {
  const { toast } = useToast();
  const { syncForm } = useDatabaseSync();
  
  // Primary Contact state
  const [preferredName, setPreferredName] = useState('');
  const [languageSpoken, setLanguageSpoken] = useState('');
  const [customLanguage, setCustomLanguage] = useState('');
  
  // Address state
  const [addresses, setAddresses] = useState<Address[]>([{
    id: '1',
    addressType: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    isPrimary: true
  }]);
  
  // Phone state
  const [phones, setPhones] = useState<Phone[]>([{
    id: '1',
    phoneType: '',
    phoneNumber: '',
    isPrimary: true
  }]);
  
  // Email state
  const [emails, setEmails] = useState<Email[]>([{
    id: '1',
    email: '',
    emailType: '',
    isPrimary: true
  }]);

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('personalContactData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setPreferredName(data.preferredName || '');
      setLanguageSpoken(data.languageSpoken || '');
      setCustomLanguage(data.customLanguage || '');
      setAddresses(data.addresses || [{
        id: '1',
        addressType: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        isPrimary: true
      }]);
      setPhones(data.phones || [{
        id: '1',
        phoneType: '',
        phoneNumber: '',
        isPrimary: true
      }]);
      setEmails(data.emails || [{
        id: '1',
        email: '',
        emailType: '',
        isPrimary: true
      }]);
    }
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    // Validate addresses
    for (const address of addresses) {
      if (!address.addressType || !address.street || !address.city || !address.state || !address.zip || !address.country) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required address fields.",
          variant: "destructive",
        });
        return false;
      }
    }

    // Validate phones
    for (const phone of phones) {
      if (!phone.phoneType || !phone.phoneNumber) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required phone fields.",
          variant: "destructive",
        });
        return false;
      }
    }

    // Validate emails
    for (const email of emails) {
      if (!email.email || !email.emailType) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required email fields.",
          variant: "destructive",
        });
        return false;
      }
      if (!validateEmail(email.email)) {
        toast({
          title: "Validation Error",
          description: "Please enter valid email addresses.",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSaveAndContinue = async () => {
    if (!validateForm()) return;

    const formData = {
      preferredName,
      languageSpoken: languageSpoken === 'other' ? customLanguage : languageSpoken,
      customLanguage,
      addresses,
      phones,
      emails,
    };

    // Get current Supabase user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Save to database
    if (user?.email) {
      try {
        const result = await syncForm(user.email, 'personalContactData', formData);
        if (result.success) {
          toast({
            title: "Success!",
            description: "Your contact information has been saved to the database. Proceeding to Section 3.",
          });
        } else {
          toast({
            title: "Error",
            description: "There was an issue saving to the database. Proceeding to Section 3.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Database sync error:', error);
        toast({
          title: "Error",
          description: "There was an issue saving to the database. Proceeding to Section 3.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your contact information to the database.",
        variant: "destructive",
      });
    }

    // Navigate to next section
    onNext();
  };

  return (
    <div className="space-y-6">
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-primary">Personal Contact Details</CardTitle>
          <CardDescription className="text-subtext leading-relaxed">
            Let's gather your contact information to help your loved ones reach you when needed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <PrimaryContactSection
            preferredName={preferredName}
            languageSpoken={languageSpoken}
            customLanguage={customLanguage}
            onPreferredNameChange={setPreferredName}
            onLanguageSpokenChange={setLanguageSpoken}
            onCustomLanguageChange={setCustomLanguage}
          />

          <AddressSection
            addresses={addresses}
            onAddressesChange={setAddresses}
          />

          <PhoneSection
            phones={phones}
            onPhonesChange={setPhones}
          />

          <EmailSection
            emails={emails}
            onEmailsChange={setEmails}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between sticky bottom-0 bg-background/80 backdrop-blur-sm p-4 rounded-lg">
        <Button
          onClick={onPrevious}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>
        
        <div className="text-sm text-muted-foreground self-center">
          You're doing great — just a few more steps
        </div>
        
        <Button
          onClick={handleSaveAndContinue}
          className="flex items-center space-x-2 bg-action hover:bg-action/90"
        >
          <span>Save & Continue</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PersonalContactForm;