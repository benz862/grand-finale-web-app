import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Heart } from 'lucide-react';

interface FinalReflectionSectionProps {
  closingNotes: string;
  finalInstructions: string;
  onClosingNotesChange: (value: string) => void;
  onFinalInstructionsChange: (value: string) => void;
}

const FinalReflectionSection: React.FC<FinalReflectionSectionProps> = ({
  closingNotes,
  finalInstructions,
  onClosingNotesChange,
  onFinalInstructionsChange
}) => {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Heart className="h-5 w-5" />
          Final Reflection & Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="closing-notes" className="text-sm font-medium">
            Is there anything else you'd like to share or say?
          </Label>
          <Textarea
            id="closing-notes"
            placeholder="Share any final thoughts, reflections, or messages you'd like to leave behind..."
            value={closingNotes}
            onChange={(e) => onClosingNotesChange(e.target.value)}
            className="min-h-[120px] resize-none"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="final-instructions" className="text-sm font-medium">
            Any final instructions to your loved ones?
          </Label>
          <Textarea
            id="final-instructions"
            placeholder="Include any specific instructions, guidance, or wishes for your loved ones..."
            value={finalInstructions}
            onChange={(e) => onFinalInstructionsChange(e.target.value)}
            className="min-h-[120px] resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FinalReflectionSection;