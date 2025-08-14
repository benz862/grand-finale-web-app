import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import TypeOfServiceSection from './forms/TypeOfServiceSection';
import DispositionSection from './forms/DispositionSection';
import CeremonyDetailsSection from './forms/CeremonyDetailsSection';
import SpecialRequestsSection from './forms/SpecialRequestsSection';

interface FuneralPreferencesFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

const FuneralPreferencesForm: React.FC<FuneralPreferencesFormProps> = ({ onNext, onPrevious }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { syncForm } = useDatabaseSync();
  
  // Type of Service
  const [wantsFuneralService, setWantsFuneralService] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [otherServiceType, setOtherServiceType] = useState('');
  
  // Disposition
  const [dispositionType, setDispositionType] = useState('');
  const [dispositionDetails, setDispositionDetails] = useState('');
  const [hasBurialAssets, setHasBurialAssets] = useState('');
  const [burialLocation, setBurialLocation] = useState('');
  
  // Ceremony Details
  const [officiantName, setOfficiantName] = useState('');
  const [preferredReadings, setPreferredReadings] = useState('');
  const [preferredMusic, setPreferredMusic] = useState('');
  const [dressCode, setDressCode] = useState('');
  
  // Special Requests
  const [preferredFlowers, setPreferredFlowers] = useState('');
  const [memorialDonations, setMemorialDonations] = useState('');
  const [otherRequests, setOtherRequests] = useState('');

  useEffect(() => {
    const savedData = localStorage.getItem('funeral_preferences');
    if (savedData) {
      const data = JSON.parse(savedData);
      setWantsFuneralService(data.wantsFuneralService || '');
      setServiceType(data.serviceType || '');
      setOtherServiceType(data.otherServiceType || '');
      setDispositionType(data.dispositionType || '');
      setDispositionDetails(data.dispositionDetails || '');
      setHasBurialAssets(data.hasBurialAssets || '');
      setBurialLocation(data.burialLocation || '');
      setOfficiantName(data.officiantName || '');
      setPreferredReadings(data.preferredReadings || '');
      setPreferredMusic(data.preferredMusic || '');
      setDressCode(data.dressCode || '');
      setPreferredFlowers(data.preferredFlowers || '');
      setMemorialDonations(data.memorialDonations || '');
      setOtherRequests(data.otherRequests || '');
    }
  }, []);

  const handleSave = async () => {
    if (!wantsFuneralService) {
      toast({
        title: "Validation Error",
        description: "Please indicate if you want a funeral or memorial service.",
        variant: "destructive",
      });
      return;
    }

    if (!dispositionType) {
      toast({
        title: "Validation Error",
        description: "Please select your preferred disposition.",
        variant: "destructive",
      });
      return;
    }

    const formData = {
      wantsFuneralService,
      serviceType,
      otherServiceType,
      dispositionType,
      dispositionDetails,
      hasBurialAssets,
      burialLocation,
      officiantName,
      preferredReadings,
      preferredMusic,
      dressCode,
      preferredFlowers,
      memorialDonations,
      otherRequests,
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
      await syncForm(user.email, 'funeralPreferencesData', formData);
      
      toast({
        title: "Success",
        description: "Funeral preferences saved to database!",
      });
      
      onNext();
    } catch (error) {
      console.error('Error saving funeral preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save to database. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Funeral Preferences</h1>
            <p className="text-gray-600">Section 10 of 11</p>
          </div>

          <TypeOfServiceSection
            wantsFuneralService={wantsFuneralService}
            setWantsFuneralService={setWantsFuneralService}
            serviceType={serviceType}
            setServiceType={setServiceType}
            otherServiceType={otherServiceType}
            setOtherServiceType={setOtherServiceType}
          />

          <DispositionSection
            dispositionType={dispositionType}
            setDispositionType={setDispositionType}
            dispositionDetails={dispositionDetails}
            setDispositionDetails={setDispositionDetails}
            hasBurialAssets={hasBurialAssets}
            setHasBurialAssets={setHasBurialAssets}
            burialLocation={burialLocation}
            setBurialLocation={setBurialLocation}
          />

          <CeremonyDetailsSection
            officiantName={officiantName}
            setOfficiantName={setOfficiantName}
            preferredReadings={preferredReadings}
            setPreferredReadings={setPreferredReadings}
            preferredMusic={preferredMusic}
            setPreferredMusic={setPreferredMusic}
            dressCode={dressCode}
            setDressCode={setDressCode}
          />

          <SpecialRequestsSection
            preferredFlowers={preferredFlowers}
            setPreferredFlowers={setPreferredFlowers}
            memorialDonations={memorialDonations}
            setMemorialDonations={setMemorialDonations}
            otherRequests={otherRequests}
            setOtherRequests={setOtherRequests}
          />

          <div className="flex justify-between pt-6">
            <Button
              onClick={onPrevious}
              variant="outline"
              className="px-6 py-2"
            >
              Previous
            </Button>
            <Button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Save & Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuneralPreferencesForm;