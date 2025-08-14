import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { generatePDF } from '../lib/pdfGenerator';
import AudioPlayer from './AudioPlayer';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import { useTrial } from '@/contexts/TrialContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

interface InsurancePolicy {
  id: string;
  companyName: string;
  policyType: string;
  accountNumber: string;
  contacts: string;
  amount: string;
  beneficiary: string;
  notes: string;
}

interface AssignedBeneficiary {
  id: string;
  accountType: string;
  location: string;
}

interface SpecificBequest {
  id: string;
  item: string;
  recipientName: string;
  bequestListLocation: string;
}

interface EmployeeBenefit {
  id: string;
  beneficiaries: string;
  accountNumber: string;
  contacts: string;
  notes: string;
}

interface SocialSecurityBenefit {
  id: string;
  beneficiaries: string;
  accountNumber: string;
  contacts: string;
  notes: string;
}

interface RetirementBenefit {
  id: string;
  beneficiaries: string;
  accountNumber: string;
  contacts: string;
  notes: string;
}

interface VeteranBenefit {
  id: string;
  beneficiaries: string;
  accountNumber: string;
  contacts: string;
  notes: string;
}

interface BeneficiaryGroup {
  id: string;
  primaryBeneficiaries: string;
  contingentBeneficiaries: string;
}

interface BeneficiaryMessage {
  id: string;
  location: string;
}

interface DocumentLocation {
  id: string;
  documentType: string;
  location: string;
}

interface BeneficiariesInheritanceData {
  // Life and Health Insurance Policies
  insurancePolicies: InsurancePolicy[];
  
  // Employee Benefits
  employeeBenefits: EmployeeBenefit[];
  
  // Social Security
  socialSecurityBenefits: SocialSecurityBenefit[];
  
  // Retirement
  retirementBenefits: RetirementBenefit[];
  
  // Veteran's Benefits
  veteranBenefits: VeteranBenefit[];
  
  // Primary & Contingent Beneficiaries
  beneficiaryGroups: BeneficiaryGroup[];
  
  // Assigned Beneficiaries on Accounts
  assignedBeneficiaries: AssignedBeneficiary[];
  
  // Specific Bequests
  specificBequests: SpecificBequest[];
  
  // Messages or Letters for Beneficiaries
  beneficiaryMessages: BeneficiaryMessage[];
  
  // Notes on Disinheritance or Special Instructions
  disinheritanceNotes: string;
  
  // Document Locations & Keys
  documentLocations: DocumentLocation[];
}

interface BeneficiariesInheritanceFormProps {
  onNext: () => void;
  onPrevious: () => void;
  initialData?: Partial<BeneficiariesInheritanceData>;
}

const BeneficiariesInheritanceForm: React.FC<BeneficiariesInheritanceFormProps> = ({
  onNext,
  onPrevious,
  initialData = {}
}) => {
  const { syncForm } = useDatabaseSync();
  const { userTier, isTrial } = useTrial();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [userInfo, setUserInfo] = useState<{ firstName?: string; lastName?: string; email?: string }>({});
  const [formData, setFormData] = useState<BeneficiariesInheritanceData>({
    insurancePolicies: initialData.insurancePolicies || [{ id: '1', companyName: '', policyType: '', accountNumber: '', contacts: '', amount: '', beneficiary: '', notes: '' }],
    employeeBenefits: initialData.employeeBenefits || [{ id: '1', beneficiaries: '', accountNumber: '', contacts: '', notes: '' }],
    socialSecurityBenefits: initialData.socialSecurityBenefits || [{ id: '1', beneficiaries: '', accountNumber: '', contacts: '', notes: '' }],
    retirementBenefits: initialData.retirementBenefits || [{ id: '1', beneficiaries: '', accountNumber: '', contacts: '', notes: '' }],
    veteranBenefits: initialData.veteranBenefits || [{ id: '1', beneficiaries: '', accountNumber: '', contacts: '', notes: '' }],
    beneficiaryGroups: initialData.beneficiaryGroups || [{ id: '1', primaryBeneficiaries: '', contingentBeneficiaries: '' }],
    assignedBeneficiaries: initialData.assignedBeneficiaries || [{ id: '1', accountType: '', location: '' }],
    specificBequests: initialData.specificBequests || [{ id: '1', item: '', recipientName: '', bequestListLocation: '' }],
    beneficiaryMessages: initialData.beneficiaryMessages || [{ id: '1', location: '' }],
    disinheritanceNotes: initialData.disinheritanceNotes || '',
    documentLocations: initialData.documentLocations || [
      { id: '1', documentType: 'Wills / Bequest Letters', location: '' },
      { id: '2', documentType: 'Life Insurance Policies', location: '' },
      { id: '3', documentType: 'Employment Agreement', location: '' },
      { id: '4', documentType: 'Social Security', location: '' },
      { id: '5', documentType: 'Retirement', location: '' },
      { id: '6', documentType: 'Veteran\'s Benefits', location: '' }
    ]
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

  const handleFieldChange = (field: keyof BeneficiariesInheritanceData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addInsurancePolicy = () => {
    const newPolicy: InsurancePolicy = {
      id: Date.now().toString(),
      companyName: '',
      policyType: '',
      accountNumber: '',
      contacts: '',
      amount: '',
      beneficiary: '',
      notes: ''
    };
    setFormData(prev => ({
      ...prev,
      insurancePolicies: [...prev.insurancePolicies, newPolicy]
    }));
  };

  const updateInsurancePolicy = (id: string, field: keyof InsurancePolicy, value: string) => {
    setFormData(prev => ({
      ...prev,
      insurancePolicies: prev.insurancePolicies.map(policy =>
        policy.id === id ? { ...policy, [field]: value } : policy
      )
    }));
  };

  const removeInsurancePolicy = (id: string) => {
    if (formData.insurancePolicies.length > 1) {
      setFormData(prev => ({
        ...prev,
        insurancePolicies: prev.insurancePolicies.filter(policy => policy.id !== id)
      }));
    }
  };

  const addAssignedBeneficiary = () => {
    const newBeneficiary: AssignedBeneficiary = {
      id: Date.now().toString(),
      accountType: '',
      location: ''
    };
    setFormData(prev => ({
      ...prev,
      assignedBeneficiaries: [...prev.assignedBeneficiaries, newBeneficiary]
    }));
  };

  const updateAssignedBeneficiary = (id: string, field: keyof AssignedBeneficiary, value: string) => {
    setFormData(prev => ({
      ...prev,
      assignedBeneficiaries: prev.assignedBeneficiaries.map(beneficiary =>
        beneficiary.id === id ? { ...beneficiary, [field]: value } : beneficiary
      )
    }));
  };

  const removeAssignedBeneficiary = (id: string) => {
    if (formData.assignedBeneficiaries.length > 1) {
      setFormData(prev => ({
        ...prev,
        assignedBeneficiaries: prev.assignedBeneficiaries.filter(beneficiary => beneficiary.id !== id)
      }));
    }
  };

  const addSpecificBequest = () => {
    const newBequest: SpecificBequest = {
      id: Date.now().toString(),
      item: '',
      recipientName: '',
      bequestListLocation: ''
    };
    setFormData(prev => ({
      ...prev,
      specificBequests: [...prev.specificBequests, newBequest]
    }));
  };

  const updateSpecificBequest = (id: string, field: keyof SpecificBequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      specificBequests: prev.specificBequests.map(bequest =>
        bequest.id === id ? { ...bequest, [field]: value } : bequest
      )
    }));
  };

  const removeSpecificBequest = (id: string) => {
    if (formData.specificBequests.length > 1) {
      setFormData(prev => ({
        ...prev,
        specificBequests: prev.specificBequests.filter(bequest => bequest.id !== id)
      }));
    }
  };

  // Employee Benefits functions
  const addEmployeeBenefit = () => {
    const newBenefit: EmployeeBenefit = {
      id: Date.now().toString(),
      beneficiaries: '',
      accountNumber: '',
      contacts: '',
      notes: ''
    };
    setFormData(prev => ({
      ...prev,
      employeeBenefits: [...prev.employeeBenefits, newBenefit]
    }));
  };

  const updateEmployeeBenefit = (id: string, field: keyof EmployeeBenefit, value: string) => {
    setFormData(prev => ({
      ...prev,
      employeeBenefits: prev.employeeBenefits.map(benefit =>
        benefit.id === id ? { ...benefit, [field]: value } : benefit
      )
    }));
  };

  const removeEmployeeBenefit = (id: string) => {
    if (formData.employeeBenefits.length > 1) {
      setFormData(prev => ({
        ...prev,
        employeeBenefits: prev.employeeBenefits.filter(benefit => benefit.id !== id)
      }));
    }
  };

  // Social Security Benefits functions
  const addSocialSecurityBenefit = () => {
    const newBenefit: SocialSecurityBenefit = {
      id: Date.now().toString(),
      beneficiaries: '',
      accountNumber: '',
      contacts: '',
      notes: ''
    };
    setFormData(prev => ({
      ...prev,
      socialSecurityBenefits: [...prev.socialSecurityBenefits, newBenefit]
    }));
  };

  const updateSocialSecurityBenefit = (id: string, field: keyof SocialSecurityBenefit, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialSecurityBenefits: prev.socialSecurityBenefits.map(benefit =>
        benefit.id === id ? { ...benefit, [field]: value } : benefit
      )
    }));
  };

  const removeSocialSecurityBenefit = (id: string) => {
    if (formData.socialSecurityBenefits.length > 1) {
      setFormData(prev => ({
        ...prev,
        socialSecurityBenefits: prev.socialSecurityBenefits.filter(benefit => benefit.id !== id)
      }));
    }
  };

  // Retirement Benefits functions
  const addRetirementBenefit = () => {
    const newBenefit: RetirementBenefit = {
      id: Date.now().toString(),
      beneficiaries: '',
      accountNumber: '',
      contacts: '',
      notes: ''
    };
    setFormData(prev => ({
      ...prev,
      retirementBenefits: [...prev.retirementBenefits, newBenefit]
    }));
  };

  const updateRetirementBenefit = (id: string, field: keyof RetirementBenefit, value: string) => {
    setFormData(prev => ({
      ...prev,
      retirementBenefits: prev.retirementBenefits.map(benefit =>
        benefit.id === id ? { ...benefit, [field]: value } : benefit
      )
    }));
  };

  const removeRetirementBenefit = (id: string) => {
    if (formData.retirementBenefits.length > 1) {
      setFormData(prev => ({
        ...prev,
        retirementBenefits: prev.retirementBenefits.filter(benefit => benefit.id !== id)
      }));
    }
  };

  // Veteran Benefits functions
  const addVeteranBenefit = () => {
    const newBenefit: VeteranBenefit = {
      id: Date.now().toString(),
      beneficiaries: '',
      accountNumber: '',
      contacts: '',
      notes: ''
    };
    setFormData(prev => ({
      ...prev,
      veteranBenefits: [...prev.veteranBenefits, newBenefit]
    }));
  };

  const updateVeteranBenefit = (id: string, field: keyof VeteranBenefit, value: string) => {
    setFormData(prev => ({
      ...prev,
      veteranBenefits: prev.veteranBenefits.map(benefit =>
        benefit.id === id ? { ...benefit, [field]: value } : benefit
      )
    }));
  };

  const removeVeteranBenefit = (id: string) => {
    if (formData.veteranBenefits.length > 1) {
      setFormData(prev => ({
        ...prev,
        veteranBenefits: prev.veteranBenefits.filter(benefit => benefit.id !== id)
      }));
    }
  };

  // Beneficiary Groups functions
  const addBeneficiaryGroup = () => {
    const newGroup: BeneficiaryGroup = {
      id: Date.now().toString(),
      primaryBeneficiaries: '',
      contingentBeneficiaries: ''
    };
    setFormData(prev => ({
      ...prev,
      beneficiaryGroups: [...prev.beneficiaryGroups, newGroup]
    }));
  };

  const updateBeneficiaryGroup = (id: string, field: keyof BeneficiaryGroup, value: string) => {
    setFormData(prev => ({
      ...prev,
      beneficiaryGroups: prev.beneficiaryGroups.map(group =>
        group.id === id ? { ...group, [field]: value } : group
      )
    }));
  };

  const removeBeneficiaryGroup = (id: string) => {
    if (formData.beneficiaryGroups.length > 1) {
      setFormData(prev => ({
        ...prev,
        beneficiaryGroups: prev.beneficiaryGroups.filter(group => group.id !== id)
      }));
    }
  };

  // Beneficiary Messages functions
  const addBeneficiaryMessage = () => {
    const newMessage: BeneficiaryMessage = {
      id: Date.now().toString(),
      location: ''
    };
    setFormData(prev => ({
      ...prev,
      beneficiaryMessages: [...prev.beneficiaryMessages, newMessage]
    }));
  };

  const updateBeneficiaryMessage = (id: string, field: keyof BeneficiaryMessage, value: string) => {
    setFormData(prev => ({
      ...prev,
      beneficiaryMessages: prev.beneficiaryMessages.map(message =>
        message.id === id ? { ...message, [field]: value } : message
      )
    }));
  };

  const removeBeneficiaryMessage = (id: string) => {
    if (formData.beneficiaryMessages.length > 1) {
      setFormData(prev => ({
        ...prev,
        beneficiaryMessages: prev.beneficiaryMessages.filter(message => message.id !== id)
      }));
    }
  };

  // Document Locations functions
  const addDocumentLocation = () => {
    const newLocation: DocumentLocation = {
      id: Date.now().toString(),
      documentType: '',
      location: ''
    };
    setFormData(prev => ({
      ...prev,
      documentLocations: [...prev.documentLocations, newLocation]
    }));
  };

  const updateDocumentLocation = (id: string, field: keyof DocumentLocation, value: string) => {
    setFormData(prev => ({
      ...prev,
      documentLocations: prev.documentLocations.map(doc =>
        doc.id === id ? { ...doc, [field]: value } : doc
      )
    }));
  };

  const removeDocumentLocation = (id: string) => {
    if (formData.documentLocations.length > 1) {
      setFormData(prev => ({
        ...prev,
        documentLocations: prev.documentLocations.filter(doc => doc.id !== id)
      }));
    }
  };

  const handleSave = async () => {
    console.log('=== BENEFICIARIES INHERITANCE SAVE START ===');
    
    // Show immediate feedback
    toast({
      title: "Saving beneficiaries & inheritance information...",
      description: "Please wait while we save your data.",
    });

    // Data will be saved to database only
    console.log('Beneficiaries inheritance data will be saved to database');

    // Sync to database if user is logged in
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
        const result = await syncForm(user.email, 'beneficiariesInheritanceData', formData);
        console.log('Sync result:', result);
        
        if (result.success) {
          toast({
            title: "Success!",
            description: "Your beneficiaries & inheritance information has been saved to the database and locally.",
          });
        } else {
          console.error('Sync failed:', result.error);
          
          // Show detailed error message
          let errorMessage = "Data saved locally but there was an issue saving to the database.";
          if (result.error && typeof result.error === 'string') {
            errorMessage += ` Error: ${result.error}`;
          } else if (result.error && result.error.message) {
            errorMessage += ` Error: ${result.error.message}`;
          }
          
          toast({
            title: "Warning",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Database sync error:', error);
        
        // Show detailed error message
        let errorMessage = "Data saved locally but there was an issue saving to the database.";
        if (error instanceof Error) {
          errorMessage += ` Error: ${error.message}`;
        }
        
        toast({
          title: "Warning",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } else {
      console.log('No authenticated user found');
      toast({
        title: "Success!",
        description: "Your beneficiaries & inheritance information has been saved locally. Please log in to sync to the cloud.",
      });
    }

    console.log('=== BENEFICIARIES INHERITANCE SAVE END ===');
    onNext();
  };

  // PDF generation handler
  const handleGeneratePDF = () => {
    generatePDF({
      sectionTitle: 'Beneficiaries & Inheritance',
      data: formData,
      formType: 'beneficiaries',
      userTier,
      isTrial,
      userInfo: userInfo
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-bold" style={{ color: '#E4B64A', fontSize: '28px' }}>Beneficiaries & Inheritance</CardTitle>
        <p className="text-lg" style={{ color: '#153A4B' }}>
          Designate beneficiaries and organize inheritance information for comprehensive legacy planning
        </p>
        <AudioPlayer audioFile="Section_5.mp3" size="md" sectionNumber={5} />
      </CardHeader>
      <CardContent>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <Accordion type="single" collapsible className="mb-6">
            {/* Life and Health Insurance Policies */}
            <AccordionItem value="insurance-policies">
              <AccordionTrigger style={{ color: '#000000' }}>Life and Health Insurance Policies</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.insurancePolicies.map((policy, index) => (
                      <div key={policy.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Insurance Policy {index + 1}</h4>
                          {formData.insurancePolicies.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeInsurancePolicy(policy.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`company-name-${policy.id}`}>Company Name</Label>
                            <Input
                              id={`company-name-${policy.id}`}
                              value={policy.companyName}
                              onChange={(e) => updateInsurancePolicy(policy.id, 'companyName', e.target.value)}
                              placeholder="Enter insurance company name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`policy-type-${policy.id}`}>Policy Type</Label>
                            <Select value={policy.policyType} onValueChange={(value) => updateInsurancePolicy(policy.id, 'policyType', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select policy type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="term-life">Term Life</SelectItem>
                                <SelectItem value="whole-life">Whole Life</SelectItem>
                                <SelectItem value="health">Health</SelectItem>
                                <SelectItem value="disability">Disability</SelectItem>
                                <SelectItem value="long-term-care">Long Term Care</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor={`account-number-${policy.id}`}>Account Number</Label>
                            <Input
                              id={`account-number-${policy.id}`}
                              value={policy.accountNumber}
                              onChange={(e) => updateInsurancePolicy(policy.id, 'accountNumber', e.target.value)}
                              placeholder="Enter account number"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`contacts-${policy.id}`}>Contacts</Label>
                            <Input
                              id={`contacts-${policy.id}`}
                              value={policy.contacts}
                              onChange={(e) => updateInsurancePolicy(policy.id, 'contacts', e.target.value)}
                              placeholder="Enter contact information"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`amount-${policy.id}`}>Amount</Label>
                            <Input
                              id={`amount-${policy.id}`}
                              value={policy.amount}
                              onChange={(e) => updateInsurancePolicy(policy.id, 'amount', e.target.value)}
                              placeholder="Enter policy amount"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`beneficiary-${policy.id}`}>Beneficiary</Label>
                            <Input
                              id={`beneficiary-${policy.id}`}
                              value={policy.beneficiary}
                              onChange={(e) => updateInsurancePolicy(policy.id, 'beneficiary', e.target.value)}
                              placeholder="Enter beneficiary name"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`notes-${policy.id}`}>Notes</Label>
                            <Textarea
                              id={`notes-${policy.id}`}
                              value={policy.notes}
                              onChange={(e) => updateInsurancePolicy(policy.id, 'notes', e.target.value)}
                              placeholder="Additional notes about this policy"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addInsurancePolicy} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Policy
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Employee Benefits */}
            <AccordionItem value="employee-benefits">
              <AccordionTrigger style={{ color: '#000000' }}>Employee Benefits</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.employeeBenefits.map((benefit, index) => (
                      <div key={benefit.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Employee Benefit {index + 1}</h4>
                          {formData.employeeBenefits.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEmployeeBenefit(benefit.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`employee-beneficiaries-${benefit.id}`}>Beneficiary(ies)</Label>
                            <Input
                              id={`employee-beneficiaries-${benefit.id}`}
                              value={benefit.beneficiaries}
                              onChange={(e) => updateEmployeeBenefit(benefit.id, 'beneficiaries', e.target.value)}
                              placeholder="Enter beneficiary names"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`employee-account-number-${benefit.id}`}>Account Number</Label>
                            <Input
                              id={`employee-account-number-${benefit.id}`}
                              value={benefit.accountNumber}
                              onChange={(e) => updateEmployeeBenefit(benefit.id, 'accountNumber', e.target.value)}
                              placeholder="Enter account number"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`employee-contacts-${benefit.id}`}>Contacts</Label>
                            <Input
                              id={`employee-contacts-${benefit.id}`}
                              value={benefit.contacts}
                              onChange={(e) => updateEmployeeBenefit(benefit.id, 'contacts', e.target.value)}
                              placeholder="Enter contact information"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`employee-notes-${benefit.id}`}>Notes</Label>
                            <Textarea
                              id={`employee-notes-${benefit.id}`}
                              value={benefit.notes}
                              onChange={(e) => updateEmployeeBenefit(benefit.id, 'notes', e.target.value)}
                              placeholder="Additional notes about employee benefits"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addEmployeeBenefit} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Employee Benefit
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Social Security */}
            <AccordionItem value="social-security">
              <AccordionTrigger style={{ color: '#000000' }}>Social Security</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.socialSecurityBenefits.map((benefit, index) => (
                      <div key={benefit.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Social Security Benefit {index + 1}</h4>
                          {formData.socialSecurityBenefits.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSocialSecurityBenefit(benefit.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`social-security-beneficiaries-${benefit.id}`}>Beneficiary(ies)</Label>
                            <Input
                              id={`social-security-beneficiaries-${benefit.id}`}
                              value={benefit.beneficiaries}
                              onChange={(e) => updateSocialSecurityBenefit(benefit.id, 'beneficiaries', e.target.value)}
                              placeholder="Enter beneficiary names"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`social-security-account-number-${benefit.id}`}>Account Number</Label>
                            <Input
                              id={`social-security-account-number-${benefit.id}`}
                              value={benefit.accountNumber}
                              onChange={(e) => updateSocialSecurityBenefit(benefit.id, 'accountNumber', e.target.value)}
                              placeholder="Enter account number"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`social-security-contacts-${benefit.id}`}>Contacts</Label>
                            <Input
                              id={`social-security-contacts-${benefit.id}`}
                              value={benefit.contacts}
                              onChange={(e) => updateSocialSecurityBenefit(benefit.id, 'contacts', e.target.value)}
                              placeholder="Enter contact information"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`social-security-notes-${benefit.id}`}>Notes</Label>
                            <Textarea
                              id={`social-security-notes-${benefit.id}`}
                              value={benefit.notes}
                              onChange={(e) => updateSocialSecurityBenefit(benefit.id, 'notes', e.target.value)}
                              placeholder="Additional notes about social security"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addSocialSecurityBenefit} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Social Security Benefit
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Retirement */}
            <AccordionItem value="retirement">
              <AccordionTrigger style={{ color: '#000000' }}>Retirement</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.retirementBenefits.map((benefit, index) => (
                      <div key={benefit.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Retirement Benefit {index + 1}</h4>
                          {formData.retirementBenefits.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRetirementBenefit(benefit.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`retirement-beneficiaries-${benefit.id}`}>Beneficiary(ies)</Label>
                            <Input
                              id={`retirement-beneficiaries-${benefit.id}`}
                              value={benefit.beneficiaries}
                              onChange={(e) => updateRetirementBenefit(benefit.id, 'beneficiaries', e.target.value)}
                              placeholder="Enter beneficiary names"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`retirement-account-number-${benefit.id}`}>Account Number</Label>
                            <Input
                              id={`retirement-account-number-${benefit.id}`}
                              value={benefit.accountNumber}
                              onChange={(e) => updateRetirementBenefit(benefit.id, 'accountNumber', e.target.value)}
                              placeholder="Enter account number"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`retirement-contacts-${benefit.id}`}>Contacts</Label>
                            <Input
                              id={`retirement-contacts-${benefit.id}`}
                              value={benefit.contacts}
                              onChange={(e) => updateRetirementBenefit(benefit.id, 'contacts', e.target.value)}
                              placeholder="Enter contact information"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`retirement-notes-${benefit.id}`}>Notes</Label>
                            <Textarea
                              id={`retirement-notes-${benefit.id}`}
                              value={benefit.notes}
                              onChange={(e) => updateRetirementBenefit(benefit.id, 'notes', e.target.value)}
                              placeholder="Additional notes about retirement benefits"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addRetirementBenefit} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Retirement Benefit
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Veteran's Benefits */}
            <AccordionItem value="veteran-benefits">
              <AccordionTrigger style={{ color: '#000000' }}>Veteran's Benefits</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.veteranBenefits.map((benefit, index) => (
                      <div key={benefit.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Veteran Benefit {index + 1}</h4>
                          {formData.veteranBenefits.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeVeteranBenefit(benefit.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`veteran-beneficiaries-${benefit.id}`}>Beneficiary(ies)</Label>
                            <Input
                              id={`veteran-beneficiaries-${benefit.id}`}
                              value={benefit.beneficiaries}
                              onChange={(e) => updateVeteranBenefit(benefit.id, 'beneficiaries', e.target.value)}
                              placeholder="Enter beneficiary names"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`veteran-account-number-${benefit.id}`}>Account Number</Label>
                            <Input
                              id={`veteran-account-number-${benefit.id}`}
                              value={benefit.accountNumber}
                              onChange={(e) => updateVeteranBenefit(benefit.id, 'accountNumber', e.target.value)}
                              placeholder="Enter account number"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`veteran-contacts-${benefit.id}`}>Contacts</Label>
                            <Input
                              id={`veteran-contacts-${benefit.id}`}
                              value={benefit.contacts}
                              onChange={(e) => updateVeteranBenefit(benefit.id, 'contacts', e.target.value)}
                              placeholder="Enter contact information"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`veteran-notes-${benefit.id}`}>Notes</Label>
                            <Textarea
                              id={`veteran-notes-${benefit.id}`}
                              value={benefit.notes}
                              onChange={(e) => updateVeteranBenefit(benefit.id, 'notes', e.target.value)}
                              placeholder="Additional notes about veteran benefits"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addVeteranBenefit} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Veteran Benefit
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Primary & Contingent Beneficiaries */}
            <AccordionItem value="primary-contingent">
              <AccordionTrigger style={{ color: '#000000' }}>Primary & Contingent Beneficiaries</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.beneficiaryGroups.map((group, index) => (
                      <div key={group.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Beneficiary Group {index + 1}</h4>
                          {formData.beneficiaryGroups.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBeneficiaryGroup(group.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`primary-beneficiaries-${group.id}`}>Primary Name(s)</Label>
                            <Input
                              id={`primary-beneficiaries-${group.id}`}
                              value={group.primaryBeneficiaries}
                              onChange={(e) => updateBeneficiaryGroup(group.id, 'primaryBeneficiaries', e.target.value)}
                              placeholder="Enter primary beneficiary names"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`contingent-beneficiaries-${group.id}`}>Contingent Name(s)</Label>
                            <Input
                              id={`contingent-beneficiaries-${group.id}`}
                              value={group.contingentBeneficiaries}
                              onChange={(e) => updateBeneficiaryGroup(group.id, 'contingentBeneficiaries', e.target.value)}
                              placeholder="Enter contingent beneficiary names"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addBeneficiaryGroup} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Beneficiary Group
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Assigned Beneficiaries on Accounts */}
            <AccordionItem value="assigned-beneficiaries">
              <AccordionTrigger style={{ color: '#000000' }}>Assigned Beneficiaries on Accounts</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.assignedBeneficiaries.map((beneficiary, index) => (
                      <div key={beneficiary.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Account {index + 1}</h4>
                          {formData.assignedBeneficiaries.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAssignedBeneficiary(beneficiary.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`account-type-${beneficiary.id}`}>Account Type / Beneficiary Name(s)</Label>
                            <Input
                              id={`account-type-${beneficiary.id}`}
                              value={beneficiary.accountType}
                              onChange={(e) => updateAssignedBeneficiary(beneficiary.id, 'accountType', e.target.value)}
                              placeholder="Enter account type and beneficiary names"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`location-${beneficiary.id}`}>Location of Confirmation Docs</Label>
                            <Input
                              id={`location-${beneficiary.id}`}
                              value={beneficiary.location}
                              onChange={(e) => updateAssignedBeneficiary(beneficiary.id, 'location', e.target.value)}
                              placeholder="Where confirmation documents are stored"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addAssignedBeneficiary} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Account
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Specific Bequests */}
            <AccordionItem value="specific-bequests">
              <AccordionTrigger style={{ color: '#000000' }}>Specific Bequests (Heirlooms, Gifts)</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.specificBequests.map((bequest, index) => (
                      <div key={bequest.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Bequest {index + 1}</h4>
                          {formData.specificBequests.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSpecificBequest(bequest.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`item-${bequest.id}`}>Item</Label>
                            <Input
                              id={`item-${bequest.id}`}
                              value={bequest.item}
                              onChange={(e) => updateSpecificBequest(bequest.id, 'item', e.target.value)}
                              placeholder="Enter item description"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`recipient-name-${bequest.id}`}>Recipient Name(s)</Label>
                            <Input
                              id={`recipient-name-${bequest.id}`}
                              value={bequest.recipientName}
                              onChange={(e) => updateSpecificBequest(bequest.id, 'recipientName', e.target.value)}
                              placeholder="Enter recipient name(s)"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`bequest-list-location-${bequest.id}`}>Bequest List Location</Label>
                            <Input
                              id={`bequest-list-location-${bequest.id}`}
                              value={bequest.bequestListLocation}
                              onChange={(e) => updateSpecificBequest(bequest.id, 'bequestListLocation', e.target.value)}
                              placeholder="Where bequest list is stored"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addSpecificBequest} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Bequest
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Messages or Letters for Beneficiaries */}
            <AccordionItem value="beneficiary-messages">
              <AccordionTrigger style={{ color: '#000000' }}>Messages or Letters for Beneficiaries</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.beneficiaryMessages.map((message, index) => (
                      <div key={message.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Message Location {index + 1}</h4>
                          {formData.beneficiaryMessages.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBeneficiaryMessage(message.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div>
                          <Label htmlFor={`beneficiary-messages-location-${message.id}`}>Location(s)</Label>
                          <Input
                            id={`beneficiary-messages-location-${message.id}`}
                            value={message.location}
                            onChange={(e) => updateBeneficiaryMessage(message.id, 'location', e.target.value)}
                            placeholder="Where messages or letters are stored"
                          />
                        </div>
                      </div>
                    ))}
                    <Button onClick={addBeneficiaryMessage} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Message Location
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Notes on Disinheritance or Special Instructions */}
            <AccordionItem value="disinheritance-notes">
              <AccordionTrigger style={{ color: '#000000' }}>Notes on Disinheritance or Special Instructions</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="disinheritance-notes">Details</Label>
                      <Textarea
                        id="disinheritance-notes"
                        value={formData.disinheritanceNotes}
                        onChange={(e) => handleFieldChange('disinheritanceNotes', e.target.value)}
                        placeholder="Enter details about disinheritance or special instructions"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Document Locations & Keys */}
            <AccordionItem value="document-locations">
              <AccordionTrigger style={{ color: '#000000' }}>Document Locations & Keys</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.documentLocations.map((doc, index) => (
                      <div key={doc.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Document Location {index + 1}</h4>
                          {formData.documentLocations.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDocumentLocation(doc.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`document-type-${doc.id}`}>Document Type</Label>
                            <Input
                              id={`document-type-${doc.id}`}
                              value={doc.documentType}
                              onChange={(e) => updateDocumentLocation(doc.id, 'documentType', e.target.value)}
                              placeholder="e.g. Wills, Life Insurance Policies, etc."
                            />
                          </div>
                          <div>
                            <Label htmlFor={`document-location-${doc.id}`}>Location</Label>
                            <Input
                              id={`document-location-${doc.id}`}
                              value={doc.location}
                              onChange={(e) => updateDocumentLocation(doc.id, 'location', e.target.value)}
                              placeholder="Where documents are stored"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addDocumentLocation} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Document Location
                    </Button>
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

export default BeneficiariesInheritanceForm; 