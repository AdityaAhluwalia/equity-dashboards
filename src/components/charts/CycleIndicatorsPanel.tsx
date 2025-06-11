'use client';

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  Cell,
} from 'recharts';
import { PhaseType, getPhaseColors } from '@/lib/design-tokens';

export interface CycleIndicatorData {
  phase: PhaseType;
  momentum: number; // -100 to 100 scale
  strength: number; // 0-100 scale
  duration: number; // quarters in current phase
  transitionProbability: number; // 0-100 probability of phase change
  volatility: number; // 0-100 measure of cycle volatility
  confidence: number; // 0-100 confidence in phase classification
  trend: 'accelerating' | 'decelerating' | 'stable';
  nextPhase?: PhaseType;
  nextPhaseConfidence?: number;
}

export interface CycleIndicatorsPanelProps {
  currentIndicators: CycleIndicatorData;
  historicalMomentum?: Array<{
    period: string;
    momentum: number;
    phase: PhaseType;
  }>;
  showMomentumChart?: boolean;
  showStrengthGauge?: boolean;
  showTransitionMatrix?: boolean;
  showVolatilityIndicator?: boolean;
  showConfidenceMetrics?: boolean;
  showTrendAnalysis?: boolean;
  enablePhaseComparison?: boolean;
  compactMode?: boolean;
  height?: number;
  loading?: boolean;
  error?: string | null;
  onPhaseClick?: (phase: PhaseType) => void;
  onMomentumClick?: (momentum: number, period: string) => void;
  onTransitionClick?: (fromPhase: PhaseType, toPhase: PhaseType, probability: number) => void;
}

