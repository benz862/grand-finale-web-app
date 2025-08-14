import { formatPhoneNumber, validatePhoneNumber } from './phoneNumberFormatter';

// Test cases for phone number formatting
const testCases = [
  // US/Canada formats
  { input: '1234567890', expected: '(123) 456-7890', description: '10 digits' },
  { input: '123-456-7890', expected: '(123) 456-7890', description: 'With dashes' },
  { input: '(123) 456-7890', expected: '(123) 456-7890', description: 'Already formatted' },
  { input: '123.456.7890', expected: '(123) 456-7890', description: 'With dots' },
  { input: '123 456 7890', expected: '(123) 456-7890', description: 'With spaces' },
  { input: '11234567890', expected: '+1 (123) 456-7890', description: '11 digits with country code' },
  
  // International formats
  { input: '+44 20 7946 0958', expected: '+44 20 7946 0958', description: 'UK number' },
  { input: '+1-234-567-8900', expected: '+1 234 567 8900', description: 'International with dashes' },
  { input: '+81 3 1234 5678', expected: '+81 3 1234 5678', description: 'Japan number' },
  
  // Invalid formats
  { input: '12345', expected: '12345', description: 'Too short' },
  { input: 'abc123def', expected: 'abc123def', description: 'Mixed characters' },
  { input: '', expected: '', description: 'Empty string' },
];

console.log('🧪 Phone Number Formatting Test Results:');
console.log('=====================================');

testCases.forEach(({ input, expected, description }) => {
  const result = formatPhoneNumber(input);
  const isValid = validatePhoneNumber(input);
  const status = result.formatted === expected ? '✅ PASS' : '❌ FAIL';
  
  console.log(`${status} ${description}`);
  console.log(`  Input: "${input}"`);
  console.log(`  Expected: "${expected}"`);
  console.log(`  Got: "${result.formatted}"`);
  console.log(`  Valid: ${isValid}`);
  console.log(`  Country Code: ${result.countryCode || 'N/A'}`);
  console.log(`  Area Code: ${result.areaCode || 'N/A'}`);
  console.log(`  Number: ${result.number || 'N/A'}`);
  console.log('');
});

console.log('📱 Supported Input Formats:');
console.log('==========================');
console.log('• 1234567890 → (123) 456-7890');
console.log('• 123-456-7890 → (123) 456-7890');
console.log('• (123) 456-7890 → (123) 456-7890');
console.log('• 123.456.7890 → (123) 456-7890');
console.log('• 123 456 7890 → (123) 456-7890');
console.log('• 11234567890 → +1 (123) 456-7890');
console.log('• +44 20 7946 0958 → +44 20 7946 0958');
console.log('• +1-234-567-8900 → +1 234 567 8900');
console.log('• +81 3 1234 5678 → +81 3 1234 5678'); 