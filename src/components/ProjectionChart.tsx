import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

import { Bar } from 'react-chartjs-2';
import { CHART_COLORS } from '../utils/constants';
import { formatIndianCurrencyFull } from '../utils/formatters';
import type { YearlyProjection } from '../utils/calculations';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend,
  Filler
);

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

interface ProjectionChartProps {
  projections: YearlyProjection[];
  isLoading?: boolean;
}

const ProjectionChart: React.FC<ProjectionChartProps> = ({ projections, isLoading = false }) => {
  const labels = projections.map(item => item.age);


  const isGoalMet = projections.length > 0 &&
    projections[projections.length - 1].savings >= projections[projections.length - 1].goal;

  const chartData = {
    labels,
    datasets: [
      {
        type: 'bar' as const,
        label: 'Projected Savings',
        data: projections.map(item => item.savings),
        backgroundColor: CHART_COLORS.savings,
        borderColor: CHART_COLORS.savingsLine,
        borderWidth: 1,
      },
      {
        type: 'line' as const,
        label: 'Retirement Goal',
        data: projections.map(item => item.goal),
        borderColor: CHART_COLORS.goalLine,
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Age',
          color: '#9ca3af',
        },
        grid: {
          color: 'rgba(31, 41, 55, 0.5)',
        },
        ticks: {
          color: '#9ca3af',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount (₹)',
          color: '#9ca3af',
        },
        grid: {
          color: 'rgba(31, 41, 55, 0.5)',
        },
        ticks: {
          callback: function (value: number) {
            return formatIndianCurrencyFull(value).replace('₹', '₹ ');
          },
          color: '#9ca3af',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e5e7eb',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatIndianCurrencyFull(context.parsed.y);
            }
            return label;
          },
          title: function (tooltipItems: any) {
            return `Age: ${tooltipItems[0].label}`;
          },
        },
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#f9fafb',
        bodyColor: '#f3f4f6',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
  };


  if (isLoading || projections.length === 0) {
    return (
      <div className="card bg-gray-900 h-80 animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading chart data...</div>
      </div>
    );
  }

  return (
    <div className="card bg-gray-900">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-gray-100">Retirement Savings Projection</h3>
        <div className={`text-sm font-medium px-3 py-1 rounded-full ${isGoalMet ? 'bg-success-900 text-success-200' : 'bg-warning-900 text-warning-200'}`}>
          {isGoalMet ? 'Goal Will Be Met' : 'Shortfall Projected'}
        </div>
      </div>

      <div className="h-80">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className="mt-4 text-sm text-gray-400">
        <p>
          The chart shows your projected retirement savings growth based on your current inputs.
          The horizontal line represents your retirement goal.
        </p>
      </div>
    </div>
  );
};

export default ProjectionChart;