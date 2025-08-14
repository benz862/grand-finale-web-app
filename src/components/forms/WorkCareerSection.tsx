import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WorkCareerSectionProps {
  employmentStatus: string;
  employerName: string;
  employerAddress: string;
  employerPhone: string;
  supervisorName: string;
  supervisorPhone: string;
  onEmploymentStatusChange: (value: string) => void;
  onEmployerNameChange: (value: string) => void;
  onEmployerAddressChange: (value: string) => void;
  onEmployerPhoneChange: (value: string) => void;
  onSupervisorNameChange: (value: string) => void;
  onSupervisorPhoneChange: (value: string) => void;
}

const WorkCareerSection: React.FC<WorkCareerSectionProps> = ({
  employmentStatus,
  employerName,
  employerAddress,
  employerPhone,
  supervisorName,
  supervisorPhone,
  onEmploymentStatusChange,
  onEmployerNameChange,
  onEmployerAddressChange,
  onEmployerPhoneChange,
  onSupervisorNameChange,
  onSupervisorPhoneChange
}) => {
  const employmentStatuses = [
    'Employed',
    'Unemployed',
    'Self-employed',
    'Entrepreneur',
    'Retired'
  ];

  const showEmployerFields = employmentStatus && 
    ['Employed', 'Self-employed', 'Entrepreneur'].includes(employmentStatus);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work and Career Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Employment Status</Label>
          <Select value={employmentStatus} onValueChange={onEmploymentStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select employment status" />
            </SelectTrigger>
            <SelectContent>
              {employmentStatuses.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {showEmployerFields && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Employer Name</Label>
              <Input
                value={employerName}
                onChange={(e) => onEmployerNameChange(e.target.value)}
                placeholder="Enter employer/company name"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Employer Address</Label>
              <Input
                value={employerAddress}
                onChange={(e) => onEmployerAddressChange(e.target.value)}
                placeholder="Enter employer address"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Employer Phone</Label>
              <Input
                value={employerPhone}
                onChange={(e) => onEmployerPhoneChange(e.target.value)}
                placeholder="(555) 123-4567 or +1 234 567 8900"
                type="tel"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Supervisor/Contact Person Name</Label>
              <Input
                value={supervisorName}
                onChange={(e) => onSupervisorNameChange(e.target.value)}
                placeholder="Enter supervisor or contact person name"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Supervisor/Contact Person Phone</Label>
              <Input
                value={supervisorPhone}
                onChange={(e) => onSupervisorPhoneChange(e.target.value)}
                placeholder="(555) 123-4567 or +1 234 567 8900"
                type="tel"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkCareerSection;