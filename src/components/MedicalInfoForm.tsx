import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { format } from 'date-fns';
import { generatePDF } from '../lib/pdfGenerator';
import { Plus, Trash2 } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import { useTrial } from '../contexts/TrialContext';
import { useToast } from '@/hooks/use-toast';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { formatPhoneNumber } from '@/lib/phoneNumberFormatter';

const emptyPhysician = () => ({ fullName: '', specialty: '', clinic: '', phone: '', email: '', emergencyContact: '' });
const emptyMedication = () => ({ name: '', dosage: '', frequency: '', reason: '' });
const emptyChronicIllness = () => ({ condition: '', diagnosedDate: '', notes: '' });
const emptySurgery = () => ({ procedure: '', date: '', hospital: '', notes: '' });
const emptyHospitalization = () => ({ reason: '', date: '', hospital: '', notes: '' });

const MedicalInfoForm: React.FC<{ onNext: () => void; onPrevious?: () => void }> = ({ onNext, onPrevious }) => {
  console.log('MedicalInfoForm component is rendering');
  const { userTier, isTrial } = useTrial();
  const { toast } = useToast();
  const { syncForm } = useDatabaseSync();
  const { user, isAuthenticated } = useAuth();
  const [userInfo, setUserInfo] = React.useState<{ firstName?: string; lastName?: string; email?: string }>({});
  
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
  React.useEffect(() => {
    if (user?.email) {
      fetchUserInfo();
    }
  }, [user?.email]);
  
  // Physician Information
  const [physicians, setPhysicians] = React.useState([emptyPhysician()]);
  const handlePhysicianChange = (idx: number, field: string, value: string) => {
    if (field === 'phone') {
      // Use phone number formatting for physician phones
      const formatted = formatPhoneNumber(value);
      setPhysicians(prev => prev.map((doc, i) => i === idx ? { ...doc, [field]: formatted.formatted } : doc));
    } else {
      setPhysicians(prev => prev.map((doc, i) => i === idx ? { ...doc, [field]: value } : doc));
    }
  };
  const addPhysician = () => setPhysicians(prev => ([...prev, emptyPhysician()]));

  // Health Insurance & ID
  const [insuranceNotes, setInsuranceNotes] = React.useState('');

  // Medications
  const [medications, setMedications] = React.useState([{ ...emptyMedication() }]);
  const [supplements, setSupplements] = React.useState('');
  const handleMedicationChange = (idx: number, field: string, value: string) => {
    setMedications(prev => prev.map((med, i) => i === idx ? { ...med, [field]: value } : med));
  };
  const addMedication = () => setMedications(prev => ([...prev, emptyMedication()]));

  // Pharmacy Info
  const [pharmacyName, setPharmacyName] = React.useState('');
  const [pharmacyPhone, setPharmacyPhone] = React.useState('');
  const handlePharmacyPhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setPharmacyPhone(formatted.formatted);
  };

  // Allergies & Reactions
  const [allergies, setAllergies] = React.useState('');
  const [reactions, setReactions] = React.useState('');

  // Medical History - Reformatted to use individual entries
  const [chronicIllnesses, setChronicIllnesses] = React.useState([emptyChronicIllness()]);
  const [surgeries, setSurgeries] = React.useState([emptySurgery()]);
  const [hospitalizations, setHospitalizations] = React.useState([emptyHospitalization()]);
  
  const handleChronicIllnessChange = (idx: number, field: string, value: string) => {
    setChronicIllnesses(prev => prev.map((illness, i) => i === idx ? { ...illness, [field]: value } : illness));
  };
  const addChronicIllness = () => setChronicIllnesses(prev => ([...prev, emptyChronicIllness()]));
  
  const handleSurgeryChange = (idx: number, field: string, value: string) => {
    setSurgeries(prev => prev.map((surgery, i) => i === idx ? { ...surgery, [field]: value } : surgery));
  };
  const addSurgery = () => setSurgeries(prev => ([...prev, emptySurgery()]));
  
  const handleHospitalizationChange = (idx: number, field: string, value: string) => {
    setHospitalizations(prev => prev.map((hosp, i) => i === idx ? { ...hosp, [field]: value } : hosp));
  };
  const addHospitalization = () => setHospitalizations(prev => ([...prev, emptyHospitalization()]));

  // Organ Donation & Advance Directives
  const [organDonor, setOrganDonor] = React.useState('No');
  const [organDonorState, setOrganDonorState] = React.useState('');
  const [organDonorLocation, setOrganDonorLocation] = React.useState('');
  const [livingWill, setLivingWill] = React.useState('No');
  const [livingWillDate, setLivingWillDate] = React.useState('');
  const [livingWillLocation, setLivingWillLocation] = React.useState('');
  const [dnr, setDnr] = React.useState('No');
  const [dnrDate, setDnrDate] = React.useState('');
  const [dnrLocation, setDnrLocation] = React.useState('');

  // Healthcare Proxy or Power of Attorney
  const [proxyName, setProxyName] = React.useState('');
  const [proxyRelationship, setProxyRelationship] = React.useState('');
  const [proxyPhone, setProxyPhone] = React.useState('');
  const handleProxyPhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setProxyPhone(formatted.formatted);
  };
  const [proxyEmail, setProxyEmail] = React.useState('');
  const [proxyLocation, setProxyLocation] = React.useState('');

  // Insurance Details
  const [primaryProvider, setPrimaryProvider] = React.useState('');
  const [policyNumber, setPolicyNumber] = React.useState('');
  const [policyholder, setPolicyholder] = React.useState('');
  const [insurancePhone, setInsurancePhone] = React.useState('');
  const handleInsurancePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setInsurancePhone(formatted.formatted);
  };
  const [secondaryCoverage, setSecondaryCoverage] = React.useState('');

  // Preferred Facilities
  const [nearestER, setNearestER] = React.useState('');
  const [preferredHospital, setPreferredHospital] = React.useState('');

  // Additional Notes
  const [additionalNotes, setAdditionalNotes] = React.useState('');

  // Data loading effect
  useEffect(() => {
    const loadMedicalData = async () => {
      console.log('=== LOADING MEDICAL DATA ===');
      
      // First try to load from localStorage
      const localData = localStorage.getItem('medicalInfoData');
      if (localData) {
        try {
          const parsedData = JSON.parse(localData);
          console.log('Loaded data from localStorage:', parsedData);
          
          // Populate form fields with local data (with backward compatibility)
          if (parsedData.physicians) setPhysicians(parsedData.physicians);
          else if (parsedData.doctors) setPhysicians(parsedData.doctors); // Backward compatibility
          if (parsedData.insuranceNotes) setInsuranceNotes(parsedData.insuranceNotes);
          if (parsedData.medications) setMedications(parsedData.medications);
          if (parsedData.supplements) setSupplements(parsedData.supplements);
          if (parsedData.pharmacyName) setPharmacyName(parsedData.pharmacyName);
          if (parsedData.pharmacyPhone) setPharmacyPhone(parsedData.pharmacyPhone);
          if (parsedData.allergies) setAllergies(parsedData.allergies);
          if (parsedData.reactions) setReactions(parsedData.reactions);
          if (parsedData.chronicIllnesses) setChronicIllnesses(parsedData.chronicIllnesses);
          if (parsedData.surgeries) setSurgeries(parsedData.surgeries);
          if (parsedData.hospitalizations) setHospitalizations(parsedData.hospitalizations);
          if (parsedData.organDonor) setOrganDonor(parsedData.organDonor);
          if (parsedData.organDonorState) setOrganDonorState(parsedData.organDonorState);
          if (parsedData.organDonorLocation) setOrganDonorLocation(parsedData.organDonorLocation);
          if (parsedData.livingWill) setLivingWill(parsedData.livingWill);
          if (parsedData.livingWillDate) setLivingWillDate(parsedData.livingWillDate);
          if (parsedData.livingWillLocation) setLivingWillLocation(parsedData.livingWillLocation);
          if (parsedData.dnr) setDnr(parsedData.dnr);
          if (parsedData.dnrDate) setDnrDate(parsedData.dnrDate);
          if (parsedData.dnrLocation) setDnrLocation(parsedData.dnrLocation);
          if (parsedData.proxyName) setProxyName(parsedData.proxyName);
          if (parsedData.proxyRelationship) setProxyRelationship(parsedData.proxyRelationship);
          if (parsedData.proxyPhone) setProxyPhone(parsedData.proxyPhone);
          if (parsedData.proxyEmail) setProxyEmail(parsedData.proxyEmail);
          if (parsedData.proxyLocation) setProxyLocation(parsedData.proxyLocation);
          if (parsedData.primaryProvider) setPrimaryProvider(parsedData.primaryProvider);
          if (parsedData.policyNumber) setPolicyNumber(parsedData.policyNumber);
          if (parsedData.policyholder) setPolicyholder(parsedData.policyholder);
          if (parsedData.insurancePhone) setInsurancePhone(parsedData.insurancePhone);
          if (parsedData.secondaryCoverage) setSecondaryCoverage(parsedData.secondaryCoverage);
          if (parsedData.nearestER) setNearestER(parsedData.nearestER);
          if (parsedData.preferredHospital) setPreferredHospital(parsedData.preferredHospital);
          if (parsedData.additionalNotes) setAdditionalNotes(parsedData.additionalNotes);
          
          console.log('Form populated with localStorage data');
        } catch (error) {
          console.error('Error parsing localStorage data:', error);
        }
      }

      // If user is authenticated, also try to load from database
      if (isAuthenticated && user?.id) {
        try {
          console.log('Loading from database for user:', user.id);
          const { data, error } = await supabase
            .from('medical_info')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Database load error:', error);
            return;
          }

          if (data) {
            console.log('Loaded data from database:', data);
            console.log('Physicians data from database:', data.physicians);
            console.log('Doctors data from database:', data.doctors);
            console.log('All database columns:', Object.keys(data));
            
            // Populate form fields with database data (overwrite localStorage if exists)
            if (data.physicians) {
              console.log('Setting physicians from database:', data.physicians);
              setPhysicians(data.physicians);
            } else if (data.doctors) {
              console.log('Setting physicians from doctors (backward compatibility):', data.doctors);
              setPhysicians(data.doctors); // Backward compatibility
            } else {
              console.log('No physicians or doctors data found in database');
            }
            if (data.insurance_notes) setInsuranceNotes(data.insurance_notes);
            if (data.medications) setMedications(data.medications);
            if (data.supplements) setSupplements(data.supplements);
            if (data.pharmacy_name) setPharmacyName(data.pharmacy_name);
            if (data.pharmacy_phone) setPharmacyPhone(data.pharmacy_phone);
            if (data.allergies) setAllergies(data.allergies);
            if (data.reactions) setReactions(data.reactions);
            if (data.chronic_illnesses) setChronicIllnesses(data.chronic_illnesses);
            if (data.surgeries) setSurgeries(data.surgeries);
            if (data.hospitalizations) setHospitalizations(data.hospitalizations);
            if (data.organ_donor) setOrganDonor(data.organ_donor);
            if (data.organ_donor_state) setOrganDonorState(data.organ_donor_state);
            if (data.organ_donor_location) setOrganDonorLocation(data.organ_donor_location);
            if (data.living_will) setLivingWill(data.living_will);
            if (data.living_will_date) setLivingWillDate(data.living_will_date);
            if (data.living_will_location) setLivingWillLocation(data.living_will_location);
            if (data.dnr) setDnr(data.dnr);
            if (data.dnr_date) setDnrDate(data.dnr_date);
            if (data.dnr_location) setDnrLocation(data.dnr_location);
            if (data.proxy_name) setProxyName(data.proxy_name);
            if (data.proxy_relationship) setProxyRelationship(data.proxy_relationship);
            if (data.proxy_phone) setProxyPhone(data.proxy_phone);
            if (data.proxy_email) setProxyEmail(data.proxy_email);
            if (data.proxy_location) setProxyLocation(data.proxy_location);
            if (data.primary_provider) setPrimaryProvider(data.primary_provider);
            if (data.policy_number) setPolicyNumber(data.policy_number);
            if (data.policyholder) setPolicyholder(data.policyholder);
            if (data.insurance_phone) setInsurancePhone(data.insurance_phone);
            if (data.secondary_coverage) setSecondaryCoverage(data.secondary_coverage);
            if (data.nearest_er) setNearestER(data.nearest_er);
            if (data.preferred_hospital) setPreferredHospital(data.preferred_hospital);
            if (data.additional_notes) setAdditionalNotes(data.additional_notes);
            
            console.log('Form populated with database data');
          }
        } catch (error) {
          console.error('Error loading from database:', error);
        }
      }
    };

    loadMedicalData();
  }, [isAuthenticated, user?.id]);

  // Save handler with database sync
  const handleSave = async () => {
    console.log('=== MEDICAL INFO SAVE START ===');
    
    // Show immediate feedback
    toast({
      title: "Saving medical information...",
      description: "Please wait while we save your data.",
    });

    const formData = {
      // Physician Information
      physicians,
      
      // Health Insurance & ID
      insuranceNotes,
      
      // Medications
      medications,
      supplements,
      
      // Pharmacy Info
      pharmacyName,
      pharmacyPhone,
      
      // Allergies & Reactions
      allergies,
      reactions,
      
      // Medical History
      chronicIllnesses,
      surgeries,
      hospitalizations,
      
      // Organ Donation & Advance Directives
      organDonor,
      organDonorState,
      organDonorLocation,
      livingWill,
      livingWillDate,
      livingWillLocation,
      dnr,
      dnrDate,
      dnrLocation,
      
      // Healthcare Proxy
      proxyName,
      proxyRelationship,
      proxyPhone,
      proxyEmail,
      proxyLocation,
      
      // Insurance Details
      primaryProvider,
      policyNumber,
      policyholder,
      insurancePhone,
      secondaryCoverage,
      
      // Preferred Facilities
      nearestER,
      preferredHospital,
      
      // Additional Notes
      additionalNotes
    };

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
        const result = await syncForm(user.email, 'medicalInfoData', formData);
        console.log('Sync result:', result);
        
        if (result.success) {
          toast({
            title: "Success!",
            description: "Your medical information has been saved to the database.",
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
        description: "Please log in to save your medical information to the database.",
        variant: "destructive",
      });
    }

    console.log('=== MEDICAL INFO SAVE END ===');
    onNext();
  };

  // Prepare user data for PDF generation (flattened structure)
  const prepareUserDataForPDF = () => {
    return {
      physicians: physicians,
      insuranceNotes: insuranceNotes,
      medications: medications,
      supplements: supplements,
      pharmacyName: pharmacyName,
      pharmacyPhone: pharmacyPhone,
      allergies: allergies,
      reactions: reactions,
      chronicIllnesses: chronicIllnesses,
      surgeries: surgeries,
      hospitalizations: hospitalizations,
      organDonor: organDonor,
      organDonorState: organDonorState,
      organDonorLocation: organDonorLocation,
      livingWill: livingWill,
      livingWillDate: livingWillDate,
      livingWillLocation: livingWillLocation,
      dnr: dnr,
      dnrDate: dnrDate,
      dnrLocation: dnrLocation,
      proxyName: proxyName,
      proxyRelationship: proxyRelationship,
      proxyPhone: proxyPhone,
      proxyEmail: proxyEmail,
      proxyLocation: proxyLocation,
      primaryProvider: primaryProvider,
      policyNumber: policyNumber,
      policyholder: policyholder,
      insurancePhone: insurancePhone,
      secondaryCoverage: secondaryCoverage,
      nearestER: nearestER,
      preferredHospital: preferredHospital,
      additionalNotes: additionalNotes
    };
  };



  return (
    <>
      <Card>
        <CardHeader className="text-center">
        <CardTitle className="font-bold" style={{ color: '#E4B64A', fontSize: '28px' }}>Medical Information</CardTitle>
        <p className="text-lg" style={{ color: '#153A4B' }}>
          Document your medical history, medications, and healthcare preferences for comprehensive legacy planning
        </p>
        <AudioPlayer audioFile="Section_2.mp3" size="md" sectionNumber={2} />
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {/* 1. Physician Information */}
          <AccordionItem value="physicians">
            <AccordionTrigger style={{ color: '#153A4B' }}>Physician Information</AccordionTrigger>
            <AccordionContent>
              {physicians.map((doc, idx) => (
                <Card key={idx} className="mb-4">
                  <CardHeader>
                    <CardTitle>{idx === 0 ? 'Primary Physician' : `Physician ${idx + 1}`}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Input value={doc.fullName} onChange={e => handlePhysicianChange(idx, 'fullName', e.target.value)} placeholder="Full Name" />
                    <Input value={doc.specialty} onChange={e => handlePhysicianChange(idx, 'specialty', e.target.value)} placeholder="Specialty" />
                    <Input value={doc.clinic} onChange={e => handlePhysicianChange(idx, 'clinic', e.target.value)} placeholder="Clinic / Hospital Name" />
                    <Input value={doc.phone} onChange={e => handlePhysicianChange(idx, 'phone', e.target.value)} placeholder="Phone Number" type="tel" />
                    <Input value={doc.email} onChange={e => handlePhysicianChange(idx, 'email', e.target.value)} placeholder="Email (optional)" type="email" />
                    <Input value={doc.emergencyContact} onChange={e => handlePhysicianChange(idx, 'emergencyContact', e.target.value)} placeholder="Emergency Contact at Clinic" />
                  </CardContent>
                </Card>
              ))}
              <Button type="button" variant="outline" onClick={addPhysician} className="mt-2">+ Add Another Physician</Button>
            </AccordionContent>
          </AccordionItem>

          {/* 2. Health Insurance & ID */}
          <AccordionItem value="insurance-id">
            <AccordionTrigger style={{ color: '#153A4B' }}>Health Insurance & ID</AccordionTrigger>
            <AccordionContent>
              <Textarea
                value={insuranceNotes}
                onChange={e => setInsuranceNotes(e.target.value)}
                placeholder="Enter any health insurance notes, policy numbers, or ID details here."
                className="min-h-[100px] resize-none"
              />
            </AccordionContent>
          </AccordionItem>

          {/* 3. Medications */}
          <AccordionItem value="medications">
            <AccordionTrigger style={{ color: '#153A4B' }}>Medications</AccordionTrigger>
            <AccordionContent>
              {medications.map((med, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                  <Input value={med.name} onChange={e => handleMedicationChange(idx, 'name', e.target.value)} placeholder="Medication Name" />
                  <Input value={med.dosage} onChange={e => handleMedicationChange(idx, 'dosage', e.target.value)} placeholder="Dosage" />
                  <Input value={med.frequency} onChange={e => handleMedicationChange(idx, 'frequency', e.target.value)} placeholder="Frequency" />
                  <Input value={med.reason} onChange={e => handleMedicationChange(idx, 'reason', e.target.value)} placeholder="Reason" />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addMedication} className="mb-2">+ Add Medication</Button>
              <Label className="block mt-4">Supplements / OTC</Label>
              <Textarea
                value={supplements}
                onChange={e => setSupplements(e.target.value)}
                placeholder="List any supplements or over-the-counter medications here."
                className="min-h-[60px] resize-none"
              />
            </AccordionContent>
          </AccordionItem>

          {/* 4. Pharmacy Info */}
          <AccordionItem value="pharmacy">
            <AccordionTrigger style={{ color: '#153A4B' }}>Pharmacy Info</AccordionTrigger>
            <AccordionContent>
              <Input value={pharmacyName} onChange={e => setPharmacyName(e.target.value)} placeholder="Pharmacy Name & Location" />
              <Input value={pharmacyPhone} onChange={e => handlePharmacyPhoneChange(e.target.value)} placeholder="Pharmacy Phone Number" type="tel" />
            </AccordionContent>
          </AccordionItem>

          {/* 5. Allergies & Reactions */}
          <AccordionItem value="allergies">
            <AccordionTrigger style={{ color: '#153A4B' }}>Allergies & Reactions</AccordionTrigger>
            <AccordionContent>
              <Label>Known Allergies (foods, meds, etc.)</Label>
              <Textarea
                value={allergies}
                onChange={e => setAllergies(e.target.value)}
                placeholder="List all known allergies here."
                className="min-h-[60px] resize-none"
              />
              <Label className="mt-4">Reactions and Treatments</Label>
              <Textarea
                value={reactions}
                onChange={e => setReactions(e.target.value)}
                placeholder="Describe reactions and treatments."
                className="min-h-[60px] resize-none"
              />
            </AccordionContent>
          </AccordionItem>

          {/* 6. Medical Conditions & History - Reformatted */}
          <AccordionItem value="history">
            <AccordionTrigger style={{ color: '#153A4B' }}>Medical Conditions & History</AccordionTrigger>
            <AccordionContent>
              {/* Chronic Illnesses / Diagnoses */}
              <div className="space-y-4 mb-6">
                <Label className="text-lg font-semibold">Chronic Illnesses / Diagnoses</Label>
                {chronicIllnesses.map((illness, idx) => (
                  <Card key={idx} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2 flex flex-row justify-between items-center">
                      <CardTitle className="text-lg">Condition {idx + 1}</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setChronicIllnesses(prev => prev.filter((_, i) => i !== idx))} 
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <Label htmlFor={`condition-${idx}`}>Condition/Diagnosis *</Label>
                        <Input 
                          id={`condition-${idx}`} 
                          value={illness.condition} 
                          onChange={e => handleChronicIllnessChange(idx, 'condition', e.target.value)} 
                          placeholder="e.g., Hypertension, Diabetes, Asthma" 
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`diagnosed-date-${idx}`}>Date Diagnosed</Label>
                        <Input 
                          id={`diagnosed-date-${idx}`} 
                          type="date" 
                          value={illness.diagnosedDate} 
                          onChange={e => handleChronicIllnessChange(idx, 'diagnosedDate', e.target.value)} 
                          placeholder="YYYY-MM-DD" 
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`condition-notes-${idx}`}>Notes/Details</Label>
                        <Textarea 
                          id={`condition-notes-${idx}`} 
                          value={illness.notes} 
                          onChange={e => handleChronicIllnessChange(idx, 'notes', e.target.value)} 
                          placeholder="Any additional details about this condition" 
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={addChronicIllness} className="flex items-center space-x-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Chronic Illness/Diagnosis
                </Button>
              </div>

              {/* Surgeries & Procedures */}
              <div className="space-y-4 mb-6">
                <Label className="text-lg font-semibold">Surgeries & Procedures</Label>
                {surgeries.map((surgery, idx) => (
                  <Card key={idx} className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-2 flex flex-row justify-between items-center">
                      <CardTitle className="text-lg">Surgery {idx + 1}</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSurgeries(prev => prev.filter((_, i) => i !== idx))} 
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <Label htmlFor={`procedure-${idx}`}>Procedure *</Label>
                        <Input 
                          id={`procedure-${idx}`} 
                          value={surgery.procedure} 
                          onChange={e => handleSurgeryChange(idx, 'procedure', e.target.value)} 
                          placeholder="e.g., Appendectomy, Knee Arthroscopy, Cataract Surgery" 
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`surgery-date-${idx}`}>Date</Label>
                        <Input 
                          id={`surgery-date-${idx}`} 
                          type="date" 
                          value={surgery.date} 
                          onChange={e => handleSurgeryChange(idx, 'date', e.target.value)} 
                          placeholder="YYYY-MM-DD" 
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`surgery-hospital-${idx}`}>Hospital/Facility</Label>
                        <Input 
                          id={`surgery-hospital-${idx}`} 
                          value={surgery.hospital} 
                          onChange={e => handleSurgeryChange(idx, 'hospital', e.target.value)} 
                          placeholder="e.g., St. Mary's Hospital" 
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`surgery-notes-${idx}`}>Notes/Details</Label>
                        <Textarea 
                          id={`surgery-notes-${idx}`} 
                          value={surgery.notes} 
                          onChange={e => handleSurgeryChange(idx, 'notes', e.target.value)} 
                          placeholder="Any additional details about this surgery" 
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={addSurgery} className="flex items-center space-x-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Surgery/Procedure
                </Button>
              </div>

              {/* Hospitalizations */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Hospitalizations</Label>
                {hospitalizations.map((hosp, idx) => (
                  <Card key={idx} className="border-l-4 border-l-orange-500">
                    <CardHeader className="pb-2 flex flex-row justify-between items-center">
                      <CardTitle className="text-lg">Hospitalization {idx + 1}</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setHospitalizations(prev => prev.filter((_, i) => i !== idx))} 
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <Label htmlFor={`hosp-reason-${idx}`}>Reason *</Label>
                        <Input 
                          id={`hosp-reason-${idx}`} 
                          value={hosp.reason} 
                          onChange={e => handleHospitalizationChange(idx, 'reason', e.target.value)} 
                          placeholder="e.g., Pneumonia, Car Accident, Surgery Recovery" 
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`hosp-date-${idx}`}>Date</Label>
                        <Input 
                          id={`hosp-date-${idx}`} 
                          type="date" 
                          value={hosp.date} 
                          onChange={e => handleHospitalizationChange(idx, 'date', e.target.value)} 
                          placeholder="YYYY-MM-DD" 
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`hosp-hospital-${idx}`}>Hospital Name</Label>
                        <Input 
                          id={`hosp-hospital-${idx}`} 
                          value={hosp.hospital} 
                          onChange={e => handleHospitalizationChange(idx, 'hospital', e.target.value)} 
                          placeholder="e.g., UCSF Medical Center" 
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`hosp-notes-${idx}`}>Notes/Details</Label>
                        <Textarea 
                          id={`hosp-notes-${idx}`} 
                          value={hosp.notes} 
                          onChange={e => handleHospitalizationChange(idx, 'notes', e.target.value)} 
                          placeholder="Any additional details about this hospitalization" 
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={addHospitalization} className="flex items-center space-x-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Hospitalization
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 7. Organ Donation & Advance Directives */}
          <AccordionItem value="organ-donation">
            <AccordionTrigger style={{ color: '#153A4B' }}>Organ Donation & Advance Directives</AccordionTrigger>
            <AccordionContent>
              <Label>Are you an organ donor?</Label>
              <RadioGroup value={organDonor} onValueChange={setOrganDonor} className="flex flex-row gap-4 mb-2">
                <RadioGroupItem value="Yes" id="organ-donor-yes" /> <Label htmlFor="organ-donor-yes">Yes</Label>
                <RadioGroupItem value="No" id="organ-donor-no" /> <Label htmlFor="organ-donor-no">No</Label>
              </RadioGroup>
              <Input value={organDonorState} onChange={e => setOrganDonorState(e.target.value)} placeholder="State/Registry" />
              <Input value={organDonorLocation} onChange={e => setOrganDonorLocation(e.target.value)} placeholder="Location of Organ Donor Card" />
              <Label className="mt-4">Living Will Completed?</Label>
              <RadioGroup value={livingWill} onValueChange={setLivingWill} className="flex flex-row gap-4 mb-2">
                <RadioGroupItem value="Yes" id="living-will-yes" /> <Label htmlFor="living-will-yes">Yes</Label>
                <RadioGroupItem value="No" id="living-will-no" /> <Label htmlFor="living-will-no">No</Label>
              </RadioGroup>
              {livingWill === 'Yes' && (
                <>
                  <Input type="date" value={livingWillDate} onChange={e => setLivingWillDate(e.target.value)} placeholder="Living Will Date" />
                  <Input value={livingWillLocation} onChange={e => setLivingWillLocation(e.target.value)} placeholder="Location" />
                </>
              )}
              <Label className="mt-4">DNR Order in Place?</Label>
              <RadioGroup value={dnr} onValueChange={setDnr} className="flex flex-row gap-4 mb-2">
                <RadioGroupItem value="Yes" id="dnr-yes" /> <Label htmlFor="dnr-yes">Yes</Label>
                <RadioGroupItem value="No" id="dnr-no" /> <Label htmlFor="dnr-no">No</Label>
              </RadioGroup>
              {dnr === 'Yes' && (
                <>
                  <Input type="date" value={dnrDate} onChange={e => setDnrDate(e.target.value)} placeholder="DNR Date" />
                  <Input value={dnrLocation} onChange={e => setDnrLocation(e.target.value)} placeholder="Location" />
                </>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* 8. Healthcare Proxy or Power of Attorney */}
          <AccordionItem value="proxy">
            <AccordionTrigger style={{ color: '#153A4B' }}>Healthcare Proxy or Power of Attorney</AccordionTrigger>
            <AccordionContent>
              <Input value={proxyName} onChange={e => setProxyName(e.target.value)} placeholder="Proxy Name" />
              <Input value={proxyRelationship} onChange={e => setProxyRelationship(e.target.value)} placeholder="Relationship" />
              <Input value={proxyPhone} onChange={e => handleProxyPhoneChange(e.target.value)} placeholder="Phone" type="tel" />
              <Input value={proxyEmail} onChange={e => setProxyEmail(e.target.value)} placeholder="Email" type="email" />
              <Input value={proxyLocation} onChange={e => setProxyLocation(e.target.value)} placeholder="Location of POA Document" />
            </AccordionContent>
          </AccordionItem>

          {/* 9. Insurance Details */}
          <AccordionItem value="insurance-details">
            <AccordionTrigger style={{ color: '#153A4B' }}>Insurance Details</AccordionTrigger>
            <AccordionContent>
              <Input value={primaryProvider} onChange={e => setPrimaryProvider(e.target.value)} placeholder="Primary Insurance Provider" />
              <Input value={policyNumber} onChange={e => setPolicyNumber(e.target.value)} placeholder="Plan/Policy Number" />
              <Input value={policyholder} onChange={e => setPolicyholder(e.target.value)} placeholder="Policyholder (if not you)" />
              <Input value={insurancePhone} onChange={e => handleInsurancePhoneChange(e.target.value)} placeholder="Contact Number" type="tel" />
              <Label className="mt-4">Secondary/Supplemental Coverage</Label>
              <Textarea
                value={secondaryCoverage}
                onChange={e => setSecondaryCoverage(e.target.value)}
                placeholder="Describe any secondary or supplemental coverage."
                className="min-h-[60px] resize-none"
              />
            </AccordionContent>
          </AccordionItem>

          {/* 10. Preferred Facilities */}
          <AccordionItem value="facilities">
            <AccordionTrigger style={{ color: '#153A4B' }}>Preferred Facilities</AccordionTrigger>
            <AccordionContent>
              <Input value={nearestER} onChange={e => setNearestER(e.target.value)} placeholder="Nearest ER" />
              <Input value={preferredHospital} onChange={e => setPreferredHospital(e.target.value)} placeholder="Preferred Hospital (Emergency)" />
            </AccordionContent>
          </AccordionItem>

          {/* 11. Additional Notes */}
          <AccordionItem value="notes">
            <AccordionTrigger style={{ color: '#153A4B' }}>Notes or Special Instructions</AccordionTrigger>
            <AccordionContent>
              <Textarea
                value={additionalNotes}
                onChange={e => setAdditionalNotes(e.target.value)}
                placeholder="Free text (e.g., religious restrictions, support people, etc.)"
                className="min-h-[80px] resize-none"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {onPrevious && (
          <Button variant="skillbinder" onClick={onPrevious} className="skillbinder">Previous</Button>
        )}
        <div className="flex gap-4">
          <Button 
            type="button" 
            onClick={() => {
              generatePDF({
                sectionTitle: 'Medical Information',
                data: prepareUserDataForPDF(),
                formType: 'medical',
                userTier,
                isTrial,
                userInfo: userInfo
              });
            }}
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
          <Button onClick={handleSave} variant="skillbinder_yellow" className="skillbinder_yellow">Save & Continue</Button>
        </div>
      </CardFooter>
    </Card>
    </>
  );
};

export default MedicalInfoForm;