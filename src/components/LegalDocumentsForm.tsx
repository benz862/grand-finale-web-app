import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { useToast } from './ui/use-toast';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Info, Plus, Trash2 } from 'lucide-react';
import { formatPhoneNumber } from '@/lib/phoneNumberFormatter';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';

interface LegalDocumentsFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

const LegalDocumentsForm: React.FC<LegalDocumentsFormProps> = ({ onNext, onPrevious }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<any>({});
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [alternateExecutors, setAlternateExecutors] = useState<any[]>([]);
  const { user } = useAuth();
  const { syncForm } = useDatabaseSync();

  useEffect(() => {
    // Load from localStorage for now, will be replaced with database loading
    const savedData = localStorage.getItem('legalEstateForm');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(parsed.formData || {});
      setLawyers(parsed.lawyers || []);
      setAlternateExecutors(parsed.alternateExecutors || []);
    }
  }, []);

  const handleFormChange = (field: string, value: string | number) => {
    if (field === 'estate_attorney_phone' || field === 'financial_advisor_phone') {
      // Use phone number formatting for phone fields
      const formatted = formatPhoneNumber(value as string);
      setFormData(prev => ({ ...prev, [field]: formatted.formatted }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const addLawyer = () => {
    if (lawyers.length < 3) {
      setLawyers([...lawyers, { id: Date.now().toString(), lawyer_name: '', lawyer_address: '' }]);
    }
  };

  const updateLawyer = (id: string, field: string, value: string) => {
    setLawyers(lawyers.map(lawyer => lawyer.id === id ? { ...lawyer, [field]: value } : lawyer));
  };

  const deleteLawyer = (id: string) => {
    setLawyers(lawyers.filter(lawyer => lawyer.id !== id));
  };

  const addAlternateExecutor = () => {
    if (alternateExecutors.length < 2) {
      setAlternateExecutors([...alternateExecutors, {
        id: Date.now().toString(),
        alternate_executor_name: '',
        alternate_executor_phone: '',
        alternate_executor_email: '',
        alternate_executor_relationship: ''
      }]);
    }
  };

  const updateAlternateExecutor = (id: string, field: string, value: string) => {
    if (field === 'alternate_executor_phone') {
      // Use phone number formatting for executor phones
      const formatted = formatPhoneNumber(value);
      setAlternateExecutors(alternateExecutors.map(executor => 
        executor.id === id ? { ...executor, [field]: formatted.formatted } : executor
      ));
    } else {
      setAlternateExecutors(alternateExecutors.map(executor => 
        executor.id === id ? { ...executor, [field]: value } : executor
      ));
    }
  };

  const deleteAlternateExecutor = (id: string) => {
    setAlternateExecutors(alternateExecutors.filter(executor => executor.id !== id));
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

    const dataToSave = {
      formData,
      lawyers,
      alternateExecutors
    };

    try {
      await syncForm(user.email, 'legalDocumentsData', dataToSave);
      
      toast({
        title: "Success",
        description: "Legal documents information saved to database!",
      });
      
      onNext();
    } catch (error) {
      console.error('Error saving legal documents:', error);
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
              Legal & Estate Planning
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="will-estate">
                <AccordionTrigger>Will & Estate Overview</AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="p-6 space-y-6">
                      <div className="space-y-3">
                        <Label>Do you have a Last Will & Testament?</Label>
                        <RadioGroup value={formData.has_will || ''} onValueChange={(value) => handleFormChange('has_will', value)}>
                          <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Yes" id="will-yes" />
                <Label htmlFor="will-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="will-no" />
                            <Label htmlFor="will-no">No</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="in-progress" id="will-progress" />
                            <Label htmlFor="will-progress">In Progress</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-2">
                        <Label>Date Last Updated</Label>
                        <Input type="date" value={formData.will_updated_date || ''} onChange={(e) => handleFormChange('will_updated_date', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Location of Original Document</Label>
                        <Input value={formData.will_location || ''} onChange={(e) => handleFormChange('will_location', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Label>Other Estate Documents (e.g., Trusts, Codicils)</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger><Info className="h-4 w-4 text-gray-500" /></TooltipTrigger>
                              <TooltipContent><p>Examples include Trusts, Codicils, or Letter of Intent.</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Textarea value={formData.other_estate_documents || ''} onChange={(e) => handleFormChange('other_estate_documents', e.target.value)} rows={3} />
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="lawyers">
                <AccordionTrigger>Lawyer Information</AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Lawyers</CardTitle>
                        {lawyers.length < 3 && (
                          <Button onClick={addLawyer} variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />Add Lawyer
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {lawyers.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Button onClick={addLawyer} variant="outline">
                            <Plus className="h-4 w-4 mr-2" />Add First Lawyer
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {lawyers.map((lawyer, index) => (
                            <Card key={lawyer.id}>
                              <CardHeader>
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-lg">Lawyer #{index + 1}</CardTitle>
                                  <Button variant="ghost" size="sm" onClick={() => deleteLawyer(lawyer.id)} className="text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Lawyer's Name</Label>
                                  <Input value={lawyer.lawyer_name} onChange={(e) => updateLawyer(lawyer.id, 'lawyer_name', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Address</Label>
                                  <Textarea value={lawyer.lawyer_address} onChange={(e) => updateLawyer(lawyer.id, 'lawyer_address', e.target.value)} rows={3} />
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="contacts">
                <AccordionTrigger>Legal & Financial Contacts</AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="p-6 space-y-6">
                      <div className="border-b pb-6">
                        <h3 className="text-lg font-semibold mb-4">Estate Attorney</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input value={formData.estate_attorney_name || ''} onChange={(e) => handleFormChange('estate_attorney_name', e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input type="tel" value={formData.estate_attorney_phone || ''} onChange={(e) => handleFormChange('estate_attorney_phone', e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Firm</Label>
                            <Input value={formData.estate_attorney_firm || ''} onChange={(e) => handleFormChange('estate_attorney_firm', e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" value={formData.estate_attorney_email || ''} onChange={(e) => handleFormChange('estate_attorney_email', e.target.value)} />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Financial Advisor</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input value={formData.financial_advisor_name || ''} onChange={(e) => handleFormChange('financial_advisor_name', e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input type="tel" value={formData.financial_advisor_phone || ''} onChange={(e) => handleFormChange('financial_advisor_phone', e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Company</Label>
                            <Input value={formData.financial_advisor_company || ''} onChange={(e) => handleFormChange('financial_advisor_company', e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" value={formData.financial_advisor_email || ''} onChange={(e) => handleFormChange('financial_advisor_email', e.target.value)} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex justify-between mt-8">
              <Button onClick={onPrevious} variant="skillbinder" className="skillbinder">
                Previous
              </Button>
              <Button onClick={handleSave} variant="skillbinder_yellow" className="skillbinder_yellow">
                Save & Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LegalDocumentsForm;