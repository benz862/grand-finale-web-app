import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PronounSectionProps {
  pronouns: string;
  customPronoun: string;
  onPronounsChange: (value: string) => void;
  onCustomPronounChange: (value: string) => void;
}

const PronounSection: React.FC<PronounSectionProps> = ({
  pronouns,
  customPronoun,
  onPronounsChange,
  onCustomPronounChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pronouns</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pronouns">Preferred Pronouns</Label>
          <Select value={pronouns} onValueChange={onPronounsChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select pronouns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="he/him">He/Him</SelectItem>
              <SelectItem value="she/her">She/Her</SelectItem>
              <SelectItem value="they/them">They/Them</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {pronouns === 'custom' && (
          <div className="space-y-2">
            <Label htmlFor="customPronoun">Custom Pronouns</Label>
            <Input
              id="customPronoun"
              value={customPronoun}
              onChange={(e) => onCustomPronounChange(e.target.value)}
              placeholder="Enter your preferred pronouns"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PronounSection;