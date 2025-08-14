import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { Lightbulb, Upload, File, X, CheckCircle, Gift, Star } from 'lucide-react';
// import { FileUploadService, UploadedFile } from '@/lib/fileUploadService'; // Temporarily disabled
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useDatabaseSync } from '@/lib/databaseSync';

interface FeedbackFormProps {
  onSubmissionSuccess?: () => void;
}

const ImprovementFeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmissionSuccess }) => {
  const { user } = useAuth();
  const { syncForm } = useDatabaseSync();
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [implementationSuggestion, setImplementationSuggestion] = useState('');
  const [priority, setPriority] = useState('medium');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [consentForContact, setConsentForContact] = useState(false);
  const [consentForImplementation, setConsentForImplementation] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryOptions = [
    { value: 'ui_ux', label: 'User Interface & Experience', description: 'Design, layout, navigation improvements' },
    { value: 'features', label: 'New Features', description: 'Functionality that doesn\'t exist yet' },
    { value: 'performance', label: 'Performance', description: 'Speed, loading times, responsiveness' },
    { value: 'content', label: 'Content & Guidance', description: 'Better instructions, help text, audio guides' },
    { value: 'accessibility', label: 'Accessibility', description: 'Making the app more accessible to all users' },
    { value: 'security', label: 'Security & Privacy', description: 'Data protection and security improvements' },
    { value: 'other', label: 'Other', description: 'Something not covered by the above categories' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', description: 'Nice to have' },
    { value: 'medium', label: 'Medium', description: 'Would improve experience' },
    { value: 'high', label: 'High', description: 'Important improvement' },
    { value: 'critical', label: 'Critical', description: 'Essential for usability' }
  ];

  // File upload functionality temporarily disabled
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // File upload functionality temporarily disabled
    toast({
      title: "File Upload Disabled",
      description: "File upload functionality is temporarily unavailable",
    });
  };

  const handleRemoveFile = async (fileId: string) => {
    // File removal functionality temporarily disabled
    toast({
      title: "File Removal Disabled",
      description: "File removal functionality is temporarily unavailable",
    });
  };

  const handleSubmit = async () => {
    if (!category || !title || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackId = `FB-${Date.now()}`;
      
      // Submit feedback to database
      const { data, error } = await supabase
        .from('feedback_submissions')
        .insert({
          user_id: user?.id || null,
          feedback_id: feedbackId,
          category,
          title,
          description,
          implementation_suggestion: implementationSuggestion || null,
          priority_level: priority,
          consent_for_contact: consentForContact,
          consent_for_implementation: consentForImplementation,
          contact_email: contactEmail || null,
          contact_name: contactName || null,
          reward_eligible: consentForImplementation, // Only eligible if they consent to implementation
          status: 'submitted'
        })
        .select()
        .single();

      if (error) {
        console.error('Error submitting feedback:', error);
        toast({
          title: "Submission Failed",
          description: "Failed to submit feedback. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // File upload functionality temporarily disabled

      // Store submission in database for immediate UI updates
      if (user?.email) {
        try {
          await syncForm(user.email, 'latestFeedbackSubmission', {
            feedbackId,
            submittedAt: new Date().toISOString(),
            category,
            title,
            rewardEligible: consentForImplementation
          });
        } catch (error) {
          console.error('Error saving feedback submission to database:', error);
        }
      }

      setSubmitted(true);
      
      toast({
        title: "Feedback Submitted Successfully!",
        description: `Thank you for your suggestion (${feedbackId}). If implemented, you'll receive 2 months free service!`,
      });

      if (onSubmissionSuccess) {
        onSubmissionSuccess();
      }

    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCategory('');
    setTitle('');
    setDescription('');
    setImplementationSuggestion('');
    setPriority('medium');
    setContactName('');
    setContactEmail(user?.email || '');
    setConsentForContact(false);
    setConsentForImplementation(true);
    // setUploadedFiles([]); // File upload functionality temporarily disabled
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Thank You for Your Feedback!
          </h3>
          <p className="text-green-700 mb-4">
            Your improvement suggestion has been submitted and will be reviewed by our development team.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gift className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">Reward Opportunity</span>
            </div>
            <p className="text-sm text-yellow-700">
              If we implement your suggestion, you'll receive <strong>2 months of free service</strong> as a thank you!
            </p>
          </div>
          <Button onClick={resetForm} variant="outline" className="mt-4">
            Submit Another Suggestion
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold" style={{ color: '#153A4B' }}>
          <Lightbulb className="h-5 w-5" />
          Help Us Improve The Grand Finale
        </CardTitle>
        <p className="text-gray-600">
          Your suggestions help us create a better experience for everyone. 
          If we implement your idea, you'll receive <strong>2 months of free service</strong> as our thanks!
        </p>
      </CardHeader>
      <CardContent>
        {!submitted ? (
          <div className="space-y-6">
            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                What type of improvement would you like to suggest? *
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a category..." />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Brief title for your suggestion *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Add dark mode option, Improve navigation menu..."
                className="w-full"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Describe your suggestion in detail *
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What specific improvement would you like to see? What problem does it solve?"
                className="min-h-[100px] w-full"
              />
            </div>

            {/* Implementation Suggestion */}
            <div className="space-y-2">
              <Label htmlFor="implementation" className="text-sm font-medium">
                How do you think this could be implemented? (Optional)
              </Label>
              <Textarea
                id="implementation"
                value={implementationSuggestion}
                onChange={(e) => setImplementationSuggestion(e.target.value)}
                placeholder="Any ideas on how we could build this feature or improvement?"
                className="min-h-[80px] w-full"
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                How important is this to you?
              </Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority..." />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Upload - Temporarily Disabled */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Attach files (Temporarily Unavailable)
              </Label>
              <p className="text-xs text-gray-500">
                File upload functionality is temporarily disabled. You can still submit your feedback without attachments.
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">
                    File upload temporarily unavailable
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm" style={{ color: '#153A4B' }}>
                Contact Information (for reward eligibility)
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName" className="text-sm">
                    Your name
                  </Label>
                  <Input
                    id="contactName"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-sm">
                    Email address
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Consent Checkboxes */}
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="contactConsent"
                  checked={consentForContact}
                  onCheckedChange={(checked) => setConsentForContact(checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="contactConsent"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Yes, you may contact me about this suggestion
                  </Label>
                  <p className="text-xs text-gray-500">
                    We may reach out to clarify details or notify you if your suggestion is implemented
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="implementationConsent"
                  checked={consentForImplementation}
                  onCheckedChange={(checked) => setConsentForImplementation(checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="implementationConsent"
                    className="text-sm font-normal cursor-pointer"
                  >
                    I agree that if this suggestion is implemented, I'll receive 2 months of free service
                  </Label>
                  <p className="text-xs text-gray-500">
                    By checking this, you're eligible for our reward program
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSubmit}
                disabled={!category || !title || !description || isSubmitting}
                className="px-8"
                style={{ backgroundColor: '#153A4B' }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
              </Button>
            </div>
          </div>
        ) : (
          // Success State
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#153A4B' }}>
                Thank You for Your Suggestion!
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Your feedback has been submitted successfully. We'll review it carefully and 
                if we implement your idea, you'll receive 2 months of free service!
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
              <Gift className="h-4 w-4" />
              <span>Reward eligible • We'll contact you if implemented</span>
            </div>
            
            <Button
              onClick={() => setSubmitted(false)}
              variant="outline"
              className="mt-6"
            >
              Submit Another Suggestion
            </Button>
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default ImprovementFeedbackForm;
