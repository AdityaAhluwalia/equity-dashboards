'use client';

import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';
import { PhaseType, getPhaseColors } from '@/lib/design-tokens';

export interface QuarterlyCycleData {
  quarter: string; // e.g., "Q1 FY24", "Q2 FY24"
  quarterIndex: number; // 0-11 for 12 quarters
  revenue: number;
  netProfit: number;
  phase: PhaseType;
  cycleIntensity: number; // 0-100 scale
  seasonalAdjusted?: boolean;
  quarterlyGrowth?: number; // QoQ growth
  yearOverYearGrowth?: number; // YoY growth
  marketCap?: number;
  operatingCashFlow?: number;
  workingCapital?: number;
  seasonalityIndex?: number; // Measure of seasonal effects
}

export interface QuarterlyCycleViewProps {
  data: QuarterlyCycleData[];
  showPhaseIntensity?: boolean;
  showSeasonalAdjustment?: boolean;
  showQuarterlyGrowth?: boolean;
  showYearOverYearGrowth?: boolean;
  showWorkingCapital?: boolean;
  showOperatingCashFlow?: boolean;
  showSeasonalityIndicators?: boolean;
  enableQuarterComparison?: boolean;
  highlightSeasonalPatterns?: boolean;
  height?: number;
  loading?: boolean;
  error?: string | null;
  onQuarterClick?: (quarter: string, data: QuarterlyCycleData) => void;
  onPhaseHover?: (phase: PhaseType | null, quarter: string | null) => void;
  onSeasonalPatternClick?: (pattern: string, quarters: string[]) => void;
}

const QuarterlyCycleView: React.FC<QuarterlyCycleViewProps> = ({
  data,
  showPhaseIntensity = false,
  showSeasonalAdjustment = false,
  showQuarterlyGrowth = false,
  showYearOverYearGrowth = false,
  showWorkingCapital = false,
  showOperatingCashFlow = false,
  showSeasonalityIndicators = false,
  enableQuarterComparison = false,
  highlightSeasonalPatterns = false,
  height = 500,
  loading = false,
  error = null,
  onQuarterClick,
  onPhaseHover,
  onSeasonalPatternClick,
}) => {
  // Memoized phase bands calculation for performance
  const phaseBands = useMemo(() => {
    if (!data.length) return [];

    const bands: Array<{
      startIndex: number;
      endIndex: number;
      phase: PhaseType;
      intensity: number;
    }> = [];

    let currentPhase = data[0].phase;
    let startIndex = 0;

    for (let i = 1; i <= data.length; i++) {
      if (i === data.length || data[i].phase !== currentPhase) {
        bands.push({
          startIndex,
          endIndex: i - 1,
          phase: currentPhase,
          intensity: data.slice(startIndex, i).reduce((sum, item) => sum + item.cycleIntensity, 0) / (i - startIndex),
        });

        if (i < data.length) {
          currentPhase = data[i].phase;
          startIndex = i;
        }
      }
    }

    return bands;
  }, [data]);

  // Memoized seasonal patterns detection
  const seasonalPatterns = useMemo(() => {
    if (!data.length || !highlightSeasonalPatterns) return [];

    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const patterns: Array<{
      quarter: string;
      averageGrowth: number;
      seasonalityScore: number;
      quarters: string[];
    }> = [];

    quarters.forEach(q => {
      const quarterData = data.filter(item => item.quarter.startsWith(q));
      if (quarterData.length > 0) {
        const avgGrowth = quarterData.reduce((sum, item) => sum + (item.quarterlyGrowth || 0), 0) / quarterData.length;
        const avgSeasonality = quarterData.reduce((sum, item) => sum + (item.seasonalityIndex || 1), 0) / quarterData.length;
        
        patterns.push({
          quarter: q,
          averageGrowth: avgGrowth,
          seasonalityScore: Math.abs(avgSeasonality - 1) * 100,
          quarters: quarterData.map(item => item.quarter),
        });
      }
    });

    return patterns;
  }, [data, highlightSeasonalPatterns]);

  // Memoized chart data preparation
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      displayRevenue: item.revenue / 10000000, // Convert to Cr
      displayProfit: item.netProfit / 10000000, // Convert to Cr
      displayMarketCap: item.marketCap ? item.marketCap / 10000000000 : undefined, // Convert to thousands of Cr
      displayWorkingCapital: item.workingCapital ? item.workingCapital / 10000000 : undefined, // Convert to Cr
      displayOperatingCashFlow: item.operatingCashFlow ? item.operatingCashFlow / 10000000 : undefined, // Convert to Cr
    }));
  }, [data]);

  // Format quarter label for display
  const formatQuarterLabel = (quarter: string) => {
    return quarter.replace('FY', 'FY');
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length && label) {
      const quarterData = data.find(item => item.quarter === label);
      
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3 max-w-sm">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          
          {quarterData && (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue:</span>
                <span className="font-medium">₹{(quarterData.revenue / 10000000).toFixed(0)}Cr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Profit:</span>
                <span className="font-medium">₹{(quarterData.netProfit / 10000000).toFixed(0)}Cr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phase:</span>
                <span className={`font-medium capitalize ${
                  quarterData.phase === 'expansion' ? 'text-green-600' :
                  quarterData.phase === 'contraction' ? 'text-red-600' :
                  quarterData.phase === 'stable' ? 'text-gray-600' :
                  'text-yellow-600'
                }`}>
                  {quarterData.phase}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Intensity:</span>
                <span className="font-medium">{quarterData.cycleIntensity}%</span>
              </div>
              
              {quarterData.quarterlyGrowth !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">QoQ Growth:</span>
                  <span className={`font-medium ${quarterData.quarterlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {quarterData.quarterlyGrowth >= 0 ? '+' : ''}{quarterData.quarterlyGrowth.toFixed(1)}%
                  </span>
                </div>
              )}
              
              {quarterData.yearOverYearGrowth !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">YoY Growth:</span>
                  <span className={`font-medium ${quarterData.yearOverYearGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {quarterData.yearOverYearGrowth >= 0 ? '+' : ''}{quarterData.yearOverYearGrowth.toFixed(1)}%
                  </span>
                </div>
              )}
              
              {quarterData.seasonalityIndex !== undefined && showSeasonalityIndicators && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Seasonality:</span>
                  <span className="font-medium">{quarterData.seasonalityIndex.toFixed(2)}x</span>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6" style={{ height }}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
        <div className="text-center text-gray-500 mt-8">Loading quarterly cycle data...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-red-200 p-6" style={{ height }}>
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error Loading Data</div>
          <div className="text-red-500 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6" style={{ height }}>
        <div className="text-center text-gray-500 mt-8">No quarterly data available</div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 transition-all duration-300 hover:shadow-xl">
      <div className="mb-4">
        <h3 role="heading" className="text-lg font-semibold text-gray-900 mb-1">
          Quarterly Cycle Analysis
        </h3>
        <p className="text-sm text-gray-600">
          12-quarter business cycle with granular phase detection
        </p>
      </div>

      {/* Seasonal patterns summary */}
      {highlightSeasonalPatterns && seasonalPatterns.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Seasonal Patterns</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {seasonalPatterns.map(pattern => (
              <div
                key={pattern.quarter}
                className="bg-white rounded p-2 cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => onSeasonalPatternClick?.(pattern.quarter, pattern.quarters)}
              >
                <div className="font-medium text-blue-900">{pattern.quarter}</div>
                <div className="text-blue-700">
                  Avg: {pattern.averageGrowth >= 0 ? '+' : ''}{pattern.averageGrowth.toFixed(1)}%
                </div>
                <div className="text-blue-600">
                  Seasonal: {pattern.seasonalityScore.toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            onMouseEnter={() => onPhaseHover?.(null, null)}
            onMouseLeave={() => onPhaseHover?.(null, null)}
          >
            <defs>
              {/* Revenue gradient */}
              <linearGradient id="revenueGradientQuarterly" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
              </linearGradient>
              
              {/* Phase intensity gradient */}
              {showPhaseIntensity && (
                <linearGradient id="intensityGradientQuarterly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05} />
                </linearGradient>
              )}

              {/* Quarterly growth gradient */}
              {showQuarterlyGrowth && (
                <linearGradient id="quarterlyGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                </linearGradient>
              )}

              {/* YoY growth gradient */}
              {showYearOverYearGrowth && (
                <linearGradient id="yoyGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05} />
                </linearGradient>
              )}

              {/* Working capital gradient */}
              {showWorkingCapital && (
                <linearGradient id="workingCapitalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05} />
                </linearGradient>
              )}

              {/* Operating cash flow gradient */}
              {showOperatingCashFlow && (
                <linearGradient id="ocfGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.05} />
                </linearGradient>
              )}
            </defs>

            {/* Phase background areas */}
            {phaseBands.map((band, index) => (
              <ReferenceArea
                key={`phase-${index}`}
                x1={data[band.startIndex]?.quarter}
                x2={data[band.endIndex]?.quarter}
                fill={getPhaseColors(band.phase).background}
                fillOpacity={0.1}
                onClick={() => {
                  if (data[band.startIndex]) {
                    onQuarterClick?.(data[band.startIndex].quarter, data[band.startIndex]);
                  }
                }}
              />
            ))}

            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            
            <XAxis 
              dataKey="quarter"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickFormatter={formatQuarterLabel}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            
            {/* Primary Y-axis for revenue */}
            <YAxis 
              yAxisId="revenue"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickFormatter={(value) => `₹${value}Cr`}
            />

            {/* Secondary Y-axis for intensity/growth */}
            {(showPhaseIntensity || showQuarterlyGrowth || showYearOverYearGrowth) && (
              <YAxis 
                yAxisId="secondary"
                orientation="right"
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickFormatter={(value) => `${value}%`}
              />
            )}

            <Tooltip content={<CustomTooltip />} />

            {/* Main revenue area */}
            <Area
              yAxisId="revenue"
              type="monotone"
              dataKey="displayRevenue"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#revenueGradientQuarterly)"
            />

            {/* Phase intensity overlay */}
            {showPhaseIntensity && (
              <Area
                yAxisId="secondary"
                type="monotone"
                dataKey="cycleIntensity"
                stroke="#8B5CF6"
                strokeWidth={1.5}
                fill="url(#intensityGradientQuarterly)"
                strokeDasharray="5 5"
              />
            )}

            {/* Quarterly growth overlay */}
            {showQuarterlyGrowth && (
              <Area
                yAxisId="secondary"
                type="monotone"
                dataKey="quarterlyGrowth"
                stroke="#10B981"
                strokeWidth={1.5}
                fill="url(#quarterlyGrowthGradient)"
                strokeDasharray="3 3"
              />
            )}

            {/* Year-over-year growth overlay */}
            {showYearOverYearGrowth && (
              <Area
                yAxisId="secondary"
                type="monotone"
                dataKey="yearOverYearGrowth"
                stroke="#F59E0B"
                strokeWidth={1.5}
                fill="url(#yoyGrowthGradient)"
                strokeDasharray="7 3"
              />
            )}

            {/* Working capital overlay */}
            {showWorkingCapital && (
              <Area
                yAxisId="revenue"
                type="monotone"
                dataKey="displayWorkingCapital"
                stroke="#EF4444"
                strokeWidth={1.5}
                fill="url(#workingCapitalGradient)"
                strokeDasharray="2 2"
              />
            )}

            {/* Operating cash flow overlay */}
            {showOperatingCashFlow && (
              <Area
                yAxisId="revenue"
                type="monotone"
                dataKey="displayOperatingCashFlow"
                stroke="#06B6D4"
                strokeWidth={1.5}
                fill="url(#ocfGradient)"
                strokeDasharray="4 4"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-600">Revenue</span>
        </div>
        
        {showPhaseIntensity && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded border-dashed border border-purple-500"></div>
            <span className="text-gray-600">Phase Intensity</span>
          </div>
        )}
        
        {showQuarterlyGrowth && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded border-dashed border border-green-500"></div>
            <span className="text-gray-600">QoQ Growth</span>
          </div>
        )}
        
        {showYearOverYearGrowth && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-amber-500 rounded border-dashed border border-amber-500"></div>
            <span className="text-gray-600">YoY Growth</span>
          </div>
        )}
        
        {showWorkingCapital && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded border-dotted border border-red-500"></div>
            <span className="text-gray-600">Working Capital</span>
          </div>
        )}
        
        {showOperatingCashFlow && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-cyan-500 rounded border-dotted border border-cyan-500"></div>
            <span className="text-gray-600">Operating Cash Flow</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuarterlyCycleView; 