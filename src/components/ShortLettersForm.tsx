import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2, Heart, Mail, Upload, File, Video, Mic, Play, Pause, Lock } from 'lucide-react';
import { generatePDF } from '../lib/pdfGenerator';
import AudioPlayer from './AudioPlayer';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './ui/use-toast';
import { useTrial } from '../contexts/TrialContext';

interface WrittenLetter {
  id: string;
  name: string;
  relationship: string;
  letterBody: string;
  deliveryDetails: string;
  deliveryTiming: string;
  deliveryMethod: string;
  specialInstructions: string;
}

interface VideoAudioMessage {
  id: string;
  recipientType: string;
  nameOfIndividualOrGroup: string;
  messageRecorded: string;
  locationOfRecording: string;
  deliveryDetails: string;
  // File upload properties
  uploadedFile?: {
    fileName: string;
    fileUrl: string;
    fileSize: number;
    fileType: 'video' | 'audio';
    qrCodeUrl?: string;
    uploadDate: string;
  };
}

interface ShortLettersData {
  // Written Letters (repeatable)
  writtenLetters: WrittenLetter[];
  
  // Video or Audio Messages (repeatable, max 5)
  videoAudioMessages: VideoAudioMessage[];
  
  // Final Reflections or Blessings
  personalNotes: string;
  spiritualCulturalMessages: string;
  
  // General Delivery Instructions
  generalDeliveryNotes: string;
}

interface ShortLettersFormProps {
  onNext: () => void;
  onPrevious: () => void;
  initialData?: Partial<ShortLettersData>;
}

