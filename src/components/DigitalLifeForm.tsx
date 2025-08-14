import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { generatePDF } from '../lib/pdfGenerator';
import AudioPlayer from './AudioPlayer';
import { useTrial } from '../contexts/TrialContext';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface EmailAccount {
  id: string;
  email: string;
  username: string;
  password: string;
  notes: string;
}

interface WebsiteLogin {
  id: string;
  website: string;
  username: string;
  password: string;
  registeredEmail: string;
}

interface BlogWebsite {
  id: string;
  website: string;
  username: string;
  password: string;
  adminInfo: string;
  domainHostingService: string;
  notes: string;
}

interface EmailProvider {
  id: string;
  provider: string;
  username: string;
  password: string;
  notes: string;
}

interface SocialMediaAccount {
  id: string;
  platform: string;
  username: string;
  password: string;
  profileUrl: string;
  notes: string;
}

interface CloudStorageAccount {
  id: string;
  service: string;
  username: string;
  password: string;
  storageUsed: string;
  notes: string;
}

interface StreamingAccount {
  id: string;
  service: string;
  username: string;
  password: string;
  subscriptionType: string;
  cancelationNotes: string;
}

interface Device {
  id: string;
  type: string;
  brand: string;
  model: string;
  passcode: string;
  notes: string;
}

interface DigitalLifeData {
  // Password Manager
  passwordManagerUsed: string;
  passwordManagerService: string;
  passwordManagerAccess: string;
  
  // Two-Factor Authentication
  twoFactorDevices: string;
  backupCodesLocation: string;
  
  // Cancelation Instructions
  cancelationInstructions: string;
  
  // USBs & External Storage
  usbStorageLocation: string;
  
  // Digital Executor
  digitalExecutorName: string;
  digitalExecutorLocation: string;
  
  // Repeatable sections
  emailAccounts: EmailAccount[];
  websiteLogins: WebsiteLogin[];
  blogWebsites: BlogWebsite[];
  emailProviders: EmailProvider[];
  socialMediaAccounts: SocialMediaAccount[];
  cloudStorageAccounts: CloudStorageAccount[];
  streamingAccounts: StreamingAccount[];
  devices: Device[];
}

interface DigitalLifeFormProps {
  onNext: () => void;
  onPrevious: () => void;
  initialData?: Partial<DigitalLifeData>;
}

