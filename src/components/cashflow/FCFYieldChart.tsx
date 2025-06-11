'use client';

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

export interface FCFYieldData {
  year: number;
  quarter?: string;
  freeCashFlow: number;
  marketCap: number;
  enterpriseValue: number;
  fcfYieldMarketCap: number; // Percentage
  fcfYieldEV: number; // Percentage
  totalAssets: number;
  revenue: number;
  fcfMargin: number; // Percentage
  assetTurnover: number;
}

export interface FCFYieldChartProps {
  data: FCFYieldData[];
  viewMode: 'quarterly' | 'annual';
  showFreeCashFlowBars?: boolean;
  showFCFYieldMarketCap?: boolean;
  showFCFYieldEV?: boolean;
  showFCFMargin?: boolean;
  showIndustryAverage?: boolean;
  industryAverageFCFYield?: number;
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

// Percentage formatter
const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => {
          const { dataKey, value, color, name } = entry;
          const isPercentage = ['fcfYieldMarketCap', 'fcfYieldEV', 'fcfMargin'].includes(dataKey);
          const formattedValue = isPercentage ? formatPercentage(value) : formatCurrency(value);
          
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

export const FCFYieldChart: React.FC<FCFYieldChartProps> = ({
  data,
  viewMode,
  showFreeCashFlowBars = false,
  showFCFYieldMarketCap = false,
  showFCFYieldEV = false,
  showFCFMargin = false,
  showIndustryAverage = false,
  industryAverageFCFYield = 0,
  height = 400,
  className = '',
}) => {
  // Determine x-axis data key based on view mode
  const xAxisDataKey = viewMode === 'quarterly' ? 'quarter' : 'year';

  // Check if any percentage metrics are enabled (requires right y-axis)
  const hasPercentageMetrics = showFCFYieldMarketCap || showFCFYieldEV || showFCFMargin;

  // Memoize processed data for performance
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map(item => ({
      ...item,
      // Ensure all numeric values are valid
      freeCashFlow: Number(item.freeCashFlow) || 0,
      fcfYieldMarketCap: Number(item.fcfYieldMarketCap) || 0,
      fcfYieldEV: Number(item.fcfYieldEV) || 0,
      fcfMargin: Number(item.fcfMargin) || 0,
    }));
  }, [data]);

  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={processedData}
          margin={{
            top: 20,
            right: hasPercentageMetrics ? 80 : 20,
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
          
          {/* Primary Y-Axis (Left) - Cash Flow Amounts */}
          <YAxis
            yAxisId="primary"
            orientation="left"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={{ stroke: '#d1d5db' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickFormatter={formatCurrency}
          />
          
          {/* Secondary Y-Axis (Right) - Percentages */}
          {hasPercentageMetrics && (
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={{ stroke: '#d1d5db' }}
              axisLine={{ stroke: '#d1d5db' }}
              tickFormatter={formatPercentage}
            />
          )}
          
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* Free Cash Flow Bars */}
          {showFreeCashFlowBars && (
            <Bar
              yAxisId="primary"
              dataKey="freeCashFlow"
              fill="#10b981"
              fillOpacity={0.8}
              name="Free Cash Flow"
              radius={[2, 2, 0, 0]}
            />
          )}

          {/* FCF Yield (Market Cap) Line */}
          {showFCFYieldMarketCap && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="fcfYieldMarketCap"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
              name="FCF Yield (Market Cap)"
            />
          )}

          {/* FCF Yield (Enterprise Value) Line */}
          {showFCFYieldEV && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="fcfYieldEV"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2, fill: '#ffffff' }}
              name="FCF Yield (EV)"
            />
          )}

          {/* FCF Margin Line */}
          {showFCFMargin && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="fcfMargin"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#f59e0b', strokeWidth: 2, fill: '#ffffff' }}
              name="FCF Margin"
            />
          )}

          {/* Industry Average Reference Line */}
          {showIndustryAverage && industryAverageFCFYield > 0 && (
            <ReferenceLine
              yAxisId="right"
              y={industryAverageFCFYield}
              stroke="#ef4444"
              strokeDasharray="8 8"
              strokeWidth={2}
              label={{
                value: `Industry Avg: ${formatPercentage(industryAverageFCFYield)}`,
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