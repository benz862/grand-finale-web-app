import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { getIdentificationLabel } from '../../lib/countryIdentification';

interface DocumentStorageSectionProps {
  formData: any;
  onChange: (field: string, value: string | boolean) => void;
  userCountry?: string; // Add country prop for dynamic labels
}

const DocumentStorageSection: React.FC<DocumentStorageSectionProps> = ({ formData, onChange, userCountry = 'United States' }) => {
  // Get the appropriate identification label based on user's country
  const identificationLabel = getIdentificationLabel(userCountry);
  
  const documents = [
    { key: 'birth_certificate_location', label: 'Where do you store your birth certificate?', placeholder: 'e.g., Home safe, Bank safe deposit box' },
    { key: 'passport_location', label: 'Where do you store your passport?', placeholder: 'e.g., Home filing cabinet, Safe deposit box' },
    { key: 'marriage_certificate_location', label: 'Marriage certificate (if applicable)', placeholder: 'e.g., Home safe, Attorney office' },
    { key: 'social_security_card_location', label: `Where do you store your ${identificationLabel}?`, placeholder: 'e.g., Wallet, Home safe' },
    { key: 'drivers_license_location', label: 'Driver\'s license or state ID', placeholder: 'e.g., Wallet, Home drawer' },
    { key: 'military_records_location', label: 'Military service records', placeholder: 'e.g., Home filing cabinet, VA office' },
    { key: 'housing_documents_location', label: 'Home deed or rental agreement', placeholder: 'e.g., Home safe, Real estate attorney' },
    { key: 'vehicle_documents_location', label: 'Vehicle title or lease papers', placeholder: 'e.g., Glove compartment, Home filing cabinet' }
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Document Storage Locations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {documents.map((doc) => (
          <div key={doc.key} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`no_${doc.key}`}
                checked={formData[`no_${doc.key}`] || false}
                onCheckedChange={(checked) => onChange(`no_${doc.key}`, checked)}
              />
              <Label htmlFor={`no_${doc.key}`} className="text-sm text-gray-600">
                I do not have this document
              </Label>
            </div>
            <Label htmlFor={doc.key} className="text-sm font-medium text-gray-700">
              {doc.label}
            </Label>
            <Input
              id={doc.key}
              type="text"
              placeholder={doc.placeholder}
              value={formData[doc.key] || ''}
              onChange={(e) => onChange(doc.key, e.target.value)}
              disabled={formData[`no_${doc.key}`]}
              className="w-full"
            />
          </div>
        ))}
        
        <div className="space-y-2">
          <Label htmlFor="other_physical_docs" className="text-sm font-medium text-gray-700">
            Other important physical documents
          </Label>
          <Textarea
            id="other_physical_docs"
            placeholder="List any other important documents and their locations..."
            value={formData.other_physical_docs || ''}
            onChange={(e) => onChange('other_physical_docs', e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentStorageSection;