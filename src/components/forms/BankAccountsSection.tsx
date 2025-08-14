import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertTriangle } from 'lucide-react';

interface BankAccountsSectionProps {
  bankNames: string;
  accountTypes: string;
  accountIdentifiers: string;
  onlineAccess: string;
  onChange: (field: string, value: string) => void;
}

const BankAccountsSection: React.FC<BankAccountsSectionProps> = ({
  bankNames,
  accountTypes,
  accountIdentifiers,
  onlineAccess,
  onChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Bank Accounts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="bankNames" className="text-sm font-medium text-gray-700">
            Bank name(s) where you hold an account *
          </Label>
          <p className="text-xs text-gray-500 mb-2">
            Enter each bank on a new line or separate with commas
          </p>
          <Textarea
            id="bankNames"
            value={bankNames}
            onChange={(e) => onChange('bankNames', e.target.value)}
            placeholder="Chase Bank\nBank of America\nWells Fargo"
            className="min-h-[80px]"
            required
          />
        </div>

        <div>
          <Label htmlFor="accountTypes" className="text-sm font-medium text-gray-700">
            Account types (checking, savings, etc.)
          </Label>
          <p className="text-xs text-gray-500 mb-2">
            Specify what type of account each one is
          </p>
          <Textarea
            id="accountTypes"
            value={accountTypes}
            onChange={(e) => onChange('accountTypes', e.target.value)}
            placeholder="Checking\nSavings\n401k"
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="accountIdentifiers" className="text-sm font-medium text-gray-700">
            Account numbers or identifiers (optional)
          </Label>
          <p className="text-xs text-gray-500 mb-2">
            You may choose not to store actual account numbers for security
          </p>
          <Textarea
            id="accountIdentifiers"
            value={accountIdentifiers}
            onChange={(e) => onChange('accountIdentifiers', e.target.value)}
            placeholder="****1234\n****5678\nLast 4 digits only"
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="onlineAccess" className="text-sm font-medium text-gray-700">
            Online login or access instructions (optional)
          </Label>
          <Alert className="my-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Caution: Consider security implications before storing login information
            </AlertDescription>
          </Alert>
          <Textarea
            id="onlineAccess"
            value={onlineAccess}
            onChange={(e) => onChange('onlineAccess', e.target.value)}
            placeholder="Username: john.doe\nPassword stored in password manager\nSecurity questions: mother's maiden name"
            className="min-h-[80px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BankAccountsSection;