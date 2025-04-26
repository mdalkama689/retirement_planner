import React, { useState, useEffect } from "react";
import InputForm from "./InputForm";
import ResultsSummary from "./ResultsSummary";
import ProjectionChart from "./ProjectionChart";
import {
  calculateRetirementCorpus,
  calculateRequiredMonthlySavings,
  generateProjectionData,
  calculateFutureValueWithContributions,
} from "../utils/calculations";
import {
  DEFAULT_INFLATION_RATE,
  DEFAULT_INVESTMENT_RETURN,
  DEFAULT_EXPENSE_RATIO,
  DEFAULT_RETIREMENT_AGE,
  DEFAULT_LIFE_EXPECTANCY,
} from "../utils/constants";

const RetirementCalculator: React.FC = () => {
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

  const [results, setResults] = useState({
    retirementCorpusNeeded: 0,
    projectedCorpus: 0,
    monthlySavingsRequired: 0,
    monthlyShortfall: 0,
    projections: [] as ReturnType<typeof generateProjectionData>,
  });

  useEffect(() => {
    const yearsTillRetirement = formData.retirementAge - formData.currentAge;

    const retirementCorpusNeeded = calculateRetirementCorpus(
      formData.currentMonthlyIncome * formData.currentExpenseRatio,
      yearsTillRetirement,
      formData.inflationRate,
      formData.expectedReturn / 2
    );

    const projectedCorpus = calculateFutureValueWithContributions(
      formData.currentSavings,
      formData.monthlyInvestment,
      formData.expectedReturn,
      yearsTillRetirement
    );

    const monthlySavingsRequired = calculateRequiredMonthlySavings(
      formData.currentSavings,
      retirementCorpusNeeded,
      formData.expectedReturn,
      yearsTillRetirement
    );

    const monthlyShortfall = Math.max(
      0,
      monthlySavingsRequired - formData.monthlyInvestment
    );

    const projections = generateProjectionData(
      formData.currentAge,
      formData.retirementAge,
      formData.currentSavings,
      formData.monthlyInvestment,
      formData.expectedReturn,
      retirementCorpusNeeded
    );

    setResults({
      retirementCorpusNeeded,
      projectedCorpus,
      monthlySavingsRequired,
      monthlyShortfall,
      projections,
    });
  }, [formData]);

  const handleInputChange = (name: string, value: number) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
