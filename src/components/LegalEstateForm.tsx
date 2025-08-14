import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import WillEstateSection from './forms/WillEstateSection';
import LawyerInfoSection from './forms/LawyerInfoSection';
import LegalFinancialContactsSection from './forms/LegalFinancialContactsSection';
import ExecutorDetailsSection from './forms/ExecutorDetailsSection';
import PowerOfAttorneySection from './forms/PowerOfAttorneySection';
import ExecutorNotesSection from './forms/ExecutorNotesSection';
import AlternateExecutorCard from './forms/AlternateExecutorCard';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import { generatePDF } from '../lib/pdfGenerator';
import AudioPlayer from './AudioPlayer';
import { useTrial } from '../contexts/TrialContext';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import PersonalSafeSection from './forms/PersonalSafeSection';
import SafeDepositBoxSection from './forms/SafeDepositBoxSection';

const emptyLawyer = () => ({ id: uuidv4(), lawyer_name: '', lawyer_address: '' });
const emptyAltExecutor = () => ({ id: uuidv4(), alternate_executor_name: '', alternate_executor_phone: '', alternate_executor_email: '', alternate_executor_relationship: '' });
const emptyContact = () => ({ 
  id: uuidv4(), 
  contact_type: '', 
  full_name: '', 
  phone: '', 
  email: '', 
  company: '', 
  relationship: '', 
  notes: '' 
});
const emptyExecutor = () => ({ 
  id: uuidv4(), 
  full_name: '', 
  relationship: '', 
  phone: '', 
  email: '', 
  address: '', 
  aware: '', 
  accepted: '', 
  notes: '' 
});
const emptyFinancialPOA = () => ({ 
  id: uuidv4(), 
  agent_name: '', 
  contact_info: '', 
  relationship: '', 
  effective_when: '',
  notes: ''
});
const emptyHealthcareProxy = () => ({ 
  id: uuidv4(), 
  proxy_name: '', 
  alternate_proxy: '',
  contact_info: '',
  relationship: '',
  notes: ''
});
const emptyOtherPOA = () => ({ 
  id: uuidv4(), 
  role_name: '', 
  agent_name: '',
  contact_info: '',
  notes: '' 
});
const emptySafe = () => ({ 
  id: uuidv4(), 
  location: '', 
  combination: '', 
  contents: '',
  notes: ''
});
const emptySafeDepositBox = () => ({ 
  id: uuidv4(), 
  bank: '', 
  location: '', 
  box_number: '', 
  key_location: '', 
  contents: '',
  notes: ''
});

const LegalEstateForm: React.FC<{ onNext: () => void; onPrevious?: () => void }> = ({ onNext, onPrevious }) => {
  const { toast } = useToast();
  const navigate = useNavigate ? useNavigate() : () => {};
  const { userTier, isTrial } = useTrial();
  const { syncForm } = useDatabaseSync();
  const { user, isAuthenticated } = useAuth();
  const [userInfo, setUserInfo] = useState<{ firstName?: string; lastName?: string; email?: string }>({});
  const [formData, setFormData] = useState<any>({});
  const [lawyers, setLawyers] = useState([emptyLawyer()]);
  const [altExecutors, setAltExecutors] = useState([]);
  const [contacts, setContacts] = useState([emptyContact()]);
  const [executors, setExecutors] = useState([emptyExecutor()]);
  const [financialPOA, setFinancialPOA] = useState([emptyFinancialPOA()]);
  const [healthcareProxies, setHealthcareProxies] = useState([emptyHealthcareProxy()]);
  const [otherPOA, setOtherPOA] = useState([emptyOtherPOA()]);
  const [safes, setSafes] = useState([emptySafe()]);
  const [safeDepositBoxes, setSafeDepositBoxes] = useState([emptySafeDepositBox()]);

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
  
  // Load saved data from localStorage on component mount
  useEffect(() => {
    console.log('Loading saved data from localStorage...');
    const savedData = localStorage.getItem('legalEstateForm');
    console.log('Raw saved data:', savedData);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        console.log('Parsed saved data:', parsed);
        setFormData(parsed);
        if (parsed.lawyers) {
          setLawyers(parsed.lawyers.length > 0 ? parsed.lawyers : [emptyLawyer()]);
        }
        if (parsed.alternate_executors) {
          setAltExecutors(parsed.alternate_executors);
        }
        if (parsed.contacts) {
          setContacts(parsed.contacts.length > 0 ? parsed.contacts : [emptyContact()]);
        }
        if (parsed.executors) {
          setExecutors(parsed.executors.length > 0 ? parsed.executors : [emptyExecutor()]);
        }
        if (parsed.financial_poa) {
          setFinancialPOA(parsed.financial_poa.length > 0 ? parsed.financial_poa : [emptyFinancialPOA()]);
        }
        if (parsed.healthcare_proxies) {
          setHealthcareProxies(parsed.healthcare_proxies.length > 0 ? parsed.healthcare_proxies : [emptyHealthcareProxy()]);
        }
        if (parsed.other_poa) {
          setOtherPOA(parsed.other_poa.length > 0 ? parsed.other_poa : [emptyOtherPOA()]);
        }
        if (parsed.safes) {
          setSafes(parsed.safes.length > 0 ? parsed.safes : [emptySafe()]);
        }
        if (parsed.safe_deposit_boxes) {
          setSafeDepositBoxes(parsed.safe_deposit_boxes.length > 0 ? parsed.safe_deposit_boxes : [emptySafeDepositBox()]);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    } else {
      console.log('No saved data found');
    }
  }, []);

  // Manual save function for testing
  const handleManualSave = async () => {
    const dataToSave = {
      ...formData,
      lawyers,
      alternate_executors: altExecutors,
      contacts
    };
    console.log('Manual save - data to save:', dataToSave);
    
    // Save to database instead of localStorage
    if (user?.email) {
      try {
        await syncForm(user.email, 'legalEstateData', dataToSave);
        toast({ title: 'Saved', description: 'Data saved to database.' });
      } catch (error) {
        console.error('Error saving to database:', error);
        toast({ title: 'Error', description: 'Failed to save to database.', variant: 'destructive' });
      }
    } else {
      toast({ title: 'Authentication Required', description: 'Please log in to save data.', variant: 'destructive' });
    }
  };

  // Add auto-save to database every 30 seconds
  useEffect(() => {
    console.log('Setting up auto-save interval...');
    const autoSaveInterval = setInterval(async () => {
      if (!user?.email) return;
      
      const dataToSave = {
        ...formData,
        lawyers,
        alternate_executors: altExecutors,
        contacts,
        executors,
        financial_poa: financialPOA,
        healthcare_proxies: healthcareProxies,
        other_poa: otherPOA,
        safes: safes,
        safe_deposit_boxes: safeDepositBoxes
      };
      console.log('Auto-saving data to database:', dataToSave);
      
      try {
        await syncForm(user.email, 'legalEstateData', dataToSave);
        console.log('Data auto-saved to database');
      } catch (error) {
        console.error('Auto-save error:', error);
      }
    }, 30000);
    
    return () => {
      console.log('Clearing auto-save interval');
      clearInterval(autoSaveInterval);
    };
  }, [formData, lawyers, altExecutors, contacts, executors, financialPOA, healthcareProxies, otherPOA, safes, safeDepositBoxes, user?.email]);

  // Handler for all simple fields
  const handleChange = (field: string, value: any) => setFormData((prev: any) => ({ ...prev, [field]: value }));

  // Lawyer repeater handlers
  const handleAddLawyer = () => setLawyers(prev => [...prev, emptyLawyer()]);
  const handleUpdateLawyer = (id: string, field: string, value: string) => setLawyers(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  const handleDeleteLawyer = (id: string) => setLawyers(prev => prev.filter(l => l.id !== id));

  // Alternate executor handlers
  const handleAddAltExecutor = () => setAltExecutors(prev => [...prev, emptyAltExecutor()]);
  const handleUpdateAltExecutor = (id: string, field: string, value: string) => setAltExecutors(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  const handleDeleteAltExecutor = (id: string) => setAltExecutors(prev => prev.filter(e => e.id !== id));

  // Contact handlers
  const handleAddContact = () => setContacts(prev => [...prev, emptyContact()]);
  const handleUpdateContact = (id: string, field: string, value: string) => setContacts(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  const handleDeleteContact = (id: string) => setContacts(prev => prev.filter(c => c.id !== id));

  // Executor handlers
  const handleAddExecutor = () => setExecutors(prev => [...prev, emptyExecutor()]);
  const handleUpdateExecutor = (id: string, field: string, value: string) => setExecutors(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  const handleDeleteExecutor = (id: string) => setExecutors(prev => prev.filter(e => e.id !== id));

  // POA handlers
  const handleAddFinancialPOA = () => setFinancialPOA(prev => [...prev, emptyFinancialPOA()]);
  const handleUpdateFinancialPOA = (id: string, field: string, value: string) => setFinancialPOA(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  const handleDeleteFinancialPOA = (id: string) => setFinancialPOA(prev => prev.filter(p => p.id !== id));

  const handleAddHealthcareProxy = () => setHealthcareProxies(prev => [...prev, emptyHealthcareProxy()]);
  const handleUpdateHealthcareProxy = (id: string, field: string, value: string) => setHealthcareProxies(prev => prev.map(h => h.id === id ? { ...h, [field]: value } : h));
  const handleDeleteHealthcareProxy = (id: string) => setHealthcareProxies(prev => prev.filter(h => h.id !== id));

  const handleAddOtherPOA = () => setOtherPOA(prev => [...prev, emptyOtherPOA()]);
  const handleUpdateOtherPOA = (id: string, field: string, value: string) => setOtherPOA(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o));
  const handleDeleteOtherPOA = (id: string) => setOtherPOA(prev => prev.filter(o => o.id !== id));

  // Safe handlers
  const handleAddSafe = () => setSafes(prev => [...prev, emptySafe()]);
  const handleUpdateSafe = (id: string, field: string, value: string) => setSafes(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  const handleDeleteSafe = (id: string) => setSafes(prev => prev.filter(s => s.id !== id));

  // Safe Deposit Box handlers
  const handleAddSafeDepositBox = () => setSafeDepositBoxes(prev => [...prev, emptySafeDepositBox()]);
  const handleUpdateSafeDepositBox = (id: string, field: string, value: string) => setSafeDepositBoxes(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  const handleDeleteSafeDepositBox = (id: string) => setSafeDepositBoxes(prev => prev.filter(b => b.id !== id));

  // Save handler
  const handleSave = async () => {
    console.log('=== LEGAL ESTATE SAVE START ===');
    
    // Show immediate feedback
    toast({
      title: "Saving legal & estate information...",
      description: "Please wait while we save your data.",
    });

    // Compose comprehensive payload with all legal & estate data
    const formDataToSave = {
      // Will & Estate Overview
      will_exists: formData.will_exists || 'No',
      will_location: formData.will_location || '',
      will_date: formData.will_date || '',
      estate_value: formData.estate_value || '',
      estate_notes: formData.estate_notes || '',
      
      // Lawyer Information
      lawyers: lawyers || [],
      
      // Legal and Financial Contacts
      contacts: contacts || [],
      
      // Executor Details
      executors: executors || [],
      
      // Alternate Executors
      alternate_executors: altExecutors || [],
      
      // Power of Attorney (POA)
      financial_poa: financialPOA || [],
      healthcare_proxies: healthcareProxies || [],
      other_poa: otherPOA || [],
      
      // Supporting Legal Documents
      trust_exists: formData.trust_exists || 'No',
      trust_name: formData.trust_name || '',
      trust_date: formData.trust_date || '',
      trust_location: formData.trust_location || '',
      living_will: formData.living_will || 'No',
      living_will_date: formData.living_will_date || '',
      living_will_location: formData.living_will_location || '',
      healthcare_proxy: formData.healthcare_proxy || 'No',
      healthcare_proxy_name: formData.healthcare_proxy_name || '',
      healthcare_proxy_date: formData.healthcare_proxy_date || '',
      healthcare_proxy_location: formData.healthcare_proxy_location || '',
      
      // Personal Safe Details
      safes: safes || [],
      
      // Safe Deposit Box
      safe_deposit_boxes: safeDepositBoxes || [],
      
      // Additional Notes
      additional_notes: formData.additional_notes || ''
    };

    // Data will be saved to database only
    console.log('Legal estate data will be saved to database');

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
        const result = await syncForm(user.email, 'legalEstateData', formDataToSave);
        console.log('Sync result:', result);
        
        if (result.success) {
          toast({
            title: "Success!",
            description: "Your legal & estate information has been saved to the database and locally.",
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
        description: "Your legal & estate information has been saved locally. Please log in to sync to the cloud.",
      });
    }

    console.log('=== LEGAL ESTATE SAVE END ===');
    if (onNext) onNext();
  };

  // PDF generation handler
  const handleGeneratePDF = () => {
    generatePDF({
      sectionTitle: 'Legal & Estate Planning',
      data: {
        ...formData,
        lawyers,
        alternate_executors: altExecutors,
        contacts,
        executors,
        financial_poa: financialPOA,
        healthcare_proxies: healthcareProxies,
        other_poa: otherPOA,
        safes,
        safe_deposit_boxes: safeDepositBoxes
      },
      formType: 'legal',
      userTier,
      isTrial,
      userInfo: userInfo
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-bold" style={{ color: '#E4B64A', fontSize: '28px' }}>Legal & Estate Planning</CardTitle>
        <p className="text-lg" style={{ color: '#153A4B' }}>
          Organize your legal documents, estate plans, and executor information for comprehensive legacy planning
        </p>
        {isTrial && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-blue-800">
              <strong>Free Trial Mode:</strong> This section is read-only. Upgrade to edit and save your legal information.
            </p>
          </div>
        )}
        <AudioPlayer audioFile="Section_3.mp3" size="md" sectionNumber={3} />
      </CardHeader>
      <CardContent>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <Accordion type="single" collapsible className="w-full">
            {/* 1. Will & Estate Overview */}
            <AccordionItem value="will-estate">
              <AccordionTrigger style={{ color: '#153A4B' }}>Will & Estate Overview</AccordionTrigger>
              <AccordionContent>
                <WillEstateSection formData={formData} onChange={handleChange} />
              </AccordionContent>
            </AccordionItem>

            {/* 2. Lawyer Information */}
            <AccordionItem value="lawyer-info">
              <AccordionTrigger style={{ color: '#153A4B' }}>Lawyer Information</AccordionTrigger>
              <AccordionContent>
                <LawyerInfoSection
                  lawyers={lawyers}
                  onAddLawyer={handleAddLawyer}
                  onUpdateLawyer={handleUpdateLawyer}
                  onDeleteLawyer={handleDeleteLawyer}
                />
              </AccordionContent>
            </AccordionItem>

            {/* 3. Legal and Financial Contacts */}
            <AccordionItem value="legal-financial-contacts">
              <AccordionTrigger style={{ color: '#153A4B' }}>Legal and Financial Contacts</AccordionTrigger>
              <AccordionContent>
                <LegalFinancialContactsSection
                  contacts={contacts}
                  onAddContact={handleAddContact}
                  onUpdateContact={handleUpdateContact}
                  onDeleteContact={handleDeleteContact}
                />
              </AccordionContent>
            </AccordionItem>

            {/* 4. Executor Details */}
            <AccordionItem value="executor-details">
              <AccordionTrigger style={{ color: '#153A4B' }}>Executor Details</AccordionTrigger>
              <AccordionContent>
                <ExecutorDetailsSection
                  executors={executors}
                  onAddExecutor={handleAddExecutor}
                  onUpdateExecutor={handleUpdateExecutor}
                  onDeleteExecutor={handleDeleteExecutor}
                />
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <CardTitle>Alternate Executor(s)</CardTitle>
                    <Button type="button" variant="outline" onClick={handleAddAltExecutor}>+ Add Alternate Executor</Button>
                  </div>
                  {altExecutors.map((executor, idx) => (
                    <AlternateExecutorCard
                      key={executor.id}
                      executor={executor}
                      index={idx}
                      onUpdate={handleUpdateAltExecutor}
                      onDelete={handleDeleteAltExecutor}
                    />
                  ))}
                </div>
                <ExecutorNotesSection formData={formData} onChange={handleChange} />
              </AccordionContent>
            </AccordionItem>

            {/* 5. Power of Attorney (POA) */}
            <AccordionItem value="power-of-attorney">
              <AccordionTrigger style={{ color: '#153A4B' }}>Power of Attorney (POA)</AccordionTrigger>
              <AccordionContent>
                <PowerOfAttorneySection
                  financialPOA={financialPOA}
                  healthcareProxies={healthcareProxies}
                  otherPOA={otherPOA}
                  onAddFinancialPOA={handleAddFinancialPOA}
                  onUpdateFinancialPOA={handleUpdateFinancialPOA}
                  onDeleteFinancialPOA={handleDeleteFinancialPOA}
                  onAddHealthcareProxy={handleAddHealthcareProxy}
                  onUpdateHealthcareProxy={handleUpdateHealthcareProxy}
                  onDeleteHealthcareProxy={handleDeleteHealthcareProxy}
                  onAddOtherPOA={handleAddOtherPOA}
                  onUpdateOtherPOA={handleUpdateOtherPOA}
                  onDeleteOtherPOA={handleDeleteOtherPOA}
                />
              </AccordionContent>
            </AccordionItem>

            {/* 6. Supporting Legal Documents */}
            <AccordionItem value="supporting-docs">
              <AccordionTrigger style={{ color: '#153A4B' }}>Supporting Legal Documents</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="space-y-6">
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
                      <Label>Burial or Cremation Authorization</Label>
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

            {/* 7. Personal Safe Details */}
            <AccordionItem value="personal-safe">
              <AccordionTrigger style={{ color: '#153A4B' }}>Personal Safe Details</AccordionTrigger>
              <AccordionContent>
                <PersonalSafeSection
                  safes={safes}
                  onAddSafe={handleAddSafe}
                  onUpdateSafe={handleUpdateSafe}
                  onDeleteSafe={handleDeleteSafe}
                />
              </AccordionContent>
            </AccordionItem>

            {/* 8. Safe Deposit Box */}
            <AccordionItem value="safe-deposit">
              <AccordionTrigger style={{ color: '#153A4B' }}>Safe Deposit Box</AccordionTrigger>
              <AccordionContent>
                <SafeDepositBoxSection
                  safeDepositBoxes={safeDepositBoxes}
                  onAddSafeDepositBox={handleAddSafeDepositBox}
                  onUpdateSafeDepositBox={handleUpdateSafeDepositBox}
                  onDeleteSafeDepositBox={handleDeleteSafeDepositBox}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Save & Continue Button */}
          <div className="flex justify-between items-center mt-8">
            {onPrevious && (
              <Button variant="skillbinder" onClick={onPrevious} className="skillbinder">Previous</Button>
            )}
            <div className="flex gap-4">
              {!isTrial && (
                <>
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
                </>
              )}
              {isTrial && (
                <Button 
                  type="button" 
                  onClick={() => window.location.href = '/pricing'}
                  variant="skillbinder_yellow" 
                  className="skillbinder_yellow"
                >
                  Upgrade to Continue
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LegalEstateForm; 