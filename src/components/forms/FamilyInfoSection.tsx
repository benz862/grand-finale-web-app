import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Child {
  name: string;
  gender: string;
  age: string;
}

interface FamilyMember {
  name: string;
  relationship: string;
}

interface FamilyInfoSectionProps {
  fatherName: string;
  motherName: string;
  stepfatherName: string;
  stepmotherName: string;
  relationshipStatus: string;
  spouseName: string;
  spousePhone: string;
  spouseEmail: string;
  children: Child[];
  otherFamilyMembers: FamilyMember[];
  onFatherNameChange: (value: string) => void;
  onMotherNameChange: (value: string) => void;
  onStepfatherNameChange: (value: string) => void;
  onStepmotherNameChange: (value: string) => void;
  onRelationshipStatusChange: (value: string) => void;
  onSpouseNameChange: (value: string) => void;
  onSpousePhoneChange: (value: string) => void;
  onSpouseEmailChange: (value: string) => void;
  onChildrenChange: (children: Child[]) => void;
  onOtherFamilyMembersChange: (members: FamilyMember[]) => void;
}

const FamilyInfoSection: React.FC<FamilyInfoSectionProps> = ({
  fatherName,
  motherName,
  stepfatherName,
  stepmotherName,
  relationshipStatus,
  spouseName,
  spousePhone,
  spouseEmail,
  children,
  otherFamilyMembers,
  onFatherNameChange,
  onMotherNameChange,
  onStepfatherNameChange,
  onStepmotherNameChange,
  onRelationshipStatusChange,
  onSpouseNameChange,
  onSpousePhoneChange,
  onSpouseEmailChange,
  onChildrenChange,
  onOtherFamilyMembersChange
}) => {
  const relationshipStatuses = ['Single', 'Married', 'Divorced', 'Widowed', 'Common Law'];
  const genders = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

  const addChild = () => {
    onChildrenChange([...children, { name: '', gender: '', age: '' }]);
  };

  const removeChild = (index: number) => {
    const updated = children.filter((_, i) => i !== index);
    onChildrenChange(updated);
  };

  const updateChild = (index: number, field: keyof Child, value: string) => {
    const updated = [...children];
    updated[index] = { ...updated[index], [field]: value };
    onChildrenChange(updated);
  };

  const addFamilyMember = () => {
    onOtherFamilyMembersChange([...otherFamilyMembers, { name: '', relationship: '' }]);
  };

  const removeFamilyMember = (index: number) => {
    const updated = otherFamilyMembers.filter((_, i) => i !== index);
    onOtherFamilyMembersChange(updated);
  };

  const updateFamilyMember = (index: number, field: keyof FamilyMember, value: string) => {
    const updated = [...otherFamilyMembers];
    updated[index] = { ...updated[index], [field]: value };
    onOtherFamilyMembersChange(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Family Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Father's Full Name</Label>
            <Input
              value={fatherName}
              onChange={(e) => onFatherNameChange(e.target.value)}
              placeholder="Enter father's full name"
            />
          </div>
          <div className="space-y-2">
            <Label>Mother's Full Name</Label>
            <Input
              value={motherName}
              onChange={(e) => onMotherNameChange(e.target.value)}
              placeholder="Enter mother's full name"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Stepfather's Full Name (if applicable)</Label>
            <Input
              value={stepfatherName}
              onChange={(e) => onStepfatherNameChange(e.target.value)}
              placeholder="Enter stepfather's full name"
            />
          </div>
          <div className="space-y-2">
            <Label>Stepmother's Full Name (if applicable)</Label>
            <Input
              value={stepmotherName}
              onChange={(e) => onStepmotherNameChange(e.target.value)}
              placeholder="Enter stepmother's full name"
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Relationship Status</Label>
            <Select value={relationshipStatus} onValueChange={onRelationshipStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select relationship status" />
              </SelectTrigger>
              <SelectContent>
                {relationshipStatuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {relationshipStatus && relationshipStatus !== 'Single' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Spouse/Significant Other's Full Name</Label>
                <Input
                  value={spouseName}
                  onChange={(e) => onSpouseNameChange(e.target.value)}
                  placeholder="Enter spouse/partner's full name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Spouse/Significant Other's Phone</Label>
                  <Input
                    value={spousePhone}
                    onChange={(e) => onSpousePhoneChange(e.target.value)}
                    placeholder="(555) 123-4567 or +1 234 567 8900"
                    type="tel"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Spouse/Significant Other's Email</Label>
                  <Input
                    value={spouseEmail}
                    onChange={(e) => onSpouseEmailChange(e.target.value)}
                    placeholder="partner@email.com"
                    type="email"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Children/Dependents</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addChild}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Child
            </Button>
          </div>
          
          {children.map((child, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="font-medium">Child {index + 1}</h5>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeChild(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={child.name}
                    onChange={(e) => updateChild(index, 'name', e.target.value)}
                    placeholder="Enter child's name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={child.gender} onValueChange={(value) => updateChild(index, 'gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((gender) => (
                        <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input
                    value={child.age}
                    onChange={(e) => updateChild(index, 'age', e.target.value)}
                    placeholder="Age"
                    type="number"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Other Family Members</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFamilyMember}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Family Member
            </Button>
          </div>
          
          {otherFamilyMembers.map((member, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="font-medium">Family Member {index + 1}</h5>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeFamilyMember(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={member.name}
                    onChange={(e) => updateFamilyMember(index, 'name', e.target.value)}
                    placeholder="Enter name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Relationship</Label>
                  <Input
                    value={member.relationship}
                    onChange={(e) => updateFamilyMember(index, 'relationship', e.target.value)}
                    placeholder="e.g., Brother, Sister, Cousin"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FamilyInfoSection;