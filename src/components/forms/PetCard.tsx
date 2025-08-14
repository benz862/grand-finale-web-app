import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Trash2 } from 'lucide-react';

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

interface PetCardProps {
  pet: Pet;
  onUpdate: (pet: Pet) => void;
  onDelete: (id: string) => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onUpdate, onDelete }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(pet.pet_photo_url || null);

  const handleChange = (field: keyof Pet, value: string | number) => {
    onUpdate({ ...pet, [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        handleChange('pet_photo_url', result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{pet.pet_name || 'New Pet'}</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(pet.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`pet-name-${pet.id}`}>Pet's Name *</Label>
            <Input
              id={`pet-name-${pet.id}`}
              value={pet.pet_name}
              onChange={(e) => handleChange('pet_name', e.target.value)}
              placeholder="Enter pet's name"
            />
          </div>
          <div>
            <Label htmlFor={`pet-type-${pet.id}`}>Species / Type *</Label>
            <Select value={pet.pet_type} onValueChange={(value) => handleChange('pet_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select species" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dog">Dog</SelectItem>
                <SelectItem value="Cat">Cat</SelectItem>
                <SelectItem value="Bird">Bird</SelectItem>
                <SelectItem value="Reptile">Reptile</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`pet-breed-${pet.id}`}>Breed or Description</Label>
            <Input
              id={`pet-breed-${pet.id}`}
              value={pet.pet_breed}
              onChange={(e) => handleChange('pet_breed', e.target.value)}
              placeholder="Enter breed or description"
            />
          </div>
          <div>
            <Label htmlFor={`pet-age-${pet.id}`}>Age</Label>
            <Input
              id={`pet-age-${pet.id}`}
              type="number"
              value={pet.pet_age}
              onChange={(e) => handleChange('pet_age', parseInt(e.target.value) || 0)}
              placeholder="Enter age"
            />
          </div>
        </div>

        <div>
          <Label htmlFor={`pet-vet-${pet.id}`}>Veterinarian Contact Info *</Label>
          <Textarea
            id={`pet-vet-${pet.id}`}
            value={pet.pet_vet_info}
            onChange={(e) => handleChange('pet_vet_info', e.target.value)}
            placeholder="Enter veterinarian name, phone, address"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor={`pet-care-${pet.id}`}>Daily Care Instructions</Label>
          <Textarea
            id={`pet-care-${pet.id}`}
            value={pet.pet_care_instructions}
            onChange={(e) => handleChange('pet_care_instructions', e.target.value)}
            placeholder="Enter daily care instructions"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor={`pet-feeding-${pet.id}`}>Feeding / Meds / Habits</Label>
          <Textarea
            id={`pet-feeding-${pet.id}`}
            value={pet.pet_feeding_notes}
            onChange={(e) => handleChange('pet_feeding_notes', e.target.value)}
            placeholder="Enter feeding schedule, medications, habits"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor={`pet-guardian-${pet.id}`}>Preferred Guardian or Emergency Contact</Label>
          <Input
            id={`pet-guardian-${pet.id}`}
            value={pet.pet_guardian}
            onChange={(e) => handleChange('pet_guardian', e.target.value)}
            placeholder="Enter guardian name and contact info"
          />
        </div>

        <div>
          <Label htmlFor={`pet-photo-${pet.id}`}>Photo of Pet (optional)</Label>
          <Input
            id={`pet-photo-${pet.id}`}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-2"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Pet preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PetCard;