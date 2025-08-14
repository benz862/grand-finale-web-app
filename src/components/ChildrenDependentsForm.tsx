import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ChildDependentCard, { ChildDependent } from './forms/ChildDependentCard';

interface ChildrenDependentsFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

const ChildrenDependentsForm: React.FC<ChildrenDependentsFormProps> = ({
  onNext,
  onPrevious
}) => {
  const { toast } = useToast();
  const [children, setChildren] = useState<ChildDependent[]>([
    {
      id: '1',
      full_name: '',
      preferred_name: '',
      date_of_birth: '',
      place_of_birth: '',
      relationship: '',
      custom_relationship: '',
      lives_with_you: '',
      address: '',
      phone: '',
      email: '',
      notes: ''
    }
  ]);

  useEffect(() => {
    const savedData = localStorage.getItem('children_dependents');
    if (savedData) {
      const data = JSON.parse(savedData);
      setChildren(data.length > 0 ? data : [
        {
          id: '1',
          full_name: '',
          preferred_name: '',
          date_of_birth: '',
          place_of_birth: '',
          relationship: '',
          custom_relationship: '',
          lives_with_you: '',
          address: '',
          phone: '',
          email: '',
          notes: ''
        }
      ]);
    }
  }, []);

  const addChild = () => {
    const newChild: ChildDependent = {
      id: Date.now().toString(),
      full_name: '',
      preferred_name: '',
      date_of_birth: '',
      place_of_birth: '',
      relationship: '',
      custom_relationship: '',
      lives_with_you: '',
      address: '',
      phone: '',
      email: '',
      notes: ''
    };
    setChildren([...children, newChild]);
  };

  const removeChild = (id: string) => {
    setChildren(children.filter(child => child.id !== id));
  };

  const updateChild = (id: string, field: string, value: string) => {
    setChildren(children.map(child => 
      child.id === id ? { ...child, [field]: value } : child
    ));
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

    const validChildren = children.filter(child => 
      child.full_name.trim() !== '' || child.date_of_birth !== ''
    );

    try {
      await syncForm(user.email, 'childrenDependents', validChildren);
      
      toast({
        title: "Success",
        description: "Children & dependents information saved to database!",
      });
      
      onNext();
    } catch (error) {
      console.error('Error saving children data:', error);
      toast({
        title: "Error",
        description: "Failed to save to database. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-primary">Children & Dependents</CardTitle>
          <CardDescription className="text-subtext leading-relaxed">
            Please provide information about your children and dependents to help your loved ones understand your family structure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {children.map((child, index) => (
            <ChildDependentCard
              key={child.id}
              child={child}
              onUpdate={updateChild}
              onRemove={removeChild}
              canRemove={children.length > 1}
            />
          ))}

          <div className="flex justify-center">
            <Button
              onClick={addChild}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Another Child/Dependent</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between sticky bottom-0 bg-background/80 backdrop-blur-sm p-4 rounded-lg">
        <Button
          onClick={onPrevious}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>
        
        <div className="text-sm text-muted-foreground self-center">
          You're doing great — just a few more steps
        </div>
        
        <Button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-action hover:bg-action/90"
        >
          <span>Save & Continue</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChildrenDependentsForm;