import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plus } from 'lucide-react';
import BankAccountCard from './forms/BankAccountCard';
import InvestmentCard from './forms/InvestmentCard';
import IncomeSourceCard from './forms/IncomeSourceCard';

interface FinanceBusinessPart1Props {
  onNext: () => void;
  onPrevious: () => void;
}

const FinanceBusinessPart1: React.FC<FinanceBusinessPart1Props> = ({ onNext, onPrevious }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { syncForm } = useDatabaseSync();
  const [formData, setFormData] = useState({
    bankAccounts: [{ id: '1', bank_name: '', bank_balance: '', bank_location: '' }],
    cashOnHandAmount: '',
    cashOnHandLocation: '',
    investments: [{ id: '1', investment_firm: '', investment_contact_info: '', investment_doc_location: '' }],
    retirementPlanType: '',
    retirementProvider: '',
    retirementDocLocation: '',
    cryptoWalletInfo: '',
    preciousMetalLocation: '',
    incomeSources: [{ id: '1', income_type: '', income_contact_details: '' }]
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

  const addArrayItem = (arrayName: string, template: any, maxItems: number) => {
    setFormData(prev => {
      if (prev[arrayName].length >= maxItems) return prev;
      return {
        ...prev,
        [arrayName]: [...prev[arrayName], { ...template, id: Date.now().toString() }]
      };
    });
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
      await syncForm(user.email, 'financeBusinessPart1Data', formData);
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
              Finance & Business (Part 1)
            </h1>
            <p className="text-gray-600">
              Document your financial accounts, investments, and income sources.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="bank-accounts">
              <AccordionTrigger className="text-lg font-semibold">
                Bank Accounts
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {formData.bankAccounts.map((account, index) => (
                    <BankAccountCard
                      key={account.id}
                      account={account}
                      index={index}
                      onUpdate={(i, field, value) => handleArrayUpdate('bankAccounts', i, field, value)}
                      onRemove={(i) => removeArrayItem('bankAccounts', i)}
                      canRemove={formData.bankAccounts.length > 1}
                    />
                  ))}
                  {formData.bankAccounts.length < 8 && (
                    <Button
                      onClick={() => addArrayItem('bankAccounts', { id: '', bank_name: '', bank_balance: '', bank_location: '' }, 8)}
                      variant="outline"
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Bank Account
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cash-on-hand">
              <AccordionTrigger className="text-lg font-semibold">
                Cash on Hand
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <Label htmlFor="cash_amount">Amount</Label>
                      <Input
                        id="cash_amount"
                        type="number"
                        step="0.01"
                        value={formData.cashOnHandAmount}
                        onChange={(e) => handleFieldChange('cashOnHandAmount', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cash_location">Location(s)</Label>
                      <Input
                        id="cash_location"
                        value={formData.cashOnHandLocation}
                        onChange={(e) => handleFieldChange('cashOnHandLocation', e.target.value)}
                        placeholder="Where cash is stored"
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="investments">
              <AccordionTrigger className="text-lg font-semibold">
                Investments & Brokerages
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {formData.investments.map((investment, index) => (
                    <InvestmentCard
                      key={investment.id}
                      investment={investment}
                      index={index}
                      onUpdate={(i, field, value) => handleArrayUpdate('investments', i, field, value)}
                      onRemove={(i) => removeArrayItem('investments', i)}
                      canRemove={formData.investments.length > 1}
                    />
                  ))}
                  {formData.investments.length < 4 && (
                    <Button
                      onClick={() => addArrayItem('investments', { id: '', investment_firm: '', investment_contact_info: '', investment_doc_location: '' }, 4)}
                      variant="outline"
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Investment
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="retirement">
              <AccordionTrigger className="text-lg font-semibold">
                Retirement Plans & Pensions
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <Label htmlFor="retirement_type">Plan Type(s)</Label>
                      <Input
                        id="retirement_type"
                        value={formData.retirementPlanType}
                        onChange={(e) => handleFieldChange('retirementPlanType', e.target.value)}
                        placeholder="401k, IRA, pension, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="retirement_provider">Provider(s)</Label>
                      <Input
                        id="retirement_provider"
                        value={formData.retirementProvider}
                        onChange={(e) => handleFieldChange('retirementProvider', e.target.value)}
                        placeholder="Company or institution names"
                      />
                    </div>
                    <div>
                      <Label htmlFor="retirement_docs">Location of Plan Documents</Label>
                      <Input
                        id="retirement_docs"
                        value={formData.retirementDocLocation}
                        onChange={(e) => handleFieldChange('retirementDocLocation', e.target.value)}
                        placeholder="Where documents are stored"
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="crypto-metals">
              <AccordionTrigger className="text-lg font-semibold">
                Cryptocurrency & Precious Metals
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <Label htmlFor="crypto_wallet">Wallet Location / Access Info</Label>
                      <Input
                        id="crypto_wallet"
                        value={formData.cryptoWalletInfo}
                        onChange={(e) => handleFieldChange('cryptoWalletInfo', e.target.value)}
                        placeholder="Wallet addresses, access keys, exchange info"
                      />
                    </div>
                    <div>
                      <Label htmlFor="precious_metals">Precious Metal Location(s)</Label>
                      <Input
                        id="precious_metals"
                        value={formData.preciousMetalLocation}
                        onChange={(e) => handleFieldChange('preciousMetalLocation', e.target.value)}
                        placeholder="Where precious metals are stored"
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="income-sources">
              <AccordionTrigger className="text-lg font-semibold">
                Income Sources
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {formData.incomeSources.map((source, index) => (
                    <IncomeSourceCard
                      key={source.id}
                      incomeSource={source}
                      index={index}
                      onUpdate={(i, field, value) => handleArrayUpdate('incomeSources', i, field, value)}
                      onRemove={(i) => removeArrayItem('incomeSources', i)}
                      canRemove={formData.incomeSources.length > 1}
                    />
                  ))}
                  {formData.incomeSources.length < 4 && (
                    <Button
                      onClick={() => addArrayItem('incomeSources', { id: '', income_type: '', income_contact_details: '' }, 4)}
                      variant="outline"
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Income Source
                    </Button>
                  )}
                </div>
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

export default FinanceBusinessPart1;