import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface SocialMediaSectionProps {
  formData: {
    facebook_url: string;
    instagram_handle: string;
    twitter_handle: string;
    linkedin_url: string;
    other_social_accounts: string;
  };
  onChange: (field: string, value: string) => void;
}

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  formData,
  onChange,
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          📱 Social Media Accounts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="facebook_url" className="text-sm font-medium text-gray-700">
            Facebook profile or page(s)
          </Label>
          <Input
            id="facebook_url"
            value={formData.facebook_url}
            onChange={(e) => onChange('facebook_url', e.target.value)}
            placeholder="https://facebook.com/yourprofile"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="instagram_handle" className="text-sm font-medium text-gray-700">
            Instagram handle(s)
          </Label>
          <Input
            id="instagram_handle"
            value={formData.instagram_handle}
            onChange={(e) => onChange('instagram_handle', e.target.value)}
            placeholder="@yourusername"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="twitter_handle" className="text-sm font-medium text-gray-700">
            X (Twitter) handle(s)
          </Label>
          <Input
            id="twitter_handle"
            value={formData.twitter_handle}
            onChange={(e) => onChange('twitter_handle', e.target.value)}
            placeholder="@yourusername"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="linkedin_url" className="text-sm font-medium text-gray-700">
            LinkedIn profile
          </Label>
          <Input
            id="linkedin_url"
            value={formData.linkedin_url}
            onChange={(e) => onChange('linkedin_url', e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="other_social_accounts" className="text-sm font-medium text-gray-700">
            Other social media accounts (TikTok, YouTube, etc.)
          </Label>
          <Textarea
            id="other_social_accounts"
            value={formData.other_social_accounts}
            onChange={(e) => onChange('other_social_accounts', e.target.value)}
            placeholder="List other social media accounts..."
            className="mt-1"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaSection;