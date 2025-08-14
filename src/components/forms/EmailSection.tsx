import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';

interface Email {
  id: string;
  email: string;
  emailType: string;
  isPrimary: boolean;
}

interface EmailSectionProps {
  emails: Email[];
  onEmailsChange: (emails: Email[]) => void;
}

const EmailSection: React.FC<EmailSectionProps> = ({ emails, onEmailsChange }) => {
  const addEmail = () => {
    const newEmail: Email = {
      id: Date.now().toString(),
      email: '',
      emailType: '',
      isPrimary: emails.length === 0
    };
    onEmailsChange([...emails, newEmail]);
  };

  const removeEmail = (id: string) => {
    onEmailsChange(emails.filter(email => email.id !== id));
  };

  const updateEmail = (id: string, field: keyof Email, value: any) => {
    onEmailsChange(emails.map(email => {
      if (email.id === id) {
        if (field === 'isPrimary' && value) {
          return { ...email, [field]: value };
        }
        return { ...email, [field]: value };
      }
      if (field === 'isPrimary' && value) {
        return { ...email, isPrimary: false };
      }
      return email;
    }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="neumorphic-card p-6">
      <h3 className="text-lg font-serif font-semibold text-primary mb-4">
        Email Addresses
      </h3>
      
      {emails.map((email, index) => (
        <div key={email.id} className="mb-6 p-4 neumorphic-card">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-text">Email {index + 1}</h4>
            {emails.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeEmail(email.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-text">Email address *</Label>
              <Input
                type="email"
                value={email.email}
                onChange={(e) => updateEmail(email.id, 'email', e.target.value)}
                className={`neumorphic-input mt-2 ${email.email && !validateEmail(email.email) ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="example@email.com"
              />
              {email.email && !validateEmail(email.email) && (
                <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
              )}
            </div>
            
            <div>
              <Label className="text-sm font-medium text-text">Email type *</Label>
              <Select value={email.emailType} onValueChange={(value) => updateEmail(email.id, 'emailType', value)}>
                <SelectTrigger className="neumorphic-input mt-2">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4">
            <Switch
              checked={email.isPrimary}
              onCheckedChange={(checked) => updateEmail(email.id, 'isPrimary', checked)}
            />
            <Label className="text-sm font-medium text-text">
              Is this your primary email?
            </Label>
          </div>
        </div>
      ))}
      
      <Button
        onClick={addEmail}
        variant="outline"
        className="w-full mt-4 border-dashed border-2 border-gray-300 hover:border-primary hover:bg-primary/10"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Email
      </Button>
    </div>
  );
};

export default EmailSection;