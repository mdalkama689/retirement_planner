import { RUPEE_SYMBOL, CRORE_VALUE, LAKH_VALUE, THOUSAND_VALUE } from './constants';

 
export const formatIndianCurrency = (amount: number): string => {
  if (isNaN(amount)) return `${RUPEE_SYMBOL}0`;
  
  // For negative values
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  let formattedValue = '';
  
  if (absAmount >= CRORE_VALUE) {
    formattedValue = `${RUPEE_SYMBOL}${(absAmount / CRORE_VALUE).toFixed(2)} Cr`;
  } else if (absAmount >= LAKH_VALUE) {
    formattedValue = `${RUPEE_SYMBOL}${(absAmount / LAKH_VALUE).toFixed(2)} L`;
  } else if (absAmount >= THOUSAND_VALUE) {
    formattedValue = `${RUPEE_SYMBOL}${(absAmount / THOUSAND_VALUE).toFixed(2)}k`;
  } else {
    formattedValue = `${RUPEE_SYMBOL}${absAmount.toFixed(0)}`;
  }
  
  return isNegative ? `-${formattedValue}` : formattedValue;
};


export const formatIndianCurrencyFull = (amount: number): string => {
  if (isNaN(amount)) return `${RUPEE_SYMBOL}0`;
  

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(amount);
};


export const formatPercentage = (value: number): string => {
  if (isNaN(value)) return '0%';
  return `${value.toFixed(1)}%`;
};

/**
 * Format years (for age display)
 */
export const formatYears = (years: number): string => {
  if (isNaN(years)) return '0 years';
  return years === 1 ? '1 year' : `${years} years`;
};