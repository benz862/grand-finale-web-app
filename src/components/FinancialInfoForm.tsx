import React from 'react';
import FinanceBusinessComplete from './FinanceBusinessComplete';

interface FinancialInfoFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

const FinancialInfoForm: React.FC<FinancialInfoFormProps> = ({ onNext, onPrevious }) => {
  return <FinanceBusinessComplete onNext={onNext} onPrevious={onPrevious} />;
};

export default FinancialInfoForm;