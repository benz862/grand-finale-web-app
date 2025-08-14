import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import PetCard from './forms/PetCard';
import SurvivorInstructionsSection from './forms/SurvivorInstructionsSection';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';

interface Pet {
  id: string;
  pet_name: string;
  pet_type: string;
  pet_breed: string;
  pet_age: number;
  pet_vet_info: string;
  pet_care_instructions: string;
  pet_feeding_notes: string;
  pet_guardian: string;
  pet_photo_url?: string;
}

interface SurvivorInstructions {
  has_dependents: string;
  dependent_details: string;
  survivor_instructions: string;
}

interface PetCareSurvivorsFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

const PetCareSurvivorsForm: React.FC<PetCareSurvivorsFormProps> = ({ onNext, onPrevious }) => {
  const { toast } = useToast();
  const [pets, setPets] = useState<Pet[]>([]);
  const [survivorData, setSurvivorData] = useState<SurvivorInstructions>({
    has_dependents: '',
    dependent_details: '',
    survivor_instructions: ''
  });
  const { user } = useAuth();
  const { syncForm } = useDatabaseSync();

  // Load data from localStorage on component mount
  React.useEffect(() => {
    const savedPets = localStorage.getItem('petCareData');
    const savedSurvivor = localStorage.getItem('survivorNotesData');
    
    if (savedPets) {
      setPets(JSON.parse(savedPets));
    }
    if (savedSurvivor) {
      setSurvivorData(JSON.parse(savedSurvivor));
    }
  }, []);

  const addPet = () => {
    const newPet: Pet = {
      id: Date.now().toString(),
      pet_name: '',
      pet_type: '',
      pet_breed: '',
      pet_age: 0,
      pet_vet_info: '',
      pet_care_instructions: '',
      pet_feeding_notes: '',
      pet_guardian: '',
      pet_photo_url: ''
    };
    setPets([...pets, newPet]);
  };

  const updatePet = (updatedPet: Pet) => {
    setPets(pets.map(pet => pet.id === updatedPet.id ? updatedPet : pet));
  };

  const deletePet = (petId: string) => {
    setPets(pets.filter(pet => pet.id !== petId));
  };

  const updateSurvivorData = (field: keyof SurvivorInstructions, value: string) => {
    setSurvivorData(prev => ({ ...prev, [field]: value }));
  };

  const validatePets = () => {
    for (const pet of pets) {
      if (!pet.pet_name.trim()) {
        toast({
          title: "Validation Error",
          description: "Pet name is required for all pets",
          variant: "destructive"
        });
        return false;
      }
      if (!pet.pet_type.trim()) {
        toast({
          title: "Validation Error",
          description: "Pet type is required for all pets",
          variant: "destructive"
        });
        return false;
      }
      if (!pet.pet_vet_info.trim()) {
        toast({
          title: "Validation Error",
          description: "Veterinarian contact info is required for all pets",
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
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

    const formData = {
      pets,
      survivorData
    };

    try {
      await syncForm(user.email, 'petCareSurvivorsData', formData);
      
      toast({
        title: "Success",
        description: "Pet care & survivor information saved to database!",
      });
      
      onNext();
    } catch (error) {
      console.error('Error saving pet care data:', error);
      toast({
        title: "Error",
        description: "Failed to save to database. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Pet Care & Survivor Instructions
          </h1>
          <p className="text-gray-600">
            Ensure your beloved animals are cared for and document wishes for survivors
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pet Information Panel */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    🐾 Pet Information
                  </CardTitle>
                  <Button onClick={addPet} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Pet
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {pets.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No pets added yet. Click "Add Pet" to get started.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {pets.map(pet => (
                      <PetCard
                        key={pet.id}
                        pet={pet}
                        onUpdate={updatePet}
                        onDelete={deletePet}
                      />
                    ))}
                  </div>
                )}
                
                {pets.length > 0 && (
                  <div className="mt-4">
                    <Button onClick={handleSave} variant="outline" className="w-full">
                      Save Pet(s)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Survivor Instructions Panel */}
          <div>
            <SurvivorInstructionsSection
              data={survivorData}
              onChange={updateSurvivorData}
            />
            
            <div className="mt-4">
              <Button onClick={handleSave} variant="outline" className="w-full">
                Save Survivor Info
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button onClick={onPrevious} variant="skillbinder" className="skillbinder">Previous</Button>
          <Button onClick={handleSave} variant="skillbinder_yellow" className="skillbinder_yellow">
            Next: Digital Assets
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PetCareSurvivorsForm;