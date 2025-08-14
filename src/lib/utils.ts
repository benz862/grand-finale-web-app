import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Trial and upgrade utilities
export const getTrialDataStatus = () => {
  const trialState = localStorage.getItem('trialState');
  const upgradeEvent = localStorage.getItem('upgradeEvent');
  
  if (!trialState) return { isTrial: false, hasUpgraded: false };
  
  const trialData = JSON.parse(trialState);
  return {
    isTrial: trialData.isTrial,
    hasUpgraded: !!upgradeEvent,
    trialStartDate: trialData.startDate,
    upgradeDate: upgradeEvent ? JSON.parse(upgradeEvent).upgradeDate : null
  };
};

export const getAllSavedFormData = () => {
  const formKeys = [
    'legalBiographicalData',
    'personalContactData',
    'emergencyContacts',
    'legalEstateForm',
    'keyDocumentsForm',
    'insuranceInfo',
    'funeral_preferences',
    'digitalAssetsData',
    'legacy_wishes',
    'personal_messages',
    'final_letters',
    'final_message',
    'transitionNotesForm',
    'petCareData',
    'survivorNotesData',
    'financeBusinessInfo',
    'final_checklist',
    'children_dependents',
    'fileUploadsData'
  ];
  
  const savedData: Record<string, any> = {};
  
  formKeys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        savedData[key] = JSON.parse(data);
      } catch (error) {
        console.warn(`Failed to parse saved data for ${key}:`, error);
      }
    }
  });
  
  return savedData;
};

export const clearTrialData = () => {
  // Only clear trial-specific data, not user form data
  localStorage.removeItem('trialState');
  localStorage.removeItem('upgradeEvent');
};

export const exportUserData = () => {
  const formData = getAllSavedFormData();
  const trialStatus = getTrialDataStatus();
  
  return {
    exportDate: new Date().toISOString(),
    trialStatus,
    formData
  };
};

export const importUserData = (data: any) => {
  try {
    // Validate the import data structure
    if (!data.formData || typeof data.formData !== 'object') {
      throw new Error('Invalid data format');
    }
    
    // Import form data
    Object.entries(data.formData).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
    
    // Import trial status if present
    if (data.trialStatus) {
      localStorage.setItem('trialState', JSON.stringify({
        isTrial: data.trialStatus.isTrial,
        startDate: data.trialStatus.trialStartDate,
        upgradeDate: data.trialStatus.upgradeDate
      }));
    }
    
    return true;
  } catch (error) {
    console.error('Failed to import user data:', error);
    return false;
  }
};
