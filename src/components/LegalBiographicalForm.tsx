import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import PronounSection from '@/components/forms/PronounSection';
import BiographicalSection from '@/components/forms/BiographicalSection';
import IdentificationSection from '@/components/forms/IdentificationSection';
import PassportSection from '@/components/forms/PassportSection';
import AddressesSection from '@/components/forms/AddressesSection';
import PhonesSection from '@/components/forms/PhonesSection';
import EmergencyContactsSection from '@/components/forms/EmergencyContactsSection';
import FamilyInfoSection from '@/components/forms/FamilyInfoSection';
import ReligiousPreferencesSection from '@/components/forms/ReligiousPreferencesSection';
import WorkCareerSection from '@/components/forms/WorkCareerSection';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';

interface LegalBiographicalFormProps {
  onNext: () => void;
  onPrevious?: () => void;
}

const LegalBiographicalForm: React.FC<LegalBiographicalFormProps> = ({ onNext, onPrevious }) => {
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const { syncForm } = useDatabaseSync();
  
  // State variables
  const [pronouns, setPronouns] = useState('');
  const [customPronoun, setCustomPronoun] = useState('');
  const [fullName, setFullName] = useState('');
  const [fullNameAtBirth, setFullNameAtBirth] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [placeOfBirthCity, setPlaceOfBirthCity] = useState('');
  const [placeOfBirthCountry, setPlaceOfBirthCountry] = useState('');
  const [bornAbroad, setBornAbroad] = useState(false);
  const [bornAbroadSpecify, setBornAbroadSpecify] = useState('');
  const [socialSecurityNumber, setSocialSecurityNumber] = useState('');
  const [driversLicenseNumber, setDriversLicenseNumber] = useState('');
  const [licenseState, setLicenseState] = useState('');
  const [licenseExpiration, setLicenseExpiration] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [passportCountry, setPassportCountry] = useState('');
  const [dualCitizen, setDualCitizen] = useState(false);
  const [citizenshipCountries, setCitizenshipCountries] = useState<string[]>([]);
  const [currentAddress, setCurrentAddress] = useState({ street: '', city: '', state: '', zipCode: '', country: '' });
  const [pastAddresses, setPastAddresses] = useState<any[]>([]);
  const [phones, setPhones] = useState([{ number: '', type: '' }]);
  const [emergencyContacts, setEmergencyContacts] = useState([{ name: '', relationship: '', phone: '' }]);
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [stepfatherName, setStepfatherName] = useState('');
  const [stepmotherName, setStepmotherName] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');
  const [spouseName, setSpouseName] = useState('');
  const [spouseContact, setSpouseContact] = useState('');
  const [children, setChildren] = useState<any[]>([]);
  const [otherFamilyMembers, setOtherFamilyMembers] = useState<any[]>([]);
  const [religiousAffiliation, setReligiousAffiliation] = useState('');
  const [placeOfWorship, setPlaceOfWorship] = useState('');
  const [worshipAddress, setWorshipAddress] = useState('');
  const [clergyName, setClergyName] = useState('');
  const [clergyContact, setClergyContact] = useState('');
  const [clergyEmail, setClergyEmail] = useState('');
  const [lastRites, setLastRites] = useState('');
  const [clergyPresent, setClergyPresent] = useState('');
  const [scripturePreferences, setScripturePreferences] = useState('');
  const [prayerStyle, setPrayerStyle] = useState('');
  const [burialRituals, setBurialRituals] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [employerAddress, setEmployerAddress] = useState('');
  const [employerPhone, setEmployerPhone] = useState('');
  const [supervisorName, setSupervisorName] = useState('');
  const [supervisorPhone, setSupervisorPhone] = useState('');

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('legalBiographicalData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setPronouns(data.pronouns || '');
      setCustomPronoun(data.customPronoun || '');
      setFullName(data.fullName || '');
      setFullNameAtBirth(data.fullNameAtBirth || '');
      setDateOfBirth(data.dateOfBirth || '');
      setPlaceOfBirthCity(data.placeOfBirthCity || '');
      setPlaceOfBirthCountry(data.placeOfBirthCountry || '');
      setBornAbroad(data.bornAbroad || false);
      setBornAbroadSpecify(data.bornAbroadSpecify || '');
      setSocialSecurityNumber(data.socialSecurityNumber || '');
      setDriversLicenseNumber(data.driversLicenseNumber || '');
      setLicenseState(data.licenseState || '');
      setLicenseExpiration(data.licenseExpiration || '');
      setPassportNumber(data.passportNumber || '');
      setPassportCountry(data.passportCountry || '');
      setDualCitizen(data.dualCitizen || false);
      setCitizenshipCountries(data.citizenshipCountries || []);
      setCurrentAddress(data.currentAddress || { street: '', city: '', state: '', zipCode: '', country: '' });
      setPastAddresses(data.pastAddresses || []);
      setPhones(data.phones || [{ number: '', type: '' }]);
      setEmergencyContacts(data.emergencyContacts || [{ name: '', relationship: '', phone: '' }]);
      setFatherName(data.fatherName || '');
      setMotherName(data.motherName || '');
      setStepfatherName(data.stepfatherName || '');
      setStepmotherName(data.stepmotherName || '');
      setRelationshipStatus(data.relationshipStatus || '');
      setSpouseName(data.spouseName || '');
      setSpouseContact(data.spouseContact || '');
      setChildren(data.children || []);
      setOtherFamilyMembers(data.otherFamilyMembers || []);
      setReligiousAffiliation(data.religiousAffiliation || '');
      setPlaceOfWorship(data.placeOfWorship || '');
      setWorshipAddress(data.worshipAddress || '');
      setClergyName(data.clergyName || '');
      setClergyContact(data.clergyContact || '');
      setClergyEmail(data.clergyEmail || '');
      setLastRites(data.lastRites || '');
      setClergyPresent(data.clergyPresent || '');
      setScripturePreferences(data.scripturePreferences || '');
      setPrayerStyle(data.prayerStyle || '');
      setBurialRituals(data.burialRituals || '');
      setEmploymentStatus(data.employmentStatus || '');
      setEmployerName(data.employerName || '');
      setEmployerAddress(data.employerAddress || '');
      setEmployerPhone(data.employerPhone || '');
      setSupervisorName(data.supervisorName || '');
      setSupervisorPhone(data.supervisorPhone || '');
    }
  }, []);

  const validateForm = () => {
    if (!fullName || !dateOfBirth) {
      toast({
        title: "Please fill in required fields",
        description: "Full name and date of birth are required.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const formData = {
      pronouns,
      customPronoun,
      fullName,
      fullNameAtBirth,
      dateOfBirth,
      placeOfBirthCity,
      placeOfBirthCountry,
      bornAbroad,
      bornAbroadSpecify,
      socialSecurityNumber,
      driversLicenseNumber,
      licenseState,
      licenseExpiration,
      passportNumber,
      passportCountry,
      dualCitizen,
      citizenshipCountries,
      currentAddress,
      pastAddresses,
      phones,
      emergencyContacts,
      fatherName,
      motherName,
      stepfatherName,
      stepmotherName,
      relationshipStatus,
      spouseName,
      spouseContact,
      children,
      otherFamilyMembers,
      religiousAffiliation,
      placeOfWorship,
      worshipAddress
    };

    if (!user?.email) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your data.",
        variant: "destructive",
      });
      return;
    }

    try {
      await syncForm(user.email, 'legalBiographicalData', formData);
      toast({
        title: "Success",
        description: "Legal biographical information saved to database!"
      });
      onNext();
    } catch (error) {
      console.error('Error saving legal biographical data:', error);
      toast({
        title: "Error",
        description: "Failed to save to database. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Legal & Biographical Information</CardTitle>
        <CardDescription>
          Let's start with your basic information. This helps your loved ones feel confident and prepared.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="pronouns">
            <AccordionTrigger>Pronouns</AccordionTrigger>
            <AccordionContent>
              <PronounSection
                pronouns={pronouns}
                customPronoun={customPronoun}
                onPronounsChange={setPronouns}
                onCustomPronounChange={setCustomPronoun}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="biographical">
            <AccordionTrigger>Legal & Biographical Information</AccordionTrigger>
            <AccordionContent>
              <BiographicalSection
                fullName={fullName}
                fullNameAtBirth={fullNameAtBirth}
                dateOfBirth={dateOfBirth}
                placeOfBirthCity={placeOfBirthCity}
                placeOfBirthCountry={placeOfBirthCountry}
                bornAbroad={bornAbroad}
                bornAbroadSpecify={bornAbroadSpecify}
                socialSecurityNumber={socialSecurityNumber}
                onFullNameChange={setFullName}
                onFullNameAtBirthChange={setFullNameAtBirth}
                onDateOfBirthChange={setDateOfBirth}
                onPlaceOfBirthCityChange={setPlaceOfBirthCity}
                onPlaceOfBirthCountryChange={setPlaceOfBirthCountry}
                onBornAbroadChange={setBornAbroad}
                onBornAbroadSpecifyChange={setBornAbroadSpecify}
                onSocialSecurityNumberChange={setSocialSecurityNumber}
                userCountry={placeOfBirthCountry || 'United States'}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between items-center w-full">
          <p className="text-subtext">You're doing great — just a few more steps</p>
          <Button onClick={handleSave} variant="default" size="lg">
            Save & Continue
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LegalBiographicalForm;