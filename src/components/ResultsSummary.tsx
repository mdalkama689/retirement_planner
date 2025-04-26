import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Download, Share2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatIndianCurrency, formatIndianCurrencyFull, formatYears } from '../utils/formatters';
import toast from 'react-hot-toast';

interface ResultsSummaryProps {
  yearsTillRetirement: number;
  retirementCorpusNeeded: number;
  projectedCorpus: number;
  monthlySavingsRequired: number;
  currentMonthlySavings: number;
  monthlyShortfall: number;
  retirementDuration: number;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  yearsTillRetirement,
  retirementCorpusNeeded,
  projectedCorpus,
  monthlySavingsRequired,
  currentMonthlySavings,
  monthlyShortfall,
  retirementDuration,
}) => {
  const [showGuidance, setShowGuidance] = useState(false);
  
  const percentageAchieved = (projectedCorpus / retirementCorpusNeeded) * 100;
  const isGoalMet = projectedCorpus >= retirementCorpusNeeded;
  
  const guidanceMessages = [
    "Consider increasing your monthly SIP by at least 10% annually",
    "Allocate at least 70% to equity funds for long-term growth during your working years",
    "Review and rebalance your portfolio annually",
    "Consider tax-saving investment options like ELSS, PPF, and NPS",
    "Maintain an emergency fund of 6 months' expenses separate from retirement savings",
  ];
  
  const handleDownload = () => {
    const data = {
      summary: {
        yearsTillRetirement,
        retirementDuration,
        retirementCorpusNeeded: formatIndianCurrencyFull(retirementCorpusNeeded),
        projectedCorpus: formatIndianCurrencyFull(projectedCorpus),
        monthlySavingsRequired: formatIndianCurrency(monthlySavingsRequired),
        currentMonthlySavings: formatIndianCurrency(currentMonthlySavings),
        monthlyShortfall: monthlyShortfall <= 0 ? 'No Shortfall' : formatIndianCurrency(monthlyShortfall),
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'retirement-plan.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success('Report downloaded successfully!');
  };
  
  const handleShare = async () => {
    const shareData = {
      title: 'My Retirement Plan',
      text: `I need ${formatIndianCurrencyFull(retirementCorpusNeeded)} for retirement. Currently projected to reach ${formatIndianCurrencyFull(projectedCorpus)}.`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } else {
        await navigator.clipboard.writeText(shareData.text);
        toast.success('Summary copied to clipboard!');
      }
    } catch (err) {
      toast.error('Failed to share. Please try again.');
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card bg-gray-900">
        <h3 className="text-xl font-medium text-gray-100 mb-4">Retirement Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800 border border-gray-700">
              <div>
                <div className="text-sm text-gray-400">Years Till Retirement</div>
                <div className="text-lg font-medium text-gray-100">{formatYears(yearsTillRetirement)}</div>
              </div>
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary-900 text-primary-200">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800 border border-gray-700">
              <div>
                <div className="text-sm text-gray-400">Retirement Duration</div>
                <div className="text-lg font-medium text-gray-100">{formatYears(retirementDuration)}</div>
              </div>
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary-900 text-secondary-200">
                <TrendingDown className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800 border border-gray-700">
              <div>
                <div className="text-sm text-gray-400">Corpus Needed</div>
                <div className="text-lg font-medium text-gray-100">{formatIndianCurrency(retirementCorpusNeeded)}</div>
              </div>
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-accent-900 text-accent-200">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800 border border-gray-700">
              <div>
                <div className="text-sm text-gray-400">Projected Corpus</div>
                <div className={`text-lg font-medium ${isGoalMet ? 'text-success-400' : 'text-error-400'}`}>
                  {formatIndianCurrency(projectedCorpus)}
                </div>
              </div>
              <div className={`h-10 w-10 flex items-center justify-center rounded-full ${isGoalMet ? 'bg-success-900 text-success-200' : 'bg-error-900 text-error-200'}`}>
                {isGoalMet ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progress Towards Goal</span>
            <span className={`font-medium ${isGoalMet ? 'text-success-400' : 'text-gray-300'}`}>
              {Math.min(100, percentageAchieved.toFixed(1))}%
            </span>
          </div>
          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-2 ${isGoalMet ? 'bg-success-500' : 'bg-primary-500'}`}
              style={{ width: `${Math.min(100, percentageAchieved)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="card bg-gray-900">
        <h3 className="text-xl font-medium text-gray-100 mb-4">Monthly Savings Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-gray-800 border border-gray-700">
            <div className="text-sm text-gray-400">Required Monthly Saving</div>
            <div className="text-lg font-medium text-gray-100">{formatIndianCurrency(monthlySavingsRequired)}</div>
          </div>
          
          <div className="p-3 rounded-lg bg-gray-800 border border-gray-700">
            <div className="text-sm text-gray-400">Current Monthly Saving</div>
            <div className="text-lg font-medium text-gray-100">{formatIndianCurrency(currentMonthlySavings)}</div>
          </div>
          
          <div className="p-3 rounded-lg bg-gray-800 border border-gray-700">
            <div className="text-sm text-gray-400">Monthly Shortfall</div>
            <div className={`text-lg font-medium ${monthlyShortfall <= 0 ? 'text-success-400' : 'text-error-400'}`}>
              {monthlyShortfall <= 0 ? 'No Shortfall' : formatIndianCurrency(monthlyShortfall)}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button 
            className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200"
            onClick={() => setShowGuidance(!showGuidance)}
          >
            {showGuidance ? 'Hide Recommendations' : 'View Investment Recommendations'}
          </button>
          
          {showGuidance && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700 animate-slide-up">
              <h4 className="text-md font-medium text-gray-200 mb-2">Investment Guidance</h4>
              <ul className="space-y-2">
                {guidanceMessages.map((message, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="text-success-500 mt-1 mr-2">•</span>
                    <span className="text-gray-300">{message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          className="flex-1 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </button>
        
        {/* <button 
          className="flex-1 py-2 px-4 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Results
        </button> */}
      </div>
    </div>
  );
};

export default ResultsSummary;