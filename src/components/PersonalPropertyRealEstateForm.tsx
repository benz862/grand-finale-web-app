import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { generatePDF } from '../lib/pdfGenerator';
import AudioPlayer from './AudioPlayer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTrial } from '../contexts/TrialContext';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

interface AdditionalProperty {
  id: string;
  address: string;
  propertyType: string;
  estimatedValue: string;
  mortgageInfo: string;
  insuranceInfo: string;
  utilityInfo: string;
  specialInstructions: string;
}

interface StorageUnit {
  id: string;
  location: string;
  accessDetails: string;
  specialInstructions: string;
}

interface HighValueItem {
  id: string;
  items: string;
  appraisalLocation: string;
  specialInstructions: string;
}

interface Firearm {
  id: string;
  registrationInfo: string;
  permitInfo: string;
  legalDocuments: string;
  specialInstructions: string;
}

interface PersonalPropertyRealEstateData {
  // Primary Residence
  primaryResidenceAddress: string;
  primaryResidenceCoOwners: string;
  primaryResidenceSecurity: string;
  primaryResidenceMortgage: string;
  
  // Additional Properties
  additionalProperties: AdditionalProperty[];
  
  // Deeds & Tax Info
  deedsTaxInfoLocation: string;
  
  // Storage Units & Garages
  storageUnits: StorageUnit[];
  
  // High-Value Items & Appraisals
  highValueItems: HighValueItem[];
  
  // Photo Albums & Family Keepsakes
  photoAlbumsLocation: string;
  
  // Home Contents & Distribution Plan
  homeContentsPlan: string;
  homeContentsSpecialInstructions: string;
  
  // Firearms
  firearms: Firearm[];
  
  // Other Property
  otherPropertyDetails: string;
  otherPropertySpecialInstructions: string;
  
  // Asset Distribution Plan
  distributionExecutor: string;
  distributionTimeline: string;
  distributionInstructions: string;
}

interface PersonalPropertyRealEstateFormProps {
  onNext: () => void;
  onPrevious: () => void;
  initialData?: Partial<PersonalPropertyRealEstateData>;
}

