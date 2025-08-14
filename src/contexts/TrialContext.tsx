import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface TrialContextType {
  isTrial: boolean;
  trialDaysLeft: number;
  trialStartDate: Date | null;
  isTrialExpired: boolean;
  canAccessSection: (sectionId: string | number) => boolean;
  canUploadFiles: boolean;
  canUploadInSection: (sectionId: string | number) => boolean;
  canGenerateCleanPDF: boolean;
  canGenerateQR: boolean;
  getPdfExportLimit: () => { limit: number; hasWatermark: boolean };
  hasSecureBackup: () => boolean;
  showUpgradePrompt: () => void;
  upgradeToPaid: () => void;
  startTrial: () => void;
  activateTrial: () => void;
  handleSuccessfulUpgrade: () => void;
  userTier: string;
  userBilling: string;
}

const TrialContext = createContext<TrialContextType | undefined>(undefined);

export const useTrial = () => {
  const context = useContext(TrialContext);
  if (context === undefined) {
    throw new Error('useTrial must be used within a TrialProvider');
  }
  return context;
};

interface TrialProviderProps {
  children: React.ReactNode;
}

export const TrialProvider: React.FC<TrialProviderProps> = ({ children }) => {
  const [isTrial, setIsTrial] = useState(false);
  const [trialStartDate, setTrialStartDate] = useState<Date | null>(null);
  const [trialDaysLeft, setTrialDaysLeft] = useState(7);
  const [userTier, setUserTier] = useState<string>('Unknown');
  const [userBilling, setUserBilling] = useState<string>('Unknown');
  const { user } = useAuth();

  // Determine user tier and billing from email
  useEffect(() => {
    if (user?.email) {
      const email = user.email.toLowerCase();
      
      // Determine tier
      if (email === 'glenn.donnelly@icloud.com') {
        setUserTier('Lifetime');
      } else if (email === 'info@skillbinder.com') {
        setUserTier('Lite');
      } else if (email.includes('.lite.')) {
        setUserTier('Lite');
      } else if (email.includes('.standard.')) {
        setUserTier('Standard');
      } else if (email.includes('.premium.')) {
        setUserTier('Premium');
      } else if (email.includes('.lifetime') || email.includes('dummy.lifetime@')) {
        setUserTier('Lifetime');
      } else {
        setUserTier('Unknown');
      }

      // Determine billing
      if (email === 'glenn.donnelly@icloud.com') {
        setUserBilling('Lifetime');
      } else if (email.includes('.monthly@')) {
        setUserBilling('Monthly');
      } else if (email.includes('.yearly@')) {
        setUserBilling('Yearly');
      } else if (email.includes('dummy.lifetime@')) {
        setUserBilling('Lifetime');
      } else {
        setUserBilling('Unknown');
      }

      // Check if this is a trial user (not a dummy account, Glenn, or specific test accounts)
      if (!email.includes('@epoxydogs.com') && 
          email !== 'glenn.donnelly@icloud.com' && 
          email !== 'info@skillbinder.com') {
        setIsTrial(true);
      } else {
        setIsTrial(false);
      }
      
      // DEVELOPMENT MODE: Auto-activate trial for new users (but not Glenn or specific test accounts)
      if (email && 
          email !== 'glenn.donnelly@icloud.com' && 
          email !== 'info@skillbinder.com' && 
          !localStorage.getItem('trialState')) {
        console.log('Auto-activating trial for development user:', email);
        activateTrial();
      }
    }
  }, [user]);

  // Load trial state from localStorage on mount
  useEffect(() => {
    const savedTrialState = localStorage.getItem('trialState');
    if (savedTrialState) {
      const trialData = JSON.parse(savedTrialState);
      setIsTrial(trialData.isTrial);
      setTrialStartDate(new Date(trialData.startDate));
    }
  }, []);

  // Calculate trial days left
  useEffect(() => {
    if (trialStartDate) {
      const now = new Date();
      const start = new Date(trialStartDate);
      const daysElapsed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const daysLeft = Math.max(0, 7 - daysElapsed);
      setTrialDaysLeft(daysLeft);
    }
  }, [trialStartDate]);

  const isTrialExpired = trialDaysLeft <= 0;

  // Access restrictions based on tier
  const canAccessSection = (sectionId: string | number): boolean => {
    // If no user, allow access to intro only
    if (!user) {
      return sectionId === 'intro';
    }

    // Trial users have limited access: Sections 1-3 only
    if (isTrial) {
      return ['intro', 1, 2, 3, 'conclusion'].includes(sectionId as any);
    }

    // Paid users have access based on their tier
    switch (userTier) {
      case 'Lite':
        // Lite users: Access to Sections 1-3 only
        return ['intro', 1, 2, 3, 'conclusion'].includes(sectionId as any);
      
      case 'Standard':
        // Standard users: Access to Sections 1-3 and 4-15 (no uploads in 12 & 16)
        return ['intro', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 'conclusion'].includes(sectionId as any);
      
      case 'Premium':
        // Premium users: Full access including uploads in sections 12 & 16
        return true;
      
      case 'Lifetime':
        // Lifetime users: Full access to everything
        return true;
      
      default:
        // Unknown tier - treat as trial (sections 1-3 only)
        return ['intro', 1, 2, 3, 'conclusion'].includes(sectionId as any);
    }
  };

  // Check if user can upload files in specific sections
  const canUploadInSection = (sectionId: string | number): boolean => {
    if (isTrial) return false;
    
    // Section 12 (Letters) and Section 16 (File Uploads) require Premium or Lifetime
    if (sectionId === 12 || sectionId === 16) {
      return userTier === 'Premium' || userTier === 'Lifetime';
    }
    
    // Other sections don't have uploads or are available to all paid tiers
    return !isTrial;
  };

  // PDF export limits based on plan
  const getPdfExportLimit = (): { limit: number; hasWatermark: boolean } => {
    if (isTrial) {
      return { limit: 1, hasWatermark: true };
    }
    
    switch (userTier) {
      case 'Lite':
        return { limit: 1, hasWatermark: true }; // 1 per month, watermarked
      case 'Standard':
        return { limit: 3, hasWatermark: false }; // 3 per month, no watermark
      case 'Premium':
      case 'Lifetime':
        return { limit: -1, hasWatermark: false }; // Unlimited, no watermark
      default:
        return { limit: 1, hasWatermark: true };
    }
  };

  // Check if user has secure backup
  const hasSecureBackup = (): boolean => {
    if (isTrial) return false;
    return userTier === 'Lite' || userTier === 'Standard' || userTier === 'Premium' || userTier === 'Lifetime';
  };

  const canUploadFiles = !isTrial && (userTier === 'Premium' || userTier === 'Lifetime');
  const canGenerateCleanPDF = !isTrial && (userTier === 'Standard' || userTier === 'Premium' || userTier === 'Lifetime');
  const canGenerateQR = !isTrial && (userTier === 'Standard' || userTier === 'Premium' || userTier === 'Lifetime');

  const showUpgradePrompt = () => {
    // This will be implemented to show upgrade modal
    console.log('Show upgrade prompt');
  };

  const upgradeToPaid = () => {
    // DEVELOPMENT MODE: Skip pricing redirect for development
    console.log('upgradeToPaid called - skipping pricing redirect for development');
    return;
    
    // This will redirect to pricing page or payment
    window.location.href = '/pricing';
  };

  const handleSuccessfulUpgrade = () => {
    // Called after successful payment/upgrade
    const upgradeData = {
      isTrial: false,
      upgradeDate: new Date().toISOString(),
      originalTrialStartDate: trialStartDate?.toISOString()
    };
    
    // Save upgrade state
    localStorage.setItem('trialState', JSON.stringify(upgradeData));
    
    // Update context state
    setIsTrial(false);
    
    // Optional: Save upgrade event for analytics
    localStorage.setItem('upgradeEvent', JSON.stringify({
      upgradedFrom: 'trial',
      upgradeDate: new Date().toISOString(),
      trialDaysUsed: trialDaysLeft > 0 ? 7 - trialDaysLeft : 7
    }));
    
    console.log('User successfully upgraded from trial to paid');
  };

  const activateTrial = () => {
    console.log('activateTrial function called!');
    const trialData = {
      isTrial: true,
      startDate: new Date().toISOString()
    };
    localStorage.setItem('trialState', JSON.stringify(trialData));
    setIsTrial(true);
    setTrialStartDate(new Date());
    setTrialDaysLeft(7);
    console.log('Trial activated successfully!', trialData);
  };

  const startTrial = () => {
    console.log('startTrial function called - redirecting to signup');
    
    // Always redirect to signup form for trial registration
    // Trial will be activated after successful signup
    localStorage.setItem('startingTrial', 'true');
    window.location.href = '/app';
  };

  const value: TrialContextType = {
    isTrial,
    trialDaysLeft,
    trialStartDate,
    isTrialExpired,
    canAccessSection,
    canUploadFiles,
    canUploadInSection,
    canGenerateCleanPDF,
    canGenerateQR,
    getPdfExportLimit,
    hasSecureBackup,
    showUpgradePrompt,
    upgradeToPaid,
    startTrial,
    activateTrial,
    handleSuccessfulUpgrade,
    userTier,
    userBilling
  };

  return (
    <TrialContext.Provider value={value}>
      {children}
    </TrialContext.Provider>
  );
}; 