import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

interface FormProps {
  onNext?: () => void;
  onPrevious?: () => void;
}

const SimpleForm: React.FC<FormProps & { title: string; description: string; placeholder: string }> = ({ 
  onNext, onPrevious, title, description, placeholder 
}) => (
  <div className="space-y-6">
    <Card className="neumorphic-card">
      <CardHeader>
        <CardTitle className="text-2xl font-serif text-primary">{title}</CardTitle>
        <CardDescription className="text-subtext leading-relaxed">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Information</Label>
          <Textarea placeholder={placeholder} className="min-h-[200px] resize-none" />
        </div>
      </CardContent>
    </Card>
    <div className="flex justify-between sticky bottom-0 bg-background/80 backdrop-blur-sm p-4 rounded-lg">
      {onPrevious && (
        <Button onClick={onPrevious} variant="skillbinder" className="skillbinder flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" /><span>Previous</span>
        </Button>
      )}
      <div className="text-sm text-muted-foreground self-center">You're doing great — just a few more steps</div>
      {onNext && (
        <Button onClick={onNext} className="flex items-center space-x-2 bg-action hover:bg-action/90">
          <span>Save & Continue</span><ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  </div>
);

export const InsuranceInfoForm: React.FC<FormProps> = (props) => (
  <SimpleForm {...props} title="Insurance Information" description="Please provide your insurance details." placeholder="Enter insurance information..." />
);

export const LegalDocumentsForm: React.FC<FormProps> = (props) => (
  <SimpleForm {...props} title="Legal Documents" description="Document your legal papers and wills." placeholder="Enter legal document information..." />
);

export const FuneralPreferencesForm: React.FC<FormProps> = (props) => (
  <SimpleForm {...props} title="Funeral Preferences" description="Your end-of-life service preferences." placeholder="Enter funeral preferences..." />
);

export const PetCareSurvivorsForm: React.FC<FormProps> = (props) => (
  <SimpleForm {...props} title="Pet Care & Survivors" description="Pet care and survivor information." placeholder="Enter pet and survivor information..." />
);

export const DigitalAssetsForm: React.FC<FormProps> = (props) => (
  <SimpleForm {...props} title="Digital Assets" description="Online accounts and digital property." placeholder="Enter digital asset information..." />
);

export const FinalMessagesForm: React.FC<FormProps> = (props) => (
  <SimpleForm {...props} title="Final Messages" description="Personal messages and letters." placeholder="Enter final messages..." />
);

export const KeyDocumentsForm: React.FC<FormProps> = (props) => (
  <SimpleForm {...props} title="Key Documents" description="Important document locations." placeholder="Enter document locations..." />
);

export const ObituaryMemoryWishesForm: React.FC<FormProps> = (props) => (
  <SimpleForm {...props} title="Obituary & Memory Wishes" description="Memorial preferences and wishes." placeholder="Enter obituary and memory wishes..." />
);

export const PersonalMessagesForm: React.FC<FormProps> = (props) => (
  <SimpleForm {...props} title="Personal Messages" description="Individual messages to loved ones." placeholder="Enter personal messages..." />
);

export const TransitionNotesForm: React.FC<FormProps> = (props) => (
  <SimpleForm {...props} title="Transition Notes" description="Guidance for life transitions." placeholder="Enter transition notes..." />
);

export const FinalChecklistForm: React.FC<{ onPrevious: () => void }> = ({ onPrevious }) => (
  <SimpleForm onPrevious={onPrevious} title="Final Checklist" description="Review and completion checklist." placeholder="Review your information..." />
);