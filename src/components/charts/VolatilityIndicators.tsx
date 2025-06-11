'use client';

import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { PhaseType } from '@/lib/design-tokens';

export interface VolatilityMetric {
  period: string;
  value: number;
  volatility: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'extreme';
  standardDeviation: number;
  variance: number;
  coefficient: number; // Coefficient of variation
  trend: 'increasing' | 'decreasing' | 'stable';
  phase?: PhaseType;
}

export interface HeatmapData {
  metric: string;
  periods: Array<{
    period: string;
    value: number;
    volatility: number;
    normalizedValue: number; // 0-1 scale for heatmap coloring
    riskLevel: 'low' | 'moderate' | 'high' | 'extreme';
  }>;
}

export interface VolatilityIndicatorsProps {
  data: VolatilityMetric[];
  heatmapData?: HeatmapData[];
  showVolatilityTrend?: boolean;
  showRiskLevels?: boolean;
  showHeatmap?: boolean;
  showStatistics?: boolean;
  showAlerts?: boolean;
  showComparative?: boolean;
  enableInteraction?: boolean;
  enableTooltips?: boolean;
  volatilityThresholds?: {
    low: number;
    moderate: number;
    high: number;
    extreme: number;
  };
  heatmapConfig?: {
    colorScheme: 'risk' | 'performance' | 'custom';
    cellSize: 'small' | 'medium' | 'large';
    showValues: boolean;
    showGradient: boolean;
  };
  timeRange?: '3M' | '6M' | '1Y' | '2Y' | '5Y' | 'ALL';
  compactMode?: boolean;
  onMetricHover?: (metric: VolatilityMetric | null) => void;
  onMetricClick?: (metric: VolatilityMetric) => void;
  onHeatmapCellClick?: (data: HeatmapData, period: string) => void;
  onAlertClick?: (alert: any) => void;
}

const VolatilityIndicators: React.FC<VolatilityIndicatorsProps> = ({
  data,
  heatmapData,
  showVolatilityTrend = false,
  showRiskLevels = false,
  showHeatmap = false,
  showStatistics = false,
  showAlerts = false,
  showComparative = false,
  enableInteraction = false,
  enableTooltips = false,
  volatilityThresholds = {
    low: 15,
    moderate: 25,
    high: 35,
    extreme: 50
  },
  heatmapConfig = {
    colorScheme: 'risk',
    cellSize: 'medium',
    showValues: true,
    showGradient: false
  },
  timeRange = 'ALL',
  compactMode = false,
  onMetricHover,
  onMetricClick,
  onHeatmapCellClick,
  onAlertClick,
}) => {
  const [hoveredMetric, setHoveredMetric] = useState<VolatilityMetric | null>(null);

  // Validate and filter data
  const validData = useMemo(() => {
    return data.filter(item => 
      item && 
      typeof item.volatility === 'number' && 
      !isNaN(item.volatility) && 
      isFinite(item.volatility)
    );
  }, [data]);

  const hasValidData = validData.length > 0;
  const hasDataError = data.length > 0 && validData.length === 0;

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!hasValidData) return null;
    
    const volatilities = validData.map(d => d.volatility);
    const avg = volatilities.reduce((sum, v) => sum + v, 0) / volatilities.length;
    const max = Math.max(...volatilities);
    const min = Math.min(...volatilities);
    
    const sorted = [...volatilities].sort((a, b) => a - b);
    const q1Index = Math.floor(sorted.length * 0.25);
    const q3Index = Math.floor(sorted.length * 0.75);
    
    return {
      average: avg,
      maximum: max,
      minimum: min,
      q25: sorted[q1Index],
      q75: sorted[q3Index],
    };
  }, [validData, hasValidData]);

  // Calculate alerts
  const alerts = useMemo(() => {
    if (!showAlerts || !hasValidData) return [];
    
    const alertList = [];
    
    // High volatility alerts
    const highVolatilityItems = validData.filter(item => item.volatility > volatilityThresholds.high);
    if (highVolatilityItems.length > 0) {
      alertList.push({
        type: 'high_volatility',
        severity: 'warning',
        message: 'High volatility detected',
        count: highVolatilityItems.length,
        periods: highVolatilityItems.map(item => item.period)
      });
    }
    
    // Trend change alerts
    const trendChanges = validData.filter((item, index) => {
      if (index === 0) return false;
      const prevItem = validData[index - 1];
      return item.trend !== prevItem.trend;
    });
    
    if (trendChanges.length > 0) {
      alertList.push({
        type: 'trend_change',
        severity: 'info',
        message: 'Volatility trend change',
        count: trendChanges.length,
        periods: trendChanges.map(item => item.period)
      });
    }
    
    return alertList;
  }, [validData, showAlerts, hasValidData, volatilityThresholds.high]);

  // Risk level colors
  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return '#10B981'; // Green
      case 'moderate': return '#F59E0B'; // Yellow
      case 'high': return '#EF4444'; // Red
      case 'extreme': return '#7C2D12'; // Dark red
      default: return '#6B7280'; // Gray
    }
  };

  const getRiskLevelBgColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'extreme': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Heatmap cell colors
  const getHeatmapCellColor = (normalizedValue: number, colorScheme: string) => {
    const intensity = Math.max(0, Math.min(1, normalizedValue));
    
    if (colorScheme === 'risk') {
      const red = Math.floor(255 * intensity);
      const green = Math.floor(255 * (1 - intensity));
      return `rgb(${red}, ${green}, 100)`;
    } else if (colorScheme === 'performance') {
      const green = Math.floor(255 * intensity);
      const red = Math.floor(255 * (1 - intensity));
      return `rgb(${red}, ${green}, 150)`;
    }
    
    return `rgba(59, 130, 246, ${intensity})`;
  };

  // Calculate comparative metrics
  const comparativeMetrics = useMemo(() => {
    if (!showComparative || validData.length < 2) return null;
    
    const periodChanges = validData.map((item, index) => {
      if (index === 0) return { period: item.period, change: 0 };
      
      const prevVolatility = validData[index - 1].volatility;
      const change = ((item.volatility - prevVolatility) / prevVolatility) * 100;
      
      return {
        period: item.period,
        change: change
      };
    });
    
    return {
      periodChanges,
      ranking: [...validData].sort((a, b) => b.volatility - a.volatility)
    };
  }, [validData, showComparative]);

  // Handle metric interactions
  const handleMetricHover = (metric: VolatilityMetric | null) => {
    setHoveredMetric(metric);
    onMetricHover?.(metric);
  };

  const handleMetricClick = (metric: VolatilityMetric) => {
    onMetricClick?.(metric);
  };

  // Time range display
  const getTimeRangeDisplay = (range: string) => {
    switch (range) {
      case '3M': return 'Last 3 months';
      case '6M': return 'Last 6 months';
      case '1Y': return 'Last 1 year';
      case '2Y': return 'Last 2 years';
      case '5Y': return 'Last 5 years';
      default: return 'All time';
    }
  };

  if (hasDataError) {
    return (
      <div 
        className={`volatility-indicators ${compactMode ? 'compact' : ''}`}
        data-testid="volatility-indicators"
      >
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">Data error: Unable to process volatility data</p>
        </div>
      </div>
    );
  }

  if (!hasValidData) {
    return (
      <div 
        className={`volatility-indicators ${compactMode ? 'compact' : ''}`}
        data-testid="volatility-indicators"
      >
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No volatility data available</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`volatility-indicators space-y-6 ${compactMode ? 'compact space-y-4' : ''}`}
      data-testid="volatility-indicators"
      data-interactive={enableInteraction}
    >
      {/* Time Range Display */}
      {timeRange !== 'ALL' && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">Time Range:</span> {getTimeRangeDisplay(timeRange)}
        </div>
      )}

      {/* Volatility Trend Chart */}
      {showVolatilityTrend && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Volatility Trend</h3>
          
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={validData} aria-label="Volatility trend chart">
                <CartesianGrid strokeDasharray="3,3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                {enableTooltips && <Tooltip />}
                <Bar dataKey="volatility" radius={[4, 4, 0, 0]}>
                  {validData.map((entry, index) => (
                    <Cell 
                      key={index} 
                      fill={getRiskLevelColor(entry.riskLevel)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Display volatility values */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {validData.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-sm text-gray-600">{item.period}</div>
                <div className="text-lg font-semibold">{item.volatility.toFixed(1)}%</div>
                <div className="text-xs text-gray-500 capitalize">
                  {item.trend}
                  {item.trend === 'increasing' && ' ↗'}
                  {item.trend === 'decreasing' && ' ↘'}
                  {item.trend === 'stable' && ' →'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Levels */}
      {showRiskLevels && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {['low', 'moderate', 'high', 'extreme'].map(level => {
              const count = validData.filter(item => item.riskLevel === level).length;
              return (
                <div key={level} className="text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelBgColor(level)}`}>
                    {level}
                  </span>
                  <div className="mt-2 text-sm text-gray-600">{count} periods</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Statistics */}
      {showStatistics && statistics && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Volatility Analysis</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">Average Volatility</div>
              <div className="text-xl font-semibold">{statistics.average.toFixed(1)}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Maximum Volatility</div>
              <div className="text-xl font-semibold text-red-600">{statistics.maximum.toFixed(1)}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Minimum Volatility</div>
              <div className="text-xl font-semibold text-green-600">{statistics.minimum.toFixed(1)}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">75th Percentile</div>
              <div className="text-xl font-semibold">{statistics.q75.toFixed(1)}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">25th Percentile</div>
              <div className="text-xl font-semibold">{statistics.q25.toFixed(1)}%</div>
            </div>
          </div>

          {/* Detailed statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {validData.map((item, index) => (
              <div 
                key={index}
                className={`p-4 border rounded-lg ${enableInteraction ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                data-testid="volatility-metric"
                onMouseEnter={() => enableInteraction && handleMetricHover(item)}
                onMouseLeave={() => enableInteraction && handleMetricHover(null)}
                onClick={() => enableInteraction && handleMetricClick(item)}
                tabIndex={enableInteraction ? 0 : -1}
              >
                <div className="font-medium">{item.period}</div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Standard Deviation: <span className="font-medium">{item.standardDeviation}</span></div>
                  <div>Variance: <span className="font-medium">{item.variance.toFixed(2)}</span></div>
                  <div>Coefficient of Variation: <span className="font-medium">{item.coefficient}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerts */}
      {showAlerts && alerts.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Volatility Alerts</h3>
          
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  alert.severity === 'warning' 
                    ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' 
                    : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                }`}
                data-testid="volatility-alert"
                onClick={() => onAlertClick?.(alert)}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {alert.message}
                  </div>
                  <div className="text-sm text-gray-600">
                    {alert.count} period{alert.count !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Periods: {alert.periods.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparative Analysis */}
      {showComparative && comparativeMetrics && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparative Analysis</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Period Comparison */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Period Comparison</h4>
              <div className="space-y-2">
                {comparativeMetrics.periodChanges.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{item.period}</span>
                    <span className={`text-sm font-medium ${
                      item.change > 0 ? 'text-red-600' : 
                      item.change < 0 ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Volatility Ranking */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Volatility Ranking</h4>
              <div className="space-y-2">
                {comparativeMetrics.ranking.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      #{index + 1} {item.period}
                    </span>
                    <span className="text-sm font-medium">
                      {item.volatility.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Heatmap */}
      {showHeatmap && heatmapData && heatmapData.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Volatility Heatmap</h3>
          
          <div 
            className="overflow-x-auto"
            data-testid="volatility-heatmap"
          >
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2 text-sm font-medium text-gray-600">Metric</th>
                  {heatmapData[0]?.periods.map(period => (
                    <th key={period.period} className="text-center p-2 text-sm font-medium text-gray-600">
                      {period.period}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="p-2 text-sm font-medium text-gray-900">
                      {row.metric}
                    </td>
                    {row.periods.map((cell, cellIndex) => (
                      <td 
                        key={cellIndex}
                        className={`p-2 text-center cursor-pointer transition-all ${
                          heatmapConfig.cellSize === 'small' ? 'w-12 h-12' :
                          heatmapConfig.cellSize === 'large' ? 'w-20 h-20' : 'w-16 h-16'
                        }`}
                        data-testid="heatmap-cell"
                        style={{
                          backgroundColor: getHeatmapCellColor(cell.normalizedValue, heatmapConfig.colorScheme)
                        }}
                        onClick={() => enableInteraction && onHeatmapCellClick?.(row, cell.period)}
                      >
                        {heatmapConfig.showValues && (
                          <div className="text-xs font-medium">
                            {cell.volatility.toFixed(1)}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showHeatmap && (!heatmapData || heatmapData.length === 0) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Volatility Heatmap</h3>
          <div className="text-center text-gray-600 py-8">
            No heatmap data available
          </div>
        </div>
      )}

      {/* Screen reader content */}
      <div className="sr-only">
        <p>Volatility analysis showing {validData.length} periods with various risk levels and statistical metrics.</p>
        {statistics && (
          <p>
            Average volatility is {statistics.average.toFixed(1)}%, ranging from {statistics.minimum.toFixed(1)}% to {statistics.maximum.toFixed(1)}%.
          </p>
        )}
      </div>
    </div>
  );
};

export default VolatilityIndicators; 