import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface BusinessOwnership {
  id: string;
  business_name: string;
  business_ownership_type: string;
  business_successor_plan: string;
}

interface BusinessOwnershipCardProps {
  business: BusinessOwnership;
  index: number;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const BusinessOwnershipCard: React.FC<BusinessOwnershipCardProps> = ({
  business,
  index,
  onUpdate,
  onRemove,
  canRemove
}) => {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Business {index + 1}</CardTitle>
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
          <Label htmlFor={`business_name_${index}`}>Business Name</Label>
          <Input
            id={`business_name_${index}`}
            value={business.business_name}
            onChange={(e) => onUpdate(index, 'business_name', e.target.value)}
            placeholder="Enter business name"
          />
        </div>
        <div>
          <Label htmlFor={`business_type_${index}`}>Type of Ownership</Label>
          <Select
            value={business.business_ownership_type}
            onValueChange={(value) => onUpdate(index, 'business_ownership_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select ownership type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
              <SelectItem value="Partnership">Partnership</SelectItem>
              <SelectItem value="Corporation">Corporation</SelectItem>
              <SelectItem value="LLC">LLC</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor={`business_plan_${index}`}>Successor or Sale Plan</Label>
          <Textarea
            id={`business_plan_${index}`}
            value={business.business_successor_plan}
            onChange={(e) => onUpdate(index, 'business_successor_plan', e.target.value)}
            placeholder="Succession plan, sale instructions, or transfer details"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessOwnershipCard;