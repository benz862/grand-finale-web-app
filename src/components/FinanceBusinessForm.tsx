import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { generatePDF } from '../lib/pdfGenerator';
import AudioPlayer from './AudioPlayer';
import { useTrial } from '../contexts/TrialContext';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { formatPhoneNumber } from '@/lib/phoneNumberFormatter';
import { supabase } from '@/lib/supabase';

interface BankAccount {
  id: string;
  bankName: string;
  balance: string;
  location: string;
}

interface Investment {
  id: string;
  firmName: string;
  accountInfo: string;
  documentLocation: string;
}

interface IncomeSource {
  id: string;
  type: string;
  contactInfo: string;
}

interface Vehicle {
  id: string;
  makeModel: string;
  documentLocation: string;
}

interface Property {
  id: string;
  address: string;
  mortgageInfo: string;
}

interface Business {
  id: string;
  name: string;
  ownershipType: string;
  successorPlan: string;
}

interface RetirementPlan {
  id: string;
  planType: string;
  provider: string;
  documentLocation: string;
}

interface CryptoMetal {
  id: string;
  type: string;
  location: string;
  value: string;
}

interface Liability {
  id: string;
  creditor: string;
  balance: string;
  dueDate: string;
}

interface CashOnHand {
  id: string;
  amount: string;
  location: string;
}

interface FinanceBusinessData {
  // Bank Accounts
  bankAccounts: BankAccount[];
  
  // Cash on Hand
  cashOnHand: CashOnHand[];
  
  // Investments
  investments: Investment[];
  
  // Retirement
  retirementPlans: RetirementPlan[];
  
  // Crypto & Metals
  cryptoMetals: CryptoMetal[];
  
  // Income Sources
  incomeSources: IncomeSource[];
  
  // Liabilities
  liabilities: Liability[];
  
  // Vehicles
  vehicles: Vehicle[];
  
  // Properties
  properties: Property[];
  
  // Business Ownership
  businesses: Business[];
  
  // Financial Advisor
  advisorName: string;
  advisorPhone: string;
  advisorEmail: string;
  
  // Statement Access
  statementStorage: string;
  storageLocation: string;
}

interface FinanceBusinessFormProps {
  onNext: () => void;
  onPrevious: () => void;
  initialData?: Partial<FinanceBusinessData>;
}

