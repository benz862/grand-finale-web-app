import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Plus } from 'lucide-react';
import BusinessVehicleCard from './forms/BusinessVehicleCard';
import BusinessPropertyCard from './forms/BusinessPropertyCard';
import BusinessOwnershipCard from './forms/BusinessOwnershipCard';

interface FinanceBusinessPart2Props {
  onNext: () => void;
  onPrevious: () => void;
}

const FinanceBusinessPart2: React.FC<FinanceBusinessPart2Props> = ({ onNext, onPrevious }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { syncForm } = useDatabaseSync();
  const [formData, setFormData] = useState({
    debtCreditorName: '',
    debtBalance: '',
    debtDueDate: '',
    businessVehicles: [{ id: '1', vehicle_make_model: '', vehicle_title_location: '' }],
    businessProperties: [{ id: '1', business_property_address: '', business_property_mortgage: '' }],
    businessOwnership: [{ id: '1', business_name: '', business_ownership_type: '', business_successor_plan: '' }],
    financialAdvisorName: '',
    financialAdvisorContact: '',
    statementsStorageType: '',
    statementsStorageInfo: ''
  });

  useEffect(() => {
    const savedData = localStorage.getItem('financeBusinessInfo');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayUpdate = (arrayName: string, index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (arrayName: string, template: any) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], { ...template, id: Date.now().toString() }]
    }));
  };

  const removeArrayItem = (arrayName: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
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
      await syncForm(user.email, 'financeBusinessPart2Data', formData);
      toast({
        title: "Finance & Business Information Saved",
        description: "Your finance and business information has been saved to database."
      });
      onNext();
    } catch (error) {
      console.error('Error saving finance data:', error);
      toast({
        title: "Error",
        description: "Failed to save to database. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Finance & Business (Part 2)
            </h1>
            <p className="text-gray-600">
              Document your debts, business assets, and financial advisors.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="debts">
              <AccordionTrigger className="text-lg font-semibold">
                Debts, Mortgages & Liabilities
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <Label htmlFor="debt_creditor">Creditor Name(s)</Label>
                      <Input
                        id="debt_creditor"
                        value={formData.debtCreditorName}
                        onChange={(e) => handleFieldChange('debtCreditorName', e.target.value)}
                        placeholder="Names of creditors"
                      />
                    </div>
                    <div>
                      <Label htmlFor="debt_balance">Outstanding Balance(s)</Label>
                      <Input
                        id="debt_balance"
                        type="number"
                        step="0.01"
                        value={formData.debtBalance}
                        onChange={(e) => handleFieldChange('debtBalance', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="debt_due">Payment Due Dates</Label>
                      <Input
                        id="debt_due"
                        value={formData.debtDueDate}
                        onChange={(e) => handleFieldChange('debtDueDate', e.target.value)}
                        placeholder="Payment schedule or due dates"
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="business-vehicles">
              <AccordionTrigger className="text-lg font-semibold">
                Business Vehicles & Leases
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {formData.businessVehicles.map((vehicle, index) => (
                    <BusinessVehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      index={index}
                      onUpdate={(i, field, value) => handleArrayUpdate('businessVehicles', i, field, value)}
                      onRemove={(i) => removeArrayItem('businessVehicles', i)}
                      canRemove={formData.businessVehicles.length > 1}
                    />
                  ))}
                  <Button
                    onClick={() => addArrayItem('businessVehicles', { id: '', vehicle_make_model: '', vehicle_title_location: '' })}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Business Vehicle
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="business-properties">
              <AccordionTrigger className="text-lg font-semibold">
                Business Real Estate
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {formData.businessProperties.map((property, index) => (
                    <BusinessPropertyCard
                      key={property.id}
                      property={property}
                      index={index}
                      onUpdate={(i, field, value) => handleArrayUpdate('businessProperties', i, field, value)}
                      onRemove={(i) => removeArrayItem('businessProperties', i)}
                      canRemove={formData.businessProperties.length > 1}
                    />
                  ))}
                  <Button
                    onClick={() => addArrayItem('businessProperties', { id: '', business_property_address: '', business_property_mortgage: '' })}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Business Property
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="business-ownership">
              <AccordionTrigger className="text-lg font-semibold">
                Business Ownership
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {formData.businessOwnership.map((business, index) => (
                    <BusinessOwnershipCard
                      key={business.id}
                      business={business}
                      index={index}
                      onUpdate={(i, field, value) => handleArrayUpdate('businessOwnership', i, field, value)}
                      onRemove={(i) => removeArrayItem('businessOwnership', i)}
                      canRemove={formData.businessOwnership.length > 1}
                    />
                  ))}
                  <Button
                    onClick={() => addArrayItem('businessOwnership', { id: '', business_name: '', business_ownership_type: '', business_successor_plan: '' })}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Business
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="financial-advisor">
              <AccordionTrigger className="text-lg font-semibold">
                Financial Advisor Contact
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <Label htmlFor="advisor_name">Name</Label>
                      <Input
                        id="advisor_name"
                        value={formData.financialAdvisorName}
                        onChange={(e) => handleFieldChange('financialAdvisorName', e.target.value)}
                        placeholder="Financial advisor name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="advisor_contact">Phone / Email</Label>
                      <Input
                        id="advisor_contact"
                        value={formData.financialAdvisorContact}
                        onChange={(e) => handleFieldChange('financialAdvisorContact', e.target.value)}
                        placeholder="Contact information"
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="statements">
              <AccordionTrigger className="text-lg font-semibold">
                Access to Statements
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <Label>Paper or Digital?</Label>
                      <RadioGroup
                        value={formData.statementsStorageType}
                        onValueChange={(value) => handleFieldChange('statementsStorageType', value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Paper" id="paper" />
                          <Label htmlFor="paper">Paper</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Digital" id="digital" />
                          <Label htmlFor="digital">Digital</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label htmlFor="statements_info">Stored At / Password Info</Label>
                      <Input
                        id="statements_info"
                        value={formData.statementsStorageInfo}
                        onChange={(e) => handleFieldChange('statementsStorageInfo', e.target.value)}
                        placeholder="Location or access information"
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-between mt-8">
            <Button
              onClick={onPrevious}
              variant="outline"
              className="px-6 py-2"
            >
              Previous
            </Button>
            <Button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Save & Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceBusinessPart2;