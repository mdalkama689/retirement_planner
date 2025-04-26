import {
  MONTHS_IN_YEAR,
  PERCENTAGE_DIVISOR,
  DEFAULT_EXPENSE_RATIO,
  DEFAULT_INFLATION_RATE,
  DEFAULT_INVESTMENT_RETURN,
} from './constants';

/**
 * Calculate future value with compound interest
 */
export const calculateFutureValue = (
  principal: number,
  ratePerAnnum: number,
  timeInYears: number
): number => {
  const rate = ratePerAnnum / PERCENTAGE_DIVISOR;
  return principal * Math.pow(1 + rate, timeInYears);
};

/**
 * Calculate future value with regular monthly contributions
 */
export const calculateFutureValueWithContributions = (
  initialAmount: number,
  monthlyContribution: number,
  ratePerAnnum: number,
  timeInYears: number
): number => {
  const monthlyRate = ratePerAnnum / PERCENTAGE_DIVISOR / MONTHS_IN_YEAR;
  const months = timeInYears * MONTHS_IN_YEAR;
  
  // Future value of initial principal
  let futureValue = initialAmount * Math.pow(1 + monthlyRate, months);
  
  // Future value of monthly contributions
  if (monthlyRate > 0) {
    // Formula: PMT × (((1 + r)^n - 1) / r)
    const contributionFv = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    futureValue += contributionFv;
  } else {
    // If rate is 0, just add the total contributions
    futureValue += monthlyContribution * months;
  }
  
  return futureValue;
};

/**
 * Calculate required monthly savings to reach a retirement goal
 */
export const calculateRequiredMonthlySavings = (
  currentAmount: number,
  goalAmount: number,
  ratePerAnnum: number,
  timeInYears: number
): number => {
  if (timeInYears <= 0) return 0;
  
  const monthlyRate = ratePerAnnum / PERCENTAGE_DIVISOR / MONTHS_IN_YEAR;
  const months = timeInYears * MONTHS_IN_YEAR;
  
  // Future value of current savings
  const futureValueOfCurrentSavings = calculateFutureValue(
    currentAmount,
    ratePerAnnum,
    timeInYears
  );
  
  // Additional amount needed
  const additionalAmountNeeded = Math.max(0, goalAmount - futureValueOfCurrentSavings);
  
  if (monthlyRate === 0) {
    // Without interest, just divide by number of months
    return additionalAmountNeeded / months;
  }
  
  // Formula: PMT = FV * r / ((1 + r)^n - 1)
  const requiredMonthlySavings = 
    additionalAmountNeeded * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
  
  return requiredMonthlySavings;
};

/**
 * Calculate retirement corpus needed based on monthly expenses and withdrawal rate
 */
export const calculateRetirementCorpus = (
  currentMonthlyExpense: number,
  yearsInRetirement: number,
  inflationRate: number = DEFAULT_INFLATION_RATE,
  returnDuringRetirement: number = DEFAULT_INVESTMENT_RETURN / 2 // More conservative during retirement
): number => {
  // First calculate expenses at retirement (adjusted for inflation)
  const expenseAtRetirement = currentMonthlyExpense * Math.pow(
    1 + inflationRate / PERCENTAGE_DIVISOR, 
    yearsInRetirement
  );
  
  // Annual expense at retirement
  const annualExpenseAtRetirement = expenseAtRetirement * MONTHS_IN_YEAR;
  
  // Simplified calculation using the 4% rule with adjustments
  // Safe withdrawal rate is typically 4% of corpus per year for 30 years
  const safeWithdrawalRate = 4;
  const adjustedWithdrawalRate = 
    Math.max(safeWithdrawalRate - (inflationRate - returnDuringRetirement), 2.5);
  
  // Required corpus = Annual Expense / Safe Withdrawal Rate
  return annualExpenseAtRetirement / (adjustedWithdrawalRate / PERCENTAGE_DIVISOR);
};

/**
 * Calculate monthly expenses in retirement (% of current income)
 */
export const calculateMonthlyExpenseInRetirement = (
  currentMonthlyIncome: number,
  expenseRatio: number = DEFAULT_EXPENSE_RATIO
): number => {
  return currentMonthlyIncome * expenseRatio;
};

/**
 * Generate projection data for chart display
 */
export interface YearlyProjection {
  age: number;
  year: number;
  savings: number;
  goal: number;
}

export const generateProjectionData = (
  currentAge: number,
  retirementAge: number,
  currentSavings: number,
  monthlySavings: number,
  expectedReturn: number,
  retirementGoal: number
): YearlyProjection[] => {
  const yearsToRetirement = retirementAge - currentAge;
  const data: YearlyProjection[] = [];
  
  let accumulatedSavings = currentSavings;
  const currentYear = new Date().getFullYear();
  
  for (let year = 0; year <= yearsToRetirement; year++) {
    // Calculate savings with compound interest and monthly contributions
    if (year > 0) {
      accumulatedSavings = calculateFutureValueWithContributions(
        accumulatedSavings,
        monthlySavings,
        expectedReturn,
        1 // 1 year at a time
      );
    }
    
    data.push({
      age: currentAge + year,
      year: currentYear + year,
      savings: Math.round(accumulatedSavings),
      goal: retirementGoal,
    });
  }
  
  return data;
};