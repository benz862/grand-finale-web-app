import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { generatePDF } from '../lib/pdfGenerator';
import AudioPlayer from './AudioPlayer';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useTrial } from '@/contexts/TrialContext';
import { supabase } from '@/lib/supabase';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

interface FriendContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

interface ProfessionalContact {
  id: string;
  name: string;
  duty: string;
  phone: string;
  email: string;
}

interface HealthcareContact {
  id: string;
  name: string;
  duty: string;
  phone: string;
  email: string;
}

interface HouseholdContact {
  id: string;
  name: string;
  duty: string;
  phone: string;
  email: string;
}

interface PetContact {
  id: string;
  name: string;
  duty: string;
  phone: string;
  email: string;
}

interface NotificationContact {
  id: string;
  notifyStatus: string;
  name: string;
  affiliation: string;
  phone: string;
  email: string;
}

interface KeyContactsData {
  // Repeatable sections
  familyMembers: FamilyMember[];
  friendsContacts: FriendContact[];
  professionalContacts: ProfessionalContact[];
  healthcareContacts: HealthcareContact[];
  householdContacts: HouseholdContact[];
  petContacts: PetContact[];
  notificationContacts: NotificationContact[];
}

interface KeyContactsFormProps {
  onNext: () => void;
  onPrevious: () => void;
  initialData?: Partial<KeyContactsData>;
}

const KeyContactsForm: React.FC<KeyContactsFormProps> = ({
  onNext,
  onPrevious,
  initialData = {}
}) => {
  const { syncForm } = useDatabaseSync();
  const { userTier, isTrial } = useTrial();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [userInfo, setUserInfo] = useState<{ firstName?: string; lastName?: string; email?: string }>({});
  const [formData, setFormData] = useState<KeyContactsData>({
    familyMembers: initialData.familyMembers || [{ id: '1', name: '', relationship: '', phone: '', email: '' }],
    friendsContacts: initialData.friendsContacts || [{ id: '1', name: '', relationship: '', phone: '', email: '' }],
    professionalContacts: initialData.professionalContacts || [{ id: '1', name: '', duty: '', phone: '', email: '' }],
    healthcareContacts: initialData.healthcareContacts || [{ id: '1', name: '', duty: '', phone: '', email: '' }],
    householdContacts: initialData.householdContacts || [{ id: '1', name: '', duty: '', phone: '', email: '' }],
    petContacts: initialData.petContacts || [{ id: '1', name: '', duty: '', phone: '', email: '' }],
    notificationContacts: initialData.notificationContacts || [{ id: '1', notifyStatus: '', name: '', affiliation: '', phone: '', email: '' }]
  });

  // Family Members functions
  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: '',
      relationship: '',
      phone: '',
      email: ''
    };
    setFormData(prev => ({
      ...prev,
      familyMembers: [...prev.familyMembers, newMember]
    }));
  };

  const updateFamilyMember = (id: string, field: keyof FamilyMember, value: string) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.map(member =>
        member.id === id ? { ...member, [field]: value } : member
      )
    }));
  };

  const removeFamilyMember = (id: string) => {
    if (formData.familyMembers.length > 1) {
      setFormData(prev => ({
        ...prev,
        familyMembers: prev.familyMembers.filter(member => member.id !== id)
      }));
    }
  };

  // Friends & Chosen Family functions
  const addFriendContact = () => {
    const newContact: FriendContact = {
      id: Date.now().toString(),
      name: '',
      relationship: '',
      phone: '',
      email: ''
    };
    setFormData(prev => ({
      ...prev,
      friendsContacts: [...prev.friendsContacts, newContact]
    }));
  };

  const updateFriendContact = (id: string, field: keyof FriendContact, value: string) => {
    setFormData(prev => ({
      ...prev,
      friendsContacts: prev.friendsContacts.map(contact =>
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const removeFriendContact = (id: string) => {
    if (formData.friendsContacts.length > 1) {
      setFormData(prev => ({
        ...prev,
        friendsContacts: prev.friendsContacts.filter(contact => contact.id !== id)
      }));
    }
  };

  // Legal & Financial Professionals functions
  const addProfessionalContact = () => {
    const newContact: ProfessionalContact = {
      id: Date.now().toString(),
      name: '',
      duty: '',
      phone: '',
      email: ''
    };
    setFormData(prev => ({
      ...prev,
      professionalContacts: [...prev.professionalContacts, newContact]
    }));
  };

  const updateProfessionalContact = (id: string, field: keyof ProfessionalContact, value: string) => {
    setFormData(prev => ({
      ...prev,
      professionalContacts: prev.professionalContacts.map(contact =>
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const removeProfessionalContact = (id: string) => {
    if (formData.professionalContacts.length > 1) {
      setFormData(prev => ({
        ...prev,
        professionalContacts: prev.professionalContacts.filter(contact => contact.id !== id)
      }));
    }
  };

  // Medical Professionals functions
  const addHealthcareContact = () => {
    const newContact: HealthcareContact = {
      id: Date.now().toString(),
      name: '',
      duty: '',
      phone: '',
      email: ''
    };
    setFormData(prev => ({
      ...prev,
      healthcareContacts: [...prev.healthcareContacts, newContact]
    }));
  };

  const updateHealthcareContact = (id: string, field: keyof HealthcareContact, value: string) => {
    setFormData(prev => ({
      ...prev,
      healthcareContacts: prev.healthcareContacts.map(contact =>
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const removeHealthcareContact = (id: string) => {
    if (formData.healthcareContacts.length > 1) {
      setFormData(prev => ({
        ...prev,
        healthcareContacts: prev.healthcareContacts.filter(contact => contact.id !== id)
      }));
    }
  };

  // Household Helpers functions
  const addHouseholdContact = () => {
    const newContact: HouseholdContact = {
      id: Date.now().toString(),
      name: '',
      duty: '',
      phone: '',
      email: ''
    };
    setFormData(prev => ({
      ...prev,
      householdContacts: [...prev.householdContacts, newContact]
    }));
  };

  const updateHouseholdContact = (id: string, field: keyof HouseholdContact, value: string) => {
    setFormData(prev => ({
      ...prev,
      householdContacts: prev.householdContacts.map(contact =>
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const removeHouseholdContact = (id: string) => {
    if (formData.householdContacts.length > 1) {
      setFormData(prev => ({
        ...prev,
        householdContacts: prev.householdContacts.filter(contact => contact.id !== id)
      }));
    }
  };

  // Pet Professionals functions
  const addPetContact = () => {
    const newContact: PetContact = {
      id: Date.now().toString(),
      name: '',
      duty: '',
      phone: '',
      email: ''
    };
    setFormData(prev => ({
      ...prev,
      petContacts: [...prev.petContacts, newContact]
    }));
  };

  const updatePetContact = (id: string, field: keyof PetContact, value: string) => {
    setFormData(prev => ({
      ...prev,
      petContacts: prev.petContacts.map(contact =>
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const removePetContact = (id: string) => {
    if (formData.petContacts.length > 1) {
      setFormData(prev => ({
        ...prev,
        petContacts: prev.petContacts.filter(contact => contact.id !== id)
      }));
    }
  };

  // Notification List functions
  const addNotificationContact = () => {
    const newContact: NotificationContact = {
      id: Date.now().toString(),
      notifyStatus: '',
      name: '',
      affiliation: '',
      phone: '',
      email: ''
    };
    setFormData(prev => ({
      ...prev,
      notificationContacts: [...prev.notificationContacts, newContact]
    }));
  };

  const updateNotificationContact = (id: string, field: keyof NotificationContact, value: string) => {
    setFormData(prev => ({
      ...prev,
      notificationContacts: prev.notificationContacts.map(contact =>
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const removeNotificationContact = (id: string) => {
    if (formData.notificationContacts.length > 1) {
      setFormData(prev => ({
        ...prev,
        notificationContacts: prev.notificationContacts.filter(contact => contact.id !== id)
      }));
    }
  };

  const handleSave = async () => {
    console.log('=== KEY CONTACTS SAVE START ===');
    
    // Show immediate feedback
    toast({
      title: "Saving key contacts information...",
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
        const result = await syncForm(user.email, 'keyContactsData', formData);
        console.log('Sync result:', result);
        
        if (result.success) {
          toast({
            title: "Success!",
            description: "Your key contacts information has been saved to the database.",
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
        description: "Please log in to save your key contacts information to the database.",
        variant: "destructive",
      });
    }

    console.log('=== KEY CONTACTS SAVE END ===');
    onNext();
  };

  // PDF generation handler
  const handleGeneratePDF = () => {
    generatePDF({
      sectionTitle: 'Key Contacts',
      data: formData,
      formType: 'keyContacts',
      userTier,
      isTrial,
      userInfo: userInfo
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-bold" style={{ color: '#E4B64A', fontSize: '28px' }}>Key Contacts</CardTitle>
        <p className="text-lg" style={{ color: '#153A4B' }}>
          Organize the most important people in your life for reference or emergency
        </p>
        <AudioPlayer audioFile="Section_8.mp3" size="md" sectionNumber={8} />
      </CardHeader>
      <CardContent>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <Accordion type="single" collapsible className="mb-6">
            {/* Immediate Family Members */}
            <AccordionItem value="family-members">
              <AccordionTrigger style={{ color: '#000000' }}>Immediate Family Members</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.familyMembers.map((member, index) => (
                      <div key={member.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Family Member {index + 1}</h4>
                          {formData.familyMembers.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFamilyMember(member.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`family-name-${member.id}`}>Name</Label>
                            <Input
                              id={`family-name-${member.id}`}
                              value={member.name}
                              onChange={(e) => updateFamilyMember(member.id, 'name', e.target.value)}
                              placeholder="Enter family member name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`family-relationship-${member.id}`}>Relationship</Label>
                            <Input
                              id={`family-relationship-${member.id}`}
                              value={member.relationship}
                              onChange={(e) => updateFamilyMember(member.id, 'relationship', e.target.value)}
                              placeholder="Enter relationship"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`family-phone-${member.id}`}>Phone</Label>
                            <Input
                              id={`family-phone-${member.id}`}
                              value={member.phone}
                              onChange={(e) => updateFamilyMember(member.id, 'phone', e.target.value)}
                              placeholder="Enter phone number"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`family-email-${member.id}`}>Email</Label>
                            <Input
                              id={`family-email-${member.id}`}
                              value={member.email}
                              onChange={(e) => updateFamilyMember(member.id, 'email', e.target.value)}
                              placeholder="Enter email address"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addFamilyMember} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Family Member
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Friends & Chosen Family */}
            <AccordionItem value="friends-contacts">
              <AccordionTrigger style={{ color: '#000000' }}>Friends & Chosen Family</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.friendsContacts.map((contact, index) => (
                      <div key={contact.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Contact {index + 1}</h4>
                          {formData.friendsContacts.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFriendContact(contact.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`friend-name-${contact.id}`}>Name</Label>
                            <Input
                              id={`friend-name-${contact.id}`}
                              value={contact.name}
                              onChange={(e) => updateFriendContact(contact.id, 'name', e.target.value)}
                              placeholder="Enter contact name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`friend-relationship-${contact.id}`}>Relationship</Label>
                            <Input
                              id={`friend-relationship-${contact.id}`}
                              value={contact.relationship}
                              onChange={(e) => updateFriendContact(contact.id, 'relationship', e.target.value)}
                              placeholder="Enter relationship"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`friend-phone-${contact.id}`}>Phone</Label>
                            <Input
                              id={`friend-phone-${contact.id}`}
                              value={contact.phone}
                              onChange={(e) => updateFriendContact(contact.id, 'phone', e.target.value)}
                              placeholder="Enter phone number"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`friend-email-${contact.id}`}>Email</Label>
                            <Input
                              id={`friend-email-${contact.id}`}
                              value={contact.email}
                              onChange={(e) => updateFriendContact(contact.id, 'email', e.target.value)}
                              placeholder="Enter email address"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addFriendContact} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Contact
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Legal & Financial Professionals */}
            <AccordionItem value="professional-contacts">
              <AccordionTrigger style={{ color: '#000000' }}>Legal & Financial Professionals</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.professionalContacts.map((contact, index) => (
                      <div key={contact.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Professional Contact {index + 1}</h4>
                          {formData.professionalContacts.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProfessionalContact(contact.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`professional-name-${contact.id}`}>Name</Label>
                            <Input
                              id={`professional-name-${contact.id}`}
                              value={contact.name}
                              onChange={(e) => updateProfessionalContact(contact.id, 'name', e.target.value)}
                              placeholder="Enter professional name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`professional-duty-${contact.id}`}>Duty (e.g. Attorney, CPA, etc.)</Label>
                            <Input
                              id={`professional-duty-${contact.id}`}
                              value={contact.duty}
                              onChange={(e) => updateProfessionalContact(contact.id, 'duty', e.target.value)}
                              placeholder="Enter professional duty"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`professional-phone-${contact.id}`}>Phone</Label>
                            <Input
                              id={`professional-phone-${contact.id}`}
                              value={contact.phone}
                              onChange={(e) => updateProfessionalContact(contact.id, 'phone', e.target.value)}
                              placeholder="Enter phone number"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`professional-email-${contact.id}`}>Email</Label>
                            <Input
                              id={`professional-email-${contact.id}`}
                              value={contact.email}
                              onChange={(e) => updateProfessionalContact(contact.id, 'email', e.target.value)}
                              placeholder="Enter email address"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addProfessionalContact} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Professional Contact
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Medical Professionals */}
            <AccordionItem value="healthcare-contacts">
              <AccordionTrigger style={{ color: '#000000' }}>Medical Professionals</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.healthcareContacts.map((contact, index) => (
                      <div key={contact.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Healthcare Contact {index + 1}</h4>
                          {formData.healthcareContacts.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeHealthcareContact(contact.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`healthcare-name-${contact.id}`}>Name</Label>
                            <Input
                              id={`healthcare-name-${contact.id}`}
                              value={contact.name}
                              onChange={(e) => updateHealthcareContact(contact.id, 'name', e.target.value)}
                              placeholder="Enter healthcare professional name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`healthcare-duty-${contact.id}`}>Duty (Physician, Caregiver, Healthcare Proxy)</Label>
                            <Input
                              id={`healthcare-duty-${contact.id}`}
                              value={contact.duty}
                              onChange={(e) => updateHealthcareContact(contact.id, 'duty', e.target.value)}
                              placeholder="Enter healthcare duty"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`healthcare-phone-${contact.id}`}>Phone</Label>
                            <Input
                              id={`healthcare-phone-${contact.id}`}
                              value={contact.phone}
                              onChange={(e) => updateHealthcareContact(contact.id, 'phone', e.target.value)}
                              placeholder="Enter phone number"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`healthcare-email-${contact.id}`}>Email</Label>
                            <Input
                              id={`healthcare-email-${contact.id}`}
                              value={contact.email}
                              onChange={(e) => updateHealthcareContact(contact.id, 'email', e.target.value)}
                              placeholder="Enter email address"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addHealthcareContact} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Healthcare Contact
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Household Helpers */}
            <AccordionItem value="household-contacts">
              <AccordionTrigger style={{ color: '#000000' }}>Household Helpers</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.householdContacts.map((contact, index) => (
                      <div key={contact.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Household Contact {index + 1}</h4>
                          {formData.householdContacts.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeHouseholdContact(contact.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`household-name-${contact.id}`}>Name</Label>
                            <Input
                              id={`household-name-${contact.id}`}
                              value={contact.name}
                              onChange={(e) => updateHouseholdContact(contact.id, 'name', e.target.value)}
                              placeholder="Enter household helper name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`household-duty-${contact.id}`}>Duty (Hairdresser, Handyman, Mechanic, Housekeeper)</Label>
                            <Input
                              id={`household-duty-${contact.id}`}
                              value={contact.duty}
                              onChange={(e) => updateHouseholdContact(contact.id, 'duty', e.target.value)}
                              placeholder="Enter household duty"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`household-phone-${contact.id}`}>Phone</Label>
                            <Input
                              id={`household-phone-${contact.id}`}
                              value={contact.phone}
                              onChange={(e) => updateHouseholdContact(contact.id, 'phone', e.target.value)}
                              placeholder="Enter phone number"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`household-email-${contact.id}`}>Email</Label>
                            <Input
                              id={`household-email-${contact.id}`}
                              value={contact.email}
                              onChange={(e) => updateHouseholdContact(contact.id, 'email', e.target.value)}
                              placeholder="Enter email address"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addHouseholdContact} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Household Contact
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Pet Professionals */}
            <AccordionItem value="pet-contacts">
              <AccordionTrigger style={{ color: '#000000' }}>Pet Professionals</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.petContacts.map((contact, index) => (
                      <div key={contact.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Pet Contact {index + 1}</h4>
                          {formData.petContacts.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePetContact(contact.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`pet-name-${contact.id}`}>Name</Label>
                            <Input
                              id={`pet-name-${contact.id}`}
                              value={contact.name}
                              onChange={(e) => updatePetContact(contact.id, 'name', e.target.value)}
                              placeholder="Enter pet professional name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`pet-duty-${contact.id}`}>Duty (Vet, Groomer, Sitter, etc.)</Label>
                            <Input
                              id={`pet-duty-${contact.id}`}
                              value={contact.duty}
                              onChange={(e) => updatePetContact(contact.id, 'duty', e.target.value)}
                              placeholder="Enter pet professional duty"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`pet-phone-${contact.id}`}>Phone</Label>
                            <Input
                              id={`pet-phone-${contact.id}`}
                              value={contact.phone}
                              onChange={(e) => updatePetContact(contact.id, 'phone', e.target.value)}
                              placeholder="Enter phone number"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`pet-email-${contact.id}`}>Email</Label>
                            <Input
                              id={`pet-email-${contact.id}`}
                              value={contact.email}
                              onChange={(e) => updatePetContact(contact.id, 'email', e.target.value)}
                              placeholder="Enter email address"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addPetContact} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Pet Contact
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Notification List */}
            <AccordionItem value="notification-contacts">
              <AccordionTrigger style={{ color: '#000000' }}>Notification List</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.notificationContacts.map((contact, index) => (
                      <div key={contact.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Notification Contact {index + 1}</h4>
                          {formData.notificationContacts.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeNotificationContact(contact.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label>Notify Status</Label>
                            <RadioGroup value={contact.notifyStatus} onValueChange={(value) => updateNotificationContact(contact.id, 'notifyStatus', value)}>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="notify" id={`notify-${contact.id}`} />
                                <Label htmlFor={`notify-${contact.id}`}>Notify</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="do-not-notify" id={`do-not-notify-${contact.id}`} />
                                <Label htmlFor={`do-not-notify-${contact.id}`}>Do NOT Notify</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`notification-name-${contact.id}`}>Name</Label>
                              <Input
                                id={`notification-name-${contact.id}`}
                                value={contact.name}
                                onChange={(e) => updateNotificationContact(contact.id, 'name', e.target.value)}
                                placeholder="Enter contact name"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`notification-affiliation-${contact.id}`}>Affiliation to You</Label>
                              <Input
                                id={`notification-affiliation-${contact.id}`}
                                value={contact.affiliation}
                                onChange={(e) => updateNotificationContact(contact.id, 'affiliation', e.target.value)}
                                placeholder="Enter affiliation"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`notification-phone-${contact.id}`}>Phone</Label>
                              <Input
                                id={`notification-phone-${contact.id}`}
                                value={contact.phone}
                                onChange={(e) => updateNotificationContact(contact.id, 'phone', e.target.value)}
                                placeholder="Enter phone number"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`notification-email-${contact.id}`}>Email</Label>
                              <Input
                                id={`notification-email-${contact.id}`}
                                value={contact.email}
                                onChange={(e) => updateNotificationContact(contact.id, 'email', e.target.value)}
                                placeholder="Enter email address"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addNotificationContact} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Notification Contact
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

export default KeyContactsForm; 