import React from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface ScreenProps {
  formData: any;
  handleFieldChange: (field: string, value: string) => void;
  handleArrayUpdate: (arrayName: string, index: number, field: string, value: string) => void;
  addArrayItem: (arrayName: string, template: any, maxItems: number) => void;
  removeArrayItem: (arrayName: string, index: number) => void;
}

export const Screen8: React.FC<ScreenProps> = ({ formData, handleArrayUpdate, addArrayItem, removeArrayItem }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">✅ Screen 8: Business Vehicles & Leases</h2>
    {formData.businessVehicles.map((vehicle, index) => (
      <Card key={vehicle.id}>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Make/Model</Label>
              <Input
                value={vehicle.vehicle_make_model}
                onChange={(e) => handleArrayUpdate('businessVehicles', index, 'vehicle_make_model', e.target.value)}
                placeholder="Vehicle make and model"
              />
            </div>
            <div>
              <Label>Title / Lease Location</Label>
              <Input
                value={vehicle.vehicle_title_location}
                onChange={(e) => handleArrayUpdate('businessVehicles', index, 'vehicle_title_location', e.target.value)}
                placeholder="Where title/lease documents are stored"
              />
            </div>
          </div>
          {formData.businessVehicles.length > 1 && (
            <Button
              onClick={() => removeArrayItem('businessVehicles', index)}
              variant="destructive"
              size="sm"
              className="mt-4"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          )}
        </CardContent>
      </Card>
    ))}
    <Button
      onClick={() => addArrayItem('businessVehicles', { id: '', vehicle_make_model: '', vehicle_title_location: '' }, 10)}
      className="w-full bg-white text-foreground hover:bg-gray-50 shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] border border-gray-200"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Business Vehicle
    </Button>
  </div>
);

export const Screen9: React.FC<ScreenProps> = ({ formData, handleArrayUpdate, addArrayItem, removeArrayItem }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">✅ Screen 9: Business Real Estate</h2>
    {formData.businessProperties.map((property, index) => (
      <Card key={property.id}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label>Address</Label>
              <Input
                value={property.business_property_address}
                onChange={(e) => handleArrayUpdate('businessProperties', index, 'business_property_address', e.target.value)}
                placeholder="Property address"
              />
            </div>
            <div>
              <Label>Mortgage Info / Deed Location</Label>
              <Input
                value={property.business_property_mortgage}
                onChange={(e) => handleArrayUpdate('businessProperties', index, 'business_property_mortgage', e.target.value)}
                placeholder="Mortgage details and document location"
              />
            </div>
          </div>
          {formData.businessProperties.length > 1 && (
            <Button
              onClick={() => removeArrayItem('businessProperties', index)}
              variant="destructive"
              size="sm"
              className="mt-4"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          )}
        </CardContent>
      </Card>
    ))}
    <Button
      onClick={() => addArrayItem('businessProperties', { id: '', business_property_address: '', business_property_mortgage: '' }, 10)}
      className="w-full bg-white text-foreground hover:bg-gray-50 shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] border border-gray-200"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Business Property
    </Button>
  </div>
);