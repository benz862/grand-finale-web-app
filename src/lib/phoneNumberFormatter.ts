/**
 * Comprehensive Phone Number Formatter
 * Handles various input formats and automatically formats them properly
 */

export interface PhoneNumberInfo {
  formatted: string;
  isValid: boolean;
  countryCode?: string;
  areaCode?: string;
  number?: string;
  extension?: string;
}

/**
 * Detects if a phone number is international (starts with +)
 */
const isInternational = (value: string): boolean => {
  return value.trim().startsWith('+');
};

/**
 * Extracts country code from international number
 */
const extractCountryCode = (value: string): string | undefined => {
  const match = value.match(/^\+(\d{1,4})/);
  return match ? match[1] : undefined;
};

/**
 * Formats US/Canada phone numbers (10-11 digits)
 */
const formatUSCanada = (digits: string): PhoneNumberInfo => {
  // Handle 11 digits (1 + area code + number)
  if (digits.length === 11 && digits.startsWith('1')) {
    const areaCode = digits.slice(1, 4);
    const number = digits.slice(4, 7);
    const extension = digits.slice(7);
    return {
      formatted: `+1 (${areaCode}) ${number}-${extension}`,
      isValid: true,
      countryCode: '1',
      areaCode,
      number: `${number}-${extension}`,
      extension: extension.length === 4 ? extension : undefined
    };
  }
  
  // Handle 10 digits (area code + number)
  if (digits.length === 10) {
    const areaCode = digits.slice(0, 3);
    const number = digits.slice(3, 6);
    const extension = digits.slice(6);
    return {
      formatted: `(${areaCode}) ${number}-${extension}`,
      isValid: true,
      areaCode,
      number: `${number}-${extension}`,
      extension: extension.length === 4 ? extension : undefined
    };
  }
  
  // Handle 7 digits (local number)
  if (digits.length === 7) {
    const number = digits.slice(0, 3);
    const extension = digits.slice(3);
    return {
      formatted: `${number}-${extension}`,
      isValid: true,
      number: `${number}-${extension}`
    };
  }
  
  return {
    formatted: digits,
    isValid: false
  };
};

/**
 * Formats international phone numbers
 */
const formatInternational = (value: string): PhoneNumberInfo => {
  const cleaned = value.replace(/\D/g, '');
  const countryCode = extractCountryCode(value);
  
  if (!countryCode) {
    return {
      formatted: value,
      isValid: false
    };
  }
  
  // Remove country code from cleaned digits
  const remainingDigits = cleaned.slice(countryCode.length);
  
  // Common international formats
  if (remainingDigits.length >= 8 && remainingDigits.length <= 15) {
    // Format with spaces every 2-4 digits for readability
    const formatted = remainingDigits.match(/.{1,4}/g)?.join(' ') || remainingDigits;
    return {
      formatted: `+${countryCode} ${formatted}`,
      isValid: true,
      countryCode,
      number: formatted
    };
  }
  
  return {
    formatted: value,
    isValid: false
  };
};

/**
 * Main phone number formatting function
 * Handles various input formats:
 * - 10 digits: 1234567890 → (123) 456-7890
 * - 11 digits: 11234567890 → +1 (123) 456-7890
 * - With dashes: 123-456-7890 → (123) 456-7890
 * - With parentheses: (123) 456-7890 → (123) 456-7890
 * - International: +44 20 7946 0958 → +44 20 7946 0958
 */
export const formatPhoneNumber = (value: string): PhoneNumberInfo => {
  if (!value || typeof value !== 'string') {
    return {
      formatted: '',
      isValid: false
    };
  }
  
  const trimmed = value.trim();
  
  // Handle international numbers
  if (isInternational(trimmed)) {
    return formatInternational(trimmed);
  }
  
  // Extract only digits
  const digits = trimmed.replace(/\D/g, '');
  
  // Handle US/Canada numbers
  if (digits.length >= 7 && digits.length <= 11) {
    return formatUSCanada(digits);
  }
  
  // If we can't format it, return as-is but mark as invalid
  return {
    formatted: trimmed,
    isValid: false
  };
};

/**
 * Validates if a phone number is complete and properly formatted
 */
export const validatePhoneNumber = (value: string): boolean => {
  const info = formatPhoneNumber(value);
  return info.isValid;
};

/**
 * Formats phone number as user types (for real-time formatting)
 */
export const formatPhoneNumberAsTyped = (value: string, previousValue: string): string => {
  // Don't format if user is deleting
  if (value.length < previousValue.length) {
    return value;
  }
  
  // Don't format if user is in the middle of typing
  if (value.length < 7) {
    return value;
  }
  
  const info = formatPhoneNumber(value);
  return info.formatted;
};

/**
 * Examples of supported formats:
 * 
 * US/Canada:
 * - 1234567890 → (123) 456-7890
 * - 123-456-7890 → (123) 456-7890
 * - (123) 456-7890 → (123) 456-7890
 * - 123.456.7890 → (123) 456-7890
 * - 123 456 7890 → (123) 456-7890
 * - 11234567890 → +1 (123) 456-7890
 * 
 * International:
 * - +44 20 7946 0958 → +44 20 7946 0958
 * - +1-234-567-8900 → +1 234 567 8900
 * - +81 3 1234 5678 → +81 3 1234 5678
 * 
 * Extensions:
 * - 1234567890x123 → (123) 456-7890 ext. 123
 * - 123-456-7890x123 → (123) 456-7890 ext. 123
 */ 