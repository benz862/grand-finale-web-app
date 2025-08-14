import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import MedicationCard from './MedicationCard';
import OTCMedicationCard from './OTCMedicationCard';
import PharmacySection from './PharmacySection';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  reason: string;
}

interface OTCMedication {
  id: string;
  name: string;
  brandName: string;
  purpose: string;
}

interface PharmacyInfo {
  name: string;
  location: string;
  phone: string;
}

interface MedicationsSectionProps {
  medications: Medication[];
  otcMedications: OTCMedication[];
  pharmacy: PharmacyInfo;
  onMedicationsChange: (medications: Medication[]) => void;
  onOTCMedicationsChange: (otcMedications: OTCMedication[]) => void;
  onPharmacyChange: (pharmacy: PharmacyInfo) => void;
}

const MedicationsSection: React.FC<MedicationsSectionProps> = ({
  medications,
  otcMedications,
  pharmacy,
  onMedicationsChange,
  onOTCMedicationsChange,
  onPharmacyChange,
}) => {
  const addMedication = () => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: '',
      dosage: '',
      frequency: '',
      reason: '',
    };
    onMedicationsChange([...medications, newMedication]);
  };

  const addOTCMedication = () => {
    const newOTCMedication: OTCMedication = {
      id: Date.now().toString(),
      name: '',
      brandName: '',
      purpose: '',
    };
    onOTCMedicationsChange([...otcMedications, newOTCMedication]);
  };

  const updateMedication = (updatedMedication: Medication) => {
    const updated = medications.map(med => 
      med.id === updatedMedication.id ? updatedMedication : med
    );
    onMedicationsChange(updated);
  };

  const updateOTCMedication = (updatedOTCMedication: OTCMedication) => {
    const updated = otcMedications.map(med => 
      med.id === updatedOTCMedication.id ? updatedOTCMedication : med
    );
    onOTCMedicationsChange(updated);
  };

  const deleteMedication = (id: string) => {
    const filtered = medications.filter(med => med.id !== id);
    onMedicationsChange(filtered);
  };

  const deleteOTCMedication = (id: string) => {
    const filtered = otcMedications.filter(med => med.id !== id);
    onOTCMedicationsChange(filtered);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="prescriptions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="otc">OTC/Supplements</TabsTrigger>
          <TabsTrigger value="pharmacy">Pharmacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prescriptions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Prescription Medications</h3>
            <Button
              type="button"
              onClick={addMedication}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Medication</span>
            </Button>
          </div>
          
          {medications.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No medications added yet. Click "Add Medication" to get started.</p>
            </div>
          )}
          
          <div className="space-y-4">
            {medications.map((medication) => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                onUpdate={updateMedication}
                onDelete={deleteMedication}
                title="Prescription Medication"
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="otc" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Over-the-Counter Medications & Supplements</h3>
            <Button
              type="button"
              onClick={addOTCMedication}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add OTC/Supplement</span>
            </Button>
          </div>
          
          {otcMedications.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No OTC medications or supplements added yet. Click "Add OTC/Supplement" to get started.</p>
            </div>
          )}
          
          <div className="space-y-4">
            {otcMedications.map((medication) => (
              <OTCMedicationCard
                key={medication.id}
                medication={medication}
                onUpdate={updateOTCMedication}
                onDelete={deleteOTCMedication}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="pharmacy">
          <PharmacySection
            pharmacy={pharmacy}
            onUpdate={onPharmacyChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationsSection;