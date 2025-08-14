import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { generatePDF } from '../lib/pdfGenerator';
import AudioPlayer from './AudioPlayer';
import { useTrial } from '../contexts/TrialContext';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface AccountEntry {
  id: string;
  serviceName: string;
  username: string;
  password: string;
}

interface ClubEntry {
  id: string;
  clubName: string;
  membershipType: string;
  notes: string;
}

interface AccountsMembershipsData {
  // Clubs & Memberships
  clubs: ClubEntry[];
  
  // Repeatable sections
  streamingSubscriptions: AccountEntry[];
  shoppingDeliveryServices: AccountEntry[];
  financialAppsWallets: AccountEntry[];
  publicationsMemberships: AccountEntry[];
  rewardsPointsPrograms: AccountEntry[];
  frequentFlyerAccounts: AccountEntry[];
  phoneInternetUtilities: AccountEntry[];
  
  // Store & Travel Loyalty Programs
  storeTravelLoyalty: string;
  
  // Miscellaneous
  miscellaneous: string;
}

interface AccountsMembershipsFormProps {
  onNext: () => void;
  onPrevious: () => void;
  initialData?: Partial<AccountsMembershipsData>;
}

const AccountsMembershipsForm: React.FC<AccountsMembershipsFormProps> = ({
  onNext,
  onPrevious,
  initialData = {}
}) => {
  const { userTier, isTrial } = useTrial();
  const { syncForm } = useDatabaseSync();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<AccountsMembershipsData>({
    clubs: initialData.clubs || [{ id: '1', clubName: '', membershipType: '', notes: '' }],
    streamingSubscriptions: initialData.streamingSubscriptions || [{ id: '1', serviceName: '', username: '', password: '' }],
    shoppingDeliveryServices: initialData.shoppingDeliveryServices || [{ id: '1', serviceName: '', username: '', password: '' }],
    financialAppsWallets: initialData.financialAppsWallets || [{ id: '1', serviceName: '', username: '', password: '' }],
    publicationsMemberships: initialData.publicationsMemberships || [{ id: '1', serviceName: '', username: '', password: '' }],
    rewardsPointsPrograms: initialData.rewardsPointsPrograms || [{ id: '1', serviceName: '', username: '', password: '' }],
    frequentFlyerAccounts: initialData.frequentFlyerAccounts || [{ id: '1', serviceName: '', username: '', password: '' }],
    phoneInternetUtilities: initialData.phoneInternetUtilities || [{ id: '1', serviceName: '', username: '', password: '' }],
    storeTravelLoyalty: initialData.storeTravelLoyalty || '',
    miscellaneous: initialData.miscellaneous || ''
  });

  const handleFieldChange = (field: keyof AccountsMembershipsData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Generic functions for managing repeatable entries
  const addEntry = (field: keyof Pick<AccountsMembershipsData, 'streamingSubscriptions' | 'shoppingDeliveryServices' | 'financialAppsWallets' | 'publicationsMemberships' | 'rewardsPointsPrograms' | 'frequentFlyerAccounts' | 'phoneInternetUtilities'>) => {
    const newEntry: AccountEntry = {
      id: Date.now().toString(),
      serviceName: '',
      username: '',
      password: ''
    };
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], newEntry]
    }));
  };

  const addClubEntry = () => {
    const newEntry: ClubEntry = {
      id: Date.now().toString(),
      clubName: '',
      membershipType: '',
      notes: ''
    };
    setFormData(prev => ({
      ...prev,
      clubs: [...prev.clubs, newEntry]
    }));
  };

  const updateEntry = (field: keyof Pick<AccountsMembershipsData, 'streamingSubscriptions' | 'shoppingDeliveryServices' | 'financialAppsWallets' | 'publicationsMemberships' | 'rewardsPointsPrograms' | 'frequentFlyerAccounts' | 'phoneInternetUtilities'>, id: string, fieldName: keyof AccountEntry, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map(entry =>
        entry.id === id ? { ...entry, [fieldName]: value } : entry
      )
    }));
  };

  const updateClubEntry = (id: string, fieldName: keyof ClubEntry, value: string) => {
    setFormData(prev => ({
      ...prev,
      clubs: prev.clubs.map(entry =>
        entry.id === id ? { ...entry, [fieldName]: value } : entry
      )
    }));
  };

  const removeEntry = (field: keyof Pick<AccountsMembershipsData, 'streamingSubscriptions' | 'shoppingDeliveryServices' | 'financialAppsWallets' | 'publicationsMemberships' | 'rewardsPointsPrograms' | 'frequentFlyerAccounts' | 'phoneInternetUtilities'>, id: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(entry => entry.id !== id)
    }));
  };

  const removeClubEntry = (id: string) => {
    setFormData(prev => ({
      ...prev,
      clubs: prev.clubs.filter(entry => entry.id !== id)
    }));
  };

  // Helper function to filter entries - only show entries with data or the last empty entry
  const getVisibleEntries = (entries: AccountEntry[]) => {
    const entriesWithData = entries.filter(entry => 
      entry.serviceName.trim() !== '' || entry.username.trim() !== '' || entry.password.trim() !== ''
    );
    
    // If there are entries with data, show them plus one empty entry at the end
    if (entriesWithData.length > 0) {
      const emptyEntries = entries.filter(entry => 
        entry.serviceName.trim() === '' && entry.username.trim() === '' && entry.password.trim() === ''
      );
      return [...entriesWithData, ...emptyEntries.slice(0, 1)];
    }
    
    // If no entries with data, show just one empty entry
    return entries.slice(0, 1);
  };

  const getVisibleClubEntries = (entries: ClubEntry[]) => {
    const entriesWithData = entries.filter(entry => 
      entry.clubName.trim() !== '' || entry.membershipType.trim() !== '' || entry.notes.trim() !== ''
    );
    
    // If there are entries with data, show them plus one empty entry at the end
    if (entriesWithData.length > 0) {
      const emptyEntries = entries.filter(entry => 
        entry.clubName.trim() === '' && entry.membershipType.trim() === '' && entry.notes.trim() === ''
      );
      return [...entriesWithData, ...emptyEntries.slice(0, 1)];
    }
    
    // If no entries with data, show just one empty entry
    return entries.slice(0, 1);
  };

  const handleSave = async () => {
    console.log('=== ACCOUNTS MEMBERSHIPS SAVE START ===');
    
    // Show immediate feedback
    toast({
      title: "Saving accounts & memberships information...",
      description: "Please wait while we save your data.",
    });

    // Data will be saved to database only
    console.log('Accounts memberships data will be saved to database');

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
        const result = await syncForm(user.email, 'accountsMembershipsData', formData);
        console.log('Sync result:', result);
        
        if (result.success) {
          toast({
            title: "Success!",
            description: "Your accounts & memberships information has been saved to the database and locally.",
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
        description: "Your accounts & memberships information has been saved locally. Please log in to sync to the cloud.",
      });
    }

    console.log('=== ACCOUNTS MEMBERSHIPS SAVE END ===');
    onNext();
  };

  // PDF generation handler
  const handleGeneratePDF = () => {
    generatePDF({
      sectionTitle: 'Accounts & Memberships',
      data: formData,
      formType: 'accounts',
      userTier,
      isTrial
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-bold" style={{ color: '#E4B64A', fontSize: '28px' }}>Accounts & Memberships</CardTitle>
        <p className="text-lg" style={{ color: '#153A4B' }}>
          Keep track of all your member accounts and digital access credentials.
        </p>
        <AudioPlayer audioFile="Section_10.mp3" size="md" sectionNumber={10} />
      </CardHeader>
      <CardContent>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <Accordion type="single" collapsible className="mb-6">
            {/* Clubs & Memberships */}
            <AccordionItem value="clubs-memberships">
              <AccordionTrigger style={{ color: '#000000' }}>Clubs & Memberships</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {getVisibleClubEntries(formData.clubs).map((entry, index) => (
                      <div key={entry.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Club {index + 1}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeClubEntry(entry.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor={`club-name-${entry.id}`}>Club Name</Label>
                            <Input
                              id={`club-name-${entry.id}`}
                              value={entry.clubName}
                              onChange={(e) => updateClubEntry(entry.id, 'clubName', e.target.value)}
                              placeholder="Enter club name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`membership-type-${entry.id}`}>Membership Type</Label>
                            <Input
                              id={`membership-type-${entry.id}`}
                              value={entry.membershipType}
                              onChange={(e) => updateClubEntry(entry.id, 'membershipType', e.target.value)}
                              placeholder="Enter membership type"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`club-notes-${entry.id}`}>Notes</Label>
                            <Textarea
                              id={`club-notes-${entry.id}`}
                              value={entry.notes}
                              onChange={(e) => updateClubEntry(entry.id, 'notes', e.target.value)}
                              placeholder="Enter any notes"
                              rows={1}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button type="button" onClick={addClubEntry} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Club
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Streaming & Subscriptions */}
            <AccordionItem value="streaming-subscriptions">
              <AccordionTrigger style={{ color: '#000000' }}>Streaming & Subscriptions</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {getVisibleEntries(formData.streamingSubscriptions).map((entry, index) => (
                      <div key={entry.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Streaming Service {index + 1}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEntry('streamingSubscriptions', entry.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor={`streaming-service-${entry.id}`}>Service Name</Label>
                            <Input
                              id={`streaming-service-${entry.id}`}
                              value={entry.serviceName}
                              onChange={(e) => updateEntry('streamingSubscriptions', entry.id, 'serviceName', e.target.value)}
                              placeholder="Enter service name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`streaming-username-${entry.id}`}>Username</Label>
                            <Input
                              id={`streaming-username-${entry.id}`}
                              value={entry.username}
                              onChange={(e) => updateEntry('streamingSubscriptions', entry.id, 'username', e.target.value)}
                              placeholder="Enter username"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`streaming-password-${entry.id}`}>Password</Label>
                            <Input
                              id={`streaming-password-${entry.id}`}
                              type="password"
                              value={entry.password}
                              onChange={(e) => updateEntry('streamingSubscriptions', entry.id, 'password', e.target.value)}
                              placeholder="Enter password"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button type="button" onClick={() => addEntry('streamingSubscriptions')} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Streaming Service
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Shopping & Delivery Services */}
            <AccordionItem value="shopping-delivery">
              <AccordionTrigger style={{ color: '#000000' }}>Shopping & Delivery Services</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {getVisibleEntries(formData.shoppingDeliveryServices).map((entry, index) => (
                      <div key={entry.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Shopping Service {index + 1}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEntry('shoppingDeliveryServices', entry.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor={`shopping-service-${entry.id}`}>Service Name</Label>
                            <Input
                              id={`shopping-service-${entry.id}`}
                              value={entry.serviceName}
                              onChange={(e) => updateEntry('shoppingDeliveryServices', entry.id, 'serviceName', e.target.value)}
                              placeholder="Enter service name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`shopping-username-${entry.id}`}>Username</Label>
                            <Input
                              id={`shopping-username-${entry.id}`}
                              value={entry.username}
                              onChange={(e) => updateEntry('shoppingDeliveryServices', entry.id, 'username', e.target.value)}
                              placeholder="Enter username"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`shopping-password-${entry.id}`}>Password</Label>
                            <Input
                              id={`shopping-password-${entry.id}`}
                              type="password"
                              value={entry.password}
                              onChange={(e) => updateEntry('shoppingDeliveryServices', entry.id, 'password', e.target.value)}
                              placeholder="Enter password"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button type="button" onClick={() => addEntry('shoppingDeliveryServices')} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Shopping Service
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Financial Apps & Wallets */}
            <AccordionItem value="financial-apps">
              <AccordionTrigger style={{ color: '#000000' }}>Financial Apps & Wallets</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {getVisibleEntries(formData.financialAppsWallets).map((entry, index) => (
                      <div key={entry.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Financial App {index + 1}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEntry('financialAppsWallets', entry.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor={`financial-service-${entry.id}`}>Service Name</Label>
                            <Input
                              id={`financial-service-${entry.id}`}
                              value={entry.serviceName}
                              onChange={(e) => updateEntry('financialAppsWallets', entry.id, 'serviceName', e.target.value)}
                              placeholder="Enter service name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`financial-username-${entry.id}`}>Username</Label>
                            <Input
                              id={`financial-username-${entry.id}`}
                              value={entry.username}
                              onChange={(e) => updateEntry('financialAppsWallets', entry.id, 'username', e.target.value)}
                              placeholder="Enter username"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`financial-password-${entry.id}`}>Password</Label>
                            <Input
                              id={`financial-password-${entry.id}`}
                              type="password"
                              value={entry.password}
                              onChange={(e) => updateEntry('financialAppsWallets', entry.id, 'password', e.target.value)}
                              placeholder="Enter password"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button type="button" onClick={() => addEntry('financialAppsWallets')} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Financial App
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Publications & Memberships */}
            <AccordionItem value="publications-memberships">
              <AccordionTrigger style={{ color: '#000000' }}>Publications & Memberships</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {getVisibleEntries(formData.publicationsMemberships).map((entry, index) => (
                      <div key={entry.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Publication {index + 1}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEntry('publicationsMemberships', entry.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor={`publication-service-${entry.id}`}>Service Name</Label>
                            <Input
                              id={`publication-service-${entry.id}`}
                              value={entry.serviceName}
                              onChange={(e) => updateEntry('publicationsMemberships', entry.id, 'serviceName', e.target.value)}
                              placeholder="Enter service name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`publication-username-${entry.id}`}>Username</Label>
                            <Input
                              id={`publication-username-${entry.id}`}
                              value={entry.username}
                              onChange={(e) => updateEntry('publicationsMemberships', entry.id, 'username', e.target.value)}
                              placeholder="Enter username"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`publication-password-${entry.id}`}>Password</Label>
                            <Input
                              id={`publication-password-${entry.id}`}
                              type="password"
                              value={entry.password}
                              onChange={(e) => updateEntry('publicationsMemberships', entry.id, 'password', e.target.value)}
                              placeholder="Enter password"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button type="button" onClick={() => addEntry('publicationsMemberships')} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Publication
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Rewards & Points Programs */}
            <AccordionItem value="rewards-points">
              <AccordionTrigger style={{ color: '#000000' }}>Rewards & Points Programs</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {getVisibleEntries(formData.rewardsPointsPrograms).map((entry, index) => (
                      <div key={entry.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Rewards Program {index + 1}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEntry('rewardsPointsPrograms', entry.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor={`rewards-service-${entry.id}`}>Service Name</Label>
                            <Input
                              id={`rewards-service-${entry.id}`}
                              value={entry.serviceName}
                              onChange={(e) => updateEntry('rewardsPointsPrograms', entry.id, 'serviceName', e.target.value)}
                              placeholder="Enter service name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`rewards-username-${entry.id}`}>Username</Label>
                            <Input
                              id={`rewards-username-${entry.id}`}
                              value={entry.username}
                              onChange={(e) => updateEntry('rewardsPointsPrograms', entry.id, 'username', e.target.value)}
                              placeholder="Enter username"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`rewards-password-${entry.id}`}>Password</Label>
                            <Input
                              id={`rewards-password-${entry.id}`}
                              type="password"
                              value={entry.password}
                              onChange={(e) => updateEntry('rewardsPointsPrograms', entry.id, 'password', e.target.value)}
                              placeholder="Enter password"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button type="button" onClick={() => addEntry('rewardsPointsPrograms')} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Rewards Program
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Frequent Flyer Accounts */}
            <AccordionItem value="frequent-flyer">
              <AccordionTrigger style={{ color: '#000000' }}>Frequent Flyer Accounts</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {getVisibleEntries(formData.frequentFlyerAccounts).map((entry, index) => (
                      <div key={entry.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Frequent Flyer Account {index + 1}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEntry('frequentFlyerAccounts', entry.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor={`flyer-service-${entry.id}`}>Service Name</Label>
                            <Input
                              id={`flyer-service-${entry.id}`}
                              value={entry.serviceName}
                              onChange={(e) => updateEntry('frequentFlyerAccounts', entry.id, 'serviceName', e.target.value)}
                              placeholder="Enter service name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`flyer-username-${entry.id}`}>Username</Label>
                            <Input
                              id={`flyer-username-${entry.id}`}
                              value={entry.username}
                              onChange={(e) => updateEntry('frequentFlyerAccounts', entry.id, 'username', e.target.value)}
                              placeholder="Enter username"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`flyer-password-${entry.id}`}>Password</Label>
                            <Input
                              id={`flyer-password-${entry.id}`}
                              type="password"
                              value={entry.password}
                              onChange={(e) => updateEntry('frequentFlyerAccounts', entry.id, 'password', e.target.value)}
                              placeholder="Enter password"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button type="button" onClick={() => addEntry('frequentFlyerAccounts')} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Frequent Flyer Account
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Phone, Internet, Utilities */}
            <AccordionItem value="phone-internet-utilities">
              <AccordionTrigger style={{ color: '#000000' }}>Phone, Internet, Utilities</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {getVisibleEntries(formData.phoneInternetUtilities).map((entry, index) => (
                      <div key={entry.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Utility Service {index + 1}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEntry('phoneInternetUtilities', entry.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor={`utility-service-${entry.id}`}>Service Name</Label>
                            <Input
                              id={`utility-service-${entry.id}`}
                              value={entry.serviceName}
                              onChange={(e) => updateEntry('phoneInternetUtilities', entry.id, 'serviceName', e.target.value)}
                              placeholder="Enter service name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`utility-username-${entry.id}`}>Username</Label>
                            <Input
                              id={`utility-username-${entry.id}`}
                              value={entry.username}
                              onChange={(e) => updateEntry('phoneInternetUtilities', entry.id, 'username', e.target.value)}
                              placeholder="Enter username"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`utility-password-${entry.id}`}>Password</Label>
                            <Input
                              id={`utility-password-${entry.id}`}
                              type="password"
                              value={entry.password}
                              onChange={(e) => updateEntry('phoneInternetUtilities', entry.id, 'password', e.target.value)}
                              placeholder="Enter password"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button type="button" onClick={() => addEntry('phoneInternetUtilities')} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Utility Service
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Store & Travel Loyalty Programs */}
            <AccordionItem value="store-travel-loyalty">
              <AccordionTrigger style={{ color: '#000000' }}>Store & Travel Loyalty Programs</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="store-travel-loyalty">Cards / Programs</Label>
                      <Textarea
                        id="store-travel-loyalty"
                        value={formData.storeTravelLoyalty}
                        onChange={(e) => handleFieldChange('storeTravelLoyalty', e.target.value)}
                        placeholder="Enter store and travel loyalty programs"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Miscellaneous */}
            <AccordionItem value="miscellaneous">
              <AccordionTrigger style={{ color: '#000000' }}>Miscellaneous</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="miscellaneous">Details</Label>
                      <Textarea
                        id="miscellaneous"
                        value={formData.miscellaneous}
                        onChange={(e) => handleFieldChange('miscellaneous', e.target.value)}
                        placeholder="Enter any miscellaneous account or membership details"
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
                variant="skillbinder" 
                onClick={handleGeneratePDF}
                className="skillbinder"
              >
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

export default AccountsMembershipsForm; 