import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface BusinessVehicle {
  id: string;
  vehicle_make_model: string;
  vehicle_title_location: string;
}

interface BusinessVehicleCardProps {
  vehicle: BusinessVehicle;
  index: number;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const BusinessVehicleCard: React.FC<BusinessVehicleCardProps> = ({
  vehicle,
  index,
  onUpdate,
  onRemove,
  canRemove
}) => {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Business Vehicle {index + 1}</CardTitle>
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
          <Label htmlFor={`vehicle_make_${index}`}>Make/Model</Label>
          <Input
            id={`vehicle_make_${index}`}
            value={vehicle.vehicle_make_model}
            onChange={(e) => onUpdate(index, 'vehicle_make_model', e.target.value)}
            placeholder="Enter make and model"
          />
        </div>
        <div>
          <Label htmlFor={`vehicle_title_${index}`}>Title / Lease Location</Label>
          <Input
            id={`vehicle_title_${index}`}
            value={vehicle.vehicle_title_location}
            onChange={(e) => onUpdate(index, 'vehicle_title_location', e.target.value)}
            placeholder="Where title or lease documents are stored"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessVehicleCard;