'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { PhaseType } from '@/lib/design-tokens';

// Types and Interfaces
export type PeriodType = '1Y' | '3Y' | '5Y' | '10Y';

export interface FinancialDataPoint {
  period: string;
  year: number;
  revenue: number;
  netProfit: number;
  totalAssets: number;
}

export interface CAGRCalculationResult {
  cagr1Y: number;
  cagr3Y: number;
  cagr5Y: number;
  cagr10Y: number;
}

export interface CAGRData {
  period: string;
  cagr1Y: number;
  cagr3Y: number;
  cagr5Y: number;
  cagr10Y: number;
}

export interface CAGRTrendData {
  trend: 'accelerating' | 'decelerating' | 'stable';
  rate: number;
  consistency: 'consistent' | 'volatile' | 'irregular';
  volatility: {
    cagr1YVolatility: number;
    cagr3YVolatility: number;
    cagr5YVolatility: number;
    cagr10YVolatility: number;
  };
}

export interface CAGRPeriodSelectorProps {
  periods: PeriodType[];
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
  disabled?: boolean;
  loading?: boolean;
  showDescriptions?: boolean;
  compact?: boolean;
}

export interface CAGRIndicatorsProps {
  data: CAGRData[];
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
  onMetricClick?: (period: PeriodType, cagr: number, data: CAGRData) => void;
  showTrends?: boolean;
  showComparison?: boolean;
  showConfidence?: boolean;
  showVolatilityWarning?: boolean;
  showPeriodSelector?: boolean;
  showTooltips?: boolean;
  loading?: boolean;
  error?: string | null;
  height?: number;
}

// Core CAGR Calculation Functions
export function calculateCAGR(endValue: number, startValue: number, years: number): number {
  if (!endValue || !startValue || startValue === 0 || years <= 0) {
    if (endValue === 0 && startValue > 0) return -1; // Complete decline
    return 0;
  }
  
  if (endValue === startValue) return 0; // No growth
  
  // Handle negative values carefully
  if (startValue < 0 || endValue < 0) {
    if (years === 1) {
      return (endValue - startValue) / Math.abs(startValue);
    }
    return 0; // Can't calculate CAGR with negative values over multiple periods
  }
  
  return Math.pow(endValue / startValue, 1 / years) - 1;
}

export function calculateCAGRForPeriods(
  data: FinancialDataPoint[], 
  metric: 'revenue' | 'netProfit' | 'totalAssets'
): CAGRCalculationResult {
  if (!data || data.length < 2) {
    return { cagr1Y: 0, cagr3Y: 0, cagr5Y: 0, cagr10Y: 0 };
  }

  const latestValue = data[0][metric];
  
  const result: CAGRCalculationResult = {
    cagr1Y: 0,
    cagr3Y: 0,
    cagr5Y: 0,
    cagr10Y: 0
  };

  // 1Y CAGR
  if (data.length >= 2) {
    result.cagr1Y = calculateCAGR(latestValue, data[1][metric], 1);
  }

  // 3Y CAGR
  if (data.length >= 4) {
    result.cagr3Y = calculateCAGR(latestValue, data[3][metric], 3);
  }

  // 5Y CAGR
  if (data.length >= 6) {
    result.cagr5Y = calculateCAGR(latestValue, data[5][metric], 5);
  }

  // 10Y CAGR
  if (data.length >= 11) {
    result.cagr10Y = calculateCAGR(latestValue, data[10][metric], 10);
  }

  return result;
}

export function formatCAGRValue(cagr: number): string {
  const percentage = cagr * 100;
  if (percentage > 0) {
    return `+${percentage.toFixed(1)}%`;
  } else if (percentage < 0) {
    return `${percentage.toFixed(1)}%`;
  } else {
    return '0.0%';
  }
}

// CAGR Trend Analysis Class
export class CAGRTrendAnalysis {
  private data: CAGRData[];

  constructor(data: CAGRData[]) {
    this.data = data;
  }

  getConsistency(): { score: number; classification: 'consistent' | 'volatile' | 'irregular' } {
    if (this.data.length < 3) {
      return { score: 0, classification: 'irregular' };
    }

    // Calculate coefficient of variation for each CAGR period
    const periods: (keyof Pick<CAGRData, 'cagr1Y' | 'cagr3Y' | 'cagr5Y' | 'cagr10Y'>)[] = 
      ['cagr1Y', 'cagr3Y', 'cagr5Y', 'cagr10Y'];
    
    let totalConsistency = 0;
    let validPeriods = 0;

    periods.forEach(period => {
      const values = this.data.map(d => d[period]).filter(v => v !== 0);
      if (values.length >= 2) {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);
        const cv = Math.abs(mean) > 0.001 ? stdDev / Math.abs(mean) : 1;
        
        totalConsistency += Math.max(0, 1 - cv);
        validPeriods++;
      }
    });

    const score = validPeriods > 0 ? totalConsistency / validPeriods : 0;
    
    let classification: 'consistent' | 'volatile' | 'irregular';
    if (score >= 0.8) classification = 'consistent';
    else if (score >= 0.5) classification = 'volatile';
    else classification = 'irregular';

    return { score, classification };
  }

  getAcceleration(): { trend: 'accelerating' | 'decelerating' | 'stable'; rate: number } {
    if (this.data.length < 2) {
      return { trend: 'stable', rate: 0 };
    }

    // Compare recent 1Y CAGR vs longer-term CAGRs
    const latest = this.data[0];
    const shortTermTrend = latest.cagr1Y - latest.cagr3Y;
    const longTermTrend = latest.cagr3Y - latest.cagr5Y;
    
    const accelerationRate = (shortTermTrend + longTermTrend) / 2;

    let trend: 'accelerating' | 'decelerating' | 'stable';
    if (accelerationRate > 0.01) trend = 'accelerating';
    else if (accelerationRate < -0.01) trend = 'decelerating';
    else trend = 'stable';

    return { trend, rate: accelerationRate };
  }

  getVolatility(): CAGRTrendData['volatility'] {
    const periods: (keyof Pick<CAGRData, 'cagr1Y' | 'cagr3Y' | 'cagr5Y' | 'cagr10Y'>)[] = 
      ['cagr1Y', 'cagr3Y', 'cagr5Y', 'cagr10Y'];
    
    const volatility: CAGRTrendData['volatility'] = {
      cagr1YVolatility: 0,
      cagr3YVolatility: 0,
      cagr5YVolatility: 0,
      cagr10YVolatility: 0
    };

    periods.forEach(period => {
      const values = this.data.map(d => d[period]).filter(v => v !== 0);
      if (values.length >= 2) {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);
        
        const volatilityKey = `${period}Volatility` as keyof CAGRTrendData['volatility'];
        volatility[volatilityKey] = stdDev;
      }
    });

    return volatility;
  }
}

// Period descriptions for tooltips
const PERIOD_DESCRIPTIONS: Record<PeriodType, string> = {
  '1Y': '1 Year Compound Annual Growth Rate - Recent performance indicator',
  '3Y': '3 Year Compound Annual Growth Rate - Medium-term trend analysis',
  '5Y': '5 Year Compound Annual Growth Rate - Long-term sustainable growth',
  '10Y': '10 Year Compound Annual Growth Rate - Historical growth consistency'
};

// CAGR Period Selector Component
export const CAGRPeriodSelector: React.FC<CAGRPeriodSelectorProps> = ({
  periods,
  selectedPeriod,
  onPeriodChange,
  disabled = false,
  loading = false,
  showDescriptions = false,
  compact = false
}) => {
  const [hoveredPeriod, setHoveredPeriod] = useState<PeriodType | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-sm text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className={`flex ${compact ? 'gap-1' : 'gap-2'} flex-wrap`}>
        {periods.map((period) => (
          <button
            key={period}
            onClick={() => !disabled && onPeriodChange(period)}
            onMouseEnter={() => showDescriptions && setHoveredPeriod(period)}
            onMouseLeave={() => setHoveredPeriod(null)}
            disabled={disabled}
            className={`
              ${compact ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'}
              font-medium rounded-lg transition-all duration-200
              ${selectedPeriod === period
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            `}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Tooltip for period descriptions */}
      {showDescriptions && hoveredPeriod && (
        <div className="absolute z-10 mt-2 p-3 bg-black text-white text-xs rounded-lg shadow-lg max-w-xs">
          {PERIOD_DESCRIPTIONS[hoveredPeriod]}
          <div className="absolute -top-1 left-4 w-2 h-2 bg-black transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};

// Main CAGR Indicators Component
export const CAGRIndicators: React.FC<CAGRIndicatorsProps> = ({
  data,
  selectedPeriod,
  onPeriodChange,
  onMetricClick,
  showTrends = false,
  showComparison = false,
  showConfidence = false,
  showVolatilityWarning = false,
  showPeriodSelector = true,
  showTooltips = false,
  loading = false,
  error = null,
  height = 300
}) => {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  // Calculate trend analysis
  const trendAnalysis = useMemo(() => {
    if (data.length < 2) return null;
    return new CAGRTrendAnalysis(data);
  }, [data]);

  // Get current CAGR value
  const getCurrentCAGR = useCallback((period: PeriodType): number => {
    if (!data || data.length === 0) return 0;
    const latest = data[0];
    
    switch (period) {
      case '1Y': return latest.cagr1Y;
      case '3Y': return latest.cagr3Y;
      case '5Y': return latest.cagr5Y;
      case '10Y': return latest.cagr10Y;
      default: return 0;
    }
  }, [data]);

  // Get period comparison
  const getPeriodComparison = useCallback((period: PeriodType): number => {
    if (!data || data.length < 2) return 0;
    
    const current = getCurrentCAGR(period);
    const periodKey = `cagr${period.replace('Y', 'Y')}` as keyof CAGRData;
    const previous = data[1][periodKey] as number;
    
    return current - previous;
  }, [data, getCurrentCAGR]);

  // Get trend indicator
  const getTrendIndicator = useCallback((period: PeriodType): string => {
    if (!trendAnalysis) return '→';
    
    const acceleration = trendAnalysis.getAcceleration();
    if (acceleration.trend === 'accelerating') return '↗';
    if (acceleration.trend === 'decelerating') return '↘';
    return '→';
  }, [trendAnalysis]);

  // Get confidence score
  const getConfidenceScore = useCallback((): number => {
    if (!trendAnalysis) return 0;
    return trendAnalysis.getConsistency().score;
  }, [trendAnalysis]);

  // Get volatility warning
  const getVolatilityWarning = useCallback((period: PeriodType): boolean => {
    if (!trendAnalysis) return false;
    
    const volatility = trendAnalysis.getVolatility();
    const threshold = 0.05; // 5% volatility threshold
    
    switch (period) {
      case '1Y': return volatility.cagr1YVolatility > threshold;
      case '3Y': return volatility.cagr3YVolatility > threshold;
      case '5Y': return volatility.cagr5YVolatility > threshold;
      case '10Y': return volatility.cagr10YVolatility > threshold;
      default: return false;
    }
  }, [trendAnalysis]);

  // Handle metric click
  const handleMetricClick = useCallback((period: PeriodType) => {
    if (!onMetricClick || !data || data.length === 0) return;
    
    const cagr = getCurrentCAGR(period);
    onMetricClick(period, cagr, data[0]);
  }, [onMetricClick, data, getCurrentCAGR]);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6" style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <div className="text-sm text-gray-500">Loading CAGR indicators...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6" style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-red-600">
            <div className="text-lg font-medium mb-2">Error</div>
            <div className="text-sm">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6" style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <div className="text-lg font-medium mb-2">No Data Available</div>
            <div className="text-sm">Insufficient data for CAGR calculation. Need at least 2 years of data.</div>
          </div>
        </div>
      </div>
    );
  }

  const currentCAGR = getCurrentCAGR(selectedPeriod);
  const comparison = showComparison ? getPeriodComparison(selectedPeriod) : 0;
  const trendIndicator = showTrends ? getTrendIndicator(selectedPeriod) : '';
  const confidence = showConfidence ? getConfidenceScore() : 0;
  const isVolatile = showVolatilityWarning ? getVolatilityWarning(selectedPeriod) : false;

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 p-6" 
      style={{ height }}
      aria-label="CAGR Indicators"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">CAGR Analysis</h3>
        {showConfidence && (
          <div className="text-sm text-gray-600">
            Confidence: {(confidence * 100).toFixed(0)}%
          </div>
        )}
      </div>

      {/* Period Selector */}
      {showPeriodSelector && (
        <div className="mb-6">
          <CAGRPeriodSelector
            periods={['1Y', '3Y', '5Y', '10Y']}
            selectedPeriod={selectedPeriod}
            onPeriodChange={onPeriodChange}
            showDescriptions={showTooltips}
          />
        </div>
      )}

      {/* Main CAGR Display */}
      <div className="text-center mb-6">
        <div className="relative">
          <div
            className={`text-4xl font-bold cursor-pointer transition-colors ${
              currentCAGR >= 0 ? 'text-green-600' : 'text-red-600'
            } hover:opacity-80`}
            onClick={() => handleMetricClick(selectedPeriod)}
            onMouseEnter={() => showTooltips && setHoveredMetric(selectedPeriod)}
            onMouseLeave={() => setHoveredMetric(null)}
          >
            {formatCAGRValue(currentCAGR)}
            {showTrends && (
              <span className="ml-2 text-2xl">{trendIndicator}</span>
            )}
          </div>
          
          <div className="text-sm text-gray-600 mt-1">
            {selectedPeriod} CAGR
          </div>

          {showComparison && Math.abs(comparison) > 0.001 && (
            <div className={`text-xs mt-1 ${comparison >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCAGRValue(comparison)} vs previous
            </div>
          )}

          {/* Volatility Warning */}
          {isVolatile && (
            <div className="text-xs text-amber-600 mt-1 flex items-center justify-center">
              ⚠️ Volatile
            </div>
          )}

          {/* Tooltip */}
          {showTooltips && hoveredMetric === selectedPeriod && (
            <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-black text-white text-xs rounded-lg shadow-lg max-w-xs">
              Compound Annual Growth Rate over {selectedPeriod.replace('Y', ' year')}
              {selectedPeriod !== '1Y' ? 's' : ''}. 
              Shows the geometric mean of annual returns.
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {(['1Y', '3Y', '5Y', '10Y'] as PeriodType[])
          .filter(period => period !== selectedPeriod)
          .slice(0, 3)
          .map(period => {
            const value = getCurrentCAGR(period);
            return (
              <div 
                key={period}
                className="text-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onPeriodChange(period)}
              >
                <div className={`text-lg font-semibold ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCAGRValue(value)}
                </div>
                <div className="text-xs text-gray-600">{period}</div>
              </div>
            );
          })}
      </div>

      {/* Trend Analysis Summary */}
      {showTrends && trendAnalysis && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-600 text-center">
            Growth is {trendAnalysis.getAcceleration().trend} with{' '}
            {trendAnalysis.getConsistency().classification} patterns
          </div>
        </div>
      )}
    </div>
  );
}; 