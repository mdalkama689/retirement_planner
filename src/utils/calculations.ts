import {
  MONTHS_IN_YEAR,
  PERCENTAGE_DIVISOR,
  DEFAULT_EXPENSE_RATIO,
  DEFAULT_INFLATION_RATE,
  DEFAULT_INVESTMENT_RETURN,
} from './constants';


export const calculateFutureValue = (
  principal: number,
  ratePerAnnum: number,
  timeInYears: number
): number => {
  const rate = ratePerAnnum / PERCENTAGE_DIVISOR;
  return principal * Math.pow(1 + rate, timeInYears);
};


export const calculateFutureValueWithContributions = (
  initialAmount: number,
  monthlyContribution: number,
  ratePerAnnum: number,
  timeInYears: number
): number => {
  const monthlyRate = ratePerAnnum / PERCENTAGE_DIVISOR / MONTHS_IN_YEAR;
  const months = timeInYears * MONTHS_IN_YEAR;
  
 
  let futureValue = initialAmount * Math.pow(1 + monthlyRate, months);
  
 
  if (monthlyRate > 0) {
   
    const contributionFv = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    futureValue += contributionFv;
  } else {
   
    futureValue += monthlyContribution * months;
  }
  
  return futureValue;
};


export const calculateRequiredMonthlySavings = (
  currentAmount: number,
  goalAmount: number,
  ratePerAnnum: number,
  timeInYears: number
): number => {
  if (timeInYears <= 0) return 0;
  
  const monthlyRate = ratePerAnnum / PERCENTAGE_DIVISOR / MONTHS_IN_YEAR;
  const months = timeInYears * MONTHS_IN_YEAR;
  
 
  const futureValueOfCurrentSavings = calculateFutureValue(
    currentAmount,
    ratePerAnnum,
    timeInYears
  );
  
 
  const additionalAmountNeeded = Math.max(0, goalAmount - futureValueOfCurrentSavings);
  
  if (monthlyRate === 0) {
 
    return additionalAmountNeeded / months;
  }
  
 
  const requiredMonthlySavings = 
    additionalAmountNeeded * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
  
  return requiredMonthlySavings;
};


export const calculateRetirementCorpus = (
  currentMonthlyExpense: number,
  yearsInRetirement: number,
  inflationRate: number = DEFAULT_INFLATION_RATE,
  returnDuringRetirement: number = DEFAULT_INVESTMENT_RETURN / 2  
): number => {
 
  const expenseAtRetirement = currentMonthlyExpense * Math.pow(
    1 + inflationRate / PERCENTAGE_DIVISOR, 
    yearsInRetirement
  );
  

  const annualExpenseAtRetirement = expenseAtRetirement * MONTHS_IN_YEAR;
 const safeWithdrawalRate = 4;
  const adjustedWithdrawalRate = 
    Math.max(safeWithdrawalRate - (inflationRate - returnDuringRetirement), 2.5);
  return annualExpenseAtRetirement / (adjustedWithdrawalRate / PERCENTAGE_DIVISOR);
};

export const calculateMonthlyExpenseInRetirement = (
  currentMonthlyIncome: number,
  expenseRatio: number = DEFAULT_EXPENSE_RATIO
): number => {
  return currentMonthlyIncome * expenseRatio;
};


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
   if (year > 0) {
      accumulatedSavings = calculateFutureValueWithContributions(
        accumulatedSavings,
        monthlySavings,
        expectedReturn,
        1  
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