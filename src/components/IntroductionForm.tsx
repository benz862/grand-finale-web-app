import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import AudioPlayer from './AudioPlayer';

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
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="mb-2">
              <img 
                src="/Long_logo_The_Grand_Finale.png" 
                alt="The Grand Finale - A well-planned goodbye starts here" 
                className="mx-auto h-52 w-auto object-contain"
              />
            </div>
            <CardTitle className="font-bold text-skillbinder-yellow text-3xl">TESTING - UPDATED VERSION</CardTitle>
            <p className="text-lg text-skillbinder-blue">
              Start your journey by listening to this introduction
            </p>
            <AudioPlayer audioFile="Introduction.mp3" size="md" sectionNumber={0} />
            <div className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed space-y-4 mt-6">
              <p>
                A guided web app that helps you prepare the most meaningful goodbye.
              </p>
              <p>
                This isn't about death. It's about life — and how to honour it, protect it, and preserve it for those who love you most.
              </p>
              <p>
                This platform walks you through every step of legacy planning with empathy, simplicity, and clarity. By the end, you'll have created something truly powerful: a complete, organized record of your life's important details — and a message of love, wisdom, and peace for those you care about.
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold" style={{ color: '#153A4B' }}>
                What This App Helps You Do
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700">
                Use this app to gather and organize all the personal, financial, legal, and final wishes your loved ones may need in the future:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Personal and medical information</li>
                <li>• Legal documents and estate planning</li>
                <li>• Financial and business accounts</li>
                <li>• Digital assets and online access</li>
                <li>• Final wishes and funeral preferences</li>
                <li>• Messages and letters to loved ones</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold" style={{ color: '#153A4B' }}>
                Privacy & Security You Can Trust
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
                <li>• Export to PDF for easy sharing with loved ones</li>
                <li>• User authentication keeps your data secure</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold" style={{ color: '#153A4B' }}>
                For Your Loved Ones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700">
                You're creating a roadmap for your family — one that brings peace of mind and clarity during difficult moments.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Clear guidance and instructions</li>
                <li>• Critical contacts and emergency details</li>
                <li>• Account and password access</li>
                <li>• Final wishes and personal notes</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold" style={{ color: '#153A4B' }}>
                Your Legacy, Your Voice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700">
                This is more than information. It's how you'll be remembered.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Share your values, dreams, and life lessons</li>
                <li>• Preserve traditions and stories</li>
                <li>• Leave messages of love and comfort</li>
                <li>• Be remembered for how you lived, not just what you owned</li>
              </ul>
            </CardContent>
          </Card>

        </div>

        {/* Call to Action Card */}
        <Card>
          <CardContent className="text-center p-8">
            <h3 className="text-lg font-semibold mb-3" style={{ color: '#153A4B' }}>
              Ready to Begin Your Legacy Planning Journey?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Take your time with each section. You can save your progress and return at any time. This isn't a race — it's a gift of intention, reflection, and love.
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