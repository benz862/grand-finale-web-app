import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface PronounTitleSectionProps {
  pronouns: string;
  customPronouns: string;
  title: string;
  customTitle: string;
  onPronounsChange: (value: string) => void;
  onCustomPronounsChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onCustomTitleChange: (value: string) => void;
}

const PronounTitleSection: React.FC<PronounTitleSectionProps> = ({
  pronouns,
  customPronouns,
  title,
  customTitle,
  onPronounsChange,
  onCustomPronounsChange,
  onTitleChange,
  onCustomTitleChange,
}) => {
  return (
    <Card className="mb-6 shadow-lg border-2 border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="text-purple-800">Pronoun & Title Preferences</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pronouns" className="text-sm font-medium text-gray-700">
            What pronouns do you use?
          </Label>
          <Select value={pronouns} onValueChange={onPronounsChange}>
            <SelectTrigger className="border-purple-300 focus:border-purple-500">
              <SelectValue placeholder="Select pronouns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="he/him">He/Him</SelectItem>
              <SelectItem value="she/her">She/Her</SelectItem>
              <SelectItem value="they/them">They/Them</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {pronouns === 'custom' && (
          <div className="space-y-2">
            <Label htmlFor="customPronouns" className="text-sm font-medium text-gray-700">
              Custom pronouns
            </Label>
            <Input
              id="customPronouns"
              value={customPronouns}
              onChange={(e) => onCustomPronounsChange(e.target.value)}
              className="border-purple-300 focus:border-purple-500"
              placeholder="Enter your pronouns"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">
            Preferred title (Mr., Ms., Mx., etc.)
          </Label>
          <Select value={title} onValueChange={onTitleChange}>
            <SelectTrigger className="border-purple-300 focus:border-purple-500">
              <SelectValue placeholder="Select title" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mr">Mr.</SelectItem>
              <SelectItem value="ms">Ms.</SelectItem>
              <SelectItem value="mx">Mx.</SelectItem>
              <SelectItem value="dr">Dr.</SelectItem>
              <SelectItem value="rev">Rev.</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {title === 'other' && (
          <div className="space-y-2">
            <Label htmlFor="customTitle" className="text-sm font-medium text-gray-700">
              Custom title
            </Label>
            <Input
              id="customTitle"
              value={customTitle}
              onChange={(e) => onCustomTitleChange(e.target.value)}
              className="border-purple-300 focus:border-purple-500"
              placeholder="Enter your title"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PronounTitleSection;