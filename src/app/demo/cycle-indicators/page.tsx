'use client';

import React, { useState } from 'react';
import CycleIndicatorsPanel, { CycleIndicatorData } from '@/components/charts/CycleIndicatorsPanel';
import { PhaseType } from '@/lib/design-tokens';

const CycleIndicatorsDemoPage = () => {
  // Demo state for feature toggles
  const [showMomentumChart, setShowMomentumChart] = useState(true);
  const [showStrengthGauge, setShowStrengthGauge] = useState(true);
  const [showTransitionMatrix, setShowTransitionMatrix] = useState(true);
  const [showVolatilityIndicator, setShowVolatilityIndicator] = useState(true);
  const [showConfidenceMetrics, setShowConfidenceMetrics] = useState(true);
  const [showTrendAnalysis, setShowTrendAnalysis] = useState(true);
  const [enablePhaseComparison, setEnablePhaseComparison] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  // Sample indicator data for FMCG company (Emami Ltd)
  const emamiIndicators: CycleIndicatorData = {
    phase: 'expansion',
    momentum: 72,
    strength: 85,
    duration: 4,
    transitionProbability: 35,
    volatility: 28,
    confidence: 88,
    trend: 'accelerating',
    nextPhase: 'stable',
    nextPhaseConfidence: 78
  };

  // Sample indicator data for Banking company (Axis Bank)
  const axisBankIndicators: CycleIndicatorData = {
    phase: 'transition',
    momentum: -15,
    strength: 42,
    duration: 2,
    transitionProbability: 68,
    volatility: 55,
    confidence: 65,
    trend: 'decelerating',
    nextPhase: 'contraction',
    nextPhaseConfidence: 72
  };

  // Sample indicator data for Stable company
  const stableCompanyIndicators: CycleIndicatorData = {
    phase: 'stable',
    momentum: 8,
    strength: 58,
    duration: 6,
    transitionProbability: 20,
    volatility: 18,
    confidence: 85,
    trend: 'stable',
    nextPhase: 'expansion',
    nextPhaseConfidence: 45
  };

  // Sample indicator data for Contraction phase
  const contractionIndicators: CycleIndicatorData = {
    phase: 'contraction',
    momentum: -45,
    strength: 25,
    duration: 3,
    transitionProbability: 55,
    volatility: 72,
    confidence: 75,
    trend: 'decelerating',
    nextPhase: 'transition',
    nextPhaseConfidence: 68
  };

  const [selectedCompany, setSelectedCompany] = useState<'emami' | 'axis' | 'stable' | 'contraction'>('emami');
  
  const getCurrentIndicators = () => {
    switch (selectedCompany) {
      case 'emami': return emamiIndicators;
      case 'axis': return axisBankIndicators;
      case 'stable': return stableCompanyIndicators;
      case 'contraction': return contractionIndicators;
      default: return emamiIndicators;
    }
  };

  // Historical momentum data for demonstration
  const historicalMomentumData = [
    { period: 'Q1 FY22', momentum: 35, phase: 'stable' as PhaseType },
    { period: 'Q2 FY22', momentum: 58, phase: 'expansion' as PhaseType },
    { period: 'Q3 FY22', momentum: 75, phase: 'expansion' as PhaseType },
    { period: 'Q4 FY22', momentum: 82, phase: 'expansion' as PhaseType },
    { period: 'Q1 FY23', momentum: 45, phase: 'transition' as PhaseType },
    { period: 'Q2 FY23', momentum: -22, phase: 'contraction' as PhaseType },
    { period: 'Q3 FY23', momentum: -38, phase: 'contraction' as PhaseType },
    { period: 'Q4 FY23', momentum: -12, phase: 'transition' as PhaseType },
    { period: 'Q1 FY24', momentum: 28, phase: 'expansion' as PhaseType },
    { period: 'Q2 FY24', momentum: 52, phase: 'expansion' as PhaseType },
    { period: 'Q3 FY24', momentum: 68, phase: 'expansion' as PhaseType },
    { period: 'Q4 FY24', momentum: getCurrentIndicators().momentum, phase: getCurrentIndicators().phase },
  ];

  // Event handlers
  const handlePhaseClick = (phase: PhaseType) => {
    console.log(`Phase clicked: ${phase}`);
  };

  const handleMomentumClick = (momentum: number, period: string) => {
    console.log(`Momentum clicked: ${momentum} for ${period}`);
  };

  const handleTransitionClick = (fromPhase: PhaseType, toPhase: PhaseType, probability: number) => {
    console.log(`Transition clicked: ${fromPhase} -> ${toPhase} (${probability}%)`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Cycle Indicators Panel Demo
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Interactive momentum analysis with phase transition indicators
          </p>

          {/* Company Selection */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setSelectedCompany('emami')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCompany === 'emami'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Emami Ltd (Expansion)
            </button>
            <button
              onClick={() => setSelectedCompany('axis')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCompany === 'axis'
                  ? 'bg-yellow-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Axis Bank (Transition)
            </button>
            <button
              onClick={() => setSelectedCompany('stable')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCompany === 'stable'
                  ? 'bg-gray-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Stable Company
            </button>
            <button
              onClick={() => setSelectedCompany('contraction')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCompany === 'contraction'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Contracting Company
            </button>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Controls</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={showMomentumChart}
                onChange={(e) => setShowMomentumChart(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
              />
              <span className="text-sm font-medium">Momentum Chart</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={showStrengthGauge}
                onChange={(e) => setShowStrengthGauge(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
              />
              <span className="text-sm font-medium">Strength Gauge</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={showTransitionMatrix}
                onChange={(e) => setShowTransitionMatrix(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
              />
              <span className="text-sm font-medium">Transition Matrix</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={showVolatilityIndicator}
                onChange={(e) => setShowVolatilityIndicator(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
              />
              <span className="text-sm font-medium">Volatility</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={showConfidenceMetrics}
                onChange={(e) => setShowConfidenceMetrics(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
              />
              <span className="text-sm font-medium">Confidence</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={showTrendAnalysis}
                onChange={(e) => setShowTrendAnalysis(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
              />
              <span className="text-sm font-medium">Trend Analysis</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={enablePhaseComparison}
                onChange={(e) => setEnablePhaseComparison(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
              />
              <span className="text-sm font-medium">Phase Comparison</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={compactMode}
                onChange={(e) => setCompactMode(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
              />
              <span className="text-sm font-medium">Compact Mode</span>
            </label>
          </div>
        </div>

        {/* Main Component Demo */}
        <div className="mb-8">
          <CycleIndicatorsPanel
            currentIndicators={getCurrentIndicators()}
            historicalMomentum={historicalMomentumData}
            showMomentumChart={showMomentumChart}
            showStrengthGauge={showStrengthGauge}
            showTransitionMatrix={showTransitionMatrix}
            showVolatilityIndicator={showVolatilityIndicator}
            showConfidenceMetrics={showConfidenceMetrics}
            showTrendAnalysis={showTrendAnalysis}
            enablePhaseComparison={enablePhaseComparison}
            compactMode={compactMode}
            height={compactMode ? 300 : 600}
            onPhaseClick={handlePhaseClick}
            onMomentumClick={handleMomentumClick}
            onTransitionClick={handleTransitionClick}
          />
        </div>

        {/* Current Indicators Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Current Phase</h4>
            <div className={`text-2xl font-bold capitalize ${
              getCurrentIndicators().phase === 'expansion' ? 'text-green-600' :
              getCurrentIndicators().phase === 'contraction' ? 'text-red-600' :
              getCurrentIndicators().phase === 'stable' ? 'text-gray-600' :
              'text-yellow-600'
            }`}>
              {getCurrentIndicators().phase}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Duration: {getCurrentIndicators().duration} quarters
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Momentum Score</h4>
            <div className={`text-2xl font-bold ${
              getCurrentIndicators().momentum >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {getCurrentIndicators().momentum >= 0 ? '+' : ''}{getCurrentIndicators().momentum}
            </div>
            <div className="text-xs text-gray-500 mt-1 capitalize">
              Trend: {getCurrentIndicators().trend}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Phase Strength</h4>
            <div className="text-2xl font-bold text-blue-600">
              {getCurrentIndicators().strength}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Confidence: {getCurrentIndicators().confidence}%
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Transition Risk</h4>
            <div className="text-2xl font-bold text-purple-600">
              {getCurrentIndicators().transitionProbability}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Volatility: {getCurrentIndicators().volatility}%
            </div>
          </div>
        </div>

        {/* Phase Insights */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Phase Analysis Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Current Phase Characteristics</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {getCurrentIndicators().phase === 'expansion' && (
                  <>
                    <li>• Revenue and profitability growing</li>
                    <li>• Strong operational momentum</li>
                    <li>• Positive market sentiment</li>
                    <li>• Expansion investments paying off</li>
                  </>
                )}
                {getCurrentIndicators().phase === 'contraction' && (
                  <>
                    <li>• Revenue decline or slowdown</li>
                    <li>• Margin compression pressures</li>
                    <li>• Cost optimization focus</li>
                    <li>• Strategic restructuring needed</li>
                  </>
                )}
                {getCurrentIndicators().phase === 'stable' && (
                  <>
                    <li>• Consistent performance levels</li>
                    <li>• Mature market position</li>
                    <li>• Steady cash flow generation</li>
                    <li>• Dividend sustainability</li>
                  </>
                )}
                {getCurrentIndicators().phase === 'transition' && (
                  <>
                    <li>• Mixed performance indicators</li>
                    <li>• Strategy shifts underway</li>
                    <li>• Market positioning changes</li>
                    <li>• Higher uncertainty period</li>
                  </>
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Risk & Opportunity Assessment</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Momentum Risk:</span>
                  <span className={`font-medium ${
                    Math.abs(getCurrentIndicators().momentum) > 50 ? 'text-red-600' : 
                    Math.abs(getCurrentIndicators().momentum) > 25 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {Math.abs(getCurrentIndicators().momentum) > 50 ? 'High' : 
                     Math.abs(getCurrentIndicators().momentum) > 25 ? 'Medium' : 'Low'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Volatility Risk:</span>
                  <span className={`font-medium ${
                    getCurrentIndicators().volatility > 50 ? 'text-red-600' : 
                    getCurrentIndicators().volatility > 30 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {getCurrentIndicators().volatility > 50 ? 'High' : 
                     getCurrentIndicators().volatility > 30 ? 'Medium' : 'Low'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phase Stability:</span>
                  <span className={`font-medium ${
                    getCurrentIndicators().transitionProbability < 30 ? 'text-green-600' : 
                    getCurrentIndicators().transitionProbability < 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {getCurrentIndicators().transitionProbability < 30 ? 'Stable' : 
                     getCurrentIndicators().transitionProbability < 60 ? 'Moderate' : 'Unstable'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading and Error State Demos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Loading State Demo</h3>
            <CycleIndicatorsPanel
              currentIndicators={getCurrentIndicators()}
              loading={true}
              height={300}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Error State Demo</h3>
            <CycleIndicatorsPanel
              currentIndicators={getCurrentIndicators()}
              error="Failed to load momentum data from API"
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CycleIndicatorsDemoPage; 