const DigitalLifeForm: React.FC<DigitalLifeFormProps> = ({
  onNext,
  onPrevious,
  initialData = {}
}) => {
  const { userTier, isTrial } = useTrial();
  const { syncForm } = useDatabaseSync();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [userInfo, setUserInfo] = useState<{ firstName?: string; lastName?: string; email?: string }>({});
  const [formData, setFormData] = useState<DigitalLifeData>({
    passwordManagerUsed: initialData.passwordManagerUsed || '',
    passwordManagerService: initialData.passwordManagerService || '',
    passwordManagerAccess: initialData.passwordManagerAccess || '',
    twoFactorDevices: initialData.twoFactorDevices || '',
    backupCodesLocation: initialData.backupCodesLocation || '',
    cancelationInstructions: initialData.cancelationInstructions || '',
    usbStorageLocation: initialData.usbStorageLocation || '',
    digitalExecutorName: initialData.digitalExecutorName || '',
    digitalExecutorLocation: initialData.digitalExecutorLocation || '',
    emailAccounts: initialData.emailAccounts || [{ id: '1', email: '', username: '', password: '', notes: '' }],
    websiteLogins: initialData.websiteLogins || [{ id: '1', website: '', username: '', password: '', registeredEmail: '' }],
    blogWebsites: initialData.blogWebsites || [{ id: '1', website: '', username: '', password: '', adminInfo: '', domainHostingService: '', notes: '' }],
    emailProviders: initialData.emailProviders || [{ id: '1', provider: '', username: '', password: '', notes: '' }],
    socialMediaAccounts: initialData.socialMediaAccounts || [{ id: '1', platform: '', username: '', password: '', profileUrl: '', notes: '' }],
    cloudStorageAccounts: initialData.cloudStorageAccounts || [{ id: '1', service: '', username: '', password: '', storageUsed: '', notes: '' }],
    streamingAccounts: initialData.streamingAccounts || [{ id: '1', service: '', username: '', password: '', subscriptionType: '', cancelationNotes: '' }],
    devices: initialData.devices || [{ id: '1', type: '', brand: '', model: '', passcode: '', notes: '' }]
  });

  const handleFieldChange = (field: keyof DigitalLifeData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Email Accounts functions
  const addEmailAccount = () => {
    const newAccount: EmailAccount = {
      id: Date.now().toString(),
      email: '',
      username: '',
      password: '',
      notes: ''
    };
    setFormData(prev => ({
      ...prev,
      emailAccounts: [...prev.emailAccounts, newAccount]
    }));
  };

  const updateEmailAccount = (id: string, field: keyof EmailAccount, value: string) => {
    setFormData(prev => ({
      ...prev,
      emailAccounts: prev.emailAccounts.map(account =>
        account.id === id ? { ...account, [field]: value } : account
      )
    }));
  };

  const removeEmailAccount = (id: string) => {
    if (formData.emailAccounts.length > 1) {
      setFormData(prev => ({
        ...prev,
        emailAccounts: prev.emailAccounts.filter(account => account.id !== id)
      }));
    }
  };

  // Website Logins functions
  const addWebsiteLogin = () => {
    const newLogin: WebsiteLogin = {
      id: Date.now().toString(),
      website: '',
      username: '',
      password: '',
      registeredEmail: ''
    };
    setFormData(prev => ({
      ...prev,
      websiteLogins: [...prev.websiteLogins, newLogin]
    }));
  };

  const updateWebsiteLogin = (id: string, field: keyof WebsiteLogin, value: string) => {
    setFormData(prev => ({
      ...prev,
      websiteLogins: prev.websiteLogins.map(login =>
        login.id === id ? { ...login, [field]: value } : login
      )
    }));
  };

  const removeWebsiteLogin = (id: string) => {
    if (formData.websiteLogins.length > 1) {
      setFormData(prev => ({
        ...prev,
        websiteLogins: prev.websiteLogins.filter(login => login.id !== id)
      }));
    }
  };

  // Blog Websites functions
  const addBlogWebsite = () => {
    const newBlog: BlogWebsite = {
      id: Date.now().toString(),
      website: '',
      username: '',
      password: '',
      adminInfo: '',
      domainHostingService: '',
      notes: ''
    };
    setFormData(prev => ({
      ...prev,
      blogWebsites: [...prev.blogWebsites, newBlog]
    }));
  };

  const updateBlogWebsite = (id: string, field: keyof BlogWebsite, value: string) => {
    setFormData(prev => ({
      ...prev,
      blogWebsites: prev.blogWebsites.map(blog =>
        blog.id === id ? { ...blog, [field]: value } : blog
      )
    }));
  };

  const removeBlogWebsite = (id: string) => {
    if (formData.blogWebsites.length > 1) {
      setFormData(prev => ({
        ...prev,
        blogWebsites: prev.blogWebsites.filter(blog => blog.id !== id)
      }));
    }
  };

  // Email Providers functions
  const addEmailProvider = () => {
    const newProvider: EmailProvider = {
      id: Date.now().toString(),
      provider: '',
      username: '',
      password: '',
      notes: ''
    };
    setFormData(prev => ({
      ...prev,
      emailProviders: [...prev.emailProviders, newProvider]
    }));
  };

  const updateEmailProvider = (id: string, field: keyof EmailProvider, value: string) => {
    setFormData(prev => ({
      ...prev,
      emailProviders: prev.emailProviders.map(provider =>
        provider.id === id ? { ...provider, [field]: value } : provider
      )
    }));
  };

  const removeEmailProvider = (id: string) => {
    if (formData.emailProviders.length > 1) {
      setFormData(prev => ({
        ...prev,
        emailProviders: prev.emailProviders.filter(provider => provider.id !== id)
      }));
    }
  };

  // Social Media Accounts functions
  const addSocialMediaAccount = () => {
    const newAccount: SocialMediaAccount = {
      id: Date.now().toString(),
      platform: '',
      username: '',
      password: '',
      profileUrl: '',
      notes: ''
    };
    setFormData(prev => ({
      ...prev,
      socialMediaAccounts: [...prev.socialMediaAccounts, newAccount]
    }));
  };

  const updateSocialMediaAccount = (id: string, field: keyof SocialMediaAccount, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMediaAccounts: prev.socialMediaAccounts.map(account =>
        account.id === id ? { ...account, [field]: value } : account
      )
    }));
  };

  const removeSocialMediaAccount = (id: string) => {
    if (formData.socialMediaAccounts.length > 1) {
      setFormData(prev => ({
        ...prev,
        socialMediaAccounts: prev.socialMediaAccounts.filter(account => account.id !== id)
      }));
    }
  };

  // Cloud Storage Accounts functions
  const addCloudStorageAccount = () => {
    const newAccount: CloudStorageAccount = {
      id: Date.now().toString(),
      service: '',
      username: '',
      password: '',
      storageUsed: '',
      notes: ''
    };
    setFormData(prev => ({
      ...prev,
      cloudStorageAccounts: [...prev.cloudStorageAccounts, newAccount]
    }));
  };

  const updateCloudStorageAccount = (id: string, field: keyof CloudStorageAccount, value: string) => {
    setFormData(prev => ({
      ...prev,
      cloudStorageAccounts: prev.cloudStorageAccounts.map(account =>
        account.id === id ? { ...account, [field]: value } : account
      )
    }));
  };

  const removeCloudStorageAccount = (id: string) => {
    if (formData.cloudStorageAccounts.length > 1) {
      setFormData(prev => ({
        ...prev,
        cloudStorageAccounts: prev.cloudStorageAccounts.filter(account => account.id !== id)
      }));
    }
  };

  // Streaming Accounts functions
  const addStreamingAccount = () => {
    const newAccount: StreamingAccount = {
      id: Date.now().toString(),
      service: '',
      username: '',
      password: '',
      subscriptionType: '',
      cancelationNotes: ''
    };
    setFormData(prev => ({
      ...prev,
      streamingAccounts: [...prev.streamingAccounts, newAccount]
    }));
  };

  const updateStreamingAccount = (id: string, field: keyof StreamingAccount, value: string) => {
    setFormData(prev => ({
      ...prev,
      streamingAccounts: prev.streamingAccounts.map(account =>
        account.id === id ? { ...account, [field]: value } : account
      )
    }));
  };

  const removeStreamingAccount = (id: string) => {
    if (formData.streamingAccounts.length > 1) {
      setFormData(prev => ({
        ...prev,
        streamingAccounts: prev.streamingAccounts.filter(account => account.id !== id)
      }));
    }
  };

  // Devices functions
  const addDevice = () => {
    const newDevice: Device = {
      id: Date.now().toString(),
      type: '',
      brand: '',
      model: '',
      passcode: '',
      notes: ''
    };
    setFormData(prev => ({
      ...prev,
      devices: [...prev.devices, newDevice]
    }));
  };

  const updateDevice = (id: string, field: keyof Device, value: string) => {
    setFormData(prev => ({
      ...prev,
      devices: prev.devices.map(device =>
        device.id === id ? { ...device, [field]: value } : device
      )
    }));
  };

  const removeDevice = (id: string) => {
    if (formData.devices.length > 1) {
      setFormData(prev => ({
        ...prev,
        devices: prev.devices.filter(device => device.id !== id)
      }));
    }
  };

  const handleSave = async () => {
    console.log('=== DIGITAL LIFE SAVE START ===');
    
    // Show immediate feedback
    toast({
      title: "Saving digital life information...",
      description: "Please wait while we save your data.",
    });

    // Data will be saved to database only
    console.log('Digital life data will be saved to database');

    // Sync to database if user is logged in
    if (isAuthenticated && user?.email) {
      console.log('=== DATABASE SYNC START ===');
      console.log('User authenticated, attempting database sync...');
      console.log('User email:', user.email);
      
      try {
        // Show syncing status
        toast({
          title: "Syncing to database...",
          description: "Please wait while we save your data to the cloud.",
        });

        // Use email as user ID for database sync
        const result = await syncForm(user.email, 'digitalLifeData', formData);
        console.log('Sync result:', result);
        
        if (result.success) {
          toast({
            title: "Success!",
            description: "Your digital life information has been saved to the database and locally.",
          });
        } else {
          console.error('Sync failed:', result.error);
          
          // Show detailed error message
          let errorMessage = "Data saved locally but there was an issue saving to the database.";
          if (result.error && typeof result.error === 'string') {
            errorMessage += ` Error: ${result.error}`;
          } else if (result.error && result.error.message) {
            errorMessage += ` Error: ${result.error.message}`;
          }
          
          toast({
            title: "Warning",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Database sync error:', error);
        
        // Show detailed error message
        let errorMessage = "Data saved locally but there was an issue saving to the database.";
        if (error instanceof Error) {
          errorMessage += ` Error: ${error.message}`;
        }
        
        toast({
          title: "Warning",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } else {
      console.log('No authenticated user found');
      toast({
        title: "Success!",
        description: "Your digital life information has been saved locally. Please log in to sync to the cloud.",
      });
    }

    console.log('=== DIGITAL LIFE SAVE END ===');
    onNext();
  };

  // PDF generation handler
  const handleGeneratePDF = () => {
    generatePDF({
      sectionTitle: 'Digital Life Information',
      data: formData,
      formType: 'digitalLife',
      userTier,
      isTrial,
      userInfo: userInfo
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-bold" style={{ color: '#E4B64A', fontSize: '28px' }}>Digital Life, Subscriptions, & Passwords</CardTitle>
        <p className="text-lg" style={{ color: '#153A4B' }}>
          Organize and secure your online presence and critical digital access
        </p>
        <AudioPlayer audioFile="Section_7.mp3" size="md" sectionNumber={7} />
      </CardHeader>
      <CardContent>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <Accordion type="single" collapsible className="mb-6">
            {/* Password Manager */}
            <AccordionItem value="password-manager">
              <AccordionTrigger style={{ color: '#000000' }}>Password Manager</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Used?</Label>
                      <RadioGroup value={formData.passwordManagerUsed} onValueChange={(value) => handleFieldChange('passwordManagerUsed', value)}>
                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="Yes" id="password-manager-yes" />
                <Label htmlFor="password-manager-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="password-manager-no" />
                          <Label htmlFor="password-manager-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label htmlFor="password-manager-service">Service Name</Label>
                      <Input
                        id="password-manager-service"
                        value={formData.passwordManagerService}
                        onChange={(e) => handleFieldChange('passwordManagerService', e.target.value)}
                        placeholder="Enter password manager service name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password-manager-access">Access Info / Master Password</Label>
                      <Input
                        id="password-manager-access"
                        value={formData.passwordManagerAccess}
                        onChange={(e) => handleFieldChange('passwordManagerAccess', e.target.value)}
                        placeholder="Enter access information or master password"
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Two-Factor Authentication Devices */}
            <AccordionItem value="two-factor">
              <AccordionTrigger style={{ color: '#000000' }}>Two-Factor Authentication Devices</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="two-factor-devices">Device(s) Used</Label>
                      <Input
                        id="two-factor-devices"
                        value={formData.twoFactorDevices}
                        onChange={(e) => handleFieldChange('twoFactorDevices', e.target.value)}
                        placeholder="Enter 2FA devices used"
                      />
                    </div>
                    <div>
                      <Label htmlFor="backup-codes-location">Backup Codes Location</Label>
                      <Input
                        id="backup-codes-location"
                        value={formData.backupCodesLocation}
                        onChange={(e) => handleFieldChange('backupCodesLocation', e.target.value)}
                        placeholder="Where backup codes are stored"
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Email Providers */}
            <AccordionItem value="email-providers">
              <AccordionTrigger style={{ color: '#000000' }}>Email Providers</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.emailProviders.map((provider, index) => (
                      <div key={provider.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Email Provider {index + 1}</h4>
                          {formData.emailProviders.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEmailProvider(provider.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`provider-${provider.id}`}>Provider</Label>
                            <Input
                              id={`provider-${provider.id}`}
                              value={provider.provider}
                              onChange={(e) => updateEmailProvider(provider.id, 'provider', e.target.value)}
                              placeholder="Enter email provider (Gmail, Outlook, etc.)"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`provider-username-${provider.id}`}>Username</Label>
                            <Input
                              id={`provider-username-${provider.id}`}
                              value={provider.username}
                              onChange={(e) => updateEmailProvider(provider.id, 'username', e.target.value)}
                              placeholder="Enter username"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`provider-password-${provider.id}`}>Password</Label>
                            <Input
                              id={`provider-password-${provider.id}`}
                              value={provider.password}
                              onChange={(e) => updateEmailProvider(provider.id, 'password', e.target.value)}
                              placeholder="Enter password"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`provider-notes-${provider.id}`}>Notes</Label>
                            <Textarea
                              id={`provider-notes-${provider.id}`}
                              value={provider.notes}
                              onChange={(e) => updateEmailProvider(provider.id, 'notes', e.target.value)}
                              placeholder="Additional notes about this email provider"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addEmailProvider} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Email Provider
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Social Media Accounts */}
            <AccordionItem value="social-media">
              <AccordionTrigger style={{ color: '#000000' }}>Social Media Accounts</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.socialMediaAccounts.map((account, index) => (
                      <div key={account.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Social Media Account {index + 1}</h4>
                          {formData.socialMediaAccounts.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSocialMediaAccount(account.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`platform-${account.id}`}>Platform</Label>
                            <Input
                              id={`platform-${account.id}`}
                              value={account.platform}
                              onChange={(e) => updateSocialMediaAccount(account.id, 'platform', e.target.value)}
                              placeholder="Enter platform (Facebook, Twitter, etc.)"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`social-username-${account.id}`}>Username</Label>
                            <Input
                              id={`social-username-${account.id}`}
                              value={account.username}
                              onChange={(e) => updateSocialMediaAccount(account.id, 'username', e.target.value)}
                              placeholder="Enter username"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`social-password-${account.id}`}>Password</Label>
                            <Input
                              id={`social-password-${account.id}`}
                              value={account.password}
                              onChange={(e) => updateSocialMediaAccount(account.id, 'password', e.target.value)}
                              placeholder="Enter password"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`profile-url-${account.id}`}>Profile URL</Label>
                            <Input
                              id={`profile-url-${account.id}`}
                              value={account.profileUrl}
                              onChange={(e) => updateSocialMediaAccount(account.id, 'profileUrl', e.target.value)}
                              placeholder="Enter profile URL"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`social-notes-${account.id}`}>Notes</Label>
                            <Textarea
                              id={`social-notes-${account.id}`}
                              value={account.notes}
                              onChange={(e) => updateSocialMediaAccount(account.id, 'notes', e.target.value)}
                              placeholder="Additional notes about this social media account"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addSocialMediaAccount} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Social Media Account
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Cloud Storage Accounts */}
            <AccordionItem value="cloud-storage">
              <AccordionTrigger style={{ color: '#000000' }}>Cloud Storage Accounts</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.cloudStorageAccounts.map((account, index) => (
                      <div key={account.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Cloud Storage Account {index + 1}</h4>
                          {formData.cloudStorageAccounts.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCloudStorageAccount(account.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`cloud-service-${account.id}`}>Service</Label>
                            <Input
                              id={`cloud-service-${account.id}`}
                              value={account.service}
                              onChange={(e) => updateCloudStorageAccount(account.id, 'service', e.target.value)}
                              placeholder="Enter service (Google Drive, iCloud, etc.)"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`cloud-username-${account.id}`}>Username</Label>
                            <Input
                              id={`cloud-username-${account.id}`}
                              value={account.username}
                              onChange={(e) => updateCloudStorageAccount(account.id, 'username', e.target.value)}
                              placeholder="Enter username"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`cloud-password-${account.id}`}>Password</Label>
                            <Input
                              id={`cloud-password-${account.id}`}
                              value={account.password}
                              onChange={(e) => updateCloudStorageAccount(account.id, 'password', e.target.value)}
                              placeholder="Enter password"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`storage-used-${account.id}`}>Storage Used</Label>
                            <Input
                              id={`storage-used-${account.id}`}
                              value={account.storageUsed}
                              onChange={(e) => updateCloudStorageAccount(account.id, 'storageUsed', e.target.value)}
                              placeholder="Enter storage usage (e.g., 50GB/100GB)"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`cloud-notes-${account.id}`}>Notes</Label>
                            <Textarea
                              id={`cloud-notes-${account.id}`}
                              value={account.notes}
                              onChange={(e) => updateCloudStorageAccount(account.id, 'notes', e.target.value)}
                              placeholder="Additional notes about this cloud storage account"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addCloudStorageAccount} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Cloud Storage Account
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Streaming Accounts */}
            <AccordionItem value="streaming-accounts">
              <AccordionTrigger style={{ color: '#000000' }}>Streaming Accounts</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.streamingAccounts.map((account, index) => (
                      <div key={account.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Streaming Account {index + 1}</h4>
                          {formData.streamingAccounts.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeStreamingAccount(account.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`streaming-service-${account.id}`}>Service</Label>
                            <Input
                              id={`streaming-service-${account.id}`}
                              value={account.service}
                              onChange={(e) => updateStreamingAccount(account.id, 'service', e.target.value)}
                              placeholder="Enter service (Netflix, Amazon, etc.)"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`streaming-username-${account.id}`}>Username</Label>
                            <Input
                              id={`streaming-username-${account.id}`}
                              value={account.username}
                              onChange={(e) => updateStreamingAccount(account.id, 'username', e.target.value)}
                              placeholder="Enter username"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`streaming-password-${account.id}`}>Password</Label>
                            <Input
                              id={`streaming-password-${account.id}`}
                              value={account.password}
                              onChange={(e) => updateStreamingAccount(account.id, 'password', e.target.value)}
                              placeholder="Enter password"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`subscription-type-${account.id}`}>Subscription Type</Label>
                            <Input
                              id={`subscription-type-${account.id}`}
                              value={account.subscriptionType}
                              onChange={(e) => updateStreamingAccount(account.id, 'subscriptionType', e.target.value)}
                              placeholder="Enter subscription type (Basic, Premium, etc.)"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`cancelation-notes-${account.id}`}>Cancelation Notes</Label>
                            <Textarea
                              id={`cancelation-notes-${account.id}`}
                              value={account.cancelationNotes}
                              onChange={(e) => updateStreamingAccount(account.id, 'cancelationNotes', e.target.value)}
                              placeholder="Instructions for canceling this subscription"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addStreamingAccount} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Streaming Account
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Cancelation Instructions */}
            <AccordionItem value="cancelation-instructions">
              <AccordionTrigger style={{ color: '#000000' }}>General Cancelation Instructions</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="cancelation-instructions">General Cancelation Instructions</Label>
                      <Textarea
                        id="cancelation-instructions"
                        value={formData.cancelationInstructions}
                        onChange={(e) => handleFieldChange('cancelationInstructions', e.target.value)}
                        placeholder="General instructions for canceling subscriptions"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Mobile Devices & Laptops */}
            <AccordionItem value="mobile-devices">
              <AccordionTrigger style={{ color: '#000000' }}>Mobile Devices & Laptops</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.devices.map((device, index) => (
                      <div key={device.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Device {index + 1}</h4>
                          {formData.devices.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDevice(device.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`device-type-${device.id}`}>Device Type</Label>
                            <Input
                              id={`device-type-${device.id}`}
                              value={device.type}
                              onChange={(e) => updateDevice(device.id, 'type', e.target.value)}
                              placeholder="Enter device type (iPhone, Laptop, etc.)"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`device-brand-${device.id}`}>Brand</Label>
                            <Input
                              id={`device-brand-${device.id}`}
                              value={device.brand}
                              onChange={(e) => updateDevice(device.id, 'brand', e.target.value)}
                              placeholder="Enter brand (Apple, Samsung, etc.)"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`device-model-${device.id}`}>Model</Label>
                            <Input
                              id={`device-model-${device.id}`}
                              value={device.model}
                              onChange={(e) => updateDevice(device.id, 'model', e.target.value)}
                              placeholder="Enter model (iPhone 14, MacBook Pro, etc.)"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`device-passcode-${device.id}`}>Passcode / Unlock Info</Label>
                            <Input
                              id={`device-passcode-${device.id}`}
                              value={device.passcode}
                              onChange={(e) => updateDevice(device.id, 'passcode', e.target.value)}
                              placeholder="Enter passcode or unlock information"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`device-notes-${device.id}`}>Notes</Label>
                            <Textarea
                              id={`device-notes-${device.id}`}
                              value={device.notes}
                              onChange={(e) => updateDevice(device.id, 'notes', e.target.value)}
                              placeholder="Additional notes about this device"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addDevice} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Device
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* USBs & External Storage */}
            <AccordionItem value="usb-storage">
              <AccordionTrigger style={{ color: '#000000' }}>USBs & External Storage</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="usb-storage-location">Stored At</Label>
                      <Input
                        id="usb-storage-location"
                        value={formData.usbStorageLocation}
                        onChange={(e) => handleFieldChange('usbStorageLocation', e.target.value)}
                        placeholder="Where USBs and external storage are located"
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Instructions for Digital Executor */}
            <AccordionItem value="digital-executor">
              <AccordionTrigger style={{ color: '#000000' }}>Instructions for Digital Executor</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="digital-executor-name">Name</Label>
                      <Input
                        id="digital-executor-name"
                        value={formData.digitalExecutorName}
                        onChange={(e) => handleFieldChange('digitalExecutorName', e.target.value)}
                        placeholder="Enter digital executor name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="digital-executor-location">Document Location</Label>
                      <Input
                        id="digital-executor-location"
                        value={formData.digitalExecutorLocation}
                        onChange={(e) => handleFieldChange('digitalExecutorLocation', e.target.value)}
                        placeholder="Where digital executor documents are stored"
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Email Accounts */}
            <AccordionItem value="email-accounts">
              <AccordionTrigger style={{ color: '#000000' }}>Email Accounts</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.emailAccounts.map((account, index) => (
                      <div key={account.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Email Account {index + 1}</h4>
                          {formData.emailAccounts.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEmailAccount(account.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`email-${account.id}`}>Email</Label>
                            <Input
                              id={`email-${account.id}`}
                              value={account.email}
                              onChange={(e) => updateEmailAccount(account.id, 'email', e.target.value)}
                              placeholder="Enter email address"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`username-${account.id}`}>Username</Label>
                            <Input
                              id={`username-${account.id}`}
                              value={account.username}
                              onChange={(e) => updateEmailAccount(account.id, 'username', e.target.value)}
                              placeholder="Enter username"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`password-${account.id}`}>Password</Label>
                            <Input
                              id={`password-${account.id}`}
                              value={account.password}
                              onChange={(e) => updateEmailAccount(account.id, 'password', e.target.value)}
                              placeholder="Enter password"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`notes-${account.id}`}>Notes</Label>
                            <Textarea
                              id={`notes-${account.id}`}
                              value={account.notes}
                              onChange={(e) => updateEmailAccount(account.id, 'notes', e.target.value)}
                              placeholder="Additional notes about this email account"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addEmailAccount} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Email Account
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Websites */}
            <AccordionItem value="websites">
              <AccordionTrigger style={{ color: '#000000' }}>Websites</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.websiteLogins.map((login, index) => (
                      <div key={login.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Website Login {index + 1}</h4>
                          {formData.websiteLogins.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeWebsiteLogin(login.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`website-${login.id}`}>Website</Label>
                            <Input
                              id={`website-${login.id}`}
                              value={login.website}
                              onChange={(e) => updateWebsiteLogin(login.id, 'website', e.target.value)}
                              placeholder="Enter website URL"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`website-username-${login.id}`}>Username</Label>
                            <Input
                              id={`website-username-${login.id}`}
                              value={login.username}
                              onChange={(e) => updateWebsiteLogin(login.id, 'username', e.target.value)}
                              placeholder="Enter username"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`website-password-${login.id}`}>Password</Label>
                            <Input
                              id={`website-password-${login.id}`}
                              value={login.password}
                              onChange={(e) => updateWebsiteLogin(login.id, 'password', e.target.value)}
                              placeholder="Enter password"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`registered-email-${login.id}`}>Registered Email</Label>
                            <Input
                              id={`registered-email-${login.id}`}
                              value={login.registeredEmail}
                              onChange={(e) => updateWebsiteLogin(login.id, 'registeredEmail', e.target.value)}
                              placeholder="Enter registered email"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addWebsiteLogin} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Website Login
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Blogs */}
            <AccordionItem value="blogs">
              <AccordionTrigger style={{ color: '#000000' }}>Blogs</AccordionTrigger>
              <AccordionContent>
                <Card className="mb-4">
                  <CardContent className="space-y-4">
                    {formData.blogWebsites.map((blog, index) => (
                      <div key={blog.id} className="border p-4 rounded mb-2">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Blog/Website {index + 1}</h4>
                          {formData.blogWebsites.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBlogWebsite(blog.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`blog-website-${blog.id}`}>Website / Blog</Label>
                            <Input
                              id={`blog-website-${blog.id}`}
                              value={blog.website}
                              onChange={(e) => updateBlogWebsite(blog.id, 'website', e.target.value)}
                              placeholder="Enter website or blog URL"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`blog-username-${blog.id}`}>Username</Label>
                            <Input
                              id={`blog-username-${blog.id}`}
                              value={blog.username}
                              onChange={(e) => updateBlogWebsite(blog.id, 'username', e.target.value)}
                              placeholder="Enter username"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`blog-password-${blog.id}`}>Password</Label>
                            <Input
                              id={`blog-password-${blog.id}`}
                              value={blog.password}
                              onChange={(e) => updateBlogWebsite(blog.id, 'password', e.target.value)}
                              placeholder="Enter password"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`domain-hosting-${blog.id}`}>Domain Hosting Service</Label>
                            <Input
                              id={`domain-hosting-${blog.id}`}
                              value={blog.domainHostingService}
                              onChange={(e) => updateBlogWebsite(blog.id, 'domainHostingService', e.target.value)}
                              placeholder="Enter domain hosting service"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`admin-info-${blog.id}`}>Admin Info</Label>
                            <Textarea
                              id={`admin-info-${blog.id}`}
                              value={blog.adminInfo}
                              onChange={(e) => updateBlogWebsite(blog.id, 'adminInfo', e.target.value)}
                              placeholder="Administrative information"
                              rows={3}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`blog-notes-${blog.id}`}>Notes</Label>
                            <Textarea
                              id={`blog-notes-${blog.id}`}
                              value={blog.notes}
                              onChange={(e) => updateBlogWebsite(blog.id, 'notes', e.target.value)}
                              placeholder="Additional notes about this blog/website"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addBlogWebsite} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Blog/Website
                    </Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* Save & Continue */}
          <div className="flex justify-between items-center mt-8">
            {onPrevious && (
              <Button variant="skillbinder" onClick={onPrevious} className="skillbinder">Previous</Button>
            )}
            <div className="flex gap-4">
              <Button 
                type="button" 
                onClick={handleGeneratePDF}
                className="inline-flex items-center px-4 py-2 bg-[#17394B] text-white rounded-lg hover:bg-[#153A4B] transition-colors"
              >
                <svg 
                  className="w-4 h-4 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                Generate PDF
              </Button>
              <Button type="submit" variant="skillbinder_yellow" className="skillbinder_yellow">Save & Continue</Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DigitalLifeForm; 