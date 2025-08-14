import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ObituaryDraftSection from './forms/ObituaryDraftSection';
import EpitaphPreferencesSection from './forms/EpitaphPreferencesSection';
import MemoryWishesSection from './forms/MemoryWishesSection';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';

interface ObituaryMemoryWishesFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

interface FormData {
  writeOwnObituary: string;
  obituaryText: string;
  obituaryDelegate: string;
  wantsHeadstone: string;
  epitaphText: string;
  memoryMessage: string;
  wantsMemoryTable: string;
  wantsVideoMessage: string;
  memoryGiftIdeas: string;
}

const ObituaryMemoryWishesForm: React.FC<ObituaryMemoryWishesFormProps> = ({ onNext, onPrevious }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    writeOwnObituary: '',
    obituaryText: '',
    obituaryDelegate: '',
    wantsHeadstone: '',
    epitaphText: '',
    memoryMessage: '',
    wantsMemoryTable: '',
    wantsVideoMessage: '',
    memoryGiftIdeas: ''
  });

  const { user } = useAuth();
  const { syncForm } = useDatabaseSync();

  useEffect(() => {
    // Load from localStorage for now, will be replaced with database loading
    const saved = localStorage.getItem('legacy_wishes');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const handleChange = (field: string, value: string) => {
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

    const dataToSave = {
      ...formData
    };

    try {
      await syncForm(user.email, 'obituaryMemoryWishesData', dataToSave);
      
      toast({
        title: "Success",
        description: "Obituary & memory wishes saved to database!",
      });
      
      onNext();
    } catch (error) {
      console.error('Error saving obituary data:', error);
      toast({
        title: "Error",
        description: "Failed to save to database. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGeneratePDF = () => {
    // Placeholder for PDF generation logic
    toast({
      title: "PDF Generation",
      description: "PDF generation functionality will be added later.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Obituary, Epitaph & Memory Wishes
          </h1>
          <p className="text-gray-600">
            Guide how you're remembered with your obituary draft, epitaph preferences, and meaningful personal touches.
          </p>
        </div>

        <div className="space-y-6">
          <ObituaryDraftSection
            writeOwnObituary={formData.writeOwnObituary}
            obituaryText={formData.obituaryText}
            obituaryDelegate={formData.obituaryDelegate}
            onChange={handleChange}
          />

          <EpitaphPreferencesSection
            wantsHeadstone={formData.wantsHeadstone}
            epitaphText={formData.epitaphText}
            onChange={handleChange}
          />

          <MemoryWishesSection
            memoryMessage={formData.memoryMessage}
            wantsMemoryTable={formData.wantsMemoryTable}
            wantsVideoMessage={formData.wantsVideoMessage}
            memoryGiftIdeas={formData.memoryGiftIdeas}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-between mt-8">
          <Button
            onClick={onPrevious}
            variant="outline"
            className="px-6"
          >
            ← Previous
          </Button>
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
        </div>
      </div>
    </div>
  );
};

export default ObituaryMemoryWishesForm;