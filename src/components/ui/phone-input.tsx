import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePhoneNumberInput } from '@/hooks/usePhoneNumber';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  showValidation?: boolean;
  error?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value = '',
  onChange,
  onBlur,
  onFocus,
  placeholder = '(555) 123-4567',
  label,
  required = false,
  disabled = false,
  className,
  showValidation = true,
  error
}) => {
  const phoneNumber = usePhoneNumberInput(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    phoneNumber.onChange(newValue);
    onChange?.(newValue);
  };

  const handleBlur = () => {
    phoneNumber.onBlur();
    onBlur?.();
  };

  const handleFocus = () => {
    phoneNumber.onFocus();
    onFocus?.();
  };

  const inputClassName = cn(
    'phone-input',
    {
      'border-green-500 focus:border-green-500': showValidation && phoneNumber.isValid && phoneNumber.value,
      'border-red-500 focus:border-red-500': showValidation && !phoneNumber.isValid && phoneNumber.value,
      'border-gray-300': !phoneNumber.value || !showValidation
    },
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <Input
        type="tel"
        value={phoneNumber.value}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClassName}
        maxLength={20}
      />
      
      {showValidation && phoneNumber.value && (
        <div className="text-xs">
          {phoneNumber.isValid ? (
            <span className="text-green-600">✓ Valid phone number</span>
          ) : (
            <span className="text-red-600">⚠ Please enter a valid phone number</span>
          )}
        </div>
      )}
      
      {error && (
        <div className="text-xs text-red-600">{error}</div>
      )}
      
      {phoneNumber.phoneInfo.countryCode && (
        <div className="text-xs text-gray-500">
          Country: +{phoneNumber.phoneInfo.countryCode}
        </div>
      )}
    </div>
  );
};

export default PhoneInput; 