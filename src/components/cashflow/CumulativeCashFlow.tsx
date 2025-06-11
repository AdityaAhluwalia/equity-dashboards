import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';

interface CumulativeCashFlowData {
  year: number;
  quarter?: string;
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  netCashFlow: number;
  cumulativeOperatingCF: number;
  cumulativeInvestingCF: number;
  cumulativeFinancingCF: number;
  cumulativeNetCF: number;
  periodEndingCash?: number;
  yearEndingCash?: number;
}

interface CumulativeCashFlowProps {
  data: CumulativeCashFlowData[];
  viewMode: 'quarterly' | 'annual';
  showCumulativeOperating?: boolean;
  showCumulativeInvesting?: boolean;
  showCumulativeFinancing?: boolean;
  showCumulativeNetLine?: boolean;
  showCashPosition?: boolean;
  showZeroLine?: boolean;
  height?: number;
  className?: string;
}

export const CumulativeCashFlow: React.FC<CumulativeCashFlowProps> = ({
  data,
  viewMode,
  showCumulativeOperating = false,
  showCumulativeInvesting = false,
  showCumulativeFinancing = false,
  showCumulativeNetLine = false,
  showCashPosition = false,
  showZeroLine = false,
  height = 400,
  className = '',
}) => {
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data;
  }, [data]);

  const formatCurrency = (value: number): string => {
    const absValue = Math.abs(value);
    const crores = absValue / 10000000;
    const sign = value < 0 ? '-' : '';
    
    if (crores >= 1000) {
      return `${sign}₹${(crores / 1000).toFixed(1)}k Cr`;
    } else if (crores >= 1) {
      return `${sign}₹${crores.toFixed(1)} Cr`;
    } else {
      return `${sign}₹${(absValue / 100000).toFixed(1)} L`;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">
            {viewMode === 'quarterly' ? label : `Year ${label}`}
          </p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const xAxisKey = viewMode === 'quarterly' ? 'quarter' : 'year';
  const cashPositionKey = viewMode === 'quarterly' ? 'periodEndingCash' : 'yearEndingCash';

  const hasLineOverlays = showCumulativeNetLine || showCashPosition;

  return (
    <div className={`cumulative-cash-flow ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={processedData}
          margin={{
            top: 20,
            right: hasLineOverlays ? 80 : 20,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#6b7280' }}
            axisLine={{ stroke: '#6b7280' }}
          />
          
          <YAxis
            orientation="left"
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#6b7280' }}
            axisLine={{ stroke: '#6b7280' }}
            tickFormatter={formatCurrency}
          />

          {hasLineOverlays && (
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#6b7280' }}
              axisLine={{ stroke: '#6b7280' }}
              tickFormatter={formatCurrency}
            />
          )}

          <Tooltip content={<CustomTooltip />} />
          
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="rect"
          />

          {showZeroLine && (
            <ReferenceLine
              y={0}
              stroke="#6b7280"
              strokeDasharray="2 2"
              strokeWidth={1}
            />
          )}

          {/* Cumulative Area Charts */}
          {showCumulativeOperating && (
            <Area
              type="monotone"
              dataKey="cumulativeOperatingCF"
              stackId="cumulative"
              fill="#10b981"
              fillOpacity={0.6}
              stroke="#059669"
              strokeWidth={2}
              name="Cumulative Operating CF"
            />
          )}

          {showCumulativeInvesting && (
            <Area
              type="monotone"
              dataKey="cumulativeInvestingCF"
              stackId="cumulative"
              fill="#ef4444"
              fillOpacity={0.6}
              stroke="#dc2626"
              strokeWidth={2}
              name="Cumulative Investing CF"
            />
          )}

          {showCumulativeFinancing && (
            <Area
              type="monotone"
              dataKey="cumulativeFinancingCF"
              stackId="cumulative"
              fill="#f59e0b"
              fillOpacity={0.6}
              stroke="#d97706"
              strokeWidth={2}
              name="Cumulative Financing CF"
            />
          )}

          {/* Line Overlays */}
          {showCumulativeNetLine && (
            <Line
              type="monotone"
              dataKey="cumulativeNetCF"
              yAxisId="right"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              name="Cumulative Net CF"
            />
          )}

          {showCashPosition && (
            <Line
              type="monotone"
              dataKey={cashPositionKey}
              yAxisId="right"
              stroke="#8b5cf6"
              strokeWidth={3}
              strokeDasharray="8 4"
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              name="Cash Position"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}; 