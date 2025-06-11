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

export interface NetCashFlowData {
  year?: number;
  quarter?: string;
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  netCashFlow: number;
  cumulativeNetCashFlow?: number;
  freeCashFlow?: number;
  revenue?: number;
}

export interface NetCashFlowOverlayProps {
  data: NetCashFlowData[];
  viewMode: 'annual' | 'quarterly';
  showNetCashFlowLine?: boolean;
  showCumulativeLine?: boolean;
  showFreeCashFlowLine?: boolean;
  showZeroLine?: boolean;
  height?: number;
  className?: string;
}

/**
 * NetCashFlowOverlay Component
 * 
 * Displays stacked cash flow bars (OCF, ICF, FCF) with optional line overlays
 * for net cash flow, cumulative cash flow, and free cash flow trends
 * 
 * Features:
 * - Stacked bar chart for Operating, Investing, and Financing cash flows
 * - Net cash flow line overlay with dual y-axis
 * - Cumulative cash flow progression line
 * - Free cash flow trend line
 * - Zero reference line for breakeven analysis
 * - Support for annual and quarterly views
 */
export const NetCashFlowOverlay: React.FC<NetCashFlowOverlayProps> = ({
  data,
  viewMode,
  showNetCashFlowLine = true,
  showCumulativeLine = false,
  showFreeCashFlowLine = false,
  showZeroLine = true,
  height = 400,
  className,
}) => {
  // Chart margins
  const chartMargin = {
    top: 20,
    right: showNetCashFlowLine || showCumulativeLine || showFreeCashFlowLine ? 60 : 30,
    left: 80,
    bottom: 20,
  };

  // Custom tooltip formatter
  const formatTooltip = (value: number, name: string, props: any) => {
    const { dataKey } = props;
    
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
      cumulativeNetCashFlow: 'Cumulative Cash Flow',
      freeCashFlow: 'Free Cash Flow',
    };
    
    const displayName = displayNames[dataKey] || name;
    
    return [`${sign}${formattedValue}`, displayName];
  };

  // Custom label formatter for tooltip
  const formatLabel = (label: string | number) => {
    if (viewMode === 'annual') {
      return `Year ${label}`;
    }
    return label;
  };

  // Y-axis tick formatter
  const formatYAxisTick = (value: number) => {
    if (Math.abs(value) >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K Cr`;
    }
    return `₹${value} Cr`;
  };

  // Legend configuration
  const legendItems = useMemo(() => {
    const items: Array<{
      value: string;
      type: 'rect' | 'line';
      color: string;
    }> = [
      {
        value: 'Operating Cash Flow',
        type: 'rect',
        color: '#10b981',
      },
      {
        value: 'Investing Cash Flow',
        type: 'rect',
        color: '#ef4444',
      },
      {
        value: 'Financing Cash Flow',
        type: 'rect',
        color: '#f59e0b',
      },
    ];

    if (showNetCashFlowLine) {
      items.push({
        value: 'Net Cash Flow',
        type: 'line',
        color: '#3b82f6',
      });
    }

    if (showCumulativeLine) {
      items.push({
        value: 'Cumulative Cash Flow',
        type: 'line',
        color: '#8b5cf6',
      });
    }

    if (showFreeCashFlowLine) {
      items.push({
        value: 'Free Cash Flow',
        type: 'line',
        color: '#06b6d4',
      });
    }

    return items;
  }, [showNetCashFlowLine, showCumulativeLine, showFreeCashFlowLine]);

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
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
          
          {/* Primary Y-Axis for bars */}
          <YAxis
            yAxisId="primary"
            orientation="left"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
            tickFormatter={formatYAxisTick}
          />

          {/* Secondary Y-Axis for line overlays */}
          {(showNetCashFlowLine || showCumulativeLine || showFreeCashFlowLine) && (
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db' }}
              tickLine={{ stroke: '#d1d5db' }}
              tickFormatter={formatYAxisTick}
            />
          )}

          {/* Zero reference line */}
          {showZeroLine && (
            <ReferenceLine
              y={0}
              stroke="#9ca3af"
              strokeDasharray="5 5"
              strokeWidth={1}
            />
          )}

          {/* Stacked Cash Flow Bars */}
          <Bar
            dataKey="operatingCashFlow"
            stackId="cashflow"
            fill="#10b981"
            name="Operating Cash Flow"
            yAxisId="primary"
          />
          
          <Bar
            dataKey="investingCashFlow"
            stackId="cashflow"
            fill="#ef4444"
            name="Investing Cash Flow"
            yAxisId="primary"
          />
          
          <Bar
            dataKey="financingCashFlow"
            stackId="cashflow"
            fill="#f59e0b"
            name="Financing Cash Flow"
            yAxisId="primary"
          />

          {/* Net Cash Flow Line Overlay */}
          {showNetCashFlowLine && (
            <Line
              type="monotone"
              dataKey="netCashFlow"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              yAxisId="right"
              name="Net Cash Flow"
            />
          )}

          {/* Cumulative Cash Flow Line Overlay */}
          {showCumulativeLine && (
            <Line
              type="monotone"
              dataKey="cumulativeNetCashFlow"
              stroke="#8b5cf6"
              strokeWidth={3}
              strokeDasharray="8 4"
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
              yAxisId="right"
              name="Cumulative Cash Flow"
            />
          )}

          {/* Free Cash Flow Line Overlay */}
          {showFreeCashFlowLine && (
            <Line
              type="monotone"
              dataKey="freeCashFlow"
              stroke="#06b6d4"
              strokeWidth={3}
              strokeDasharray="12 6"
              dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#06b6d4', strokeWidth: 2 }}
              yAxisId="right"
              name="Free Cash Flow"
            />
          )}

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

          <Legend
            wrapperStyle={{
              paddingTop: '20px',
            }}
            iconType="rect"
            payload={legendItems}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NetCashFlowOverlay; 