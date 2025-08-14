import { useState, useCallback, useEffect } from 'react';
import { formatPhoneNumber, formatPhoneNumberAsTyped, validatePhoneNumber, PhoneNumberInfo } from '@/lib/phoneNumberFormatter';

export interface UsePhoneNumberReturn {
  value: string;
  formattedValue: string;
  isValid: boolean;
  phoneInfo: PhoneNumberInfo;
  onChange: (value: string) => void;
  onBlur: () => void;
  onFocus: () => void;
  clear: () => void;
}

export const usePhoneNumber = (initialValue: string = ''): UsePhoneNumberReturn => {
  const [value, setValue] = useState(initialValue);
  const [previousValue, setPreviousValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [phoneInfo, setPhoneInfo] = useState<PhoneNumberInfo>(formatPhoneNumber(initialValue));

  // Update phone info when value changes
  useEffect(() => {
    const info = formatPhoneNumber(value);
    setPhoneInfo(info);
  }, [value]);

  const handleChange = useCallback((newValue: string) => {
    setPreviousValue(value);
    setValue(newValue);
  }, [value]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    // Format the number when user finishes typing
    const info = formatPhoneNumber(value);
    if (info.isValid && info.formatted !== value) {
      setValue(info.formatted);
    }
  }, [value]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const clear = useCallback(() => {
    setValue('');
    setPreviousValue('');
    setPhoneInfo(formatPhoneNumber(''));
  }, []);

  // Real-time formatting while typing (optional)
  const formattedValue = isFocused ? value : phoneInfo.formatted;

  return {
    value,
    formattedValue,
    isValid: phoneInfo.isValid,
    phoneInfo,
    onChange: handleChange,
    onBlur: handleBlur,
    onFocus: handleFocus,
    clear
  };
};

/**
 * Enhanced phone number input component hook
 * Provides automatic formatting and validation
 */
export const usePhoneNumberInput = (initialValue: string = '') => {
  const phoneNumber = usePhoneNumber(initialValue);
  
  const inputProps = {
    value: phoneNumber.value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => phoneNumber.onChange(e.target.value),
    onBlur: phoneNumber.onBlur,
    onFocus: phoneNumber.onFocus,
    type: 'tel',
    placeholder: '(555) 123-4567',
    className: `phone-input ${phoneNumber.isValid ? 'valid' : phoneNumber.value ? 'invalid' : ''}`
  };

  return {
    ...phoneNumber,
    inputProps
  };
}; 