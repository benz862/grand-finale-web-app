import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ReligiousPreferencesSectionProps {
  religiousAffiliation: string;
  placeOfWorship: string;
  worshipAddress: string;
  clergyName: string;
  clergyContact: string;
  clergyEmail: string;
  lastRites: string;
  clergyPresent: string;
  scripturePreferences: string;
  prayerStyle: string;
  burialRituals: string;
  onReligiousAffiliationChange: (value: string) => void;
  onPlaceOfWorshipChange: (value: string) => void;
  onWorshipAddressChange: (value: string) => void;
  onClergyNameChange: (value: string) => void;
  onClergyContactChange: (value: string) => void;
  onClergyEmailChange: (value: string) => void;
  onLastRitesChange: (value: string) => void;
  onClergyPresentChange: (value: string) => void;
  onScripturePreferencesChange: (value: string) => void;
  onPrayerStyleChange: (value: string) => void;
  onBurialRitualsChange: (value: string) => void;
}

const ReligiousPreferencesSection: React.FC<ReligiousPreferencesSectionProps> = ({
  religiousAffiliation,
  placeOfWorship,
  worshipAddress,
  clergyName,
  clergyContact,
  clergyEmail,
  lastRites,
  clergyPresent,
  scripturePreferences,
  prayerStyle,
  burialRituals,
  onReligiousAffiliationChange,
  onPlaceOfWorshipChange,
  onWorshipAddressChange,
  onClergyNameChange,
  onClergyContactChange,
  onClergyEmailChange,
  onLastRitesChange,
  onClergyPresentChange,
  onScripturePreferencesChange,
  onPrayerStyleChange,
  onBurialRitualsChange
}) => {
  const yesNoOptions = ['Yes', 'No', 'Undecided'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Religious and Spiritual Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Religious Affiliation/Faith Tradition</Label>
          <Input
            value={religiousAffiliation}
            onChange={(e) => onReligiousAffiliationChange(e.target.value)}
            placeholder="e.g., Catholic, Protestant, Jewish, Muslim, Buddhist, etc."
          />
        </div>
        
        <div className="space-y-2">
          <Label>Place of Worship - Name</Label>
          <Input
            value={placeOfWorship}
            onChange={(e) => onPlaceOfWorshipChange(e.target.value)}
            placeholder="Name of church, synagogue, mosque, temple, etc."
          />
        </div>
        
        <div className="space-y-2">
          <Label>Place of Worship - Address</Label>
          <Input
            value={worshipAddress}
            onChange={(e) => onWorshipAddressChange(e.target.value)}
            placeholder="Full address of place of worship"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Clergy/Spiritual Leader - Name</Label>
          <Input
            value={clergyName}
            onChange={(e) => onClergyNameChange(e.target.value)}
            placeholder="Name of priest, pastor, rabbi, imam, etc."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Clergy Contact - Phone</Label>
            <Input
              value={clergyContact}
              onChange={(e) => onClergyContactChange(e.target.value)}
              placeholder="(555) 123-4567 or +1 234 567 8900"
              type="tel"
            />
          </div>
          <div className="space-y-2">
            <Label>Clergy Contact - Email</Label>
            <Input
              value={clergyEmail}
              onChange={(e) => onClergyEmailChange(e.target.value)}
              placeholder="clergy@example.com"
              type="email"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium">End of Life Religious Preferences</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Do you want last rites?</Label>
              <Select value={lastRites} onValueChange={onLastRitesChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  {yesNoOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Do you want clergy present?</Label>
              <Select value={clergyPresent} onValueChange={onClergyPresentChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  {yesNoOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Scripture Preferences</Label>
            <Textarea
              value={scripturePreferences}
              onChange={(e) => onScripturePreferencesChange(e.target.value)}
              placeholder="Specific scriptures, verses, or readings you would like"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Prayer Style</Label>
            <Textarea
              value={prayerStyle}
              onChange={(e) => onPrayerStyleChange(e.target.value)}
              placeholder="Preferred prayer style or specific prayers"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Burial Rituals</Label>
            <Textarea
              value={burialRituals}
              onChange={(e) => onBurialRitualsChange(e.target.value)}
              placeholder="Specific burial or memorial rituals you would like observed"
              rows={3}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReligiousPreferencesSection;