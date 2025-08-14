import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';

interface AllFormsProps {
  onNext: () => void;
  onPrevious: () => void;
  formType: string;
  title: string;
  description: string;
}

const AllFormsWithPersistence: React.FC<AllFormsProps> = ({ onNext, onPrevious, formType, title, description }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const { user } = useAuth();
  const { syncForm } = useDatabaseSync();

  useEffect(() => {
    const savedData = localStorage.getItem(formType);
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, [formType]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user?.email) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your data.",
        variant: "destructive",
      });
      return;
    }

    try {
      await syncForm(user.email, formType, formData);
      toast({
        title: "Success!",
        description: `${title} information has been saved to database.`,
      });
      onNext();
    } catch (error) {
      console.error('Error saving form data:', error);
      toast({
        title: "Error",
        description: "Failed to save to database. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderFormFields = () => {
    switch (formType) {
      case 'passportCitizenship':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="passportNumber">Passport Number</Label>
              <Input
                id="passportNumber"
                value={formData.passportNumber || ''}
                onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                placeholder="Enter passport number"
              />
            </div>
            <div>
              <Label htmlFor="citizenship">Citizenship</Label>
              <Input
                id="citizenship"
                value={formData.citizenship || ''}
                onChange={(e) => handleInputChange('citizenship', e.target.value)}
                placeholder="Enter citizenship"
              />
            </div>
          </div>
        );
      case 'emergencyContacts':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="contactName">Emergency Contact Name</Label>
              <Input
                id="contactName"
                value={formData.contactName || ''}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                placeholder="Enter contact name"
              />
            </div>
            <div>
              <Label htmlFor="contactPhone">Phone Number</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone || ''}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>
        );
      case 'medicalInfo':
        return (
          <div className="space-y-4">
            <div>
                              <Label htmlFor="primaryPhysician">Primary Physician</Label>
                <Input
                  id="primaryPhysician"
                  value={formData.primaryPhysician || ''}
                  onChange={(e) => handleInputChange('primaryPhysician', e.target.value)}
                  placeholder="Enter primary physician name"
              />
            </div>
            <div>
              <Label htmlFor="medications">Current Medications</Label>
              <Textarea
                id="medications"
                value={formData.medications || ''}
                onChange={(e) => handleInputChange('medications', e.target.value)}
                placeholder="List current medications"
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="generalInfo">Information</Label>
              <Textarea
                id="generalInfo"
                value={formData.generalInfo || ''}
                onChange={(e) => handleInputChange('generalInfo', e.target.value)}
                placeholder={`Enter ${title.toLowerCase()} information...`}
                className="min-h-[200px]"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-primary">{title}</CardTitle>
          <CardDescription className="text-subtext leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderFormFields()}
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

export default AllFormsWithPersistence;