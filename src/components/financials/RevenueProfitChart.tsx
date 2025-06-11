'use client';

import React, { useMemo, useCallback } from 'react';
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
  ReferenceArea,
} from 'recharts';
import { PhaseType, getPhaseColors } from '@/lib/design-tokens';

export interface RevenueProfitData {
  period: string;
  periodIndex: number;
  revenue: number;
  netProfit: number;
  grossProfit?: number;
  operatingProfit?: number;
  phase: PhaseType;
  revenueGrowth?: number;
  profitGrowth?: number;
  profitMargin?: number;
}

export interface RevenueProfitChartProps {
  data: RevenueProfitData[];
  height?: number;
  showGrossProfit?: boolean;
  showOperatingProfit?: boolean;
  showGrowthRates?: boolean;
  showProfitMargin?: boolean;
  viewMode?: 'annual' | 'quarterly';
  loading?: boolean;
  error?: string | null;
  onPeriodClick?: (period: string, data: RevenueProfitData) => void;
  onPeriodHover?: (period: string | null, data: RevenueProfitData | null) => void;
  onRetry?: () => void;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  
  return (
    <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl p-4 shadow-lg max-w-sm">
      <h3 className="font-semibold text-gray-900 mb-3">{label}</h3>
      
      <div className="space-y-2">
        {/* Revenue */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span className="text-sm text-gray-600">Revenue:</span>
          </div>
          <span className="text-sm font-medium">₹{data.revenueInCrores?.toFixed(0)} Cr</span>
        </div>

        {/* Net Profit */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span className="text-sm text-gray-600">Net Profit:</span>
          </div>
          <span className="text-sm font-medium">₹{data.netProfitInCrores?.toFixed(0)} Cr</span>
        </div>

        {/* Gross Profit */}
        {data.grossProfitInCrores && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-400"></div>
              <span className="text-sm text-gray-600">Gross Profit:</span>
            </div>
            <span className="text-sm font-medium">₹{data.grossProfitInCrores?.toFixed(0)} Cr</span>
          </div>
        )}

        {/* Operating Profit */}
        {data.operatingProfitInCrores && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-teal-500"></div>
              <span className="text-sm text-gray-600">Operating Profit:</span>
            </div>
            <span className="text-sm font-medium">₹{data.operatingProfitInCrores?.toFixed(0)} Cr</span>
          </div>
        )}

        {/* Growth Rates */}
        {data.revenueGrowth !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Revenue Growth:</span>
            <span className={`text-sm font-medium ${data.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.revenueGrowth >= 0 ? '+' : ''}{data.revenueGrowth?.toFixed(1)}%
            </span>
          </div>
        )}

        {data.profitGrowth !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Profit Growth:</span>
            <span className={`text-sm font-medium ${data.profitGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.profitGrowth >= 0 ? '+' : ''}{data.profitGrowth?.toFixed(1)}%
            </span>
          </div>
        )}

        {/* Profit Margin */}
        {data.profitMargin !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Profit Margin:</span>
            <span className="text-sm font-medium">{data.profitMargin?.toFixed(1)}%</span>
          </div>
        )}

        {/* Phase */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-sm text-gray-600">Phase:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
            data.phase === 'expansion' ? 'bg-green-100 text-green-800' :
            data.phase === 'contraction' ? 'bg-red-100 text-red-800' :
            data.phase === 'stable' ? 'bg-gray-100 text-gray-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {data.phase}
          </span>
        </div>
      </div>
    </div>
  );
};

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" data-testid="skeleton-title"></div>
      <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" data-testid="skeleton-toggle"></div>
    </div>
    <div className="h-80 bg-gray-200 rounded-lg animate-pulse" data-testid="skeleton-chart"></div>
    <div className="flex justify-center gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-4 w-20 bg-gray-200 rounded animate-pulse" data-testid="skeleton-legend"></div>
      ))}
    </div>
  </div>
);

