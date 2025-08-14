import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export interface ChildDependent {
  id: string;
  full_name: string;
  preferred_name: string;
  date_of_birth: string;
  place_of_birth: string;
  relationship: string;
  custom_relationship: string;
  lives_with_you: string;
  address: string;
  phone: string;
  email: string;
  notes: string;
}

interface ChildDependentCardProps {
  child: ChildDependent;
  onUpdate: (id: string, field: string, value: string) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

const ChildDependentCard: React.FC<ChildDependentCardProps> = ({
  child,
  onUpdate,
  onRemove,
  canRemove
}) => {
  const relationshipOptions = [
    'Child',
    'Stepchild', 
    'Adopted',
    'Dependent',
    'Grandchild',
    'Other'
  ];

  return (
    <Card className="neumorphic-card mb-6">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-serif text-primary">
            Child/Dependent Information
          </CardTitle>
          {canRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(child.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`full_name_${child.id}`} className="text-sm font-medium text-foreground">
              Full legal name *
            </Label>
            <Input
              id={`full_name_${child.id}`}
              value={child.full_name}
              onChange={(e) => onUpdate(child.id, 'full_name', e.target.value)}
              className="mt-1 neumorphic-input"
              required
            />
          </div>
          <div>
            <Label htmlFor={`preferred_name_${child.id}`} className="text-sm font-medium text-foreground">
              Preferred name
            </Label>
            <Input
              id={`preferred_name_${child.id}`}
              value={child.preferred_name}
              onChange={(e) => onUpdate(child.id, 'preferred_name', e.target.value)}
              className="mt-1 neumorphic-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`date_of_birth_${child.id}`} className="text-sm font-medium text-foreground">
              Date of birth *
            </Label>
            <Input
              id={`date_of_birth_${child.id}`}
              type="date"
              value={child.date_of_birth}
              onChange={(e) => onUpdate(child.id, 'date_of_birth', e.target.value)}
              className="mt-1 neumorphic-input"
              required
            />
          </div>
          <div>
            <Label htmlFor={`place_of_birth_${child.id}`} className="text-sm font-medium text-foreground">
              Place of birth
            </Label>
            <Input
              id={`place_of_birth_${child.id}`}
              value={child.place_of_birth}
              onChange={(e) => onUpdate(child.id, 'place_of_birth', e.target.value)}
              className="mt-1 neumorphic-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-foreground">
              Relationship to you *
            </Label>
            <Select
              value={child.relationship}
              onValueChange={(value) => onUpdate(child.id, 'relationship', value)}
            >
              <SelectTrigger className="mt-1 neumorphic-input">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                {relationshipOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {child.relationship === 'Other' && (
            <div>
              <Label htmlFor={`custom_relationship_${child.id}`} className="text-sm font-medium text-foreground">
                Custom relationship
              </Label>
              <Input
                id={`custom_relationship_${child.id}`}
                value={child.custom_relationship}
                onChange={(e) => onUpdate(child.id, 'custom_relationship', e.target.value)}
                className="mt-1 neumorphic-input"
              />
            </div>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium text-foreground">
            Lives with you? *
          </Label>
          <RadioGroup
            value={child.lives_with_you}
            onValueChange={(value) => onUpdate(child.id, 'lives_with_you', value)}
            className="flex space-x-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id={`lives_yes_${child.id}`} />
              <Label htmlFor={`lives_yes_${child.id}`}>Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id={`lives_no_${child.id}`} />
              <Label htmlFor={`lives_no_${child.id}`}>No</Label>
            </div>
          </RadioGroup>
        </div>

                        {child.lives_with_you === 'No' && (
          <div>
            <Label htmlFor={`address_${child.id}`} className="text-sm font-medium text-foreground">
              Current address
            </Label>
            <Input
              id={`address_${child.id}`}
              value={child.address}
              onChange={(e) => onUpdate(child.id, 'address', e.target.value)}
              className="mt-1 neumorphic-input"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`phone_${child.id}`} className="text-sm font-medium text-foreground">
              Phone number (if applicable)
            </Label>
            <Input
              id={`phone_${child.id}`}
              value={child.phone}
              onChange={(e) => onUpdate(child.id, 'phone', e.target.value)}
              className="mt-1 neumorphic-input"
            />
          </div>
          <div>
            <Label htmlFor={`email_${child.id}`} className="text-sm font-medium text-foreground">
              Email address (if applicable)
            </Label>
            <Input
              id={`email_${child.id}`}
              type="email"
              value={child.email}
              onChange={(e) => onUpdate(child.id, 'email', e.target.value)}
              className="mt-1 neumorphic-input"
            />
          </div>
        </div>

        <div>
          <Label htmlFor={`notes_${child.id}`} className="text-sm font-medium text-foreground">
            Additional notes about care, education, health, or needs
          </Label>
          <Textarea
            id={`notes_${child.id}`}
            value={child.notes}
            onChange={(e) => onUpdate(child.id, 'notes', e.target.value)}
            className="mt-1 neumorphic-input"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChildDependentCard;