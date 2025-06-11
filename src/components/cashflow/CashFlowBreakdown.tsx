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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export interface CashFlowBreakdownData {
  year?: number;
  quarter?: string;
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  netCashFlow: number;
  
  // OCF Breakdown Components
  netIncome?: number;
  depreciation?: number;
  workingCapitalChange?: number;
  
  // ICF Breakdown Components
  capex?: number;
  acquisitions?: number;
  assetDisposals?: number;
  investments?: number;
  
  // FCF Breakdown Components
  debtIssuance?: number;
  debtRepayment?: number;
  dividendPayments?: number;
  shareRepurchases?: number;
}

export interface CashFlowBreakdownProps {
  data: CashFlowBreakdownData[];
  viewMode: 'annual' | 'quarterly';
  breakdownType?: 'OCF' | 'ICF' | 'FCF' | 'ALL';
  showPercentages?: boolean;
  showAnalysis?: boolean;
  showTrends?: boolean;
  showDetailedBreakdown?: boolean;
  height?: number;
  className?: string;
  onComponentClick?: (component: string, data: any) => void;
}

/**
 * CashFlowBreakdown Component
 * 
 * Displays detailed breakdown of cash flow components (OCF, ICF, FCF)
 * with individual component analysis and trend visualization
 * 
 * Features:
 * - Detailed breakdown of Operating, Investing, and Financing cash flows
 * - Individual component bar charts with appropriate colors
 * - Percentage breakdown with pie charts
 * - Component analysis and trend indicators
 * - Support for annual and quarterly views
 */
export const CashFlowBreakdown: React.FC<CashFlowBreakdownProps> = ({
  data,
  viewMode,
  breakdownType = 'OCF',
  showPercentages = false,
  showAnalysis = false,
  showTrends = false,
  showDetailedBreakdown = false,
  height = 400,
  className,
  onComponentClick,
}) => {
  // OCF Component Configuration
  const ocfComponents = useMemo(() => [
    { key: 'netIncome', label: 'Net Income', color: '#10b981' },
    { key: 'depreciation', label: 'Depreciation', color: '#34d399' },
    { key: 'workingCapitalChange', label: 'Working Capital Change', color: '#6ee7b7' },
  ], []);

  // ICF Component Configuration
  const icfComponents = useMemo(() => [
    { key: 'capex', label: 'Capital Expenditure', color: '#ef4444' },
    { key: 'acquisitions', label: 'Acquisitions', color: '#f87171' },
    { key: 'assetDisposals', label: 'Asset Disposals', color: '#10b981' },
    { key: 'investments', label: 'Investments', color: '#fca5a5' },
  ], []);

  // FCF Component Configuration
  const fcfComponents = useMemo(() => [
    { key: 'debtIssuance', label: 'Debt Issuance', color: '#f59e0b' },
    { key: 'debtRepayment', label: 'Debt Repayment', color: '#fbbf24' },
    { key: 'dividendPayments', label: 'Dividend Payments', color: '#fcd34d' },
    { key: 'shareRepurchases', label: 'Share Repurchases', color: '#fde68a' },
  ], []);

  // Calculate percentage breakdown for pie charts
  const calculatePercentages = (dataPoint: CashFlowBreakdownData, components: any[]) => {
    const total = Math.abs(components.reduce((sum, comp) => {
      const value = dataPoint[comp.key as keyof CashFlowBreakdownData] as number || 0;
      return sum + Math.abs(value);
    }, 0));

    return components.map(comp => {
      const value = Math.abs(dataPoint[comp.key as keyof CashFlowBreakdownData] as number || 0);
      return {
        name: comp.label,
        value: total > 0 ? (value / total) * 100 : 0,
        fill: comp.color,
        absoluteValue: dataPoint[comp.key as keyof CashFlowBreakdownData] as number || 0,
      };
    });
  };

  // Custom tooltip formatter
  const formatTooltip = (value: number, name: string) => {
    const formattedValue = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
    
    const sign = value < 0 ? '-' : '';
    return [`${sign}${formattedValue}`, name];
  };

  // Custom label formatter for tooltip
  const formatLabel = (label: string | number) => {
    if (viewMode === 'annual') {
      return `Year ${label}`;
    }
    return label;
  };

  // Chart margins
  const chartMargin = {
    top: 20,
    right: 30,
    left: 80,
    bottom: 20,
  };

  // Render individual breakdown section
  const renderBreakdownSection = (
    title: string,
    components: any[],
    sectionKey: string
  ) => (
    <div key={sectionKey} className="mb-8">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      <div className={showPercentages ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : ''}>
        {/* Bar Chart */}
        <div>
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={data}
              margin={chartMargin}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              
              <XAxis
                dataKey={viewMode === 'annual' ? 'year' : 'quarter'}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#d1d5db' }}
                tickLine={{ stroke: '#d1d5db' }}
              />
              
              <YAxis
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#d1d5db' }}
                tickLine={{ stroke: '#d1d5db' }}
                tickFormatter={(value) => {
                  if (Math.abs(value) >= 1000) {
                    return `₹${(value / 1000).toFixed(1)}K Cr`;
                  }
                  return `₹${value} Cr`;
                }}
              />

              {components.map(component => (
                <Bar
                  key={component.key}
                  dataKey={component.key}
                  fill={component.color}
                  name={component.label}
                  onClick={onComponentClick ? (data) => onComponentClick(component.key, data) : undefined}
                />
              ))}

              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={formatTooltip}
                labelFormatter={formatLabel}
              />

              <Legend
                wrapperStyle={{
                  paddingTop: '20px',
                }}
                iconType="rect"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart for Percentages */}
        {showPercentages && data.length > 0 && (
          <div>
            <h4 className="text-md font-medium mb-2">Component Breakdown (%)</h4>
            <ResponsiveContainer width="100%" height={height}>
              <PieChart>
                <Pie
                  data={calculatePercentages(data[data.length - 1], components)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {calculatePercentages(data[data.length - 1], components).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string, props: any) => [
                    `${value.toFixed(1)}% (₹${Math.abs(props.payload.absoluteValue)} Cr)`,
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Component Analysis */}
      {showAnalysis && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Component Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {components.map(component => {
              const latestValue = data[data.length - 1]?.[component.key as keyof CashFlowBreakdownData] as number || 0;
              const previousValue = data[data.length - 2]?.[component.key as keyof CashFlowBreakdownData] as number || 0;
              const change = latestValue - previousValue;
              const changePercent = previousValue !== 0 ? (change / Math.abs(previousValue)) * 100 : 0;
              
              return (
                <div key={component.key} className="flex items-center justify-between">
                  <span className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded mr-2" 
                      style={{ backgroundColor: component.color }}
                    />
                    {component.label}
                  </span>
                  <span className={`text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {change >= 0 ? '↗' : '↘'} {Math.abs(changePercent).toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Trend Indicators */}
      {showTrends && data.length > 1 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-2">Trends</h4>
          <div className="text-sm text-gray-600">
            <p>Component trend analysis over {data.length} periods</p>
          </div>
        </div>
      )}

      {/* Detailed Breakdown */}
      {showDetailedBreakdown && (
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-medium mb-2">Detailed Breakdown</h4>
          <div className="text-sm text-gray-600">
            <p>Comprehensive component analysis and sub-breakdowns</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={className}>
      {/* OCF Breakdown */}
      {(breakdownType === 'OCF' || breakdownType === 'ALL') && 
        renderBreakdownSection(
          'Operating Cash Flow Breakdown',
          ocfComponents,
          'ocf'
        )
      }

      {/* ICF Breakdown */}
      {(breakdownType === 'ICF' || breakdownType === 'ALL') && 
        renderBreakdownSection(
          'Investing Cash Flow Breakdown',
          icfComponents,
          'icf'
        )
      }

      {/* FCF Breakdown */}
      {(breakdownType === 'FCF' || breakdownType === 'ALL') && 
        renderBreakdownSection(
          'Financing Cash Flow Breakdown',
          fcfComponents,
          'fcf'
        )
      }
    </div>
  );
};

export default CashFlowBreakdown; 