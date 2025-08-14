import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Trash2, PawPrint } from 'lucide-react';
import { generatePDF } from '../lib/pdfGenerator';
import AudioPlayer from './AudioPlayer';
import { v4 as uuidv4 } from 'uuid';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './ui/use-toast';
import { formatPhoneNumber } from '@/lib/phoneNumberFormatter';

interface Pet {
  id: string;
  name: string;
  chipped: string;
  speciesBreed: string;
  age: string;
  dietNeeds: string;
  feedingTimes: string;
  medicalNeeds: string;
  notes: string;
  legacyWish: string;
  legacyRecipient: string;
  legacyNotes: string;
}

interface Veterinarian {
  clinicName: string;
  phone: string;
  address: string;
  email: string;
}

interface PetsAnimalCareData {
  // Pet Information (repeatable)
  pets: Pet[];
  
  // Veterinarian Information (single)
  veterinarian: Veterinarian;
  
  // Pet Insurance
  insuranceProvider: string;
  policyNumber: string;
  contactInfo: string;
  
  // Primary & Backup Caregivers
  primaryCaregiverName: string;
  primaryCaregiverContact: string;
  backupCaregiverName: string;
  backupCaregiverContact: string;
  
  // Supplies & Comfort Items
  importantItems: string;
  itemLocations: string;
  
  // General Legacy Notes
  generalLegacyNotes: string;
  
  // Instructions for Foster or Rehoming
  preferredOrganization: string;
  rehomingNotes: string;
}

interface PetsAnimalCareFormProps {
  onNext: () => void;
  onPrevious: () => void;
  initialData?: Partial<PetsAnimalCareData>;
}

const PetsAnimalCareForm: React.FC<PetsAnimalCareFormProps> = ({
  onNext,
  onPrevious,
  initialData = {}
}) => {
  const { toast } = useToast();
  const { syncForm } = useDatabaseSync();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<PetsAnimalCareData>({
    pets: initialData.pets || [],
    veterinarian: initialData.veterinarian || {
      clinicName: '',
      phone: '',
      address: '',
      email: ''
    },
    insuranceProvider: initialData.insuranceProvider || '',
    policyNumber: initialData.policyNumber || '',
    contactInfo: initialData.contactInfo || '',
    primaryCaregiverName: initialData.primaryCaregiverName || '',
    primaryCaregiverContact: initialData.primaryCaregiverContact || '',
    backupCaregiverName: initialData.backupCaregiverName || '',
    backupCaregiverContact: initialData.backupCaregiverContact || '',
    importantItems: initialData.importantItems || '',
    itemLocations: initialData.itemLocations || '',
    generalLegacyNotes: initialData.generalLegacyNotes || '',
    preferredOrganization: initialData.preferredOrganization || '',
    rehomingNotes: initialData.rehomingNotes || ''
  });

  const [newPet, setNewPet] = useState({
    name: '',
    chipped: '',
    speciesBreed: '',
    age: '',
    dietNeeds: '',
    feedingTimes: '',
    medicalNeeds: '',
    notes: '',
    legacyWish: '',
    legacyRecipient: '',
    legacyNotes: ''
  });

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('petsAnimalCareForm');
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
          await syncForm(user.email, 'petsAnimalCareData', formData);
        } catch (error) {
          console.error('Auto-save error:', error);
        }
      }
    }, 30000);
    
    return () => clearInterval(autoSaveInterval);
  }, [formData, isAuthenticated, user?.email, syncForm]);

  const handleFieldChange = (field: keyof PetsAnimalCareData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Add new pet
  const handleAddPet = () => {
    if (!newPet.name || !newPet.speciesBreed) {
      toast({ title: 'Missing Information', description: 'Please provide at least the pet name and species/breed.' });
      return;
    }

    const petEntry: Pet = {
      id: uuidv4(),
      name: newPet.name,
      chipped: newPet.chipped,
      speciesBreed: newPet.speciesBreed,
      age: newPet.age,
      dietNeeds: newPet.dietNeeds,
      feedingTimes: newPet.feedingTimes,
      medicalNeeds: newPet.medicalNeeds,
      notes: newPet.notes,
      legacyWish: newPet.legacyWish,
      legacyRecipient: newPet.legacyRecipient,
      legacyNotes: newPet.legacyNotes
    };

    setFormData(prev => ({
      ...prev,
      pets: [...prev.pets, petEntry]
    }));

    // Reset form
    setNewPet({
      name: '',
      chipped: '',
      speciesBreed: '',
      age: '',
      dietNeeds: '',
      feedingTimes: '',
      medicalNeeds: '',
      notes: '',
      legacyWish: '',
      legacyRecipient: '',
      legacyNotes: ''
    });

    toast({ title: 'Pet Added', description: 'Pet has been added to your list.' });
  };

  // Remove pet
  const handleRemovePet = (id: string) => {
    setFormData(prev => ({
      ...prev,
      pets: prev.pets.filter(pet => pet.id !== id)
    }));
  };

  // Update pet
  const handleUpdatePet = (id: string, field: keyof Pet, value: string) => {
    setFormData(prev => ({
      ...prev,
      pets: prev.pets.map(pet =>
        pet.id === id ? { ...pet, [field]: value } : pet
      )
    }));
  };

  const handleSave = async () => {
    console.log('=== PETS ANIMAL CARE SAVE START ===');
    
    // Show immediate feedback
    toast({
      title: "Saving pets & animal care information...",
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
        const result = await syncForm(user.email, 'petsAnimalCareData', formData);
        console.log('Sync result:', result);
        
        if (result.success) {
          toast({
            title: "Success!",
            description: "Your pets & animal care information has been saved to the database.",
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
        description: "Please log in to save your pets & animal care information to the database.",
        variant: "destructive",
      });
    }

    console.log('=== PETS ANIMAL CARE SAVE END ===');
    onNext();
  };

  // PDF generation handler
  const handleGeneratePDF = () => {
    generatePDF({
      sectionTitle: 'Pets & Animal Care',
      data: formData,
      formType: 'pets'
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-bold" style={{ color: '#E4B64A', fontSize: '28px' }}>Pets & Animal Care</CardTitle>
        <p className="text-lg" style={{ color: '#153A4B' }}>
          Compassionate care for your companions, no matter what. Each pet can have their own legacy wishes and go to different people.
        </p>
        <AudioPlayer audioFile="Section_11.mp3" size="md" sectionNumber={11} />
      </CardHeader>
      <CardContent>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          
          {/* Add New Pet */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold" style={{ color: '#153A4B' }}>Add New Pet</h3>
            
            <div className="border p-6 rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Pet Name</Label>
                  <Input
                    value={newPet.name}
                    onChange={(e) => setNewPet(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter pet name"
                  />
                </div>
                <div>
                  <Label>Species/Breed</Label>
                  <Input
                    value={newPet.speciesBreed}
                    onChange={(e) => setNewPet(prev => ({ ...prev, speciesBreed: e.target.value }))}
                    placeholder="e.g., Golden Retriever, Domestic Cat"
                  />
                </div>
                <div>
                  <Label>Age</Label>
                  <Input
                    value={newPet.age}
                    onChange={(e) => setNewPet(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="Enter age"
                  />
                </div>
                <div>
                  <Label>Microchipped</Label>
                  <RadioGroup value={newPet.chipped} onValueChange={(value) => setNewPet(prev => ({ ...prev, chipped: value }))}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="chipped-yes-new" />
                      <Label htmlFor="chipped-yes-new">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="chipped-no-new" />
                      <Label htmlFor="chipped-no-new">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Diet Needs</Label>
                  <Input
                    value={newPet.dietNeeds}
                    onChange={(e) => setNewPet(prev => ({ ...prev, dietNeeds: e.target.value }))}
                    placeholder="e.g., Senior dog food, twice daily"
                  />
                </div>
                <div>
                  <Label>Feeding Times</Label>
                  <Input
                    value={newPet.feedingTimes}
                    onChange={(e) => setNewPet(prev => ({ ...prev, feedingTimes: e.target.value }))}
                    placeholder="e.g., 7:00 AM and 6:00 PM"
                  />
                </div>
              </div>

              <div className="mb-4">
                <Label>Medical Needs</Label>
                <Textarea
                  value={newPet.medicalNeeds}
                  onChange={(e) => setNewPet(prev => ({ ...prev, medicalNeeds: e.target.value }))}
                  placeholder="Describe any medical conditions, medications, or special care needs"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <Label>General Notes</Label>
                <Textarea
                  value={newPet.notes}
                  onChange={(e) => setNewPet(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional notes about this pet's personality, preferences, etc."
                  rows={3}
                />
              </div>

              {/* Legacy Wishes for this specific pet */}
              <div className="border-t pt-4 mb-4">
                <h4 className="font-semibold mb-3" style={{ color: '#153A4B' }}>Legacy Wishes for {newPet.name || 'this pet'}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>What should happen to this pet?</Label>
                    <RadioGroup value={newPet.legacyWish} onValueChange={(value) => setNewPet(prev => ({ ...prev, legacyWish: value }))}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="keep-in-family" id="keep-family-new" />
                        <Label htmlFor="keep-family-new">Keep in Family</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rehome" id="rehome-new" />
                        <Label htmlFor="rehome-new">Rehome</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="shelter-placement" id="shelter-new" />
                        <Label htmlFor="shelter-new">Shelter Placement</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label>Who should receive this pet?</Label>
                    <Input
                      value={newPet.legacyRecipient}
                      onChange={(e) => setNewPet(prev => ({ ...prev, legacyRecipient: e.target.value }))}
                      placeholder="e.g., Sarah Johnson (daughter), Local Rescue"
                    />
                  </div>
                </div>

                <div>
                  <Label>Legacy Notes for this pet</Label>
                  <Textarea
                    value={newPet.legacyNotes}
                    onChange={(e) => setNewPet(prev => ({ ...prev, legacyNotes: e.target.value }))}
                    placeholder="Special instructions or reasons for this pet's placement"
                    rows={3}
                  />
                </div>
              </div>
              
              <Button 
                type="button" 
                onClick={handleAddPet}
                variant="skillbinder_yellow"
                className="skillbinder_yellow w-full"
              >
                <div className="flex items-center space-x-2">
                  <PawPrint className="h-4 w-4" />
                  <span>Add Pet</span>
                </div>
              </Button>
            </div>
          </div>

          {/* Your Pets */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold" style={{ color: '#153A4B' }}>Your Pets</h3>
            
            {formData.pets.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                <p>No pets added yet. Add your first pet above.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {formData.pets.map((pet, index) => (
                  <div key={pet.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold" style={{ color: '#153A4B' }}>{pet.name} - {pet.speciesBreed}</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemovePet(pet.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Age</Label>
                          <Input
                            value={pet.age}
                            onChange={(e) => handleUpdatePet(pet.id, 'age', e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Microchipped</Label>
                          <RadioGroup value={pet.chipped} onValueChange={(value) => handleUpdatePet(pet.id, 'chipped', value)}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Yes" id={`chipped-yes-${pet.id}`} />
                              <Label htmlFor={`chipped-yes-${pet.id}`} className="text-sm">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="No" id={`chipped-no-${pet.id}`} />
                              <Label htmlFor={`chipped-no-${pet.id}`} className="text-sm">No</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Feeding Times</Label>
                          <Input
                            value={pet.feedingTimes}
                            onChange={(e) => handleUpdatePet(pet.id, 'feedingTimes', e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Diet Needs</Label>
                          <Input
                            value={pet.dietNeeds}
                            onChange={(e) => handleUpdatePet(pet.id, 'dietNeeds', e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Medical Needs</Label>
                          <Textarea
                            value={pet.medicalNeeds}
                            onChange={(e) => handleUpdatePet(pet.id, 'medicalNeeds', e.target.value)}
                            className="text-sm"
                            rows={2}
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">General Notes</Label>
                        <Textarea
                          value={pet.notes}
                          onChange={(e) => handleUpdatePet(pet.id, 'notes', e.target.value)}
                          className="text-sm"
                          rows={2}
                        />
                      </div>

                      {/* Legacy Wishes for this specific pet */}
                      <div className="border-t pt-4">
                        <h5 className="font-medium mb-3" style={{ color: '#153A4B' }}>Legacy Wishes for {pet.name}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Legacy Wish</Label>
                            <RadioGroup value={pet.legacyWish} onValueChange={(value) => handleUpdatePet(pet.id, 'legacyWish', value)}>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="keep-in-family" id={`keep-family-${pet.id}`} />
                                <Label htmlFor={`keep-family-${pet.id}`} className="text-sm">Keep in Family</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="rehome" id={`rehome-${pet.id}`} />
                                <Label htmlFor={`rehome-${pet.id}`} className="text-sm">Rehome</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="shelter-placement" id={`shelter-${pet.id}`} />
                                <Label htmlFor={`shelter-${pet.id}`} className="text-sm">Shelter Placement</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Recipient</Label>
                            <Input
                              value={pet.legacyRecipient}
                              onChange={(e) => handleUpdatePet(pet.id, 'legacyRecipient', e.target.value)}
                              className="text-sm"
                            />
                          </div>
                        </div>
                        <div className="mt-2">
                          <Label className="text-sm font-medium">Legacy Notes</Label>
                          <Textarea
                            value={pet.legacyNotes}
                            onChange={(e) => handleUpdatePet(pet.id, 'legacyNotes', e.target.value)}
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

          {/* Veterinarian Information */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold" style={{ color: '#153A4B' }}>Veterinarian Information</h3>
            
            <div className="border p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Clinic Name</Label>
                  <Input
                    value={formData.veterinarian.clinicName}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      veterinarian: { ...prev.veterinarian, clinicName: e.target.value }
                    }))}
                    placeholder="Enter clinic name"
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    value={formData.veterinarian.phone}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      setFormData(prev => ({ 
                        ...prev, 
                        veterinarian: { ...prev.veterinarian, phone: formatted.formatted }
                      }));
                    }}
                    placeholder="(555) 123-4567 or +1 234 567 8900"
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    value={formData.veterinarian.address}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      veterinarian: { ...prev.veterinarian, address: e.target.value }
                    }))}
                    placeholder="Enter clinic address"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={formData.veterinarian.email}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      veterinarian: { ...prev.veterinarian, email: e.target.value }
                    }))}
                    placeholder="Enter clinic email"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pet Insurance */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold" style={{ color: '#153A4B' }}>Pet Insurance</h3>
            
            <div className="border p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Insurance Provider</Label>
                  <Input
                    value={formData.insuranceProvider}
                    onChange={(e) => handleFieldChange('insuranceProvider', e.target.value)}
                    placeholder="Enter insurance provider"
                  />
                </div>
                <div>
                  <Label>Policy Number</Label>
                  <Input
                    value={formData.policyNumber}
                    onChange={(e) => handleFieldChange('policyNumber', e.target.value)}
                    placeholder="Enter policy number"
                  />
                </div>
                <div>
                  <Label>Contact Info</Label>
                  <Input
                    value={formData.contactInfo}
                    onChange={(e) => handleFieldChange('contactInfo', e.target.value)}
                    placeholder="Enter contact information"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Primary & Backup Caregivers */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold" style={{ color: '#153A4B' }}>Primary & Backup Caregivers</h3>
            
            <div className="border p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3" style={{ color: '#153A4B' }}>Primary Caregiver</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={formData.primaryCaregiverName}
                        onChange={(e) => handleFieldChange('primaryCaregiverName', e.target.value)}
                        placeholder="Enter primary caregiver name"
                      />
                    </div>
                    <div>
                      <Label>Contact Information</Label>
                      <Input
                        value={formData.primaryCaregiverContact}
                        onChange={(e) => handleFieldChange('primaryCaregiverContact', e.target.value)}
                        placeholder="Enter contact information"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3" style={{ color: '#153A4B' }}>Backup Caregiver</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={formData.backupCaregiverName}
                        onChange={(e) => handleFieldChange('backupCaregiverName', e.target.value)}
                        placeholder="Enter backup caregiver name"
                      />
                    </div>
                    <div>
                      <Label>Contact Information</Label>
                      <Input
                        value={formData.backupCaregiverContact}
                        onChange={(e) => handleFieldChange('backupCaregiverContact', e.target.value)}
                        placeholder="Enter contact information"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supplies & Comfort Items */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold" style={{ color: '#153A4B' }}>Supplies & Comfort Items</h3>
            
            <div className="border p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Important Items (bed, toy, blanket)</Label>
                  <Textarea
                    value={formData.importantItems}
                    onChange={(e) => handleFieldChange('importantItems', e.target.value)}
                    placeholder="Enter important items for your pets"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Item Locations</Label>
                  <Textarea
                    value={formData.itemLocations}
                    onChange={(e) => handleFieldChange('itemLocations', e.target.value)}
                    placeholder="Enter locations of important items"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* General Legacy Notes */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold" style={{ color: '#153A4B' }}>General Legacy Notes</h3>
            
            <div className="border p-6 rounded-lg">
              <div>
                <Label>Additional Notes for All Pets</Label>
                <Textarea
                  value={formData.generalLegacyNotes}
                  onChange={(e) => handleFieldChange('generalLegacyNotes', e.target.value)}
                  placeholder="Any general notes about pet care, veterinary records, or overall legacy wishes"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Instructions for Foster or Rehoming */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold" style={{ color: '#153A4B' }}>Instructions for Foster or Rehoming</h3>
            
            <div className="border p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Preferred Organization or Person</Label>
                  <Input
                    value={formData.preferredOrganization}
                    onChange={(e) => handleFieldChange('preferredOrganization', e.target.value)}
                    placeholder="Enter preferred organization or person"
                  />
                </div>
                <div>
                  <Label>Contact Info & Notes</Label>
                  <Textarea
                    value={formData.rehomingNotes}
                    onChange={(e) => handleFieldChange('rehomingNotes', e.target.value)}
                    placeholder="Enter contact information and notes for foster or rehoming"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onPrevious}
            >
              Previous
            </Button>
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

export default PetsAnimalCareForm; 