export const RevenueProfitChart: React.FC<RevenueProfitChartProps> = ({
  data,
  height = 400,
  showGrossProfit = true,
  showOperatingProfit = true,
  showGrowthRates = true,
  showProfitMargin = true,
  viewMode = 'annual',
  loading = false,
  error = null,
  onPeriodClick,
  onPeriodHover,
  onRetry,
}) => {
  // Process data for chart rendering
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      revenueInCrores: item.revenue / 10000000, // Convert to crores
      netProfitInCrores: item.netProfit / 10000000,
      grossProfitInCrores: item.grossProfit ? item.grossProfit / 10000000 : undefined,
      operatingProfitInCrores: item.operatingProfit ? item.operatingProfit / 10000000 : undefined,
    }));
  }, [data]);

  // Calculate phase bands for background coloring
  const phaseBands = useMemo(() => {
    if (!data || data.length === 0) return [];

    const bands: Array<{
      x1: number;
      x2: number;
      phase: PhaseType;
      color: string;
    }> = [];

    let currentPhase = data[0].phase;
    let startIndex = 0;

    for (let i = 1; i < data.length; i++) {
      if (data[i].phase !== currentPhase) {
        bands.push({
          x1: startIndex,
          x2: i - 1,
          phase: currentPhase,
          color: getPhaseColors(currentPhase).background,
        });
        currentPhase = data[i].phase;
        startIndex = i;
      }
    }

    // Add the last band
    bands.push({
      x1: startIndex,
      x2: data.length - 1,
      phase: currentPhase,
      color: getPhaseColors(currentPhase).background,
    });

    return bands;
  }, [data]);

  // Format functions
  const formatCurrency = useCallback((value: number) => `₹${value.toFixed(0)}Cr`, []);
  const formatPercentage = useCallback((value: number) => `${value.toFixed(1)}%`, []);

  // Event handlers
  const handleChartClick = useCallback((event: any) => {
    if (event && event.activeLabel && onPeriodClick) {
      const period = event.activeLabel;
      const periodData = data.find(d => d.period === period);
      if (periodData) {
        onPeriodClick(period, periodData);
      }
    }
  }, [data, onPeriodClick]);

  const handleChartHover = useCallback((event: any) => {
    if (onPeriodHover) {
      if (event && event.activeLabel) {
        const period = event.activeLabel;
        const periodData = data.find(d => d.period === period);
        onPeriodHover(period, periodData || null);
      } else {
        onPeriodHover(null, null);
      }
    }
  }, [data, onPeriodHover]);

  // Responsive margins
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const margins = {
    top: 20,
    right: showGrowthRates || showProfitMargin ? 60 : 30,
    left: isMobile ? 40 : 60,
    bottom: isMobile ? 40 : 20,
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">Loading revenue and profit data...</p>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No revenue and profit data available</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 transition-all duration-200 hover:shadow-xl"
      role="img"
      aria-label="Revenue and Profit Trends Chart"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Revenue & Profit Trends
          </h2>
          <p className="text-sm text-gray-600">
            {viewMode === 'annual' ? 'Annual View' : 'Quarterly View'} • 
            {data.length} periods • Dual-axis comparison
          </p>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={margins}
            onClick={handleChartClick}
            onMouseEnter={handleChartHover}
            onMouseLeave={() => handleChartHover(null)}
          >
            <defs>
              {/* Revenue gradient */}
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.3} />
              </linearGradient>
              
              {/* Net Profit gradient */}
              <linearGradient id="netProfitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.3} />
              </linearGradient>

              {/* Gross Profit gradient */}
              <linearGradient id="grossProfitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34D399" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#34D399" stopOpacity={0.3} />
              </linearGradient>

              {/* Operating Profit gradient */}
              <linearGradient id="operatingProfitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.3} />
              </linearGradient>
            </defs>

            {/* Phase background bands */}
            {phaseBands.map((band, index) => (
              <ReferenceArea
                key={`phase-${index}`}
                x1={band.x1}
                x2={band.x2}
                fill={band.color}
                fillOpacity={0.1}
                stroke="none"
              />
            ))}

            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
            
            <XAxis 
              dataKey="period"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? 'end' : 'middle'}
              height={isMobile ? 60 : 30}
            />
            
            {/* Primary Y-axis for amounts */}
            <YAxis 
              yAxisId="amount"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickFormatter={formatCurrency}
            />

            {/* Secondary Y-axis for percentages */}
            {(showGrowthRates || showProfitMargin) && (
              <YAxis 
                yAxisId="percentage"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickFormatter={formatPercentage}
              />
            )}

            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* Revenue bars */}
            <Bar 
              yAxisId="amount"
              dataKey="revenueInCrores"
              fill="url(#revenueGradient)"
              name="Revenue"
              radius={[2, 2, 0, 0]}
            />

            {/* Net Profit bars */}
            <Bar 
              yAxisId="amount"
              dataKey="netProfitInCrores"
              fill="url(#netProfitGradient)"
              name="Net Profit"
              radius={[2, 2, 0, 0]}
            />

            {/* Gross Profit bars */}
            {showGrossProfit && (
              <Bar 
                yAxisId="amount"
                dataKey="grossProfitInCrores"
                fill="url(#grossProfitGradient)"
                name="Gross Profit"
                radius={[2, 2, 0, 0]}
              />
            )}

            {/* Operating Profit bars */}
            {showOperatingProfit && (
              <Bar 
                yAxisId="amount"
                dataKey="operatingProfitInCrores"
                fill="url(#operatingProfitGradient)"
                name="Operating Profit"
                radius={[2, 2, 0, 0]}
              />
            )}

            {/* Growth rate lines */}
            {showGrowthRates && (
              <>
                <Line 
                  yAxisId="percentage"
                  type="monotone"
                  dataKey="revenueGrowth"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                  name="Revenue Growth"
                  connectNulls={false}
                />
                <Line 
                  yAxisId="percentage"
                  type="monotone"
                  dataKey="profitGrowth"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                  name="Profit Growth"
                  connectNulls={false}
                />
              </>
            )}

            {/* Profit margin line */}
            {showProfitMargin && (
              <Line 
                yAxisId="percentage"
                type="monotone"
                dataKey="profitMargin"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                name="Profit Margin"
                strokeDasharray="5 5"
                connectNulls={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 