const FinanceBusinessForm: React.FC<FinanceBusinessFormProps> = ({
  onNext,
  onPrevious,
  initialData = {}
}) => {
  const { userTier, isTrial } = useTrial();
  const { syncForm } = useDatabaseSync();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [userInfo, setUserInfo] = useState<{ firstName?: string; lastName?: string; email?: string }>({});
  const [formData, setFormData] = useState<FinanceBusinessData>({
    bankAccounts: initialData.bankAccounts || [{ id: '1', bankName: '', balance: '', location: '' }],
    cashOnHand: initialData.cashOnHand || [{ id: '1', amount: '', location: '' }],
    investments: initialData.investments || [{ id: '1', firmName: '', accountInfo: '', documentLocation: '' }],
    retirementPlans: initialData.retirementPlans || [{ id: '1', planType: '', provider: '', documentLocation: '' }],
    cryptoMetals: initialData.cryptoMetals || [{ id: '1', type: '', location: '', value: '' }],
    incomeSources: initialData.incomeSources || [{ id: '1', type: '', contactInfo: '' }],
    liabilities: initialData.liabilities || [{ id: '1', creditor: '', balance: '', dueDate: '' }],
    vehicles: initialData.vehicles || [{ id: '1', makeModel: '', documentLocation: '' }],
    properties: initialData.properties || [{ id: '1', address: '', mortgageInfo: '' }],
    businesses: initialData.businesses || [{ id: '1', name: '', ownershipType: '', successorPlan: '' }],
    advisorName: initialData.advisorName || '',
    advisorPhone: initialData.advisorPhone || '',
    advisorEmail: initialData.advisorEmail || '',
    statementStorage: initialData.statementStorage || '',
    storageLocation: initialData.storageLocation || ''
  });

  // Fetch user information for PDF footer
  const fetchUserInfo = async () => {
    if (!user?.email) return;
    
    try {
      // Get user data from personal_info table
      const { data: personalInfo, error } = await supabase
        .from('personal_info')
        .select('legal_first_name, legal_last_name')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user info:', error);
        return;
      }
      
      setUserInfo({
        firstName: personalInfo?.legal_first_name || '',
        lastName: personalInfo?.legal_last_name || '',
        email: user.email
      });
    } catch (error) {
      console.error('Error in fetchUserInfo:', error);
    }
  };
  
  // Fetch user info when component mounts
  useEffect(() => {
    if (user?.email) {
      fetchUserInfo();
    }
  }, [user?.email]);

  // Load saved data from localStorage and database
  useEffect(() => {
    const loadSavedData = async () => {
      console.log('Loading finance business data...');
      
      // First, try to load from localStorage
      const savedData = localStorage.getItem('financeBusinessData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          console.log('Loaded data from localStorage:', parsedData);
          setFormData(prev => ({ ...prev, ...parsedData }));
        } catch (error) {
          console.error('Error parsing localStorage data:', error);
        }
      }
      
      // Then, try to load from database if user is authenticated
      if (isAuthenticated && user?.email) {
        try {
          console.log('Attempting to load data from database...');
          const { data: { user: authUser } } = await supabase.auth.getUser();
          
          if (authUser) {
            const { data: dbData, error } = await supabase
              .from('finance_business')
              .select('*')
              .eq('user_id', authUser.id)
              .single();
            
            if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
              console.error('Error loading from database:', error);
            } else if (dbData) {
              console.log('Loaded data from database:', dbData);
              
              // Transform database data to form format
              const transformedData = {
                bankAccounts: dbData.bank_accounts || [{ id: '1', bankName: '', balance: '', location: '' }],
                cashOnHand: dbData.cash_on_hand || [{ id: '1', amount: '', location: '' }],
                investments: dbData.investments || [{ id: '1', firmName: '', accountInfo: '', documentLocation: '' }],
                retirementPlans: dbData.retirement_plans || [{ id: '1', planType: '', provider: '', documentLocation: '' }],
                cryptoMetals: dbData.crypto_metals || [{ id: '1', type: '', location: '', value: '' }],
                incomeSources: dbData.income_sources || [{ id: '1', type: '', contactInfo: '' }],
                liabilities: dbData.liabilities || [{ id: '1', creditor: '', balance: '', dueDate: '' }],
                vehicles: dbData.vehicles || [{ id: '1', makeModel: '', documentLocation: '' }],
                properties: dbData.properties || [{ id: '1', address: '', mortgageInfo: '' }],
                businesses: dbData.businesses || [{ id: '1', name: '', ownershipType: '', successorPlan: '' }],
                advisorName: dbData.advisor_name || '',
                advisorPhone: dbData.advisor_phone || '',
                advisorEmail: dbData.advisor_email || '',
                statementStorage: dbData.statement_storage || '',
                storageLocation: dbData.storage_location || ''
              };
              
              setFormData(prev => ({ ...prev, ...transformedData }));
            }
          }
        } catch (error) {
          console.error('Error loading from database:', error);
        }
      }
    };
    
    loadSavedData();
  }, [isAuthenticated, user?.email]);

  const handleFieldChange = (field: keyof FinanceBusinessData, value: any) => {
    if (field === 'advisorPhone') {
      // Use phone number formatting for advisor phone
      const formatted = formatPhoneNumber(value as string);
      setFormData(prev => ({ ...prev, [field]: formatted.formatted }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const addBankAccount = () => {
    const newAccount: BankAccount = {
      id: Date.now().toString(),
      bankName: '',
      balance: '',
      location: ''
    };
    setFormData(prev => ({
      ...prev,
      bankAccounts: [...prev.bankAccounts, newAccount]
    }));
  };

  const updateBankAccount = (id: string, field: keyof BankAccount, value: string) => {
    setFormData(prev => ({
      ...prev,
      bankAccounts: prev.bankAccounts.map(account =>
        account.id === id ? { ...account, [field]: value } : account
      )
    }));
  };

  const removeBankAccount = (id: string) => {
    if (formData.bankAccounts.length > 1) {
      setFormData(prev => ({
        ...prev,
        bankAccounts: prev.bankAccounts.filter(account => account.id !== id)
      }));
    }
  };

  const addCashOnHand = () => {
    const newCash: CashOnHand = {
      id: Date.now().toString(),
      amount: '',
      location: ''
    };
    setFormData(prev => ({
      ...prev,
      cashOnHand: [...prev.cashOnHand, newCash]
    }));
  };

  const updateCashOnHand = (id: string, field: keyof CashOnHand, value: string) => {
    setFormData(prev => ({
      ...prev,
      cashOnHand: prev.cashOnHand.map(cash =>
        cash.id === id ? { ...cash, [field]: value } : cash
      )
    }));
  };

  const removeCashOnHand = (id: string) => {
    if (formData.cashOnHand.length > 1) {
      setFormData(prev => ({
        ...prev,
        cashOnHand: prev.cashOnHand.filter(cash => cash.id !== id)
      }));
    }
  };

  const addInvestment = () => {
    const newInvestment: Investment = {
      id: Date.now().toString(),
      firmName: '',
      accountInfo: '',
      documentLocation: ''
    };
    setFormData(prev => ({
      ...prev,
      investments: [...prev.investments, newInvestment]
    }));
  };

  const updateInvestment = (id: string, field: keyof Investment, value: string) => {
    setFormData(prev => ({
      ...prev,
      investments: prev.investments.map(investment =>
        investment.id === id ? { ...investment, [field]: value } : investment
      )
    }));
  };

  const removeInvestment = (id: string) => {
    if (formData.investments.length > 1) {
      setFormData(prev => ({
        ...prev,
        investments: prev.investments.filter(investment => investment.id !== id)
      }));
    }
  };

  const addIncomeSource = () => {
    const newIncome: IncomeSource = {
      id: Date.now().toString(),
      type: '',
      contactInfo: ''
    };
    setFormData(prev => ({
      ...prev,
      incomeSources: [...prev.incomeSources, newIncome]
    }));
  };

  const updateIncomeSource = (id: string, field: keyof IncomeSource, value: string) => {
    setFormData(prev => ({
      ...prev,
      incomeSources: prev.incomeSources.map(income =>
        income.id === id ? { ...income, [field]: value } : income
      )
    }));
  };

  const removeIncomeSource = (id: string) => {
    if (formData.incomeSources.length > 1) {
      setFormData(prev => ({
        ...prev,
        incomeSources: prev.incomeSources.filter(income => income.id !== id)
      }));
    }
  };

  const addRetirementPlan = () => {
    const newPlan: RetirementPlan = {
      id: Date.now().toString(),
      planType: '',
      provider: '',
      documentLocation: ''
    };
    setFormData(prev => ({
      ...prev,
      retirementPlans: [...prev.retirementPlans, newPlan]
    }));
  };

  const updateRetirementPlan = (id: string, field: keyof RetirementPlan, value: string) => {
    setFormData(prev => ({
      ...prev,
      retirementPlans: prev.retirementPlans.map(plan =>
        plan.id === id ? { ...plan, [field]: value } : plan
      )
    }));
  };

  const removeRetirementPlan = (id: string) => {
    if (formData.retirementPlans.length > 1) {
      setFormData(prev => ({
        ...prev,
        retirementPlans: prev.retirementPlans.filter(plan => plan.id !== id)
      }));
    }
  };

  const addCryptoMetal = () => {
    const newMetal: CryptoMetal = {
      id: Date.now().toString(),
      type: '',
      location: '',
      value: ''
    };
    setFormData(prev => ({
      ...prev,
      cryptoMetals: [...prev.cryptoMetals, newMetal]
    }));
  };

  const updateCryptoMetal = (id: string, field: keyof CryptoMetal, value: string) => {
    setFormData(prev => ({
      ...prev,
      cryptoMetals: prev.cryptoMetals.map(metal =>
        metal.id === id ? { ...metal, [field]: value } : metal
      )
    }));
  };

  const removeCryptoMetal = (id: string) => {
    if (formData.cryptoMetals.length > 1) {
      setFormData(prev => ({
        ...prev,
        cryptoMetals: prev.cryptoMetals.filter(metal => metal.id !== id)
      }));
    }
  };

  const addLiability = () => {
    const newLiability: Liability = {
      id: Date.now().toString(),
      creditor: '',
      balance: '',
      dueDate: ''
    };
    setFormData(prev => ({
      ...prev,
      liabilities: [...prev.liabilities, newLiability]
    }));
  };

  const updateLiability = (id: string, field: keyof Liability, value: string) => {
    setFormData(prev => ({
      ...prev,
      liabilities: prev.liabilities.map(liability =>
        liability.id === id ? { ...liability, [field]: value } : liability
      )
    }));
  };

  const removeLiability = (id: string) => {
    if (formData.liabilities.length > 1) {
      setFormData(prev => ({
        ...prev,
        liabilities: prev.liabilities.filter(liability => liability.id !== id)
      }));
    }
  };

  const addVehicle = () => {
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      makeModel: '',
      documentLocation: ''
    };
    setFormData(prev => ({
      ...prev,
      vehicles: [...prev.vehicles, newVehicle]
    }));
  };

  const updateVehicle = (id: string, field: keyof Vehicle, value: string) => {
    setFormData(prev => ({
      ...prev,
      vehicles: prev.vehicles.map(vehicle =>
        vehicle.id === id ? { ...vehicle, [field]: value } : vehicle
      )
    }));
  };

  const removeVehicle = (id: string) => {
    if (formData.vehicles.length > 1) {
      setFormData(prev => ({
        ...prev,
        vehicles: prev.vehicles.filter(vehicle => vehicle.id !== id)
      }));
    }
  };

  const addProperty = () => {
    const newProperty: Property = {
      id: Date.now().toString(),
      address: '',
      mortgageInfo: ''
    };
    setFormData(prev => ({
      ...prev,
      properties: [...prev.properties, newProperty]
    }));
  };

  const updateProperty = (id: string, field: keyof Property, value: string) => {
    setFormData(prev => ({
      ...prev,
      properties: prev.properties.map(property =>
        property.id === id ? { ...property, [field]: value } : property
      )
    }));
  };

  const removeProperty = (id: string) => {
    if (formData.properties.length > 1) {
      setFormData(prev => ({
        ...prev,
        properties: prev.properties.filter(property => property.id !== id)
      }));
    }
  };

  const addBusiness = () => {
    const newBusiness: Business = {
      id: Date.now().toString(),
      name: '',
      ownershipType: '',
      successorPlan: ''
    };
    setFormData(prev => ({
      ...prev,
      businesses: [...prev.businesses, newBusiness]
    }));
  };

  const updateBusiness = (id: string, field: keyof Business, value: string) => {
    setFormData(prev => ({
      ...prev,
      businesses: prev.businesses.map(business =>
        business.id === id ? { ...business, [field]: value } : business
      )
    }));
  };

  const removeBusiness = (id: string) => {
    if (formData.businesses.length > 1) {
      setFormData(prev => ({
        ...prev,
        businesses: prev.businesses.filter(business => business.id !== id)
      }));
    }
  };

  const handleSave = async () => {
    console.log('=== FINANCE BUSINESS SAVE START ===');
    
    // Show immediate feedback
    toast({
      title: "Saving finance & business information...",
      description: "Please wait while we save your data.",
    });

    // Save to database
    if (isAuthenticated && user?.email) {
      console.log('=== DATABASE SYNC START ===');
      console.log('User authenticated, attempting database sync...');
      console.log('User email:', user.email);
      
      try {
        // Show syncing status
        toast({
          title: "Syncing to database...",
          description: "Please wait while we save your data to the cloud.",
        });

        // Use email as user ID for database sync
        const result = await syncForm(user.email, 'financeBusinessData', formData);
        console.log('Sync result:', result);
        
        if (result.success) {
          toast({
            title: "Success!",
            description: "Your finance & business information has been saved to the database.",
          });
        } else {
          console.error('Sync failed:', result.error);
          
          // Show detailed error message
          let errorMessage = "There was an issue saving to the database.";
          if (result.error && typeof result.error === 'string') {
            errorMessage += ` Error: ${result.error}`;
          } else if (result.error && result.error.message) {
            errorMessage += ` Error: ${result.error.message}`;
          }
          
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Database sync error:', error);
        
        // Show detailed error message
        let errorMessage = "There was an issue saving to the database.";
        if (error instanceof Error) {
          errorMessage += ` Error: ${error.message}`;
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } else {
      console.log('No authenticated user found');
      toast({
        title: "Authentication Required",
        description: "Please log in to save your finance & business information to the database.",
        variant: "destructive",
      });
    }

    console.log('=== FINANCE BUSINESS SAVE END ===');
    onNext();
  };

  // PDF generation handler
  const handleGeneratePDF = () => {
    generatePDF({
      sectionTitle: 'Finance & Business Information',
      data: formData,
      formType: 'finance',
      userTier,
      isTrial,
      userInfo: userInfo
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-bold" style={{ color: '#E4B64A', fontSize: '28px' }}>Finance & Business</CardTitle>
        <p className="text-lg" style={{ color: '#153A4B' }}>
          Organize your financial accounts, investments, and business information for comprehensive legacy planning
        </p>
        <AudioPlayer audioFile="Section_4.mp3" size="md" sectionNumber={4} />
      </CardHeader>
      <CardContent>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <Accordion type="single" collapsible className="mb-6">
            {/* Bank Accounts & Balances */}
            <AccordionItem value="bank-accounts">
              <AccordionTrigger style={{ color: '#000000' }}>Bank Accounts & Balances</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.bankAccounts.map((account, index) => (
                      <div key={account.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Bank Account {index + 1}</h4>
                          {formData.bankAccounts.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBankAccount(account.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`bank-name-${account.id}`}>Bank Name</Label>
                            <Input
                              id={`bank-name-${account.id}`}
                              value={account.bankName}
                              onChange={(e) => updateBankAccount(account.id, 'bankName', e.target.value)}
                              placeholder="Enter bank name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`balance-${account.id}`}>Approximate Balance</Label>
                            <Input
                              id={`balance-${account.id}`}
                              value={account.balance}
                              onChange={(e) => updateBankAccount(account.id, 'balance', e.target.value)}
                              placeholder="Enter approximate balance"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`location-${account.id}`}>Account Location</Label>
                            <Select value={account.location} onValueChange={(value) => updateBankAccount(account.id, 'location', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select account location" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="paper">Paper</SelectItem>
                                <SelectItem value="digital">Digital</SelectItem>
                                <SelectItem value="both">Both</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addBankAccount} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Bank Account
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Cash on Hand */}
            <AccordionItem value="cash-on-hand">
              <AccordionTrigger style={{ color: '#000000' }}>Cash on Hand</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.cashOnHand.map((cash, index) => (
                      <div key={cash.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Cash on Hand {index + 1}</h4>
                          {formData.cashOnHand.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCashOnHand(cash.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`cash-amount-${cash.id}`}>Amount</Label>
                            <Input
                              id={`cash-amount-${cash.id}`}
                              value={cash.amount}
                              onChange={(e) => updateCashOnHand(cash.id, 'amount', e.target.value)}
                              placeholder="Enter cash amount"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`cash-location-${cash.id}`}>Physical Location(s)</Label>
                            <Input
                              id={`cash-location-${cash.id}`}
                              value={cash.location}
                              onChange={(e) => updateCashOnHand(cash.id, 'location', e.target.value)}
                              placeholder="Where is cash stored"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addCashOnHand} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Cash on Hand
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Investments & Brokerages */}
            <AccordionItem value="investments">
              <AccordionTrigger style={{ color: '#000000' }}>Investments & Brokerages</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.investments.map((investment, index) => (
                      <div key={investment.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Investment {index + 1}</h4>
                          {formData.investments.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeInvestment(investment.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`firm-name-${investment.id}`}>Firm Name</Label>
                            <Input
                              id={`firm-name-${investment.id}`}
                              value={investment.firmName}
                              onChange={(e) => updateInvestment(investment.id, 'firmName', e.target.value)}
                              placeholder="Enter firm name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`doc-location-${investment.id}`}>Document Location</Label>
                            <Input
                              id={`doc-location-${investment.id}`}
                              value={investment.documentLocation}
                              onChange={(e) => updateInvestment(investment.id, 'documentLocation', e.target.value)}
                              placeholder="Where documents are stored"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`account-info-${investment.id}`}>Account Info / Broker Contact</Label>
                            <Textarea
                              id={`account-info-${investment.id}`}
                              value={investment.accountInfo}
                              onChange={(e) => updateInvestment(investment.id, 'accountInfo', e.target.value)}
                              placeholder="Account details, broker contact information"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addInvestment} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Investment
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Retirement Plans & Pensions */}
            <AccordionItem value="retirement">
              <AccordionTrigger style={{ color: '#000000' }}>Retirement Plans & Pensions</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.retirementPlans.map((plan, index) => (
                      <div key={plan.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Retirement Plan {index + 1}</h4>
                          {formData.retirementPlans.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRetirementPlan(plan.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`plan-type-${plan.id}`}>Plan Type</Label>
                            <Input
                              id={`plan-type-${plan.id}`}
                              value={plan.planType}
                              onChange={(e) => updateRetirementPlan(plan.id, 'planType', e.target.value)}
                              placeholder="e.g. 401(k), IRA, Pension"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`provider-${plan.id}`}>Provider</Label>
                            <Input
                              id={`provider-${plan.id}`}
                              value={plan.provider}
                              onChange={(e) => updateRetirementPlan(plan.id, 'provider', e.target.value)}
                              placeholder="Retirement plan provider"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`doc-location-${plan.id}`}>Document Location</Label>
                            <Input
                              id={`doc-location-${plan.id}`}
                              value={plan.documentLocation}
                              onChange={(e) => updateRetirementPlan(plan.id, 'documentLocation', e.target.value)}
                              placeholder="Where retirement documents are stored"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addRetirementPlan} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Retirement Plan
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Cryptocurrency & Precious Metals */}
            <AccordionItem value="crypto-metals">
              <AccordionTrigger style={{ color: '#000000' }}>Crypto & Precious Metals</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.cryptoMetals.map((metal, index) => (
                      <div key={metal.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Crypto/Metal {index + 1}</h4>
                          {formData.cryptoMetals.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCryptoMetal(metal.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`crypto-type-${metal.id}`}>Type</Label>
                            <Input
                              id={`crypto-type-${metal.id}`}
                              value={metal.type}
                              onChange={(e) => updateCryptoMetal(metal.id, 'type', e.target.value)}
                              placeholder="e.g. Bitcoin, Gold, Silver"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`location-${metal.id}`}>Physical Location</Label>
                            <Input
                              id={`location-${metal.id}`}
                              value={metal.location}
                              onChange={(e) => updateCryptoMetal(metal.id, 'location', e.target.value)}
                              placeholder="Where physical assets are stored"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`value-${metal.id}`}>Approximate Value</Label>
                            <Input
                              id={`value-${metal.id}`}
                              value={metal.value}
                              onChange={(e) => updateCryptoMetal(metal.id, 'value', e.target.value)}
                              placeholder="Enter approximate value"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addCryptoMetal} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Crypto/Metal
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Income Sources */}
            <AccordionItem value="income-sources">
              <AccordionTrigger style={{ color: '#000000' }}>Income Sources</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.incomeSources.map((source, index) => (
                      <div key={source.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Income Source {index + 1}</h4>
                          {formData.incomeSources.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeIncomeSource(source.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`income-type-${source.id}`}>Type</Label>
                            <Input
                              id={`income-type-${source.id}`}
                              value={source.type}
                              onChange={(e) => updateIncomeSource(source.id, 'type', e.target.value)}
                              placeholder="e.g. Social Security, Pension, Rental"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`contact-info-${source.id}`}>Contact Info</Label>
                            <Input
                              id={`contact-info-${source.id}`}
                              value={source.contactInfo}
                              onChange={(e) => updateIncomeSource(source.id, 'contactInfo', e.target.value)}
                              placeholder="Contact information for income source"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addIncomeSource} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Income Source
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Liabilities & Debts */}
            <AccordionItem value="liabilities">
              <AccordionTrigger style={{ color: '#000000' }}>Liabilities & Debts</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.liabilities.map((liability, index) => (
                      <div key={liability.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Liability {index + 1}</h4>
                          {formData.liabilities.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLiability(liability.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`creditor-${liability.id}`}>Creditor</Label>
                            <Input
                              id={`creditor-${liability.id}`}
                              value={liability.creditor}
                              onChange={(e) => updateLiability(liability.id, 'creditor', e.target.value)}
                              placeholder="Enter creditor name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`balance-${liability.id}`}>Outstanding Balance</Label>
                            <Input
                              id={`balance-${liability.id}`}
                              value={liability.balance}
                              onChange={(e) => updateLiability(liability.id, 'balance', e.target.value)}
                              placeholder="Enter outstanding balance"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`due-date-${liability.id}`}>Payment Due Date</Label>
                            <Input
                              id={`due-date-${liability.id}`}
                              value={liability.dueDate}
                              onChange={(e) => updateLiability(liability.id, 'dueDate', e.target.value)}
                              placeholder="Enter payment due date"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addLiability} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Liability
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Vehicles */}
            <AccordionItem value="vehicles">
              <AccordionTrigger style={{ color: '#000000' }}>Vehicles</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.vehicles.map((vehicle, index) => (
                      <div key={vehicle.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Vehicle {index + 1}</h4>
                          {formData.vehicles.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeVehicle(vehicle.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`make-model-${vehicle.id}`}>Make & Model</Label>
                            <Input
                              id={`make-model-${vehicle.id}`}
                              value={vehicle.makeModel}
                              onChange={(e) => updateVehicle(vehicle.id, 'makeModel', e.target.value)}
                              placeholder="Enter make and model"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`doc-location-${vehicle.id}`}>Document Location</Label>
                            <Input
                              id={`doc-location-${vehicle.id}`}
                              value={vehicle.documentLocation}
                              onChange={(e) => updateVehicle(vehicle.id, 'documentLocation', e.target.value)}
                              placeholder="Where vehicle documents are stored"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addVehicle} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Vehicle
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Properties */}
            <AccordionItem value="properties">
              <AccordionTrigger style={{ color: '#000000' }}>Properties</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.properties.map((property, index) => (
                      <div key={property.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Property {index + 1}</h4>
                          {formData.properties.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProperty(property.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`property-address-${property.id}`}>Address</Label>
                            <Input
                              id={`property-address-${property.id}`}
                              value={property.address}
                              onChange={(e) => updateProperty(property.id, 'address', e.target.value)}
                              placeholder="Enter property address"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`mortgage-info-${property.id}`}>Mortgage Info / Deed Location</Label>
                            <Input
                              id={`mortgage-info-${property.id}`}
                              value={property.mortgageInfo}
                              onChange={(e) => updateProperty(property.id, 'mortgageInfo', e.target.value)}
                              placeholder="Mortgage information and deed location"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addProperty} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Property
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Business Ownership */}
            <AccordionItem value="businesses">
              <AccordionTrigger style={{ color: '#000000' }}>Business Ownership</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.businesses.map((business, index) => (
                      <div key={business.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Business {index + 1}</h4>
                          {formData.businesses.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBusiness(business.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`business-name-${business.id}`}>Business Name</Label>
                            <Input
                              id={`business-name-${business.id}`}
                              value={business.name}
                              onChange={(e) => updateBusiness(business.id, 'name', e.target.value)}
                              placeholder="Enter business name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`ownership-type-${business.id}`}>Type of Ownership</Label>
                            <Select value={business.ownershipType} onValueChange={(value) => updateBusiness(business.id, 'ownershipType', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select ownership type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                                <SelectItem value="partnership">Partnership</SelectItem>
                                <SelectItem value="corporation">Corporation</SelectItem>
                                <SelectItem value="llc">LLC</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`successor-plan-${business.id}`}>Successor or Sale Plan</Label>
                            <Textarea
                              id={`successor-plan-${business.id}`}
                              value={business.successorPlan}
                              onChange={(e) => updateBusiness(business.id, 'successorPlan', e.target.value)}
                              placeholder="Plan for business succession or sale"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addBusiness} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Business
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Financial Advisor */}
            <AccordionItem value="financial-advisor">
              <AccordionTrigger style={{ color: '#000000' }}>Financial Advisor</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="advisor-name">Name</Label>
                        <Input
                          id="advisor-name"
                          value={formData.advisorName}
                          onChange={(e) => handleFieldChange('advisorName', e.target.value)}
                          placeholder="Enter advisor name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="advisor-phone">Phone</Label>
                        <Input
                          id="advisor-phone"
                          type="tel"
                          value={formData.advisorPhone}
                          onChange={(e) => handleFieldChange('advisorPhone', e.target.value)}
                          placeholder="(555) 123-4567 or +1 234 567 8900"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="advisor-email">Email</Label>
                        <Input
                          id="advisor-email"
                          type="email"
                          value={formData.advisorEmail}
                          onChange={(e) => handleFieldChange('advisorEmail', e.target.value)}
                          placeholder="Enter advisor email"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Statement Access */}
            <AccordionItem value="statement-access">
              <AccordionTrigger style={{ color: '#000000' }}>Statement Access</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Are your statements stored…</Label>
                      <RadioGroup value={formData.statementStorage} onValueChange={(value) => handleFieldChange('statementStorage', value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="paper" id="paper" />
                          <Label htmlFor="paper">Paper</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="digital" id="digital" />
                          <Label htmlFor="digital">Digital</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="both" id="both" />
                          <Label htmlFor="both">Both</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label htmlFor="storage-location">Storage Location / Password Info</Label>
                      <Input
                        id="storage-location"
                        value={formData.storageLocation}
                        onChange={(e) => handleFieldChange('storageLocation', e.target.value)}
                        placeholder="Where statements are stored and access information"
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* Save & Continue */}
          <div className="flex justify-between items-center mt-8">
            {onPrevious && (
              <Button variant="skillbinder" onClick={onPrevious} className="skillbinder">Previous</Button>
            )}
            <div className="flex gap-4">
              <Button 
                type="button" 
                onClick={handleGeneratePDF}
                className="inline-flex items-center px-4 py-2 bg-[#17394B] text-white rounded-lg hover:bg-[#153A4B] transition-colors"
              >
                <svg 
                  className="w-4 h-4 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                Generate PDF
              </Button>
              <Button type="submit" variant="skillbinder_yellow" className="skillbinder_yellow">Save & Continue</Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FinanceBusinessForm; 