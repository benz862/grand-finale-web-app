import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface BusinessProperty {
  id: string;
  business_property_address: string;
  business_property_mortgage: string;
}

interface BusinessPropertyCardProps {
  property: BusinessProperty;
  index: number;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const BusinessPropertyCard: React.FC<BusinessPropertyCardProps> = ({
  property,
  index,
  onUpdate,
  onRemove,
  canRemove
}) => {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Business Property {index + 1}</CardTitle>
          {canRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`property_address_${index}`}>Address</Label>
          <Input
            id={`property_address_${index}`}
            value={property.business_property_address}
            onChange={(e) => onUpdate(index, 'business_property_address', e.target.value)}
            placeholder="Enter property address"
          />
        </div>
        <div>
          <Label htmlFor={`property_mortgage_${index}`}>Mortgage Info / Deed Location</Label>
          <Input
            id={`property_mortgage_${index}`}
            value={property.business_property_mortgage}
            onChange={(e) => onUpdate(index, 'business_property_mortgage', e.target.value)}
            placeholder="Mortgage details or deed location"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessPropertyCard;