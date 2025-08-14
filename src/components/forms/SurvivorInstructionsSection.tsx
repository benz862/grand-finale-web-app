import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface SurvivorInstructions {
  has_dependents: string;
  dependent_details: string;
  survivor_instructions: string;
}

interface SurvivorInstructionsSectionProps {
  data: SurvivorInstructions;
  onChange: (field: keyof SurvivorInstructions, value: string) => void;
}

const SurvivorInstructionsSection: React.FC<SurvivorInstructionsSectionProps> = ({ data, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          ❤️ Survivor Instructions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-3 block">
            Are there loved ones who depend on you?
          </Label>
          <RadioGroup
            value={data.has_dependents}
            onValueChange={(value) => onChange('has_dependents', value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id="dependents-yes" />
              <Label htmlFor="dependents-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id="dependents-no" />
              <Label htmlFor="dependents-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        {data.has_dependents === 'Yes' && (
          <div>
            <Label htmlFor="dependent-details" className="text-base font-medium">
              List their names and your wishes for them
            </Label>
            <Textarea
              id="dependent-details"
              value={data.dependent_details}
              onChange={(e) => onChange('dependent_details', e.target.value)}
              placeholder="List names and specific wishes for each dependent"
              rows={4}
              className="mt-2"
            />
          </div>
        )}

        <div>
          <Label htmlFor="survivor-instructions" className="text-base font-medium">
            Additional instructions for family/friends
          </Label>
          <Textarea
            id="survivor-instructions"
            value={data.survivor_instructions}
            onChange={(e) => onChange('survivor_instructions', e.target.value)}
            placeholder="Any additional instructions or wishes for your loved ones"
            rows={4}
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SurvivorInstructionsSection;