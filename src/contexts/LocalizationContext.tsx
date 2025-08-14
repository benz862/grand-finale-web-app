import React, { createContext, useContext, useState, useEffect } from 'react';
import { localizeText, isCanadian, getAddressLabels } from '../lib/localization';

type Locale = 'en_US' | 'en_CA';

interface LocalizationContextType {
  isCanadian: boolean;
  localizeText: (text: string) => string;
  addressLabels: {
    stateProvince: string;
    postalCode: string;
    stateProvinceLabel: string;
  };
  updateUserData: (personalInfo: any) => void;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en_US'); // Default to American, switches to Canadian based on address detection
  const [userIsCanadian, setUserIsCanadian] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<any>(null);

  // Update Canadian status when personal info changes
  const updateUserData = (newPersonalInfo: any) => {
    setPersonalInfo(newPersonalInfo);
    const canadianStatus = isCanadian(newPersonalInfo);
    setUserIsCanadian(canadianStatus);
    
    // Save to localStorage for persistence
    if (canadianStatus) {
      localStorage.setItem('userLocale', 'en_CA');
    } else {
      localStorage.setItem('userLocale', 'en_US');
    }
  };

  // Load saved locale preference on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('userLocale');
    if (savedLocale === 'en_CA') {
      setUserIsCanadian(true);
    }
    
    // Try to load personal info from localStorage to detect Canadian status
    try {
      const savedPersonalInfo = localStorage.getItem('personalInfo');
      if (savedPersonalInfo) {
        const parsedInfo = JSON.parse(savedPersonalInfo);
        updateUserData(parsedInfo);
      }
    } catch (error) {
      console.log('Could not load personal info for localization');
    }
  }, []);

  const contextValue: LocalizationContextType = {
    isCanadian: userIsCanadian,
    localizeText: (text: string) => localizeText(text, userIsCanadian),
    addressLabels: getAddressLabels(userIsCanadian),
    updateUserData
  };

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}
