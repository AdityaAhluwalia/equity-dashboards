'use client';

import React, { useMemo, useCallback } from 'react';
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
  ReferenceArea,
  ReferenceLine,
} from 'recharts';
import { PhaseType, getPhaseColors } from '@/lib/design-tokens';

export interface QuarterlyRevenueData {
  quarter: string; // e.g., "Q1 FY24", "Q2 FY24"
  quarterIndex: number; // 0-11 for 12 quarters
  fiscalYear: string; // e.g., "FY24"
  quarterNumber: string; // e.g., "Q1", "Q2", "Q3", "Q4"
  revenue: number;
  revenueInCrores: number;
  phase: PhaseType;
  quarterlyGrowth?: number; // QoQ growth
  yearOverYearGrowth?: number; // YoY growth
  seasonalityIndex?: number; // Seasonal adjustment factor
  seasonalAdjustedRevenue?: number;
  marketCap?: number;
  isSeasonalPeak?: boolean;
  isSeasonalTrough?: boolean;
  seasonalDeviation?: number; // How much it deviates from average
}

export interface QuarterlyRevenueChartProps {
  data: QuarterlyRevenueData[];
  height?: number;
  showSeasonalAdjustment?: boolean;
  showSeasonalPatterns?: boolean;
  showYearOverYearComparison?: boolean;
  showSeasonalityIndex?: boolean;
  highlightSeasonalPeaks?: boolean;
  viewType?: 'bars' | 'lines' | 'areas' | 'mixed';
  seasonalAnalysisMode?: 'overlay' | 'sideBySide' | 'separate';
  loading?: boolean;
  error?: string | null;
  onQuarterClick?: (quarter: string, data: QuarterlyRevenueData) => void;
  onQuarterHover?: (quarter: string | null, data: QuarterlyRevenueData | null) => void;
  onSeasonalPatternClick?: (quarterNumber: string, quarters: QuarterlyRevenueData[]) => void;
  onRetry?: () => void;
}

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
    <div className="space-y-3">
      <div className="grid grid-cols-12 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-2">
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
          <span className="text-sm font-medium">₹{data.revenueInCrores} Cr</span>
        </div>

        {/* Seasonal Adjusted Revenue */}
        {data.seasonalAdjustedRevenue && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-300 border border-blue-500"></div>
              <span className="text-sm text-gray-600">Seasonally Adjusted:</span>
            </div>
            <span className="text-sm font-medium">₹{(data.seasonalAdjustedRevenue / 10000000)?.toFixed(0)} Cr</span>
          </div>
        )}

        {/* Growth Rates */}
        {data.quarterlyGrowth !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">QoQ Growth:</span>
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

        {/* Seasonality */}
        {data.seasonalityIndex !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Seasonality Index:</span>
            <span className="text-sm font-medium text-purple-600">{data.seasonalityIndex?.toFixed(2)}</span>
          </div>
        )}

        {data.seasonalDeviation !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Seasonal Deviation:</span>
            <span className={`text-sm font-medium ${data.seasonalDeviation >= 0 ? 'text-orange-600' : 'text-blue-600'}`}>
              {data.seasonalDeviation >= 0 ? '+' : ''}{data.seasonalDeviation?.toFixed(1)}%
            </span>
          </div>
        )}

        {/* Peak/Trough Indicators */}
        {(data.isSeasonalPeak || data.isSeasonalTrough) && (
          <div className="pt-2 border-t border-gray-200">
            {data.isSeasonalPeak && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-xs text-yellow-700 font-medium">Seasonal Peak</span>
              </div>
            )}
            {data.isSeasonalTrough && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-xs text-blue-700 font-medium">Seasonal Trough</span>
              </div>
            )}
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

