'use client';

import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';

export interface CashBurnRateData {
  year: number;
  quarter?: string;
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  netCashFlow: number;
  cashPosition: number;
  burnRate: number; // Negative indicates cash consumption
  burnRateMA: number; // Moving average of burn rate
  cashRunwayMonths: number; // How many months cash will last
  operatingBurnRate: number;
  investingBurnRate: number;
  totalExpenses: number;
  revenue: number;
}

export interface CashBurnRateChartProps {
  data: CashBurnRateData[];
  viewMode: 'quarterly' | 'annual';
  showBurnRate?: boolean;
  showBurnRateMA?: boolean;
  showCashRunway?: boolean;
  showCashPosition?: boolean;
  showCashFlowAreas?: boolean;
  showZeroLine?: boolean;
  showCriticalThreshold?: boolean;
  criticalRunwayMonths?: number;
  height?: number;
  className?: string;
}

// Indian currency formatter
const formatCurrency = (value: number): string => {
  if (value === 0) return '₹0';
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 10000) {
    // Convert to Crores
    const crores = absValue / 100;
    return `${sign}₹${crores.toFixed(1)}Cr`;
  } else if (absValue >= 100) {
    // Convert to Lakhs
    const lakhs = absValue / 1;
    return `${sign}₹${lakhs.toFixed(1)}L`;
  } else {
    return `${sign}₹${absValue.toFixed(1)}`;
  }
};

// Months formatter
const formatMonths = (value: number): string => {
  if (value >= 999) return '∞ months';
  return `${value.toFixed(1)} months`;
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => {
          const { dataKey, value, color, name } = entry;
          let formattedValue = '';
          
          if (dataKey === 'cashRunwayMonths') {
            formattedValue = formatMonths(value);
          } else {
            formattedValue = formatCurrency(value);
          }
          
          return (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-gray-700">{name}: </span>
              <span className="font-medium text-gray-900">{formattedValue}</span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export const CashBurnRateChart: React.FC<CashBurnRateChartProps> = ({
  data,
  viewMode,
  showBurnRate = false,
  showBurnRateMA = false,
  showCashRunway = false,
  showCashPosition = false,
  showCashFlowAreas = false,
  showZeroLine = false,
  showCriticalThreshold = false,
  criticalRunwayMonths = 12,
  height = 400,
  className = '',
}) => {
  // Determine x-axis data key based on view mode
  const xAxisDataKey = viewMode === 'quarterly' ? 'quarter' : 'year';

  // Check if any runway metrics are enabled (requires right y-axis)
  const hasRunwayMetrics = showCashRunway;

  // Memoize processed data for performance
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map(item => ({
      ...item,
      // Ensure all numeric values are valid
      operatingCashFlow: Number(item.operatingCashFlow) || 0,
      investingCashFlow: Number(item.investingCashFlow) || 0,
      financingCashFlow: Number(item.financingCashFlow) || 0,
      netCashFlow: Number(item.netCashFlow) || 0,
      cashPosition: Number(item.cashPosition) || 0,
      burnRate: Number(item.burnRate) || 0,
      burnRateMA: Number(item.burnRateMA) || 0,
      cashRunwayMonths: Number(item.cashRunwayMonths) || 0,
    }));
  }, [data]);

  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={processedData}
          margin={{
            top: 20,
            right: hasRunwayMetrics ? 80 : 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          
          {/* X-Axis */}
          <XAxis
            dataKey={xAxisDataKey}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={{ stroke: '#d1d5db' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          
          {/* Primary Y-Axis (Left) - Cash Amounts */}
          <YAxis
            yAxisId="primary"
            orientation="left"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={{ stroke: '#d1d5db' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickFormatter={formatCurrency}
          />
          
          {/* Secondary Y-Axis (Right) - Runway Months */}
          {hasRunwayMetrics && (
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={{ stroke: '#d1d5db' }}
              axisLine={{ stroke: '#d1d5db' }}
              tickFormatter={formatMonths}
            />
          )}
          
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* Cash Flow Stacked Areas */}
          {showCashFlowAreas && (
            <>
              <Area
                yAxisId="primary"
                type="monotone"
                dataKey="operatingCashFlow"
                stackId="cashflow"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                name="Operating Cash Flow"
              />
              <Area
                yAxisId="primary"
                type="monotone"
                dataKey="investingCashFlow"
                stackId="cashflow"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.6}
                name="Investing Cash Flow"
              />
              <Area
                yAxisId="primary"
                type="monotone"
                dataKey="financingCashFlow"
                stackId="cashflow"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.6}
                name="Financing Cash Flow"
              />
            </>
          )}

          {/* Cash Position Bars */}
          {showCashPosition && (
            <Bar
              yAxisId="primary"
              dataKey="cashPosition"
              fill="#10b981"
              fillOpacity={0.3}
              name="Cash Position"
              radius={[2, 2, 0, 0]}
            />
          )}

          {/* Burn Rate Line */}
          {showBurnRate && (
            <Line
              yAxisId="primary"
              type="monotone"
              dataKey="burnRate"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2, fill: '#ffffff' }}
              name="Burn Rate"
            />
          )}

          {/* Burn Rate Moving Average */}
          {showBurnRateMA && (
            <Line
              yAxisId="primary"
              type="monotone"
              dataKey="burnRateMA"
              stroke="#f97316"
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={{ fill: '#f97316', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#f97316', strokeWidth: 2, fill: '#ffffff' }}
              name="Burn Rate MA"
            />
          )}

          {/* Cash Runway Line */}
          {showCashRunway && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cashRunwayMonths"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
              name="Cash Runway (Months)"
            />
          )}

          {/* Zero Reference Line */}
          {showZeroLine && (
            <ReferenceLine
              yAxisId="primary"
              y={0}
              stroke="#6b7280"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
          )}

          {/* Critical Runway Threshold */}
          {showCriticalThreshold && criticalRunwayMonths > 0 && (
            <ReferenceLine
              yAxisId="right"
              y={criticalRunwayMonths}
              stroke="#dc2626"
              strokeDasharray="8 8"
              strokeWidth={2}
              label={{
                value: `Critical: ${criticalRunwayMonths} months`,
                position: 'top',
                offset: 10,
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}; 