const ShortLettersForm: React.FC<ShortLettersFormProps> = ({
  onNext,
  onPrevious,
  initialData = {}
}) => {
  const { toast } = useToast();
  const { canUploadInSection, userTier, isTrial } = useTrial();
  const { syncForm } = useDatabaseSync();
  const { user, isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ShortLettersData>({
    writtenLetters: initialData.writtenLetters || [],
    videoAudioMessages: initialData.videoAudioMessages || [],
    personalNotes: initialData.personalNotes || '',
    spiritualCulturalMessages: initialData.spiritualCulturalMessages || '',
    generalDeliveryNotes: initialData.generalDeliveryNotes || ''
  });

  const [newLetter, setNewLetter] = useState({
    name: '',
    relationship: '',
    letterBody: '',
    deliveryDetails: '',
    deliveryTiming: '',
    deliveryMethod: '',
    specialInstructions: ''
  });

  // File upload states
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number | null>(null);

  // Check if user can upload in this section
  const canUpload = canUploadInSection(12);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('shortLettersForm');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Auto-save to database every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(async () => {
      if (isAuthenticated && user?.email) {
        try {
          await syncForm(user.email, 'shortLettersData', formData);
        } catch (error) {
          console.error('Auto-save error:', error);
        }
      }
    }, 30000);
    
    return () => clearInterval(autoSaveInterval);
  }, [formData, isAuthenticated, user?.email, syncForm]);

  const handleFieldChange = (field: keyof ShortLettersData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Add new written letter
  const handleAddLetter = () => {
    if (!newLetter.name || !newLetter.letterBody) {
      toast({ title: 'Missing Information', description: 'Please provide at least the recipient name and letter content.' });
      return;
    }

    const letterEntry: WrittenLetter = {
      id: uuidv4(),
      name: newLetter.name,
      relationship: newLetter.relationship,
      letterBody: newLetter.letterBody,
      deliveryDetails: newLetter.deliveryDetails,
      deliveryTiming: newLetter.deliveryTiming,
      deliveryMethod: newLetter.deliveryMethod,
      specialInstructions: newLetter.specialInstructions
    };

    setFormData(prev => ({
      ...prev,
      writtenLetters: [...prev.writtenLetters, letterEntry]
    }));

    // Reset form
    setNewLetter({
      name: '',
      relationship: '',
      letterBody: '',
      deliveryDetails: '',
      deliveryTiming: '',
      deliveryMethod: '',
      specialInstructions: ''
    });

    toast({ title: 'Letter Added', description: 'Letter has been added to your list.' });
  };

  // Remove written letter
  const handleRemoveLetter = (id: string) => {
    setFormData(prev => ({
      ...prev,
      writtenLetters: prev.writtenLetters.filter(letter => letter.id !== id)
    }));
  };

  // Update written letter
  const handleUpdateLetter = (id: string, field: keyof WrittenLetter, value: string) => {
    setFormData(prev => ({
      ...prev,
      writtenLetters: prev.writtenLetters.map(letter =>
        letter.id === id ? { ...letter, [field]: value } : letter
      )
    }));
  };

  // Video/Audio Message functions
  const addVideoAudioMessage = () => {
    if (formData.videoAudioMessages.length < 5) {
      const newMessage: VideoAudioMessage = {
        id: uuidv4(),
        recipientType: '',
        nameOfIndividualOrGroup: '',
        messageRecorded: '',
        locationOfRecording: '',
        deliveryDetails: ''
      };
      setFormData(prev => ({
        ...prev,
        videoAudioMessages: [...prev.videoAudioMessages, newMessage]
      }));
    }
  };

  const updateVideoAudioMessage = (id: string, field: keyof VideoAudioMessage, value: string) => {
    setFormData(prev => ({
      ...prev,
      videoAudioMessages: prev.videoAudioMessages.map(message =>
        message.id === id ? { ...message, [field]: value } : message
      )
    }));
  };

  const removeVideoAudioMessage = (id: string) => {
    if (formData.videoAudioMessages.length > 1) {
      setFormData(prev => ({
        ...prev,
        videoAudioMessages: prev.videoAudioMessages.filter(message => message.id !== id)
      }));
    }
  };

  // File upload functions
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'audio/mpeg', 'audio/wav', 'audio/mp3'];
      if (!allowedTypes.includes(file.type)) {
        toast({ title: 'Invalid File Type', description: 'Please upload a video (MP4, WebM, MOV) or audio file (MP3, WAV).' });
        return;
      }
      
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast({ title: 'File Too Large', description: 'Please upload a file smaller than 50MB.' });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const uploadFileToSupabase = async (file: File, fileName: string): Promise<string> => {
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${fileName}_${timestamp}.${fileExtension}`;
    const storagePath = `short-letters/${uniqueFileName}`;

    const { data, error } = await supabase.storage
      .from('user-uploads')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw new Error('Failed to upload file');
    }

    const { data: publicUrlData } = supabase.storage
      .from('user-uploads')
      .getPublicUrl(storagePath);

    return publicUrlData.publicUrl;
  };

  const generateQRCode = async (fileUrl: string): Promise<string> => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fileUrl)}`;
  };

  const handleUploadFile = async (messageId: string) => {
    if (!canUpload) {
      toast({ 
        title: 'Upload Restricted', 
        description: 'File uploads in Section 12: Letters require Premium or Lifetime subscription.' 
      });
      return;
    }

    if (!selectedFile) {
      toast({ title: 'No File Selected', description: 'Please select a file to upload.' });
      return;
    }

    setUploadingFile(true);
    setCurrentMessageIndex(formData.videoAudioMessages.findIndex(msg => msg.id === messageId));

    try {
      // Upload file to Supabase
      const fileUrl = await uploadFileToSupabase(selectedFile, `message_${messageId}`);
      
      // Generate QR code
      const qrCodeUrl = await generateQRCode(fileUrl);
      
      // Determine file type
      const fileType = selectedFile.type.startsWith('video/') ? 'video' : 'audio';
      
      // Update the message with file info
      const uploadedFile = {
        fileName: selectedFile.name,
        fileUrl: fileUrl,
        fileSize: selectedFile.size,
        fileType: fileType as 'video' | 'audio',
        qrCodeUrl: qrCodeUrl,
        uploadDate: new Date().toISOString()
      };

      setFormData(prev => ({
        ...prev,
        videoAudioMessages: prev.videoAudioMessages.map(message =>
          message.id === messageId ? { ...message, uploadedFile } : message
        )
      }));

      // Reset file selection
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast({ title: 'File Uploaded', description: 'Your video/audio message has been uploaded successfully.' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Upload Failed', description: 'Failed to upload file. Please try again.' });
    } finally {
      setUploadingFile(false);
      setCurrentMessageIndex(null);
    }
  };

  const handleRemoveFile = (messageId: string) => {
    setFormData(prev => ({
      ...prev,
      videoAudioMessages: prev.videoAudioMessages.map(message =>
        message.id === messageId ? { ...message, uploadedFile: undefined } : message
      )
    }));
    toast({ title: 'File Removed', description: 'The uploaded file has been removed.' });
  };

  const handleSave = async () => {
    console.log('=== SHORT LETTERS SAVE START ===');
    
    // Show immediate feedback
    toast({
      title: "Saving short letters information...",
      description: "Please wait while we save your data.",
    });

    // Save to database
    if (isAuthenticated && user?.email) {
      console.log('=== DATABASE SYNC START ===');
      console.log('User authenticated, attempting database sync...');
      console.log('User email:', user.email);
      
      try {
        // Show syncing status
        toast({
          title: "Syncing to database...",
          description: "Please wait while we save your data to the cloud.",
        });

        // Use email as user ID for database sync
        const result = await syncForm(user.email, 'shortLettersData', formData);
        console.log('Sync result:', result);
        
        if (result.success) {
          toast({
            title: "Success!",
            description: "Your short letters information has been saved to the database.",
          });
        } else {
          console.error('Sync failed:', result.error);
          
          // Show detailed error message
          let errorMessage = "There was an issue saving to the database.";
          if (result.error && typeof result.error === 'string') {
            errorMessage += ` Error: ${result.error}`;
          } else if (result.error && result.error.message) {
            errorMessage += ` Error: ${result.error.message}`;
          }
          
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Database sync error:', error);
        
        // Show detailed error message
        let errorMessage = "There was an issue saving to the database.";
        if (error instanceof Error) {
          errorMessage += ` Error: ${error.message}`;
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } else {
      console.log('No authenticated user found');
      toast({
        title: "Authentication Required",
        description: "Please log in to save your short letters information to the database.",
        variant: "destructive",
      });
    }

    console.log('=== SHORT LETTERS SAVE END ===');
    onNext();
  };

  // PDF generation handler
  const handleGeneratePDF = () => {
    generatePDF({
      sectionTitle: 'Short Letters to Loved Ones',
      data: formData,
      formType: 'shortLetters',
      userTier,
      isTrial
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-bold" style={{ color: '#E4B64A', fontSize: '28px' }}>Short Letters to Loved Ones</CardTitle>
        <p className="text-lg" style={{ color: '#153A4B' }}>
          Words that linger, even when we're gone. Each letter can have specific delivery instructions for timing, method, and circumstances.
        </p>
        {!canUpload && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-blue-800">
              <strong>Upload Restriction:</strong> Video/audio uploads in Section 12: Letters require Premium or Lifetime subscription. Current plan: {userTier}
            </p>
          </div>
        )}
        <AudioPlayer audioFile="Section_12.mp3" size="md" sectionNumber={12} />
      </CardHeader>
      <CardContent>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <Accordion type="single" collapsible className="w-full">
            
            {/* Written Letters Section */}
            <AccordionItem value="written-letters">
              <AccordionTrigger style={{ color: '#153A4B' }}>Written Letters</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  {/* Add New Letter */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold" style={{ color: '#153A4B' }}>Add New Letter</h4>
                      <Button 
                        type="button" 
                        onClick={handleAddLetter}
                        variant="skillbinder_yellow"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Letter
                      </Button>
                    </div>
                    
                    <div className="border p-6 rounded-lg bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label>Recipient Name</Label>
                          <Input
                            value={newLetter.name}
                            onChange={(e) => setNewLetter(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter recipient name"
                          />
                        </div>
                        <div>
                          <Label>Relationship</Label>
                          <Input
                            value={newLetter.relationship}
                            onChange={(e) => setNewLetter(prev => ({ ...prev, relationship: e.target.value }))}
                            placeholder="e.g., Daughter, Son, Best Friend"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <Label>Letter Content</Label>
                        <Textarea
                          value={newLetter.letterBody}
                          onChange={(e) => setNewLetter(prev => ({ ...prev, letterBody: e.target.value }))}
                          placeholder="Write your letter here. Share your thoughts, feelings, advice, or final words for this person."
                          rows={6}
                        />
                      </div>

                      {/* Delivery Details for this specific letter */}
                      <div className="border-t pt-4 mb-4">
                        <h4 className="font-semibold mb-3" style={{ color: '#153A4B' }}>Delivery Details</h4>
                
                        <div className="mb-4">
                          <Label>Delivery Details (How, When, Who)</Label>
                          <Textarea
                            value={newLetter.deliveryDetails}
                            onChange={(e) => setNewLetter(prev => ({ ...prev, deliveryDetails: e.target.value }))}
                            placeholder="e.g., 'Please give this letter to Emily on her 18th birthday' or 'Deliver this after my memorial service'"
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Delivery Timing</Label>
                            <RadioGroup value={newLetter.deliveryTiming} onValueChange={(value) => setNewLetter(prev => ({ ...prev, deliveryTiming: value }))}>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="at-passing" id="timing-passing-new" />
                                <Label htmlFor="timing-passing-new">At Time of Passing</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="specific-date" id="timing-date-new" />
                                <Label htmlFor="timing-date-new">On Specific Date</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="specific-event" id="timing-event-new" />
                                <Label htmlFor="timing-event-new">On Specific Event</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="after-memorial" id="timing-memorial-new" />
                                <Label htmlFor="timing-memorial-new">After Memorial Service</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          <div>
                            <Label>Delivery Method</Label>
                            <RadioGroup value={newLetter.deliveryMethod} onValueChange={(value) => setNewLetter(prev => ({ ...prev, deliveryMethod: value }))}>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="hand-delivery" id="method-hand-new" />
                                <Label htmlFor="method-hand-new">Hand Delivery</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="mail" id="method-mail-new" />
                                <Label htmlFor="method-mail-new">Mail</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="email" id="method-email-new" />
                                <Label htmlFor="method-email-new">Email</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="digital-link" id="method-digital-new" />
                                <Label htmlFor="method-digital-new">Digital Link</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>

                        <div>
                          <Label>Special Instructions</Label>
                          <Textarea
                            value={newLetter.specialInstructions}
                            onChange={(e) => setNewLetter(prev => ({ ...prev, specialInstructions: e.target.value }))}
                            placeholder="Any special instructions for delivery, storage location, or additional context"
                            rows={2}
                          />
                        </div>
                      </div>
                      
                      <Button 
                        type="button" 
                        onClick={handleAddLetter}
                        variant="skillbinder_yellow"
                        className="skillbinder_yellow w-full"
                      >
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>Add Letter</span>
                        </div>
                      </Button>
                    </div>
                  </div>

                  {/* Your Letters */}
                  <div className="space-y-6 mb-8">
                    <h3 className="text-lg font-semibold" style={{ color: '#153A4B' }}>Your Letters</h3>
                    
                    {formData.writtenLetters.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                        <p>No letters added yet. Add your first letter above.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {formData.writtenLetters.map((letter, index) => (
                          <div key={letter.id} className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-100 px-4 py-2">
                              <div className="flex justify-between items-center">
                                <h4 className="font-semibold" style={{ color: '#153A4B' }}>Letter to {letter.name} - {letter.relationship}</h4>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRemoveLetter(letter.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Recipient Name</Label>
                                  <Input
                                    value={letter.name}
                                    onChange={(e) => handleUpdateLetter(letter.id, 'name', e.target.value)}
                                    className="text-sm"
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Relationship</Label>
                                  <Input
                                    value={letter.relationship}
                                    onChange={(e) => handleUpdateLetter(letter.id, 'relationship', e.target.value)}
                                    className="text-sm"
                                  />
                                </div>
                              </div>

                              <div>
                                <Label className="text-sm font-medium">Letter Content</Label>
                                <Textarea
                                  value={letter.letterBody}
                                  onChange={(e) => handleUpdateLetter(letter.id, 'letterBody', e.target.value)}
                                  className="text-sm"
                                  rows={4}
                                />
                              </div>

                              {/* Delivery Details for this specific letter */}
                              <div className="border-t pt-4">
                                <h5 className="font-medium mb-3" style={{ color: '#153A4B' }}>Delivery Details for {letter.name}</h5>
                                
                                <div className="mb-3">
                                  <Label className="text-sm font-medium">Delivery Details</Label>
                                  <Textarea
                                    value={letter.deliveryDetails}
                                    onChange={(e) => handleUpdateLetter(letter.id, 'deliveryDetails', e.target.value)}
                                    className="text-sm"
                                    rows={2}
                                  />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Delivery Timing</Label>
                                    <RadioGroup value={letter.deliveryTiming} onValueChange={(value) => handleUpdateLetter(letter.id, 'deliveryTiming', value)}>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="at-passing" id={`timing-passing-${letter.id}`} />
                                        <Label htmlFor={`timing-passing-${letter.id}`} className="text-sm">At Passing</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="specific-date" id={`timing-date-${letter.id}`} />
                                        <Label htmlFor={`timing-date-${letter.id}`} className="text-sm">Specific Date</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="specific-event" id={`timing-event-${letter.id}`} />
                                        <Label htmlFor={`timing-event-${letter.id}`} className="text-sm">Specific Event</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="after-memorial" id={`timing-memorial-${letter.id}`} />
                                        <Label htmlFor={`timing-memorial-${letter.id}`} className="text-sm">After Memorial</Label>
                                      </div>
                                    </RadioGroup>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Delivery Method</Label>
                                    <RadioGroup value={letter.deliveryMethod} onValueChange={(value) => handleUpdateLetter(letter.id, 'deliveryMethod', value)}>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="hand-delivery" id={`method-hand-${letter.id}`} />
                                        <Label htmlFor={`method-hand-${letter.id}`} className="text-sm">Hand Delivery</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="mail" id={`method-mail-${letter.id}`} />
                                        <Label htmlFor={`method-mail-${letter.id}`} className="text-sm">Mail</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="email" id={`method-email-${letter.id}`} />
                                        <Label htmlFor={`method-email-${letter.id}`} className="text-sm">Email</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="digital-link" id={`method-digital-${letter.id}`} />
                                        <Label htmlFor={`method-digital-${letter.id}`} className="text-sm">Digital Link</Label>
                                      </div>
                                    </RadioGroup>
                                  </div>
                                </div>

                                <div className="mt-3">
                                  <Label className="text-sm font-medium">Special Instructions</Label>
                                  <Textarea
                                    value={letter.specialInstructions}
                                    onChange={(e) => handleUpdateLetter(letter.id, 'specialInstructions', e.target.value)}
                                    className="text-sm"
                                    rows={2}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Video or Audio Messages Section */}
            <AccordionItem value="video-audio-messages">
              <AccordionTrigger style={{ color: '#153A4B' }}>Video or Audio Messages</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold" style={{ color: '#153A4B' }}>Video or Audio Messages</h4>
                    <Button 
                      type="button" 
                      onClick={addVideoAudioMessage}
                      variant="skillbinder_yellow"
                      size="sm"
                      disabled={formData.videoAudioMessages.length >= 5}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Message ({formData.videoAudioMessages.length}/5)
                    </Button>
                  </div>
                  
                  {formData.videoAudioMessages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                      <Video className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No video or audio messages added yet.</p>
                      <p className="text-sm">Click "Add Message" to create your first video or audio message.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.videoAudioMessages.map((message, index) => (
                        <Card key={message.id} className="border border-gray-200">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium" style={{ color: '#153A4B' }}>
                                Message {index + 1}
                                {message.uploadedFile && (
                                  <span className="ml-2 text-sm text-green-600">
                                    ({message.uploadedFile.fileType} uploaded)
                                  </span>
                                )}
                              </h5>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeVideoAudioMessage(message.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Recipient Type</Label>
                                <Input
                                  value={message.recipientType}
                                  onChange={(e) => updateVideoAudioMessage(message.id, 'recipientType', e.target.value)}
                                  placeholder="e.g., Family, Children, Friends"
                                />
                              </div>
                              <div>
                                <Label>Name of Individual or Group</Label>
                                <Input
                                  value={message.nameOfIndividualOrGroup}
                                  onChange={(e) => updateVideoAudioMessage(message.id, 'nameOfIndividualOrGroup', e.target.value)}
                                  placeholder="e.g., Sarah, The Smith Family"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label>Message Recorded</Label>
                              <Textarea
                                value={message.messageRecorded}
                                onChange={(e) => updateVideoAudioMessage(message.id, 'messageRecorded', e.target.value)}
                                placeholder="Describe what the message contains or include the transcript"
                                rows={3}
                              />
                            </div>
                            
                            <div>
                              <Label>Location of Recording</Label>
                              <Input
                                value={message.locationOfRecording}
                                onChange={(e) => updateVideoAudioMessage(message.id, 'locationOfRecording', e.target.value)}
                                placeholder="e.g., Living room, Garden, Office"
                              />
                            </div>
                            
                            <div>
                              <Label>Delivery Details</Label>
                              <Textarea
                                value={message.deliveryDetails}
                                onChange={(e) => updateVideoAudioMessage(message.id, 'deliveryDetails', e.target.value)}
                                placeholder="How and when should this message be delivered?"
                                rows={2}
                              />
                            </div>
                            
                            {/* File Upload Section */}
                            <div className="border-t pt-4 space-y-4">
                              <h6 className="font-medium" style={{ color: '#153A4B' }}>Upload Video/Audio File</h6>
                              
                              {!canUpload ? (
                                <div className="border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center rounded-lg">
                                  <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                  <h4 className="text-lg font-semibold mb-2" style={{ color: '#153A4B' }}>
                                    File Uploads Not Available
                                  </h4>
                                  <p className="text-gray-600 mb-4">
                                    Video/audio uploads in Section 12: Letters require Premium or Lifetime subscription.
                                  </p>
                                  <p className="text-sm text-gray-500 mb-4">
                                    Current plan: {userTier}
                                  </p>
                                  <Button 
                                    onClick={() => window.location.href = '/pricing'}
                                    style={{ backgroundColor: '#E4B64A', color: 'white' }}
                                  >
                                    Upgrade to Upload Files
                                  </Button>
                                </div>
                              ) : !message.uploadedFile ? (
                                <div className="space-y-3">
                                  <div>
                                    <Label>Select File</Label>
                                    <input
                                      ref={fileInputRef}
                                      type="file"
                                      onChange={handleFileSelect}
                                      accept="video/*,audio/*"
                                      className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                      Supported formats: MP4, WebM, MOV (video) | MP3, WAV (audio) | Max 50MB
                                    </p>
                                  </div>
                                  
                                  {selectedFile && (
                                    <div className="flex items-center gap-3">
                                      <div className="flex-1">
                                        <p className="text-sm font-medium">{selectedFile.name}</p>
                                        <p className="text-xs text-gray-500">
                                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                      </div>
                                      <Button
                                        type="button"
                                        onClick={() => handleUploadFile(message.id)}
                                        disabled={uploadingFile}
                                        variant="skillbinder_yellow"
                                        size="sm"
                                      >
                                        {uploadingFile && currentMessageIndex === index ? (
                                          <>
                                            <Upload className="h-4 w-4 mr-2 animate-spin" />
                                            Uploading...
                                          </>
                                        ) : (
                                          <>
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="border rounded-lg p-4 bg-green-50">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      {message.uploadedFile.fileType === 'video' ? (
                                        <Video className="h-8 w-8 text-green-600" />
                                      ) : (
                                        <Mic className="h-8 w-8 text-green-600" />
                                      )}
                                      <div>
                                        <p className="font-medium text-green-800">
                                          {message.uploadedFile.fileName}
                                        </p>
                                        <p className="text-sm text-green-600">
                                          {(message.uploadedFile.fileSize / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          Uploaded: {new Date(message.uploadedFile.uploadDate).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(message.uploadedFile!.fileUrl, '_blank')}
                                      >
                                        <Play className="h-4 w-4 mr-2" />
                                        View
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRemoveFile(message.id)}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  {message.uploadedFile.qrCodeUrl && (
                                    <div className="mt-3 pt-3 border-t">
                                      <div className="flex items-center gap-3">
                                        <div>
                                          <p className="text-sm font-medium text-gray-700">QR Code for PDF:</p>
                                          <p className="text-xs text-gray-500">
                                            This QR code will be included in the PDF to access the file
                                          </p>
                                        </div>
                                        <img 
                                          src={message.uploadedFile.qrCodeUrl} 
                                          alt="QR Code" 
                                          className="w-16 h-16 border rounded"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Final Reflections Section */}
            <AccordionItem value="final-reflections">
              <AccordionTrigger style={{ color: '#153A4B' }}>Final Reflections & Blessings</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  <div>
                    <Label>Personal Notes</Label>
                    <Textarea
                      value={formData.personalNotes}
                      onChange={(e) => handleFieldChange('personalNotes', e.target.value)}
                      placeholder="Share any additional thoughts, reflections, or personal notes"
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label>Spiritual or Cultural Messages</Label>
                    <Textarea
                      value={formData.spiritualCulturalMessages}
                      onChange={(e) => handleFieldChange('spiritualCulturalMessages', e.target.value)}
                      placeholder="Include any spiritual blessings, cultural traditions, or religious messages"
                      rows={4}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Delivery Instructions Section */}
            <AccordionItem value="delivery-instructions">
              <AccordionTrigger style={{ color: '#153A4B' }}>General Delivery Instructions</AccordionTrigger>
              <AccordionContent>
                <div>
                  <Label>General Delivery Notes</Label>
                  <Textarea
                    value={formData.generalDeliveryNotes}
                    onChange={(e) => handleFieldChange('generalDeliveryNotes', e.target.value)}
                    placeholder="Include any general instructions about how all letters and messages should be handled"
                    rows={4}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Form Actions */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <Button type="button" onClick={onPrevious} variant="skillbinder" className="skillbinder">
              Previous
            </Button>
            <div className="flex space-x-4">
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
              <Button type="submit" variant="skillbinder_yellow" className="skillbinder_yellow">
                Save & Continue
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ShortLettersForm;