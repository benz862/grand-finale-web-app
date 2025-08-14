import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, MessageCircle, X, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { submitSupportRequest } from '@/lib/supportService';
import { sendSupportRequestEmail } from '@/lib/emailService';
import { useNavigate } from 'react-router-dom';

interface SupportFormData {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

const SupportContactForm: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<SupportFormData>({
    name: user?.firstName || '',
    email: user?.email || '',
    subject: '',
    category: 'general',
    message: ''
  });

  const categories = [
    { value: 'general', label: 'General Question' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'billing', label: 'Billing & Payment' },
    { value: 'account', label: 'Account Access' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field: keyof SupportFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive"
        });
        return;
      }

      // Submit to database
      const result = await submitSupportRequest({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        category: formData.category,
        message: formData.message
      });

      if (result.success) {
        // Send email notification to support@skillbinder.com
        const emailResult = await sendSupportRequestEmail({
          id: result.data.id,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          category: formData.category,
          message: formData.message,
          submittedAt: new Date().toISOString(),
          userId: user?.id
        });

        if (!emailResult.success) {
          console.warn('Failed to send email notification:', emailResult.error);
          // Don't fail the form submission if email fails
        }

        // Close the dialog first
        setIsOpen(false);
        
        // Reset form
        setFormData({
          name: user?.firstName || '',
          email: user?.email || '',
          subject: '',
          category: 'general',
          message: ''
        });

        // Redirect to success page with request details
        const params = new URLSearchParams({
          id: result.data.id,
          category: formData.category,
          subject: formData.subject
        });
        
        navigate(`/support-success?${params.toString()}`);
      }

    } catch (error) {
      console.error('Error submitting support request:', error);
      toast({
        title: "Submission Error",
        description: "There was an issue saving your request. Please try again or email us directly at support@skillbinder.com",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectEmail = () => {
    const subject = encodeURIComponent('SkillBinder Support Request');
    const body = encodeURIComponent(`Hello SkillBinder Support Team,

I need assistance with the following:

[Please describe your question or concern here]

Thank you,
[Your Name]`);

    window.open(`mailto:support@skillbinder.com?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="skillbinder_yellow" 
          size="sm" 
          className="flex items-center space-x-2 font-semibold"
          style={{ backgroundColor: '#E3B549', borderColor: '#E3B549' }}
        >
          <HelpCircle className="h-4 w-4" />
          <span>Support</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white border-2 border-gray-200 shadow-xl">
        <DialogHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-skillbinder-yellow rounded-full flex items-center justify-center">
              <HelpCircle className="h-6 w-6" style={{ color: '#17394B' }} />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold" style={{ color: '#17394B' }}>
            Contact Support
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Have a question or need help? Fill out the form below or email us directly at{' '}
            <a 
              href="mailto:support@skillbinder.com" 
              className="font-medium underline hover:text-blue-600"
              style={{ color: '#17394B' }}
            >
              support@skillbinder.com
            </a>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Direct Email Option */}
          <Card className="neumorphic-card border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2" style={{ color: '#17394B' }}>
                <Mail className="h-5 w-5" style={{ color: '#E3B549' }} />
                <span>Quick Contact</span>
              </CardTitle>
              <CardDescription className="text-gray-600">
                Prefer to email us directly? Click the button below to open your email client.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleDirectEmail}
                variant="skillbinder_outline" 
                className="w-full font-semibold"
                style={{ borderColor: '#17394B', color: '#17394B' }}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Support Directly
              </Button>
            </CardContent>
          </Card>

          {/* Support Form */}
          <Card className="neumorphic-card border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg" style={{ color: '#17394B' }}>Support Request Form</CardTitle>
              <CardDescription className="text-gray-600">
                Fill out the form below and we'll get back to you within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Please provide detailed information about your question or concern..."
                    rows={6}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="skillbinder_outline"
                    onClick={() => setIsOpen(false)}
                    disabled={isSubmitting}
                    className="font-semibold"
                    style={{ borderColor: '#17394B', color: '#17394B' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="skillbinder_yellow"
                    disabled={isSubmitting}
                    className="font-semibold"
                    style={{ backgroundColor: '#E3B549', borderColor: '#E3B549' }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportContactForm; 