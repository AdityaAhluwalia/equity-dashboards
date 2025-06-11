'use client';

import React, { useMemo, useCallback } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  AreaChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';
import { PhaseType, getPhaseColors } from '@/lib/design-tokens';

export interface GrowthRateData {
  period: string;
  periodIndex: number;
  revenueGrowth?: number;
  profitGrowth?: number;
  revenueCAGR?: number;
  profitCAGR?: number;
  quarterlyGrowth?: number;
  yearOverYearGrowth?: number;
  phase: PhaseType;
  profitMargin?: number;
  revenueVolatility?: number;
  profitVolatility?: number;
}

export interface GrowthRateOverlayProps {
  data: GrowthRateData[];
  height?: number;
  showRevenueGrowth?: boolean;
  showProfitGrowth?: boolean;
  showCAGR?: boolean;
  showVolatility?: boolean;
  showTrendLines?: boolean;
  showStatistics?: boolean;
  showAcceleration?: boolean;
  showMomentum?: boolean;
  showSeasonality?: boolean;
  showYearOverYear?: boolean;
  overlayType?: 'lines' | 'areas' | 'bands';
  viewMode?: 'annual' | 'quarterly';
  loading?: boolean;
  error?: string | null;
  onPeriodClick?: (period: string, data: GrowthRateData) => void;
  onPeriodHover?: (period: string | null, data: GrowthRateData | null) => void;
  onRetry?: () => void;
}

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
    <div className="space-y-3">
      <div className="grid grid-cols-12 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-20 bg-gray-200 rounded" data-testid="skeleton-line"></div>
            <div className="h-3 bg-gray-200 rounded" data-testid="skeleton-label"></div>
          </div>
        ))}
      </div>
    </div>
    <div className="flex justify-center space-x-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded w-24" data-testid="skeleton-legend"></div>
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
        {/* Revenue Growth */}
        {data.revenueGrowth !== undefined && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-orange-500"></div>
              <span className="text-sm text-gray-600">Revenue Growth:</span>
            </div>
            <span className={`text-sm font-medium ${data.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.revenueGrowth >= 0 ? '+' : ''}{data.revenueGrowth?.toFixed(1)}%
            </span>
          </div>
        )}

        {/* Profit Growth */}
        {data.profitGrowth !== undefined && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span className="text-sm text-gray-600">Profit Growth:</span>
            </div>
            <span className={`text-sm font-medium ${data.profitGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.profitGrowth >= 0 ? '+' : ''}{data.profitGrowth?.toFixed(1)}%
            </span>
          </div>
        )}

        {/* CAGR Values */}
        {data.revenueCAGR !== undefined && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500 border-2 border-blue-700"></div>
              <span className="text-sm text-gray-600">Revenue CAGR:</span>
            </div>
            <span className="text-sm font-medium text-blue-700">{data.revenueCAGR?.toFixed(1)}%</span>
          </div>
        )}

        {data.profitCAGR !== undefined && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500 border-2 border-green-700"></div>
              <span className="text-sm text-gray-600">Profit CAGR:</span>
            </div>
            <span className="text-sm font-medium text-green-700">{data.profitCAGR?.toFixed(1)}%</span>
          </div>
        )}

        {/* Quarterly Metrics */}
        {data.quarterlyGrowth !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Quarterly Growth:</span>
            <span className={`text-sm font-medium ${data.quarterlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.quarterlyGrowth >= 0 ? '+' : ''}{data.quarterlyGrowth?.toFixed(1)}%
            </span>
          </div>
        )}

        {data.yearOverYearGrowth !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">YoY Growth:</span>
            <span className={`text-sm font-medium ${data.yearOverYearGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.yearOverYearGrowth >= 0 ? '+' : ''}{data.yearOverYearGrowth?.toFixed(1)}%
            </span>
          </div>
        )}

        {/* Volatility */}
        {data.revenueVolatility !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Revenue Volatility:</span>
            <span className="text-sm font-medium text-purple-600">{(data.revenueVolatility * 100)?.toFixed(1)}%</span>
          </div>
        )}

        {data.profitVolatility !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Profit Volatility:</span>
            <span className="text-sm font-medium text-purple-600">{(data.profitVolatility * 100)?.toFixed(1)}%</span>
          </div>
        )}

        {/* Profit Margin */}
        {data.profitMargin !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Profit Margin:</span>
            <span className="text-sm font-medium text-indigo-600">{data.profitMargin?.toFixed(1)}%</span>
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

export const GrowthRateOverlay: React.FC<GrowthRateOverlayProps> = ({
  data,
  height = 400,
  showRevenueGrowth = true,
  showProfitGrowth = true,
  showCAGR = false,
  showVolatility = false,
  showTrendLines = true,
  showStatistics = false,
  showAcceleration = false,
  showMomentum = false,
  showSeasonality = false,
  showYearOverYear = false,
  overlayType = 'lines',
  viewMode = 'annual',
  loading = false,
  error = null,
  onPeriodClick,
  onPeriodHover,
  onRetry,
}) => {
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

  // Calculate growth statistics
  const growthStats = useMemo(() => {
    if (!data || data.length === 0) return null;

    const revenueGrowths = data.filter(d => d.revenueGrowth !== undefined).map(d => d.revenueGrowth!);
    const profitGrowths = data.filter(d => d.profitGrowth !== undefined).map(d => d.profitGrowth!);

    const avgRevenueGrowth = revenueGrowths.length > 0 ? 
      revenueGrowths.reduce((sum, val) => sum + val, 0) / revenueGrowths.length : 0;
    
    const avgProfitGrowth = profitGrowths.length > 0 ? 
      profitGrowths.reduce((sum, val) => sum + val, 0) / profitGrowths.length : 0;

    const maxRevenueGrowth = revenueGrowths.length > 0 ? Math.max(...revenueGrowths) : 0;
    const minRevenueGrowth = revenueGrowths.length > 0 ? Math.min(...revenueGrowths) : 0;

    return {
      avgRevenueGrowth: Number(avgRevenueGrowth.toFixed(1)),
      avgProfitGrowth: Number(avgProfitGrowth.toFixed(1)),
      maxRevenueGrowth: Number(maxRevenueGrowth.toFixed(1)),
      minRevenueGrowth: Number(minRevenueGrowth.toFixed(1)),
      volatility: Number((Math.max(...revenueGrowths) - Math.min(...revenueGrowths)).toFixed(1)),
    };
  }, [data]);

  // Calculate trend lines
  const trendLines = useMemo(() => {
    if (!showTrendLines || !data || data.length < 2) return [];

    const revenueGrowths = data.filter(d => d.revenueGrowth !== undefined).map(d => d.revenueGrowth!);
    const avgRevenueGrowth = revenueGrowths.reduce((sum, val) => sum + val, 0) / revenueGrowths.length;

    const profitGrowths = data.filter(d => d.profitGrowth !== undefined).map(d => d.profitGrowth!);
    const avgProfitGrowth = profitGrowths.reduce((sum, val) => sum + val, 0) / profitGrowths.length;

    return [
      { value: avgRevenueGrowth, color: '#F59E0B', label: 'Avg Revenue Growth' },
      { value: avgProfitGrowth, color: '#EF4444', label: 'Avg Profit Growth' },
      { value: 0, color: '#6B7280', label: 'Zero Growth' },
    ];
  }, [data, showTrendLines]);

  // Format functions
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
    right: 30,
    left: isMobile ? 40 : 60,
    bottom: isMobile ? 60 : 40,
  };

  const getViewModeLabel = () => {
    return viewMode === 'annual' ? 'Annual Growth Rates' : 'Quarterly Growth Rates';
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">Loading growth rate data...</p>
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
          <p className="text-gray-500 mb-4">No growth rate data available</p>
        </div>
      </div>
    );
  }

  const ChartComponent = overlayType === 'areas' ? AreaChart : LineChart;

  return (
    <div 
      className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 transition-all duration-200 hover:shadow-xl"
      role="img"
      aria-label="Growth Rate Overlay Chart"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Growth Rate Analysis
          </h2>
          <p className="text-sm text-gray-600">
            {getViewModeLabel()} • {overlayType} overlay • {data.length} periods
          </p>
        </div>
      </div>

      {/* Growth Statistics */}
      {showStatistics && growthStats && (
        <div className="mb-6 p-4 bg-gray-50/50 rounded-xl border border-gray-200/50">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Growth Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
            <div>
              <span className="text-gray-600">Average Growth:</span>
              <div className={`font-medium ${growthStats.avgRevenueGrowth >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                Revenue: {growthStats.avgRevenueGrowth >= 0 ? '+' : ''}{growthStats.avgRevenueGrowth}%
              </div>
              <div className={`font-medium ${growthStats.avgProfitGrowth >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                Profit: {growthStats.avgProfitGrowth >= 0 ? '+' : ''}{growthStats.avgProfitGrowth}%
              </div>
            </div>
            <div>
              <span className="text-gray-600">Peak Growth:</span>
              <div className="font-medium text-green-700">+{growthStats.maxRevenueGrowth}%</div>
            </div>
            <div>
              <span className="text-gray-600">Lowest Growth:</span>
              <div className="font-medium text-red-700">{growthStats.minRevenueGrowth}%</div>
            </div>
            <div>
              <span className="text-gray-600">Growth Range:</span>
              <div className="font-medium text-blue-700">{growthStats.volatility}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent
            data={data}
            margin={margins}
            onClick={handleChartClick}
            onMouseEnter={handleChartHover}
            onMouseLeave={() => handleChartHover(null)}
          >
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
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickFormatter={formatPercentage}
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* Trend lines */}
            {trendLines.map((trendLine, index) => (
              <ReferenceLine
                key={`trend-${index}`}
                y={trendLine.value}
                stroke={trendLine.color}
                strokeDasharray="5 5"
                strokeWidth={1}
              />
            ))}

            {/* Revenue Growth */}
            {showRevenueGrowth && (
              overlayType === 'areas' ? (
                <Area 
                  type="monotone"
                  dataKey="revenueGrowth"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fill="#F59E0B"
                  fillOpacity={0.1}
                  name="Revenue Growth"
                  connectNulls={false}
                />
              ) : (
                <Line 
                  type="monotone"
                  dataKey="revenueGrowth"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                  name="Revenue Growth"
                  connectNulls={false}
                />
              )
            )}

            {/* Profit Growth */}
            {showProfitGrowth && (
              overlayType === 'areas' ? (
                <Area 
                  type="monotone"
                  dataKey="profitGrowth"
                  stroke="#EF4444"
                  strokeWidth={2}
                  fill="#EF4444"
                  fillOpacity={0.1}
                  name="Profit Growth"
                  connectNulls={false}
                />
              ) : (
                <Line 
                  type="monotone"
                  dataKey="profitGrowth"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                  name="Profit Growth"
                  connectNulls={false}
                />
              )
            )}

            {/* CAGR Lines */}
            {showCAGR && (
              <>
                <Line 
                  type="monotone"
                  dataKey="revenueCAGR"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  strokeDasharray="7 3"
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                  name="Revenue CAGR"
                  connectNulls={false}
                />
                <Line 
                  type="monotone"
                  dataKey="profitCAGR"
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="7 3"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                  name="Profit CAGR"
                  connectNulls={false}
                />
              </>
            )}

            {/* Quarterly Metrics */}
            {viewMode === 'quarterly' && showYearOverYear && (
              <Line 
                type="monotone"
                dataKey="yearOverYearGrowth"
                stroke="#8B5CF6"
                strokeWidth={2}
                strokeDasharray="3 6"
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 3 }}
                name="YoY Growth"
                connectNulls={false}
              />
            )}

            {/* Volatility Indicators */}
            {showVolatility && (
              <>
                <Line 
                  type="monotone"
                  dataKey="revenueVolatility"
                  stroke="#A855F7"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  dot={{ fill: '#A855F7', strokeWidth: 1, r: 2 }}
                  name="Revenue Volatility"
                  connectNulls={false}
                />
                <Line 
                  type="monotone"
                  dataKey="profitVolatility"
                  stroke="#EC4899"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  dot={{ fill: '#EC4899', strokeWidth: 1, r: 2 }}
                  name="Profit Volatility"
                  connectNulls={false}
                />
              </>
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </div>

      {/* Chart type specific notes */}
      <div className="mt-4 text-xs text-gray-500">
        {overlayType === 'lines' && (
          <p>• Clean line overlays for precise growth rate tracking across periods</p>
        )}
        {overlayType === 'areas' && (
          <p>• Area overlays showing growth magnitude and momentum over time</p>
        )}
        {overlayType === 'bands' && (
          <p>• Band overlays highlighting growth rate ranges and volatility periods</p>
        )}
      </div>
    </div>
  );
}; 