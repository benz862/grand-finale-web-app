import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { savePersonalInfo, saveAddresses, savePhones, saveEmails, saveEmergencyContacts, saveLegalDocuments } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DatabaseIntegration: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const syncAllData = async () => {
    if (!user) {
      toast({ title: 'Error', description: 'Please sign in first', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      // Get data from localStorage
      const personalData = JSON.parse(localStorage.getItem('legalBiographicalData') || '{}');
      const contactData = JSON.parse(localStorage.getItem('personalContactData') || '{}');
      const emergencyData = JSON.parse(localStorage.getItem('emergencyContacts') || '[]');
      const legalData = JSON.parse(localStorage.getItem('legalDocumentsForm') || '{}');

      // Save personal info
      if (personalData.legalFirstName) {
        await savePersonalInfo(user.id, {
          legal_first_name: personalData.legalFirstName,
          legal_last_name: personalData.legalLastName,
          preferred_name: contactData.preferredName,
          date_of_birth: personalData.dateOfBirth,
          place_of_birth: personalData.placeOfBirth,
          country_of_citizenship: personalData.countryOfCitizenship,
          language_spoken: contactData.languageSpoken
        });
      }

      // Save addresses
      if (contactData.addresses) {
        await saveAddresses(user.id, contactData.addresses);
      }

      // Save phones
      if (contactData.phones) {
        await savePhones(user.id, contactData.phones);
      }

      // Save emails
      if (contactData.emails) {
        await saveEmails(user.id, contactData.emails);
      }

      // Save emergency contacts
      if (emergencyData.length > 0) {
        await saveEmergencyContacts(user.id, emergencyData);
      }

      // Save legal documents
      const legalDocs = [
        { document_type: 'will', has_document: legalData.hasWill || 'unknown', location: legalData.willLocation, notes: legalData.willNotes },
        { document_type: 'durable_poa', has_document: legalData.hasDurablePOA || 'unknown', location: legalData.durablePOALocation, notes: legalData.durablePOANotes },
        { document_type: 'medical_poa', has_document: legalData.hasMedicalPOA || 'unknown', location: legalData.medicalPOALocation, notes: legalData.medicalPOANotes }
      ].filter(doc => doc.has_document !== 'unknown');
      
      if (legalDocs.length > 0) {
        await saveLegalDocuments(user.id, legalDocs);
      }

      toast({ title: 'Success', description: 'All data synced to Supabase successfully!' });
    } catch (error) {
      console.error('Sync error:', error);
      toast({ title: 'Error', description: 'Failed to sync data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <Card className="neumorphic-card">
      <CardHeader>
        <CardTitle className="text-xl font-serif text-primary">Database Integration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {user ? (
          <div className="space-y-4">
            <p className="text-sm text-text">Signed in as: {user.email}</p>
            <div className="flex gap-2">
              <Button onClick={syncAllData} disabled={loading} className="bg-action hover:bg-action/90">
                {loading ? 'Syncing...' : 'Sync All Data to Supabase'}
              </Button>
              <Button onClick={signOut} variant="outline">Sign Out</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-text">Sign in to save your data to Supabase</p>
            <Button onClick={signIn} className="bg-action hover:bg-action/90">Sign In with Google</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseIntegration;