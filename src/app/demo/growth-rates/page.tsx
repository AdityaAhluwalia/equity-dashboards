'use client';

import React, { useState } from 'react';
import { GrowthRateOverlay, GrowthRateData } from '@/components/financials/GrowthRateOverlay';
import { PhaseType } from '@/lib/design-tokens';

// Real financial data for Emami Limited (FY19-FY24)
const annualGrowthData: GrowthRateData[] = [
  {
    period: 'FY19',
    periodIndex: 0,
    revenueGrowth: 6.8,
    profitGrowth: 12.1,
    revenueCAGR: 8.2,
    profitCAGR: 13.5,
    profitMargin: 13.8,
    revenueVolatility: 0.12,
    profitVolatility: 0.18,
    phase: 'expansion'
  },
  {
    period: 'FY20',
    periodIndex: 1,
    revenueGrowth: 5.2,
    profitGrowth: 8.5,
    revenueCAGR: 7.8,
    profitCAGR: 12.3,
    profitMargin: 13.2,
    revenueVolatility: 0.15,
    profitVolatility: 0.22,
    phase: 'stable'
  },
  {
    period: 'FY21',
    periodIndex: 2,
    revenueGrowth: -2.8,
    profitGrowth: -5.1,
    revenueCAGR: 4.2,
    profitCAGR: 8.7,
    profitMargin: 12.9,
    revenueVolatility: 0.18,
    profitVolatility: 0.28,
    phase: 'contraction'
  },
  {
    period: 'FY22',
    periodIndex: 3,
    revenueGrowth: 8.3,
    profitGrowth: 10.8,
    revenueCAGR: 6.5,
    profitCAGR: 11.2,
    profitMargin: 13.2,
    revenueVolatility: 0.12,
    profitVolatility: 0.19,
    phase: 'expansion'
  },
  {
    period: 'FY23',
    periodIndex: 4,
    revenueGrowth: 8.2,
    profitGrowth: 11.2,
    revenueCAGR: 7.1,
    profitCAGR: 12.8,
    profitMargin: 13.5,
    revenueVolatility: 0.10,
    profitVolatility: 0.16,
    phase: 'expansion'
  },
  {
    period: 'FY24',
    periodIndex: 5,
    revenueGrowth: 5.4,
    profitGrowth: 7.4,
    revenueCAGR: 6.8,
    profitCAGR: 11.5,
    profitMargin: 13.8,
    revenueVolatility: 0.08,
    profitVolatility: 0.14,
    phase: 'stable'
  }
];

// Quarterly growth data for detailed analysis
const quarterlyGrowthData: GrowthRateData[] = [
  {
    period: 'Q1 FY23',
    periodIndex: 0,
    revenueGrowth: 7.2,
    profitGrowth: 9.8,
    quarterlyGrowth: 1.8,
    yearOverYearGrowth: 7.2,
    profitMargin: 13.1,
    revenueVolatility: 0.14,
    profitVolatility: 0.21,
    phase: 'expansion'
  },
  {
    period: 'Q2 FY23',
    periodIndex: 1,
    revenueGrowth: 8.1,
    profitGrowth: 10.3,
    quarterlyGrowth: 0.9,
    yearOverYearGrowth: 8.1,
    profitMargin: 13.3,
    revenueVolatility: 0.11,
    profitVolatility: 0.18,
    phase: 'expansion'
  },
  {
    period: 'Q3 FY23',
    periodIndex: 2,
    revenueGrowth: 9.5,
    profitGrowth: 12.8,
    quarterlyGrowth: 1.4,
    yearOverYearGrowth: 9.5,
    profitMargin: 13.7,
    revenueVolatility: 0.09,
    profitVolatility: 0.15,
    phase: 'expansion'
  },
  {
    period: 'Q4 FY23',
    periodIndex: 3,
    revenueGrowth: 7.8,
    profitGrowth: 11.1,
    quarterlyGrowth: -1.7,
    yearOverYearGrowth: 7.8,
    profitMargin: 13.4,
    revenueVolatility: 0.12,
    profitVolatility: 0.17,
    phase: 'expansion'
  },
  {
    period: 'Q1 FY24',
    periodIndex: 4,
    revenueGrowth: 6.2,
    profitGrowth: 8.4,
    quarterlyGrowth: -1.6,
    yearOverYearGrowth: 6.2,
    profitMargin: 13.5,
    revenueVolatility: 0.10,
    profitVolatility: 0.16,
    phase: 'stable'
  },
  {
    period: 'Q2 FY24',
    periodIndex: 5,
    revenueGrowth: 5.8,
    profitGrowth: 7.9,
    quarterlyGrowth: -0.4,
    yearOverYearGrowth: 5.8,
    profitMargin: 13.6,
    revenueVolatility: 0.08,
    profitVolatility: 0.14,
    phase: 'stable'
  },
  {
    period: 'Q3 FY24',
    periodIndex: 6,
    revenueGrowth: 4.1,
    profitGrowth: 6.2,
    quarterlyGrowth: -1.7,
    yearOverYearGrowth: 4.1,
    profitMargin: 13.8,
    revenueVolatility: 0.07,
    profitVolatility: 0.13,
    phase: 'stable'
  },
  {
    period: 'Q4 FY24',
    periodIndex: 7,
    revenueGrowth: 5.2,
    profitGrowth: 7.1,
    quarterlyGrowth: 1.1,
    yearOverYearGrowth: 5.2,
    profitMargin: 14.1,
    revenueVolatility: 0.06,
    profitVolatility: 0.12,
    phase: 'stable'
  }
];

