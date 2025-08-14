import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useLocalization } from '../contexts/LocalizationContext';
import { useToast } from './ui/use-toast';
import Logo from './Logo';
import IntroductionFormFixed from './IntroductionFormFixed';
import ConclusionForm from './ConclusionForm';
import LegalBiographicalForm from './LegalBiographicalForm';
import PersonalContactForm from './PersonalContactForm';
import ChildrenDependentsForm from './ChildrenDependentsForm';
import FinancialInfoForm from './FinancialInfoForm';
import FinanceBusinessForm from './FinanceBusinessForm';
import BeneficiariesInheritanceForm from './BeneficiariesInheritanceForm';
import PersonalPropertyRealEstateForm from './PersonalPropertyRealEstateForm';
import DigitalLifeForm from './DigitalLifeForm';
import KeyContactsForm from './KeyContactsForm';
import FuneralFinalArrangementsForm from './FuneralFinalArrangementsForm';
import AccountsMembershipsForm from './AccountsMembershipsForm';
import PetsAnimalCareForm from './PetsAnimalCareForm';
import ShortLettersForm from './ShortLettersForm';
import FinalWishesLegacyPlanningForm from './FinalWishesLegacyPlanningForm';
import BucketListUnfinishedBusinessForm from './BucketListUnfinishedBusinessForm';
import FormalLettersForm from './FormalLettersForm';
import FileUploadsMultimediaForm from './FileUploadsMultimediaForm';
import AllFormsWithPersistence from './AllFormsWithPersistence';
import MedicalInfoForm from './MedicalInfoForm';
import PersonalInformationForm from './PersonalInformationForm';
import LegalEstateForm from './LegalEstateForm';
import TrialBanner from './TrialBanner';
import TrialRestriction from './TrialRestriction';
import DataStatusCard from './DataStatusCard';
import { Check, Menu, X, User, Settings, CreditCard, Shield, LogOut, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useTrial } from '../contexts/TrialContext';
import SupportContactForm from './SupportContactForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';

const AppLayout: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<string | number>('intro');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedSections, setCompletedSections] = useState<(string | number)[]>([]);
  const [userFirstName, setUserFirstName] = useState<string>('');
  const navigate = useNavigate();
  const { canAccessSection, isTrial } = useTrial();
  const { user, logout } = useAuth();
  const { localizeText } = useLocalization();
  const { toast } = useToast();

  // Fetch user's first name from personal_info table
  const fetchUserFirstName = async () => {
    if (!user?.email) return;

    try {
      // First, get the user_id from the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (userError) {
        console.error('Error fetching user:', userError);
        return;
      }

      if (userData) {
        // Then get the first name from personal_info table
        const { data: personalInfo, error: personalError } = await supabase
          .from('personal_info')
          .select('legal_first_name')
          .eq('user_id', userData.id)
          .single();

        if (personalError) {
          console.error('Error fetching personal info:', personalError);
          return;
        }

        if (personalInfo?.legal_first_name) {
          setUserFirstName(personalInfo.legal_first_name);
        }
      }
    } catch (error) {
      console.error('Error in fetchUserFirstName:', error);
    }
  };

  // Fetch user's first name when user changes
  useEffect(() => {
    if (user?.email) {
      fetchUserFirstName();
    }
  }, [user?.email]);

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSection]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        variant: "default",
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "There was an issue logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getUserInitials = () => {
    if (userFirstName) {
      return userFirstName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    return userFirstName || user?.firstName || user?.email?.split('@')[0] || 'User';
  };

  const sections = [
    { id: 'intro', title: 'Introduction', description: 'Welcome to your legacy planning journey' },
    { id: 1, title: 'Personal Information', description: 'Basic information and legal details' },
    { id: 2, title: 'Medical Information', description: 'Health history and medical details' },
    { id: 3, title: 'Legal & Estate Planning', description: 'Wills, trusts, and legal documents' },
    { id: 4, title: 'Finance & Business', description: 'Financial accounts, investments, and business information' },
    { id: 5, title: 'Beneficiaries & Inheritance', description: 'Designate beneficiaries and organize inheritance information' },
    { id: 6, title: 'Personal Property & Real Estate', description: 'A secure inventory of physical spaces, valuables, and records' },
    { id: 7, title: 'Digital Life, Subscriptions, & Passwords', description: 'Organize and secure your online presence and critical digital access' },
    { id: 8, title: 'Key Contacts', description: 'Organize the most important people in your life for reference or emergency' },
    { id: 9, title: 'Funeral & Final Arrangements', description: 'Plan your final wishes with clarity and care' },
    { id: 10, title: 'Accounts & Memberships', description: 'Keep track of all your member accounts and digital access credentials' },
    { id: 11, title: 'Pets & Animal Care', description: 'Compassionate care for your companions, no matter what' },
    { id: 12, title: 'Short Letters to Loved Ones', description: 'Words that linger, even when we\'re gone' },
    { id: 13, title: 'Final Wishes & Legacy Planning', description: 'How I wish to be remembered, and what I leave behind' },
    { id: 14, title: 'Bucket List & Unfinished Business', description: `${localizeText('Honoring')} life's goals, promises, and parting words` },
    { id: 15, title: 'Formal Letters', description: 'Preparing important documentation for the people who matter' },
    { id: 16, title: 'File Uploads & Multimedia Memories', description: 'Upload and organize important files, videos, and documents' },
    { id: 'conclusion', title: 'Conclusion', description: 'Complete your legacy planning journey' }
  ];

  const getNextSection = (current: string | number): string | number => {
    const sectionIds = sections.map(s => s.id);
    const currentIndex = sectionIds.indexOf(current);
    return currentIndex < sectionIds.length - 1 ? sectionIds[currentIndex + 1] : current;
  };

  const getPreviousSection = (current: string | number): string | number => {
    const sectionIds = sections.map(s => s.id);
    const currentIndex = sectionIds.indexOf(current);
    return currentIndex > 0 ? sectionIds[currentIndex - 1] : current;
  };

  const renderCurrentSection = () => {
    const props = {
      onNext: () => setCurrentSection(getNextSection(currentSection)),
      onPrevious: () => setCurrentSection(getPreviousSection(currentSection))
    };

    console.log('Current section:', currentSection, 'Type:', typeof currentSection);
    console.log('Available sections:', sections.map(s => s.id));
    console.log('Can access section:', canAccessSection(currentSection));

    // Ensure currentSection is valid, fallback to 'intro' if not
    const validSection = sections.find(s => s.id === currentSection) ? currentSection : 'intro';
    if (validSection !== currentSection) {
      console.log('Invalid section detected, resetting to intro');
      setCurrentSection('intro');
      return <IntroductionFormFixed onNext={props.onNext} />;
    }

    // Check if user can access this section
    if (!canAccessSection(currentSection)) {
      const sectionInfo = sections.find(s => s.id === currentSection);
      return (
        <TrialRestriction
          sectionTitle={sectionInfo?.title || 'This Section'}
          sectionNumber={typeof currentSection === 'number' ? currentSection : 0}
        />
      );
    }

    switch (currentSection) {
      case 'intro': return <IntroductionFormFixed onNext={props.onNext} />;
      case 1: return <PersonalInformationForm {...props} />;
      case 2: 
        console.log('AppLayout: Rendering MedicalInfoForm for Section 2');
        return <MedicalInfoForm {...props} />;
      case 3: return <LegalEstateForm {...props} />;
      case 4: return <FinanceBusinessForm {...props} />;
      case 5: return <BeneficiariesInheritanceForm {...props} />;
      case 6: return <PersonalPropertyRealEstateForm {...props} />;
      case 7: return <DigitalLifeForm {...props} />;
      case 8: return <KeyContactsForm {...props} />;
      case 9: return <FuneralFinalArrangementsForm {...props} />;
      case 10: return <AccountsMembershipsForm {...props} />;
      case 11: return <PetsAnimalCareForm {...props} />;
      case 12: return <ShortLettersForm {...props} />;
      case 13: return <FinalWishesLegacyPlanningForm {...props} />;
      case 14: return <BucketListUnfinishedBusinessForm {...props} />;
      case 15: return <FormalLettersForm {...props} />;
      case 16: 
        console.log('Rendering FileUploadsMultimediaForm');
        return <FileUploadsMultimediaForm {...props} />;
      case 'conclusion': 
        console.log('AppLayout: Rendering ConclusionForm');
        return <ConclusionForm onPrevious={props.onPrevious} />;
      default: 
        console.log('Default case - rendering IntroductionFormFixed');
        return <IntroductionFormFixed onNext={props.onNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm" style={{ height: '125px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Left Section: Menu Button and Logo */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <Logo />
            </div>

            {/* Center Section: Welcome Message */}
            <div className="flex-1 flex justify-center">
              {user && (
                <span className="text-lg text-gray-700 font-medium">
                  Welcome back {getUserDisplayName()}
                </span>
              )}
            </div>

            {/* Right Section: Progress, Pricing, User Menu */}
            <div className="flex items-center space-x-4">
              {/* Progress Bar and Step Indicator */}
              <div className="flex items-center space-x-3">
                <div className="text-sm text-subtext">
                  {typeof currentSection === 'number' ? `Step ${currentSection} of 16` : 
                   currentSection === 'intro' ? 'Introduction' : 'Conclusion'}
                </div>
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300 ease-out" 
                    style={{ 
                      width: `${(() => {
                        const sectionIds = sections.map(s => s.id);
                        const currentIndex = sectionIds.indexOf(currentSection);
                        return ((currentIndex + 1) / sectionIds.length) * 100;
                      })()}%` 
                    }} 
                  />
                </div>
              </div>
              
              {/* Pricing, Support, and User Menu */}
              <div className="flex items-center space-x-2">
                <SupportContactForm />
                
                <Button 
                  variant="skillbinder_yellow" 
                  size="sm" 
                  onClick={() => navigate('/pricing')}
                  className="skillbinder_yellow"
                >
                  Pricing
                </Button>
                
                {/* User Account Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 px-3 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback 
                          className="text-sm font-medium"
                          style={{ backgroundColor: '#17394B', color: 'white' }}
                        >
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:block text-sm font-medium text-gray-700">
                        {getUserDisplayName()}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={() => navigate('/manage-billing')}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Manage Billing</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate('/account-settings')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Account Settings</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate('/account-settings')}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Change Password</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex" style={{ paddingTop: '125px' }}>
        <div className={`fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white border-r transform transition-transform duration-300 ease-in-out lg:pt-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`} style={{ paddingTop: '20px' }}>
          <div className="p-6 pt-8">
            <h2 className="text-lg font-serif font-bold mb-6" style={{ color: '#153A4B' }}>Progress</h2>
            <div className="space-y-2">
              {sections.map((section) => (
                <div key={section.id} className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${currentSection === section.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'}`} onClick={() => { setCurrentSection(section.id); setSidebarOpen(false); }}>
                  <div className={`progress-step ${completedSections.includes(section.id) ? 'completed' : currentSection === section.id ? 'active' : ''}`}>
                    {completedSections.includes(section.id) ? <Check className="h-4 w-4" /> : 
                     typeof section.id === 'string' ? (section.id === 'intro' ? 'I' : 'C') : section.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: '#153A4B' }}>{section.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{section.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 lg:ml-0">
          <div className="max-w-4xl mx-auto p-6" style={{ paddingTop: '32px' }}>
            <TrialBanner />
            {isTrial && (
              <div className="mb-6">
                <DataStatusCard />
              </div>
            )}
            {renderCurrentSection()}
          </div>
        </div>
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default AppLayout;