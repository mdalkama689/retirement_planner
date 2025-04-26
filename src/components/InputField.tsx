import React, { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface InputFieldProps {
  label: string;
  name: string;
  value: number;
  onChange: (name: string, value: number) => void;
  min: number;
  max: number;
  step: number;
  tooltip?: string;
  suffix?: string;
  formatValue?: (value: number) => string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  min,
  max,
  tooltip,
  suffix = ''
}) => {
  const [inputValue, setInputValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setInputValue(value.toString());
    }
  }, [value, isFocused]);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    const numericValue = parseFloat(newValue);
    if (!isNaN(numericValue)) {
      const clampedValue = Math.min(Math.max(numericValue, min), max);
      onChange(name, clampedValue);
    }
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    const numericValue = parseFloat(inputValue);
    if (isNaN(numericValue)) {
      setInputValue(value.toString());
    } else {
      const clampedValue = Math.min(Math.max(numericValue, min), max);
      setInputValue(clampedValue.toString());
      onChange(name, clampedValue);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-300 flex items-center">
          {label}
          {tooltip && (
            <div className="tooltip ml-1">
              <HelpCircle className="h-3.5 w-3.5 text-gray-500" />
              <span className="tooltip-text">{tooltip}</span>
            </div>
          )}
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleInputBlur}
            className="w-20 text-right text-sm bg-gray-800 border border-gray-700 rounded-md px-2 py-1"
          />
          {suffix && <span className="text-sm text-gray-400">{suffix}</span>}
        </div>
      </div>

    </div>
  );
};

export default InputField;