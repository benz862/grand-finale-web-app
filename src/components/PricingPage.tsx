import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Logo from './Logo';
import { useTrial } from '../contexts/TrialContext';
import { useAuth } from '../contexts/AuthContext';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useToast } from './ui/use-toast';

const plans = {
  monthly: [
    {
      name: 'Lite',
      price: '$4',
      period: '/mo',
      features: [
        'Access to Sections 1-3',
        '1 PDF Export per month (Watermarked)',
        'Data Storage (Supabase)',
        'Secure Backup',
        'Basic Support',
        'Access to Updates'
      ],
      unavailable: [
        'Access to Sections 4-15',
        'Section 12: Letters w/ Upload',
        'Section 16: File Uploads',
        'Priority Support (24hr Response)'
      ],
      planId: 'lite_monthly',
      popular: false,
      savings: null
    },
    {
      name: 'Standard',
      price: '$8',
      period: '/mo',
      features: [
        'Access to Sections 1-15',
        '3 PDF Exports per month (No Watermark)',
        'Data Storage (Supabase)',
        'Secure Backup',
        'Standard Support',
        'Access to Updates'
      ],
      unavailable: [
        'Section 12: Letters w/ Upload',
        'Section 16: File Uploads',
        'Priority Support (24hr Response)'
      ],
      planId: 'standard_monthly',
      popular: false,
      savings: null
    },
    {
      name: 'Premium',
      price: '$12',
      period: '/mo',
      features: [
        'Access to Sections 1-15',
        'Section 12: Letters w/ Upload',
        'Section 16: File Uploads',
        'Unlimited PDF Exports',
        'Data Storage (Supabase)',
        'Secure Backup',
        'Priority Support (24hr Response)',
        'Access to Updates'
      ],
      unavailable: [],
      planId: 'premium_monthly',
      popular: true,
      savings: null
    },
    {
      name: 'Lifetime',
      price: '$199',
      period: ' one-time',
      features: [
        'Access to Sections 1-15',
        'Section 12: Letters w/ Upload',
        'Section 16: File Uploads',
        'Unlimited PDF Exports',
        'Data Storage (Supabase)',
        'Secure Backup',
        'Priority Support',
        'Access to Updates Forever'
      ],
      unavailable: [],
      planId: 'lifetime',
      popular: false,
      savings: 'Save $1,241 over 10 years'
    }
  ],
  yearly: [
    {
      name: 'Lite',
      price: '$40',
      period: '/yr',
      features: [
        'Access to Sections 1-3',
        '1 PDF Export per month (Watermarked)',
        'Data Storage (Supabase)',
        'Secure Backup',
        'Basic Support',
        'Access to Updates'
      ],
      unavailable: [
        'Access to Sections 4-15',
        'Section 12: Letters w/ Upload',
        'Section 16: File Uploads',
        'Priority Support (24hr Response)'
      ],
      planId: 'lite_yearly',
      popular: false,
      savings: 'Save $8'
    },
    {
      name: 'Standard',
      price: '$80',
      period: '/yr',
      features: [
        'Access to Sections 1-15',
        '3 PDF Exports per month (No Watermark)',
        'Data Storage (Supabase)',
        'Secure Backup',
        'Standard Support',
        'Access to Updates'
      ],
      unavailable: [
        'Section 12: Letters w/ Upload',
        'Section 16: File Uploads',
        'Priority Support (24hr Response)'
      ],
      planId: 'standard_yearly',
      popular: false,
      savings: 'Save $16'
    },
    {
      name: 'Premium',
      price: '$120',
      period: '/yr',
      features: [
        'Access to Sections 1-15',
        'Section 12: Letters w/ Upload',
        'Section 16: File Uploads',
        'Unlimited PDF Exports',
        'Data Storage (Supabase)',
        'Secure Backup',
        'Priority Support (24hr Response)',
        'Access to Updates'
      ],
      unavailable: [],
      planId: 'premium_yearly',
      popular: true,
      savings: 'Save $24'
    },
    {
      name: 'Lifetime',
      price: '$199',
      period: ' one-time',
      features: [
        'Access to Sections 1-15',
        'Section 12: Letters w/ Upload',
        'Section 16: File Uploads',
        'Unlimited PDF Exports',
        'Data Storage (Supabase)',
        'Secure Backup',
        'Priority Support',
        'Access to Updates Forever'
      ],
      unavailable: [],
      planId: 'lifetime',
      popular: false,
      savings: 'Save $1,241 over 10 years'
    }
  ]
};

const legacySections = [
  { id: 1, title: 'Personal Information', description: 'Contact details, emergency contacts, and basic biographical information' },
  { id: 2, title: 'Medical Information', description: 'Health history, medications, allergies, and medical providers' },
  { id: 3, title: 'Legal & Estate Planning', description: 'Wills, executors, power of attorney, and legal documents' },
  { id: 4, title: 'Finance & Business', description: 'Bank accounts, investments, insurance, and business assets' },
  { id: 5, title: 'Beneficiaries & Inheritance', description: 'Who inherits what and specific distribution instructions' },
  { id: 6, title: 'Personal Property & Real Estate', description: 'Homes, vehicles, valuables, and storage locations' },
  { id: 7, title: 'Digital Life & Passwords', description: 'Online accounts, subscriptions, and digital asset management' },
  { id: 8, title: 'Key Contacts', description: 'Professional advisors, family, and important relationships' },
  { id: 9, title: 'Funeral & Final Arrangements', description: 'End-of-life preferences and ceremony wishes' },
  { id: 10, title: 'Accounts & Memberships', description: 'Club memberships, frequent flyer accounts, and subscriptions' },
  { id: 11, title: 'Pets & Animal Care', description: 'Pet care instructions and legacy arrangements' },
  { id: 12, title: 'Short Letters to Loved Ones', description: 'Personal messages with delivery instructions' },
  { id: 13, title: 'Final Wishes & Legacy Planning', description: 'Ethical will, values statement, and legacy projects' },
  { id: 14, title: 'Bucket List & Unfinished Business', description: 'Goals, dreams, and things left undone' },
  { id: 15, title: 'Formal Letters', description: 'Longer letters and important communications' },
  { id: 16, title: 'Conclusion', description: 'Final thoughts and completion of your legacy plan' }
];

const features = [
  {
    title: '16 Comprehensive Legacy Sections',
    description: 'Every aspect of your life documented: personal, medical, legal, financial, digital, and emotional legacy planning'
  },
  {
    title: 'Multimedia Legacy Preservation',
    description: 'Upload photos, videos, voice recordings, and documents to preserve memories and important information'
  },
  {
    title: 'Bank-Level Security & Privacy',
    description: 'Your sensitive information is protected with enterprise-grade encryption and secure cloud storage'
  },
  {
    title: 'Lifetime Access & Updates',
    description: 'One-time purchase includes all future features, updates, and improvements for life'
  },
  {
    title: 'Professional PDF Generation',
    description: 'Create beautiful, organized legacy documents with QR codes for easy digital access'
  },
  {
    title: 'SkillBinder Excellence',
    description: 'Built by education experts with 20+ years of experience in professional training and development'
  },
  {
    title: 'Audio-Guided Experience',
    description: 'Professional narration guides you through each section with tips and examples'
  },
  {
    title: 'Family Legacy Building',
    description: 'Document family traditions, recipes, stories, and values for future generations'
  },
  {
    title: 'Ethical Will & Values',
    description: 'Share your life lessons, wisdom, and values in addition to financial inheritance'
  },
  {
    title: 'Personal Letters & Messages',
    description: 'Write heartfelt letters to family members with specific delivery instructions'
  },
  {
    title: 'Digital Asset Management',
    description: 'Organize passwords, online accounts, and digital assets for easy family access'
  },
  {
    title: 'Pet & Animal Legacy',
    description: 'Ensure your beloved pets are cared for with detailed instructions and arrangements'
  }
];

const faqs = [
  {
    question: 'How is The Grand Finale different from a simple will?',
    answer: 'While a will covers legal asset distribution, The Grand Finale is a comprehensive legacy plan that includes your values, stories, life lessons, family traditions, digital assets, pet care, personal messages, and much more. It\'s about preserving your complete legacy, not just your finances.'
  },
  {
    question: 'Can multiple people use one membership?',
    answer: 'No. Each membership is for one person only. The name you enter in the Personal Information section becomes permanently associated with your account and cannot be changed. This ensures the integrity and personalization of your legacy plan.'
  },
  {
    question: 'What if I need to update my information over time?',
    answer: 'Your legacy plan should evolve with your life! You can log in anytime to update any section, add new information, upload additional files, or modify your preferences. All changes are automatically saved.'
  },
  {
    question: 'How do my family members access my legacy plan?',
    answer: 'You control how and when your information is shared. You can generate PDF documents with QR codes for easy digital access, share specific sections during your lifetime, or provide complete access through your chosen method.'
  },
  {
    question: 'Is my information secure and private?',
    answer: 'Absolutely. We use bank-level encryption, secure cloud storage with Supabase, and Canadian privacy standards. Your information is never shared, sold, or accessed by anyone without your permission. You maintain complete control over your data.'
  },
  {
    question: 'What\'s included in the Lifetime plan?',
    answer: 'The Lifetime plan includes everything forever - all current and future features, unlimited usage, premium support for life, and all updates. No monthly fees ever. It\'s the most popular choice and best value for comprehensive legacy planning.'
  },
  {
    question: 'Do you offer support if I need help?',
    answer: 'Yes! All plans include email support. Premium and Lifetime plans include priority support with 24-hour response times. We also provide detailed audio guides for each section and comprehensive help documentation.'
  },
  {
    question: 'Can I try before I buy?',
    answer: 'Absolutely! We offer a 7-day free trial that lets you explore the first 3 sections and get a feel for the entire system. No credit card required, and your trial data is preserved if you decide to upgrade.'
  },
  {
    question: 'What happens to my data if I cancel?',
    answer: 'Your data is preserved for 30 days after cancellation, giving you time to export everything as PDF. After 30 days, data is permanently deleted for your privacy and security.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not completely satisfied with The Grand Finale, contact us within 30 days for a full refund.'
  }
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [startingTrial, setStartingTrial] = useState(false);
  const { isTrial, trialDaysLeft, startTrial, handleSuccessfulUpgrade } = useTrial();
  const { isAuthenticated, user } = useAuth();
  const { syncForm } = useDatabaseSync();
  const { toast } = useToast();



  const handleStartTrial = async () => {
    try {
      console.log('handleStartTrial called!');
      setStartingTrial(true);
      
      // If user is already authenticated, they should be able to start trial on existing account
      if (isAuthenticated) {
        toast({
          title: 'Starting Trial',
          description: 'Activating your 7-day free trial on your existing account...',
          duration: 2000,
        });
        
        // Wait a moment for the toast to show
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Activate trial for existing user and redirect to app
        if (user?.email) {
          try {
            await syncForm(user.email, 'startingTrial', { started: true, timestamp: new Date().toISOString() });
          } catch (error) {
            console.error('Error saving trial start status:', error);
          }
        }
        window.location.href = '/app';
        return;
      }
      
      // Show redirect toast for new users
      toast({
        title: 'Redirecting to Signup',
        description: 'Please create your account to start your 7-day free trial.',
        duration: 2000,
      });
      
      // Wait a moment for the toast to show
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set flag and redirect to signup (don't activate trial yet)
      localStorage.setItem('startingTrial', 'true');
      window.location.href = '/app';
    } catch (error) {
      console.error('Error redirecting to trial signup:', error);
      setStartingTrial(false);
      toast({
        title: 'Error',
        description: 'Failed to redirect to signup. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      // Redirect to payment portal with plan ID
      window.location.href = `/payment?plan=${planId}`;
    } catch (error) {
      console.error('Navigation error:', error);
      toast({
        title: 'Error',
        description: 'Unable to navigate to payment page. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo />
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => window.location.href = '/app'}>
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl mb-16">
          {/* background image and overlay to match homepage look */}
          <div className="absolute inset-0 bg-[url('/assets/images/hero_image_blank.jpg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#05121733] via-[#05121777] to-[#051217bb]" />

          <div className="relative z-10 text-center px-6 py-16 sm:py-20">
            <h1 className="text-5xl font-bold mb-6 text-skillbinder-blue tracking-tight">
              Choose Your Legacy Planning Plan
            </h1>
            <p className="text-xl text-skillbinder-blue mb-8 max-w-3xl mx-auto">
              Secure, comprehensive legacy planning for one person per membership. Choose the plan that fits your needs and start preserving your legacy today.
            </p>

            {/* Important note card */}
            <div className="neumorphic-card p-6 mb-8 max-w-2xl mx-auto bg-white/95 border border-gray-200 rounded-xl">
              <p className="text-sm text-red-600">
                <strong className="text-skillbinder-blue">Important:</strong> Each membership is for one person only. The name you enter in the Personal Information section will be permanently associated with your account. Please ensure the spelling is correct.
              </p>
            </div>

            {/* Free Trial Section */}
            <div className="neumorphic-card p-8 mb-8 max-w-4xl mx-auto bg-white/95 rounded-2xl">
              <div className="text-center mb-4">
                <div className="inline-block px-6 py-3 bg-gray-100 rounded-full mb-4">
                  <span className="text-gray-700 font-bold text-lg">FREE TRIAL</span>
                </div>
                <h2 className="text-2xl font-bold text-skillbinder-blue">
                  Try Before You Buy — 7-Day Free Trial
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-6 text-left">
                <div>
                  <h3 className="font-semibold mb-3 text-skillbinder-blue">What You Get:</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Access to Sections 1-3</li>
                    <li>• 1 PDF Export (Watermarked)</li>
                    <li>• Data Storage (Supabase)</li>
                    <li>• Basic Support</li>
                    <li>• Full interface exploration</li>
                    <li>• Audio guides and walkthroughs</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-skillbinder-blue">Not Included:</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Access to Sections 4-15</li>
                    <li>• Section 12: Letters w/ Upload</li>
                    <li>• Section 16: File Uploads</li>
                    <li>• Secure Backup</li>
                    <li>• Clean PDF exports (no watermark)</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                {isTrial ? (
                  <div className="neumorphic-card p-4 bg-gray-50 border border-gray-200">
                    <p className="text-sm text-gray-600">
                      <strong>Trial Active:</strong> {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} remaining
                    </p>
                  </div>
                ) : (
                  <Button 
                    onClick={handleStartTrial}
                    size="lg"
                    className="neumorphic-button skillbinder_yellow px-8 py-4"
                    disabled={startingTrial}
                  >
                    {startingTrial ? 'Starting Trial...' : 'Start Free Trial'}
                  </Button>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  No credit card required • No auto-renewal • Upgrade anytime
                </p>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="flex justify-center items-center space-x-8 text-sm text-skillbinder-blue">
              <div className="flex items-center space-x-2">
                <span className="text-skillbinder-yellow font-semibold">Security</span>
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600 font-semibold">Guarantee</span>
                <span>30-day guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-600 font-semibold">Trusted</span>
                <span>10,000+ families trust us</span>
              </div>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center space-x-4 mt-8">
              <Button 
                onClick={() => setBillingCycle('monthly')} 
                variant={billingCycle === 'monthly' ? 'skillbinder_yellow' : 'outline'}
                className="neumorphic-button"
              >
                Monthly
              </Button>
              <Button 
                onClick={() => setBillingCycle('yearly')} 
                variant={billingCycle === 'yearly' ? 'skillbinder_yellow' : 'outline'}
                className="neumorphic-button"
              >
                Yearly
                {billingCycle === 'yearly' && (
                  <Badge className="ml-2 bg-green-500 text-white">Save 17%</Badge>
                )}
              </Button>
            </div>

            {/* Compare Plans Button */}
            <div className="flex justify-center mt-10">
              <Button 
                onClick={() => document.getElementById('plan-comparison')?.scrollIntoView({ behavior: 'smooth' })}
                variant="outline"
                className="neumorphic-button px-8 py-3 border-2 border-skillbinder-blue text-skillbinder-blue hover:bg-skillbinder-blue hover:text-white transition-all duration-300"
              >
                📊 Compare All Plans Side-by-Side
              </Button>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {plans[billingCycle].map((plan) => (
            <Card
              key={plan.name}
              className={`relative neumorphic-card transition-all duration-300 hover:shadow-xl bg-white border border-gray-200 h-full flex flex-col ${
                plan.popular ? 'ring-2 ring-skillbinder-blue scale-105 shadow-lg' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-skillbinder-blue text-white px-4 py-2 rounded-full shadow-lg">
                    <span className="mr-1">Most Popular</span>
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <h2 className="text-2xl font-bold text-skillbinder-blue">
                  {plan.name}
                </h2>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-skillbinder-yellow">
                    {plan.price}
                  </span>
                  <span className="text-lg text-gray-600 ml-1">
                    {plan.period}
                  </span>
                </div>
                {plan.savings && (
                  <p className="text-sm text-green-600 font-medium">
                    {plan.savings}
                  </p>
                )}
              </CardHeader>

              <CardContent className="space-y-4 flex-1 flex flex-col">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <span className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0 font-bold">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.unavailable.map((feature, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <span className="w-4 h-4 mr-3 mt-0.5 text-gray-400 flex-shrink-0 font-bold">✗</span>
                      <span className="text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full mt-auto neumorphic-button ${
                    plan.popular
                      ? 'skillbinder_yellow'
                      : 'skillbinder'
                  }`}
                  onClick={() => handleSubscribe(plan.planId)}
                >
                  {plan.name === 'Lifetime' ? 'Get Lifetime Access' : `Get ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Couples Bundle CTA */}
        <div className="flex justify-center mb-20">
          <Button 
            size="lg"
            onClick={() => window.location.href = '/couples-pricing'}
            className="text-white px-8 py-4 text-lg font-semibold"
            style={{ backgroundColor: '#17394B' }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#1a4a5f'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#17394B'}
          >
            View Couples Bundles
          </Button>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-skillbinder-blue">
            Everything You Need for Complete Legacy Planning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 neumorphic-card bg-white border border-gray-200">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <span className="text-2xl font-bold text-skillbinder-blue">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-skillbinder-blue">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Legacy Sections */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#153A4B' }}>
            Complete Coverage: All 16 Legacy Planning Sections
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            The Grand Finale covers every aspect of your life and legacy. Each section includes guided questions, 
            examples, and professional audio narration to help you create a comprehensive legacy plan.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {legacySections.map((section) => (
              <div key={section.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <div 
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold bg-skillbinder-blue"
                  >
                    {section.id}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1" style={{ color: '#153A4B' }}>
                      {section.title}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {section.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <div className="neumorphic-card bg-white border border-gray-200 rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="font-semibold mb-2 text-skillbinder-blue">
                🎧 Professional Audio Guidance
              </h3>
              <p className="text-sm text-gray-700">
                Each section includes professional narration that walks you through the process, 
                provides examples, and offers helpful tips to make your legacy planning journey easier and more meaningful.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose The Grand Finale */}
        <div className="mb-20">
          <div className="neumorphic-card bg-white rounded-2xl p-12 border border-gray-200">
            <h2 className="text-3xl font-bold text-center mb-8 text-skillbinder-blue">
              Why Choose The Grand Finale by SkillBinder?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <div className="neumorphic-card bg-gray-50 p-8 rounded-xl border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-skillbinder-blue/10 rounded-full mr-4">
                    <span className="text-skillbinder-blue text-xl font-bold">★</span>
                  </div>
                  <h3 className="text-xl font-bold text-skillbinder-blue">
                    20+ Years of Educational Excellence
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  SkillBinder has been creating professional training and educational content for over two decades. 
                  The Grand Finale represents the culmination of our expertise in helping people organize and 
                  communicate important life information.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Trusted by thousands of families worldwide</li>
                  <li>• Professional-grade content and structure</li>
                  <li>• Evidence-based approach to legacy planning</li>
                  <li>• Continuous improvement and updates</li>
                </ul>
              </div>

              <div className="neumorphic-card bg-gray-50 p-8 rounded-xl border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-skillbinder-blue/10 rounded-full mr-4">
                    <span className="text-skillbinder-blue text-xl font-bold">♥</span>
                  </div>
                  <h3 className="text-xl font-bold text-skillbinder-blue">
                    More Than Just Documents
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Unlike simple document storage or basic will creation tools, The Grand Finale helps you 
                  create a complete legacy that includes your values, stories, wisdom, and love for your family.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Ethical will and values preservation</li>
                  <li>• Family tradition and recipe documentation</li>
                  <li>• Personal letters and video messages</li>
                  <li>• Life lessons and wisdom sharing</li>
                </ul>
              </div>

              <div className="neumorphic-card bg-gray-50 p-8 rounded-xl border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-skillbinder-blue/10 rounded-full mr-4">
                    <span className="text-skillbinder-blue text-xl font-bold">🔒</span>
                  </div>
                  <h3 className="text-xl font-bold text-skillbinder-blue">
                    Complete Privacy & Security
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Your most sensitive information deserves the highest level of protection. We use enterprise-grade 
                  security measures to ensure your legacy remains private and secure.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• End-to-end encryption for all data</li>
                  <li>• Secure cloud storage with Supabase</li>
                  <li>• No data sharing or selling</li>
                  <li>• Canadian privacy standards</li>
                </ul>
              </div>

              <div className="neumorphic-card bg-gray-50 p-8 rounded-xl border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-skillbinder-blue/10 rounded-full mr-4">
                    <span className="text-skillbinder-blue text-xl font-bold">👥</span>
                  </div>
                  <h3 className="text-xl font-bold text-skillbinder-blue">
                    Family-Centered Approach
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  We understand that legacy planning is ultimately about the people you love. Every feature 
                  is designed to make it easier for your family to understand and honor your wishes.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Clear, organized information for families</li>
                  <li>• QR codes for easy digital access</li>
                  <li>• Step-by-step guidance and examples</li>
                  <li>• Professional PDF formatting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Comparison Table */}
        <div id="plan-comparison" className="mb-20" style={{ paddingTop: '20px' }}>
          <h2 className="text-3xl font-bold text-center mb-8 text-skillbinder-blue">
            Complete Plan Comparison
          </h2>
          
          <div className="max-w-7xl mx-auto" style={{ paddingTop: '20px' }}>
            <div className="neumorphic-card bg-white rounded-2xl shadow-lg">
              <div className="overflow-x-auto" style={{ paddingTop: '80px' }}>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-center">
                      <th className="py-4 px-4 text-left font-semibold text-skillbinder-blue">Feature</th>
                      <th className="py-4 px-4 font-semibold text-skillbinder-blue">Free Trial<br/>(7 Days)</th>
                      <th className="py-4 px-4 font-semibold text-skillbinder-blue">Lite<br/>($4/mo or $40/yr)</th>
                      <th className="py-4 px-4 font-semibold text-skillbinder-blue">Standard<br/>($8/mo or $80/yr)</th>
                      <th className="py-4 px-4 font-semibold text-skillbinder-blue bg-skillbinder-yellow relative">
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-10">
                          <span className="bg-skillbinder-blue text-white text-xs px-3 py-2 rounded-full shadow-lg whitespace-nowrap">
                            Most Popular
                          </span>
                        </div>
                        Premium<br/>($12/mo or $120/yr)
                      </th>
                      <th className="py-4 px-4 font-semibold text-skillbinder-blue">Lifetime<br/>($199 One-Time)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Access to Sections 1–15', '✖', '✖', '✔', '✔', '✔'],
                      ['Section 12: Letters w/ Upload', '✖', '✖', '✖', '✔', '✔'],
                      ['Section 16: File Uploads', '✖', '✖', '✖', '✔', '✔'],
                      ['PDF Export', '1 (Watermarked)', '1/month (Watermarked)', '3/month (No Watermark)', 'Unlimited', 'Unlimited'],
                      ['Data Storage (Supabase)', '✔', '✔', '✔', '✔', '✔'],
                      ['Secure Backup', '✖', '✔', '✔', '✔', '✔'],
                      ['Support Level', 'Basic', 'Basic', 'Standard', 'Priority (24hr Response)', 'Priority'],
                      ['Access to Updates', 'Trial Only', '✔', '✔', '✔', '✔ Forever']
                    ].map((row, index) => (
                      <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-gray-25' : 'bg-white'}`}>
                        <td className="py-3 px-4 font-medium text-gray-800">{row[0]}</td>
                        <td className="py-3 px-4 text-center text-sm">{row[1]}</td>
                        <td className="py-3 px-4 text-center text-sm">{row[2]}</td>
                        <td className="py-3 px-4 text-center text-sm">{row[3]}</td>
                        <td className="py-3 px-4 text-center text-sm bg-skillbinder-yellow font-medium">{row[4]}</td>
                        <td className="py-3 px-4 text-center text-sm font-medium">{row[5]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="neumorphic-card bg-white border border-gray-200 p-6 border-t">
                <div className="text-sm text-gray-700 space-y-2">
                  <p><strong>📌 Important Notes:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Section 12 & 16 uploads</strong> (documents, videos, images, audio) generate <strong>QR codes</strong> inside your printable PDF.</li>
                    <li><strong>PDF exports</strong> with watermark for Free and Lite plans; watermark is removed for higher tiers.</li>
                    <li>All plans use <strong>Supabase cloud storage</strong> for security and reliability.</li>
                    <li><strong>Free trial</strong> lets users test before committing—no uploads, limited features.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-skillbinder-blue">
            What Families Are Saying
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="neumorphic-card p-8 border-l-4 border-l-skillbinder-blue bg-white">
              <div className="flex mb-4">
                <span className="text-skillbinder-yellow font-bold text-lg">★★★★★</span>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "The Grand Finale helped me organize 30 years of scattered documents and memories. 
                The audio guides made it so much easier to know what to include. My children will have 
                everything they need when the time comes."
              </p>
              <div className="text-sm">
                <div className="font-semibold text-skillbinder-blue">Rebecca Thompson</div>
                <div className="text-gray-500">Retired Teacher, Phoenix, Arizona</div>
              </div>
            </div>

            <div className="neumorphic-card p-8 border-l-4 border-l-skillbinder-blue bg-white">
              <div className="flex mb-4">
                <span className="text-skillbinder-yellow font-bold text-lg">★★★★★</span>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "As a business owner, I needed something comprehensive and professional. 
                The lifetime plan was the perfect investment. I can update it as my life and business evolve."
              </p>
              <div className="text-sm">
                <div className="font-semibold text-skillbinder-blue">James Mitchell</div>
                <div className="text-gray-500">Small Business Owner, Austin, Texas</div>
              </div>
            </div>

            <div className="neumorphic-card p-8 border-l-4 border-l-skillbinder-blue bg-white">
              <div className="flex mb-4">
                <span className="text-skillbinder-yellow font-bold text-lg">★★★★★</span>
              </div>
              <p className="text-gray-700 mb-4 italic">
                "My husband completed his Grand Finale before he passed. Having all his wishes, 
                stories, and information organized made such a difficult time a little easier for our family."
              </p>
              <div className="text-sm">
                <div className="font-semibold text-skillbinder-blue">Linda Patterson</div>
                <div className="text-gray-500">Widow, Vancouver, British Columbia</div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of families who have trusted SkillBinder's expertise for over 20 years. 
              Your legacy planning is in experienced, caring hands.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-skillbinder-blue">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="neumorphic-card p-6">
                <h3 className="font-semibold mb-3 text-skillbinder-blue">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center neumorphic-card p-12 bg-white border border-gray-200">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-skillbinder-blue">
              Your Legacy Matters. Start Building It Today.
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              The Grand Finale isn't just about organizing information—it's about preserving your love, 
              wisdom, and values for the people who matter most. Join thousands of families who trust 
              SkillBinder's expertise for their most important planning.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-10 text-center">
              <div className="neumorphic-card p-6 bg-gray-50 border border-gray-200">
                <div className="text-3xl font-bold mb-2 text-skillbinder-blue">20+</div>
                <p className="text-sm text-gray-600">Years of Educational Excellence</p>
              </div>
              <div className="neumorphic-card p-6 bg-gray-50 border border-gray-200">
                <div className="text-3xl font-bold mb-2 text-skillbinder-blue">10,000+</div>
                <p className="text-sm text-gray-600">Families Trust Our Platform</p>
              </div>
              <div className="neumorphic-card p-6 bg-gray-50 border border-gray-200">
                <div className="text-3xl font-bold mb-2 text-skillbinder-blue">16</div>
                <p className="text-sm text-gray-600">Comprehensive Legacy Sections</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {!isTrial ? (
                <Button 
                  size="lg"
                  onClick={handleStartTrial}
                  disabled={startingTrial}
                  className="neumorphic-button skillbinder_yellow px-8 py-4 text-lg font-semibold"
                >
                  {startingTrial ? 'Starting Trial...' : 'Start Your 7-Day Free Trial'}
                </Button>
              ) : (
                <Button 
                  size="lg"
                  onClick={() => handleSubscribe('standard_monthly')}
                  className="neumorphic-button skillbinder_yellow px-8 py-4 text-lg font-semibold"
                >
                  Upgrade to Full Access
                </Button>
              )}
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => handleSubscribe('lifetime')}
                className="neumorphic-button px-8 py-4 text-lg font-semibold border-2 border-skillbinder-blue text-skillbinder-blue"
              >
                <span className="mr-3">Popular</span>
                Get Lifetime Access - $199
              </Button>
            </div>
            
            {/* Couples Bundle CTA */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Planning Together? Save 15% with Couples Bundles!
              </h3>
              <p className="text-gray-700 mb-4">
                Get two separate accounts with complete privacy for you and your partner. 
                Perfect for couples who want to plan their legacy together while maintaining individual privacy.
              </p>
              <Button 
                size="lg"
                onClick={() => window.location.href = '/couples-pricing'}
                className="text-white px-6 py-3 font-semibold"
                style={{ backgroundColor: '#17394B' }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#1a4a5f'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#17394B'}
              >
                View Couples Bundles
              </Button>
            </div>
            
            <div className="mt-8 space-y-2">
              <p className="text-sm text-gray-600">
                {!isTrial ? 'No credit card required for trial' : 'Keep all your trial data'} • 
                30-day money-back guarantee • One person per membership
              </p>
              <p className="text-xs text-gray-500">
                Canadian company with Canadian privacy standards. Your legacy is safe with us.
              </p>
            </div>
            
            {/* Trust badges */}
            <div className="mt-8 flex justify-center items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600 font-bold">Security</span>
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-600 font-bold">Trust</span>
                <span>Family Trusted</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600 font-bold">Privacy</span>
                <span>Privacy Protected</span>
              </div>
            </div>

            {/* Support Contact */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Questions? Contact us at{' '}
                <a 
                  href="mailto:support@skillbinder.com" 
                  className="font-medium underline hover:text-blue-600"
                  style={{ color: '#17394B' }}
                >
                  support@skillbinder.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 