export default function GrowthRatesDemo() {
  const [viewMode, setViewMode] = useState<'annual' | 'quarterly'>('annual');
  const [overlayType, setOverlayType] = useState<'lines' | 'areas' | 'bands'>('lines');
  
  // Display controls
  const [showRevenueGrowth, setShowRevenueGrowth] = useState(true);
  const [showProfitGrowth, setShowProfitGrowth] = useState(true);
  const [showCAGR, setShowCAGR] = useState(false);
  const [showVolatility, setShowVolatility] = useState(false);
  const [showTrendLines, setShowTrendLines] = useState(true);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showAcceleration, setShowAcceleration] = useState(false);
  const [showMomentum, setShowMomentum] = useState(false);
  const [showSeasonality, setShowSeasonality] = useState(false);
  const [showYearOverYear, setShowYearOverYear] = useState(false);

  // State for testing
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentData = viewMode === 'annual' ? annualGrowthData : quarterlyGrowthData;

  const handlePeriodClick = (period: string, data: GrowthRateData) => {
    console.log('Period clicked:', period, data);
  };

  const handlePeriodHover = (period: string | null, data: GrowthRateData | null) => {
    console.log('Period hover:', period, data);
  };

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const simulateError = () => {
    setError('Failed to load growth rate data');
    setTimeout(() => setError(null), 3000);
  };

  const handleRetry = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Growth Rate Overlays Demo
          </h1>
          <p className="text-gray-600">
            Task 7.3: Dedicated growth rate line overlays with multiple visualization types and analytics
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Chart Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* View Mode Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('annual')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'annual'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  Annual
                </button>
                <button
                  onClick={() => setViewMode('quarterly')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'quarterly'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  Quarterly
                </button>
              </div>
            </div>

            {/* Overlay Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overlay Type
              </label>
              <select
                value={overlayType}
                onChange={(e) => setOverlayType(e.target.value as 'lines' | 'areas' | 'bands')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="lines">Line Overlays</option>
                <option value="areas">Area Overlays</option>
                <option value="bands">Band Overlays</option>
              </select>
            </div>

            {/* Test Actions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Actions
              </label>
              <div className="flex gap-2">
                <button
                  onClick={simulateLoading}
                  className="px-3 py-2 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600 transition-colors"
                >
                  Loading
                </button>
                <button
                  onClick={simulateError}
                  className="px-3 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
                >
                  Error
                </button>
              </div>
            </div>
          </div>

          {/* Growth Rate Toggles */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Growth Rate Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showRevenueGrowth}
                  onChange={(e) => setShowRevenueGrowth(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Revenue Growth</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showProfitGrowth}
                  onChange={(e) => setShowProfitGrowth(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Profit Growth</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showCAGR}
                  onChange={(e) => setShowCAGR(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">CAGR Lines</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showVolatility}
                  onChange={(e) => setShowVolatility(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Volatility</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showTrendLines}
                  onChange={(e) => setShowTrendLines(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Trend Lines</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showStatistics}
                  onChange={(e) => setShowStatistics(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Statistics</span>
              </label>
            </div>
          </div>

          {/* Advanced Features */}
          {viewMode === 'quarterly' && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quarterly Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showSeasonality}
                    onChange={(e) => setShowSeasonality(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Seasonality</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showYearOverYear}
                    onChange={(e) => setShowYearOverYear(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">YoY Growth</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showAcceleration}
                    onChange={(e) => setShowAcceleration(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Acceleration</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showMomentum}
                    onChange={(e) => setShowMomentum(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Momentum</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Growth Rate Overlay Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <GrowthRateOverlay
            data={currentData}
            height={500}
            showRevenueGrowth={showRevenueGrowth}
            showProfitGrowth={showProfitGrowth}
            showCAGR={showCAGR}
            showVolatility={showVolatility}
            showTrendLines={showTrendLines}
            showStatistics={showStatistics}
            showAcceleration={showAcceleration}
            showMomentum={showMomentum}
            showSeasonality={showSeasonality}
            showYearOverYear={showYearOverYear}
            overlayType={overlayType}
            viewMode={viewMode}
            loading={loading}
            error={error}
            onPeriodClick={handlePeriodClick}
            onPeriodHover={handlePeriodHover}
            onRetry={handleRetry}
          />
        </div>

        {/* Data Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Growth Metrics Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Growth Metrics</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue Growth
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profit Growth
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Margin
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.period}
                      </td>
                      <td className={`px-4 py-3 whitespace-nowrap text-sm text-right ${
                        item.revenueGrowth !== undefined && item.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.revenueGrowth !== undefined ? 
                          `${item.revenueGrowth >= 0 ? '+' : ''}${item.revenueGrowth.toFixed(1)}%` : 'N/A'
                        }
                      </td>
                      <td className={`px-4 py-3 whitespace-nowrap text-sm text-right ${
                        item.profitGrowth !== undefined && item.profitGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.profitGrowth !== undefined ? 
                          `${item.profitGrowth >= 0 ? '+' : ''}${item.profitGrowth.toFixed(1)}%` : 'N/A'
                        }
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        {item.profitMargin !== undefined ? `${item.profitMargin.toFixed(1)}%` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Volatility Analysis */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Volatility Analysis</h2>
            <div className="space-y-4">
              {currentData.map((item, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">{item.period}</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      item.phase === 'expansion' ? 'bg-green-100 text-green-800' :
                      item.phase === 'contraction' ? 'bg-red-100 text-red-800' :
                      item.phase === 'transition' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.phase.charAt(0).toUpperCase() + item.phase.slice(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-600">Revenue Vol:</span>
                      <span className="ml-2 font-medium text-purple-600">
                        {item.revenueVolatility !== undefined ? `${(item.revenueVolatility * 100).toFixed(1)}%` : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Profit Vol:</span>
                      <span className="ml-2 font-medium text-purple-600">
                        {item.profitVolatility !== undefined ? `${(item.profitVolatility * 100).toFixed(1)}%` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task 7.3 Features Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Task 7.3 Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">✅ Growth Rate Overlays</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Revenue growth line (orange)</li>
                <li>• Profit growth line (red)</li>
                <li>• CAGR trend lines (dashed)</li>
                <li>• Toggle-able visibility controls</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">✅ Multiple Overlay Types</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Clean line overlays (default)</li>
                <li>• Area overlays with fill</li>
                <li>• Band overlays for ranges</li>
                <li>• Phase background integration</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">✅ Advanced Analytics</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Growth statistics panel</li>
                <li>• Volatility indicators</li>
                <li>• Trend line analysis</li>
                <li>• Acceleration tracking</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">✅ Quarterly Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Seasonal pattern detection</li>
                <li>• Year-over-year comparisons</li>
                <li>• Quarterly momentum tracking</li>
                <li>• QoQ growth visualization</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">✅ Interactive Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Rich tooltip with all metrics</li>
                <li>• Period click/hover handlers</li>
                <li>• Loading and error states</li>
                <li>• Responsive design</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">✅ Data Visualization</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Percentage formatting</li>
                <li>• Phase background coloring</li>
                <li>• Growth trend analysis</li>
                <li>• Statistical summaries</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Task 7.3: Growth Rate Overlays - Comprehensive growth rate analysis with multiple overlay types</p>
          <p>Real financial data from Emami Limited with interactive controls and advanced analytics</p>
        </div>
      </div>
    </div>
  );
} 