export const QuarterlyRevenueChart: React.FC<QuarterlyRevenueChartProps> = ({
  data,
  height = 500,
  showSeasonalAdjustment = true,
  showSeasonalPatterns = true,
  showYearOverYearComparison = true,
  showSeasonalityIndex = false,
  highlightSeasonalPeaks = true,
  viewType = 'bars',
  seasonalAnalysisMode = 'overlay',
  loading = false,
  error = null,
  onQuarterClick,
  onQuarterHover,
  onSeasonalPatternClick,
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

  // Calculate seasonal patterns analysis
  const seasonalAnalysis = useMemo(() => {
    if (!data || data.length === 0) return null;

    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const quarterData: { [key: string]: QuarterlyRevenueData[] } = {};
    
    // Group data by quarter number
    quarters.forEach(q => {
      quarterData[q] = data.filter(item => item.quarterNumber === q);
    });

    // Calculate seasonal statistics
    const seasonalStats = quarters.map(quarter => {
      const qData = quarterData[quarter];
      if (qData.length === 0) return null;

      const avgRevenue = qData.reduce((sum, item) => sum + item.revenueInCrores, 0) / qData.length;
      const avgGrowth = qData.reduce((sum, item) => sum + (item.yearOverYearGrowth || 0), 0) / qData.length;
      const avgSeasonality = qData.reduce((sum, item) => sum + (item.seasonalityIndex || 1), 0) / qData.length;
      const hasPeaks = qData.some(item => item.isSeasonalPeak);
      const hasTroughs = qData.some(item => item.isSeasonalTrough);

      return {
        quarter,
        avgRevenue: Number(avgRevenue.toFixed(0)),
        avgGrowth: Number(avgGrowth.toFixed(1)),
        avgSeasonality: Number(avgSeasonality.toFixed(2)),
        seasonalStrength: Math.abs(avgSeasonality - 1) * 100,
        hasPeaks,
        hasTroughs,
        dataCount: qData.length,
        quarters: qData
      };
    }).filter(Boolean);

    // Identify peak and trough quarters
    const peakQuarter = seasonalStats.reduce((max, current) => 
      (current?.avgRevenue || 0) > (max?.avgRevenue || 0) ? current : max, seasonalStats[0]);
    
    const troughQuarter = seasonalStats.reduce((min, current) => 
      (current?.avgRevenue || Infinity) < (min?.avgRevenue || Infinity) ? current : min, seasonalStats[0]);

    // Calculate overall seasonal strength
    const avgSeasonalIndices = seasonalStats.map(stat => stat?.avgSeasonality || 1);
    const mean = avgSeasonalIndices.reduce((sum, val) => sum + val, 0) / avgSeasonalIndices.length;
    const variance = avgSeasonalIndices.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / avgSeasonalIndices.length;
    const seasonalStrength = Math.sqrt(variance) / mean * 100;

    return {
      quarterlyStats: seasonalStats,
      peakQuarter: peakQuarter?.quarter || 'Q3',
      troughQuarter: troughQuarter?.quarter || 'Q1',
      seasonalStrength: Number(seasonalStrength.toFixed(1)),
      seasonalTrend: seasonalStrength > 15 ? 'Strong' : seasonalStrength > 8 ? 'Moderate' : 'Weak',
      isConsistentPattern: seasonalStrength > 10
    };
  }, [data]);

  // Format functions
  const formatCurrency = useCallback((value: number) => `₹${value}Cr`, []);
  const formatPercentage = useCallback((value: number) => `${value.toFixed(1)}%`, []);

  // Event handlers
  const handleChartClick = useCallback((event: any) => {
    if (event && event.activeLabel && onQuarterClick) {
      const quarter = event.activeLabel;
      const quarterData = data.find(d => d.quarter === quarter);
      if (quarterData) {
        onQuarterClick(quarter, quarterData);
      }
    }
  }, [data, onQuarterClick]);

  const handleChartHover = useCallback((event: any) => {
    if (onQuarterHover) {
      if (event && event.activeLabel) {
        const quarter = event.activeLabel;
        const quarterData = data.find(d => d.quarter === quarter);
        onQuarterHover(quarter, quarterData || null);
      } else {
        onQuarterHover(null, null);
      }
    }
  }, [data, onQuarterHover]);

  const handleSeasonalPatternClick = useCallback((quarterNumber: string) => {
    if (onSeasonalPatternClick && seasonalAnalysis) {
      const quarterStat = seasonalAnalysis.quarterlyStats.find(stat => stat?.quarter === quarterNumber);
      if (quarterStat) {
        onSeasonalPatternClick(quarterNumber, quarterStat.quarters);
      }
    }
  }, [onSeasonalPatternClick, seasonalAnalysis]);

  // Responsive margins
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const margins = {
    top: 20,
    right: showYearOverYearComparison ? 60 : 30,
    left: isMobile ? 50 : 70,
    bottom: isMobile ? 80 : 60,
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">Loading quarterly revenue data...</p>
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
          <p className="text-gray-500 mb-4">No quarterly revenue data available</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 transition-all duration-200 hover:shadow-xl"
      role="img"
      aria-label="Quarterly Revenue Chart with Seasonal Patterns"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Quarterly Revenue with Seasonal Patterns
          </h2>
          <p className="text-sm text-gray-600">
            {data.length} quarters • {viewType} view • seasonal analysis
          </p>
        </div>
      </div>

      {/* Seasonal Pattern Summary */}
      {showSeasonalPatterns && seasonalAnalysis && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/50">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Seasonal Pattern Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{seasonalAnalysis.peakQuarter}</div>
              <div className="text-xs text-blue-700">Peak Quarter</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{seasonalAnalysis.troughQuarter}</div>
              <div className="text-xs text-red-700">Trough Quarter</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{seasonalAnalysis.seasonalTrend}</div>
              <div className="text-xs text-purple-700">Seasonal Strength</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${seasonalAnalysis.isConsistentPattern ? 'text-green-600' : 'text-orange-600'}`}>
                {seasonalAnalysis.isConsistentPattern ? 'Consistent' : 'Irregular'}
              </div>
              <div className={`text-xs ${seasonalAnalysis.isConsistentPattern ? 'text-green-700' : 'text-orange-700'}`}>
                Pattern Type
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {seasonalAnalysis.quarterlyStats.map(stat => stat && (
              <div
                key={stat.quarter}
                className="bg-white/60 rounded-lg p-3 cursor-pointer hover:bg-white/80 transition-all duration-200 border border-white/50"
                onClick={() => handleSeasonalPatternClick(stat.quarter)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-gray-900">{stat.quarter}</span>
                  {stat.hasPeaks && <div className="w-2 h-2 rounded-full bg-yellow-400"></div>}
                  {stat.hasTroughs && <div className="w-2 h-2 rounded-full bg-blue-400"></div>}
                </div>
                <div className="text-xs text-gray-600">
                  <div>Avg: ₹{stat.avgRevenue}Cr</div>
                  <div>Growth: {stat.avgGrowth >= 0 ? '+' : ''}{stat.avgGrowth}%</div>
                  <div>Seasonal: {stat.avgSeasonality}x</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart */}
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={margins}
            onClick={handleChartClick}
            onMouseEnter={handleChartHover}
            onMouseLeave={() => handleChartHover(null)}
          >
            <defs>
              {/* Revenue gradient */}
              <linearGradient id="revenueGradientQuarterly" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.3} />
              </linearGradient>
              
              {/* Seasonal adjusted gradient */}
              <linearGradient id="seasonalAdjustedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#93C5FD" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#93C5FD" stopOpacity={0.2} />
              </linearGradient>

              {/* Peak highlighting gradient */}
              <linearGradient id="peakHighlightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.3} />
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
              dataKey="quarter"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? 'end' : 'middle'}
              height={isMobile ? 80 : 60}
            />
            
            {/* Primary Y-axis for revenue */}
            <YAxis 
              yAxisId="revenue"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickFormatter={formatCurrency}
            />

            {/* Secondary Y-axis for growth rates */}
            {(showYearOverYearComparison || showSeasonalityIndex) && (
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
            {(viewType === 'bars' || viewType === 'mixed') && (
              <Bar 
                yAxisId="revenue"
                dataKey="revenueInCrores"
                fill={(item: any) => {
                  if (highlightSeasonalPeaks && item.isSeasonalPeak) {
                    return "url(#peakHighlightGradient)";
                  }
                  return "url(#revenueGradientQuarterly)";
                }}
                name="Quarterly Revenue"
                radius={[2, 2, 0, 0]}
                strokeWidth={(item: any) => {
                  if (highlightSeasonalPeaks && (item.isSeasonalPeak || item.isSeasonalTrough)) {
                    return 2;
                  }
                  return 0;
                }}
                stroke={(item: any) => {
                  if (highlightSeasonalPeaks && item.isSeasonalPeak) {
                    return "#F59E0B";
                  }
                  if (highlightSeasonalPeaks && item.isSeasonalTrough) {
                    return "#3B82F6";
                  }
                  return "transparent";
                }}
              />
            )}

            {/* Seasonal adjusted revenue bars */}
            {showSeasonalAdjustment && (viewType === 'bars' || viewType === 'mixed') && (
              <Bar 
                yAxisId="revenue"
                dataKey="seasonalAdjustedRevenue"
                fill="url(#seasonalAdjustedGradient)"
                name="Seasonally Adjusted"
                radius={[2, 2, 0, 0]}
                fillOpacity={0.6}
              />
            )}

            {/* Revenue line */}
            {(viewType === 'lines' || viewType === 'mixed') && (
              <Line 
                yAxisId="revenue"
                type="monotone"
                dataKey="revenueInCrores"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                name="Quarterly Revenue"
                connectNulls={false}
              />
            )}

            {/* Revenue area */}
            {viewType === 'areas' && (
              <Area 
                yAxisId="revenue"
                type="monotone"
                dataKey="revenueInCrores"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#revenueGradientQuarterly)"
                name="Quarterly Revenue"
              />
            )}

            {/* Year-over-year growth line */}
            {showYearOverYearComparison && (
              <Line 
                yAxisId="percentage"
                type="monotone"
                dataKey="yearOverYearGrowth"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name="YoY Growth"
                connectNulls={false}
              />
            )}

            {/* Seasonality index line */}
            {showSeasonalityIndex && (
              <Line 
                yAxisId="percentage"
                type="monotone"
                dataKey="seasonalityIndex"
                stroke="#8B5CF6"
                strokeWidth={2}
                strokeDasharray="3 6"
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 3 }}
                name="Seasonality Index"
                connectNulls={false}
              />
            )}

            {/* Zero growth reference line */}
            {showYearOverYearComparison && (
              <ReferenceLine
                yAxisId="percentage"
                y={0}
                stroke="#6B7280"
                strokeDasharray="2 2"
                strokeWidth={1}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart insights */}
      <div className="mt-4 text-xs text-gray-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {viewType === 'bars' && (
              <p>• Bar chart showing quarterly revenue with seasonal peak/trough highlighting</p>
            )}
            {viewType === 'lines' && (
              <p>• Line chart tracking quarterly revenue trends and growth patterns</p>
            )}
            {viewType === 'areas' && (
              <p>• Area chart visualizing quarterly revenue magnitude and seasonal cycles</p>
            )}
            {viewType === 'mixed' && (
              <p>• Combined bars and lines for comprehensive quarterly revenue analysis</p>
            )}
          </div>
          {seasonalAnalysis && (
            <div>
              <p>• Seasonal strength: {seasonalAnalysis.seasonalTrend} ({seasonalAnalysis.seasonalStrength}%)</p>
              <p>• Peak in {seasonalAnalysis.peakQuarter}, trough in {seasonalAnalysis.troughQuarter}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 