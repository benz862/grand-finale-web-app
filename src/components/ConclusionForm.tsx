import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { ArrowLeft, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useLocalization } from '../contexts/LocalizationContext';
import AudioPlayer from './AudioPlayer';
// import ImprovementFeedbackForm from './ImprovementFeedbackForm'; // Temporarily disabled
import { useTrial } from '../contexts/TrialContext';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import FullBookPDFExport from './FullBookPDFExport';

interface ConclusionFormProps {
  onPrevious: () => void;
}

const ConclusionForm: React.FC<ConclusionFormProps> = ({ onPrevious }) => {
  console.log('ConclusionForm component is rendering');
  const { toast } = useToast();
  const { localizeText } = useLocalization();
  const { syncForm } = useDatabaseSync();
  const { user, isAuthenticated } = useAuth();
  const { userTier, isTrial } = useTrial();

  // Collect all user data for the full book PDF
  const [userData, setUserData] = useState<any>({});

  useEffect(() => {
    // Collect all form data from localStorage for the full book PDF
    const collectAllUserData = () => {
      const allData: any = {};
      
      // Basic user info - Section 1
      const personalInfo = JSON.parse(localStorage.getItem('personalContactData') || '{}');
      allData.firstName = personalInfo.firstName || '';
      allData.lastName = personalInfo.lastName || '';
      allData.basic_info = personalInfo;
      
      // Medical info - Section 2
      const medicalInfo = JSON.parse(localStorage.getItem('medicalInfoData') || '{}');
              allData.physicians = medicalInfo.physicians || [];
      allData.insuranceNotes = medicalInfo.insuranceNotes || '';
      allData.medications = medicalInfo.medications || [];
      allData.supplements = medicalInfo.supplements || '';
      allData.pharmacyName = medicalInfo.pharmacyName || '';
      allData.pharmacyPhone = medicalInfo.pharmacyPhone || '';
      allData.allergies = medicalInfo.allergies || '';
      allData.reactions = medicalInfo.reactions || '';
      allData.chronicIllnesses = medicalInfo.chronicIllnesses || [];
      allData.surgeries = medicalInfo.surgeries || [];
      allData.hospitalizations = medicalInfo.hospitalizations || [];
      allData.organDonor = medicalInfo.organDonor || '';
      allData.organDonorState = medicalInfo.organDonorState || '';
      allData.organDonorLocation = medicalInfo.organDonorLocation || '';
      allData.livingWill = medicalInfo.livingWill || '';
      allData.livingWillDate = medicalInfo.livingWillDate || '';
      allData.livingWillLocation = medicalInfo.livingWillLocation || '';
      allData.dnr = medicalInfo.dnr || '';
      allData.dnrDate = medicalInfo.dnrDate || '';
      allData.dnrLocation = medicalInfo.dnrLocation || '';
      allData.proxyName = medicalInfo.proxyName || '';
      allData.proxyRelationship = medicalInfo.proxyRelationship || '';
      allData.proxyPhone = medicalInfo.proxyPhone || '';
      allData.proxyEmail = medicalInfo.proxyEmail || '';
      allData.proxyLocation = medicalInfo.proxyLocation || '';
      allData.primaryProvider = medicalInfo.primaryProvider || '';
      allData.policyNumber = medicalInfo.policyNumber || '';
      allData.policyholder = medicalInfo.policyholder || '';
      allData.insurancePhone = medicalInfo.insurancePhone || '';
      allData.secondaryCoverage = medicalInfo.secondaryCoverage || '';
      allData.nearestER = medicalInfo.nearestER || '';
      allData.preferredHospital = medicalInfo.preferredHospital || '';
      allData.additionalNotes = medicalInfo.additionalNotes || '';
      
      // Legal info - Section 3
      const legalEstate = JSON.parse(localStorage.getItem('legalEstateForm') || '{}');
      allData.legal_estate = legalEstate;
      
      // Finance info - Section 4
      const financeBusiness = JSON.parse(localStorage.getItem('financeBusinessInfo') || '{}');
      allData.finance_business = financeBusiness;
      
      // Beneficiaries - Section 5
      const beneficiariesInheritance = JSON.parse(localStorage.getItem('beneficiariesInheritanceData') || '{}');
      allData.beneficiaries_inheritance = beneficiariesInheritance;
      
      // Property info - Section 6
      const personalPropertyRealEstate = JSON.parse(localStorage.getItem('personalPropertyRealEstateData') || '{}');
      allData.personal_property_real_estate = personalPropertyRealEstate;
      
      // Digital life - Section 7
      const digitalLife = JSON.parse(localStorage.getItem('digitalLifeData') || '{}');
      allData.digital_life = digitalLife;
      
      // Key contacts - Section 8
      const keyContacts = JSON.parse(localStorage.getItem('keyContactsData') || '{}');
      allData.key_contacts = keyContacts;
      
      // Funeral info - Section 9
      const funeralFinalArrangements = JSON.parse(localStorage.getItem('funeralFinalArrangementsData') || '{}');
      allData.funeral_final_arrangements = funeralFinalArrangements;
      
      // Funeral preferences - Section 10
      const funeralPreferences = JSON.parse(localStorage.getItem('funeral_preferences') || '{}');
      allData.funeral_preferences = funeralPreferences;
      
      // Accounts - Section 11
      const accountsMemberships = JSON.parse(localStorage.getItem('accountsMembershipsData') || '{}');
      allData.accounts_memberships = accountsMemberships;
      
      // Pets - Section 12
      const petsAnimalCare = JSON.parse(localStorage.getItem('petsAnimalCareData') || '{}');
      allData.pets_animal_care = petsAnimalCare;
      
      // Letters - Section 13
      const shortLetters = JSON.parse(localStorage.getItem('shortLettersData') || '{}');
      allData.short_letters = shortLetters;
      
      // Final wishes - Section 14
      const finalWishes = JSON.parse(localStorage.getItem('finalWishesLegacyPlanningData') || '{}');
      allData.final_wishes = finalWishes;
      
      // Bucket list - Section 15
      const bucketList = JSON.parse(localStorage.getItem('bucketListUnfinishedBusinessData') || '{}');
      allData.bucket_list = bucketList;
      
      // Formal letters - Section 16
      const formalLetters = JSON.parse(localStorage.getItem('formalLettersData') || '{}');
      allData.formal_letters = formalLetters;
      
      // Transition notes - Section 17
      const transitionNotes = JSON.parse(localStorage.getItem('transitionNotesData') || '{}');
      allData.transition_notes = transitionNotes;
      
      // File uploads - Section 18
      const fileUploads = JSON.parse(localStorage.getItem('fileUploadsData') || '{}');
      allData.file_uploads = fileUploads;
      

      
      setUserData(allData);
    };

    collectAllUserData();
  }, []);

  const handleExportStart = () => {
    toast({
      title: "Generating Full Book PDF",
      description: "Creating your complete legacy planning document...",
    });
  };

  const handleExportComplete = () => {
    toast({
      title: "PDF Generated Successfully",
      description: "Your complete legacy planning document has been saved.",
    });
  };

  const handleExportError = (error: string) => {
    toast({
      title: "Error Generating PDF",
      description: "There was an issue generating your document. Please try again.",
      variant: "destructive"
    });
  };

  return (
    <>
      <div className="bg-green-100 p-4 mb-4 border border-green-400 rounded">
        <h2 className="text-lg font-bold text-green-800">DEBUG: ConclusionForm is rendering</h2>
        <p className="text-green-700">Conclusion Section</p>
      </div>
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Card */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="mb-4">
              <img 
                src="/Long_logo_The_Grand_Finale.png" 
                alt="The Grand Finale - A well-planned goodbye starts here" 
                className="mx-auto h-52 w-auto object-contain"
              />
            </div>
            <div className="mb-4">
              <AudioPlayer audioFile="Conclusion.mp3" size="md" sectionNumber={0} customLabel="Conclusion - Audio Guide" />
            </div>
            <div className="mt-4">
              <h2 className="text-3xl font-bold" style={{ color: '#153A4B' }}>You've Done Something Beautiful</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              This wasn't just a checklist. You've created a legacy — one that guided, comforted, 
              and {localizeText('honored')} your life and wishes. Your loved ones were grateful for the care and 
              thoughtfulness you put into organizing this important information.
            </p>
          </CardHeader>
        </Card>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold" style={{ color: '#153A4B' }}>
                What You've Accomplished
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700">
                You've created a comprehensive legacy planning document that includes:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Complete personal and medical information</li>
                <li>• Legal documents and estate planning details</li>
                <li>• Financial accounts and business information</li>
                <li>• Digital assets and online account access</li>
                <li>• Final wishes and funeral preferences</li>
                <li>• Personal messages and letters to loved ones</li>
                <li>• Legacy planning and bucket list items</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold" style={{ color: '#153A4B' }}>
                What This Means for Your Loved Ones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700">
                You've given your family and friends an incredible gift:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Clear guidance during difficult times</li>
                <li>• Fewer questions, more peace</li>
                <li>• Your personal thoughts and wishes</li>
                <li>• Practical instructions and contacts</li>
                <li>• A lasting reminder of your care</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold" style={{ color: '#153A4B' }}>
                Your Information Is Safe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700">
                We store your data securely using Supabase, a trusted platform built on top of Amazon Web Services.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Only you can see your entries. No one else — not even us — can view your content without your permission.</li>
                <li>• Your information is encrypted, private, and never shared with third parties.</li>
                <li>• We do not sell your data. Ever.</li>
                <li>• Export to PDF for secure sharing with loved ones</li>
                <li>• User authentication keeps your data secure</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold" style={{ color: '#153A4B' }}>
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700">
                Here's what you should do with your completed legacy plan:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Download your complete PDF document</li>
                <li>• Store it securely with your important papers</li>
                <li>• Share access with trusted family members</li>
                <li>• Update information as circumstances change</li>
                <li>• Review and revise annually</li>
              </ul>
            </CardContent>
          </Card>

        </div>

        {/* Call to Action Card */}
        <Card>
          <CardContent className="text-center p-8">
            <h3 className="text-lg font-semibold mb-3" style={{ color: '#153A4B' }}>
              Ready to save your legacy?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Generate a comprehensive PDF that includes all your information, organized and ready 
              to share with your loved ones or store with your important documents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <FullBookPDFExport
                userData={userData}
                onExportStart={handleExportStart}
                onExportComplete={handleExportComplete}
                onError={handleExportError}
              />
              <Button
                onClick={onPrevious}
                variant="skillbinder"
                size="lg"
                className="skillbinder px-8 py-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Make a Final Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Improvement Feedback Form - Temporarily Disabled */}
        {/* <div className="mb-8">
          <ImprovementFeedbackForm 
            onSubmissionSuccess={() => {
              toast({
                title: "Thank You!",
                description: "Your feedback has been submitted. We appreciate your suggestions!"
              });
            }}
          />
        </div> */}

        {/* Footer Message */}
        <div className="text-center mt-8">
          <div className="text-sm text-gray-500 max-w-2xl mx-auto space-y-2">
            <p>
              Thank you for taking the time to create this important document. Your thoughtfulness 
              and care will make a significant difference in the lives of those you love.
            </p>
            <p className="text-xs">
              Come back anytime to update your plan. Life changes — and your Grand Finale grows with you.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ConclusionForm; 