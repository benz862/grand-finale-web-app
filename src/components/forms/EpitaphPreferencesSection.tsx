import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface EpitaphPreferencesSectionProps {
  wantsHeadstone: string;
  epitaphText: string;
  onChange: (field: string, value: string) => void;
}

const EpitaphPreferencesSection: React.FC<EpitaphPreferencesSectionProps> = ({
  wantsHeadstone,
  epitaphText,
  onChange
}) => {
  return (
    <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-800 flex items-center gap-2">
          🪦 Epitaph Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Do you wish to have a headstone or plaque?
          </Label>
          <RadioGroup
            value={wantsHeadstone}
            onValueChange={(value) => onChange('wantsHeadstone', value)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id="headstone-yes" />
              <Label htmlFor="headstone-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id="headstone-no" />
              <Label htmlFor="headstone-no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="undecided" id="headstone-undecided" />
              <Label htmlFor="headstone-undecided">Undecided</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="epitaph-text" className="text-sm font-medium text-gray-700">
              Suggested Epitaph or Inscription
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Examples: Beloved Mother & Friend | Always Dancing | Just Getting Started</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="epitaph-text"
            value={epitaphText}
            onChange={(e) => onChange('epitaphText', e.target.value)}
            placeholder="Enter your preferred epitaph or inscription..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EpitaphPreferencesSection;