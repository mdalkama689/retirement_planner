import React from 'react';
import { formatIndianCurrency } from '../utils/formatters';
import InputField from './InputField';
import { 
  MIN_RETIREMENT_AGE,
  MAX_RETIREMENT_AGE,
} from '../utils/constants';

interface InputFormProps {
  formData: {
    currentAge: number;
    retirementAge: number;
    currentMonthlyIncome: number;
    currentExpenseRatio: number;
    currentSavings: number;
    monthlyInvestment: number;
    expectedReturn: number;
    inflationRate: number;
    lifeExpectancy: number;
  };
  onChange: (name: string, value: number) => void;
}

const InputForm: React.FC<InputFormProps> = ({ formData, onChange }) => {
  return (
    <div className="card bg-gray-900 animate-fade-in">
      <h3 className="text-xl font-medium text-gray-100 mb-6">Your Information</h3>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <InputField
            label="Current Age"
            name="currentAge"
            value={formData.currentAge}
            onChange={onChange}
            min={18}
            max={70}
            step={1}
            suffix="years"
            formatValue={(val) => `${val} years`}
          />
          
          <InputField
            label="Retirement Age"
            name="retirementAge"
            value={formData.retirementAge}
            onChange={onChange}
            min={MIN_RETIREMENT_AGE}
            max={MAX_RETIREMENT_AGE}
            step={1}
            suffix="years"
            tooltip="The age at which you plan to retire. Standard retirement age in India is 60 years."
            formatValue={(val) => `${val} years`}
          />
          
          <InputField
            label="Life Expectancy"
            name="lifeExpectancy"
            value={formData.lifeExpectancy}
            onChange={onChange}
            min={Math.max(formData.retirementAge + 5, 70)}
            max={100}
            step={1}
            suffix="years"
            tooltip="The age to which you expect to live. This helps calculate how long your retirement savings need to last."
            formatValue={(val) => `${val} years`}
          />
        </div>
        
        <div className="space-y-4">
          <InputField
            label="Monthly Income"
            name="currentMonthlyIncome"
            value={formData.currentMonthlyIncome}
            onChange={onChange}
            min={10000}
            max={1000000}
            step={1000}
            formatValue={(val) => formatIndianCurrency(val)}
          />
          
          <InputField
            label="Monthly Expenses (% of Income)"
            name="currentExpenseRatio"
            value={formData.currentExpenseRatio * 100}
            onChange={(name, value) => onChange(name, value / 100)}
            min={50}
            max={90}
            step={1}
            suffix="%"
            tooltip="Percentage of your current income you expect to need monthly during retirement."
            formatValue={(val) => `${val}%`}
          />
          
          <InputField
            label="Current Retirement Savings"
            name="currentSavings"
            value={formData.currentSavings}
            onChange={onChange}
            min={0}
            max={10000000}
            step={10000}
            formatValue={(val) => formatIndianCurrency(val)}
          />
          
          <InputField
            label="Monthly Investment"
            name="monthlyInvestment"
            value={formData.monthlyInvestment}
            onChange={onChange}
            min={0}
            max={500000}
            step={1000}
            formatValue={(val) => formatIndianCurrency(val)}
          />
        </div>
        
        <div>
          <h4 className="text-md font-medium text-gray-300 mb-4">Market Assumptions</h4>
          <div className="space-y-4">
            <InputField
              label="Expected Return Rate"
              name="expectedReturn"
              value={formData.expectedReturn}
              onChange={onChange}
              min={5}
              max={16}
              step={0.1}
              suffix="%"
              tooltip="Average annual return on your investments. Long-term equity returns in India have historically been around 12-14%."
              formatValue={(val) => `${val}%`}
            />
            
            <InputField
              label="Inflation Rate"
              name="inflationRate"
              value={formData.inflationRate}
              onChange={onChange}
              min={4}
              max={9}
              step={0.1}
              suffix="%"
              tooltip="Expected average annual inflation rate. In India, long-term inflation has averaged around 6%."
              formatValue={(val) => `${val}%`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputForm;