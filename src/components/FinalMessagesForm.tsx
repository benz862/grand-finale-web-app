import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import LetterCard from './forms/LetterCard';
import LegacyMessageSection from './forms/LegacyMessageSection';

interface LetterData {
  id: string;
  recipient_name: string;
  recipient_relationship: string;
  delivery_method: string;
  delivery_method_other: string;
  letter_content: string;
  share_publicly: string;
}

interface LegacyMessageData {
  legacy_message: string;
}

interface FinalMessagesFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

const FinalMessagesForm: React.FC<FinalMessagesFormProps> = ({ onNext, onPrevious }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { syncForm } = useDatabaseSync();
  const [letters, setLetters] = useState<LetterData[]>([]);
  const [legacyMessage, setLegacyMessage] = useState<LegacyMessageData>({
    legacy_message: ''
  });

  useEffect(() => {
    const savedLetters = localStorage.getItem('final_letters');
    const savedMessage = localStorage.getItem('final_message');
    
    if (savedLetters) {
      setLetters(JSON.parse(savedLetters));
    }
    if (savedMessage) {
      setLegacyMessage(JSON.parse(savedMessage));
    }
  }, []);

  const createNewLetter = (): LetterData => ({
    id: Date.now().toString(),
    recipient_name: '',
    recipient_relationship: '',
    delivery_method: '',
    delivery_method_other: '',
    letter_content: '',
          share_publicly: 'No'
  });

  const addLetter = () => {
    const newLetter = createNewLetter();
    setLetters([...letters, newLetter]);
  };

  const updateLetter = (id: string, field: string, value: string) => {
    setLetters(letters.map(letter => 
      letter.id === id ? { ...letter, [field]: value } : letter
    ));
  };

  const deleteLetter = (id: string) => {
    setLetters(letters.filter(letter => letter.id !== id));
  };

  const updateLegacyMessage = (field: string, value: string) => {
    setLegacyMessage({ ...legacyMessage, [field]: value });
  };

  const validateForm = () => {
    for (const letter of letters) {
      if (!letter.recipient_name.trim()) {
        toast({
          title: "Validation Error",
          description: "Please enter a recipient name for all letters.",
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    if (!user?.email) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your data.",
        variant: "destructive",
      });
      return;
    }

    const formData = {
      letters,
      legacyMessage
    };

    try {
      await syncForm(user.email, 'finalMessagesData', formData);
      
      toast({
        title: "Success",
        description: "Final messages and letters saved to database!",
      });
      
      onNext();
    } catch (error) {
      console.error('Error saving final messages:', error);
      toast({
        title: "Error",
        description: "Failed to save to database. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGeneratePDF = () => {
    // This function will be implemented in a future step
    toast({
      title: "PDF Generation",
      description: "PDF generation functionality is under development.",
      variant: "info"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📘 Final Messages & Letters
          </h1>
          <p className="text-lg text-gray-600">
            A secure and private space to leave behind personal letters, legacy messages, or final words for loved ones.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Letters to Specific People */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                  💌 Letters to Specific People
                </CardTitle>
                <p className="text-gray-600">
                  Create personal letters for specific individuals. Each letter is stored securely.
                </p>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={addLetter}
                  className="w-full mb-4"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Letter
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {letters.length === 0 ? (
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 text-center">
                      No letters created yet. Click "Add Another Letter" to start.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                letters.map((letter) => (
                  <LetterCard
                    key={letter.id}
                    letter={letter}
                    onUpdate={updateLetter}
                    onDelete={deleteLetter}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Panel - General Legacy Message */}
          <div>
            <LegacyMessageSection
              data={legacyMessage}
              onUpdate={updateLegacyMessage}
            />
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

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={onPrevious}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous: Digital Assets
          </Button>
          
          <Button
            onClick={handleSave}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Save & Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinalMessagesForm;