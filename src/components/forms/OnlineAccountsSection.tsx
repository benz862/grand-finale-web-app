import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface OnlineAccountsSectionProps {
  formData: {
    email_accounts: string;
    banking_sites: string;
    subscription_services: string;
    owned_websites: string;
  };
  onChange: (field: string, value: string) => void;
}

const OnlineAccountsSection: React.FC<OnlineAccountsSectionProps> = ({
  formData,
  onChange,
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          🌐 Online Accounts & Services
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="email_accounts" className="text-sm font-medium text-gray-700">
            Email address(es) used online
          </Label>
          <Textarea
            id="email_accounts"
            value={formData.email_accounts}
            onChange={(e) => onChange('email_accounts', e.target.value)}
            placeholder="List your email addresses..."
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="banking_sites" className="text-sm font-medium text-gray-700">
            Banking or financial websites/accounts
          </Label>
          <Textarea
            id="banking_sites"
            value={formData.banking_sites}
            onChange={(e) => onChange('banking_sites', e.target.value)}
            placeholder="List banking websites (don't include passwords)..."
            className="mt-1"
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">
            You don't need to share passwords — just instructions.
          </p>
        </div>

        <div>
          <Label htmlFor="subscription_services" className="text-sm font-medium text-gray-700">
            Shopping or subscription services (e.g., Amazon, Netflix)
          </Label>
          <Textarea
            id="subscription_services"
            value={formData.subscription_services}
            onChange={(e) => onChange('subscription_services', e.target.value)}
            placeholder="List subscription services..."
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="owned_websites" className="text-sm font-medium text-gray-700">
            Websites you own or manage
          </Label>
          <Textarea
            id="owned_websites"
            value={formData.owned_websites}
            onChange={(e) => onChange('owned_websites', e.target.value)}
            placeholder="List websites you own or manage..."
            className="mt-1"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default OnlineAccountsSection;