import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Upload, Calendar, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PersonalMessage {
  id: string;
  recipient_name: string;
  relationship: string;
  message_body: string;
  delivery_timing: string;
  special_date?: string;
  photo_url?: string;
  is_saved?: boolean;
}

interface PersonalMessageCardProps {
  message: PersonalMessage;
  onUpdate: (id: string, field: string, value: string) => void;
  onDelete: (id: string) => void;
}

const PersonalMessageCard: React.FC<PersonalMessageCardProps> = ({
  message,
  onUpdate,
  onDelete
}) => {
  const [showDatePicker, setShowDatePicker] = useState(message.delivery_timing === 'special_date');
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  const handleDeliveryTimingChange = (value: string) => {
    onUpdate(message.id, 'delivery_timing', value);
    setShowDatePicker(value === 'special_date');
    if (value !== 'special_date') {
      onUpdate(message.id, 'special_date', '');
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to storage and get URL
      const fakeUrl = `photo_${Date.now()}.jpg`;
      onUpdate(message.id, 'photo_url', fakeUrl);
    }
  };

  return (
    <Card className="border-l-4 border-l-pink-400 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            💌 Personal Message
            {message.is_saved && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Saved
              </Badge>
            )}
          </CardTitle>
          <Button
            onClick={() => onDelete(message.id)}
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`recipient-${message.id}`}>Recipient's Name</Label>
            <Input
              id={`recipient-${message.id}`}
              value={message.recipient_name}
              onChange={(e) => onUpdate(message.id, 'recipient_name', e.target.value)}
              placeholder="Enter recipient's name"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor={`relationship-${message.id}`}>Relationship</Label>
            <Input
              id={`relationship-${message.id}`}
              value={message.relationship}
              onChange={(e) => onUpdate(message.id, 'relationship', e.target.value)}
              placeholder="e.g., Daughter, Grandson, Friend"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor={`message-${message.id}`}>What would you like to say to them?</Label>
          <Textarea
            id={`message-${message.id}`}
            value={message.message_body}
            onChange={(e) => onUpdate(message.id, 'message_body', e.target.value)}
            placeholder="Share your heartfelt message, advice, or final thoughts..."
            className="mt-1 min-h-[120px]"
          />
        </div>

        <div>
          <Label>When should this message be delivered?</Label>
          <Select value={message.delivery_timing} onValueChange={handleDeliveryTimingChange}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select delivery timing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediately">Immediately</SelectItem>
              <SelectItem value="after_passing">After My Passing</SelectItem>
              <SelectItem value="special_date">Special Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {showDatePicker && (
          <div>
            <Label htmlFor={`date-${message.id}`}>Special Date</Label>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Input
                id={`date-${message.id}`}
                type="date"
                value={message.special_date || ''}
                onChange={(e) => onUpdate(message.id, 'special_date', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPhotoUpload(!showPhotoUpload)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Add Personal Photo (Optional)
          </Button>
          
          {message.photo_url && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Photo Added
            </Badge>
          )}
        </div>

        {showPhotoUpload && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-2">
              Upload a personal photo to include with this message
            </p>
          </div>
        )}

        {message.message_body && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Message Preview:</p>
            <p className="text-sm italic text-gray-800">
              "{message.message_body.substring(0, 100)}{message.message_body.length > 100 ? '...' : ''}"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalMessageCard;