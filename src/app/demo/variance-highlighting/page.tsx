'use client';

import React, { useState } from 'react';
import { MarginsTimeline } from '@/components/margins/MarginsTimeline';
import type { Company } from '@/types/ui.types';

// Demo data with significant variance for showcasing highlighting features
const emamiDemoData = {
  company: {
    id: 'emami-demo',
    name: 'Emami Limited',
    sector: 'Consumer Goods',
    marketCap: 8500,
    currentPhase: 'expansion',
  } as Company,
  annualData: [
    {
      year: 2015,
      revenue: 2147,
      netProfit: 285,
      operatingProfit: 420,
      grossProfit: 1290,
      operatingMargin: 19.6,
      netMargin: 13.3,
      grossMargin: 60.1,
    },
    {
      year: 2016,
      revenue: 2298,
      netProfit: 356,
      operatingProfit: 498,
      grossProfit: 1402,
      operatingMargin: 21.7, // Above average
      netMargin: 15.5, // Above average
      grossMargin: 61.0,
    },
    {
      year: 2017,
      revenue: 2456,
      netProfit: 245,
      operatingProfit: 387,
      grossProfit: 1523,
      operatingMargin: 15.8, // Below average
      netMargin: 10.0, // Below average
      grossMargin: 62.0,
    },
    {
      year: 2018,
      revenue: 2587,
      netProfit: 412,
      operatingProfit: 589,
      grossProfit: 1614,
      operatingMargin: 22.8, // High variance - above threshold
      netMargin: 15.9, // High variance - above threshold
      grossMargin: 62.4,
    },
    {
      year: 2019,
      revenue: 2234,
      netProfit: 201,
      operatingProfit: 313,
      grossProfit: 1340,
      operatingMargin: 14.0, // Low variance - below threshold
      netMargin: 9.0, // Low variance - below threshold
      grossMargin: 60.0,
    },
    {
      year: 2020,
      revenue: 2145,
      netProfit: 278,
      operatingProfit: 386,
      grossProfit: 1287,
      operatingMargin: 18.0,
      netMargin: 13.0,
      grossMargin: 60.0,
    },
    {
      year: 2021,
      revenue: 2456,
      netProfit: 334,
      operatingProfit: 467,
      grossProfit: 1474,
      operatingMargin: 19.0,
      netMargin: 13.6,
      grossMargin: 60.0,
    },
    {
      year: 2022,
      revenue: 2687,
      netProfit: 389,
      operatingProfit: 537,
      grossProfit: 1612,
      operatingMargin: 20.0,
      netMargin: 14.5,
      grossMargin: 60.0,
    },
  ],
  quarterlyData: [
    {
      quarter: 'Q1 2022',
      year: 2022,
      quarter_number: 1,
      revenue: 645,
      netProfit: 89,
      operatingProfit: 129,
      grossProfit: 387,
      operatingMargin: 20.0,
      netMargin: 13.8,
      grossMargin: 60.0,
    },
    {
      quarter: 'Q2 2022',
      year: 2022,
      quarter_number: 2,
      revenue: 672,
      netProfit: 98,
      operatingProfit: 147,
      grossProfit: 403,
      operatingMargin: 21.9, // High variance
      netMargin: 14.6,
      grossMargin: 60.0,
    },
    {
      quarter: 'Q3 2022',
      year: 2022,
      quarter_number: 3,
      revenue: 658,
      netProfit: 82,
      operatingProfit: 118,
      grossProfit: 395,
      operatingMargin: 17.9, // Low variance
      netMargin: 12.5,
      grossMargin: 60.0,
    },
    {
      quarter: 'Q4 2022',
      year: 2022,
      quarter_number: 4,
      revenue: 712,
      netProfit: 120,
      operatingProfit: 143,
      grossProfit: 427,
      operatingMargin: 20.1,
      netMargin: 16.9, // High variance
      grossMargin: 60.0,
    },
  ],
};

export default function VarianceHighlightingDemo() {
  const [showVarianceHighlighting, setShowVarianceHighlighting] = useState(true);
  const [varianceThreshold, setVarianceThreshold] = useState(1.5);
  const [viewMode, setViewMode] = useState<'annual' | 'quarterly'>('annual');
  const [showMovingAverages, setShowMovingAverages] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Task 8.5: Variance Highlighting from Averages
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Interactive demo showcasing margin variance detection and highlighting system
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Features Demonstrated:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Statistical variance detection using standard deviation analysis</li>
              <li>• Visual highlighting of significant deviations above/below historical averages</li>
              <li>• Configurable threshold settings (±1.5σ default)</li>
              <li>• Comprehensive variance statistics and confidence levels</li>
              <li>• Integration with moving averages and quarterly/annual views</li>
            </ul>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Controls</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variance Highlighting
              </label>
              <button
                onClick={() => setShowVarianceHighlighting(!showVarianceHighlighting)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showVarianceHighlighting
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {showVarianceHighlighting ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Threshold (σ)
              </label>
              <select
                value={varianceThreshold}
                onChange={(e) => setVarianceThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value={1.0}>±1.0σ (68% confidence)</option>
                <option value={1.5}>±1.5σ (87% confidence)</option>
                <option value={2.0}>±2.0σ (95% confidence)</option>
                <option value={2.5}>±2.5σ (99% confidence)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Mode
              </label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as 'annual' | 'quarterly')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="annual">Annual (8 years)</option>
                <option value="quarterly">Quarterly (4 quarters)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moving Averages
              </label>
              <button
                onClick={() => setShowMovingAverages(!showMovingAverages)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showMovingAverages
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {showMovingAverages ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Variance Highlighting Demo */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Variance Highlighting: Emami Limited Historical Data
          </h3>
          <MarginsTimeline
            data={emamiDemoData}
            viewMode={viewMode}
            showVarianceHighlighting={showVarianceHighlighting}
            varianceThreshold={varianceThreshold}
            showMovingAverages={showMovingAverages}
            movingAveragePeriods={[3, 5]}
          />
        </div>

        {/* Multiple Configuration Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Conservative Threshold */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Conservative Analysis (±2.0σ)
            </h3>
            <MarginsTimeline
              data={emamiDemoData}
              viewMode="annual"
              showVarianceHighlighting={true}
              varianceThreshold={2.0}
            />
          </div>

          {/* Sensitive Threshold */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sensitive Analysis (±1.0σ)
            </h3>
            <MarginsTimeline
              data={emamiDemoData}
              viewMode="annual"
              showVarianceHighlighting={true}
              varianceThreshold={1.0}
            />
          </div>
        </div>

        {/* Quarterly View with Combined Features */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Quarterly View with Combined Features
          </h3>
          <MarginsTimeline
            data={emamiDemoData}
            viewMode="quarterly"
            showVarianceHighlighting={true}
            varianceThreshold={1.5}
            showMovingAverages={true}
            movingAveragePeriods={[2, 3]}
          />
        </div>

        {/* Technical Implementation Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Implementation</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-3">Variance Detection Algorithm</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Statistical Calculation:</strong> Mean and standard deviation for each margin type</li>
                <li>• <strong>Threshold Detection:</strong> Points exceeding ±threshold×σ from mean</li>
                <li>• <strong>Classification:</strong> High variance (above mean) vs. Low variance (below mean)</li>
                <li>• <strong>Confidence Levels:</strong> Adjustable threshold for sensitivity control</li>
              </ul>
            </div>

            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-3">Visual Highlighting Features</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>High Variance:</strong> Solid filled circles with margin-type colors</li>
                <li>• <strong>Low Variance:</strong> Dashed circle outlines for subtle indication</li>
                <li>• <strong>Interactive Legend:</strong> Clear explanation of above/below average indicators</li>
                <li>• <strong>Statistics Panel:</strong> Mean, standard deviation, and variance point counts</li>
              </ul>
            </div>

            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-3">Integration Capabilities</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>View Mode Support:</strong> Works with both annual and quarterly data</li>
                <li>• <strong>Moving Average Sync:</strong> Coordinates with MA overlays seamlessly</li>
                <li>• <strong>Performance Optimized:</strong> React.useMemo for efficient recalculation</li>
                <li>• <strong>Edge Case Handling:</strong> Graceful degradation with insufficient data</li>
              </ul>
            </div>

            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-3">Business Value</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Anomaly Detection:</strong> Quickly identify unusual margin performance</li>
                <li>• <strong>Risk Assessment:</strong> Understand margin volatility patterns</li>
                <li>• <strong>Comparative Analysis:</strong> Benchmark against historical averages</li>
                <li>• <strong>Investment Insights:</strong> Spot consistency vs. volatility in profitability</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-md font-semibold text-gray-800 mb-2">Real-World Example Analysis</h4>
            <p className="text-sm text-gray-600">
              In the Emami data above, notice how 2018 shows high variance points (solid circles) where both operating and net margins 
              significantly exceeded historical averages (22.8% vs ~18% operating, 15.9% vs ~13% net). Conversely, 2019 shows low 
              variance points (dashed circles) where margins dropped below expected ranges. This pattern helps investors understand 
              performance consistency and identify periods of exceptional or concerning profitability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 