import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import OnlineAccountsSection from './forms/OnlineAccountsSection';
import SocialMediaSection from './forms/SocialMediaSection';
import FileStorageLegacySection from './forms/FileStorageLegacySection';

interface DigitalAssetsFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

const DigitalAssetsForm: React.FC<DigitalAssetsFormProps> = ({ onNext, onPrevious }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { syncForm } = useDatabaseSync();
  
  const [formData, setFormData] = useState({
    email_accounts: '',
    banking_sites: '',
    subscription_services: '',
    owned_websites: '',
    facebook_url: '',
    instagram_handle: '',
    twitter_handle: '',
    linkedin_url: '',
    other_social_accounts: '',
    uses_password_manager: '',
    password_manager_details: '',
    cloud_services: '',
    digital_legacy_instructions: '',
  });

  useEffect(() => {
    // Load from localStorage for now, will be replaced with database loading
    const savedData = localStorage.getItem('digitalAssetsData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      await syncForm(user.email, 'digitalAssetsData', formData);
      toast({
        title: "Success",
        description: "Digital assets information saved to database!",
      });
      onNext();
    } catch (error) {
      console.error('Error saving digital assets:', error);
      toast({
        title: "Error",
        description: "Failed to save to database. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Digital Assets</h1>
          <p className="text-lg text-gray-600">
            Organize your online accounts, social media, and digital file storage for legacy planning
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <OnlineAccountsSection
            formData={{
              email_accounts: formData.email_accounts,
              banking_sites: formData.banking_sites,
              subscription_services: formData.subscription_services,
              owned_websites: formData.owned_websites,
            }}
            onChange={handleFieldChange}
          />
          
          <SocialMediaSection
            formData={{
              facebook_url: formData.facebook_url,
              instagram_handle: formData.instagram_handle,
              twitter_handle: formData.twitter_handle,
              linkedin_url: formData.linkedin_url,
              other_social_accounts: formData.other_social_accounts,
            }}
            onChange={handleFieldChange}
          />
          
          <FileStorageLegacySection
            formData={{
              uses_password_manager: formData.uses_password_manager,
              password_manager_details: formData.password_manager_details,
              cloud_services: formData.cloud_services,
              digital_legacy_instructions: formData.digital_legacy_instructions,
            }}
            onChange={handleFieldChange}
          />
        </div>

        <div className="flex justify-between">
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
  );
};

export default DigitalAssetsForm;