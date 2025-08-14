import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface FinancialNotesSectionProps {
  financialContacts: string;
  financialNotes: string;
  onChange: (field: string, value: string) => void;
}

const FinancialNotesSection: React.FC<FinancialNotesSectionProps> = ({
  financialContacts,
  financialNotes,
  onChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Other Notes / Contacts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="financialContacts" className="text-sm font-medium text-gray-700">
            Financial planner, accountant, or advisor info
          </Label>
          <p className="text-xs text-gray-500 mb-2">
            Include name, phone, email, and their role
          </p>
          <Textarea
            id="financialContacts"
            value={financialContacts}
            onChange={(e) => onChange('financialContacts', e.target.value)}
            placeholder="Financial Advisor: John Smith\nPhone: (555) 123-4567\nEmail: john@smithfinancial.com\n\nAccountant: Jane Doe CPA\nPhone: (555) 987-6543\nEmail: jane@doecpa.com"
            className="min-h-[120px]"
          />
        </div>

        <div>
          <Label htmlFor="financialNotes" className="text-sm font-medium text-gray-700">
            Other financial info your executor should know
          </Label>
          <p className="text-xs text-gray-500 mb-2">
            Any additional financial information, instructions, or concerns
          </p>
          <Textarea
            id="financialNotes"
            value={financialNotes}
            onChange={(e) => onChange('financialNotes', e.target.value)}
            placeholder="- Investment accounts with Vanguard\n- Cryptocurrency wallet info stored separately\n- Annual tax documents filed in home office\n- Life insurance beneficiaries updated in 2023"
            className="min-h-[120px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialNotesSection;