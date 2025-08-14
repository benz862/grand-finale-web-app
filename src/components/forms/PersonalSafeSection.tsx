import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';

interface Safe {
  id: string;
  location: string;
  combination: string;
  contents: string;
  notes: string;
}

interface PersonalSafeSectionProps {
  safes: Safe[];
  onAddSafe: () => void;
  onUpdateSafe: (id: string, field: string, value: string) => void;
  onDeleteSafe: (id: string) => void;
}

const PersonalSafeSection: React.FC<PersonalSafeSectionProps> = ({
  safes,
  onAddSafe,
  onUpdateSafe,
  onDeleteSafe
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Safe Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {safes.map((safe, index) => (
          <div key={safe.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Safe {index + 1}
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onDeleteSafe(safe.id)}
                className="rounded-full w-8 h-8 p-0 bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-gray-400"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`safe-location-${safe.id}`}>Safe Location</Label>
                <Input
                  id={`safe-location-${safe.id}`}
                  value={safe.location}
                  onChange={(e) => onUpdateSafe(safe.id, 'location', e.target.value)}
                  placeholder="e.g., Home office, Bedroom closet, Bank"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`safe-combination-${safe.id}`}>Combination/Code</Label>
                <Input
                  id={`safe-combination-${safe.id}`}
                  value={safe.combination}
                  onChange={(e) => onUpdateSafe(safe.id, 'combination', e.target.value)}
                  placeholder="Enter combination or access code"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`safe-contents-${safe.id}`}>Contents</Label>
              <Textarea
                id={`safe-contents-${safe.id}`}
                value={safe.contents}
                onChange={(e) => onUpdateSafe(safe.id, 'contents', e.target.value)}
                placeholder="List the contents of this safe (documents, valuables, etc.)"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`safe-notes-${safe.id}`}>Additional Notes</Label>
              <Textarea
                id={`safe-notes-${safe.id}`}
                value={safe.notes}
                onChange={(e) => onUpdateSafe(safe.id, 'notes', e.target.value)}
                placeholder="Any additional notes about this safe"
                rows={2}
              />
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={onAddSafe}
          className="w-full"
        >
          + Add Another Safe
        </Button>
      </CardContent>
    </Card>
  );
};

export default PersonalSafeSection; 