import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { CreditCard } from 'lucide-react';

interface MoneyLogisticsSectionProps {
  recurringPayments: string;
  accountClosureTips: string;
  keyLocations: string;
  onRecurringPaymentsChange: (value: string) => void;
  onAccountClosureTipsChange: (value: string) => void;
  onKeyLocationsChange: (value: string) => void;
}

const MoneyLogisticsSection: React.FC<MoneyLogisticsSectionProps> = ({
  recurringPayments,
  accountClosureTips,
  keyLocations,
  onRecurringPaymentsChange,
  onAccountClosureTipsChange,
  onKeyLocationsChange,
}) => {
  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <CreditCard className="w-5 h-5" />
          Money & Logistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="recurring-payments" className="text-sm font-medium text-gray-700">
            Any recurring payments or subscriptions to be canceled?
          </Label>
          <Textarea
            id="recurring-payments"
            placeholder="e.g., Netflix subscription, gym membership, monthly donations..."
            value={recurringPayments}
            onChange={(e) => onRecurringPaymentsChange(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="account-closure-tips" className="text-sm font-medium text-gray-700">
            Tips for managing or closing accounts or services
          </Label>
          <Textarea
            id="account-closure-tips"
            placeholder="e.g., Call customer service for utility accounts, contact HR for benefits..."
            value={accountClosureTips}
            onChange={(e) => onAccountClosureTipsChange(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="key-locations" className="text-sm font-medium text-gray-700">
            Where to find keys, passwords, or important codes (without listing them here)
          </Label>
          <Textarea
            id="key-locations"
            placeholder="e.g., Spare keys in kitchen drawer, password book in desk, safe combination with attorney..."
            value={keyLocations}
            onChange={(e) => onKeyLocationsChange(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MoneyLogisticsSection;