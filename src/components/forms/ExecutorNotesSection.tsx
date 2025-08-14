import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface ExecutorNotesSectionProps {
  formData: any;
  onChange: (field: string, value: string | number) => void;
}

const ExecutorNotesSection: React.FC<ExecutorNotesSectionProps> = ({ formData, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Executor Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="executor-doc-location">Document Stating Executor Role Is Located At</Label>
          <Input
            id="executor-doc-location"
            value={formData.executor_doc_location || ''}
            onChange={(e) => onChange('executor_doc_location', e.target.value)}
            placeholder="Enter document location"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Executor Compensation Preference</Label>
          <RadioGroup
            value={formData.executor_compensation || ''}
            onValueChange={(value) => onChange('executor_compensation', value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="waive" id="comp-waive" />
              <Label htmlFor="comp-waive">Waive</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="flat-fee" id="comp-flat" />
              <Label htmlFor="comp-flat">Flat Fee</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hourly" id="comp-hourly" />
              <Label htmlFor="comp-hourly">Hourly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="as-allowed" id="comp-allowed" />
              <Label htmlFor="comp-allowed">As Allowed by Law</Label>
            </div>
          </RadioGroup>
        </div>

        {formData.executor_compensation === 'flat-fee' && (
          <div className="space-y-2">
            <Label htmlFor="executor-flat-fee">Flat Fee ($)</Label>
            <Input
              id="executor-flat-fee"
              type="number"
              value={formData.executor_flat_fee || ''}
              onChange={(e) => onChange('executor_flat_fee', parseFloat(e.target.value) || 0)}
              placeholder="Enter flat fee amount"
            />
          </div>
        )}

        {formData.executor_compensation === 'hourly' && (
          <div className="space-y-2">
            <Label htmlFor="executor-hourly-rate">Hourly Rate ($)</Label>
            <Input
              id="executor-hourly-rate"
              type="number"
              value={formData.executor_hourly_rate || ''}
              onChange={(e) => onChange('executor_hourly_rate', parseFloat(e.target.value) || 0)}
              placeholder="Enter hourly rate"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="executor-notes">Special Notes or Instructions</Label>
          <Textarea
            id="executor-notes"
            value={formData.executor_notes || ''}
            onChange={(e) => onChange('executor_notes', e.target.value)}
            placeholder="Enter any special notes or instructions..."
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ExecutorNotesSection;