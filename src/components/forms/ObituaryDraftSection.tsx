import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface ObituaryDraftSectionProps {
  writeOwnObituary: string;
  obituaryText: string;
  obituaryDelegate: string;
  onChange: (field: string, value: string) => void;
}

const ObituaryDraftSection: React.FC<ObituaryDraftSectionProps> = ({
  writeOwnObituary,
  obituaryText,
  obituaryDelegate,
  onChange
}) => {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <CardTitle className="text-purple-800 flex items-center gap-2">
          🖋️ Obituary Draft
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Would you like to write your own obituary?
          </Label>
          <RadioGroup
            value={writeOwnObituary}
            onValueChange={(value) => onChange('writeOwnObituary', value)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id="obituary-yes" />
              <Label htmlFor="obituary-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id="obituary-no" />
              <Label htmlFor="obituary-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        {writeOwnObituary === 'Yes' && (
          <div className="space-y-2">
            <Label htmlFor="obituary-text" className="text-sm font-medium text-gray-700">
              If yes, enter your draft here
            </Label>
            <Textarea
              id="obituary-text"
              value={obituaryText}
              onChange={(e) => onChange('obituaryText', e.target.value)}
              placeholder="Write your obituary draft here..."
              className="min-h-[120px] resize-y"
            />
          </div>
        )}

                    {writeOwnObituary === 'No' && (
          <div className="space-y-2">
            <Label htmlFor="obituary-delegate" className="text-sm font-medium text-gray-700">
              Who should be asked to write it?
            </Label>
            <Input
              id="obituary-delegate"
              value={obituaryDelegate}
              onChange={(e) => onChange('obituaryDelegate', e.target.value)}
              placeholder="e.g., My daughter Sarah, My best friend John"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ObituaryDraftSection;