import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';

interface AlternateExecutor {
  id: string;
  alternate_executor_name: string;
  alternate_executor_phone: string;
  alternate_executor_email: string;
  alternate_executor_relationship: string;
}

interface AlternateExecutorCardProps {
  executor: AlternateExecutor;
  index: number;
  onUpdate: (id: string, field: string, value: string) => void;
  onDelete: (id: string) => void;
}

const AlternateExecutorCard: React.FC<AlternateExecutorCardProps> = ({ 
  executor, 
  index, 
  onUpdate, 
  onDelete 
}) => {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Alternate Executor #{index + 1}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(executor.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`alt-exec-name-${executor.id}`}>Full Name</Label>
            <Input
              id={`alt-exec-name-${executor.id}`}
              value={executor.alternate_executor_name}
              onChange={(e) => onUpdate(executor.id, 'alternate_executor_name', e.target.value)}
              placeholder="Enter name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`alt-exec-phone-${executor.id}`}>Phone Number</Label>
            <Input
              id={`alt-exec-phone-${executor.id}`}
              type="tel"
              value={executor.alternate_executor_phone}
              onChange={(e) => onUpdate(executor.id, 'alternate_executor_phone', e.target.value)}
              placeholder="(555) 123-4567 or +1 234 567 8900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`alt-exec-email-${executor.id}`}>Email</Label>
            <Input
              id={`alt-exec-email-${executor.id}`}
              type="email"
              value={executor.alternate_executor_email}
              onChange={(e) => onUpdate(executor.id, 'alternate_executor_email', e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`alt-exec-relationship-${executor.id}`}>Relationship</Label>
            <Input
              id={`alt-exec-relationship-${executor.id}`}
              value={executor.alternate_executor_relationship}
              onChange={(e) => onUpdate(executor.id, 'alternate_executor_relationship', e.target.value)}
              placeholder="e.g., Sibling, Friend"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlternateExecutorCard;