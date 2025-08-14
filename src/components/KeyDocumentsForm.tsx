import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface KeyDocumentsFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

const KeyDocumentsForm: React.FC<KeyDocumentsFormProps> = ({ onNext, onPrevious }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { syncForm } = useDatabaseSync();
  
  const [formData, setFormData] = useState({
    guardianship_name: '',
    guardianship_location: '',
    burial_cremation: '',
    burial_form_location: '',
    hipaa_form_location: '',
    digital_will_exists: '',
    digital_will_location: '',
    digital_will_instructions: ''
  });

  useEffect(() => {
    // Load from localStorage for now, will be replaced with database loading
    const savedData = localStorage.getItem('keyDocumentsForm');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (field: string, value: string) => {
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
      await syncForm(user.email, 'keyDocumentsData', formData);
      toast({
        title: 'Key Documents Saved',
        description: 'Your document information has been saved to database.',
      });
      onNext();
    } catch (error) {
      console.error('Error saving key documents:', error);
      toast({
        title: "Error",
        description: "Failed to save to database. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="text-2xl font-bold text-center">
              Key Documents & Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="supporting-docs">
                <AccordionTrigger>Supporting Legal Documents</AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Guardianship Designation</Label>
                          <Input
                            value={formData.guardianship_name || ''}
                            onChange={(e) => handleChange('guardianship_name', e.target.value)}
                            placeholder="Enter guardianship designation"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Document Location</Label>
                          <Input
                            value={formData.guardianship_location || ''}
                            onChange={(e) => handleChange('guardianship_location', e.target.value)}
                            placeholder="Enter document location"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label>Burial or Cremation</Label>
                        <RadioGroup
                          value={formData.burial_cremation || ''}
                          onValueChange={(value) => handleChange('burial_cremation', value)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="burial" id="burial" />
                            <Label htmlFor="burial">Burial</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cremation" id="cremation" />
                            <Label htmlFor="cremation">Cremation</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Signed Form Location</Label>
                          <Input
                            value={formData.burial_form_location || ''}
                            onChange={(e) => handleChange('burial_form_location', e.target.value)}
                            placeholder="Enter form location"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>HIPAA Release Form Location</Label>
                          <Input
                            value={formData.hipaa_form_location || ''}
                            onChange={(e) => handleChange('hipaa_form_location', e.target.value)}
                            placeholder="Enter HIPAA form location"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Digital or Social Media Will Exists?</Label>
                        <RadioGroup
                          value={formData.digital_will_exists || ''}
                          onValueChange={(value) => handleChange('digital_will_exists', value)}
                        >
                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Yes" id="digital-yes" />
                <Label htmlFor="digital-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="digital-no" />
                            <Label htmlFor="digital-no">No</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Executor/Digital Manager Name</Label>
                          <Input
                            value={formData.digital_executor_name || ''}
                            onChange={(e) => handleChange('digital_executor_name', e.target.value)}
                            placeholder="Enter digital manager name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location of Document / Passwords</Label>
                          <Textarea
                            value={formData.digital_doc_location || ''}
                            onChange={(e) => handleChange('digital_doc_location', e.target.value)}
                            placeholder="Enter document/password location"
                            rows={3}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="safe-details">
                <AccordionTrigger>Personal Safe Details</AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Type & Brand of Safe</Label>
                          <Input
                            value={formData.safe_type || ''}
                            onChange={(e) => handleChange('safe_type', e.target.value)}
                            placeholder="Enter safe type and brand"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={formData.safe_location || ''}
                            onChange={(e) => handleChange('safe_location', e.target.value)}
                            placeholder="Enter safe location"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Access Code or Key Location</Label>
                        <Input
                          value={formData.safe_code_location || ''}
                          onChange={(e) => handleChange('safe_code_location', e.target.value)}
                          placeholder="Enter access code or key location"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Individuals with Access</Label>
                        <Textarea
                          value={formData.safe_people_with_access || ''}
                          onChange={(e) => handleChange('safe_people_with_access', e.target.value)}
                          placeholder="List individuals with access..."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Content Overview</Label>
                        <Textarea
                          value={formData.safe_contents || ''}
                          onChange={(e) => handleChange('safe_contents', e.target.value)}
                          placeholder="Describe safe contents..."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Instructions for Opening / Access</Label>
                        <Textarea
                          value={formData.safe_instructions || ''}
                          onChange={(e) => handleChange('safe_instructions', e.target.value)}
                          placeholder="Enter opening instructions..."
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="safe-deposit">
                <AccordionTrigger>Safe Deposit Box</AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Bank Name & Branch Location</Label>
                          <Input
                            value={formData.safe_deposit_bank || ''}
                            onChange={(e) => handleChange('safe_deposit_bank', e.target.value)}
                            placeholder="Enter bank name and branch"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Box Number</Label>
                          <Input
                            value={formData.safe_deposit_box_number || ''}
                            onChange={(e) => handleChange('safe_deposit_box_number', e.target.value)}
                            placeholder="Enter box number"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Who Has the Key?</Label>
                        <Input
                          value={formData.safe_deposit_key_holder || ''}
                          onChange={(e) => handleChange('safe_deposit_key_holder', e.target.value)}
                          placeholder="Enter key holder name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Contents Overview</Label>
                        <Textarea
                          value={formData.safe_deposit_contents || ''}
                          onChange={(e) => handleChange('safe_deposit_contents', e.target.value)}
                          placeholder="Describe box contents..."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea
                          value={formData.safe_deposit_notes || ''}
                          onChange={(e) => handleChange('safe_deposit_notes', e.target.value)}
                          placeholder="Additional notes..."
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex justify-between mt-8">
              <Button onClick={onPrevious} variant="skillbinder" className="skillbinder px-6 py-2">
                Previous
              </Button>
              <Button
                onClick={handleSave}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Save & Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KeyDocumentsForm;