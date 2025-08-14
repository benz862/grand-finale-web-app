import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';

interface PassportData {
  id: string;
  issuing_country: string;
  passport_number: string;
  issue_date: string;
  expiration_date: string;
  document_location: string;
  notes: string;
}

interface PassportCardProps {
  passport: PassportData;
  index: number;
  onUpdate: (id: string, field: string, value: string) => void;
  onDelete: (id: string) => void;
  countries: string[];
}

const PassportCard: React.FC<PassportCardProps> = ({
  passport,
  index,
  onUpdate,
  onDelete,
  countries
}) => {
  return (
    <Card className="neumorphic-card mb-4">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-serif text-primary">
            Passport {index + 1}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(passport.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div>
          <Label htmlFor={`country-${passport.id}`} className="text-sm font-medium text-foreground">
            Country that issued passport *
          </Label>
          <Select
            value={passport.issuing_country}
            onValueChange={(value) => onUpdate(passport.id, 'issuing_country', value)}
          >
            <SelectTrigger className="mt-1 neumorphic-input">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor={`passport-number-${passport.id}`} className="text-sm font-medium text-foreground">
            Passport number *
          </Label>
          <Input
            id={`passport-number-${passport.id}`}
            value={passport.passport_number}
            onChange={(e) => onUpdate(passport.id, 'passport_number', e.target.value)}
            placeholder="Enter passport number"
            className="mt-1 neumorphic-input"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`issue-date-${passport.id}`} className="text-sm font-medium text-foreground">
              Issue date *
            </Label>
            <Input
              id={`issue-date-${passport.id}`}
              type="date"
              value={passport.issue_date}
              onChange={(e) => onUpdate(passport.id, 'issue_date', e.target.value)}
              className="mt-1 neumorphic-input"
            />
          </div>
          <div>
            <Label htmlFor={`expiration-date-${passport.id}`} className="text-sm font-medium text-foreground">
              Expiration date *
            </Label>
            <Input
              id={`expiration-date-${passport.id}`}
              type="date"
              value={passport.expiration_date}
              onChange={(e) => onUpdate(passport.id, 'expiration_date', e.target.value)}
              className="mt-1 neumorphic-input"
            />
          </div>
        </div>

        <div>
          <Label htmlFor={`location-${passport.id}`} className="text-sm font-medium text-foreground">
            Passport location (physical or digital)
          </Label>
          <Input
            id={`location-${passport.id}`}
            value={passport.document_location}
            onChange={(e) => onUpdate(passport.id, 'document_location', e.target.value)}
            placeholder="Where is this passport stored?"
            className="mt-1 neumorphic-input"
          />
        </div>

        <div>
          <Label htmlFor={`notes-${passport.id}`} className="text-sm font-medium text-foreground">
            Any notes or extra details?
          </Label>
          <Textarea
            id={`notes-${passport.id}`}
            value={passport.notes}
            onChange={(e) => onUpdate(passport.id, 'notes', e.target.value)}
            placeholder="Additional notes..."
            rows={3}
            className="mt-1 neumorphic-input"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PassportCard;