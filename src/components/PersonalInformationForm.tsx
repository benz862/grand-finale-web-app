import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import NameChangeRequestDialog from './NameChangeRequestDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { AlertTriangle, Lock, Unlock, FileEdit, Trash } from 'lucide-react';
import { generatePDF } from '../lib/pdfGenerator';
import AudioPlayer from './AudioPlayer';
import { useTrial } from '../contexts/TrialContext';
import { allCountries, getRegionsForCountry, getRegionLabel } from '../data/countryRegionData';
import { getIdentificationLabel, getIdentificationPlaceholder } from '../lib/countryIdentification';
import { formatPhoneNumber } from '../lib/phoneNumberFormatter';
import { Upload, X, Eye, Download } from 'lucide-react';
import { uploadIDDocument, getUserIDDocuments, deleteIDDocument, UploadedIDDocument } from '../lib/idDocumentService';

// Format national ID numbers based on country
const formatNationalId = (value: string, country: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  switch (country) {
    case 'United States':
      // SSN format: XXX-XX-XXXX
      if (digits.length <= 3) return digits;
      if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
      return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
    
    case 'Canada':
      // SIN format: XXX-XXX-XXX
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 9)}`;
    
    case 'United Kingdom':
      // NIN format: AB123456C
      return digits.toUpperCase();
    
    case 'Australia':
      // TFN format: XXX-XXX-XXX
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 9)}`;
    
    default:
      // For other countries, just return the digits as-is
      return digits;
  }
};


const prioritizedCountries = ['United States', 'Canada', 'United Kingdom'];
const otherCountries = allCountries.filter(c => !prioritizedCountries.includes(c)).sort();
const countryOptions = [...prioritizedCountries, ...otherCountries];

const languageOptions = ['English', 'Spanish', 'French', 'Mandarin', 'Other'];
const pronounOptions = ['He/Him', 'She/Her', 'They/Them', 'Other'];
const genderOptions = ['Male', 'Female', 'Non-Binary', 'Prefer not to say'];
const addressTypeOptions = ['Current', 'Previous', 'Seasonal', 'Mailing'];
const relationshipOptions = ['Parent', 'Sibling', 'Spouse', 'Friend', 'Other'];
const childGenderOptions = ['M', 'F', 'Other'];
const employmentStatusOptions = ['Employed', 'Unemployed', 'Self-Employed', 'Retired', 'Entrepreneur'];

const emptyAddress = () => ({ 
  type: '', 
  street: '', 
  city: '', 
  country: '', 
  province: '', 
  postal: '', 
  start: '', 
  end: '',
  availableRegions: [],
  regionLabel: 'Province/State',
  postalLabel: 'Postal Code'
});
const emptyContact = () => ({ name: '', relationship: '', phone: '', email: '', authorized: 'No', emergency: 'Yes' });
const emptySchool = () => ({ name: '', degree: '', location: '', start: '', end: '' });
const emptyPhone = () => ({ type: '', number: '' });
const emptyChild = () => ({ name: '', gender: '', age: '' });
const emptyPassport = () => ({ country: '', number: '', expiry: '' });
const emptyNationalId = () => ({ country: '', type: '', number: '' });
const emptyDriverLicense = () => ({ country: '', type: '', number: '', expiry: '', province: '' });

const docOptions = [
  'Passport/ID Location',
  'Birth Certificate',
  'Marriage/Divorce Certificates',
  'SSN Card',
  'Driver\'s License/ID',
  'Insurance Policies',
  'Real Estate Titles/Deeds',
  'Safe Deposit Box Info',
  'Locker/PO Box Keys',
  'Home/Car/Office Keys',
  'Other'
];

const PersonalInformationForm: React.FC<{ onNext: () => void; onPrevious?: () => void }> = ({ onNext, onPrevious }) => {
  console.log('PersonalInformationForm component is rendering');
  const [pdfError, setPdfError] = React.useState(false);
  const { userTier, isTrial } = useTrial();
  const { toast } = useToast();
  const { syncForm } = useDatabaseSync();
  const { user, isAuthenticated } = useAuth();
  const { localizeText } = useLocalization();
  
  // Track if user has existing immutable data (prevents changes to core identity fields)
  const [hasImmutableData, setHasImmutableData] = React.useState(false);
  
  // Track if data has been loaded to prevent unnecessary reloading
  const [dataLoaded, setDataLoaded] = React.useState(false);
  
  // Name change request system
  const [showNameChangeRequest, setShowNameChangeRequest] = React.useState(false);
  const [nameChangeReason, setNameChangeReason] = React.useState('');
  const [nameChangeDetails, setNameChangeDetails] = React.useState('');
  const [requestedFirstName, setRequestedFirstName] = React.useState('');
  const [requestedMiddleName, setRequestedMiddleName] = React.useState('');
  const [requestedLastName, setRequestedLastName] = React.useState('');
  const [pendingNameChangeRequest, setPendingNameChangeRequest] = React.useState(false);

  // Legal & Biographical
  const [gender, setGender] = React.useState('');
  const [pronouns, setPronouns] = React.useState('');
  const [customPronoun, setCustomPronoun] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [middleName, setMiddleName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [nickname, setNickname] = React.useState('');
  const [dob, setDob] = React.useState('');
  const [countryOfBirth, setCountryOfBirth] = React.useState('');
  const [provinceOfBirth, setProvinceOfBirth] = React.useState('');
  const [cityOfBirth, setCityOfBirth] = React.useState('');

  // Dynamic province/state options based on selected country
  const [availableRegions, setAvailableRegions] = React.useState<string[]>([]);
  const [regionLabel, setRegionLabel] = React.useState('Province/State');
  
  const [citizenships, setCitizenships] = React.useState('');
  const [primaryLanguage, setPrimaryLanguage] = React.useState('');
  const [secondaryLanguage, setSecondaryLanguage] = React.useState('');

  // Government ID
  const [nationalIds, setNationalIds] = React.useState([emptyNationalId()]);
  const [passports, setPassports] = React.useState([emptyPassport()]);
  const [driverLicenses, setDriverLicenses] = React.useState([emptyDriverLicense()]);
  
  // File upload state for ID documents
  const [idDocuments, setIdDocuments] = React.useState<{
    [key: string]: {
      files: File[];
      previews: string[];
      uploadedDocs?: UploadedIDDocument[];
    }
  }>({});

  // Phone Numbers with formatting
  const [phones, setPhones] = React.useState([{ type: 'Home', number: '' }, { type: 'Mobile', number: '' }]);

  // Address History
  const [addresses, setAddresses] = React.useState([emptyAddress()]);

  // Emergency Contacts
  const [contacts, setContacts] = React.useState([emptyContact()]);

  // Family Information
  const [fatherName, setFatherName] = React.useState('');
  const [motherName, setMotherName] = React.useState('');
  const [stepfatherName, setStepfatherName] = React.useState('');
  const [stepmotherName, setStepmotherName] = React.useState('');

  // Relationship Status
  const [relationshipStatus, setRelationshipStatus] = React.useState('');
  const [spouseName, setSpouseName] = React.useState('');
  const [spousePhone, setSpousePhone] = React.useState('');
  const [spouseEmail, setSpouseEmail] = React.useState('');

  // Children
  const [children, setChildren] = React.useState([emptyChild()]);

  // Religious and Spiritual Information
  const [religiousAffiliation, setReligiousAffiliation] = React.useState('');
  const [placeOfWorship, setPlaceOfWorship] = React.useState('');
  const [clergyName, setClergyName] = React.useState('');
  const [clergyPhone, setClergyPhone] = React.useState('');
  const [clergyEmail, setClergyEmail] = React.useState('');
  const [lastRites, setLastRites] = React.useState(false);
  const [clergyPresent, setClergyPresent] = React.useState(false);
  const [scripturePreferences, setScripturePreferences] = React.useState('');
  const [prayerStyle, setPrayerStyle] = React.useState('');
  const [burialRituals, setBurialRituals] = React.useState('');

  // Employment Information
  const [employmentStatus, setEmploymentStatus] = React.useState('');
  const [occupation, setOccupation] = React.useState('');
  const [employer, setEmployer] = React.useState('');
  const [employerAddress, setEmployerAddress] = React.useState('');
  const [workPhone, setWorkPhone] = React.useState('');
  const [supervisorName, setSupervisorName] = React.useState('');
  const [workNotes, setWorkNotes] = React.useState('');

  // Digital Legacy
  const [willLocation, setWillLocation] = React.useState('');
  const [unlockCode, setUnlockCode] = React.useState('');
  const [passwordManager, setPasswordManager] = React.useState('');
  const [backupCodeStorage, setBackupCodeStorage] = React.useState('');
  const [keyAccounts, setKeyAccounts] = React.useState('');
  const [digitalDocsLocation, setDigitalDocsLocation] = React.useState('');

  // Critical Documents
  const [criticalDocs, setCriticalDocs] = React.useState<string[]>([]);
  const [criticalDocLocations, setCriticalDocLocations] = React.useState<{ [doc: string]: string }>({});

  // Education
  const [schools, setSchools] = React.useState([emptySchool()]);

  // Additional Notes
  const [additionalNotes, setAdditionalNotes] = React.useState('');
  
  // Load saved data from database and localStorage
  const loadSavedData = async () => {
    // Prevent reloading if data is already loaded
    if (dataLoaded) {
      console.log('Data already loaded, skipping reload');
      return;
    }
    
    if (!isAuthenticated || !user?.email) {
      // If not authenticated, try to load from localStorage
      loadFromLocalStorage();
      setDataLoaded(true);
      return;
    }
    
    try {
      console.log('Loading saved data for user:', user.email);
      
      // Use the authenticated user's ID directly
      const userId = user.id;
      console.log('Using authenticated user ID:', userId);
      
      // Load personal info from database
      const { data: personalInfo, error: personalError } = await supabase
        .from('personal_info')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (personalInfo && !personalError) {
        console.log('Loaded personal info:', personalInfo);
        
        // Basic identity fields
        setFirstName(personalInfo.legal_first_name || '');
        setLastName(personalInfo.legal_last_name || '');
        setMiddleName(personalInfo.legal_middle_name || '');
        setNickname(personalInfo.preferred_name || personalInfo.nickname || '');
        setDob(personalInfo.date_of_birth || '');
        
        // Gender and pronouns
        console.log('Loading gender and pronouns from database:', {
          gender: personalInfo.gender,
          pronouns: personalInfo.pronouns,
          custom_pronoun: personalInfo.custom_pronoun
        });
        setGender(personalInfo.gender || '');
        setPronouns(personalInfo.pronouns || '');
        setCustomPronoun(personalInfo.custom_pronoun || '');
        
        // Birth information
        setCityOfBirth(personalInfo.city_of_birth || personalInfo.place_of_birth || '');
        setCountryOfBirth(personalInfo.country_of_birth || '');
        setProvinceOfBirth(personalInfo.province_of_birth || '');

        
        // Citizenship and language
        setCitizenships(personalInfo.citizenships || personalInfo.citizenship_countries || personalInfo.country_of_citizenship || '');
        setPrimaryLanguage(personalInfo.primary_language || personalInfo.language_spoken || '');
        setSecondaryLanguage(personalInfo.secondary_language || '');
        
        // Government documents
        // Handle national IDs - convert old single SSN to new array format
      if (personalInfo.national_ids && Array.isArray(personalInfo.national_ids)) {
        setNationalIds(personalInfo.national_ids);
      } else if (personalInfo.ssn_sin || personalInfo.ssn) {
        // Convert old single SSN format to new array format
        setNationalIds([{
          country: 'United States',
          type: 'Social Security Number (SSN)',
          number: personalInfo.ssn_sin || personalInfo.ssn || ''
        }]);
      } else {
        setNationalIds([emptyNationalId()]);
      }
        // Handle driver's licenses - convert old single license to new array format
        if (personalInfo.driver_licenses && Array.isArray(personalInfo.driver_licenses)) {
          setDriverLicenses(personalInfo.driver_licenses);
        } else if (personalInfo.drivers_license_number || personalInfo.drivers_license || personalInfo.license) {
          // Convert old single license format to new array format
          setDriverLicenses([{
            country: 'United States',
            type: 'Driver\'s License',
            number: personalInfo.drivers_license_number || personalInfo.drivers_license || personalInfo.license || '',
            expiry: personalInfo.drivers_license_expiry || personalInfo.license_expiry || '',
            province: personalInfo.drivers_license_province || personalInfo.license_province || ''
          }]);
        } else {
          setDriverLicenses([emptyDriverLicense()]);
        }
        
        // Family information
        console.log('Loading family info from database:', {
          father_name: personalInfo.father_name,
          mother_name: personalInfo.mother_name,
          relationship_status: personalInfo.relationship_status,
          spouse_name: personalInfo.spouse_name
        });
        setFatherName(personalInfo.father_name || '');
        setMotherName(personalInfo.mother_name || '');
        setStepfatherName(personalInfo.stepfather_name || '');
        setStepmotherName(personalInfo.stepmother_name || '');
        setRelationshipStatus(personalInfo.relationship_status || '');
                              setSpouseName(personalInfo.spouse_name || '');
                      setSpousePhone(personalInfo.spouse_phone || '');
                      setSpouseEmail(personalInfo.spouse_email || '');
        
        // Religious and spiritual information
        setReligiousAffiliation(personalInfo.religious_affiliation || '');
        setPlaceOfWorship(personalInfo.place_of_worship || '');
        setClergyName(personalInfo.clergy_name || '');
        setClergyPhone(personalInfo.clergy_phone || '');
        setClergyEmail(personalInfo.clergy_email || '');
        setLastRites(personalInfo.last_rites_desired || false);
        setClergyPresent(personalInfo.clergy_present_desired || false);
        setScripturePreferences(personalInfo.scripture_preferences || '');
        setPrayerStyle(personalInfo.prayer_style || '');
        setBurialRituals(personalInfo.burial_rituals || '');
        
        // Employment information
        setEmploymentStatus(personalInfo.employment_status || '');
        
        // Additional notes
        setAdditionalNotes(personalInfo.additional_notes || '');
        
        // Check if core identity fields exist - if so, lock immutable fields
        if (personalInfo.legal_first_name && personalInfo.legal_last_name && personalInfo.date_of_birth) {
          setHasImmutableData(true);
          console.log('Core identity data found - immutable fields will be locked');
        }
      }

      // Load addresses from database
      const { data: addressesData, error: addressesError } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId);

      if (addressesData && !addressesError && addressesData.length > 0) {
        console.log('Loaded addresses:', addressesData);
        const formattedAddresses = addressesData.map(addr => {
          const country = addr.country || '';
          const countryData = getRegionsForCountry(country);
          
          return {
            type: addr.address_type || '',
            street: addr.street || '',
            city: addr.city || '',
            country: country,
            province: addr.state || '',
            postal: addr.zip || '',
            start: '',
            end: '',
            availableRegions: countryData ? countryData.regions : [],
            regionLabel: countryData ? countryData.label : 'Province/State',
            postalLabel: getPostalCodeLabel(country)
          };
        });
        setAddresses(formattedAddresses);
      }

      // Load phones from database
      const { data: phonesData, error: phonesError } = await supabase
        .from('phones')
        .select('*')
        .eq('user_id', userId);

      if (phonesData && !phonesError && phonesData.length > 0) {
        console.log('Loaded phones:', phonesData);
        const formattedPhones = phonesData.map(phone => ({
          type: phone.phone_type || '',
          number: phone.phone_number || ''
        }));
        setPhones(formattedPhones);
      }

      // Load emergency contacts from database
      const { data: contactsData, error: contactsError } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', userId);

      if (contactsData && !contactsError && contactsData.length > 0) {
        console.log('Loaded emergency contacts:', contactsData);
        const formattedContacts = contactsData.map(contact => ({
          name: contact.full_name || '',
          relationship: contact.relationship || '',
          phone: contact.phone || '',
          email: contact.email || '',
          authorized: 'No',
          emergency: contact.is_primary ? 'Yes' : 'No'
        }));
        setContacts(formattedContacts);
      }

      // Load additional fields that aren't in the personal_info table from localStorage
      loadAdditionalFieldsFromLocalStorage();

      console.log('Data loading completed');
      setDataLoaded(true); // Mark data as loaded
    } catch (error) {
      console.error('Error loading saved data:', error);
      // Fallback to localStorage if database fails
      loadFromLocalStorage();
      setDataLoaded(true); // Mark data as loaded even on fallback
    }
  };

  // Load additional fields that aren't stored in the personal_info table from localStorage
  const loadAdditionalFieldsFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem('personalInformationData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log('Loading additional fields from localStorage:', parsedData);
        
        // Only load fields that aren't already loaded from the database
        // Government ID fields (these might not be in personal_info table yet)
        // Handle national IDs - already handled above
        
        // Handle both old single passport format and new multiple passports format
        if (parsedData.passports && Array.isArray(parsedData.passports)) {
          setPassports(parsedData.passports);
        } else if (parsedData.passport || parsedData.passportExpiry) {
          // Convert old single passport format to new array format
          setPassports([{
            country: '',
            number: parsedData.passport || '',
            expiry: parsedData.passportExpiry || ''
          }]);
        } else {
          setPassports([emptyPassport()]);
        }
        
        // Handle driver's licenses - convert old single license to new array format
        if (parsedData.driverLicenses && Array.isArray(parsedData.driverLicenses)) {
          setDriverLicenses(parsedData.driverLicenses);
        } else if (parsedData.license || parsedData.licenseExpiry || parsedData.licenseProvince) {
          // Convert old single license format to new array format
          setDriverLicenses([{
            country: '',
            type: 'Driver\'s License',
            number: parsedData.license || '',
            expiry: parsedData.licenseExpiry || '',
            province: parsedData.licenseProvince || ''
          }]);
        } else {
          setDriverLicenses([emptyDriverLicense()]);
        }
        
        // Children (this table might not exist yet)
        if (parsedData.children && Array.isArray(parsedData.children)) {
          setChildren(parsedData.children);
        }
        
        // Work & Career (these might not be in personal_info table yet)
        if (!parsedData.employmentStatus) setEmploymentStatus(parsedData.employmentStatus || '');
        setOccupation(parsedData.occupation || '');
        setEmployer(parsedData.employer || '');
        setEmployerAddress(parsedData.employerAddress || '');
        setWorkPhone(parsedData.workPhone || '');
        setSupervisorName(parsedData.supervisorName || '');
        setWorkNotes(parsedData.workNotes || '');
        
        // Security & Digital
        setWillLocation(parsedData.willLocation || '');
        setUnlockCode(parsedData.unlockCode || '');
        setPasswordManager(parsedData.passwordManager || '');
        setBackupCodeStorage(parsedData.backupCodeStorage || '');
        setKeyAccounts(parsedData.keyAccounts || '');
        setDigitalDocsLocation(parsedData.digitalDocsLocation || '');
        
        // Critical Documents
        if (parsedData.criticalDocs && Array.isArray(parsedData.criticalDocs)) {
          setCriticalDocs(parsedData.criticalDocs);
        }
        if (parsedData.criticalDocLocations) {
          setCriticalDocLocations(parsedData.criticalDocLocations);
        }
        
        // Education
        if (parsedData.schools && Array.isArray(parsedData.schools)) {
          setSchools(parsedData.schools);
        }
        
        // Additional Notes
        setAdditionalNotes(parsedData.additionalNotes || '');
        
        // ID Documents
        if (parsedData.idDocuments) {
          setIdDocuments(parsedData.idDocuments);
        }
      }
    } catch (error) {
      console.error('Error loading additional fields from localStorage:', error);
    }
  };

  // Fallback function to load everything from localStorage
  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem('personalInformationData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log('Loading all data from localStorage:', parsedData);
        
        // Basic personal info
        setFirstName(parsedData.firstName || '');
        setMiddleName(parsedData.middleName || '');
        setLastName(parsedData.lastName || '');
        setNickname(parsedData.nickname || '');
        setDob(parsedData.dob || '');
        setGender(parsedData.gender || '');
        setPronouns(parsedData.pronouns || '');
        setCustomPronoun(parsedData.customPronoun || '');
        setCountryOfBirth(parsedData.countryOfBirth || '');
        setProvinceOfBirth(parsedData.provinceOfBirth || '');
        setCityOfBirth(parsedData.cityOfBirth || '');

        setCitizenships(parsedData.citizenships || '');
        setPrimaryLanguage(parsedData.primaryLanguage || '');
        setSecondaryLanguage(parsedData.secondaryLanguage || '');
        
        // Government ID
        // Handle national IDs - already handled above
        // Handle both old single passport format and new multiple passports format
        if (parsedData.passports && Array.isArray(parsedData.passports)) {
          setPassports(parsedData.passports);
        } else if (parsedData.passport || parsedData.passportExpiry) {
          // Convert old single passport format to new array format
          setPassports([{
            country: '',
            number: parsedData.passport || '',
            expiry: parsedData.passportExpiry || ''
          }]);
        } else {
          setPassports([emptyPassport()]);
        }
        // Handle driver's licenses - convert old single license to new array format
        if (parsedData.driverLicenses && Array.isArray(parsedData.driverLicenses)) {
          setDriverLicenses(parsedData.driverLicenses);
        } else if (parsedData.license || parsedData.licenseExpiry || parsedData.licenseProvince) {
          // Convert old single license format to new array format
          setDriverLicenses([{
            country: '',
            type: 'Driver\'s License',
            number: parsedData.license || '',
            expiry: parsedData.licenseExpiry || '',
            province: parsedData.licenseProvince || ''
          }]);
        } else {
          setDriverLicenses([emptyDriverLicense()]);
        }
        
        // Contact Info
        if (parsedData.phones && Array.isArray(parsedData.phones)) {
          setPhones(parsedData.phones);
        }
        if (parsedData.addresses && Array.isArray(parsedData.addresses)) {
          setAddresses(parsedData.addresses);
        }
        if (parsedData.contacts && Array.isArray(parsedData.contacts)) {
          setContacts(parsedData.contacts);
        }
        
        // Load all other fields using the same logic as above
        loadAdditionalFieldsFromLocalStorage();
        
        // Check if core identity fields exist in localStorage - if so, lock immutable fields
        if (parsedData.firstName && parsedData.lastName && parsedData.dob) {
          setHasImmutableData(true);
          console.log('Core identity data found in localStorage - immutable fields will be locked');
        }
      }
      setDataLoaded(true); // Mark data as loaded
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      setDataLoaded(true); // Mark data as loaded even on error
    }
  };
  
  // Load saved data only once when component mounts or when user authentication changes
  useEffect(() => {
    console.log('PersonalInformationForm - Auth state changed:', { user, isAuthenticated });
    console.log('TEST: Console logging is working');
    
    // Only load saved data if we haven't loaded it yet or if user changes
    loadSavedData();
    loadIDDocuments();
  }, [user?.email]); // Only depend on user email, not the entire user object

  // Load ID documents from database
  const loadIDDocuments = async () => {
    if (!user?.id) return;
    
    try {
      const documents = await getUserIDDocuments(user.id);
      
      // Group documents by type
      const groupedDocs: { [key: string]: { files: File[], previews: string[], uploadedDocs: UploadedIDDocument[] } } = {};
      
      for (const doc of documents) {
        if (!groupedDocs[doc.document_type]) {
          groupedDocs[doc.document_type] = { files: [], previews: [], uploadedDocs: [] };
        }
        
        // Create a mock File object for display purposes
        const mockFile = new File([], doc.file_name, { type: doc.file_type });
        
        groupedDocs[doc.document_type].files.push(mockFile);
        groupedDocs[doc.document_type].previews.push(doc.file_url || '');
        groupedDocs[doc.document_type].uploadedDocs.push(doc);
      }
      
      setIdDocuments(groupedDocs);
    } catch (error) {
      console.error('Error loading ID documents:', error);
    }
  };


  const handlePhoneChange = (idx: number, field: string, value: string) => {
    if (field === 'number') {
      // Use phone number formatting
      const formatted = formatPhoneNumber(value);
      setPhones(prev => prev.map((p, i) => i === idx ? { ...p, [field]: formatted.formatted } : p));
    } else {
      setPhones(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
    }
  };
  const addPhone = () => setPhones(prev => ([...prev, emptyPhone()]));
  const removePhone = (idx: number) => {
    if (phones.length > 1) {
      setPhones(prev => prev.filter((_, i) => i !== idx));
    }
  };

  // Passport Management
  const handlePassportChange = (idx: number, field: string, value: string) => {
    setPassports(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };
  const addPassport = () => setPassports(prev => ([...prev, emptyPassport()]));
  const removePassport = (idx: number) => {
    if (passports.length > 1) {
      setPassports(prev => prev.filter((_, i) => i !== idx));
    }
  };

  // National ID Management
  const handleNationalIdChange = (idx: number, field: string, value: string) => {
    setNationalIds(prev => prev.map((n, i) => {
      if (i === idx) {
        const updatedNationalId = { ...n, [field]: value };
        // Auto-populate ID type when country changes
        if (field === 'country' && value) {
          updatedNationalId.type = getIdentificationLabel(value);
          // Reformat existing number if there is one
          if (n.number) {
            updatedNationalId.number = formatNationalId(n.number, value);
          }
        }
        // Format number when number field changes
        if (field === 'number' && value && n.country) {
          updatedNationalId.number = formatNationalId(value, n.country);
        }
        return updatedNationalId;
      }
      return n;
    }));
  };
  const addNationalId = () => setNationalIds(prev => ([...prev, emptyNationalId()]));
  const removeNationalId = (idx: number) => {
    if (nationalIds.length > 1) {
      setNationalIds(prev => prev.filter((_, i) => i !== idx));
    }
  };

  // Driver's License Management
  const handleDriverLicenseChange = (idx: number, field: string, value: string) => {
    setDriverLicenses(prev => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  };
  const addDriverLicense = () => setDriverLicenses(prev => ([...prev, emptyDriverLicense()]));
  const removeDriverLicense = (idx: number) => {
    if (driverLicenses.length > 1) {
      setDriverLicenses(prev => prev.filter((_, i) => i !== idx));
    }
  };

  // File upload handlers for ID documents
  const handleFileUpload = async (documentType: string, files: FileList | null) => {
    if (!files || !user?.id) return;
    
    try {
      const fileArray = Array.from(files);
      
      // Upload each file to Supabase
      for (const file of fileArray) {
        const uploadedDoc = await uploadIDDocument(file, documentType as any, user.id);
        
        // Update local state with uploaded document
        setIdDocuments(prev => ({
          ...prev,
          [documentType]: {
            files: [...(prev[documentType]?.files || []), file],
            previews: [...(prev[documentType]?.previews || []), URL.createObjectURL(file)],
            uploadedDocs: [...(prev[documentType]?.uploadedDocs || []), uploadedDoc]
          }
        }));
      }
    } catch (error) {
      console.error('Error uploading ID document:', error);
      // You might want to show a toast notification here
    }
  };

  const removeFile = async (documentType: string, index: number) => {
    if (!user?.id) return;
    
    setIdDocuments(prev => {
      const current = prev[documentType];
      if (!current) return prev;
      
      // Get the uploaded document to delete from database
      const uploadedDoc = current.uploadedDocs?.[index];
      
      // Revoke the object URL to free memory
      URL.revokeObjectURL(current.previews[index]);
      
      const newFiles = current.files.filter((_, i) => i !== index);
      const newPreviews = current.previews.filter((_, i) => i !== index);
      const newUploadedDocs = current.uploadedDocs?.filter((_, i) => i !== index) || [];
      
      // Delete from database if it was uploaded
      if (uploadedDoc?.id) {
        deleteIDDocument(uploadedDoc.id, user.id).catch(error => {
          console.error('Error deleting document from database:', error);
        });
      }
      
      return {
        ...prev,
        [documentType]: {
          files: newFiles,
          previews: newPreviews,
          uploadedDocs: newUploadedDocs
        }
      };
    });
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'nationalId': return 'National ID';
      case 'passport': return 'Passport';
      case 'driverLicense': return 'Driver\'s License';
      case 'greenCard': return 'Green Card';
      case 'immigrationDoc': return 'Immigration Document';
      default: return type;
    }
  };

  // Dynamic country/region handling
  const handleCountryOfBirthChange = (selectedCountry: string) => {
    setCountryOfBirth(selectedCountry);
    
    // Get regions for the selected country
    const countryData = getRegionsForCountry(selectedCountry);
    
    if (countryData) {
      setAvailableRegions(countryData.regions);
      setRegionLabel(countryData.label);
      // Clear the province selection when country changes
      setProvinceOfBirth('');
    } else {
      // For countries without predefined regions, allow free text
      setAvailableRegions([]);
      setRegionLabel('Province/State/Region');
      // Keep the current province value for manual entry
    }
  };

  // Helper function to get postal code label based on country
  const getPostalCodeLabel = (country: string) => {
    if (country === 'United States') {
      return 'ZIP Code';
    }
    return 'Postal Code';
  };

  const handleAddressChange = (idx: number, field: string, value: string) => {
    setAddresses(prev => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a));
  };
  
  const handleAddressCountryChange = (idx: number, selectedCountry: string) => {
    const countryData = getRegionsForCountry(selectedCountry);
    
    setAddresses(prev => prev.map((addr, i) => {
      if (i === idx) {
        return {
          ...addr,
          country: selectedCountry,
          province: '', // Clear province when country changes
          availableRegions: countryData ? countryData.regions : [],
          regionLabel: countryData ? countryData.label : 'Province/State',
          postalLabel: getPostalCodeLabel(selectedCountry) // Add dynamic postal label
        };
      }
      return addr;
    }));
  };
  
  const addAddress = () => setAddresses(prev => ([...prev, emptyAddress()]));

  const handleContactChange = (idx: number, field: string, value: string) => {
    if (field === 'phone') {
      // Use phone number formatting for contact phones
      const formatted = formatPhoneNumber(value);
      setContacts(prev => {
        const updated = prev.map((c, i) => i === idx ? { ...c, [field]: formatted.formatted } : c);
        // Save to database instead of localStorage
        if (user?.email) {
          syncForm(user.email, 'emergencyContacts', updated).catch(error => {
            console.error('Error syncing emergency contacts to database:', error);
          });
        }
        return updated;
      });
    } else {
      setContacts(prev => {
        const updated = prev.map((c, i) => i === idx ? { ...c, [field]: value } : c);
        // Save to database instead of localStorage
        if (user?.email) {
          syncForm(user.email, 'emergencyContacts', updated).catch(error => {
            console.error('Error syncing emergency contacts to database:', error);
          });
        }
        return updated;
      });
    }
  };
  const addContact = () => {
    setContacts(prev => {
      const updated = [...prev, emptyContact()];
      // Save to database instead of localStorage
      if (user?.email) {
        syncForm(user.email, 'emergencyContacts', updated).catch(error => {
          console.error('Error syncing emergency contacts to database:', error);
        });
      }
      return updated;
    });
  };
  const handleSpousePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setSpousePhone(formatted.formatted);
  };

  const handleChildChange = (idx: number, field: string, value: string) => {
    setChildren(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };
  const addChild = () => setChildren(prev => ([...prev, emptyChild()]));

  const handleClergyPhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setClergyPhone(formatted.formatted);
  };

  const handleWorkPhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setWorkPhone(formatted.formatted);
  };
  const handleDocChange = (doc: string, checked: boolean) => {
    setCriticalDocs(prev => checked ? [...prev, doc] : prev.filter(d => d !== doc));
    if (!checked) {
      setCriticalDocLocations(prev => {
        const newLocs = { ...prev };
        delete newLocs[doc];
        return newLocs;
      });
    }
  };
  const handleDocLocationChange = (doc: string, value: string) => {
    setCriticalDocLocations(prev => ({ ...prev, [doc]: value }));
  };

  const handleSchoolChange = (idx: number, field: string, value: string) => {
    setSchools(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };
  const addSchool = () => setSchools(prev => ([...prev, emptySchool()]));

  // Save handler with database sync
  const handleSave = async () => {
    try {
      console.log('=== HANDLE SAVE START ===');
      console.log('handleSave function called!');
    
    // Show immediate feedback
    toast({
      title: "Save function called!",
      description: "The handleSave function is executing...",
    });
    
    // Debug logging for validation
    console.log('=== VALIDATION DEBUG ===');
    console.log('firstName:', firstName, 'type:', typeof firstName, 'length:', firstName?.length);
    console.log('lastName:', lastName, 'type:', typeof lastName, 'length:', lastName?.length);
    console.log('dob:', dob, 'type:', typeof dob, 'length:', dob?.length);
    console.log('relationshipStatus:', relationshipStatus, 'type:', typeof relationshipStatus);
    
    // Validate required fields
    if (!firstName || !lastName || !dob) {
      console.log('VALIDATION FAILED - Missing required fields');
      toast({
        title: "Please fill in required fields",
        description: "First name, last name, and date of birth are required.",
        variant: "destructive",
      });
      return;
    }
    
    console.log('VALIDATION PASSED - All required fields present');

    const formData = {
      // Legal & Biographical
      firstName,
      middleName,
      lastName,
      nickname,
      dob,
      gender,
      pronouns,
      customPronoun,
      countryOfBirth,
      provinceOfBirth,
      cityOfBirth,
      citizenships,
      primaryLanguage,
      secondaryLanguage,
      
      // Government ID
      nationalIds,
      passports,
      driverLicenses,
      
      // Contact Info
      phones,
      addresses,
      contacts,
      
      // Family Info
      fatherName,
      motherName,
      stepfatherName,
      stepmotherName,
      relationshipStatus,
      spouseName,
      spousePhone,
      spouseEmail,
      children,
      
      // Religious & Spiritual
      religiousAffiliation,
      placeOfWorship,
      clergyName,
      clergyPhone,
      clergyEmail,
      lastRites,
      clergyPresent,
      scripturePreferences,
      prayerStyle,
      burialRituals,
      
      // Work & Career
      employmentStatus,
      occupation,
      employer,
      employerAddress,
      workPhone,
      supervisorName,
      workNotes,
      
      // Security & Digital
      willLocation,
      unlockCode,
      passwordManager,
      backupCodeStorage,
      keyAccounts,
      digitalDocsLocation,
      
      // Critical Documents
      criticalDocs,
      criticalDocLocations,
      
      // Education
      schools
    };

    // Data will be saved to database only
    console.log('Data will be saved to database');
    
    console.log('Auth check:', { user, isAuthenticated });
    
            // Sync to database if user is logged in
        if (isAuthenticated && user?.email) {
          console.log('=== DATABASE SYNC START ===');
          console.log('User authenticated, attempting database sync...');
          console.log('User email:', user.email);
          console.log('Form data keys:', Object.keys(formData));
          console.log('Form data values:', formData);
      
      try {
        // Show syncing status
        toast({
          title: "Syncing to database...",
          description: "Please wait while we save your data to the cloud.",
        });

        // Log the data being synced for debugging
        console.log('=== PERSONAL INFO DATA BEING SYNCED ===');
        console.log('Total fields in formData:', Object.keys(formData).length);
                    console.log('Key fields:', {
              firstName: formData.firstName,
              middleName: formData.middleName,
              lastName: formData.lastName,
              nickname: formData.nickname,
              gender: formData.gender,
              pronouns: formData.pronouns,
              countryOfBirth: formData.countryOfBirth,
              provinceOfBirth: formData.provinceOfBirth,
              cityOfBirth: formData.cityOfBirth,
              citizenships: formData.citizenships,
              primaryLanguage: formData.primaryLanguage,
              secondaryLanguage: formData.secondaryLanguage,
              nationalIds: formData.nationalIds ? `${formData.nationalIds.length} national ID(s)` : 'No national IDs',
              passports: formData.passports ? `${formData.passports.length} passport(s)` : 'No passports',
              // Address debugging
              addresses: formData.addresses ? `${formData.addresses.length} address(es)` : 'No addresses',
              // Family and Emergency Contact debugging
              contacts: formData.contacts ? `${formData.contacts.length} contact(s)` : 'No contacts',
              children: formData.children ? `${formData.children.length} child(ren)` : 'No children',
              // Family Info debugging
              fatherName: formData.fatherName || 'NOT PROVIDED',
              motherName: formData.motherName || 'NOT PROVIDED',
              stepfatherName: formData.stepfatherName || 'NOT PROVIDED',
              stepmotherName: formData.stepmotherName || 'NOT PROVIDED',
              relationshipStatus: formData.relationshipStatus || 'NOT PROVIDED',
              spouseName: formData.spouseName || 'NOT PROVIDED',
              spousePhone: formData.spousePhone || 'NOT PROVIDED',
              spouseEmail: formData.spouseEmail || 'NOT PROVIDED',
              religiousAffiliation: formData.religiousAffiliation,
              employmentStatus: formData.employmentStatus
            });
        console.log('Full formData structure:', formData);

        // Use email as user ID for database sync
        const result = await syncForm(user.email, 'personalInformationData', formData);
        console.log('Sync result:', result);
        
        if (result.success) {
          toast({
            title: "Success!",
            description: "Your personal information has been saved to the database and locally.",
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
        description: "Your personal information has been saved locally. Please log in to sync to the cloud.",
      });
    }

    console.log('=== HANDLE SAVE END ===');
    
    // Wrap onNext in try-catch to prevent blank page
    try {
      if (onNext) {
        onNext();
      }
    } catch (error) {
      console.error('Error calling onNext:', error);
      toast({
        title: "Navigation Error",
        description: "There was an issue navigating to the next page. Please try again.",
        variant: "destructive",
      });
    }
    } catch (error) {
      console.error('Error in handleSave:', error);
      toast({
        title: "Save Error",
        description: "There was an error saving your data. Please try again.",
        variant: "destructive",
      });
    }
  };

    // Prepare user data for PDF generation (flattened structure)
  const prepareUserDataForPDF = () => {
    // Clean addresses by removing availableRegions and other unnecessary fields
    const cleanAddresses = addresses.map(addr => ({
      type: addr.type,
      street: addr.street,
      city: addr.city,
      country: addr.country,
      province: addr.province,
      postal: addr.postal,
      start: addr.start,
      end: addr.end
    }));

    return {
      firstName,
      lastName,
      middleName,
      nickname,
      dateOfBirth: dob,
      gender,
      pronouns: pronouns === 'Other' ? customPronoun : pronouns,
      countryOfBirth,
      provinceOfBirth,
      cityOfBirth,
      citizenships,
      primaryLanguage,
      secondaryLanguage,
      phones,
      addresses: cleanAddresses,
      contacts,
      fatherName,
      motherName,
      stepfatherName,
      stepmotherName,
      relationshipStatus,
      spouseName,
      spousePhone,
      spouseEmail,
      children,
      nationalIds,
      passports,
      driverLicenses,
      religiousAffiliation,
      placeOfWorship,
      clergyName,
      clergyPhone,
      clergyEmail,
      lastRites,
      clergyPresent,
      scripturePreferences,
      prayerStyle,
      burialRituals,
      employmentStatus,
      occupation,
      employer,
      employerAddress,
      workPhone,
      supervisorName,
      workNotes,
      willLocation,
      unlockCode,
      passwordManager,
      backupCodeStorage,
      keyAccounts,
      digitalDocsLocation,
      criticalDocs,
      criticalDocLocations,
      schools,
      additionalNotes,
    };
  };

  // Handle name change request submission
  const handleNameChangeRequest = async () => {
    if (!requestedFirstName || !requestedLastName || !nameChangeReason) {
      toast({
        title: "Please fill in required fields",
        description: "First name, last name, and reason are required for name change requests.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Store the request in localStorage (in production, this would go to a backend API)
      const nameChangeRequest = {
        userId: user?.email,
        currentName: {
          firstName,
          middleName,
          lastName
        },
        requestedName: {
          firstName: requestedFirstName,
          middleName: requestedMiddleName,
          lastName: requestedLastName
        },
        reason: nameChangeReason,
        details: nameChangeDetails,
        requestDate: new Date().toISOString(),
        status: 'pending',
        requestId: `NCR-${Date.now()}`
      };

      // Save to database (in production, send to backend)
      if (user?.email) {
        try {
          await syncForm(user.email, 'nameChangeRequest', nameChangeRequest);
        } catch (error) {
          console.error('Error saving name change request to database:', error);
        }
      }
      setPendingNameChangeRequest(true);

      toast({
        title: "Name Change Request Submitted",
        description: `Request ID: ${nameChangeRequest.requestId}. You will be notified when your request is reviewed.`,
      });

      // Reset form
      setShowNameChangeRequest(false);
      setNameChangeReason('');
      setNameChangeDetails('');
      setRequestedFirstName('');
      setRequestedMiddleName('');
      setRequestedLastName('');

    } catch (error) {
      console.error('Error submitting name change request:', error);
      toast({
        title: "Request Failed",
        description: "There was an error submitting your name change request. Please try again.",
        variant: "destructive",
      });
    }
  };

  React.useEffect(() => {
    const savedData = localStorage.getItem('personalContactData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFirstName(parsedData.firstName || '');
      setMiddleName(parsedData.middleName || '');
      setLastName(parsedData.lastName || '');
      setNickname(parsedData.nickname || '');
      setDob(parsedData.dob || '');
      setGender(parsedData.gender || '');
      setPronouns(parsedData.pronouns || '');
      setCustomPronoun(parsedData.customPronoun || '');
      setCountryOfBirth(parsedData.countryOfBirth || '');
      setProvinceOfBirth(parsedData.provinceOfBirth || '');
      setCityOfBirth(parsedData.cityOfBirth || '');

      setCitizenships(parsedData.citizenships || '');
      setPrimaryLanguage(parsedData.primaryLanguage || '');
      setSecondaryLanguage(parsedData.secondaryLanguage || '');
      // Handle national IDs - convert old single SSN to new array format
      if (parsedData.nationalIds && Array.isArray(parsedData.nationalIds)) {
        setNationalIds(parsedData.nationalIds);
      } else if (parsedData.ssn) {
        // Convert old single SSN format to new array format
        setNationalIds([{
          country: 'United States',
          type: 'Social Security Number (SSN)',
          number: parsedData.ssn
        }]);
      } else {
        setNationalIds([emptyNationalId()]);
      }
      // Handle both old single passport format and new multiple passports format
      if (parsedData.passports && Array.isArray(parsedData.passports)) {
        setPassports(parsedData.passports);
      } else if (parsedData.passport || parsedData.passportExpiry) {
        // Convert old single passport format to new array format
        setPassports([{
          country: '',
          number: parsedData.passport || '',
          expiry: parsedData.passportExpiry || ''
        }]);
      } else {
        setPassports([emptyPassport()]);
      }
      // Handle driver's licenses - convert old single license to new array format
      if (parsedData.driverLicenses && Array.isArray(parsedData.driverLicenses)) {
        setDriverLicenses(parsedData.driverLicenses);
      } else if (parsedData.license || parsedData.licenseExpiry || parsedData.licenseProvince) {
        // Convert old single license format to new array format
        setDriverLicenses([{
          country: 'United States',
          type: 'Driver\'s License',
          number: parsedData.license || '',
          expiry: parsedData.licenseExpiry || '',
          province: parsedData.licenseProvince || ''
        }]);
      } else {
        setDriverLicenses([emptyDriverLicense()]);
      }
      setPhones(parsedData.phones || [{ type: 'Home', number: '' }, { type: 'Mobile', number: '' }]);
      setAddresses(parsedData.addresses || [emptyAddress()]);
      setContacts(parsedData.contacts || [emptyContact()]);
      setFatherName(parsedData.fatherName || '');
      setMotherName(parsedData.motherName || '');
      setStepfatherName(parsedData.stepfatherName || '');
      setStepmotherName(parsedData.stepmotherName || '');
      setRelationshipStatus(parsedData.relationshipStatus || '');
      setSpouseName(parsedData.spouseName || '');
      setSpousePhone(parsedData.spousePhone || '');
      setSpouseEmail(parsedData.spouseEmail || '');
      setChildren(parsedData.children || [emptyChild()]);
      setReligiousAffiliation(parsedData.religiousAffiliation || '');
      setPlaceOfWorship(parsedData.placeOfWorship || '');
      setClergyName(parsedData.clergyName || '');
      setClergyPhone(parsedData.clergyPhone || '');
      setClergyEmail(parsedData.clergyEmail || '');
      setLastRites(parsedData.lastRites || false);
      setClergyPresent(parsedData.clergyPresent || false);
      setScripturePreferences(parsedData.scripturePreferences || '');
      setPrayerStyle(parsedData.prayerStyle || '');
      setBurialRituals(parsedData.burialRituals || '');
      setEmploymentStatus(parsedData.employmentStatus || '');
      setOccupation(parsedData.occupation || '');
      setEmployer(parsedData.employer || '');
      setEmployerAddress(parsedData.employerAddress || '');
      setWorkPhone(parsedData.workPhone || '');
      setSupervisorName(parsedData.supervisorName || '');
      setWorkNotes(parsedData.workNotes || '');
      setWillLocation(parsedData.willLocation || '');
      setUnlockCode(parsedData.unlockCode || '');
      setPasswordManager(parsedData.passwordManager || '');
      setBackupCodeStorage(parsedData.backupCodeStorage || '');
      setKeyAccounts(parsedData.keyAccounts || '');
      setDigitalDocsLocation(parsedData.digitalDocsLocation || '');
      setCriticalDocs(parsedData.criticalDocs || []);
      setCriticalDocLocations(parsedData.criticalDocLocations || {});
      setSchools(parsedData.schools || [emptySchool()]);
      setAdditionalNotes(parsedData.additionalNotes || '');
    }
  }, []);

  // Auto-save functionality - now saves to database
  const saveToDatabase = async () => {
    if (!user?.email) return;
    
    try {
      // Save personal information
      await syncForm(user.email, 'personalInfo', {
        firstName,
        middleName,
        lastName,
        nickname,
        dob,
        gender,
        pronouns: pronouns === 'Other' ? customPronoun : pronouns,
        customPronoun,
        countryOfBirth,
        provinceOfBirth,
        cityOfBirth,
        citizenships,
        primaryLanguage,
        secondaryLanguage,
        nationalIds,
        passports,
        driverLicenses,
        phones,
        addresses,
        contacts,
        fatherName,
        motherName,
        stepfatherName,
        stepmotherName,
        relationshipStatus,
        spouseName,
        spousePhone,
        spouseEmail,
        children,
        religiousAffiliation,
        placeOfWorship,
        clergyName,
        clergyPhone,
        clergyEmail,
        lastRites,
        clergyPresent,
        scripturePreferences,
        prayerStyle,
        burialRituals,
        employmentStatus,
        occupation,
        employer,
        employerAddress,
        workPhone,
        supervisorName,
        workNotes,
        willLocation,
        unlockCode,
        passwordManager,
        backupCodeStorage,
        keyAccounts,
        digitalDocsLocation,
        criticalDocs,
        criticalDocLocations,
        schools,
        additionalNotes,
        idDocuments
      });
      
      console.log('Data saved to database successfully');
    } catch (error) {
      console.error('Error saving to database:', error);
    }
  };

  // Auto-save every 30 seconds
  React.useEffect(() => {
    const interval = setInterval(saveToDatabase, 30000);
    return () => clearInterval(interval);
  }, [firstName, middleName, lastName, nickname, dob, gender, pronouns, customPronoun, countryOfBirth, provinceOfBirth, cityOfBirth, citizenships, primaryLanguage, secondaryLanguage, nationalIds, passports, driverLicenses, phones, addresses, contacts, fatherName, motherName, stepfatherName, stepmotherName, relationshipStatus, spouseName, spousePhone, spouseEmail, children, religiousAffiliation, placeOfWorship, clergyName, clergyPhone, clergyEmail, lastRites, clergyPresent, scripturePreferences, prayerStyle, burialRituals, employmentStatus, occupation, employer, employerAddress, workPhone, supervisorName, workNotes, willLocation, unlockCode, passwordManager, backupCodeStorage, keyAccounts, digitalDocsLocation, criticalDocs, criticalDocLocations, schools, additionalNotes, idDocuments]);

  // Save on component unmount
  React.useEffect(() => {
    return () => {
      saveToDatabase();
    };
  }, []);

  // PDF generation with error handling
  const renderPDFButton = () => {
    try {
      return (
        <Button
          type="button"
          onClick={() => {
            generatePDF({
              sectionTitle: 'Personal Information',
              data: prepareUserDataForPDF(),
              formType: 'personal',
              userTier,
              isTrial,
              userInfo: {
                firstName: firstName,
                lastName: lastName,
                email: user?.email
              }
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
      );
    } catch (error) {
      console.error('PDF component error:', error);
      setPdfError(true);
      return (
        <Button
          type="button"
          disabled={true}
          className="inline-flex items-center px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-50"
          title="PDF generation error - try refreshing the page"
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
          PDF Error
        </Button>
      );
    }
  };

  return (
    <>
      <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-bold text-skillbinder-yellow text-3xl">Personal Information</CardTitle>
        <p className="text-lg text-skillbinder-blue">
          Complete your personal details, contact information, and biographical data for comprehensive legacy planning
        </p>
        <AudioPlayer audioFile="Section_1.mp3" size="md" sectionNumber={1} />
      </CardHeader>
      <CardContent>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <Accordion type="single" collapsible className="mb-6">
            <AccordionItem value="biographical">
              <AccordionTrigger className="text-skillbinder-blue">Legal & Biographical Information</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {/* Field Locking Information */}
                    {hasImmutableData && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h4 className="text-sm font-semibold text-blue-800 mb-2">🔒 Identity Protection Active</h4>
                        <p className="text-sm text-blue-700">
                          Core identity fields (name, birth details, gender) are now locked to protect your account. 
                          Languages, citizenships, and nicknames can still be updated.
                        </p>
                      </div>
                    )}
                    
                    {!hasImmutableData && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                        <h4 className="text-sm font-semibold text-amber-800 mb-2">⚠️ One-Time Setup</h4>
                        <p className="text-sm text-amber-700">
                          Once you save this form, core identity fields (name, birth details, gender) will be locked 
                          and cannot be changed. Please ensure accuracy before saving.
                        </p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Gender Identity</Label>
                        <Select 
                          value={gender} 
                          onValueChange={setGender}
                          disabled={hasImmutableData}
                        >
                          <SelectTrigger className={hasImmutableData ? "bg-gray-50 cursor-not-allowed" : ""}>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            {genderOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        {hasImmutableData && <p className="text-xs text-gray-500 mt-1">🔒 This field is locked after initial setup</p>}
                      </div>
                      <div>
                        <Label>Preferred Pronouns</Label>
                        <Select 
                          value={pronouns} 
                          onValueChange={setPronouns}
                          disabled={hasImmutableData}
                        >
                          <SelectTrigger className={hasImmutableData ? "bg-gray-50 cursor-not-allowed" : ""}>
                            <SelectValue placeholder="Select pronouns" />
                          </SelectTrigger>
                          <SelectContent>
                            {pronounOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {pronouns === 'Other' && (
                          <Input 
                            className={`mt-2 ${hasImmutableData ? "bg-gray-50 cursor-not-allowed" : ""}`} 
                            value={customPronoun} 
                            onChange={e => setCustomPronoun(e.target.value)} 
                            placeholder="Enter your pronouns"
                            disabled={hasImmutableData}
                          />
                        )}
                        {hasImmutableData && <p className="text-xs text-gray-500 mt-1">🔒 This field is locked after initial setup</p>}
                      </div>
                      <div>
                        <Label>Legal First Name</Label>
                        <div className="flex gap-2 items-end">
                          <Input 
                            value={firstName} 
                            onChange={e => setFirstName(e.target.value)} 
                            disabled={hasImmutableData}
                            className={hasImmutableData ? "bg-gray-50 cursor-not-allowed" : ""}
                            title={hasImmutableData ? "This field cannot be changed after initial setup" : ""}
                          />
                          {hasImmutableData && (
                            <Button
                              type="button"
                              variant="skillbinder_yellow"
                              size="sm"
                              onClick={() => setShowNameChangeRequest(true)}
                              className="skillbinder_yellow text-xs px-2 py-1 h-8 whitespace-nowrap"
                            >
                              <FileEdit className="h-3 w-3 mr-1" />
                              Request Change
                            </Button>
                          )}
                        </div>
                        {hasImmutableData && (
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500">🔒 This field is locked after initial setup</p>
                            {pendingNameChangeRequest && (
                              <p className="text-xs text-amber-600">📋 Name change request pending</p>
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label>Legal Middle Name</Label>
                        <div className="flex gap-2 items-end">
                          <Input 
                            value={middleName} 
                            onChange={e => setMiddleName(e.target.value)} 
                            disabled={hasImmutableData} 
                            className={hasImmutableData ? "bg-gray-50 cursor-not-allowed" : ""} 
                            title={hasImmutableData ? "This field cannot be changed after initial setup" : ""} 
                          />
                          {hasImmutableData && (
                            <Button
                              type="button"
                              variant="skillbinder_yellow"
                              size="sm"
                              onClick={() => setShowNameChangeRequest(true)}
                              className="skillbinder_yellow text-xs px-2 py-1 h-8 whitespace-nowrap"
                            >
                              <FileEdit className="h-3 w-3 mr-1" />
                              Request Change
                            </Button>
                          )}
                        </div>
                        {hasImmutableData && (
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500">🔒 This field is locked after initial setup</p>
                            {pendingNameChangeRequest && (
                              <p className="text-xs text-amber-600">📋 Name change request pending</p>
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label>Legal Last Name</Label>
                        <div className="flex gap-2 items-end">
                          <Input 
                            value={lastName} 
                            onChange={e => setLastName(e.target.value)} 
                            disabled={hasImmutableData}
                            className={hasImmutableData ? "bg-gray-50 cursor-not-allowed" : ""}
                            title={hasImmutableData ? "This field cannot be changed after initial setup" : ""}
                          />
                          {hasImmutableData && (
                            <Button
                              type="button"
                              variant="skillbinder_yellow"
                              size="sm"
                              onClick={() => setShowNameChangeRequest(true)}
                              className="skillbinder_yellow text-xs px-2 py-1 h-8 whitespace-nowrap"
                            >
                              <FileEdit className="h-3 w-3 mr-1" />
                              Request Change
                            </Button>
                          )}
                        </div>
                        {hasImmutableData && (
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500">🔒 This field is locked after initial setup</p>
                            {pendingNameChangeRequest && (
                              <p className="text-xs text-amber-600">📋 Name change request pending</p>
                            )}
                          </div>
                        )}
                      </div>
                      <div><Label>Nickname or Preferred Name</Label><Input value={nickname} onChange={e => setNickname(e.target.value)} placeholder="Can be updated anytime" /></div>
                      <div>
                        <Label>Country of Birth</Label>
                        <Select 
                          value={countryOfBirth} 
                          onValueChange={handleCountryOfBirthChange}
                          disabled={hasImmutableData}
                        >
                          <SelectTrigger className={hasImmutableData ? "bg-gray-50 cursor-not-allowed" : ""}>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countryOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        {hasImmutableData && <p className="text-xs text-gray-500 mt-1">🔒 This field is locked after initial setup</p>}
                      </div>
                      <div>
                        <Label>Date of Birth</Label>
                        <Input 
                          type="text" 
                          value={dob} 
                          onChange={e => setDob(e.target.value)} 
                          disabled={hasImmutableData}
                          className={hasImmutableData ? "bg-gray-50 cursor-not-allowed" : ""}
                          placeholder={countryOfBirth === 'United States' ? 'MM/DD/YYYY' : 'DD/MM/YYYY'}
                          title={countryOfBirth === 'United States' ? 'Format: MM/DD/YYYY' : 'Format: DD/MM/YYYY'}
                        />
                        <span className="text-xs text-gray-500">
                          {countryOfBirth === 'United States' ? 'Format: MM/DD/YYYY' : 'Format: DD/MM/YYYY'}
                        </span>
                        {hasImmutableData && <p className="text-xs text-gray-500 mt-1">🔒 This field is locked after initial setup</p>}
                      </div>
                      <div>
                        <Label>{regionLabel} of Birth</Label>
                        {availableRegions.length > 0 ? (
                          <Select 
                            value={provinceOfBirth} 
                            onValueChange={setProvinceOfBirth}
                            disabled={hasImmutableData}
                          >
                            <SelectTrigger className={hasImmutableData ? "bg-gray-50 cursor-not-allowed" : ""}>
                              <SelectValue placeholder={`Select ${(regionLabel || 'Province/State').toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {availableRegions.map(region => (
                                <SelectItem key={region} value={region}>{region}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input 
                            value={provinceOfBirth} 
                            onChange={e => setProvinceOfBirth(e.target.value)} 
                            disabled={hasImmutableData}
                            className={hasImmutableData ? "bg-gray-50 cursor-not-allowed" : ""}
                            title={hasImmutableData ? "This field cannot be changed after initial setup" : ""}
                            placeholder={`Enter ${regionLabel.toLowerCase()}`}
                          />
                        )}
                        {hasImmutableData && <p className="text-xs text-gray-500 mt-1">🔒 This field is locked after initial setup</p>}
                      </div>
                      <div>
                        <Label>City of Birth</Label>
                        <Input 
                          value={cityOfBirth} 
                          onChange={e => setCityOfBirth(e.target.value)} 
                          disabled={hasImmutableData}
                          className={hasImmutableData ? "bg-gray-50 cursor-not-allowed" : ""}
                          title={hasImmutableData ? "This field cannot be changed after initial setup" : ""}
                        />
                        {hasImmutableData && <p className="text-xs text-gray-500 mt-1">🔒 This field is locked after initial setup</p>}
                      </div>

                      <div><Label>Citizenship(s)</Label><Input value={citizenships} onChange={e => setCitizenships(e.target.value)} placeholder="Can be updated (may acquire new citizenships)" /></div>
                      <div>
                        <Label>Primary Language</Label>
                        <Select value={primaryLanguage} onValueChange={setPrimaryLanguage}>
                          <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                          <SelectContent>
                            {languageOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-green-600 mt-1">✓ Can be updated anytime</p>
                      </div>
                      <div>
                        <Label>Secondary Language (optional)</Label>
                        <Select value={secondaryLanguage} onValueChange={setSecondaryLanguage}>
                          <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                          <SelectContent>
                            {languageOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-green-600 mt-1">✓ Can be updated anytime</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 2. Government Identification */}
            <AccordionItem value="identification">
              <AccordionTrigger style={{ color: '#153A4B' }}>Identification Documents</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {/* Multiple National ID Numbers */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">National ID Numbers</Label>
                      {nationalIds.map((nationalId, idx) => (
                        <div key={idx} className="border p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label>Country</Label>
                              <Select value={nationalId.country} onValueChange={v => handleNationalIdChange(idx, 'country', v)}>
                                <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                                <SelectContent>
                                  {countryOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>ID Type</Label>
                              <Input 
                                value={nationalId.type} 
                                onChange={e => handleNationalIdChange(idx, 'type', e.target.value)} 
                                placeholder={getIdentificationLabel(nationalId.country)}
                                className={`${nationalId.country ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}
                                title="Auto-populated based on country selection. You can edit this if needed."
                              />
                              {nationalId.country && (
                                <p className="text-xs text-blue-600 mt-1">✓ Auto-populated based on country</p>
                              )}
                            </div>
                            <div className="flex gap-2 items-end">
                              <div className="flex-1">
                                <Label>ID Number</Label>
                                <Input 
                                  value={nationalId.number} 
                                  onChange={e => handleNationalIdChange(idx, 'number', e.target.value)} 
                                  placeholder={getIdentificationPlaceholder(nationalId.country)}
                                  className={`${nationalId.country ? 'border-green-200' : ''}`}
                                />
                                {nationalId.country && (
                                  <p className="text-xs text-green-600 mt-1">
                                    Format: {getIdentificationPlaceholder(nationalId.country)}
                                  </p>
                                )}
                              </div>
                              {nationalIds.length > 1 && (
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => removeNationalId(idx)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                                  aria-label="Remove national ID"
                                >
                                  <Trash className="w-5 h-5" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={addNationalId} className="w-full">
                        + Add Another National ID
                      </Button>
                    </div>
                    

                    
                    {/* Passport Information - Multiple Passports */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Passport Information</Label>
                      {passports.map((passport, idx) => (
                        <div key={idx} className="border p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label>Issuing Country</Label>
                              <Select value={passport.country} onValueChange={v => handlePassportChange(idx, 'country', v)}>
                                <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                                <SelectContent>
                                  {countryOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <div><Label>Passport Number</Label><Input value={passport.number} onChange={e => handlePassportChange(idx, 'number', e.target.value)} /></div>
                            <div className="flex gap-2 items-end">
                              <div className="flex-1">
                                <Label>Expiry Date</Label>
                                <Input 
                                  type="date" 
                                  value={passport.expiry} 
                                  onChange={e => handlePassportChange(idx, 'expiry', e.target.value)} 
                                  placeholder={passport.country === 'United States' ? 'MM/DD/YYYY' : 'DD/MM/YYYY'}
                                  title={passport.country === 'United States' ? 'Format: MM/DD/YYYY' : 'Format: DD/MM/YYYY'}
                                />
                                <span className="text-xs text-gray-500">
                                  {passport.country === 'United States' ? 'Format: MM/DD/YYYY' : 'Format: DD/MM/YYYY'}
                                </span>
                              </div>
                              {passports.length > 1 && (
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => removePassport(idx)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                                  aria-label="Remove passport"
                                >
                                  <Trash className="w-5 h-5" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={addPassport} className="w-full">
                        + Add Another Passport
                      </Button>
                    </div>
                    

                    
                    {/* Multiple Driver's Licenses */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Driver's Licenses</Label>
                      {driverLicenses.map((driverLicense, idx) => (
                        <div key={idx} className="border p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div>
                              <Label>Country</Label>
                              <Select value={driverLicense.country} onValueChange={v => handleDriverLicenseChange(idx, 'country', v)}>
                                <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                                <SelectContent>
                                  {countryOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>License Type</Label>
                              <Input 
                                value={driverLicense.type} 
                                onChange={e => handleDriverLicenseChange(idx, 'type', e.target.value)} 
                                placeholder="e.g., Driver's License, International License"
                              />
                            </div>
                            <div>
                              <Label>License Number</Label>
                              <Input 
                                value={driverLicense.number} 
                                onChange={e => handleDriverLicenseChange(idx, 'number', e.target.value)} 
                                placeholder="Enter license number"
                              />
                            </div>
                            <div>
                              <Label>Expiry Date</Label>
                              <Input 
                                type="date" 
                                value={driverLicense.expiry} 
                                onChange={e => handleDriverLicenseChange(idx, 'expiry', e.target.value)} 
                              />
                            </div>
                            <div className="flex gap-2 items-end">
                              <div className="flex-1">
                                <Label>Issuing Province/State</Label>
                                <Input 
                                  value={driverLicense.province} 
                                  onChange={e => handleDriverLicenseChange(idx, 'province', e.target.value)} 
                                  placeholder="e.g., Ontario, California"
                                />
                              </div>
                              {driverLicenses.length > 1 && (
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => removeDriverLicense(idx)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                                  aria-label="Remove driver's license"
                                >
                                  <Trash className="w-5 h-5" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={addDriverLicense} className="w-full">
                        + Add Another Driver's License
                      </Button>
                    </div>
                    

                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 2.5. National ID Document Uploads */}
            <AccordionItem value="nationalIdUploads">
              <AccordionTrigger style={{ color: '#153A4B' }}>📄 Upload National ID Documents</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Upload clear images or scans of your National ID cards (SSN, SIN, etc.)
                      </p>
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload('nationalId', e.target.files)}
                        className="hidden"
                        id="nationalId-upload"
                      />
                      <label htmlFor="nationalId-upload" className="cursor-pointer">
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to upload National ID documents</p>
                        </div>
                      </label>
                    </div>
                    
                    {idDocuments.nationalId?.files.length > 0 && (
                      <div className="space-y-2">
                        {idDocuments.nationalId.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile('nationalId', index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 2.6. Passport Document Uploads */}
            <AccordionItem value="passportUploads">
              <AccordionTrigger style={{ color: '#153A4B' }}>📄 Upload Passport Documents</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Upload clear images or scans of your passport documents
                      </p>
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload('passport', e.target.files)}
                        className="hidden"
                        id="passport-upload"
                      />
                      <label htmlFor="passport-upload" className="cursor-pointer">
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to upload Passport documents</p>
                        </div>
                      </label>
                    </div>
                    
                    {idDocuments.passport?.files.length > 0 && (
                      <div className="space-y-2">
                        {idDocuments.passport.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile('passport', index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 2.7. Driver's License Document Uploads */}
            <AccordionItem value="driverLicenseUploads">
              <AccordionTrigger style={{ color: '#153A4B' }}>📄 Upload Driver's License Documents</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Upload clear images or scans of your driver's license documents
                      </p>
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload('driverLicense', e.target.files)}
                        className="hidden"
                        id="driverLicense-upload"
                      />
                      <label htmlFor="driverLicense-upload" className="cursor-pointer">
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to upload Driver's License documents</p>
                        </div>
                      </label>
                    </div>
                    
                    {idDocuments.driverLicense?.files.length > 0 && (
                      <div className="space-y-2">
                        {idDocuments.driverLicense.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile('driverLicense', index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 3. Phone Numbers */}
            <AccordionItem value="phones">
              <AccordionTrigger style={{ color: '#153A4B' }}>Phone Numbers</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {phones.map((p, idx) => (
                      <div key={idx} className="border p-4 rounded mb-2 flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1">
                          <Label>Type</Label>
                          <Select value={p.type} onValueChange={v => handlePhoneChange(idx, 'type', v)}>
                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Home">Home</SelectItem>
                              <SelectItem value="Mobile">Mobile</SelectItem>
                              <SelectItem value="Work">Work</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1">
                          <Label>Number</Label>
                          <Input 
                            value={p.number} 
                            onChange={e => handlePhoneChange(idx, 'number', e.target.value)} 
                            type="tel" 
                            placeholder="(555) 123-4567 or +1 234 567 8900"
                          />
                        </div>
                        {phones.length > 1 && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removePhone(idx)} 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                            aria-label="Remove phone"
                          >
                            <Trash className="w-5 h-5" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addPhone}>+ Add Another Phone</Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 4. Address History */}
            <AccordionItem value="addresses">
              <AccordionTrigger style={{ color: '#153A4B' }}>Current & Previous Addresses</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {addresses.map((addr, idx) => (
                      <div key={idx} className="border p-4 rounded mb-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Address Type</Label>
                            <Select value={addr.type} onValueChange={v => handleAddressChange(idx, 'type', v)}>
                              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                              <SelectContent>
                                {addressTypeOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div><Label>Street Address</Label><Input value={addr.street} onChange={e => handleAddressChange(idx, 'street', e.target.value)} /></div>
                          <div><Label>City</Label><Input value={addr.city} onChange={e => handleAddressChange(idx, 'city', e.target.value)} /></div>
                          <div>
                            <Label>Country</Label>
                            <Select value={addr.country} onValueChange={v => handleAddressCountryChange(idx, v)}>
                              <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                              <SelectContent>
                                {countryOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>{addr.regionLabel || 'Province/State'}</Label>
                            {addr.availableRegions && addr.availableRegions.length > 0 ? (
                              <Select value={addr.province} onValueChange={v => handleAddressChange(idx, 'province', v)}>
                                <SelectTrigger><SelectValue placeholder={`Select ${(addr.regionLabel || 'Province/State').toLowerCase()}`} /></SelectTrigger>
                                <SelectContent>
                                  {addr.availableRegions.map(region => (
                                    <SelectItem key={region} value={region}>{region}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input 
                                value={addr.province} 
                                onChange={e => handleAddressChange(idx, 'province', e.target.value)} 
                                placeholder={`Enter ${(addr.regionLabel || 'Province/State').toLowerCase()}`}
                              />
                            )}
                          </div>
                          <div><Label>{addr.postalLabel || getPostalCodeLabel(addr.country)}</Label><Input value={addr.postal} onChange={e => handleAddressChange(idx, 'postal', e.target.value)} /></div>
                          <div><Label>Start Date</Label><Input type="date" value={addr.start} onChange={e => handleAddressChange(idx, 'start', e.target.value)} /></div>
                          <div><Label>End Date (optional)</Label><Input type="date" value={addr.end} onChange={e => handleAddressChange(idx, 'end', e.target.value)} /></div>
                        </div>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addAddress}>+ Add Another Address</Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 5. Emergency Contacts */}
            <AccordionItem value="contacts">
              <AccordionTrigger style={{ color: '#153A4B' }}>Emergency Contacts</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {contacts.map((c, idx) => (
                      <div key={idx} className="border p-4 rounded mb-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><Label>Full Name</Label><Input value={c.name} onChange={e => handleContactChange(idx, 'name', e.target.value)} /></div>
                          <div>
                            <Label>Relationship to You</Label>
                            <Select value={c.relationship} onValueChange={v => handleContactChange(idx, 'relationship', v)}>
                              <SelectTrigger><SelectValue placeholder="Select relationship" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Spouse">Spouse</SelectItem>
                                <SelectItem value="Parent">Parent</SelectItem>
                                <SelectItem value="Child">Child</SelectItem>
                                <SelectItem value="Sibling">Sibling</SelectItem>
                                <SelectItem value="Friend">Friend</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div><Label>Phone</Label><Input value={c.phone} onChange={e => handleContactChange(idx, 'phone', e.target.value)} /></div>
                          <div><Label>Email</Label><Input value={c.email} onChange={e => handleContactChange(idx, 'email', e.target.value)} /></div>
                          <div>
                            <Label>Authorized Contact?</Label>
                            <RadioGroup value={c.authorized} onValueChange={v => handleContactChange(idx, 'authorized', v)} className="flex flex-row gap-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Yes" id={`emerg-yes-${idx}`} />
                                <Label htmlFor={`emerg-yes-${idx}`}>Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="No" id={`emerg-no-${idx}`} />
                                <Label htmlFor={`emerg-no-${idx}`}>No</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          <div>
                            <Label>Primary Emergency Contact?</Label>
                            <RadioGroup value={c.emergency} onValueChange={v => handleContactChange(idx, 'emergency', v)} className="flex flex-row gap-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Yes" id={`emerg-primary-yes-${idx}`} />
                                <Label htmlFor={`emerg-primary-yes-${idx}`}>Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="No" id={`emerg-primary-no-${idx}`} />
                                <Label htmlFor={`emerg-primary-no-${idx}`}>No</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addContact}>+ Add Another Contact</Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 6. Family Information */}
            <AccordionItem value="family">
              <AccordionTrigger style={{ color: '#153A4B' }}>Family Information</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label>Father's Full Name</Label><Input value={fatherName} onChange={e => setFatherName(e.target.value)} /></div>
                      <div><Label>Mother's Full Name</Label><Input value={motherName} onChange={e => setMotherName(e.target.value)} /></div>
                      <div><Label>Stepfather's Full Name</Label><Input value={stepfatherName} onChange={e => setStepfatherName(e.target.value)} /></div>
                      <div><Label>Stepmother's Full Name</Label><Input value={stepmotherName} onChange={e => setStepmotherName(e.target.value)} /></div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 7. Relationship Status */}
            <AccordionItem value="relationship">
              <AccordionTrigger style={{ color: '#153A4B' }}>Relationship Status</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div className="mb-2">
                      <Label>Status</Label>
                      <RadioGroup value={relationshipStatus} onValueChange={setRelationshipStatus} className="flex flex-row gap-4">
                        <RadioGroupItem value="Married" id="rel-married" /> <Label htmlFor="rel-married">Married</Label>
                        <RadioGroupItem value="Single" id="rel-single" /> <Label htmlFor="rel-single">Single</Label>
                        <RadioGroupItem value="Divorced" id="rel-divorced" /> <Label htmlFor="rel-divorced">Divorced</Label>
                        <RadioGroupItem value="Widowed" id="rel-widowed" /> <Label htmlFor="rel-widowed">Widowed</Label>
                        <RadioGroupItem value="Common Law" id="rel-commonlaw" /> <Label htmlFor="rel-commonlaw">Common Law</Label>
                      </RadioGroup>
                    </div>
                    <div><Label>Partner/Spouse Full Name</Label><Input value={spouseName} onChange={e => setSpouseName(e.target.value)} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label>Partner/Spouse Phone</Label><Input value={spousePhone} onChange={e => handleSpousePhoneChange(e.target.value)} type="tel" placeholder="(555) 123-4567 or +1 234 567 8900" /></div>
                      <div><Label>Partner/Spouse Email</Label><Input value={spouseEmail} onChange={e => setSpouseEmail(e.target.value)} type="email" placeholder="partner@email.com" /></div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 8. Children / Dependents */}
            <AccordionItem value="children">
              <AccordionTrigger style={{ color: '#153A4B' }}>Children / Dependents</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {children.map((child, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                        <div><Label>Name</Label><Input value={child.name} onChange={e => handleChildChange(idx, 'name', e.target.value)} /></div>
                        <div>
                          <Label>Gender</Label>
                          <Select value={child.gender} onValueChange={v => handleChildChange(idx, 'gender', v)}>
                            <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                            <SelectContent>
                              {childGenderOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div><Label>Age</Label><Input value={child.age} onChange={e => handleChildChange(idx, 'age', e.target.value)} /></div>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addChild}>+ Add Another Child</Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 9. Religious & Spiritual Preferences */}
            <AccordionItem value="religion">
              <AccordionTrigger style={{ color: '#153A4B' }}>Religious & Spiritual Preferences</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label>Affiliation / Faith</Label><Input value={religiousAffiliation} onChange={e => setReligiousAffiliation(e.target.value)} /></div>
                      <div><Label>Place of Worship</Label><Input value={placeOfWorship} onChange={e => setPlaceOfWorship(e.target.value)} /></div>
                      <div><Label>Clergy Name</Label><Input value={clergyName} onChange={e => setClergyName(e.target.value)} /></div>
                                              <div><Label>Clergy Phone</Label><Input value={clergyPhone} onChange={e => handleClergyPhoneChange(e.target.value)} type="tel" placeholder="(555) 123-4567" /></div>
                      <div><Label>Clergy Email</Label><Input value={clergyEmail} onChange={e => setClergyEmail(e.target.value)} type="email" /></div>
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                      <Checkbox checked={lastRites} onCheckedChange={v => setLastRites(!!v)} id="last-rites" />
                      <Label htmlFor="last-rites">Last Rites</Label>
                      <Checkbox checked={clergyPresent} onCheckedChange={v => setClergyPresent(!!v)} id="clergy-present" />
                      <Label htmlFor="clergy-present">Clergy Present</Label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label>Scripture Preferences</Label><Input value={scripturePreferences} onChange={e => setScripturePreferences(e.target.value)} /></div>
                      <div><Label>Prayer Style</Label><Input value={prayerStyle} onChange={e => setPrayerStyle(e.target.value)} /></div>
                      <div><Label>Burial Rituals</Label><Input value={burialRituals} onChange={e => setBurialRituals(e.target.value)} /></div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 10. Work & Career Info */}
            <AccordionItem value="work">
              <AccordionTrigger style={{ color: '#153A4B' }}>Work & Career Info</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Employment Status</Label>
                        <Select value={employmentStatus} onValueChange={setEmploymentStatus}>
                          <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                          <SelectContent>
                            {employmentStatusOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div><Label>Current Occupation</Label><Input value={occupation} onChange={e => setOccupation(e.target.value)} /></div>
                      <div><Label>Will Location</Label><Input value={willLocation} onChange={e => setWillLocation(e.target.value)} /></div>
                      <div><Label>Phone Unlock Code</Label><Input value={unlockCode} onChange={e => setUnlockCode(e.target.value)} /></div>
                      <div><Label>Password Manager Info</Label><Input value={passwordManager} onChange={e => setPasswordManager(e.target.value)} /></div>
                      <div><Label>Backup Code Storage</Label><Input value={backupCodeStorage} onChange={e => setBackupCodeStorage(e.target.value)} /></div>
                      <div><Label>Key Online Accounts</Label><Input value={keyAccounts} onChange={e => setKeyAccounts(e.target.value)} /></div>
                      <div><Label>Digital Docs Location</Label><Input value={digitalDocsLocation} onChange={e => setDigitalDocsLocation(e.target.value)} /></div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 12. Critical Documents & Key Locations */}
            <AccordionItem value="critical-docs">
              <AccordionTrigger style={{ color: '#153A4B' }}>Critical Documents & Key Locations</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {docOptions.map(doc => (
                        <div key={doc} className="flex items-center gap-2 w-full">
                          <Checkbox id={doc} checked={criticalDocs.includes(doc)} onCheckedChange={v => handleDocChange(doc, !!v)} />
                          <Label htmlFor={doc} className="flex-1">{doc.replace(/\\/g, '')}</Label>
                          {criticalDocs.includes(doc) && (
                            <Input
                              className="ml-2 flex-1"
                              placeholder="Enter location (e.g., safe, drawer)"
                              value={criticalDocLocations[doc] || ''}
                              onChange={e => handleDocLocationChange(doc, e.target.value)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 13. Education History (Optional) */}
            <AccordionItem value="education">
              <AccordionTrigger style={{ color: '#153A4B' }}>Education Info (Optional)</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {schools.map((s, idx) => (
                      <div key={idx} className="border p-4 rounded mb-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><Label>School Name</Label><Input value={s.name} onChange={e => handleSchoolChange(idx, 'name', e.target.value)} /></div>
                          <div><Label>Degree or Program</Label><Input value={s.degree} onChange={e => handleSchoolChange(idx, 'degree', e.target.value)} /></div>
                          <div><Label>Location</Label><Input value={s.location} onChange={e => handleSchoolChange(idx, 'location', e.target.value)} /></div>
                          <div><Label>Start Date</Label><Input type="date" value={s.start} onChange={e => handleSchoolChange(idx, 'start', e.target.value)} /></div>
                          <div><Label>Graduation/End Date</Label><Input type="date" value={s.end} onChange={e => handleSchoolChange(idx, 'end', e.target.value)} /></div>
                        </div>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addSchool}>+ Add Another School</Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 14. Additional Notes */}
            <AccordionItem value="notes">
              <AccordionTrigger style={{ color: '#153A4B' }}>Additional Notes</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent>
                    <Textarea value={additionalNotes} onChange={e => setAdditionalNotes(e.target.value)} placeholder="Any other information to help guide decisions or provide context." className="min-h-[100px] resize-none" />
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
              {renderPDFButton()}
              {/* ID Documents PDF Button */}
              {Object.keys(idDocuments).some(key => idDocuments[key]?.files?.length > 0) && (
                <Button
                  type="button"
                  onClick={() => {
                    // Prepare data with uploaded document URLs for QR codes
                    const pdfData = {
                      ...idDocuments,
                      // Add fileUrls for QR code generation
                      fileUrls: Object.keys(idDocuments).reduce((acc, docType) => {
                        acc[docType] = idDocuments[docType]?.uploadedDocs?.map(doc => doc.file_url) || [];
                        return acc;
                      }, {} as { [key: string]: string[] })
                    };
                    
                    generatePDF({
                      sectionTitle: 'ID Document Uploads',
                      data: pdfData,
                      formType: 'idDocuments',
                      userTier,
                      isTrial,
                      userInfo: {
                        firstName: firstName,
                        lastName: lastName,
                        email: user?.email
                      }
                    });
                  }}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                  Generate ID Documents PDF
                </Button>
              )}
              <Button 
                type="button" 
                variant="skillbinder_yellow"
                onClick={() => {
                  console.log('NEW SAVE BUTTON CLICKED!');
                  handleSave();
                }}
                className="skillbinder_yellow text-lg px-6"
              >
                Save & Continue
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>

    {/* Enhanced Name Change Request Dialog with File Upload */}
    <NameChangeRequestDialog
      isOpen={showNameChangeRequest}
      onClose={() => setShowNameChangeRequest(false)}
      currentFirstName={firstName}
      currentMiddleName={middleName}
      currentLastName={lastName}
      userId={user?.id || ''}
      userEmail={user?.email || ''}
    />
    </>
  );
};

export default PersonalInformationForm;