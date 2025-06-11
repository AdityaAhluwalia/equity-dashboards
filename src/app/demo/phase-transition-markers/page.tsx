'use client';

import React, { useState } from 'react';
import PhaseTransitionMarkers, { PhaseTransition } from '@/components/charts/PhaseTransitionMarkers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const mockTransitions: PhaseTransition[] = [
  {
    fromPhase: 'stable',
    toPhase: 'expansion',
    transitionDate: 'Q2 FY22',
    transitionIndex: 2,
    confidence: 85,
    trigger: 'fundamental',
    severity: 'moderate',
    duration: 1,
    impact: {
      revenue: 15.5,
      profitability: 8.2,
      volatility: 12.0
    },
    context: 'Strong product launch and market expansion',
    annotations: ['New product line launched', 'Market share increased by 3%']
  },
  {
    fromPhase: 'expansion',
    toPhase: 'stable',
    transitionDate: 'Q4 FY22',
    transitionIndex: 4,
    confidence: 72,
    trigger: 'technical',
    severity: 'minor',
    duration: 2,
    impact: {
      revenue: -2.1,
      profitability: 1.5,
      volatility: -5.8
    },
    context: 'Margin stabilization after growth phase',
    annotations: ['Operational efficiency improvements', 'Cost optimization completed']
  },
  {
    fromPhase: 'stable',
    toPhase: 'contraction',
    transitionDate: 'Q2 FY23',
    transitionIndex: 6,
    confidence: 91,
    trigger: 'external',
    severity: 'major',
    duration: 3,
    impact: {
      revenue: -18.5,
      profitability: -12.3,
      volatility: 25.7
    },
    context: 'Economic downturn and supply chain disruptions',
    annotations: ['Global recession impact', 'Raw material cost increase', 'Demand slowdown']
  },
  {
    fromPhase: 'contraction',
    toPhase: 'stable',
    transitionDate: 'Q1 FY24',
    transitionIndex: 9,
    confidence: 78,
    trigger: 'mixed',
    severity: 'moderate',
    duration: 2,
    impact: {
      revenue: 8.3,
      profitability: 12.1,
      volatility: -15.2
    },
    context: 'Recovery through cost management and market adaptation',
    annotations: ['Strategic restructuring completed', 'New management team', 'Digital transformation']
  }
];

const mockChartData = [
  { period: 'Q1 FY22', revenue: 1200, phase: 'stable' },
  { period: 'Q2 FY22', revenue: 1380, phase: 'expansion' },
  { period: 'Q3 FY22', revenue: 1520, phase: 'expansion' },
  { period: 'Q4 FY22', revenue: 1450, phase: 'stable' },
  { period: 'Q1 FY23', revenue: 1480, phase: 'stable' },
  { period: 'Q2 FY23', revenue: 1200, phase: 'contraction' },
  { period: 'Q3 FY23', revenue: 1050, phase: 'contraction' },
  { period: 'Q4 FY23', revenue: 980, phase: 'contraction' },
  { period: 'Q1 FY24', revenue: 1100, phase: 'stable' },
  { period: 'Q2 FY24', revenue: 1250, phase: 'stable' },
  { period: 'Q3 FY24', revenue: 1320, phase: 'stable' },
  { period: 'Q4 FY24', revenue: 1400, phase: 'stable' },
];

export default function PhaseTransitionMarkersDemo() {
  const [showTransitionLines, setShowTransitionLines] = useState(true);
  const [showTransitionAreas, setShowTransitionAreas] = useState(true);
  const [showTransitionLabels, setShowTransitionLabels] = useState(true);
  const [showConfidenceIndicators, setShowConfidenceIndicators] = useState(true);
  const [showImpactMetrics, setShowImpactMetrics] = useState(true);
  const [showDetailedAnnotations, setShowDetailedAnnotations] = useState(true);
  const [enableTransitionTooltips, setEnableTransitionTooltips] = useState(true);
  const [enableTransitionClick, setEnableTransitionClick] = useState(true);
  const [highlightRecentTransitions, setHighlightRecentTransitions] = useState(true);
  const [transitionLineStyle, setTransitionLineStyle] = useState<'solid' | 'dashed' | 'dotted'>('solid');
  const [annotationPosition, setAnnotationPosition] = useState<'top' | 'bottom' | 'auto'>('auto');
  const [compactMode, setCompactMode] = useState(false);

  const [hoveredTransition, setHoveredTransition] = useState<PhaseTransition | null>(null);
  const [clickedTransition, setClickedTransition] = useState<PhaseTransition | null>(null);
  const [clickedAnnotation, setClickedAnnotation] = useState<{ transition: PhaseTransition; annotation: string } | null>(null);

  const handleTransitionHover = (transition: PhaseTransition | null) => {
    setHoveredTransition(transition);
    console.log('Transition hovered:', transition?.fromPhase, '→', transition?.toPhase);
  };

  const handleTransitionClick = (transition: PhaseTransition) => {
    setClickedTransition(transition);
    console.log('Transition clicked:', transition);
  };

  const handleAnnotationClick = (transition: PhaseTransition, annotation: string) => {
    setClickedAnnotation({ transition, annotation });
    console.log('Annotation clicked:', annotation, 'for transition:', transition.fromPhase, '→', transition.toPhase);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Phase Transition Markers Demo
          </h1>
          <p className="text-lg text-gray-600">
            Interactive visualization of business cycle phase transitions with detailed annotations and analysis
          </p>
        </div>

        {/* Controls Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Demo Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Visual Options */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Visual Elements</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showTransitionLines}
                    onChange={(e) => setShowTransitionLines(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show Transition Lines</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showTransitionAreas}
                    onChange={(e) => setShowTransitionAreas(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show Transition Areas</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showTransitionLabels}
                    onChange={(e) => setShowTransitionLabels(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show Transition Labels</span>
                </label>
              </div>
            </div>

            {/* Information Display */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Information Display</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showConfidenceIndicators}
                    onChange={(e) => setShowConfidenceIndicators(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show Confidence Indicators</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showImpactMetrics}
                    onChange={(e) => setShowImpactMetrics(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show Impact Metrics</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showDetailedAnnotations}
                    onChange={(e) => setShowDetailedAnnotations(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show Detailed Annotations</span>
                </label>
              </div>
            </div>

            {/* Interactive Features */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Interactive Features</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={enableTransitionTooltips}
                    onChange={(e) => setEnableTransitionTooltips(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable Tooltips</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={enableTransitionClick}
                    onChange={(e) => setEnableTransitionClick(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable Click Events</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={highlightRecentTransitions}
                    onChange={(e) => setHighlightRecentTransitions(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Highlight Recent Transitions</span>
                </label>
              </div>
            </div>

            {/* Style Options */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Style Options</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Line Style</label>
                  <select
                    value={transitionLineStyle}
                    onChange={(e) => setTransitionLineStyle(e.target.value as 'solid' | 'dashed' | 'dotted')}
                    className="w-full rounded border-gray-300 text-sm"
                  >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Annotation Position</label>
                  <select
                    value={annotationPosition}
                    onChange={(e) => setAnnotationPosition(e.target.value as 'top' | 'bottom' | 'auto')}
                    className="w-full rounded border-gray-300 text-sm"
                  >
                    <option value="auto">Auto</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={compactMode}
                    onChange={(e) => setCompactMode(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Compact Mode</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Chart with Phase Transitions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend with Phase Transitions</h2>
          
          <div className="h-96 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
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
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
                
                {/* Phase Transition Markers */}
                <PhaseTransitionMarkers
                  transitions={mockTransitions}
                  chartData={mockChartData}
                  showTransitionLines={showTransitionLines}
                  showTransitionAreas={showTransitionAreas}
                  showTransitionLabels={showTransitionLabels}
                  showConfidenceIndicators={showConfidenceIndicators}
                  showImpactMetrics={showImpactMetrics}
                  showDetailedAnnotations={showDetailedAnnotations}
                  enableTransitionTooltips={enableTransitionTooltips}
                  enableTransitionClick={enableTransitionClick}
                  highlightRecentTransitions={highlightRecentTransitions}
                  transitionLineStyle={transitionLineStyle}
                  annotationPosition={annotationPosition}
                  compactMode={compactMode}
                  onTransitionHover={handleTransitionHover}
                  onTransitionClick={handleTransitionClick}
                  onAnnotationClick={handleAnnotationClick}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Log */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hovered Transition */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Currently Hovered</h3>
            {hoveredTransition ? (
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Transition:</span> {hoveredTransition.fromPhase} → {hoveredTransition.toPhase}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Date:</span> {hoveredTransition.transitionDate}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Confidence:</span> {hoveredTransition.confidence}%
                </p>
                <p className="text-sm">
                  <span className="font-medium">Trigger:</span> {hoveredTransition.trigger}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Hover over a transition to see details</p>
            )}
          </div>

          {/* Clicked Transition */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Last Clicked Transition</h3>
            {clickedTransition ? (
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Transition:</span> {clickedTransition.fromPhase} → {clickedTransition.toPhase}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Severity:</span> {clickedTransition.severity}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Duration:</span> {clickedTransition.duration} period(s)
                </p>
                <p className="text-sm">
                  <span className="font-medium">Revenue Impact:</span> {clickedTransition.impact.revenue}%
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Click on a transition to see details</p>
            )}
          </div>

          {/* Clicked Annotation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Last Clicked Annotation</h3>
            {clickedAnnotation ? (
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Annotation:</span> {clickedAnnotation.annotation}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Related Transition:</span> {clickedAnnotation.transition.fromPhase} → {clickedAnnotation.transition.toPhase}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Context:</span> {clickedAnnotation.transition.context}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Click on an annotation to see details</p>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transition Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockTransitions.map((transition, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {transition.fromPhase} → {transition.toPhase}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    transition.severity === 'major' ? 'bg-red-100 text-red-800' :
                    transition.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {transition.severity}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{transition.transitionDate}</p>
                <p className="text-xs text-gray-600">Confidence: {transition.confidence}%</p>
                <p className="text-xs text-gray-600">Revenue Impact: {transition.impact.revenue >= 0 ? '+' : ''}{transition.impact.revenue}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 