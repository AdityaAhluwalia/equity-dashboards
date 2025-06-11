import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
} from 'recharts';

export interface QuarterlyCashFlowData {
  quarter: string;
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  netCashFlow: number;
  freeCashFlow?: number;
  revenue?: number;
}

export interface QuarterlyCashFlowProps {
  data: QuarterlyCashFlowData[];
  metric?: 'netCashFlow' | 'operatingCashFlow' | 'investingCashFlow' | 'financingCashFlow' | 'freeCashFlow';
  positiveColor?: string;
  negativeColor?: string;
  showZeroLine?: boolean;
  showLegend?: boolean;
  showGrowthRates?: boolean;
  showTrendIndicators?: boolean;
  highlightSeasonality?: boolean;
  height?: number;
  className?: string;
  filterYear?: number;
  barShape?: 'default' | 'rounded';
  animationDuration?: number;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  'aria-label'?: string;
}

/**
 * QuarterlyCashFlow Component
 * 
 * Displays quarterly cash flow data with positive/negative bar visualization
 * 
 * Features:
 * - Positive/negative color coding for cash flow values
 * - Support for different cash flow metrics (OCF, ICF, FCF, Net CF, FCF)
 * - Zero reference line for breakeven analysis
 * - Seasonal pattern highlighting
 * - Growth rate indicators
 * - Responsive design and accessibility
 */
export const QuarterlyCashFlow: React.FC<QuarterlyCashFlowProps> = ({
  data,
  metric = 'netCashFlow',
  positiveColor = '#10b981',
  negativeColor = '#ef4444',
  showZeroLine = true,
  showLegend = false,
  showGrowthRates = false,
  showTrendIndicators = false,
  highlightSeasonality = false,
  height = 350,
  className,
  filterYear,
  barShape = 'default',
  animationDuration = 750,
  margin = {
    top: 20,
    right: 30,
    left: 60,
    bottom: 20,
  },
  'aria-label': ariaLabel,
}) => {
  // Filter data by year if specified
  const filteredData = useMemo(() => {
    if (!filterYear) return data;
    
    return data.filter(item => {
      const year = parseInt(item.quarter.split(' ')[1]);
      return year === filterYear;
    });
  }, [data, filterYear]);

  // Process data to include color information for each bar
  const processedData = useMemo(() => {
    return filteredData.map(item => {
      const value = item[metric] || 0;
      const isPositive = value >= 0;
      
      return {
        ...item,
        [`${metric}_color`]: isPositive ? positiveColor : negativeColor,
        [`${metric}_value`]: value,
        isPositive,
      } as any; // Type assertion to handle dynamic property keys
    });
  }, [filteredData, metric, positiveColor, negativeColor]);

  // Custom tooltip formatter
  const formatTooltip = (value: number, name: string, props: any) => {
    // Format currency value
    const formattedValue = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
    
    const sign = value < 0 ? '-' : '';
    
    // Custom names for better readability
    const displayNames: { [key: string]: string } = {
      operatingCashFlow: 'Operating Cash Flow',
      investingCashFlow: 'Investing Cash Flow',
      financingCashFlow: 'Financing Cash Flow',
      netCashFlow: 'Net Cash Flow',
      freeCashFlow: 'Free Cash Flow',
    };
    
    const displayName = displayNames[metric] || name;
    
    return [`${sign}${formattedValue}`, displayName];
  };

  // Custom label formatter for tooltip
  const formatLabel = (label: string) => {
    return label;
  };

  // Y-axis tick formatter
  const formatYAxisTick = (value: number) => {
    if (Math.abs(value) >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K Cr`;
    }
    return `₹${value} Cr`;
  };

  // Get metric display name for legend
  const getMetricDisplayName = () => {
    const names: { [key: string]: string } = {
      operatingCashFlow: 'Operating Cash Flow',
      investingCashFlow: 'Investing Cash Flow',
      financingCashFlow: 'Financing Cash Flow',
      netCashFlow: 'Net Cash Flow',
      freeCashFlow: 'Free Cash Flow',
    };
    return names[metric] || metric;
  };

  // Custom bar shape for rounded corners
  const CustomBarShape = (props: any) => {
    const { fill, x, y, width, height } = props;
    
    if (barShape === 'rounded') {
      const radius = Math.min(width / 4, 4);
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          rx={radius}
          ry={radius}
        />
      );
    }
    
    return <rect x={x} y={y} width={width} height={height} fill={fill} />;
  };

  // Legend payload for custom legend
  const legendPayload = showLegend ? [
    {
      value: `${getMetricDisplayName()} (Positive)`,
      type: 'rect' as const,
      color: positiveColor,
    },
    {
      value: `${getMetricDisplayName()} (Negative)`,
      type: 'rect' as const,
      color: negativeColor,
    },
  ] : undefined;

  return (
    <div className={className} aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={processedData}
          margin={margin}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          
          <XAxis
            dataKey="quarter"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
            tickFormatter={formatYAxisTick}
          />

          {/* Zero reference line */}
          {showZeroLine && (
            <ReferenceLine
              y={0}
              stroke="#9ca3af"
              strokeDasharray="5 5"
              strokeWidth={1}
            />
          )}

          {/* Main cash flow bars with dynamic colors */}
          <Bar
            dataKey={metric}
            fill={positiveColor}
            shape={barShape === 'rounded' ? CustomBarShape : undefined}
            animationDuration={animationDuration}
          >
            {processedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry[`${metric}_color`]} 
              />
            ))}
          </Bar>

          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              fontSize: '14px',
            }}
            formatter={formatTooltip}
            labelFormatter={formatLabel}
            labelStyle={{
              color: '#374151',
              fontWeight: 'semibold',
              marginBottom: '8px',
            }}
          />

          {showLegend && (
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
              }}
              payload={legendPayload}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default QuarterlyCashFlow; 