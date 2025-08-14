import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';

interface Executor {
  id: string;
  full_name: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
  aware: string;
  accepted: string;
  notes: string;
}

interface ExecutorDetailsSectionProps {
  executors: Executor[];
  onAddExecutor: () => void;
  onUpdateExecutor: (id: string, field: string, value: string) => void;
  onDeleteExecutor: (id: string) => void;
}

const ExecutorDetailsSection: React.FC<ExecutorDetailsSectionProps> = ({ 
  executors, 
  onAddExecutor, 
  onUpdateExecutor, 
  onDeleteExecutor 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Executor Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {executors.map((executor, index) => (
          <div key={executor.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Executor {index + 1}
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onDeleteExecutor(executor.id)}
                className="rounded-full w-8 h-8 p-0 bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-gray-400"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`executor-name-${executor.id}`}>Full Name</Label>
                <Input
                  id={`executor-name-${executor.id}`}
                  value={executor.full_name}
                  onChange={(e) => onUpdateExecutor(executor.id, 'full_name', e.target.value)}
                  placeholder="Enter executor's name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`executor-relationship-${executor.id}`}>Relationship to You</Label>
                <Input
                  id={`executor-relationship-${executor.id}`}
                  value={executor.relationship}
                  onChange={(e) => onUpdateExecutor(executor.id, 'relationship', e.target.value)}
                  placeholder="e.g., Spouse, Child, Friend"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`executor-phone-${executor.id}`}>Phone Number</Label>
                <Input
                  id={`executor-phone-${executor.id}`}
                  type="tel"
                  value={executor.phone}
                  onChange={(e) => onUpdateExecutor(executor.id, 'phone', e.target.value)}
                  placeholder="(555) 123-4567 or +1 234 567 8900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`executor-email-${executor.id}`}>Email Address</Label>
                <Input
                  id={`executor-email-${executor.id}`}
                  type="email"
                  value={executor.email}
                  onChange={(e) => onUpdateExecutor(executor.id, 'email', e.target.value)}
                  placeholder="executor@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`executor-address-${executor.id}`}>Mailing Address</Label>
              <Textarea
                id={`executor-address-${executor.id}`}
                value={executor.address}
                onChange={(e) => onUpdateExecutor(executor.id, 'address', e.target.value)}
                placeholder="Enter complete mailing address"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Is the Executor Aware?</Label>
                <RadioGroup
                  value={executor.aware}
                  onValueChange={(value) => onUpdateExecutor(executor.id, 'aware', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id={`aware-yes-${executor.id}`} />
                    <Label htmlFor={`aware-yes-${executor.id}`}>Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id={`aware-no-${executor.id}`} />
                    <Label htmlFor={`aware-no-${executor.id}`}>No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Has the Executor Accepted the Role?</Label>
                <RadioGroup
                  value={executor.accepted}
                  onValueChange={(value) => onUpdateExecutor(executor.id, 'accepted', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id={`accepted-yes-${executor.id}`} />
                    <Label htmlFor={`accepted-yes-${executor.id}`}>Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id={`accepted-no-${executor.id}`} />
                    <Label htmlFor={`accepted-no-${executor.id}`}>No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`executor-notes-${executor.id}`}>Additional Notes</Label>
              <Textarea
                id={`executor-notes-${executor.id}`}
                value={executor.notes}
                onChange={(e) => onUpdateExecutor(executor.id, 'notes', e.target.value)}
                placeholder="Any additional notes about this executor"
                rows={2}
              />
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={onAddExecutor}
          className="w-full"
        >
          + Add Another Executor
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExecutorDetailsSection;