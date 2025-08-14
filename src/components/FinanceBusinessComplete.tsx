import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Screen1, Screen2 } from './FinanceBusinessScreens';
import { Screen3, Screen4, Screen5 } from './FinanceBusinessScreens2';
import { Screen6, Screen7 } from './FinanceBusinessScreens3';
import { Screen8, Screen9 } from './FinanceBusinessScreens4';
import { Screen10, Screen11, Screen12 } from './FinanceBusinessScreens5';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';

interface FinanceBusinessCompleteProps {
  onNext: () => void;
  onPrevious: () => void;
}

const FinanceBusinessComplete: React.FC<FinanceBusinessCompleteProps> = ({ onNext, onPrevious }) => {
  const { toast } = useToast();
  const [currentScreen, setCurrentScreen] = useState(1);
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
    incomeSources: [{ id: '1', income_type: '', income_contact_details: '' }],
    debts: [{ id: '1', debt_creditor_name: '', debt_balance: '', debt_due_date: '' }],
    businessVehicles: [{ id: '1', vehicle_make_model: '', vehicle_title_location: '' }],
    businessProperties: [{ id: '1', business_property_address: '', business_property_mortgage: '' }],
    businessOwnership: [{ id: '1', business_name: '', ownership_type: '', business_successor_plan: '' }],
    financialAdvisorName: '',
    financialAdvisorContact: '',
    statementsStorage: '',
    statementsStorageInfo: ''
  });

  const { user } = useAuth();
  const { syncForm } = useDatabaseSync();

  useEffect(() => {
    // Load from localStorage for now, will be replaced with database loading
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
      await syncForm(user.email, 'financeBusinessCompleteData', formData);
      toast({
        title: "Finance & Business Information Saved",
        description: `Screen ${currentScreen} data saved to database.`
      });
    } catch (error) {
      console.error('Error saving finance business data:', error);
      toast({
        title: "Error",
        description: "Failed to save to database. Please try again.",
        variant: "destructive",
      });
    }
  };

  const nextScreen = async () => {
    await handleSave();
    if (currentScreen < 12) {
      setCurrentScreen(currentScreen + 1);
    } else {
      onNext();
    }
  };

  const prevScreen = () => {
    if (currentScreen > 1) {
      setCurrentScreen(currentScreen - 1);
    } else {
      onPrevious();
    }
  };

  const screenProps = {
    formData,
    handleFieldChange,
    handleArrayUpdate,
    addArrayItem,
    removeArrayItem
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 1: return <Screen1 {...screenProps} />;
      case 2: return <Screen2 {...screenProps} />;
      case 3: return <Screen3 {...screenProps} />;
      case 4: return <Screen4 {...screenProps} />;
      case 5: return <Screen5 {...screenProps} />;
      case 6: return <Screen6 {...screenProps} />;
      case 7: return <Screen7 {...screenProps} />;
      case 8: return <Screen8 {...screenProps} />;
      case 9: return <Screen9 {...screenProps} />;
      case 10: return <Screen10 {...screenProps} />;
      case 11: return <Screen11 {...screenProps} />;
      case 12: return <Screen12 {...screenProps} />;
      default: return <Screen1 {...screenProps} />;
    }
  };



  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          💼 Finance & Business
        </h1>
        <p className="text-gray-600">
          Screen {currentScreen} of 12
        </p>
      </div>

      {renderScreen()}

      <div className="flex justify-between">
        <Button
          onClick={prevScreen}
          variant="skillbinder"
          className="skillbinder"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {currentScreen === 1 ? 'Previous Section' : 'Previous Screen'}
        </Button>
        <Button
          onClick={nextScreen}
          variant="skillbinder_yellow"
          className="skillbinder_yellow"
        >
          {currentScreen === 12 ? 'Save & Continue' : 'Next Screen'}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default FinanceBusinessComplete;