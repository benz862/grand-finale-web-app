import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface FileStorageLegacySectionProps {
  formData: {
    uses_password_manager: string;
    password_manager_details: string;
    cloud_services: string;
    digital_legacy_instructions: string;
  };
  onChange: (field: string, value: string) => void;
}

const FileStorageLegacySection: React.FC<FileStorageLegacySectionProps> = ({
  formData,
  onChange,
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          🗂️ File Storage & Legacy Instructions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Do you use a password manager?
          </Label>
          <RadioGroup
            value={formData.uses_password_manager}
            onValueChange={(value) => onChange('uses_password_manager', value)}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id="password-manager-yes" />
              <Label htmlFor="password-manager-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id="password-manager-no" />
              <Label htmlFor="password-manager-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="password_manager_details" className="text-sm font-medium text-gray-700">
            Password manager name & access instructions
          </Label>
          <Textarea
            id="password_manager_details"
            value={formData.password_manager_details}
            onChange={(e) => onChange('password_manager_details', e.target.value)}
            placeholder="Name of password manager and access instructions..."
            className="mt-1"
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">
            You don't need to share passwords — just instructions.
          </p>
        </div>

        <div>
          <Label htmlFor="cloud_services" className="text-sm font-medium text-gray-700">
            Cloud storage services (Google Drive, Dropbox, iCloud, etc.)
          </Label>
          <Textarea
            id="cloud_services"
            value={formData.cloud_services}
            onChange={(e) => onChange('cloud_services', e.target.value)}
            placeholder="List cloud storage services you use..."
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="digital_legacy_instructions" className="text-sm font-medium text-gray-700">
            Instructions for managing/shutting down accounts
          </Label>
          <Textarea
            id="digital_legacy_instructions"
            value={formData.digital_legacy_instructions}
            onChange={(e) => onChange('digital_legacy_instructions', e.target.value)}
            placeholder="Instructions for managing or shutting down digital accounts..."
            className="mt-1"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FileStorageLegacySection;