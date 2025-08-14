import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Info } from 'lucide-react';

interface WillEstateSectionProps {
  formData: any;
  onChange: (field: string, value: string) => void;
}

const WillEstateSection: React.FC<WillEstateSectionProps> = ({ formData, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Will & Estate Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Do you have a Last Will & Testament?</Label>
          <RadioGroup
            value={formData.has_will || ''}
            onValueChange={(value) => onChange('has_will', value)}
          >
            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Yes" id="will-yes" />
                <Label htmlFor="will-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="will-no" />
              <Label htmlFor="will-no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="in-progress" id="will-progress" />
              <Label htmlFor="will-progress">In Progress</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="will-date">Date Last Updated</Label>
          <Input
            id="will-date"
            type="date"
            value={formData.will_updated_date || ''}
            onChange={(e) => onChange('will_updated_date', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="will-location">Location of Original Document</Label>
          <Input
            id="will-location"
            value={formData.will_location || ''}
            onChange={(e) => onChange('will_location', e.target.value)}
            placeholder="Enter document location"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="other-docs">Other Estate Documents (e.g., Trusts, Codicils)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Examples include Trusts, Codicils, or Letter of Intent.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Textarea
            id="other-docs"
            value={formData.other_estate_documents || ''}
            onChange={(e) => onChange('other_estate_documents', e.target.value)}
            placeholder="List any other estate documents..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WillEstateSection;