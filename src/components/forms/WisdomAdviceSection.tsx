import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Heart } from 'lucide-react';

interface WisdomAdviceSectionProps {
  lifeAdvice: string;
  finalGuidance: string;
  onLifeAdviceChange: (value: string) => void;
  onFinalGuidanceChange: (value: string) => void;
}

const WisdomAdviceSection: React.FC<WisdomAdviceSectionProps> = ({
  lifeAdvice,
  finalGuidance,
  onLifeAdviceChange,
  onFinalGuidanceChange,
}) => {
  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Heart className="w-5 h-5" />
          Wisdom & Personal Advice
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="life-advice" className="text-sm font-medium text-gray-700">
            What practical advice do you want to pass on?
          </Label>
          <Textarea
            id="life-advice"
            placeholder="e.g., Always trust your instincts, invest in experiences over things, call your mother..."
            value={lifeAdvice}
            onChange={(e) => onLifeAdviceChange(e.target.value)}
            className="min-h-[120px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="final-guidance" className="text-sm font-medium text-gray-700">
            Anything else you want to explain or prepare someone for?
          </Label>
          <Textarea
            id="final-guidance"
            placeholder="e.g., How to handle difficult family situations, what to do with personal belongings..."
            value={finalGuidance}
            onChange={(e) => onFinalGuidanceChange(e.target.value)}
            className="min-h-[120px] resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WisdomAdviceSection;