const CycleIndicatorsPanel: React.FC<CycleIndicatorsPanelProps> = ({
  currentIndicators,
  historicalMomentum = [],
  showMomentumChart = false,
  showStrengthGauge = false,
  showTransitionMatrix = false,
  showVolatilityIndicator = false,
  showConfidenceMetrics = false,
  showTrendAnalysis = false,
  enablePhaseComparison = false,
  compactMode = false,
  height = 400,
  loading = false,
  error = null,
  onPhaseClick,
  onMomentumClick,
  onTransitionClick,
}) => {
  // Memoized momentum chart data preparation
  const momentumChartData = useMemo(() => {
    return historicalMomentum.map(item => ({
      ...item,
      absValue: Math.abs(item.momentum),
      isPositive: item.momentum >= 0,
      color: item.momentum >= 0 ? '#10B981' : '#EF4444',
      phaseColor: getPhaseColors(item.phase).primary,
    }));
  }, [historicalMomentum]);

  // Memoized strength gauge data
  const strengthGaugeData = useMemo(() => {
    const strength = Math.max(0, Math.min(100, currentIndicators.strength || 0));
    return [
      {
        name: 'Strength',
        value: strength,
        fill: strength >= 70 ? '#10B981' : strength >= 40 ? '#F59E0B' : '#EF4444'
      }
    ];
  }, [currentIndicators.strength]);

  // Get strength classification
  const getStrengthLabel = (strength: number) => {
    if (strength >= 70) return 'Strong';
    if (strength >= 40) return 'Moderate';
    return 'Weak';
  };

  // Get volatility classification
  const getVolatilityLabel = (volatility: number) => {
    if (volatility >= 70) return 'High';
    if (volatility >= 40) return 'Moderate';
    return 'Low';
  };

  // Get confidence classification
  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 70) return 'High';
    if (confidence >= 50) return 'Medium';
    return 'Low';
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'accelerating': return '↗️';
      case 'decelerating': return '↘️';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  // Custom tooltip for momentum chart
  const MomentumTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length && label) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3 max-w-sm">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Momentum:</span>
              <span className={`font-medium ${data.momentum >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.momentum >= 0 ? '+' : ''}{data.momentum}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phase:</span>
              <span className={`font-medium capitalize ${
                data.phase === 'expansion' ? 'text-green-600' :
                data.phase === 'contraction' ? 'text-red-600' :
                data.phase === 'stable' ? 'text-gray-600' :
                'text-yellow-600'
              }`}>
                {data.phase}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Loading state
  if (loading) {
    return (
      <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 ${compactMode ? 'compact' : ''}`} style={{ height }}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
        <div className="text-center text-gray-500 mt-8">Loading cycle indicators...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-red-200 p-6 ${compactMode ? 'compact' : ''}`} style={{ height }}>
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error Loading Data</div>
          <div className="text-red-500 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  // Handle invalid data
  const safeIndicators = {
    ...currentIndicators,
    momentum: isNaN(currentIndicators.momentum) ? 0 : currentIndicators.momentum,
    strength: Math.max(0, Math.min(100, currentIndicators.strength || 0)),
    volatility: Math.max(0, Math.min(100, currentIndicators.volatility || 0)),
    confidence: Math.max(0, Math.min(100, currentIndicators.confidence || 0)),
  };

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 transition-all duration-300 hover:shadow-xl ${compactMode ? 'compact' : ''}`}>
      <div className="mb-4">
        <h3 role="heading" className="text-lg font-semibold text-gray-900 mb-1">
          Cycle Indicators
        </h3>
        <p className="text-sm text-gray-600">
          Current phase momentum and transition analysis
        </p>
      </div>

      {/* Current Phase Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div 
              className={`text-xl font-bold capitalize cursor-pointer hover:opacity-80 transition-opacity ${
                safeIndicators.phase === 'expansion' ? 'text-green-600' :
                safeIndicators.phase === 'contraction' ? 'text-red-600' :
                safeIndicators.phase === 'stable' ? 'text-gray-600' :
                'text-yellow-600'
              }`}
              onClick={() => onPhaseClick?.(safeIndicators.phase)}
            >
              {safeIndicators.phase}
            </div>
            <div className="text-xs text-gray-500">Current Phase</div>
          </div>
          
          <div className="text-center">
            <div className={`text-xl font-bold ${safeIndicators.momentum >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {safeIndicators.momentum >= 0 ? '+' : ''}{safeIndicators.momentum}
            </div>
            <div className="text-xs text-gray-500">Momentum</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">
              {safeIndicators.strength}%
            </div>
            <div className="text-xs text-gray-500">Strength</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">
              {safeIndicators.duration}
            </div>
            <div className="text-xs text-gray-500">Duration (Q)</div>
          </div>
        </div>
      </div>

      <div className={`grid ${compactMode ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6`}>
        {/* Momentum Chart */}
        {showMomentumChart && historicalMomentum.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-3">Momentum Trend</h4>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={momentumChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  onClick={(data) => {
                    if (data && data.activePayload && data.activePayload[0]) {
                      const item = data.activePayload[0].payload;
                      onMomentumClick?.(item.momentum, item.period);
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="period"
                    tick={{ fontSize: 10, fill: '#6B7280' }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    domain={[-100, 100]}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip content={<MomentumTooltip />} />
                  <Bar dataKey="momentum" radius={[2, 2, 0, 0]}>
                    {momentumChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Strength Gauge */}
        {showStrengthGauge && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-3">Phase Strength</h4>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="60%" 
                  outerRadius="80%" 
                  data={strengthGaugeData}
                  startAngle={90} 
                  endAngle={450}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar 
                    dataKey="value" 
                    cornerRadius={10} 
                    label={{ position: 'center', fontSize: 20, fontWeight: 'bold' }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center">
              <span className={`text-sm font-medium ${
                safeIndicators.strength >= 70 ? 'text-green-600' :
                safeIndicators.strength >= 40 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {getStrengthLabel(safeIndicators.strength)}
              </span>
            </div>
          </div>
        )}

        {/* Transition Matrix */}
        {showTransitionMatrix && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-3">Transition Probability</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Probability of Change:</span>
                <span className="font-medium text-blue-600">{safeIndicators.transitionProbability}%</span>
              </div>
              
              {safeIndicators.nextPhase && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Most Likely Next:</span>
                  <span 
                    className={`font-medium capitalize cursor-pointer hover:opacity-80 ${
                      safeIndicators.nextPhase === 'expansion' ? 'text-green-600' :
                      safeIndicators.nextPhase === 'contraction' ? 'text-red-600' :
                      safeIndicators.nextPhase === 'stable' ? 'text-gray-600' :
                      'text-yellow-600'
                    }`}
                    onClick={() => safeIndicators.nextPhase && onTransitionClick?.(
                      safeIndicators.phase, 
                      safeIndicators.nextPhase, 
                      safeIndicators.nextPhaseConfidence || 0
                    )}
                  >
                    {safeIndicators.nextPhase}
                  </span>
                </div>
              )}
              
              {safeIndicators.nextPhaseConfidence && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Confidence:</span>
                  <span className="font-medium text-purple-600">{safeIndicators.nextPhaseConfidence}%</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Volatility Indicator */}
        {showVolatilityIndicator && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-3">Volatility</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Level:</span>
                <span className="font-medium text-blue-600">{safeIndicators.volatility}%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Classification:</span>
                <span className={`font-medium ${
                  safeIndicators.volatility >= 70 ? 'text-red-600' :
                  safeIndicators.volatility >= 40 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {getVolatilityLabel(safeIndicators.volatility)}
                </span>
              </div>
              
              {/* Volatility bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    safeIndicators.volatility >= 70 ? 'bg-red-500' :
                    safeIndicators.volatility >= 40 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${safeIndicators.volatility}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Confidence Metrics */}
        {showConfidenceMetrics && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-3">Confidence</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Overall:</span>
                <span className="font-medium text-blue-600">{safeIndicators.confidence}%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Level:</span>
                <span className={`font-medium ${
                  safeIndicators.confidence >= 70 ? 'text-green-600' :
                  safeIndicators.confidence >= 50 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {getConfidenceLabel(safeIndicators.confidence)}
                </span>
              </div>
              
              {/* Confidence bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    safeIndicators.confidence >= 70 ? 'bg-green-500' :
                    safeIndicators.confidence >= 50 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${safeIndicators.confidence}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Trend Analysis */}
        {showTrendAnalysis && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-3">Trend Analysis</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Direction:</span>
                <span className="font-medium text-blue-600 flex items-center gap-1">
                  {getTrendIcon(safeIndicators.trend)}
                  <span className="capitalize">{safeIndicators.trend}</span>
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Duration:</span>
                <span className="font-medium text-purple-600">{safeIndicators.duration} quarters</span>
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                Trend based on momentum and phase progression analysis
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Phase Comparison (when enabled) */}
      {enablePhaseComparison && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-3">Phase Comparison</h4>
          <div className="grid grid-cols-4 gap-2 text-center">
            {(['expansion', 'stable', 'transition', 'contraction'] as PhaseType[]).map(phase => (
              <div 
                key={phase}
                className={`p-2 rounded cursor-pointer transition-all duration-200 hover:opacity-80 ${
                  phase === safeIndicators.phase 
                    ? `${getPhaseColors(phase).background} ${getPhaseColors(phase).text}` 
                    : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => onPhaseClick?.(phase)}
              >
                <div className={`text-sm font-medium capitalize ${
                  phase === safeIndicators.phase ? 'text-white' : ''
                }`}>
                  {phase}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CycleIndicatorsPanel; 