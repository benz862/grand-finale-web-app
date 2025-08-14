import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { generatePDF } from '../lib/pdfGenerator';
import AudioPlayer from './AudioPlayer';
import { useTrial } from '../contexts/TrialContext';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface FuneralFinalArrangementsData {
  // Burial / Cremation / Donation Wishes
  burialCremationDonation: string;
  burialDetails: string;
  
  // Preferred Funeral or Memorial Style
  funeralStyle: string;
  
  // Service Details
  serviceMusic: string;
  serviceReadings: string;
  serviceOfficiant: string;
  
  // Guest List or Privacy Preferences
  guestPrivacy: string;
  guestNotes: string;
  
  // Obituary Instructions
  obituaryPreWritten: string;
  obituaryStoredAt: string;
  
  // Headstone / Marker Preferences
  headstoneType: string;
  headstoneOther: string;
  headstoneMaterial: string;
  headstoneInscription: string;
  headstoneDesign: string;
  headstoneLocation: string;
  headstoneResponsible: string;
  
  // Donations in Lieu of Flowers
  donationsOrganizations: string;
  
  // Special Rituals or Tributes
  specialRituals: string;
}

interface FuneralFinalArrangementsFormProps {
  onNext: () => void;
  onPrevious: () => void;
  initialData?: Partial<FuneralFinalArrangementsData>;
}

const FuneralFinalArrangementsForm: React.FC<FuneralFinalArrangementsFormProps> = ({
  onNext,
  onPrevious,
  initialData = {}
}) => {
  const { userTier, isTrial } = useTrial();
  const { syncForm } = useDatabaseSync();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FuneralFinalArrangementsData>({
    burialCremationDonation: initialData.burialCremationDonation || '',
    burialDetails: initialData.burialDetails || '',
    funeralStyle: initialData.funeralStyle || '',
    serviceMusic: initialData.serviceMusic || '',
    serviceReadings: initialData.serviceReadings || '',
    serviceOfficiant: initialData.serviceOfficiant || '',
    guestPrivacy: initialData.guestPrivacy || '',
    guestNotes: initialData.guestNotes || '',
    obituaryPreWritten: initialData.obituaryPreWritten || '',
    obituaryStoredAt: initialData.obituaryStoredAt || '',
    headstoneType: initialData.headstoneType || '',
    headstoneOther: initialData.headstoneOther || '',
    headstoneMaterial: initialData.headstoneMaterial || '',
    headstoneInscription: initialData.headstoneInscription || '',
    headstoneDesign: initialData.headstoneDesign || '',
    headstoneLocation: initialData.headstoneLocation || '',
    headstoneResponsible: initialData.headstoneResponsible || '',
    donationsOrganizations: initialData.donationsOrganizations || '',
    specialRituals: initialData.specialRituals || ''
  });

  const handleFieldChange = (field: keyof FuneralFinalArrangementsData, value: any) => {
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
      await syncForm(user.email, 'funeralFinalArrangementsData', dataToSave);
      
      toast({
        title: "Success",
        description: "Funeral & final arrangements saved to database!",
      });
      
      onNext();
    } catch (error) {
      console.error('Error saving funeral arrangements:', error);
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
      sectionTitle: 'Funeral & Final Arrangements',
      data: formData,
      formType: 'funeral',
      userTier,
      isTrial
    });
  };



  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-bold" style={{ color: '#E4B64A', fontSize: '28px' }}>Funeral & Final Arrangements</CardTitle>
        <p className="text-lg" style={{ color: '#153A4B' }}>
          Plan your final wishes with clarity and care.
        </p>
        <AudioPlayer audioFile="Section_9.mp3" size="md" sectionNumber={9} />
      </CardHeader>
      <CardContent>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <Accordion type="single" collapsible className="mb-6">
            {/* Burial / Cremation / Donation Wishes */}
            <AccordionItem value="burial-cremation-donation">
              <AccordionTrigger style={{ color: '#000000' }}>Burial / Cremation / Donation Wishes</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Preference</Label>
                      <RadioGroup value={formData.burialCremationDonation} onValueChange={(value) => handleFieldChange('burialCremationDonation', value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="burial" id="burial" />
                          <Label htmlFor="burial">Burial</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cremation" id="cremation" />
                          <Label htmlFor="cremation">Cremation</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="donation" id="donation" />
                          <Label htmlFor="donation">Donation</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label htmlFor="burial-details">Details or Restrictions</Label>
                      <Textarea
                        id="burial-details"
                        value={formData.burialDetails}
                        onChange={(e) => handleFieldChange('burialDetails', e.target.value)}
                        placeholder="Enter any specific details or restrictions for your burial, cremation, or donation wishes"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Preferred Funeral or Memorial Style */}
            <AccordionItem value="funeral-style">
              <AccordionTrigger style={{ color: '#000000' }}>Preferred Funeral or Memorial Style</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="funeral-style">Type (e.g., Religious, green burial, celebration of life)</Label>
                      <Input
                        id="funeral-style"
                        value={formData.funeralStyle}
                        onChange={(e) => handleFieldChange('funeralStyle', e.target.value)}
                        placeholder="Enter preferred funeral or memorial style"
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Service Details */}
            <AccordionItem value="service-details">
              <AccordionTrigger style={{ color: '#000000' }}>Service Details</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="service-music">Music</Label>
                      <Input
                        id="service-music"
                        value={formData.serviceMusic}
                        onChange={(e) => handleFieldChange('serviceMusic', e.target.value)}
                        placeholder="Enter preferred music for the service"
                      />
                    </div>
                    <div>
                      <Label htmlFor="service-readings">Readings / Rituals</Label>
                      <Textarea
                        id="service-readings"
                        value={formData.serviceReadings}
                        onChange={(e) => handleFieldChange('serviceReadings', e.target.value)}
                        placeholder="Enter preferred readings or rituals for the service"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="service-officiant">Officiant / Speaker</Label>
                      <Input
                        id="service-officiant"
                        value={formData.serviceOfficiant}
                        onChange={(e) => handleFieldChange('serviceOfficiant', e.target.value)}
                        placeholder="Enter preferred officiant or speaker"
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Guest List or Privacy Preferences */}
            <AccordionItem value="guest-privacy">
              <AccordionTrigger style={{ color: '#000000' }}>Guest List or Privacy Preferences</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Service Type</Label>
                      <RadioGroup value={formData.guestPrivacy} onValueChange={(value) => handleFieldChange('guestPrivacy', value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="public" id="public" />
                          <Label htmlFor="public">Public</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="private" id="private" />
                          <Label htmlFor="private">Private</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label htmlFor="guest-notes">Notes</Label>
                      <Textarea
                        id="guest-notes"
                        value={formData.guestNotes}
                        onChange={(e) => handleFieldChange('guestNotes', e.target.value)}
                        placeholder="Enter any notes about guest list or privacy preferences"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Obituary Instructions */}
            <AccordionItem value="obituary-instructions">
              <AccordionTrigger style={{ color: '#000000' }}>Obituary Instructions</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Pre-written?</Label>
                      <RadioGroup value={formData.obituaryPreWritten} onValueChange={(value) => handleFieldChange('obituaryPreWritten', value)}>
                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="Yes" id="obituary-yes" />
                <Label htmlFor="obituary-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="obituary-no" />
                          <Label htmlFor="obituary-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label htmlFor="obituary-stored-at">Stored At</Label>
                      <Input
                        id="obituary-stored-at"
                        value={formData.obituaryStoredAt}
                        onChange={(e) => handleFieldChange('obituaryStoredAt', e.target.value)}
                        placeholder="Enter location where obituary is stored"
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Headstone / Marker Preferences */}
            <AccordionItem value="headstone-preferences">
              <AccordionTrigger style={{ color: '#000000' }}>Headstone / Marker Preferences</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Type</Label>
                      <RadioGroup value={formData.headstoneType} onValueChange={(value) => handleFieldChange('headstoneType', value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="headstone" id="headstone" />
                          <Label htmlFor="headstone">Headstone</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="plaque" id="plaque" />
                          <Label htmlFor="plaque">Plaque</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no-marker" id="no-marker" />
                          <Label htmlFor="no-marker">No Marker</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other">Other</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {formData.headstoneType === 'other' && (
                      <div>
                        <Label htmlFor="headstone-other">Other Type</Label>
                        <Input
                          id="headstone-other"
                          value={formData.headstoneOther}
                          onChange={(e) => handleFieldChange('headstoneOther', e.target.value)}
                          placeholder="Specify other marker type"
                        />
                      </div>
                    )}
                    <div>
                      <Label htmlFor="headstone-material">Material Preference (e.g., granite, bronze)</Label>
                      <Input
                        id="headstone-material"
                        value={formData.headstoneMaterial}
                        onChange={(e) => handleFieldChange('headstoneMaterial', e.target.value)}
                        placeholder="Enter preferred material"
                      />
                    </div>
                    <div>
                      <Label htmlFor="headstone-inscription">Inscription / Epitaph Text</Label>
                      <Textarea
                        id="headstone-inscription"
                        value={formData.headstoneInscription}
                        onChange={(e) => handleFieldChange('headstoneInscription', e.target.value)}
                        placeholder="Enter desired inscription or epitaph text"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="headstone-design">Design Details (symbols, images, layout)</Label>
                      <Textarea
                        id="headstone-design"
                        value={formData.headstoneDesign}
                        onChange={(e) => handleFieldChange('headstoneDesign', e.target.value)}
                        placeholder="Enter design details including symbols, images, or layout preferences"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="headstone-location">Preferred Location or Placement Notes</Label>
                      <Textarea
                        id="headstone-location"
                        value={formData.headstoneLocation}
                        onChange={(e) => handleFieldChange('headstoneLocation', e.target.value)}
                        placeholder="Enter preferred location or placement notes"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="headstone-responsible">Responsible Person / Organization</Label>
                      <Input
                        id="headstone-responsible"
                        value={formData.headstoneResponsible}
                        onChange={(e) => handleFieldChange('headstoneResponsible', e.target.value)}
                        placeholder="Enter responsible person or organization"
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Donations in Lieu of Flowers */}
            <AccordionItem value="donations">
              <AccordionTrigger style={{ color: '#000000' }}>Donations in Lieu of Flowers</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="donations-organizations">Organization(s)</Label>
                      <Textarea
                        id="donations-organizations"
                        value={formData.donationsOrganizations}
                        onChange={(e) => handleFieldChange('donationsOrganizations', e.target.value)}
                        placeholder="Enter preferred organizations for donations in lieu of flowers"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Special Rituals or Tributes */}
            <AccordionItem value="special-rituals">
              <AccordionTrigger style={{ color: '#000000' }}>Special Rituals or Tributes</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="special-rituals">Details</Label>
                      <Textarea
                        id="special-rituals"
                        value={formData.specialRituals}
                        onChange={(e) => handleFieldChange('specialRituals', e.target.value)}
                        placeholder="Enter details about any special rituals or tributes you would like included"
                        rows={3}
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

export default FuneralFinalArrangementsForm; 