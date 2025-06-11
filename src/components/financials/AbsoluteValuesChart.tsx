'use client';

import React, { useMemo, useCallback } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
  Cell,
} from 'recharts';
import { PhaseType, getPhaseColors } from '@/lib/design-tokens';

export interface AbsoluteValuesData {
  period: string;
  periodIndex: number;
  revenue: number;
  netProfit: number;
  grossProfit?: number;
  operatingProfit?: number;
  ebitda?: number;
  totalExpenses?: number;
  phase: PhaseType;
}

export interface AbsoluteValuesChartProps {
  data: AbsoluteValuesData[];
  height?: number;
  showGrossProfit?: boolean;
  showOperatingProfit?: boolean;
  showEbitda?: boolean;
  showTotalExpenses?: boolean;
  viewMode?: 'annual' | 'quarterly';
  chartType?: 'grouped' | 'stacked' | 'waterfall';
  loading?: boolean;
  error?: string | null;
  onPeriodClick?: (period: string, data: AbsoluteValuesData) => void;
  onPeriodHover?: (period: string | null, data: AbsoluteValuesData | null) => void;
  onRetry?: () => void;
}

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
    <div className="space-y-3">
      <div className="grid grid-cols-8 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-24 bg-gray-200 rounded" data-testid="skeleton-bar"></div>
            <div className="h-3 bg-gray-200 rounded" data-testid="skeleton-label"></div>
          </div>
        ))}
      </div>
    </div>
    <div className="flex justify-center space-x-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded w-20" data-testid="skeleton-legend"></div>
      ))}
    </div>
  </div>
);

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

        {/* EBITDA */}
        {data.ebitdaInCrores && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-500"></div>
              <span className="text-sm text-gray-600">EBITDA:</span>
            </div>
            <span className="text-sm font-medium">₹{data.ebitdaInCrores?.toFixed(0)} Cr</span>
          </div>
        )}

        {/* Total Expenses */}
        {data.totalExpensesInCrores && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span className="text-sm text-gray-600">Total Expenses:</span>
            </div>
            <span className="text-sm font-medium">₹{data.totalExpensesInCrores?.toFixed(0)} Cr</span>
          </div>
        )}

        {/* Phase */}
        <div className="pt-2 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Business Phase:</span>
            <span className={`text-sm font-medium px-2 py-1 rounded ${
              data.phase === 'expansion' ? 'bg-green-100 text-green-800' :
              data.phase === 'contraction' ? 'bg-red-100 text-red-800' :
              data.phase === 'transition' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {data.phase.charAt(0).toUpperCase() + data.phase.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AbsoluteValuesChart: React.FC<AbsoluteValuesChartProps> = ({
  data,
  height = 400,
  showGrossProfit = true,
  showOperatingProfit = true,
  showEbitda = true,
  showTotalExpenses = false,
  viewMode = 'annual',
  chartType = 'grouped',
  loading = false,
  error = null,
  onPeriodClick,
  onPeriodHover,
  onRetry,
}) => {
  // Process data for chart rendering
  const chartData = useMemo(() => {
    let processedData = data.map(item => ({
      ...item,
      revenueInCrores: item.revenue / 10000000, // Convert to crores
      netProfitInCrores: item.netProfit / 10000000,
      grossProfitInCrores: item.grossProfit ? item.grossProfit / 10000000 : undefined,
      operatingProfitInCrores: item.operatingProfit ? item.operatingProfit / 10000000 : undefined,
      ebitdaInCrores: item.ebitda ? item.ebitda / 10000000 : undefined,
      totalExpensesInCrores: item.totalExpenses ? item.totalExpenses / 10000000 : undefined,
    }));

    // For waterfall chart, calculate cumulative values
    if (chartType === 'waterfall') {
      let cumulative = 0;
      processedData = processedData.map((item, index) => {
        const value = item.netProfitInCrores;
        const start = cumulative;
        cumulative += value;
        return {
          ...item,
          waterfallStart: start,
          waterfallEnd: cumulative,
          waterfallValue: value,
        };
      });
    }

    return processedData;
  }, [data, chartType]);

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
    right: 30,
    left: isMobile ? 40 : 60,
    bottom: isMobile ? 60 : 40,
  };

  // Get chart type label
  const getChartTypeLabel = () => {
    switch (chartType) {
      case 'stacked': return 'Stacked View';
      case 'waterfall': return 'Waterfall View';
      default: return 'Grouped View';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">Loading absolute values data...</p>
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
          <p className="text-gray-500 mb-4">No absolute values data available</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 transition-all duration-200 hover:shadow-xl"
      role="img"
      aria-label="Absolute Values Chart"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Absolute Values Analysis
          </h2>
          <p className="text-sm text-gray-600">
            {viewMode === 'annual' ? 'Annual View' : 'Quarterly View'} • 
            {getChartTypeLabel()} • {data.length} periods
          </p>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={margins}
            onClick={handleChartClick}
            onMouseEnter={handleChartHover}
            onMouseLeave={() => handleChartHover(null)}
          >
            <defs>
              {/* Revenue gradient */}
              <linearGradient id="revenueGradientAbs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.3} />
              </linearGradient>
              
              {/* Net Profit gradient */}
              <linearGradient id="netProfitGradientAbs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.3} />
              </linearGradient>

              {/* Gross Profit gradient */}
              <linearGradient id="grossProfitGradientAbs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34D399" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#34D399" stopOpacity={0.3} />
              </linearGradient>

              {/* Operating Profit gradient */}
              <linearGradient id="operatingProfitGradientAbs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.3} />
              </linearGradient>

              {/* EBITDA gradient */}
              <linearGradient id="ebitdaGradientAbs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.3} />
              </linearGradient>

              {/* Total Expenses gradient */}
              <linearGradient id="totalExpensesGradientAbs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.3} />
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
              height={isMobile ? 80 : 40}
            />
            
            {/* Y-axis for amounts */}
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickFormatter={formatCurrency}
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* Revenue bars */}
            <Bar 
              dataKey="revenueInCrores"
              fill="url(#revenueGradientAbs)"
              name="Revenue"
              radius={[2, 2, 0, 0]}
              stackId={chartType === 'stacked' ? undefined : undefined} // Revenue never stacked
            />

            {/* Net Profit bars */}
            <Bar 
              dataKey="netProfitInCrores"
              fill="url(#netProfitGradientAbs)"
              name="Net Profit"
              radius={[2, 2, 0, 0]}
              stackId={chartType === 'stacked' ? 'profits' : undefined}
            />

            {/* Gross Profit bars */}
            {showGrossProfit && (
              <Bar 
                dataKey="grossProfitInCrores"
                fill="url(#grossProfitGradientAbs)"
                name="Gross Profit"
                radius={[2, 2, 0, 0]}
                stackId={chartType === 'stacked' ? 'profits' : undefined}
              />
            )}

            {/* Operating Profit bars */}
            {showOperatingProfit && (
              <Bar 
                dataKey="operatingProfitInCrores"
                fill="url(#operatingProfitGradientAbs)"
                name="Operating Profit"
                radius={[2, 2, 0, 0]}
                stackId={chartType === 'stacked' ? 'profits' : undefined}
              />
            )}

            {/* EBITDA bars */}
            {showEbitda && (
              <Bar 
                dataKey="ebitdaInCrores"
                fill="url(#ebitdaGradientAbs)"
                name="EBITDA"
                radius={[2, 2, 0, 0]}
                stackId={chartType === 'stacked' ? 'profits' : undefined}
              />
            )}

            {/* Total Expenses bars */}
            {showTotalExpenses && (
              <Bar 
                dataKey="totalExpensesInCrores"
                fill="url(#totalExpensesGradientAbs)"
                name="Total Expenses"
                radius={[2, 2, 0, 0]}
                stackId={chartType === 'stacked' ? 'expenses' : undefined}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart type specific notes */}
      <div className="mt-4 text-xs text-gray-500">
        {chartType === 'grouped' && (
          <p>• Bars are grouped side-by-side for easy comparison of absolute values</p>
        )}
        {chartType === 'stacked' && (
          <p>• Revenue shown separately, profits stacked to show composition</p>
        )}
        {chartType === 'waterfall' && (
          <p>• Shows cumulative progression of values across periods</p>
        )}
      </div>
    </div>
  );
}; 