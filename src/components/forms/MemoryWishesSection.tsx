import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface MemoryWishesSectionProps {
  memoryMessage: string;
  wantsMemoryTable: string;
  wantsVideoMessage: string;
  memoryGiftIdeas: string;
  onChange: (field: string, value: string) => void;
}

const MemoryWishesSection: React.FC<MemoryWishesSectionProps> = ({
  memoryMessage,
  wantsMemoryTable,
  wantsVideoMessage,
  memoryGiftIdeas,
  onChange
}) => {
  return (
    <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center gap-2">
          🌸 Memory Wishes & Stories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="memory-message" className="text-sm font-medium text-gray-700">
            Any memories or life moments you hope people remember?
          </Label>
          <Textarea
            id="memory-message"
            value={memoryMessage}
            onChange={(e) => onChange('memoryMessage', e.target.value)}
            placeholder="Share the memories, stories, or moments you'd like people to remember about you..."
            className="min-h-[100px] resize-y"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Do you want a memory table or display at your service?
          </Label>
          <RadioGroup
            value={wantsMemoryTable}
            onValueChange={(value) => onChange('wantsMemoryTable', value)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id="memory-table-yes" />
              <Label htmlFor="memory-table-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id="memory-table-no" />
              <Label htmlFor="memory-table-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Would you like to pre-record a message?
          </Label>
          <RadioGroup
            value={wantsVideoMessage}
            onValueChange={(value) => onChange('wantsVideoMessage', value)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id="video-yes" />
              <Label htmlFor="video-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id="video-no" />
              <Label htmlFor="video-no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="undecided" id="video-undecided" />
              <Label htmlFor="video-undecided">Undecided</Label>
            </div>
          </RadioGroup>
        </div>

        {wantsVideoMessage === 'Yes' && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Consider scheduling time to record your message or ask a trusted person to help with the technical setup.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="memory-gift-ideas" className="text-sm font-medium text-gray-700">
            Ideas for memory gifts, playlists, or tribute slideshows
          </Label>
          <Textarea
            id="memory-gift-ideas"
            value={memoryGiftIdeas}
            onChange={(e) => onChange('memoryGiftIdeas', e.target.value)}
            placeholder="Share ideas for memorial gifts, favorite songs for a playlist, photos for slideshows, or other tribute ideas..."
            className="min-h-[80px] resize-y"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MemoryWishesSection;