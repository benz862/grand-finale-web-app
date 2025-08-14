import React from 'react';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Input } from '../ui/input';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface OrganDonationSectionProps {
  organDonor: string;
  organDonorStateRegistered: string;
  organDonorDocumentLocation: string;
  livingWillCompleted: string;
  livingWillDate: Date | undefined;
  livingWillLocation: string;
  dnrInPlace: string;
  dnrLocation: string;
  onOrganDonorChange: (value: string) => void;
  onOrganDonorStateRegisteredChange: (value: string) => void;
  onOrganDonorDocumentLocationChange: (value: string) => void;
  onLivingWillCompletedChange: (value: string) => void;
  onLivingWillDateChange: (date: Date | undefined) => void;
  onLivingWillLocationChange: (value: string) => void;
  onDnrInPlaceChange: (value: string) => void;
  onDnrLocationChange: (value: string) => void;
}

const OrganDonationSection: React.FC<OrganDonationSectionProps> = ({
  organDonor,
  organDonorStateRegistered,
  organDonorDocumentLocation,
  livingWillCompleted,
  livingWillDate,
  livingWillLocation,
  dnrInPlace,
  dnrLocation,
  onOrganDonorChange,
  onOrganDonorStateRegisteredChange,
  onOrganDonorDocumentLocationChange,
  onLivingWillCompletedChange,
  onLivingWillDateChange,
  onLivingWillLocationChange,
  onDnrInPlaceChange,
  onDnrLocationChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700">
          Are you an organ donor?
        </Label>
        <RadioGroup value={organDonor} onValueChange={onOrganDonorChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Yes" id="organ-donor-yes" />
            <Label htmlFor="organ-donor-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="No" id="organ-donor-no" />
            <Label htmlFor="organ-donor-no">No</Label>
          </div>
        </RadioGroup>
        {organDonor === 'Yes' && (
          <div className="space-y-4 ml-4">
            <div className="space-y-2">
              <Label htmlFor="organ-donor-state" className="text-sm font-medium text-gray-700">
                Which state/province are you registered in?
              </Label>
              <Input
                id="organ-donor-state"
                value={organDonorStateRegistered}
                onChange={(e) => onOrganDonorStateRegisteredChange(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organ-donor-location" className="text-sm font-medium text-gray-700">
                Where is your donor registration document kept?
              </Label>
              <Input
                id="organ-donor-location"
                value={organDonorDocumentLocation}
                onChange={(e) => onOrganDonorDocumentLocationChange(e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700">
          Have you completed a Living Will?
        </Label>
        <RadioGroup value={livingWillCompleted} onValueChange={onLivingWillCompletedChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Yes" id="living-will-yes" />
            <Label htmlFor="living-will-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="No" id="living-will-no" />
            <Label htmlFor="living-will-no">No</Label>
          </div>
        </RadioGroup>
        {livingWillCompleted === 'Yes' && (
          <div className="space-y-4 ml-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                What date was it completed?
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {livingWillDate ? format(livingWillDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={livingWillDate}
                    onSelect={onLivingWillDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="living-will-location" className="text-sm font-medium text-gray-700">
                Where is your Living Will stored?
              </Label>
              <Input
                id="living-will-location"
                value={livingWillLocation}
                onChange={(e) => onLivingWillLocationChange(e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700">
          Do you have a DNR (Do Not Resuscitate) order?
        </Label>
        <RadioGroup value={dnrInPlace} onValueChange={onDnrInPlaceChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Yes" id="dnr-yes" />
            <Label htmlFor="dnr-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="No" id="dnr-no" />
            <Label htmlFor="dnr-no">No</Label>
          </div>
        </RadioGroup>
        {dnrInPlace === 'Yes' && (
          <div className="space-y-2 ml-4">
            <Label htmlFor="dnr-location" className="text-sm font-medium text-gray-700">
              Where is your DNR stored?
            </Label>
            <Input
              id="dnr-location"
              value={dnrLocation}
              onChange={(e) => onDnrLocationChange(e.target.value)}
              placeholder="Optional"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganDonationSection;