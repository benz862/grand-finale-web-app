import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PrimaryContactSectionProps {
  preferredName: string;
  languageSpoken: string;
  customLanguage: string;
  onPreferredNameChange: (value: string) => void;
  onLanguageSpokenChange: (value: string) => void;
  onCustomLanguageChange: (value: string) => void;
}

const PrimaryContactSection: React.FC<PrimaryContactSectionProps> = ({
  preferredName,
  languageSpoken,
  customLanguage,
  onPreferredNameChange,
  onLanguageSpokenChange,
  onCustomLanguageChange,
}) => {
  return (
    <div className="neumorphic-card p-6 space-y-4">
      <h3 className="text-lg font-serif font-semibold text-primary mb-4">
        Primary Contact Information
      </h3>
      
      <div>
        <Label htmlFor="preferredName" className="text-sm font-medium text-text">
          Preferred name (nickname, chosen name)
        </Label>
        <Input
          id="preferredName"
          value={preferredName}
          onChange={(e) => onPreferredNameChange(e.target.value)}
          className="neumorphic-input mt-2"
          placeholder="Enter your preferred name"
        />
      </div>

      <div>
        <Label htmlFor="languageSpoken" className="text-sm font-medium text-text">
          Primary language spoken at home *
        </Label>
        <Select value={languageSpoken} onValueChange={onLanguageSpokenChange}>
          <SelectTrigger className="neumorphic-input mt-2">
            <SelectValue placeholder="Select primary language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="spanish">Spanish</SelectItem>
            <SelectItem value="french">French</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {languageSpoken === 'other' && (
        <div>
          <Label htmlFor="customLanguage" className="text-sm font-medium text-text">
            Custom language
          </Label>
          <Input
            id="customLanguage"
            value={customLanguage}
            onChange={(e) => onCustomLanguageChange(e.target.value)}
            className="neumorphic-input mt-2"
            placeholder="Enter your language"
          />
        </div>
      )}
    </div>
  );
};

export default PrimaryContactSection;