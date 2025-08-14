import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { generatePDF } from '../lib/pdfGenerator';
import AudioPlayer from './AudioPlayer';
import { useTrial } from '../contexts/TrialContext';

interface PlaceToVisit {
  id: string;
  place: string;
}

interface ProjectToComplete {
  id: string;
  project: string;
}

interface MessageUnsaid {
  id: string;
  toWhom: string;
  messageSummary: string;
}

interface HopeForFamily {
  id: string;
  lettersOrNotes: string;
  whatToRemember: string;
}

interface TimeSensitiveEvent {
  id: string;
  event: string;
  dateTrigger: string;
}

interface BucketListUnfinishedBusinessData {
  // Places to Visit (repeatable)
  placesToVisit: PlaceToVisit[];
  
  // Projects to Complete (repeatable)
  projectsToComplete: ProjectToComplete[];
  
  // Messages Left Unsaid (repeatable)
  messagesUnsaid: MessageUnsaid[];
  
  // Hopes for Family's Future (repeatable)
  hopesForFamily: HopeForFamily[];
  
  // Time-Sensitive Events or Instructions (repeatable)
  timeSensitiveEvents: TimeSensitiveEvent[];
  
  // Closing Thoughts or Farewell Letter
  farewellLetterWritten: string;
  farewellLetterLocation: string;
  additionalReflections: string;
}

interface BucketListUnfinishedBusinessFormProps {
  onNext: () => void;
  onPrevious: () => void;
  initialData?: Partial<BucketListUnfinishedBusinessData>;
}

const BucketListUnfinishedBusinessForm: React.FC<BucketListUnfinishedBusinessFormProps> = ({
  onNext,
  onPrevious,
  initialData = {}
}) => {
  const { userTier, isTrial } = useTrial();
  const { localizeText } = useLocalization();
  const { syncForm } = useDatabaseSync();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<BucketListUnfinishedBusinessData>({
    placesToVisit: initialData.placesToVisit || [{ id: '1', place: '' }],
    projectsToComplete: initialData.projectsToComplete || [{ id: '1', project: '' }],
    messagesUnsaid: initialData.messagesUnsaid || [{ id: '1', toWhom: '', messageSummary: '' }],
    hopesForFamily: initialData.hopesForFamily || [{ id: '1', lettersOrNotes: '', whatToRemember: '' }],
    timeSensitiveEvents: initialData.timeSensitiveEvents || [{ id: '1', event: '', dateTrigger: '' }],
    farewellLetterWritten: initialData.farewellLetterWritten || '',
    farewellLetterLocation: initialData.farewellLetterLocation || '',
    additionalReflections: initialData.additionalReflections || ''
  });

  // Load saved data from localStorage when component mounts
  useEffect(() => {
    console.log('=== BUCKET LIST FORM LOADING SAVED DATA ===');
    const savedData = localStorage.getItem('bucketListUnfinishedBusinessData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('Loaded saved data:', parsedData);
        setFormData(prev => ({
          ...prev,
          ...parsedData
        }));
      } catch (error) {
        console.error('Error parsing saved bucket list data:', error);
      }
    } else {
      console.log('No saved bucket list data found in localStorage');
    }
  }, []);

  const handleFieldChange = (field: keyof BucketListUnfinishedBusinessData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Places to Visit functions
  const addPlaceToVisit = () => {
    const newPlace: PlaceToVisit = {
      id: Date.now().toString(),
      place: ''
    };
    setFormData(prev => ({
      ...prev,
      placesToVisit: [...prev.placesToVisit, newPlace]
    }));
  };

  const updatePlaceToVisit = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      placesToVisit: prev.placesToVisit.map(place =>
        place.id === id ? { ...place, place: value } : place
      )
    }));
  };

  const removePlaceToVisit = (id: string) => {
    if (formData.placesToVisit.length > 1) {
      setFormData(prev => ({
        ...prev,
        placesToVisit: prev.placesToVisit.filter(place => place.id !== id)
      }));
    }
  };

  // Projects to Complete functions
  const addProjectToComplete = () => {
    const newProject: ProjectToComplete = {
      id: Date.now().toString(),
      project: ''
    };
    setFormData(prev => ({
      ...prev,
      projectsToComplete: [...prev.projectsToComplete, newProject]
    }));
  };

  const updateProjectToComplete = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      projectsToComplete: prev.projectsToComplete.map(project =>
        project.id === id ? { ...project, project: value } : project
      )
    }));
  };

  const removeProjectToComplete = (id: string) => {
    if (formData.projectsToComplete.length > 1) {
      setFormData(prev => ({
        ...prev,
        projectsToComplete: prev.projectsToComplete.filter(project => project.id !== id)
      }));
    }
  };

  // Messages Unsaid functions
  const addMessageUnsaid = () => {
    const newMessage: MessageUnsaid = {
      id: Date.now().toString(),
      toWhom: '',
      messageSummary: ''
    };
    setFormData(prev => ({
      ...prev,
      messagesUnsaid: [...prev.messagesUnsaid, newMessage]
    }));
  };

  const updateMessageUnsaid = (id: string, field: keyof MessageUnsaid, value: string) => {
    setFormData(prev => ({
      ...prev,
      messagesUnsaid: prev.messagesUnsaid.map(message =>
        message.id === id ? { ...message, [field]: value } : message
      )
    }));
  };

  const removeMessageUnsaid = (id: string) => {
    if (formData.messagesUnsaid.length > 1) {
      setFormData(prev => ({
        ...prev,
        messagesUnsaid: prev.messagesUnsaid.filter(message => message.id !== id)
      }));
    }
  };

  // Hopes for Family functions
  const addHopeForFamily = () => {
    const newHope: HopeForFamily = {
      id: Date.now().toString(),
      lettersOrNotes: '',
      whatToRemember: ''
    };
    setFormData(prev => ({
      ...prev,
      hopesForFamily: [...prev.hopesForFamily, newHope]
    }));
  };

  const updateHopeForFamily = (id: string, field: keyof HopeForFamily, value: string) => {
    setFormData(prev => ({
      ...prev,
      hopesForFamily: prev.hopesForFamily.map(hope =>
        hope.id === id ? { ...hope, [field]: value } : hope
      )
    }));
  };

  const removeHopeForFamily = (id: string) => {
    if (formData.hopesForFamily.length > 1) {
      setFormData(prev => ({
        ...prev,
        hopesForFamily: prev.hopesForFamily.filter(hope => hope.id !== id)
      }));
    }
  };

  // Time Sensitive Events functions
  const addTimeSensitiveEvent = () => {
    const newEvent: TimeSensitiveEvent = {
      id: Date.now().toString(),
      event: '',
      dateTrigger: ''
    };
    setFormData(prev => ({
      ...prev,
      timeSensitiveEvents: [...prev.timeSensitiveEvents, newEvent]
    }));
  };

  const updateTimeSensitiveEvent = (id: string, field: keyof TimeSensitiveEvent, value: string) => {
    setFormData(prev => ({
      ...prev,
      timeSensitiveEvents: prev.timeSensitiveEvents.map(event =>
        event.id === id ? { ...event, [field]: value } : event
      )
    }));
  };

  const removeTimeSensitiveEvent = (id: string) => {
    if (formData.timeSensitiveEvents.length > 1) {
      setFormData(prev => ({
        ...prev,
        timeSensitiveEvents: prev.timeSensitiveEvents.filter(event => event.id !== id)
      }));
    }
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
      await syncForm(user.email, 'bucketListUnfinishedBusinessData', dataToSave);
      
      toast({
        title: "Success",
        description: "Bucket list & unfinished business saved to database!",
      });
      
      onNext();
    } catch (error) {
      console.error('Error saving bucket list data:', error);
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
      sectionTitle: 'Bucket List & Unfinished Business',
      data: formData,
      formType: 'bucketList',
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
        <CardTitle className="font-bold" style={{ color: '#E4B64A', fontSize: '28px' }}>Bucket List & Unfinished Business</CardTitle>
        <p className="text-lg" style={{ color: '#153A4B' }}>
          {localizeText('Honoring')} life's goals, promises, and parting words.
        </p>
        <AudioPlayer audioFile="Section_14.mp3" size="md" sectionNumber={14} />
      </CardHeader>
      <CardContent>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <Accordion type="single" collapsible className="mb-6">
            {/* Places to Visit */}
            <AccordionItem value="places-to-visit">
              <AccordionTrigger style={{ color: '#000000' }}>Places to Visit</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.placesToVisit.map((place, index) => (
                      <div key={place.id} className="flex items-center space-x-4">
                        <div className="flex-1">
                          <Label htmlFor={`place-${place.id}`}>Place {index + 1}</Label>
                          <Input
                            id={`place-${place.id}`}
                            value={place.place}
                            onChange={(e) => updatePlaceToVisit(place.id, e.target.value)}
                            placeholder="Enter place you want to visit"
                          />
                        </div>
                        {formData.placesToVisit.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePlaceToVisit(place.id)}
                            className="text-red-500 hover:text-red-700 mt-6"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" onClick={addPlaceToVisit} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Place to Visit
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Projects to Complete */}
            <AccordionItem value="projects-to-complete">
              <AccordionTrigger style={{ color: '#000000' }}>Projects to Complete</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.projectsToComplete.map((project, index) => (
                      <div key={project.id} className="flex items-center space-x-4">
                        <div className="flex-1">
                          <Label htmlFor={`project-${project.id}`}>Project {index + 1}</Label>
                          <Input
                            id={`project-${project.id}`}
                            value={project.project}
                            onChange={(e) => updateProjectToComplete(project.id, e.target.value)}
                            placeholder="Enter project you want to complete"
                          />
                        </div>
                        {formData.projectsToComplete.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProjectToComplete(project.id)}
                            className="text-red-500 hover:text-red-700 mt-6"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" onClick={addProjectToComplete} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project to Complete
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Messages Left Unsaid */}
            <AccordionItem value="messages-unsaid">
              <AccordionTrigger style={{ color: '#000000' }}>Messages Left Unsaid</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.messagesUnsaid.map((message, index) => (
                      <div key={message.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Message {index + 1}</h4>
                          {formData.messagesUnsaid.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMessageUnsaid(message.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`to-whom-${message.id}`}>To Whom</Label>
                            <Input
                              id={`to-whom-${message.id}`}
                              value={message.toWhom}
                              onChange={(e) => updateMessageUnsaid(message.id, 'toWhom', e.target.value)}
                              placeholder="Enter recipient name"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`message-summary-${message.id}`}>Message Summary and/or Location</Label>
                            <Textarea
                              id={`message-summary-${message.id}`}
                              value={message.messageSummary}
                              onChange={(e) => updateMessageUnsaid(message.id, 'messageSummary', e.target.value)}
                              placeholder="Enter message summary or location"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button type="button" onClick={addMessageUnsaid} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Message Left Unsaid
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Hopes for Family's Future */}
            <AccordionItem value="hopes-for-family">
              <AccordionTrigger style={{ color: '#000000' }}>Hopes for Family's Future</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.hopesForFamily.map((hope, index) => (
                      <div key={hope.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Hope {index + 1}</h4>
                          {formData.hopesForFamily.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeHopeForFamily(hope.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label>Letters or Notes Left</Label>
                            <RadioGroup value={hope.lettersOrNotes} onValueChange={(value) => updateHopeForFamily(hope.id, 'lettersOrNotes', value)}>
                              <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Yes" id={`letters-yes-${hope.id}`} />
                <Label htmlFor={`letters-yes-${hope.id}`}>Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id={`letters-no-${hope.id}`} />
                                <Label htmlFor={`letters-no-${hope.id}`}>No</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          <div>
                            <Label htmlFor={`what-to-remember-${hope.id}`}>What You'd Like Them to Remember or Pursue</Label>
                            <Textarea
                              id={`what-to-remember-${hope.id}`}
                              value={hope.whatToRemember}
                              onChange={(e) => updateHopeForFamily(hope.id, 'whatToRemember', e.target.value)}
                              placeholder="Enter what you'd like your family to remember or pursue"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button type="button" onClick={addHopeForFamily} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Hope for Family's Future
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Time-Sensitive Events or Instructions */}
            <AccordionItem value="time-sensitive-events">
              <AccordionTrigger style={{ color: '#000000' }}>Time-Sensitive Events or Instructions</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.timeSensitiveEvents.map((event, index) => (
                      <div key={event.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Event {index + 1}</h4>
                          {formData.timeSensitiveEvents.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTimeSensitiveEvent(event.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`event-${event.id}`}>Event / Instruction</Label>
                            <Input
                              id={`event-${event.id}`}
                              value={event.event}
                              onChange={(e) => updateTimeSensitiveEvent(event.id, 'event', e.target.value)}
                              placeholder="Enter event or instruction"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`date-trigger-${event.id}`}>Date / Trigger</Label>
                            <Input
                              id={`date-trigger-${event.id}`}
                              type="date"
                              value={event.dateTrigger}
                              onChange={(e) => updateTimeSensitiveEvent(event.id, 'dateTrigger', e.target.value)}
                              placeholder="Enter date or trigger"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button type="button" onClick={addTimeSensitiveEvent} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Time-Sensitive Event
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Closing Thoughts or Farewell Letter */}
            <AccordionItem value="closing-thoughts">
              <AccordionTrigger style={{ color: '#000000' }}>Closing Thoughts or Farewell Letter</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Letter Written?</Label>
                      <RadioGroup value={formData.farewellLetterWritten} onValueChange={(value) => handleFieldChange('farewellLetterWritten', value)}>
                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="Yes" id="farewell-yes" />
                <Label htmlFor="farewell-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="farewell-no" />
                          <Label htmlFor="farewell-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label htmlFor="farewell-letter-location">Location of Letter</Label>
                      <Input
                        id="farewell-letter-location"
                        value={formData.farewellLetterLocation}
                        onChange={(e) => handleFieldChange('farewellLetterLocation', e.target.value)}
                        placeholder="Enter location of farewell letter"
                      />
                    </div>
                    <div>
                      <Label htmlFor="additional-reflections">Additional Reflections</Label>
                      <Textarea
                        id="additional-reflections"
                        value={formData.additionalReflections}
                        onChange={(e) => handleFieldChange('additionalReflections', e.target.value)}
                        placeholder="Enter additional reflections or closing thoughts"
                        rows={4}
                      />
                    </div>
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

export default BucketListUnfinishedBusinessForm; 