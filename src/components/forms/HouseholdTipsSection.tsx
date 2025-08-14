import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Home } from 'lucide-react';

interface HouseholdTipsSectionProps {
  dailyRoutines: string;
  regularTasks: string;
  householdQuirks: string;
  onDailyRoutinesChange: (value: string) => void;
  onRegularTasksChange: (value: string) => void;
  onHouseholdQuirksChange: (value: string) => void;
}

const HouseholdTipsSection: React.FC<HouseholdTipsSectionProps> = ({
  dailyRoutines,
  regularTasks,
  householdQuirks,
  onDailyRoutinesChange,
  onRegularTasksChange,
  onHouseholdQuirksChange,
}) => {
  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Home className="w-5 h-5" />
          Household & Day-to-Day Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="daily-routines" className="text-sm font-medium text-gray-700">
            Do you have any daily routines or habits you want people to know?
          </Label>
          <Textarea
            id="daily-routines"
            placeholder="e.g., Morning coffee at 6 AM, evening walk with the dog..."
            value={dailyRoutines}
            onChange={(e) => onDailyRoutinesChange(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="regular-tasks" className="text-sm font-medium text-gray-700">
            Important things you take care of regularly (e.g., plant watering, bill dates)
          </Label>
          <Textarea
            id="regular-tasks"
            placeholder="e.g., Water plants every Tuesday, pay rent on the 1st..."
            value={regularTasks}
            onChange={(e) => onRegularTasksChange(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="household-quirks" className="text-sm font-medium text-gray-700">
            Are there household quirks or maintenance notes (e.g., sticky door, tricky lock)?
          </Label>
          <Textarea
            id="household-quirks"
            placeholder="e.g., Front door needs a firm push, basement light switch is behind the stairs..."
            value={householdQuirks}
            onChange={(e) => onHouseholdQuirksChange(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default HouseholdTipsSection;