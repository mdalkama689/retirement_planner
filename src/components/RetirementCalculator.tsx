import React, { useState, useEffect } from 'react';
import InputForm from './InputForm';
import ResultsSummary from './ResultsSummary';
import ProjectionChart from './ProjectionChart';
import { calculateRetirementCorpus, calculateRequiredMonthlySavings, generateProjectionData, calculateFutureValueWithContributions } from '../utils/calculations';
import { DEFAULT_INFLATION_RATE, DEFAULT_INVESTMENT_RETURN, DEFAULT_EXPENSE_RATIO, DEFAULT_RETIREMENT_AGE, DEFAULT_LIFE_EXPECTANCY } from '../utils/constants';

const RetirementCalculator: React.FC = () => {
  // Form state for user inputs
  const [formData, setFormData] = useState({
    currentAge: 30,
    retirementAge: DEFAULT_RETIREMENT_AGE,
    currentMonthlyIncome: 75000,
    currentExpenseRatio: DEFAULT_EXPENSE_RATIO,
    currentSavings: 500000,
    monthlyInvestment: 15000,
    expectedReturn: DEFAULT_INVESTMENT_RETURN,
    inflationRate: DEFAULT_INFLATION_RATE,
    lifeExpectancy: DEFAULT_LIFE_EXPECTANCY,
  });
  
  // Results state
  const [results, setResults] = useState({
    retirementCorpusNeeded: 0,
    projectedCorpus: 0,
    monthlySavingsRequired: 0,
    monthlyShortfall: 0,
    projections: [] as ReturnType<typeof generateProjectionData>,
  });
  
  // Update calculations whenever form data changes
  useEffect(() => {
    // Calculate years till retirement
    const yearsTillRetirement = formData.retirementAge - formData.currentAge;
    
    // Calculate retirement duration
    const retirementDuration = formData.lifeExpectancy - formData.retirementAge;
    
    // Calculate projected monthly expenses at retirement (adjusted for inflation)
    const monthlyExpenseAtRetirement = formData.currentMonthlyIncome * 
      formData.currentExpenseRatio * 
      Math.pow(1 + formData.inflationRate / 100, yearsTillRetirement);
    
    // Calculate retirement corpus needed
    const retirementCorpusNeeded = calculateRetirementCorpus(
      formData.currentMonthlyIncome * formData.currentExpenseRatio,
      yearsTillRetirement,
      formData.inflationRate,
      formData.expectedReturn / 2 // More conservative return during retirement
    );
    
    // Calculate projected corpus at retirement with current saving pattern
    const projectedCorpus = calculateFutureValueWithContributions(
      formData.currentSavings,
      formData.monthlyInvestment,
      formData.expectedReturn,
      yearsTillRetirement
    );
    
    // Calculate required monthly savings to reach retirement goal
    const monthlySavingsRequired = calculateRequiredMonthlySavings(
      formData.currentSavings,
      retirementCorpusNeeded,
      formData.expectedReturn,
      yearsTillRetirement
    );
    
    // Calculate monthly shortfall
    const monthlyShortfall = Math.max(0, monthlySavingsRequired - formData.monthlyInvestment);
    
    // Generate projection data for chart
    const projections = generateProjectionData(
      formData.currentAge,
      formData.retirementAge,
      formData.currentSavings,
      formData.monthlyInvestment,
      formData.expectedReturn,
      retirementCorpusNeeded
    );
    
    // Update results state
    setResults({
      retirementCorpusNeeded,
      projectedCorpus,
      monthlySavingsRequired,
      monthlyShortfall,
      projections,
    });
  }, [formData]);
  
  // Handle form input changes
  const handleInputChange = (name: string, value: number) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  // Calculate years till retirement and retirement duration
  const yearsTillRetirement = formData.retirementAge - formData.currentAge;
  const retirementDuration = formData.lifeExpectancy - formData.retirementAge;
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <InputForm formData={formData} onChange={handleInputChange} />
        </div>
        
        <div>
          <ResultsSummary
            yearsTillRetirement={yearsTillRetirement}
            retirementCorpusNeeded={results.retirementCorpusNeeded}
            projectedCorpus={results.projectedCorpus}
            monthlySavingsRequired={results.monthlySavingsRequired}
            currentMonthlySavings={formData.monthlyInvestment}
            monthlyShortfall={results.monthlyShortfall}
            retirementDuration={retirementDuration}
          />
        </div>
      </div>
      
      <div className="mt-6">
        <ProjectionChart projections={results.projections} />
      </div>
    </div>
  );
};

export default RetirementCalculator;