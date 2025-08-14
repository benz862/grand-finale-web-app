import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface LegacyMessageData {
  legacy_message: string;
}

interface LegacyMessageSectionProps {
  data: LegacyMessageData;
  onUpdate: (field: string, value: string) => void;
}

const LegacyMessageSection: React.FC<LegacyMessageSectionProps> = ({ data, onUpdate }) => {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          🌟 General Legacy Message
        </CardTitle>
        <p className="text-sm text-gray-600">
          This section might be read aloud, shared online, or simply preserved for loved ones.
        </p>
      </CardHeader>
      <CardContent>
        <div>
          <Label htmlFor="legacy-message" className="text-base font-medium">
            Final thoughts, values, or reflections to leave behind
          </Label>
          <Textarea
            id="legacy-message"
            value={data.legacy_message}
            onChange={(e) => onUpdate('legacy_message', e.target.value)}
            placeholder="Share your final thoughts, values, wisdom, or reflections that you want to leave behind for your loved ones..."
            className="mt-2 min-h-[200px] resize-y"
            style={{
              resize: 'vertical',
              minHeight: '200px',
              height: 'auto'
            }}
          />
          <p className="text-xs text-gray-500 mt-2">
            This message will be securely stored and can be shared according to your wishes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LegacyMessageSection;