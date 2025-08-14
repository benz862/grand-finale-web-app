import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface CeremonyDetailsSectionProps {
  officiantName: string;
  setOfficiantName: (value: string) => void;
  preferredReadings: string;
  setPreferredReadings: (value: string) => void;
  preferredMusic: string;
  setPreferredMusic: (value: string) => void;
  dressCode: string;
  setDressCode: (value: string) => void;
}

const CeremonyDetailsSection: React.FC<CeremonyDetailsSectionProps> = ({
  officiantName,
  setOfficiantName,
  preferredReadings,
  setPreferredReadings,
  preferredMusic,
  setPreferredMusic,
  dressCode,
  setDressCode,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Ceremony Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Preferred officiant (if any)
          </Label>
          <Input
            value={officiantName}
            onChange={(e) => setOfficiantName(e.target.value)}
            placeholder="Enter officiant name"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Preferred readings, prayers, or scripture
          </Label>
          <Textarea
            value={preferredReadings}
            onChange={(e) => setPreferredReadings(e.target.value)}
            placeholder="Enter preferred readings or prayers"
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Preferred music, songs, or hymns
          </Label>
          <Textarea
            value={preferredMusic}
            onChange={(e) => setPreferredMusic(e.target.value)}
            placeholder="Enter preferred music or songs"
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Dress code or theme (if any)
          </Label>
          <Input
            value={dressCode}
            onChange={(e) => setDressCode(e.target.value)}
            placeholder="Enter dress code or theme"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CeremonyDetailsSection;