const PersonalPropertyRealEstateForm: React.FC<PersonalPropertyRealEstateFormProps> = ({
  onNext,
  onPrevious,
  initialData = {}
}) => {
  const { userTier, isTrial } = useTrial();
  const { syncForm } = useDatabaseSync();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [userInfo, setUserInfo] = useState<{ firstName?: string; lastName?: string; email?: string }>({});
  const [formData, setFormData] = useState<PersonalPropertyRealEstateData>({
    primaryResidenceAddress: initialData.primaryResidenceAddress || '',
    primaryResidenceCoOwners: initialData.primaryResidenceCoOwners || '',
    primaryResidenceSecurity: initialData.primaryResidenceSecurity || '',
    primaryResidenceMortgage: initialData.primaryResidenceMortgage || '',
    additionalProperties: initialData.additionalProperties || [{ id: '1', address: '', propertyType: '', estimatedValue: '', mortgageInfo: '', insuranceInfo: '', utilityInfo: '', specialInstructions: '' }],
    deedsTaxInfoLocation: initialData.deedsTaxInfoLocation || '',
    storageUnits: initialData.storageUnits || [{ id: '1', location: '', accessDetails: '', specialInstructions: '' }],
    highValueItems: initialData.highValueItems || [{ id: '1', items: '', appraisalLocation: '', specialInstructions: '' }],
    photoAlbumsLocation: initialData.photoAlbumsLocation || '',
    homeContentsPlan: initialData.homeContentsPlan || '',
    homeContentsSpecialInstructions: initialData.homeContentsSpecialInstructions || '',
    firearms: initialData.firearms || [{ id: '1', registrationInfo: '', permitInfo: '', legalDocuments: '', specialInstructions: '' }],
    otherPropertyDetails: initialData.otherPropertyDetails || '',
    otherPropertySpecialInstructions: initialData.otherPropertySpecialInstructions || '',
    distributionExecutor: initialData.distributionExecutor || '',
    distributionTimeline: initialData.distributionTimeline || '',
    distributionInstructions: initialData.distributionInstructions || ''
  });

  // Fetch user information for PDF footer
  const fetchUserInfo = async () => {
    if (!user?.email) return;
    
    try {
      // Get user data from personal_info table
      const { data: personalInfo, error } = await supabase
        .from('personal_info')
        .select('legal_first_name, legal_last_name')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user info:', error);
        return;
      }
      
      setUserInfo({
        firstName: personalInfo?.legal_first_name || '',
        lastName: personalInfo?.legal_last_name || '',
        email: user.email
      });
    } catch (error) {
      console.error('Error in fetchUserInfo:', error);
    }
  };
  
  // Fetch user info when component mounts
  useEffect(() => {
    if (user?.email) {
      fetchUserInfo();
    }
  }, [user?.email]);

  const handleFieldChange = (field: keyof PersonalPropertyRealEstateData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Clear any old localStorage data and ensure proper initialization
  useEffect(() => {
    // Clear any potentially corrupted data
    const keysToCheck = [
      'personalPropertyRealEstateData',
      'personalPropertyRealEstate',
      'realEstateData',
      'propertyData'
    ];
    
    keysToCheck.forEach(key => {
      const savedData = localStorage.getItem(key);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          // Check if the data has the old structure with duplicate fields
          if (parsed.additionalProperties && parsed.additionalProperties.length > 0) {
            const firstProperty = parsed.additionalProperties[0];
            // If all fields have the same value, it's likely the old duplicate field issue
            if (firstProperty.estimatedValue && 
                firstProperty.estimatedValue === firstProperty.mortgageInfo &&
                firstProperty.estimatedValue === firstProperty.insuranceInfo &&
                firstProperty.estimatedValue === firstProperty.utilityInfo &&
                firstProperty.estimatedValue === firstProperty.specialInstructions) {
              // Clear the corrupted data
              localStorage.removeItem(key);
              console.log(`Cleared corrupted data from ${key}`);
            }
          }
        } catch (error) {
          console.error(`Error parsing saved data from ${key}:`, error);
          localStorage.removeItem(key);
        }
      }
    });
    
    // Ensure we have clean initial data
    const currentData = localStorage.getItem('personalPropertyRealEstateData');
    if (!currentData) {
      // Initialize with clean data structure
      const cleanData = {
        primaryResidenceAddress: '',
        primaryResidenceCoOwners: '',
        primaryResidenceSecurity: '',
        primaryResidenceMortgage: '',
        additionalProperties: [{ 
          id: '1', 
          address: '', 
          propertyType: '', 
          estimatedValue: '', 
          mortgageInfo: '', 
          insuranceInfo: '', 
          utilityInfo: '', 
          specialInstructions: '' 
        }],
        deedsTaxInfoLocation: '',
        storageUnits: [{ 
          id: '1', 
          location: '', 
          accessDetails: '', 
          specialInstructions: '' 
        }],
        highValueItems: [{ 
          id: '1', 
          items: '', 
          appraisalLocation: '', 
          specialInstructions: '' 
        }],
        photoAlbumsLocation: '',
        homeContentsPlan: '',
        homeContentsSpecialInstructions: '',
        firearms: [{ 
          id: '1', 
          registrationInfo: '', 
          permitInfo: '', 
          legalDocuments: '', 
          specialInstructions: '' 
        }],
        otherPropertyDetails: '',
        otherPropertySpecialInstructions: '',
        distributionExecutor: '',
        distributionTimeline: '',
        distributionInstructions: ''
      };
      console.log('Initialized clean Personal Property & Real Estate data structure');
    }
  }, []);

  // Additional Properties handlers
  const addAdditionalProperty = () => {
    const newProperty: AdditionalProperty = {
      id: Date.now().toString(),
      address: '',
      propertyType: '',
      estimatedValue: '',
      mortgageInfo: '',
      insuranceInfo: '',
      utilityInfo: '',
      specialInstructions: ''
    };
    setFormData(prev => ({
      ...prev,
      additionalProperties: [...prev.additionalProperties, newProperty]
    }));
  };

  const updateAdditionalProperty = (id: string, field: keyof AdditionalProperty, value: string) => {
    setFormData(prev => ({
      ...prev,
      additionalProperties: prev.additionalProperties.map(property =>
        property.id === id ? { ...property, [field]: value } : property
      )
    }));
  };

  const removeAdditionalProperty = (id: string) => {
    if (formData.additionalProperties.length > 1) {
      setFormData(prev => ({
        ...prev,
        additionalProperties: prev.additionalProperties.filter(property => property.id !== id)
      }));
    }
  };

  // Storage Units handlers
  const addStorageUnit = () => {
    const newStorageUnit: StorageUnit = {
      id: Date.now().toString(),
      location: '',
      accessDetails: '',
      specialInstructions: ''
    };
    setFormData(prev => ({
      ...prev,
      storageUnits: [...prev.storageUnits, newStorageUnit]
    }));
  };

  const updateStorageUnit = (id: string, field: keyof StorageUnit, value: string) => {
    setFormData(prev => ({
      ...prev,
      storageUnits: prev.storageUnits.map(unit =>
        unit.id === id ? { ...unit, [field]: value } : unit
      )
    }));
  };

  const removeStorageUnit = (id: string) => {
    if (formData.storageUnits.length > 1) {
      setFormData(prev => ({
        ...prev,
        storageUnits: prev.storageUnits.filter(unit => unit.id !== id)
      }));
    }
  };

  // High Value Items handlers
  const addHighValueItem = () => {
    const newItem: HighValueItem = {
      id: Date.now().toString(),
      items: '',
      appraisalLocation: '',
      specialInstructions: ''
    };
    setFormData(prev => ({
      ...prev,
      highValueItems: [...prev.highValueItems, newItem]
    }));
  };

  const updateHighValueItem = (id: string, field: keyof HighValueItem, value: string) => {
    setFormData(prev => ({
      ...prev,
      highValueItems: prev.highValueItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeHighValueItem = (id: string) => {
    if (formData.highValueItems.length > 1) {
      setFormData(prev => ({
        ...prev,
        highValueItems: prev.highValueItems.filter(item => item.id !== id)
      }));
    }
  };

  // Firearms handlers
  const addFirearm = () => {
    const newFirearm: Firearm = {
      id: Date.now().toString(),
      registrationInfo: '',
      permitInfo: '',
      legalDocuments: '',
      specialInstructions: ''
    };
    setFormData(prev => ({
      ...prev,
      firearms: [...prev.firearms, newFirearm]
    }));
  };

  const updateFirearm = (id: string, field: keyof Firearm, value: string) => {
    setFormData(prev => ({
      ...prev,
      firearms: prev.firearms.map(firearm =>
        firearm.id === id ? { ...firearm, [field]: value } : firearm
      )
    }));
  };

  const removeFirearm = (id: string) => {
    if (formData.firearms.length > 1) {
      setFormData(prev => ({
        ...prev,
        firearms: prev.firearms.filter(firearm => firearm.id !== id)
      }));
    }
  };

  const handleSave = async () => {
    console.log('=== PERSONAL PROPERTY REAL ESTATE SAVE START ===');
    
    // Show immediate feedback
    toast({
      title: "Saving personal property & real estate information...",
      description: "Please wait while we save your data.",
    });

    // Data will be saved to database only
    console.log('Personal property real estate data will be saved to database');

    // Sync to database if user is logged in
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
        const result = await syncForm(user.email, 'personalPropertyRealEstateData', formData);
        console.log('Sync result:', result);
        
        if (result.success) {
          toast({
            title: "Success!",
            description: "Your personal property & real estate information has been saved to the database and locally.",
          });
        } else {
          console.error('Sync failed:', result.error);
          
          // Show detailed error message
          let errorMessage = "Data saved locally but there was an issue saving to the database.";
          if (result.error && typeof result.error === 'string') {
            errorMessage += ` Error: ${result.error}`;
          } else if (result.error && result.error.message) {
            errorMessage += ` Error: ${result.error.message}`;
          }
          
          toast({
            title: "Warning",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Database sync error:', error);
        
        // Show detailed error message
        let errorMessage = "Data saved locally but there was an issue saving to the database.";
        if (error instanceof Error) {
          errorMessage += ` Error: ${error.message}`;
        }
        
        toast({
          title: "Warning",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } else {
      console.log('No authenticated user found');
      toast({
        title: "Success!",
        description: "Your personal property & real estate information has been saved locally. Please log in to sync to the cloud.",
      });
    }

    console.log('=== PERSONAL PROPERTY REAL ESTATE SAVE END ===');
    onNext();
  };

  // PDF generation handler
  const handleGeneratePDF = () => {
    generatePDF({
      sectionTitle: 'Personal Property & Real Estate',
      data: formData,
      formType: 'personalProperty',
      userTier,
      isTrial,
      userInfo: userInfo
    });
  };

  // Debug function to clear all localStorage data for this form
  const clearAllData = () => {
    const keysToClear = [
      'personalPropertyRealEstateData',
      'personalPropertyRealEstate',
      'realEstateData',
      'propertyData'
    ];
    keysToClear.forEach(key => localStorage.removeItem(key));
    window.location.reload(); // Reload the page to start fresh
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-bold" style={{ color: '#E4B64A', fontSize: '28px' }}>Personal Property & Real Estate</CardTitle>
        <p className="text-lg" style={{ color: '#153A4B' }}>
          Document your personal property, real estate holdings, and asset distribution plans for comprehensive legacy planning
        </p>
        <AudioPlayer audioFile="Section_6.mp3" size="md" sectionNumber={6} />
      </CardHeader>
      <CardContent>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <Accordion type="single" collapsible className="mb-6">
            {/* Real Estate Properties */}
            <AccordionItem value="real-estate">
              <AccordionTrigger style={{ color: '#000000' }}>Real Estate Properties</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.additionalProperties.map((property, index) => (
                      <div key={property.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Property {index + 1}</h4>
                          {formData.additionalProperties.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAdditionalProperty(property.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`property-address-${property.id}`}>Property Address</Label>
                            <Input
                              id={`property-address-${property.id}`}
                              value={property.address}
                              onChange={(e) => updateAdditionalProperty(property.id, 'address', e.target.value)}
                              placeholder="Enter property address"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`property-type-${property.id}`}>Property Type</Label>
                            <Select value={property.propertyType} onValueChange={(value) => updateAdditionalProperty(property.id, 'propertyType', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="primary-residence">Primary Residence</SelectItem>
                                <SelectItem value="secondary-home">Secondary Home</SelectItem>
                                <SelectItem value="rental-property">Rental Property</SelectItem>
                                <SelectItem value="commercial">Commercial Property</SelectItem>
                                <SelectItem value="vacant-land">Vacant Land</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor={`property-value-${property.id}`}>Estimated Value</Label>
                            <Input
                              id={`property-value-${property.id}`}
                              value={property.estimatedValue}
                              onChange={(e) => updateAdditionalProperty(property.id, 'estimatedValue', e.target.value)}
                              placeholder="Estimated market value"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`property-mortgage-${property.id}`}>Mortgage Information</Label>
                            <Input
                              id={`property-mortgage-${property.id}`}
                              value={property.mortgageInfo}
                              onChange={(e) => updateAdditionalProperty(property.id, 'mortgageInfo', e.target.value)}
                              placeholder="Mortgage details and balance"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`property-insurance-${property.id}`}>Insurance Information</Label>
                            <Input
                              id={`property-insurance-${property.id}`}
                              value={property.insuranceInfo}
                              onChange={(e) => updateAdditionalProperty(property.id, 'insuranceInfo', e.target.value)}
                              placeholder="Insurance company and policy number"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`property-utilities-${property.id}`}>Utility Information</Label>
                            <Input
                              id={`property-utilities-${property.id}`}
                              value={property.utilityInfo}
                              onChange={(e) => updateAdditionalProperty(property.id, 'utilityInfo', e.target.value)}
                              placeholder="Utility account information"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`property-notes-${property.id}`}>Special Instructions</Label>
                            <Textarea
                              id={`property-notes-${property.id}`}
                              value={property.specialInstructions}
                              onChange={(e) => updateAdditionalProperty(property.id, 'specialInstructions', e.target.value)}
                              placeholder="Any special instructions for this property"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button type="button" onClick={addAdditionalProperty} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Property
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Storage Units & Garages */}
            <AccordionItem value="storage-units">
              <AccordionTrigger style={{ color: '#000000' }}>Storage Units & Garages</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.storageUnits.map((unit, index) => (
                      <div key={unit.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Storage Unit {index + 1}</h4>
                          {formData.storageUnits.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeStorageUnit(unit.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`storage-location-${unit.id}`}>Location</Label>
                            <Input
                              id={`storage-location-${unit.id}`}
                              value={unit.location}
                              onChange={(e) => updateStorageUnit(unit.id, 'location', e.target.value)}
                              placeholder="Enter storage unit location"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`storage-access-${unit.id}`}>Access Details</Label>
                            <Input
                              id={`storage-access-${unit.id}`}
                              value={unit.accessDetails}
                              onChange={(e) => updateStorageUnit(unit.id, 'accessDetails', e.target.value)}
                              placeholder="Enter access details, codes, or key locations"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`storage-notes-${unit.id}`}>Special Instructions</Label>
                            <Textarea
                              id={`storage-notes-${unit.id}`}
                              value={unit.specialInstructions}
                              onChange={(e) => updateStorageUnit(unit.id, 'specialInstructions', e.target.value)}
                              placeholder="Any special instructions for this storage unit"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button type="button" onClick={addStorageUnit} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Storage Unit
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* High-Value Items & Appraisals */}
            <AccordionItem value="high-value-items">
              <AccordionTrigger style={{ color: '#000000' }}>High-Value Items & Appraisals</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.highValueItems.map((item, index) => (
                      <div key={item.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Item {index + 1}</h4>
                          {formData.highValueItems.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeHighValueItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`item-description-${item.id}`}>Item(s)</Label>
                            <Input
                              id={`item-description-${item.id}`}
                              value={item.items}
                              onChange={(e) => updateHighValueItem(item.id, 'items', e.target.value)}
                              placeholder="Enter item description"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`appraisal-location-${item.id}`}>Appraisal Document Location</Label>
                            <Input
                              id={`appraisal-location-${item.id}`}
                              value={item.appraisalLocation}
                              onChange={(e) => updateHighValueItem(item.id, 'appraisalLocation', e.target.value)}
                              placeholder="Where appraisal documents are stored"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`item-notes-${item.id}`}>Special Instructions</Label>
                            <Textarea
                              id={`item-notes-${item.id}`}
                              value={item.specialInstructions}
                              onChange={(e) => updateHighValueItem(item.id, 'specialInstructions', e.target.value)}
                              placeholder="Any special instructions for this item"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button type="button" onClick={addHighValueItem} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Item
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Photo Albums & Family Keepsakes */}
            <AccordionItem value="photo-albums">
              <AccordionTrigger style={{ color: '#000000' }}>Photo Albums & Family Keepsakes</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="photo-albums-location">Stored At</Label>
                        <Input
                          id="photo-albums-location"
                          value={formData.photoAlbumsLocation}
                          onChange={(e) => handleFieldChange('photoAlbumsLocation', e.target.value)}
                          placeholder="Where photo albums and family keepsakes are stored"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor={`photo-albums-notes`}>Special Instructions</Label>
                        <Textarea
                          id={`photo-albums-notes`}
                          value={formData.photoAlbumsLocation}
                          onChange={(e) => handleFieldChange('photoAlbumsLocation', e.target.value)}
                          placeholder="Any special instructions for photo albums and family keepsakes"
                          rows={3}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Home Contents & Distribution Plan */}
            <AccordionItem value="home-contents">
              <AccordionTrigger style={{ color: '#000000' }}>Home Contents & Distribution Plan</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="home-contents-plan">Plan Location / Notes</Label>
                        <Input
                          id="home-contents-plan"
                          value={formData.homeContentsPlan}
                          onChange={(e) => handleFieldChange('homeContentsPlan', e.target.value)}
                          placeholder="Enter distribution plan location and notes"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor={`home-contents-notes`}>Special Instructions</Label>
                        <Textarea
                          id={`home-contents-notes`}
                          value={formData.homeContentsSpecialInstructions}
                          onChange={(e) => handleFieldChange('homeContentsSpecialInstructions', e.target.value)}
                          placeholder="Any special instructions for home contents and distribution plan"
                          rows={4}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Firearms */}
            <AccordionItem value="firearms">
              <AccordionTrigger style={{ color: '#000000' }}>Firearms</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.firearms.map((firearm, index) => (
                      <div key={firearm.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Firearm {index + 1}</h4>
                          {formData.firearms.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFirearm(firearm.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`firearm-registration-${firearm.id}`}>Registration Info</Label>
                            <Input
                              id={`firearm-registration-${firearm.id}`}
                              value={firearm.registrationInfo}
                              onChange={(e) => updateFirearm(firearm.id, 'registrationInfo', e.target.value)}
                              placeholder="Enter registration information"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`firearm-permit-${firearm.id}`}>Permit Info</Label>
                            <Input
                              id={`firearm-permit-${firearm.id}`}
                              value={firearm.permitInfo}
                              onChange={(e) => updateFirearm(firearm.id, 'permitInfo', e.target.value)}
                              placeholder="Enter permit information"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`firearm-documents-${firearm.id}`}>Legal Documents & Permit Papers</Label>
                            <Input
                              id={`firearm-documents-${firearm.id}`}
                              value={firearm.legalDocuments}
                              onChange={(e) => updateFirearm(firearm.id, 'legalDocuments', e.target.value)}
                              placeholder="Where legal documents and permit papers are stored"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`firearm-notes-${firearm.id}`}>Special Instructions</Label>
                            <Textarea
                              id={`firearm-notes-${firearm.id}`}
                              value={firearm.specialInstructions}
                              onChange={(e) => updateFirearm(firearm.id, 'specialInstructions', e.target.value)}
                              placeholder="Any special instructions for this firearm"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button type="button" onClick={addFirearm} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Firearm
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Other Property */}
            <AccordionItem value="other-property">
              <AccordionTrigger style={{ color: '#000000' }}>Other Property</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="other-property-details">Details</Label>
                        <Textarea
                          id="other-property-details"
                          value={formData.otherPropertyDetails}
                          onChange={(e) => handleFieldChange('otherPropertyDetails', e.target.value)}
                          placeholder="Enter details about other property not covered above"
                          rows={4}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor={`other-property-notes`}>Special Instructions</Label>
                        <Textarea
                          id={`other-property-notes`}
                          value={formData.otherPropertySpecialInstructions}
                          onChange={(e) => handleFieldChange('otherPropertySpecialInstructions', e.target.value)}
                          placeholder="Any special instructions for other property"
                          rows={4}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Asset Distribution Plan */}
            <AccordionItem value="asset-distribution">
              <AccordionTrigger style={{ color: '#000000' }}>Asset Distribution Plan</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="distribution-executor">Executor or Trustee</Label>
                        <Input
                          id="distribution-executor"
                          value={formData.distributionExecutor}
                          onChange={(e) => handleFieldChange('distributionExecutor', e.target.value)}
                          placeholder="Name of person responsible for distribution"
                        />
                      </div>
                      <div>
                        <Label htmlFor="distribution-timeline">Distribution Timeline</Label>
                        <Select value={formData.distributionTimeline} onValueChange={(value) => handleFieldChange('distributionTimeline', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate</SelectItem>
                            <SelectItem value="30-days">Within 30 days</SelectItem>
                            <SelectItem value="90-days">Within 90 days</SelectItem>
                            <SelectItem value="6-months">Within 6 months</SelectItem>
                            <SelectItem value="1-year">Within 1 year</SelectItem>
                            <SelectItem value="specific-date">Specific date</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="distribution-notes">Distribution Instructions</Label>
                        <Textarea
                          id="distribution-notes"
                          value={formData.distributionInstructions}
                          onChange={(e) => handleFieldChange('distributionInstructions', e.target.value)}
                          placeholder="Special instructions for asset distribution"
                          rows={4}
                        />
                      </div>
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

export default PersonalPropertyRealEstateForm; 