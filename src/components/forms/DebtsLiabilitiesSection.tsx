import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface DebtsLiabilitiesSectionProps {
  hasDebts: string;
  debtDetails: string;
  debtDocumentsLocation: string;
  onChange: (field: string, value: string) => void;
}

const DebtsLiabilitiesSection: React.FC<DebtsLiabilitiesSectionProps> = ({
  hasDebts,
  debtDetails,
  debtDocumentsLocation,
  onChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Debts & Liabilities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Do you have any debts or loans?
          </Label>
          <RadioGroup
            value={hasDebts}
            onValueChange={(value) => onChange('hasDebts', value)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id="debts-yes" />
              <Label htmlFor="debts-yes" className="text-sm font-normal">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id="debts-no" />
              <Label htmlFor="debts-no" className="text-sm font-normal">
                No
              </Label>
            </div>
          </RadioGroup>
        </div>

        {hasDebts === 'Yes' && (
          <>
            <div>
              <Label htmlFor="debtDetails" className="text-sm font-medium text-gray-700">
                Details about debts, loans, credit cards
              </Label>
              <p className="text-xs text-gray-500 mb-2">
                Include creditor names, approximate amounts, payment terms
              </p>
              <Textarea
                id="debtDetails"
                value={debtDetails}
                onChange={(e) => onChange('debtDetails', e.target.value)}
                placeholder="Credit Card - Chase Visa: ~$5,000\nMortgage - Wells Fargo: $250,000\nCar loan - Toyota Financial: $15,000"
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="debtDocumentsLocation" className="text-sm font-medium text-gray-700">
                Location of loan or credit documents
              </Label>
              <p className="text-xs text-gray-500 mb-2">
                Where can your executor find these documents?
              </p>
              <Input
                id="debtDocumentsLocation"
                value={debtDocumentsLocation}
                onChange={(e) => onChange('debtDocumentsLocation', e.target.value)}
                placeholder="Filing cabinet, drawer 2 / Digital folder on computer"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DebtsLiabilitiesSection;