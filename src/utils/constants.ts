// Financial constants specific to Indian context

export const DEFAULT_INFLATION_RATE = 6; // 6% average inflation in India
export const DEFAULT_INVESTMENT_RETURN = 12; // 12% average return on equity investments
export const DEFAULT_PPF_RETURN = 7.1; // Public Provident Fund return rate
export const DEFAULT_FD_RETURN = 6.5; // Fixed Deposit return rate
export const DEFAULT_RETIREMENT_AGE = 60; // Standard retirement age in India
export const DEFAULT_LIFE_EXPECTANCY = 80; // Life expectancy in India
export const MIN_RETIREMENT_AGE = 45; // Minimum retirement age to consider
export const MAX_RETIREMENT_AGE = 75; // Maximum retirement age to consider

// Monthly expense multiplier (% of current monthly income expected as expenses during retirement)
export const DEFAULT_EXPENSE_RATIO = 0.8; // 80% of pre-retirement income

// Tax constants
export const EPF_TAX_EXEMPTION_LIMIT = 150000; // ₹1.5 lakh per annum under 80C
export const NPS_ADDITIONAL_TAX_BENEFIT = 50000; // ₹50,000 additional tax benefit under 80CCD(1B)

// Fixed values
export const MONTHS_IN_YEAR = 12;
export const PERCENTAGE_DIVISOR = 100;

// Formatting
export const RUPEE_SYMBOL = "₹";
export const CRORE_VALUE = 10000000;
export const LAKH_VALUE = 100000;
export const THOUSAND_VALUE = 1000;

// Chart colors
export const CHART_COLORS = {
  savings: 'rgba(14, 165, 233, 0.8)', // primary-500
  goal: 'rgba(139, 92, 246, 0.8)', // secondary-500
  savingsLine: 'rgba(14, 165, 233, 1)', // primary-500 solid
  goalLine: 'rgba(139, 92, 246, 1)', // secondary-500 solid
  deficit: 'rgba(239, 68, 68, 0.8)', // error-500
  background: {
    dark: '#111827', // gray-900
    grid: '#1f2937', // gray-800
  }
};