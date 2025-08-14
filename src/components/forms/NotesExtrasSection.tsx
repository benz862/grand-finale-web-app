import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface NotesExtrasSectionProps {
  formData: any;
  onChange: (field: string, value: string) => void;
}

const NotesExtrasSection: React.FC<NotesExtrasSectionProps> = ({ formData, onChange }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Notes & Additional Items
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="safe_location" className="text-sm font-medium text-gray-700">
            Safe deposit box or home safe location (if used)
          </Label>
          <Input
            id="safe_location"
            type="text"
            placeholder="e.g., First National Bank, Box #123 or Home safe in master bedroom closet"
            value={formData.safe_location || ''}
            onChange={(e) => onChange('safe_location', e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="safe_access" className="text-sm font-medium text-gray-700">
            Combination or access instructions (if needed)
          </Label>
          <Textarea
            id="safe_access"
            placeholder="Provide access instructions, combination details, or key locations. Keep this information secure."
            value={formData.safe_access || ''}
            onChange={(e) => onChange('safe_access', e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <p className="text-xs text-gray-500">
            Note: This information should be kept secure and only shared with trusted individuals.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="storage_notes" className="text-sm font-medium text-gray-700">
            Any additional notes about where things are stored
          </Label>
          <Textarea
            id="storage_notes"
            placeholder="Include any other important storage locations, backup copies, or special instructions..."
            value={formData.storage_notes || ''}
            onChange={(e) => onChange('storage_notes', e.target.value)}
            className="min-h-[120px] resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesExtrasSection;