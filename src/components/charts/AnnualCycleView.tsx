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

export interface AnnualCycleData {
  fiscalYear: string;
  revenue: number;
  netProfit: number;
  phase: PhaseType;
  cycleIntensity: number; // 0-100 scale
  yearIndex: number;
  marketCap?: number;
  revenueGrowth?: number;
  profitGrowth?: number;
}

export interface AnnualCycleViewProps {
  data: AnnualCycleData[];
  showPhaseIntensity?: boolean;
  showMarketCap?: boolean;
  showGrowthRates?: boolean;
  height?: number;
  loading?: boolean;
  error?: string | null;
  onPhaseClick?: (phase: PhaseType, year: string) => void;
  onYearHover?: (year: string | null) => void;
  enableZoom?: boolean;
  showTrendAnalysis?: boolean;
}

interface PhaseBand {
  startIndex: number;
  endIndex: number;
  phase: PhaseType;
  startYear: string;
  endYear: string;
}

const AnnualCycleView: React.FC<AnnualCycleViewProps> = ({
  data,
  showPhaseIntensity = false,
  showMarketCap = false,
  showGrowthRates = false,
  height = 400,
  loading = false,
  error = null,
  onPhaseClick,
  onYearHover,
  enableZoom = false,
  showTrendAnalysis = false,
}) => {
  // Calculate phase bands for continuous periods
  const phaseBands = useMemo(() => {
    if (!data || data.length === 0) return [];

    const bands: PhaseBand[] = [];
    let currentPhase = data[0].phase;
    let startIndex = 0;

    for (let i = 1; i < data.length; i++) {
      if (data[i].phase !== currentPhase) {
        bands.push({
          startIndex,
          endIndex: i - 1,
          phase: currentPhase,
          startYear: data[startIndex].fiscalYear,
          endYear: data[i - 1].fiscalYear,
        });
        currentPhase = data[i].phase;
        startIndex = i;
      }
    }

    // Add the last band
    bands.push({
      startIndex,
      endIndex: data.length - 1,
      phase: currentPhase,
      startYear: data[startIndex].fiscalYear,
      endYear: data[data.length - 1].fiscalYear,
    });

    return bands;
  }, [data]);

  // Enhanced chart data with additional metrics
  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      revenueInCrores: item.revenue / 10000000, // Convert to crores for better readability
      netProfitInCrores: item.netProfit / 10000000,
      marketCapInCrores: item.marketCap ? item.marketCap / 10000000 : undefined,
    }));
  }, [data]);

  // Cycle statistics for trend analysis
  const cycleStats = useMemo(() => {
    if (!data || data.length === 0) return null;

    const revenues = data.map(d => d.revenue);
    const maxRevenue = Math.max(...revenues);
    const minRevenue = Math.min(...revenues);
    const peakYear = data.find(d => d.revenue === maxRevenue)?.fiscalYear;
    const troughYear = data.find(d => d.revenue === minRevenue)?.fiscalYear;

    const avgGrowth = data
      .filter(d => d.revenueGrowth !== undefined)
      .reduce((sum, d) => sum + (d.revenueGrowth || 0), 0) / data.length;

    return {
      peakYear,
      troughYear,
      maxRevenue,
      minRevenue,
      avgGrowth: Number(avgGrowth.toFixed(2)),
      totalGrowth: ((maxRevenue - minRevenue) / minRevenue * 100).toFixed(2),
    };
  }, [data]);

  // Custom tooltip for detailed information
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const dataPoint = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl p-4 shadow-lg">
        <h3 className="font-semibold text-gray-900 mb-2">{label}</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Revenue:</span>
            <span className="font-medium">₹{dataPoint.revenueInCrores?.toFixed(0)} Cr</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Net Profit:</span>
            <span className="font-medium">₹{dataPoint.netProfitInCrores?.toFixed(0)} Cr</span>
          </div>
          {dataPoint.revenueGrowth !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-600">Revenue Growth:</span>
              <span className={`font-medium ${dataPoint.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {dataPoint.revenueGrowth >= 0 ? '+' : ''}{dataPoint.revenueGrowth?.toFixed(1)}%
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Phase:</span>
            <span className={`font-medium capitalize px-2 py-1 rounded-full text-xs ${
              dataPoint.phase === 'expansion' ? 'bg-green-100 text-green-800' :
              dataPoint.phase === 'contraction' ? 'bg-red-100 text-red-800' :
              dataPoint.phase === 'stable' ? 'bg-gray-100 text-gray-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {dataPoint.phase}
            </span>
          </div>
          {showPhaseIntensity && (
            <div className="flex justify-between">
              <span className="text-gray-600">Intensity:</span>
              <span className="font-medium">{dataPoint.cycleIntensity}%</span>
            </div>
          )}
          {showMarketCap && dataPoint.marketCapInCrores && (
            <div className="flex justify-between">
              <span className="text-gray-600">Market Cap:</span>
              <span className="font-medium">₹{dataPoint.marketCapInCrores?.toFixed(0)} Cr</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div 
        className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 md:p-6 transition-all duration-200"
        data-testid="annual-cycle-skeleton"
        style={{ height }}
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded-lg mb-4 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-6 w-1/2"></div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 md:p-6 transition-all duration-200">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 md:p-6 transition-all duration-200">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600">No annual data available for analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 md:p-6 transition-all duration-200 hover:shadow-xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Annual Business Cycle Analysis
        </h2>
        <p className="text-sm text-gray-600">
          12-year view • {data.length} fiscal years • {phaseBands.length} cycle phases
        </p>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <span className="text-xs text-gray-600">Revenue Trend</span>
          </div>
          {showPhaseIntensity && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600"></div>
              <span className="text-xs text-gray-600">Phase Intensity</span>
            </div>
          )}
          {showMarketCap && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
              <span className="text-xs text-gray-600">Market Cap</span>
            </div>
          )}
          {showGrowthRates && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-600"></div>
              <span className="text-xs text-gray-600">Growth Rate</span>
            </div>
          )}
        </div>
      </div>

      {/* Trend Analysis Summary */}
      {showTrendAnalysis && cycleStats && (
        <div className="mb-6 p-4 bg-gray-50/50 rounded-xl border border-gray-200/50">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Cycle Analysis Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-gray-600">Peak Year:</span>
              <div className="font-medium text-green-700">{cycleStats.peakYear}</div>
            </div>
            <div>
              <span className="text-gray-600">Trough Year:</span>
              <div className="font-medium text-red-700">{cycleStats.troughYear}</div>
            </div>
            <div>
              <span className="text-gray-600">Avg Growth:</span>
              <div className={`font-medium ${cycleStats.avgGrowth >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {cycleStats.avgGrowth >= 0 ? '+' : ''}{cycleStats.avgGrowth}%
              </div>
            </div>
            <div>
              <span className="text-gray-600">Total Growth:</span>
              <div className="font-medium text-blue-700">{cycleStats.totalGrowth}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Chart Container */}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            onMouseEnter={() => onYearHover?.(null)}
            onMouseLeave={() => onYearHover?.(null)}
          >
            <defs>
              {/* Revenue gradient */}
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
              </linearGradient>
              
              {/* Phase intensity gradient */}
              {showPhaseIntensity && (
                <linearGradient id="intensityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05} />
                </linearGradient>
              )}

              {/* Market cap gradient */}
              {showMarketCap && (
                <linearGradient id="marketCapGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                </linearGradient>
              )}
            </defs>

            {/* Phase background bands */}
            {phaseBands.map((band, index) => (
              <ReferenceArea
                key={index}
                x1={band.startIndex - 0.4}
                x2={band.endIndex + 0.4}
                fill={getPhaseColors(band.phase).background}
                fillOpacity={0.1}
                onClick={() => onPhaseClick?.(band.phase, band.startYear)}
                style={{ cursor: 'pointer' }}
              />
            ))}

            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
            
            <XAxis
              dataKey="fiscalYear"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            
            <YAxis
              yAxisId="revenue"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickFormatter={(value) => `₹${(value).toFixed(0)}Cr`}
            />

            {/* Secondary Y-axis for phase intensity */}
            {showPhaseIntensity && (
              <YAxis
                yAxisId="intensity"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
              />
            )}

            {/* Market cap Y-axis */}
            {showMarketCap && (
              <YAxis
                yAxisId="marketCap"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickFormatter={(value) => `₹${(value).toFixed(0)}Cr`}
              />
            )}

            <Tooltip content={<CustomTooltip />} />

            {/* Revenue area */}
            <Area
              yAxisId="revenue"
              type="monotone"
              dataKey="revenueInCrores"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, fill: '#3B82F6', strokeWidth: 2 }}
            />

            {/* Phase intensity overlay */}
            {showPhaseIntensity && (
              <Area
                yAxisId="intensity"
                type="monotone"
                dataKey="cycleIntensity"
                stroke="#8B5CF6"
                strokeWidth={1.5}
                fill="url(#intensityGradient)"
                strokeDasharray="4 4"
                dot={{ fill: '#8B5CF6', strokeWidth: 1, r: 2 }}
              />
            )}

            {/* Market cap overlay */}
            {showMarketCap && (
              <Area
                yAxisId="marketCap"
                type="monotone"
                dataKey="marketCapInCrores"
                stroke="#10B981"
                strokeWidth={1.5}
                fill="url(#marketCapGradient)"
                strokeDasharray="2 2"
                dot={{ fill: '#10B981', strokeWidth: 1, r: 2 }}
              />
            )}

            {/* Peak and trough reference lines */}
            {showTrendAnalysis && cycleStats && (
              <>
                <ReferenceLine
                  y={cycleStats.maxRevenue / 10000000}
                  stroke="#10B981"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  yAxisId="revenue"
                />
                <ReferenceLine
                  y={cycleStats.minRevenue / 10000000}
                  stroke="#EF4444"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  yAxisId="revenue"
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Phase indicators */}
      <div className="mt-4 flex flex-wrap gap-2">
        {phaseBands.map((band, index) => (
          <button
            key={index}
            onClick={() => onPhaseClick?.(band.phase, band.startYear)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${
              band.phase === 'expansion' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
              band.phase === 'contraction' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
              band.phase === 'stable' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' :
              'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            }`}
          >
            {band.phase} ({band.startYear}-{band.endYear})
          </button>
        ))}
      </div>
    </div>
  );
};

export default AnnualCycleView; 