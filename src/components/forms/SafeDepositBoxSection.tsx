import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';

interface SafeDepositBox {
  id: string;
  bank: string;
  location: string;
  box_number: string;
  key_location: string;
  contents: string;
  notes: string;
}

interface SafeDepositBoxSectionProps {
  safeDepositBoxes: SafeDepositBox[];
  onAddSafeDepositBox: () => void;
  onUpdateSafeDepositBox: (id: string, field: string, value: string) => void;
  onDeleteSafeDepositBox: (id: string) => void;
}

const SafeDepositBoxSection: React.FC<SafeDepositBoxSectionProps> = ({
  safeDepositBoxes,
  onAddSafeDepositBox,
  onUpdateSafeDepositBox,
  onDeleteSafeDepositBox
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Safe Deposit Box</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {safeDepositBoxes.map((box, index) => (
          <div key={box.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Safe Deposit Box {index + 1}
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onDeleteSafeDepositBox(box.id)}
                className="rounded-full w-8 h-8 p-0 bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-gray-400"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`box-bank-${box.id}`}>Bank/Institution</Label>
                <Input
                  id={`box-bank-${box.id}`}
                  value={box.bank}
                  onChange={(e) => onUpdateSafeDepositBox(box.id, 'bank', e.target.value)}
                  placeholder="e.g., Chase Bank, Wells Fargo"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`box-location-${box.id}`}>Branch Location</Label>
                <Input
                  id={`box-location-${box.id}`}
                  value={box.location}
                  onChange={(e) => onUpdateSafeDepositBox(box.id, 'location', e.target.value)}
                  placeholder="e.g., 123 Main St, Downtown"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`box-number-${box.id}`}>Box Number</Label>
                <Input
                  id={`box-number-${box.id}`}
                  value={box.box_number}
                  onChange={(e) => onUpdateSafeDepositBox(box.id, 'box_number', e.target.value)}
                  placeholder="e.g., 1234, A-15"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`box-key-location-${box.id}`}>Key Location</Label>
                <Input
                  id={`box-key-location-${box.id}`}
                  value={box.key_location}
                  onChange={(e) => onUpdateSafeDepositBox(box.id, 'key_location', e.target.value)}
                  placeholder="e.g., Home safe, Safety deposit box key"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`box-contents-${box.id}`}>Contents</Label>
              <Textarea
                id={`box-contents-${box.id}`}
                value={box.contents}
                onChange={(e) => onUpdateSafeDepositBox(box.id, 'contents', e.target.value)}
                placeholder="List the contents of this safe deposit box (documents, valuables, etc.)"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`box-notes-${box.id}`}>Additional Notes</Label>
              <Textarea
                id={`box-notes-${box.id}`}
                value={box.notes}
                onChange={(e) => onUpdateSafeDepositBox(box.id, 'notes', e.target.value)}
                placeholder="Any additional notes about this safe deposit box"
                rows={2}
              />
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={onAddSafeDepositBox}
          className="w-full"
        >
          + Add Another Safe Deposit Box
        </Button>
      </CardContent>
    </Card>
  );
};

export default SafeDepositBoxSection;