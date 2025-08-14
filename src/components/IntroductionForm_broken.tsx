import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight } from 'lucide-react';

interface IntroductionFormProps {
  onNext: () => void;
}

const IntroductionForm: React.FC<IntroductionFormProps> = ({ onNext }) => {
  const [hasReadIntroduction, setHasReadIntroduction] = useState(false);
  const { user } = useAuth();
  const { syncForm } = useDatabaseSync();

  useEffect(() => {
    // Load from localStorage for now, will be replaced with database loading
    const saved = localStorage.getItem('introductionRead');
    if (saved === 'true') {
      setHasReadIntroduction(true);
    }
  }, []);

  const handleContinue = async () => {
    if (user?.email) {
      try {
        await syncForm(user.email, 'introductionRead', { read: true, timestamp: new Date().toISOString() });
      } catch (error) {
        console.error('Error saving introduction read status:', error);
      }
    }
    setHasReadIntroduction(true);
    onNext();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Card */}
        <Card className="mb-8 bg-white shadow-lg border-2 border-skillbinder-blue">
          <CardHeader className="text-center bg-gradient-to-r from-skillbinder-blue to-blue-700 text-white rounded-t-lg">
            <div className="mb-6">
              <img 
                src="/Long_logo_The_Grand_Finale.png" 
                alt="The Grand Finale - A well-planned goodbye starts here" 
                className="mx-auto h-32 w-auto object-contain"
              />
            </div>
            <CardTitle className="text-3xl font-bold mb-4">Welcome to The Grand Finale</CardTitle>
            <p className="text-xl leading-relaxed">
              A guided web app that helps you prepare the most meaningful goodbye.
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed space-y-4">
              <p>This isn't about death. It's about life — and how to honor it, protect it, and preserve it for those who love you most.</p>
              <p>This platform walks you through every step of legacy planning with empathy, simplicity, and clarity.</p>
              
              <div className="my-8 p-6 bg-blue-50 rounded-lg border-l-4 border-skillbinder-blue">
                <h3 className="text-xl font-semibold mb-4 text-skillbinder-blue">What You'll Accomplish</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Create a comprehensive personal legacy plan</li>
                  <li>• Organize important documents and information</li>
                  <li>• Ensure your loved ones are prepared and informed</li>
                  <li>• Leave behind a meaningful goodbye message</li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h4 className="text-lg font-semibold mb-3 text-green-800">🔒 Your Privacy</h4>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• Your data is encrypted and secure</li>
                    <li>• Only you can access your information</li>
                    <li>• Export to PDF anytime</li>
                    <li>• Save progress automatically</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h4 className="text-lg font-semibold mb-3 text-purple-800">⏰ Take Your Time</h4>
                  <ul className="space-y-1 text-sm text-purple-700">
                    <li>• Complete sections at your own pace</li>
                    <li>• Return anytime to make updates</li>
                    <li>• No pressure or time limits</li>
                    <li>• Guidance every step of the way</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Card */}
        <Card className="bg-white shadow-lg border-2 border-skillbinder-yellow">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4 text-skillbinder-blue">
              Ready to Begin Your Legacy Planning Journey?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
              Take your time with each section. You can save your progress and return at any time.
              This is your story, your legacy, and your gift to those who matter most.
            </p>
            
            <Button
              onClick={handleContinue}
              variant="skillbinder_yellow"
              size="lg"
              className="skillbinder_yellow px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Begin My Legacy Planning <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default IntroductionForm;
