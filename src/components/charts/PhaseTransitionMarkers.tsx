'use client';

import React, { useMemo } from 'react';
import { ReferenceLine, ReferenceArea } from 'recharts';
import { PhaseType, getPhaseColors } from '@/lib/design-tokens';

export interface PhaseTransition {
  fromPhase: PhaseType;
  toPhase: PhaseType;
  transitionDate: string; // Date or period identifier
  transitionIndex: number; // Index in the data array
  confidence: number; // 0-100 confidence in transition detection
  trigger: 'fundamental' | 'technical' | 'external' | 'mixed';
  severity: 'minor' | 'moderate' | 'major';
  duration: number; // Duration of transition in periods
  impact: {
    revenue: number; // % impact on revenue
    profitability: number; // % impact on margins
    volatility: number; // % change in volatility
  };
  context?: string; // Optional context description
  annotations?: string[]; // Additional notes
}

export interface PhaseTransitionMarkersProps {
  transitions: PhaseTransition[];
  chartData: Array<{
    period: string;
    [key: string]: any;
  }>;
  showTransitionLines?: boolean;
  showTransitionAreas?: boolean;
  showTransitionLabels?: boolean;
  showConfidenceIndicators?: boolean;
  showImpactMetrics?: boolean;
  showDetailedAnnotations?: boolean;
  enableTransitionTooltips?: boolean;
  enableTransitionClick?: boolean;
  highlightRecentTransitions?: boolean;
  transitionLineStyle?: 'solid' | 'dashed' | 'dotted';
  annotationPosition?: 'top' | 'bottom' | 'auto';
  compactMode?: boolean;
  onTransitionHover?: (transition: PhaseTransition | null) => void;
  onTransitionClick?: (transition: PhaseTransition) => void;
  onAnnotationClick?: (transition: PhaseTransition, annotation: string) => void;
}

const PhaseTransitionMarkers: React.FC<PhaseTransitionMarkersProps> = ({
  transitions,
  chartData,
  showTransitionLines = true,
  showTransitionAreas = false,
  showTransitionLabels = false,
  showConfidenceIndicators = false,
  showImpactMetrics = false,
  showDetailedAnnotations = false,
  enableTransitionTooltips = false,
  enableTransitionClick = false,
  highlightRecentTransitions = false,
  transitionLineStyle = 'solid',
  annotationPosition = 'auto',
  compactMode = false,
  onTransitionHover,
  onTransitionClick,
  onAnnotationClick,
}) => {
  // Check if transition is recent (within last 4 quarters)
  const isRecentTransition = (transitionDate: string): boolean => {
    // Simple heuristic - check if it contains "FY24" or "FY25"
    return transitionDate.includes('FY24') || transitionDate.includes('FY25');
  };

  // Memoized transition calculations
  const processedTransitions = useMemo(() => {
    return transitions.map(transition => {
      const severityColors = {
        minor: '#10B981', // Green
        moderate: '#F59E0B', // Yellow
        major: '#EF4444' // Red
      };

      const confidenceOpacity = transition.confidence / 100;
      
      return {
        ...transition,
        color: severityColors[transition.severity],
        opacity: Math.max(0.3, confidenceOpacity),
        strokeDasharray: transitionLineStyle === 'dashed' ? '5,5' : 
                         transitionLineStyle === 'dotted' ? '2,2' : undefined,
        isRecent: isRecentTransition(transition.transitionDate),
      };
    });
  }, [transitions, transitionLineStyle]);

  // Get transition direction colors
  const getTransitionAreaColor = (fromPhase: PhaseType, toPhase: PhaseType): string => {
    if (fromPhase === 'stable' && toPhase === 'expansion') return '#10B981'; // Green
    if (fromPhase === 'expansion' && toPhase === 'stable') return '#6B7280'; // Gray
    if (fromPhase === 'stable' && toPhase === 'contraction') return '#EF4444'; // Red
    if (fromPhase === 'contraction' && toPhase === 'stable') return '#F59E0B'; // Yellow
    return '#8B5CF6'; // Purple for other transitions
  };

  // Format transition label
  const getTransitionLabel = (transition: PhaseTransition): string => {
    if (compactMode) {
      return `${transition.fromPhase} → ${transition.toPhase}`;
    }
    
    let label = `${transition.fromPhase} → ${transition.toPhase}`;
    if (showConfidenceIndicators) {
      label += ` (${transition.confidence}%)`;
    }
    return label;
  };

  // Render transition markers
  const renderTransitionMarkers = () => {
    const markers: React.ReactElement[] = [];

    processedTransitions.forEach((transition, index) => {
      // Reference line for transition point
      if (showTransitionLines) {
        markers.push(
          <ReferenceLine
            key={`line-${index}`}
            x={transition.transitionIndex}
            stroke={transition.color}
            strokeWidth={transition.severity === 'major' ? 3 : 2}
            strokeDasharray={transition.strokeDasharray}
            strokeOpacity={transition.opacity}
                         label={showTransitionLabels ? {
               value: getTransitionLabel(transition),
               position: annotationPosition === 'top' ? 'top' : 
                        annotationPosition === 'bottom' ? 'bottom' : 'top'
             } : undefined}
          />
        );
      }

      // Reference area for transition duration
      if (showTransitionAreas && transition.duration > 1) {
        markers.push(
          <ReferenceArea
            key={`area-${index}`}
            x1={transition.transitionIndex}
            x2={transition.transitionIndex + transition.duration}
            fill={getTransitionAreaColor(transition.fromPhase, transition.toPhase)}
            fillOpacity={0.1}
          />
        );
      }
    });

    return markers;
  };

  // Render transition annotations
  const renderTransitionAnnotations = () => {
    if (!showDetailedAnnotations || compactMode) return null;

    return (
      <div className="mt-4 space-y-3">
        <h4 className="text-sm font-medium text-gray-900">Phase Transition Details</h4>
        {processedTransitions.map((transition, index) => (
          <div 
            key={index}
            className={`p-3 rounded-lg border ${
              transition.isRecent && highlightRecentTransitions 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 bg-gray-50'
            }`}
            data-testid={transition.isRecent ? 'recent-transition' : 'transition-marker'}
            onClick={() => enableTransitionClick && onTransitionClick?.(transition)}
            onMouseEnter={() => onTransitionHover?.(transition)}
            onMouseLeave={() => onTransitionHover?.(null)}
            style={{ 
              cursor: enableTransitionClick ? 'pointer' : 'default',
              opacity: transition.opacity 
            }}
            aria-label={`Phase transition from ${transition.fromPhase} to ${transition.toPhase} with ${transition.confidence}% confidence`}
            tabIndex={enableTransitionClick ? 0 : -1}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                                 <span className={`font-medium capitalize ${
                   transition.fromPhase === 'expansion' ? 'text-green-600' :
                   transition.fromPhase === 'contraction' ? 'text-red-600' :
                   transition.fromPhase === 'stable' ? 'text-gray-600' :
                   'text-yellow-600'
                 }`}>
                   {transition.fromPhase}
                 </span>
                 <span className="text-gray-400">→</span>
                 <span className={`font-medium capitalize ${
                   transition.toPhase === 'expansion' ? 'text-green-600' :
                   transition.toPhase === 'contraction' ? 'text-red-600' :
                   transition.toPhase === 'stable' ? 'text-gray-600' :
                   'text-yellow-600'
                 }`}>
                  {transition.toPhase}
                </span>
                {transition.isRecent && highlightRecentTransitions && (
                  <span className="px-2 py-1 text-xs font-bold bg-blue-600 text-white rounded-full">
                    NEW
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {transition.transitionDate}
              </span>
            </div>

            {showConfidenceIndicators && (
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Confidence</span>
                  <span>{transition.confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      transition.confidence >= 80 ? 'bg-green-500' :
                      transition.confidence >= 60 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${transition.confidence}%` }}
                  />
                </div>
              </div>
            )}

            {showImpactMetrics && (
              <div className="mb-2 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">Revenue: </span>
                  <span className={`font-medium ${
                    transition.impact.revenue >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transition.impact.revenue >= 0 ? '+' : ''}{transition.impact.revenue}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Profitability: </span>
                  <span className={`font-medium ${
                    transition.impact.profitability >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transition.impact.profitability >= 0 ? '+' : ''}{transition.impact.profitability}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Volatility: </span>
                  <span className={`font-medium ${
                    transition.impact.volatility <= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transition.impact.volatility >= 0 ? '+' : ''}{transition.impact.volatility}%
                  </span>
                </div>
              </div>
            )}

            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Trigger:</span>
                <span className={`font-medium capitalize ${
                  transition.trigger === 'fundamental' ? 'text-blue-600' :
                  transition.trigger === 'technical' ? 'text-purple-600' :
                  transition.trigger === 'external' ? 'text-orange-600' :
                  'text-gray-600'
                }`}>
                  {transition.trigger}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Severity:</span>
                <span className={`font-medium capitalize ${
                  transition.severity === 'major' ? 'text-red-600' :
                  transition.severity === 'moderate' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {transition.severity}
                </span>
              </div>
            </div>

            {transition.context && (
              <div className="mt-2 text-xs text-gray-700">
                {transition.context}
              </div>
            )}

            {transition.annotations && transition.annotations.length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-gray-600 mb-1">Key Events:</div>
                <ul className="text-xs space-y-1">
                  {transition.annotations.map((annotation, annotationIndex) => (
                    <li 
                      key={annotationIndex}
                      className="text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAnnotationClick?.(transition, annotation);
                      }}
                    >
                      • {annotation}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div 
      className={`phase-transition-markers ${compactMode ? 'compact' : ''}`}
      data-testid="phase-transition-markers"
      data-tooltip-enabled={enableTransitionTooltips}
    >
      {/* Render chart markers */}
      {renderTransitionMarkers()}
      
      {/* Render annotations below chart */}
      {renderTransitionAnnotations()}
      
      {/* Screen reader content */}
      <div className="sr-only">
        <p>Phase transition markers showing {transitions.length} transitions in the business cycle analysis.</p>
        {transitions.map((transition, index) => (
          <p key={index}>
            Transition {index + 1}: {transition.fromPhase} to {transition.toPhase} 
            on {transition.transitionDate} with {transition.confidence}% confidence.
          </p>
        ))}
      </div>
    </div>
  );
};

export default PhaseTransitionMarkers; 