'use client';

import React, { useState } from 'react';
import PhaseLegend from '@/components/ui/PhaseLegend';
import PhaseTooltip from '@/components/ui/PhaseTooltip';
import { PhaseType } from '@/lib/design-tokens';

export default function PhaseLegendDemo() {
  const [selectedPhase, setSelectedPhase] = useState<PhaseType | null>(null);
  const [highlightedPhases, setHighlightedPhases] = useState<PhaseType[]>([]);
  const [showDescriptions, setShowDescriptions] = useState(false);
  const [showCharacteristics, setShowCharacteristics] = useState(false);
  const [showInvestmentTips, setShowInvestmentTips] = useState(false);
  const [showIndicators, setShowIndicators] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [interactive, setInteractive] = useState(true);
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [placement, setPlacement] = useState<'top' | 'bottom' | 'left' | 'right' | 'floating'>('top');
  
  // Tooltip state
  const [tooltipPhase, setTooltipPhase] = useState<PhaseType>('expansion');
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top');
  const [tooltipTrigger, setTooltipTrigger] = useState<'hover' | 'click' | 'manual'>('hover');
  const [tooltipShowMetrics, setTooltipShowMetrics] = useState(false);
  const [tooltipShowAdvice, setTooltipShowAdvice] = useState(false);
  const [tooltipShowDuration, setTooltipShowDuration] = useState(false);
  const [tooltipShowExamples, setTooltipShowExamples] = useState(false);
  const [tooltipShowActions, setTooltipShowActions] = useState(false);
  const [tooltipCompact, setTooltipCompact] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  
  // Event logging
  const [events, setEvents] = useState<string[]>([]);

  const logEvent = (event: string) => {
    setEvents(prev => [`${new Date().toLocaleTimeString()}: ${event}`, ...prev.slice(0, 9)]);
  };

  const handlePhaseClick = (phase: PhaseType) => {
    setSelectedPhase(selectedPhase === phase ? null : phase);
    logEvent(`Phase clicked: ${phase}`);
  };

  const handlePhaseHover = (phase: PhaseType | null) => {
    logEvent(`Phase ${phase ? 'hovered' : 'unhovered'}: ${phase || 'none'}`);
  };

  const handleActionClick = (action: string) => {
    logEvent(`Tooltip action clicked: ${action}`);
  };

  const mockMetrics = {
    revenue: 15.2,
    margin: 8.5,
    growth: 12.3,
    confidence: 85
  };

  const resetToDefaults = () => {
    setSelectedPhase(null);
    setHighlightedPhases([]);
    setShowDescriptions(false);
    setShowCharacteristics(false);
    setShowInvestmentTips(false);
    setShowIndicators(false);
    setShowExamples(false);
    setCompactMode(false);
    setInteractive(true);
    setOrientation('horizontal');
    setPlacement('top');
    setTooltipShowMetrics(false);
    setTooltipShowAdvice(false);
    setTooltipShowDuration(false);
    setTooltipShowExamples(false);
    setTooltipShowActions(false);
    setTooltipCompact(false);
    setTooltipVisible(false);
    setEvents([]);
    logEvent('Reset to defaults');
  };

  const showAllFeatures = () => {
    setShowDescriptions(true);
    setShowCharacteristics(true);
    setShowInvestmentTips(true);
    setShowIndicators(true);
    setShowExamples(true);
    setTooltipShowMetrics(true);
    setTooltipShowAdvice(true);
    setTooltipShowDuration(true);
    setTooltipShowExamples(true);
    setTooltipShowActions(true);
    logEvent('Enabled all features');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Phase Legend & Tooltip Demo
          </h1>
          <p className="text-gray-600">
            Interactive demonstration of business cycle phase legend and tooltip components
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Controls Panel */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Controls</h2>
              
              {/* Quick Actions */}
              <div className="space-y-2 mb-6">
                <button
                  onClick={resetToDefaults}
                  className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Reset to Defaults
                </button>
                <button
                  onClick={showAllFeatures}
                  className="w-full px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Show All Features
                </button>
              </div>

              {/* Legend Controls */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Legend Settings</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showDescriptions}
                        onChange={(e) => setShowDescriptions(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Show Descriptions</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showCharacteristics}
                        onChange={(e) => setShowCharacteristics(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Show Characteristics</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showInvestmentTips}
                        onChange={(e) => setShowInvestmentTips(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Show Investment Tips</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showIndicators}
                        onChange={(e) => setShowIndicators(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Show Indicators</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showExamples}
                        onChange={(e) => setShowExamples(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Show Examples</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={compactMode}
                        onChange={(e) => setCompactMode(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Compact Mode</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={interactive}
                        onChange={(e) => setInteractive(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Interactive</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Orientation
                  </label>
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value as 'horizontal' | 'vertical')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="horizontal">Horizontal</option>
                    <option value="vertical">Vertical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Placement
                  </label>
                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value as typeof placement)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="floating">Floating</option>
                  </select>
                </div>
              </div>

              {/* Tooltip Controls */}
              <div className="space-y-4 mt-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Tooltip Settings</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phase
                      </label>
                      <select
                        value={tooltipPhase}
                        onChange={(e) => setTooltipPhase(e.target.value as PhaseType)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="expansion">Expansion</option>
                        <option value="contraction">Contraction</option>
                        <option value="stable">Stable</option>
                        <option value="transition">Transition</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                      </label>
                      <select
                        value={tooltipPosition}
                        onChange={(e) => setTooltipPosition(e.target.value as typeof tooltipPosition)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trigger
                      </label>
                      <select
                        value={tooltipTrigger}
                        onChange={(e) => setTooltipTrigger(e.target.value as typeof tooltipTrigger)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="hover">Hover</option>
                        <option value="click">Click</option>
                        <option value="manual">Manual</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={tooltipShowMetrics}
                          onChange={(e) => setTooltipShowMetrics(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Show Metrics</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={tooltipShowAdvice}
                          onChange={(e) => setTooltipShowAdvice(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Show Advice</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={tooltipShowDuration}
                          onChange={(e) => setTooltipShowDuration(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Show Duration</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={tooltipShowExamples}
                          onChange={(e) => setTooltipShowExamples(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Show Examples</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={tooltipShowActions}
                          onChange={(e) => setTooltipShowActions(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Show Actions</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={tooltipCompact}
                          onChange={(e) => setTooltipCompact(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Compact Mode</span>
                      </label>
                    </div>

                    {tooltipTrigger === 'manual' && (
                      <button
                        onClick={() => setTooltipVisible(!tooltipVisible)}
                        className="w-full px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        {tooltipVisible ? 'Hide' : 'Show'} Tooltip
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Phase Selection */}
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-2">Highlight Phases</h3>
                <div className="space-y-2">
                  {(['expansion', 'contraction', 'stable', 'transition'] as PhaseType[]).map(phase => (
                    <label key={phase} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={highlightedPhases.includes(phase)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setHighlightedPhases([...highlightedPhases, phase]);
                          } else {
                            setHighlightedPhases(highlightedPhases.filter(p => p !== phase));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{phase}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Event Log */}
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-2">Event Log</h3>
                <div className="bg-gray-50 rounded-md p-3 h-32 overflow-y-auto">
                  {events.length === 0 ? (
                    <p className="text-sm text-gray-500">No events yet</p>
                  ) : (
                    <div className="space-y-1">
                      {events.map((event, index) => (
                        <p key={index} className="text-xs text-gray-600 font-mono">
                          {event}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Demo Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Legend Demo */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Phase Legend</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Interactive Legend</h3>
                  <PhaseLegend
                    showDescriptions={showDescriptions}
                    showCharacteristics={showCharacteristics}
                    showInvestmentTips={showInvestmentTips}
                    showIndicators={showIndicators}
                    showExamples={showExamples}
                    compactMode={compactMode}
                    interactive={interactive}
                    orientation={orientation}
                    placement={placement}
                    onPhaseClick={handlePhaseClick}
                    onPhaseHover={handlePhaseHover}
                    selectedPhase={selectedPhase}
                    highlightedPhases={highlightedPhases}
                  />
                </div>

                {/* Legend Examples */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Minimal Legend</h3>
                    <PhaseLegend />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Compact Legend</h3>
                    <PhaseLegend compactMode={true} />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Vertical Orientation</h3>
                    <PhaseLegend orientation="vertical" showDescriptions={true} />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Specific Phases</h3>
                    <PhaseLegend phases={['expansion', 'contraction']} showDescriptions={true} />
                  </div>
                </div>
              </div>
            </div>

            {/* Tooltip Demo */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Phase Tooltips</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Interactive Tooltip</h3>
                  <div className="flex justify-center py-8">
                    <PhaseTooltip
                      phase={tooltipPhase}
                      position={tooltipPosition}
                      trigger={tooltipTrigger}
                      showMetrics={tooltipShowMetrics}
                      showAdvice={tooltipShowAdvice}
                      showDuration={tooltipShowDuration}
                      showExamples={tooltipShowExamples}
                      showActions={tooltipShowActions}
                      compact={tooltipCompact}
                      isVisible={tooltipTrigger === 'manual' ? tooltipVisible : undefined}
                      metrics={tooltipShowMetrics ? mockMetrics : undefined}
                      onActionClick={handleActionClick}
                      onClose={() => setTooltipVisible(false)}
                    >
                      <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors">
                        {tooltipTrigger === 'hover' ? 'Hover me' : 
                         tooltipTrigger === 'click' ? 'Click me' : 
                         'Manual tooltip trigger'}
                      </div>
                    </PhaseTooltip>
                  </div>
                </div>

                {/* Tooltip Examples */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(['expansion', 'contraction', 'stable', 'transition'] as PhaseType[]).map(phase => (
                    <div key={phase} className="text-center">
                      <h4 className="text-sm font-medium text-gray-700 mb-3 capitalize">{phase}</h4>
                      <PhaseTooltip
                        phase={phase}
                        showAdvice={true}
                        showDuration={true}
                        onActionClick={handleActionClick}
                      >
                        <div className="px-3 py-2 bg-gray-100 text-gray-700 rounded cursor-pointer hover:bg-gray-200 transition-colors text-sm">
                          Hover for info
                        </div>
                      </PhaseTooltip>
                    </div>
                  ))}
                </div>

                {/* Advanced Examples */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">With Metrics</h3>
                    <div className="flex justify-center">
                      <PhaseTooltip
                        phase="expansion"
                        showMetrics={true}
                        showAdvice={true}
                        metrics={mockMetrics}
                        onActionClick={handleActionClick}
                      >
                        <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg cursor-pointer hover:bg-green-200 transition-colors">
                          Expansion with Metrics
                        </div>
                      </PhaseTooltip>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Full Featured</h3>
                    <div className="flex justify-center">
                      <PhaseTooltip
                        phase="contraction"
                        showMetrics={true}
                        showAdvice={true}
                        showDuration={true}
                        showExamples={true}
                        showActions={true}
                        metrics={mockMetrics}
                        onActionClick={handleActionClick}
                      >
                        <div className="px-4 py-2 bg-red-100 text-red-800 rounded-lg cursor-pointer hover:bg-red-200 transition-colors">
                          Full Featured Tooltip
                        </div>
                      </PhaseTooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Examples */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Usage Examples</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Dashboard Integration</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Company Analysis Dashboard</h4>
                      <PhaseLegend 
                        compactMode={true} 
                        showDescriptions={true}
                        placement="floating"
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      Legend can be integrated into dashboards to provide context for phase-colored elements.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Contextual Help</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm">Current Phase:</span>
                      <PhaseTooltip
                        phase="expansion"
                        showAdvice={true}
                        showDuration={true}
                        trigger="click"
                      >
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full cursor-help">
                          Expansion
                          <svg className="ml-1 w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </PhaseTooltip>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Tooltips can provide contextual help directly in your interface.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 