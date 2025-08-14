import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, ArrowRight, Plus, Trash2, Flag } from 'lucide-react';
import { generatePDF } from '../lib/pdfGenerator';
import { useLocalization } from '../contexts/LocalizationContext';
import AudioPlayer from './AudioPlayer';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useTrial } from '@/contexts/TrialContext';

// AI Letter Generation Function with Canadian/American spelling awareness
const generateAILetter = async (
  recipients: string, 
  purpose: string, 
  memories: string, 
  tone: string = 'heartfelt',
  useCanadianSpelling: boolean = false
) => {
  const memoryContext = memories.trim() ? `Include these specific memories and experiences we've shared: ${memories}. Weave these memories naturally into the letter to make it personal and meaningful.` : '';
  
  const spellingInstruction = useCanadianSpelling 
    ? 'IMPORTANT: Use Canadian/British spelling throughout (honour, colour, realise, centre, defence, etc.). This letter is for a Canadian recipient.'
    : 'Use American spelling throughout (honor, color, realize, center, defense, etc.).';
  
  const prompts = {
    heartfelt: `Write a heartfelt, loving letter to ${recipients} about ${purpose}. Make it warm, personal, and emotionally touching. Include expressions of love, gratitude, and meaningful memories. ${memoryContext} ${spellingInstruction}`,
    formal: `Write a formal, respectful letter to ${recipients} about ${purpose}. Keep it professional while being warm and appropriate for the relationship. ${memoryContext} ${spellingInstruction}`,
    apologetic: `Write a sincere apology letter to ${recipients} about ${purpose}. Express genuine remorse, take responsibility, and show commitment to making things right. ${memoryContext} ${spellingInstruction}`,
    angry: `Write a direct, honest letter to ${recipients} about ${purpose}. Express frustration and disappointment clearly, but maintain dignity and avoid being overly harsh. ${memoryContext} ${spellingInstruction}`,
    neutral: `Write a balanced, honest letter to ${recipients} about ${purpose}. Be truthful and direct while remaining respectful and fair. ${memoryContext} ${spellingInstruction}`
  };

  const prompt = prompts[tone as keyof typeof prompts] || prompts.heartfelt;
  
  try {
    // Simulate AI generation with a realistic response
    // In a real implementation, this would call an actual AI API
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
    
    const sampleLetters = {
      heartfelt: `Dear ${recipients},

I wanted to take a moment to write this letter to you, as there are so many things I've been meaning to say but haven't found the right words for.

${purpose} has been on my mind a lot lately, and I realize how much you mean to me. You've been such an important part of my life, and I want you to know how deeply I appreciate everything you've done for me.

${memories.trim() ? `I remember all the wonderful times we've shared together - ${memories}. These memories are precious to me, and I carry them with me always. Each moment we've spent together has shaped our relationship in ways I'm so grateful for.` : 'I remember all the times you\'ve been there for me - the good times we\'ve shared, the challenges we\'ve faced together, and the countless ways you\'ve shown your love and support. Those memories are precious to me, and I carry them with me always.'}

I want you to know that you've made a profound difference in my life. Your kindness, your wisdom, and your love have shaped who I am today. I'm so grateful to have you in my life.

Please know that no matter what happens, my love for you will always remain. You are truly special to me, and I want you to remember that.

With all my love and gratitude,
[Your name]`,
      
      formal: `Dear ${recipients},

I hope this letter finds you well. I am writing to address the matter of ${purpose}, which I believe requires our attention and discussion.

I want to express my sincere appreciation for our relationship and the mutual respect we have shared. It is important to me that we handle this situation with the dignity and consideration it deserves.

I believe that open and honest communication is essential in any meaningful relationship, and I hope this letter serves as a step toward that goal. I value our connection and want to ensure that we can move forward in a positive direction.

Thank you for taking the time to read this letter. I look forward to our continued relationship and any opportunity to strengthen our bond.

Sincerely,
[Your name]`,
      
      apologetic: `Dear ${recipients},

I am writing this letter to sincerely apologize for ${purpose}. I know that my actions have caused you pain and disappointment, and I take full responsibility for that.

I want you to know that I deeply regret what happened and the impact it has had on you. I understand that trust is precious and that I have damaged that trust through my behavior.

I am committed to making things right and to rebuilding our relationship. I know that words alone are not enough, and I am prepared to take the necessary steps to demonstrate my sincerity and commitment to change.

I value our relationship more than I can express, and I hope that you can find it in your heart to forgive me. I promise to do better and to be more mindful of how my actions affect those I care about.

With sincere regret and hope for reconciliation,
[Your name]`,
      
      angry: `Dear ${recipients},

I am writing this letter because I need to be honest with you about ${purpose}. I have been deeply hurt and disappointed by what has happened, and I cannot continue to pretend that everything is fine.

I want you to know that I am frustrated and angry about this situation. I feel that my trust has been betrayed and that my feelings have been disregarded. This is not how I expected to be treated by someone I care about.

I am not writing this letter to be cruel or to cause you pain, but I need to be direct about how I feel. I believe that honesty is essential, even when it's difficult.

I hope that you can understand my perspective and that we can work toward resolving this situation. However, I need you to know that things cannot continue as they have been.

Sincerely,
[Your name]`,
      
      neutral: `Dear ${recipients},

I am writing to you about ${purpose}. I believe it's important that we address this matter openly and honestly, as it affects our relationship and our future.

I want to be clear about my feelings and my perspective on this situation. I believe that we both have valid points of view, and I hope that we can find a way to understand each other better.

I value our relationship and want to ensure that we can move forward in a positive way. I believe that honest communication is the best path forward, even when it's challenging.

I hope that you will consider my perspective, and I am open to hearing yours as well. Together, I believe we can find a resolution that works for both of us.

Sincerely,
[Your name]`
    };

    const selectedLetter = sampleLetters[tone as keyof typeof sampleLetters] || sampleLetters.heartfelt;
    
    // Apply localization if Canadian spelling is requested
    if (useCanadianSpelling) {
      // Import the direct function for manual override
      const { localizeText: directLocalizeText } = await import('../lib/localization');
      return directLocalizeText(selectedLetter, true); // Force Canadian spelling
    }
    
    return selectedLetter;
  } catch (error) {
    throw new Error('Failed to generate letter. Please try again.');
  }
};

interface FamilyLetter {
  id: string;
  recipients: string;
  purpose: string;
  letterType: string; // 'existing' or 'generate'
  completed: string;
  location: string;
  letterContent: string; // For generated letters
  memories: string; // Memories and experiences with the person
}

interface FormalLettersData {
  // Letter to Executor
  executorLetterWritten: string;
  executorLetterLocation: string;
  executorNotes: string;
  
  // Letter to Legal or Financial Advisor
  advisorName: string;
  advisorLetterWritten: string;
  advisorLetterLocation: string;
  advisorNotes: string;
  
  // Letter to Healthcare Proxy
  proxyName: string;
  proxyLetterWritten: string;
  proxyLetterLocation: string;
  proxyNotes: string;
  
  // Letter to Family or Loved Ones (repeatable)
  familyLetters: FamilyLetter[];
}

interface FormalLettersFormProps {
  onNext: () => void;
  onPrevious: () => void;
  initialData?: Partial<FormalLettersData>;
}

const FormalLettersForm: React.FC<FormalLettersFormProps> = ({
  onNext,
  onPrevious,
  initialData = {}
}) => {
  const { isCanadian, localizeText } = useLocalization();
  const { syncForm } = useDatabaseSync();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { userTier, isTrial } = useTrial();
  const [isGenerating, setIsGenerating] = useState<{ [key: string]: boolean }>({});
  const [forceCanadianSpelling, setForceCanadianSpelling] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState<FormalLettersData>({
    executorLetterWritten: initialData.executorLetterWritten || '',
    executorLetterLocation: initialData.executorLetterLocation || '',
    executorNotes: initialData.executorNotes || '',
    advisorName: initialData.advisorName || '',
    advisorLetterWritten: initialData.advisorLetterWritten || '',
    advisorLetterLocation: initialData.advisorLetterLocation || '',
    advisorNotes: initialData.advisorNotes || '',
    proxyName: initialData.proxyName || '',
    proxyLetterWritten: initialData.proxyLetterWritten || '',
    proxyLetterLocation: initialData.proxyLetterLocation || '',
    proxyNotes: initialData.proxyNotes || '',
    familyLetters: initialData.familyLetters || [{ id: '1', recipients: '', purpose: '', letterType: 'existing', completed: '', location: '', letterContent: '', memories: '' }]
  });

  const handleFieldChange = (field: keyof FormalLettersData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Family Letters functions
  const addFamilyLetter = () => {
    const newLetter: FamilyLetter = {
      id: Date.now().toString(),
      recipients: '',
      purpose: '',
      letterType: 'existing',
      completed: '',
      location: '',
      letterContent: '',
      memories: ''
    };
    setFormData(prev => ({
      ...prev,
      familyLetters: [...prev.familyLetters, newLetter]
    }));
  };

  const updateFamilyLetter = (id: string, field: keyof FamilyLetter, value: string) => {
    setFormData(prev => ({
      ...prev,
      familyLetters: prev.familyLetters.map(letter =>
        letter.id === id ? { ...letter, [field]: value } : letter
      )
    }));
  };

  const removeFamilyLetter = (id: string) => {
    if (formData.familyLetters.length > 1) {
      setFormData(prev => ({
        ...prev,
        familyLetters: prev.familyLetters.filter(letter => letter.id !== id)
      }));
    }
  };

  // AI Letter Generation
  const handleGenerateAILetter = async (letterId: string) => {
    const letter = formData.familyLetters.find(l => l.id === letterId);
    if (!letter || !letter.recipients || !letter.purpose) {
      alert('Please fill in both Recipients and Purpose before generating a letter.');
      return;
    }

    setIsGenerating(prev => ({ ...prev, [letterId]: true }));
    
    try {
      // Determine spelling preference: manual override or automatic detection
      const useCanadianSpelling = forceCanadianSpelling[letterId] !== undefined 
        ? forceCanadianSpelling[letterId] 
        : isCanadian;
        
      const generatedContent = await generateAILetter(
        letter.recipients, 
        letter.purpose, 
        letter.memories, 
        'heartfelt', // default tone
        useCanadianSpelling
      );
      updateFamilyLetter(letterId, 'letterContent', generatedContent);
    } catch (error) {
      alert('Failed to generate letter. Please try again.');
    } finally {
      setIsGenerating(prev => ({ ...prev, [letterId]: false }));
    }
  };

  // Toggle Canadian spelling preference for a specific letter
  const toggleCanadianSpelling = (letterId: string) => {
    setForceCanadianSpelling(prev => ({
      ...prev,
      [letterId]: prev[letterId] !== undefined ? !prev[letterId] : !isCanadian
    }));
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
      await syncForm(user.email, 'formalLettersData', dataToSave);
      
      toast({
        title: "Success",
        description: "Formal letters saved to database!",
      });
      
      onNext();
    } catch (error) {
      console.error('Error saving formal letters:', error);
      toast({
        title: "Error",
        description: "Failed to save to database. Please try again.",
        variant: "destructive",
      });
    }
  };

  // PDF generation handler
  const handleGeneratePDF = () => {
    generatePDF({
      sectionTitle: 'Formal Letters',
      data: formData,
      formType: 'formalLetters',
      userInfo: {
        firstName: (user as any)?.user_metadata?.first_name || user?.email?.split('@')[0] || '',
        lastName: (user as any)?.user_metadata?.last_name || '',
        email: user?.email || ''
      },
      userTier: isTrial ? 'Trial' : 'Standard',
      isTrial: isTrial
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-bold" style={{ color: '#E4B64A', fontSize: '28px' }}>Formal Letters</CardTitle>
        <p className="text-lg" style={{ color: '#153A4B' }}>
          Preparing important documentation for the people who matter.
        </p>
        <AudioPlayer audioFile="Section_15.mp3" size="md" sectionNumber={15} />
      </CardHeader>
      <CardContent>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <Accordion type="single" collapsible className="mb-6">
            {/* Letter to Executor */}
            <AccordionItem value="letter-executor">
              <AccordionTrigger style={{ color: '#000000' }}>Letter to Executor</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Have You Written This Letter?</Label>
                      <RadioGroup value={formData.executorLetterWritten} onValueChange={(value) => handleFieldChange('executorLetterWritten', value)}>
                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="Yes" id="executor-yes" />
                <Label htmlFor="executor-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="executor-no" />
                          <Label htmlFor="executor-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label htmlFor="executor-letter-location">Location of Letter</Label>
                      <Input
                        id="executor-letter-location"
                        value={formData.executorLetterLocation}
                        onChange={(e) => handleFieldChange('executorLetterLocation', e.target.value)}
                        placeholder="Enter location of executor letter"
                      />
                    </div>
                    <div>
                      <Label htmlFor="executor-notes">Notes for Executor</Label>
                      <Textarea
                        id="executor-notes"
                        value={formData.executorNotes}
                        onChange={(e) => handleFieldChange('executorNotes', e.target.value)}
                        placeholder="Enter notes or instructions for executor"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Letter to Legal or Financial Advisor */}
            <AccordionItem value="letter-advisor">
              <AccordionTrigger style={{ color: '#000000' }}>Letter to Legal or Financial Advisor</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="advisor-name">Advisor Name</Label>
                      <Input
                        id="advisor-name"
                        value={formData.advisorName}
                        onChange={(e) => handleFieldChange('advisorName', e.target.value)}
                        placeholder="Enter advisor name"
                      />
                    </div>
                    <div>
                      <Label>Have You Written This Letter?</Label>
                      <RadioGroup value={formData.advisorLetterWritten} onValueChange={(value) => handleFieldChange('advisorLetterWritten', value)}>
                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="Yes" id="advisor-yes" />
                <Label htmlFor="advisor-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="advisor-no" />
                          <Label htmlFor="advisor-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label htmlFor="advisor-letter-location">Location of Letter</Label>
                      <Input
                        id="advisor-letter-location"
                        value={formData.advisorLetterLocation}
                        onChange={(e) => handleFieldChange('advisorLetterLocation', e.target.value)}
                        placeholder="Enter location of advisor letter"
                      />
                    </div>
                    <div>
                      <Label htmlFor="advisor-notes">Notes or Instructions</Label>
                      <Textarea
                        id="advisor-notes"
                        value={formData.advisorNotes}
                        onChange={(e) => handleFieldChange('advisorNotes', e.target.value)}
                        placeholder="Enter notes or instructions for advisor"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Letter to Healthcare Proxy */}
            <AccordionItem value="letter-proxy">
              <AccordionTrigger style={{ color: '#000000' }}>Letter to Healthcare Proxy</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="proxy-name">Proxy Name</Label>
                      <Input
                        id="proxy-name"
                        value={formData.proxyName}
                        onChange={(e) => handleFieldChange('proxyName', e.target.value)}
                        placeholder="Enter healthcare proxy name"
                      />
                    </div>
                    <div>
                      <Label>Have You Written This Letter?</Label>
                      <RadioGroup value={formData.proxyLetterWritten} onValueChange={(value) => handleFieldChange('proxyLetterWritten', value)}>
                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="Yes" id="proxy-yes" />
                <Label htmlFor="proxy-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="proxy-no" />
                          <Label htmlFor="proxy-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label htmlFor="proxy-letter-location">Location of Letter</Label>
                      <Input
                        id="proxy-letter-location"
                        value={formData.proxyLetterLocation}
                        onChange={(e) => handleFieldChange('proxyLetterLocation', e.target.value)}
                        placeholder="Enter location of healthcare proxy letter"
                      />
                    </div>
                    <div>
                      <Label htmlFor="proxy-notes">Notes or Instructions</Label>
                      <Textarea
                        id="proxy-notes"
                        value={formData.proxyNotes}
                        onChange={(e) => handleFieldChange('proxyNotes', e.target.value)}
                        placeholder="Enter notes or instructions for healthcare proxy"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Letter to Family or Loved Ones */}
            <AccordionItem value="letter-family">
              <AccordionTrigger style={{ color: '#000000' }}>Letter to Family or Loved Ones</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.familyLetters.map((letter, index) => (
                      <div key={letter.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Letter {index + 1}</h4>
                          {formData.familyLetters.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFamilyLetter(letter.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`family-recipients-${letter.id}`}>Recipient(s)</Label>
                            <Input
                              id={`family-recipients-${letter.id}`}
                              value={letter.recipients}
                              onChange={(e) => updateFamilyLetter(letter.id, 'recipients', e.target.value)}
                              placeholder="Enter recipient names"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`family-letter-purpose-${letter.id}`}>Purpose of Letter</Label>
                            <Select value={letter.purpose} onValueChange={(value) => updateFamilyLetter(letter.id, 'purpose', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select purpose of letter" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="goodbye">Goodbye</SelectItem>
                                <SelectItem value="appreciation">Appreciation</SelectItem>
                                <SelectItem value="apologies">Apologies</SelectItem>
                                <SelectItem value="personal-history">Personal History</SelectItem>
                                <SelectItem value="final-thoughts">Final Thoughts</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor={`family-memories-${letter.id}`}>Memories & Experiences (Optional)</Label>
                            <Textarea
                              id={`family-memories-${letter.id}`}
                              value={letter.memories}
                              onChange={(e) => updateFamilyLetter(letter.id, 'memories', e.target.value)}
                              placeholder="List specific memories, experiences, or moments you've shared (e.g., our trip to Paris, Sunday dinners, when you taught me to ride a bike, the time we got lost in the woods...)"
                              rows={3}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              These memories will be woven into your AI-generated letter to make it more personal and meaningful.
                            </p>
                          </div>
                          <div>
                            <Label>Letter Type</Label>
                            <RadioGroup value={letter.letterType} onValueChange={(value) => updateFamilyLetter(letter.id, 'letterType', value)}>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="existing" id={`letter-existing-${letter.id}`} />
                                <Label htmlFor={`letter-existing-${letter.id}`}>Locate Existing Letter</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="generate" id={`letter-generate-${letter.id}`} />
                                <Label htmlFor={`letter-generate-${letter.id}`}>Generate Letter on Screen</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          
                          {letter.letterType === 'existing' && (
                            <>
                              <div>
                                <Label>Letter Completed?</Label>
                                <RadioGroup value={letter.completed} onValueChange={(value) => updateFamilyLetter(letter.id, 'completed', value)}>
                                  <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="Yes" id={`family-yes-${letter.id}`} />
                <Label htmlFor={`family-yes-${letter.id}`}>Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id={`family-no-${letter.id}`} />
                                    <Label htmlFor={`family-no-${letter.id}`}>No</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                              <div>
                                <Label htmlFor={`family-letter-location-${letter.id}`}>Location</Label>
                                <Input
                                  id={`family-letter-location-${letter.id}`}
                                  value={letter.location}
                                  onChange={(e) => updateFamilyLetter(letter.id, 'location', e.target.value)}
                                  placeholder="Enter location of family letter"
                                />
                              </div>
                            </>
                          )}
                          
                          {letter.letterType === 'generate' && (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label htmlFor={`family-letter-content-${letter.id}`}>Letter Content</Label>
                                <div className="flex items-center gap-2">
                                  {/* Canadian Spelling Toggle */}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleCanadianSpelling(letter.id)}
                                    className={`flex items-center gap-1 px-2 py-1 rounded-md border ${
                                      (forceCanadianSpelling[letter.id] !== undefined 
                                        ? forceCanadianSpelling[letter.id] 
                                        : isCanadian)
                                        ? 'bg-red-50 border-red-200 text-red-700' 
                                        : 'bg-blue-50 border-blue-200 text-blue-700'
                                    }`}
                                    title={`Currently using ${
                                      (forceCanadianSpelling[letter.id] !== undefined 
                                        ? forceCanadianSpelling[letter.id] 
                                        : isCanadian) 
                                        ? 'Canadian' 
                                        : 'American'} spelling. Click to toggle.`}
                                  >
                                    <Flag className="w-4 h-4" />
                                    {(forceCanadianSpelling[letter.id] !== undefined 
                                      ? forceCanadianSpelling[letter.id] 
                                      : isCanadian) ? 'CA' : 'US'}
                                  </Button>
                                  
                                  {/* Generate AI Letter Button */}
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleGenerateAILetter(letter.id)}
                                    disabled={isGenerating[letter.id] || !letter.recipients || !letter.purpose}
                                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                  >
                                    {isGenerating[letter.id] ? (
                                      <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                        Generating...
                                      </>
                                    ) : (
                                      <>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Generate with AI
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <Textarea
                                id={`family-letter-content-${letter.id}`}
                                value={letter.letterContent}
                                onChange={(e) => updateFamilyLetter(letter.id, 'letterContent', e.target.value)}
                                placeholder="Write your letter content here, or click 'Generate with AI' to get started..."
                                rows={8}
                              />
                              {letter.letterContent && (
                                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                  <p className="font-medium mb-2">💡 Tips for personalizing your AI-generated letter:</p>
                                  <ul className="list-disc list-inside space-y-1">
                                    <li>Add specific memories or experiences you've shared</li>
                                    <li>Include personal details about your relationship</li>
                                    <li>Modify the tone to match your true feelings</li>
                                    <li>Add or remove sections to make it more personal</li>
                                    <li>Replace "[Your name]" with your actual signature</li>
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button type="button" onClick={addFamilyLetter} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Letter to Family or Loved Ones
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Save & Continue */}
          <div className="flex justify-between items-center mt-8">
            {onPrevious && (
              <Button variant="skillbinder" onClick={onPrevious} className="skillbinder">Previous</Button>
            )}
            <div className="flex gap-4">
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
              <Button type="submit" variant="skillbinder_yellow" className="skillbinder_yellow">Save & Continue</Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormalLettersForm; 