import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import CompletionChecklistSection from './forms/CompletionChecklistSection';
import FinalReflectionSection from './forms/FinalReflectionSection';
import DigitalSignatureSection from './forms/DigitalSignatureSection';
import { CheckCircle2, Save } from 'lucide-react';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';

interface FinalChecklistFormProps {
  onNext?: () => void;
  onPrevious?: () => void;
}

const FinalChecklistForm: React.FC<FinalChecklistFormProps> = ({ onNext, onPrevious }) => {
  const { toast } = useToast();
  const [completionStatus, setCompletionStatus] = useState({
    completed_personal_info: false,
    completed_medical_info: false,
    completed_legal_financial: false,
    completed_funeral_wishes: false,
    completed_digital_assets: false,
    completed_messages: false,
    completed_letters: false,
    completed_documents: false,
    completed_legacy: false
  });
  const [closingNotes, setClosingNotes] = useState('');
  const [finalInstructions, setFinalInstructions] = useState('');
  const [signatureName, setSignatureName] = useState('');
  const [signatureDate, setSignatureDate] = useState(new Date().toISOString().split('T')[0]);
  const [signatureConsent, setSignatureConsent] = useState(false);
  const { user } = useAuth();
  const { syncForm } = useDatabaseSync();

  useEffect(() => {
    // Load from localStorage for now, will be replaced with database loading
    const savedData = localStorage.getItem('final_checklist');
    if (savedData) {
      const data = JSON.parse(savedData);
      setCompletionStatus(data.completionStatus || completionStatus);
      setClosingNotes(data.closingNotes || '');
      setFinalInstructions(data.finalInstructions || '');
      setSignatureName(data.signatureName || '');
      setSignatureDate(data.signatureDate || new Date().toISOString().split('T')[0]);
      setSignatureConsent(data.signatureConsent || false);
    }
  }, []);

  const handleToggleCompletion = (field: string, value: boolean) => {
    setCompletionStatus(prev => ({ ...prev, [field]: value }));
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

    const formData = {
      completionStatus,
      closingNotes,
      finalInstructions,
      signatureName,
      signatureDate,
      signatureConsent,
      user_id: 'current_user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      await syncForm(user.email, 'finalChecklistData', formData);
      
      toast({
        title: "Final checklist saved!",
        description: "Your final checklist and wrap-up information has been saved to database.",
      });

      if (onNext) {
        onNext();
      }
    } catch (error) {
      console.error('Error saving final checklist:', error);
      toast({
        title: "Error",
        description: "Failed to save to database. Please try again.",
        variant: "destructive",
      });
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Final Checklist & Wrap-Up
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Review your progress and add any final thoughts before completing your legacy documentation.
            </p>
          </CardHeader>
        </Card>

        <div className="space-y-8">
          <CompletionChecklistSection
            completionStatus={completionStatus}
            onToggle={handleToggleCompletion}
          />

          <FinalReflectionSection
            closingNotes={closingNotes}
            finalInstructions={finalInstructions}
            onClosingNotesChange={setClosingNotes}
            onFinalInstructionsChange={setFinalInstructions}
          />

          <DigitalSignatureSection
            signatureName={signatureName}
            signatureDate={signatureDate}
            signatureConsent={signatureConsent}
            onSignatureNameChange={setSignatureName}
            onSignatureDateChange={setSignatureDate}
            onSignatureConsentChange={setSignatureConsent}
          />
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={onPrevious}
            className="px-6"
          >
            Previous
          </Button>
          <Button
            onClick={handleSave}
            className="px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save & Exit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinalChecklistForm;