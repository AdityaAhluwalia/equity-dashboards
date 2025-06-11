import React, { useMemo, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts';
import { PhaseType, getPhaseColors } from '@/lib/design-tokens';

export interface CycleData {
  period: string;
  revenue: number;
  netProfit: number;
  phase: PhaseType;
  cycleIntensity: number; // 0-100 scale
  quarterIndex: number;
}

export interface CycleTimelineProps {
  data: CycleData[];
  viewMode: 'quarterly' | 'annual';
  showPhaseIntensity?: boolean;
  showTrendLine?: boolean;
  height?: number;
  loading?: boolean;
  error?: string | null;
  onPhaseClick?: (phase: PhaseType, period: string) => void;
  onPeriodHover?: (period: string | null) => void;
}

// Custom tooltip component following Apple design
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-gray-100">
      <div className="text-sm font-semibold text-gray-900 mb-2">{label}</div>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-gray-600">Revenue:</span>
          <span className="text-xs font-medium">₹{new Intl.NumberFormat('en-IN').format(data.revenue)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-gray-600">Net Profit:</span>
          <span className="text-xs font-medium">₹{new Intl.NumberFormat('en-IN').format(data.netProfit)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-gray-600">Phase:</span>
          <span className="text-xs font-medium px-2 py-1 rounded-md bg-gray-100 text-gray-700">
            {data.phase ? data.phase.charAt(0).toUpperCase() + data.phase.slice(1) : 'Unknown'}
          </span>
        </div>
        {data.cycleIntensity && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-gray-600">Intensity:</span>
            <span className="text-xs font-medium">{data.cycleIntensity}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Loading skeleton component
const CycleTimelineSkeleton = ({ height = 300 }: { height?: number }) => (
  <div 
    data-testid="cycle-timeline-skeleton"
    className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 animate-pulse"
    style={{ height: height + 80 }}
  >
    <div className="mb-4">
      <div className="h-6 bg-gray-200 rounded-lg w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-20 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Error state component
const CycleTimelineError = ({ error }: { error: string }) => (
  <div className="bg-red-50/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-red-100">
    <div className="flex items-center text-red-600">
      <svg 
        data-testid="error-icon"
        className="w-5 h-5 mr-3 flex-shrink-0" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <div>
        <div className="font-medium">Failed to load cycle timeline</div>
        <div className="text-sm mt-1">{error}</div>
      </div>
    </div>
  </div>
);

// Empty state component
const CycleTimelineEmpty = () => (
  <div className="bg-gray-50/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
    <div className="text-center text-gray-500">
      <div className="text-lg font-medium mb-2">No cycle data available</div>
      <div className="text-sm">Add financial data to see business cycle analysis</div>
    </div>
  </div>
);

// Utility to get safe phase colors with fallback
const getSafePhaseColors = (phase: PhaseType | string) => {
  try {
    const validPhases: PhaseType[] = ['expansion', 'contraction', 'transition', 'stable'];
    const safePhase = validPhases.includes(phase as PhaseType) ? phase as PhaseType : 'stable';
    const colors = getPhaseColors(safePhase);
    
    // Return simplified color structure
    return {
      background: '#e5e7eb', // fallback gray
      foreground: '#6b7280'  // fallback gray
    };
  } catch (error) {
    return {
      background: '#e5e7eb',
      foreground: '#6b7280'
    };
  }
};

export default function CycleTimeline({
  data,
  viewMode,
  showPhaseIntensity = false,
  showTrendLine = true,
  height = 300,
  loading = false,
  error = null,
  onPhaseClick,
  onPeriodHover,
}: CycleTimelineProps) {
  // Handle loading state
  if (loading) {
    return <CycleTimelineSkeleton height={height} />;
  }

  // Handle error state
  if (error) {
    return <CycleTimelineError error={error} />;
  }

  // Handle empty data
  if (!data || data.length === 0) {
    return <CycleTimelineEmpty />;
  }

  // Generate phase bands for visualization
  const phaseBands = useMemo(() => {
    const bands: Array<{
      x1: number;
      x2: number;
      phase: PhaseType;
      color: string;
    }> = [];

    let currentPhase = data[0]?.phase || 'stable';
    let bandStart = 0;

    data.forEach((item, index) => {
      const itemPhase = item.phase || 'stable';
      if (itemPhase !== currentPhase || index === data.length - 1) {
        const phaseColors = getSafePhaseColors(currentPhase);
        bands.push({
          x1: bandStart,
          x2: index === data.length - 1 && itemPhase === currentPhase ? index : index - 1,
          phase: currentPhase as PhaseType,
          color: phaseColors.background,
        });
        currentPhase = itemPhase;
        bandStart = index;
      }
    });

    return bands;
  }, [data]);

  // Format period labels based on view mode
  const formatPeriodLabel = useCallback((period: string) => {
    if (viewMode === 'quarterly') {
      return period.replace('FY', "'");
    }
    return period.replace('FY', 'FY');
  }, [viewMode]);

  // Handle chart interactions
  const handleChartMouseEnter = useCallback(() => {
    if (onPeriodHover) {
      onPeriodHover(data[0]?.period || null);
    }
  }, [data, onPeriodHover]);

  const handleChartMouseLeave = useCallback(() => {
    if (onPeriodHover) {
      onPeriodHover(null);
    }
  }, [onPeriodHover]);

  const handlePhaseAreaClick = useCallback((phase: PhaseType, period: string) => {
    if (onPhaseClick) {
      onPhaseClick(phase, period);
    }
  }, [onPhaseClick]);

  return (
    <div 
      className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 transition-all duration-200 hover:shadow-xl"
      data-view-mode={viewMode}
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Business Cycle Timeline
        </h3>
        <p className="text-sm text-gray-600">
          {viewMode === 'quarterly' ? 'Quarterly' : 'Annual'} view showing revenue trends and cycle phases
        </p>
      </div>

      {/* Chart Container */}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            onMouseEnter={handleChartMouseEnter}
            onMouseLeave={handleChartMouseLeave}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
              {showPhaseIntensity && (
                <linearGradient id="intensityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              )}
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
            
            <XAxis 
              dataKey="period"
              tickFormatter={formatPeriodLabel}
              stroke="#6b7280"
              fontSize={12}
              fontFamily="var(--font-sans)"
            />
            
            <YAxis 
              yAxisId="revenue"
              stroke="#6b7280"
              fontSize={12}
              fontFamily="var(--font-sans)"
              tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
            />
            
            {showPhaseIntensity && (
              <YAxis 
                yAxisId="intensity"
                orientation="right"
                stroke="#10b981"
                fontSize={12}
                fontFamily="var(--font-sans)"
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
              />
            )}

            {/* Phase background bands */}
            {phaseBands.map((band, index) => (
              <ReferenceArea
                key={`phase-band-${index}`}
                x1={band.x1}
                x2={band.x2}
                fill={band.color}
                fillOpacity={0.1}
                stroke="none"
                onClick={() => handlePhaseAreaClick(band.phase, data[band.x1]?.period || '')}
                style={{ cursor: onPhaseClick ? 'pointer' : 'default' }}
              />
            ))}

            <Tooltip content={<CustomTooltip />} />

            {/* Revenue trend area */}
            {showTrendLine && (
              <Area
                type="monotone"
                dataKey="revenue"
                yAxisId="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#revenueGradient)"
                fillOpacity={0.6}
              />
            )}

            {/* Phase intensity overlay */}
            {showPhaseIntensity && (
              <Area
                type="monotone"
                dataKey="cycleIntensity"
                stroke="#10b981"
                strokeWidth={1}
                fill="url(#intensityGradient)"
                fillOpacity={0.3}
                yAxisId="intensity"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-600">Revenue Trend</span>
        </div>
        {showPhaseIntensity && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Cycle Intensity</span>
          </div>
        )}
        <div className="flex items-center gap-4 ml-auto">
          {['expansion', 'contraction', 'transition', 'stable'].map((phase) => (
            <div key={phase} className="flex items-center gap-1">
              <div 
                className="w-3 h-2 rounded-sm bg-gray-300"
                style={{ opacity: 0.6 }}
              ></div>
              <span className="text-gray-600 capitalize">{phase}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 