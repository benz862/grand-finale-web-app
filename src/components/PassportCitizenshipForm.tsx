import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import PassportCard from './forms/PassportCard';

interface PassportData {
  id: string;
  issuing_country: string;
  passport_number: string;
  issue_date: string;
  expiration_date: string;
  document_location: string;
  notes: string;
}

interface PassportCitizenshipFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France',
  'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Japan',
  'South Korea', 'China', 'India', 'Brazil', 'Mexico', 'Argentina', 'Chile'
];

const PassportCitizenshipForm: React.FC<PassportCitizenshipFormProps> = ({ onNext, onPrevious }) => {
  const [passports, setPassports] = useState<PassportData[]>([]);
  const [hasDualCitizenship, setHasDualCitizenship] = useState<string>('');
  const { toast } = useToast();
  const { user } = useAuth();
  const { syncForm } = useDatabaseSync();

  useEffect(() => {
    const savedData = localStorage.getItem('passportCitizenshipData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setPassports(parsed.passports || []);
      setHasDualCitizenship(parsed.hasDualCitizenship || '');
    }
  }, []);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addPassport = () => {
    const newPassport: PassportData = {
      id: generateId(),
      issuing_country: '',
      passport_number: '',
      issue_date: '',
      expiration_date: '',
      document_location: '',
      notes: ''
    };
    setPassports([...passports, newPassport]);
  };

  const updatePassport = (id: string, field: string, value: string) => {
    setPassports(passports.map(passport => 
      passport.id === id ? { ...passport, [field]: value } : passport
    ));
  };

  const deletePassport = (id: string) => {
    setPassports(passports.filter(passport => passport.id !== id));
  };

  const validateForm = () => {
    if (passports.length === 0) {
      toast({ title: 'Error', description: 'Please add at least one passport.', variant: 'destructive' });
      return false;
    }

    for (const passport of passports) {
      if (!passport.issuing_country || !passport.passport_number || !passport.issue_date || !passport.expiration_date) {
        toast({ title: 'Error', description: 'Please fill in all required passport fields.', variant: 'destructive' });
        return false;
      }

      if (new Date(passport.expiration_date) <= new Date(passport.issue_date)) {
        toast({ title: 'Error', description: 'Expiration date must be after issue date.', variant: 'destructive' });
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

    const formData = {
      passports,
      hasDualCitizenship
    };

    try {
      await syncForm(user.email, 'passportCitizenshipData', formData);
      toast({ title: 'Success', description: 'Passport & citizenship details saved to database!' });
      onNext();
    } catch (error) {
      console.error('Error saving passport data:', error);
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
          <CardTitle className="text-2xl font-serif text-primary">Passport & Citizenship</CardTitle>
          <CardDescription className="text-subtext leading-relaxed">
            Let's document your travel documents and citizenship information for your loved ones.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Do you have dual or multiple citizenships?</Label>
            <RadioGroup value={hasDualCitizenship} onValueChange={setHasDualCitizenship} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Yes" id="dual-yes" />
                <Label htmlFor="dual-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="dual-no" />
                <Label htmlFor="dual-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            {passports.map((passport, index) => (
              <PassportCard
                key={passport.id}
                passport={passport}
                index={index}
                onUpdate={updatePassport}
                onDelete={deletePassport}
                countries={COUNTRIES}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <Button onClick={addPassport} variant="outline" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Another Passport</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between sticky bottom-0 bg-background/80 backdrop-blur-sm p-4 rounded-lg">
        <Button onClick={onPrevious} variant="skillbinder" className="skillbinder flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>
        
        <div className="text-sm text-muted-foreground self-center">
          You're doing great — just a few more steps
        </div>
        
        <Button onClick={handleSave} className="flex items-center space-x-2 bg-action hover:bg-action/90">
          <span>Save & Continue</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PassportCitizenshipForm;