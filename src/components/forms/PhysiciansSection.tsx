import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import PhysicianCard from './PhysicianCard';

interface Physician {
  id: string;
  fullName: string;
  specialty: string;
  clinicHospital: string;
  phone: string;
  email: string;
  emergencyContact: string;
}

interface PhysiciansSectionProps {
  physicians: Physician[];
  onPhysiciansChange: (physicians: Physician[]) => void;
}

const PhysiciansSection: React.FC<PhysiciansSectionProps> = ({
  physicians,
  onPhysiciansChange,
}) => {
  const addPhysician = () => {
    const newPhysician: Physician = {
      id: Date.now().toString(),
      fullName: '',
      specialty: '',
      clinicHospital: '',
      phone: '',
      email: '',
      emergencyContact: '',
    };
    onPhysiciansChange([...physicians, newPhysician]);
  };

  const updatePhysician = (updatedPhysician: Physician) => {
    const updated = physicians.map(physician => 
      physician.id === updatedPhysician.id ? updatedPhysician : physician
    );
    onPhysiciansChange(updated);
  };

  const deletePhysician = (id: string) => {
    const filtered = physicians.filter(physician => physician.id !== id);
    onPhysiciansChange(filtered);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Physicians</h3>
        <Button
          type="button"
          onClick={addPhysician}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Physician</span>
        </Button>
      </div>
      
      {physicians.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No physicians added yet. Click "Add Physician" to get started.</p>
        </div>
      )}
      
      <div className="space-y-4">
        {physicians.map((physician) => (
          <PhysicianCard
            key={physician.id}
            physician={physician}
            onUpdate={updatePhysician}
            onDelete={deletePhysician}
          />
        ))}
      </div>
    </div>
  );
};

export default PhysiciansSection;