import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';

export interface CashFlowData {
  year?: number;
  quarter?: string;
  revenue?: number;
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  netCashFlow: number;
  freeCashFlow?: number;
  totalAssets?: number;
  fcfYield?: number;
}

export interface CashFlowChartProps {
  data: CashFlowData[];
  viewMode: 'annual' | 'quarterly';
  showFCFYield?: boolean;
  showZeroLine?: boolean;
  height?: number;
  className?: string;
}

/**
 * CashFlowChart Component
 * 
 * Displays cash flow patterns using stacked bars for OCF, ICF, FCF
 * with net cash flow line overlay and optional FCF yield calculations
 * 
 * Features:
 * - Stacked bar chart for cash flow components
 * - Net cash flow line overlay on secondary axis
 * - Free cash flow yield percentage overlay
 * - Zero reference line for easy interpretation
 * - Support for both annual and quarterly views
 */
export const CashFlowChart: React.FC<CashFlowChartProps> = ({
  data,
  viewMode,
  showFCFYield = false,
  showZeroLine = false,
  height = 400,
  className,
}) => {
  // Calculate FCF yield data when needed
  const processedData = useMemo(() => {
    return data.map(item => {
      const processed = { ...item };
      
      // Calculate FCF yield as percentage of revenue
      if (showFCFYield && item.freeCashFlow && item.revenue) {
        processed.fcfYield = (item.freeCashFlow / item.revenue) * 100;
      }
      
      return processed;
    });
  }, [data, showFCFYield]);

  // Custom tooltip formatter
  const formatTooltip = (value: number, name: string) => {
    if (name === 'fcfYield') {
      return [`${value.toFixed(1)}%`, 'FCF Yield'];
    }
    
    const formattedValue = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
    
    const sign = value < 0 ? '-' : '';
    
    switch (name) {
      case 'operatingCashFlow':
        return [`${sign}${formattedValue}`, 'Operating Cash Flow'];
      case 'investingCashFlow':
        return [`${sign}${formattedValue}`, 'Investing Cash Flow'];
      case 'financingCashFlow':
        return [`${sign}${formattedValue}`, 'Financing Cash Flow'];
      case 'netCashFlow':
        return [`${sign}${formattedValue}`, 'Net Cash Flow'];
      default:
        return [`${sign}${formattedValue}`, name];
    }
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

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={processedData}
          margin={chartMargin}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          
          <XAxis
            dataKey={viewMode === 'annual' ? 'year' : 'quarter'}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
          />
          
          {/* Left Y-axis for cash flows */}
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
          
          {/* Right Y-axis for net cash flow and FCF yield */}
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
            tickFormatter={(value) => {
              if (showFCFYield && Math.abs(value) < 50) {
                return `${value.toFixed(1)}%`;
              }
              if (Math.abs(value) >= 1000) {
                return `₹${(value / 1000).toFixed(1)}K Cr`;
              }
              return `₹${value} Cr`;
            }}
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

          {/* Stacked bars for cash flow components */}
          <Bar
            dataKey="operatingCashFlow"
            stackId="cashflow"
            fill="#10b981"
            name="Operating Cash Flow"
            radius={[0, 0, 0, 0]}
          />
          
          <Bar
            dataKey="investingCashFlow"
            stackId="cashflow"
            fill="#ef4444"
            name="Investing Cash Flow"
            radius={[0, 0, 0, 0]}
          />
          
          <Bar
            dataKey="financingCashFlow"
            stackId="cashflow"
            fill="#f59e0b"
            name="Financing Cash Flow"
            radius={[0, 0, 0, 0]}
          />

          {/* Net cash flow line overlay */}
          <Line
            type="monotone"
            dataKey="netCashFlow"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            name="Net Cash Flow"
            yAxisId="right"
          />

          {/* FCF yield line (when enabled) */}
          {showFCFYield && (
            <Line
              type="monotone"
              dataKey="fcfYield"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
              strokeDasharray="5 5"
              name="FCF Yield %"
              yAxisId="right"
            />
          )}

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
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CashFlowChart; 