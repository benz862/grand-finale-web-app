import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface LetterData {
  id: string;
  recipient_name: string;
  recipient_relationship: string;
  delivery_method: string;
  delivery_method_other: string;
  letter_content: string;
  share_publicly: string;
}

interface LetterCardProps {
  letter: LetterData;
  onUpdate: (id: string, field: string, value: string) => void;
  onDelete: (id: string) => void;
}

const LetterCard: React.FC<LetterCardProps> = ({ letter, onUpdate, onDelete }) => {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Letter to {letter.recipient_name || 'New Recipient'}</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(letter.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`recipient-${letter.id}`}>Recipient's Name *</Label>
            <Input
              id={`recipient-${letter.id}`}
              value={letter.recipient_name}
              onChange={(e) => onUpdate(letter.id, 'recipient_name', e.target.value)}
              placeholder="Enter recipient's name"
              required
            />
          </div>
          <div>
            <Label htmlFor={`relationship-${letter.id}`}>Relationship</Label>
            <Input
              id={`relationship-${letter.id}`}
              value={letter.recipient_relationship}
              onChange={(e) => onUpdate(letter.id, 'recipient_relationship', e.target.value)}
              placeholder="e.g., daughter, friend, lawyer"
            />
          </div>
        </div>

        <div>
          <Label>Preferred Delivery Method</Label>
          <Select
            value={letter.delivery_method}
            onValueChange={(value) => onUpdate(letter.id, 'delivery_method', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select delivery method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Print">Print</SelectItem>
              <SelectItem value="Email">Email</SelectItem>
              <SelectItem value="Personal Delivery">Personal Delivery</SelectItem>
              <SelectItem value="Lawyer Hold">Lawyer Hold</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {letter.delivery_method === 'Other' && (
          <div>
            <Label htmlFor={`other-method-${letter.id}`}>If other, explain</Label>
            <Input
              id={`other-method-${letter.id}`}
              value={letter.delivery_method_other}
              onChange={(e) => onUpdate(letter.id, 'delivery_method_other', e.target.value)}
              placeholder="Explain delivery method"
            />
          </div>
        )}

        <div>
          <Label htmlFor={`letter-content-${letter.id}`}>Your Personal Message or Letter</Label>
          <Textarea
            id={`letter-content-${letter.id}`}
            value={letter.letter_content}
            onChange={(e) => onUpdate(letter.id, 'letter_content', e.target.value)}
            placeholder="Write your personal message or letter here..."
            className="min-h-[120px] resize-y"
          />
        </div>

        <div>
          <Label>Should this message be shared publicly at a service?</Label>
          <RadioGroup
            value={letter.share_publicly}
            onValueChange={(value) => onUpdate(letter.id, 'share_publicly', value)}
            className="flex flex-row space-x-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id={`share-yes-${letter.id}`} />
              <Label htmlFor={`share-yes-${letter.id}`}>Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id={`share-no-${letter.id}`} />
              <Label htmlFor={`share-no-${letter.id}`}>No</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default LetterCard;