'use client';

import React, { useState } from 'react';
import QuarterlyCycleView, { QuarterlyCycleData } from '@/components/charts/QuarterlyCycleView';
import { PhaseType } from '@/lib/design-tokens';

const emamiQuarterlyData: QuarterlyCycleData[] = [
  {
    quarter: 'Q1 FY22',
    quarterIndex: 0,
    revenue: 650000000,
    netProfit: 45000000,
    phase: 'expansion',
    cycleIntensity: 75,
    seasonalAdjusted: true,
    quarterlyGrowth: 8.5,
    yearOverYearGrowth: 12.3,
    marketCap: 1500000000000,
    operatingCashFlow: 55000000,
    workingCapital: 120000000,
    seasonalityIndex: 0.95
  },
  {
    quarter: 'Q2 FY22',
    quarterIndex: 1,
    revenue: 720000000,
    netProfit: 52000000,
    phase: 'expansion',
    cycleIntensity: 85,
    seasonalAdjusted: true,
    quarterlyGrowth: 10.8,
    yearOverYearGrowth: 15.2,
    marketCap: 1650000000000,
    operatingCashFlow: 62000000,
    workingCapital: 135000000,
    seasonalityIndex: 1.1
  },
  {
    quarter: 'Q3 FY22',
    quarterIndex: 2,
    revenue: 680000000,
    netProfit: 48000000,
    phase: 'stable',
    cycleIntensity: 60,
    seasonalAdjusted: true,
    quarterlyGrowth: -5.6,
    yearOverYearGrowth: 8.7,
    marketCap: 1580000000000,
    operatingCashFlow: 58000000,
    workingCapital: 125000000,
    seasonalityIndex: 0.9
  },
  {
    quarter: 'Q4 FY22',
    quarterIndex: 3,
    revenue: 750000000,
    netProfit: 58000000,
    phase: 'expansion',
    cycleIntensity: 90,
    seasonalAdjusted: true,
    quarterlyGrowth: 10.3,
    yearOverYearGrowth: 18.5,
    marketCap: 1720000000000,
    operatingCashFlow: 68000000,
    workingCapital: 145000000,
    seasonalityIndex: 1.15
  },
  {
    quarter: 'Q1 FY23',
    quarterIndex: 4,
    revenue: 700000000,
    netProfit: 50000000,
    phase: 'transition',
    cycleIntensity: 45,
    seasonalAdjusted: true,
    quarterlyGrowth: -6.7,
    yearOverYearGrowth: 7.7,
    marketCap: 1620000000000,
    operatingCashFlow: 60000000,
    workingCapital: 130000000,
    seasonalityIndex: 0.95
  },
  {
    quarter: 'Q2 FY23',
    quarterIndex: 5,
    revenue: 690000000,
    netProfit: 47000000,
    phase: 'contraction',
    cycleIntensity: 25,
    seasonalAdjusted: true,
    quarterlyGrowth: -1.4,
    yearOverYearGrowth: -4.2,
    marketCap: 1520000000000,
    operatingCashFlow: 55000000,
    workingCapital: 115000000,
    seasonalityIndex: 1.05
  },
  {
    quarter: 'Q3 FY23',
    quarterIndex: 6,
    revenue: 710000000,
    netProfit: 51000000,
    phase: 'transition',
    cycleIntensity: 40,
    seasonalAdjusted: true,
    quarterlyGrowth: 2.9,
    yearOverYearGrowth: 4.4,
    marketCap: 1580000000000,
    operatingCashFlow: 58000000,
    workingCapital: 125000000,
    seasonalityIndex: 0.92
  },
  {
    quarter: 'Q4 FY23',
    quarterIndex: 7,
    revenue: 780000000,
    netProfit: 62000000,
    phase: 'expansion',
    cycleIntensity: 80,
    seasonalAdjusted: true,
    quarterlyGrowth: 9.9,
    yearOverYearGrowth: 4.0,
    marketCap: 1750000000000,
    operatingCashFlow: 72000000,
    workingCapital: 155000000,
    seasonalityIndex: 1.18
  },
  {
    quarter: 'Q1 FY24',
    quarterIndex: 8,
    revenue: 720000000,
    netProfit: 54000000,
    phase: 'stable',
    cycleIntensity: 55,
    seasonalAdjusted: true,
    quarterlyGrowth: -7.7,
    yearOverYearGrowth: 2.9,
    marketCap: 1680000000000,
    operatingCashFlow: 65000000,
    workingCapital: 140000000,
    seasonalityIndex: 0.97
  },
  {
    quarter: 'Q2 FY24',
    quarterIndex: 9,
    revenue: 740000000,
    netProfit: 56000000,
    phase: 'expansion',
    cycleIntensity: 70,
    seasonalAdjusted: true,
    quarterlyGrowth: 2.8,
    yearOverYearGrowth: 7.2,
    marketCap: 1720000000000,
    operatingCashFlow: 68000000,
    workingCapital: 150000000,
    seasonalityIndex: 1.08
  },
  {
    quarter: 'Q3 FY24',
    quarterIndex: 10,
    revenue: 760000000,
    netProfit: 58000000,
    phase: 'expansion',
    cycleIntensity: 75,
    seasonalAdjusted: true,
    quarterlyGrowth: 2.7,
    yearOverYearGrowth: 7.0,
    marketCap: 1780000000000,
    operatingCashFlow: 70000000,
    workingCapital: 160000000,
    seasonalityIndex: 0.95
  },
  {
    quarter: 'Q4 FY24',
    quarterIndex: 11,
    revenue: 800000000,
    netProfit: 65000000,
    phase: 'expansion',
    cycleIntensity: 85,
    seasonalAdjusted: true,
    quarterlyGrowth: 5.3,
    yearOverYearGrowth: 2.6,
    marketCap: 1850000000000,
    operatingCashFlow: 78000000,
    workingCapital: 170000000,
    seasonalityIndex: 1.2
  }
];

const bankingQuarterlyData: QuarterlyCycleData[] = [
  {
    quarter: 'Q1 FY22',
    quarterIndex: 0,
    revenue: 1200000000,
    netProfit: 320000000,
    phase: 'stable',
    cycleIntensity: 55,
    seasonalAdjusted: false,
    quarterlyGrowth: 3.2,
    yearOverYearGrowth: 18.5,
    marketCap: 2500000000000,
    operatingCashFlow: 450000000,
    workingCapital: -150000000, // Banks typically have negative working capital
    seasonalityIndex: 1.0
  },
  {
    quarter: 'Q2 FY22',
    quarterIndex: 1,
    revenue: 1350000000,
    netProfit: 380000000,
    phase: 'expansion',
    cycleIntensity: 75,
    seasonalAdjusted: false,
    quarterlyGrowth: 12.5,
    yearOverYearGrowth: 25.2,
    marketCap: 2800000000000,
    operatingCashFlow: 520000000,
    workingCapital: -180000000,
    seasonalityIndex: 1.05
  },
  {
    quarter: 'Q3 FY22',
    quarterIndex: 2,
    revenue: 1150000000,
    netProfit: 285000000,
    phase: 'contraction',
    cycleIntensity: 35,
    seasonalAdjusted: false,
    quarterlyGrowth: -14.8,
    yearOverYearGrowth: 8.2,
    marketCap: 2400000000000,
    operatingCashFlow: 380000000,
    workingCapital: -120000000,
    seasonalityIndex: 0.92
  },
  {
    quarter: 'Q4 FY22',
    quarterIndex: 3,
    revenue: 1280000000,
    netProfit: 340000000,
    phase: 'transition',
    cycleIntensity: 50,
    seasonalAdjusted: false,
    quarterlyGrowth: 11.3,
    yearOverYearGrowth: 15.8,
    marketCap: 2650000000000,
    operatingCashFlow: 480000000,
    workingCapital: -160000000,
    seasonalityIndex: 1.08
  },
  {
    quarter: 'Q1 FY23',
    quarterIndex: 4,
    revenue: 1220000000,
    netProfit: 295000000,
    phase: 'stable',
    cycleIntensity: 45,
    seasonalAdjusted: false,
    quarterlyGrowth: -4.7,
    yearOverYearGrowth: 1.7,
    marketCap: 2450000000000,
    operatingCashFlow: 425000000,
    workingCapital: -140000000,
    seasonalityIndex: 0.98
  },
  {
    quarter: 'Q2 FY23',
    quarterIndex: 5,
    revenue: 1320000000,
    netProfit: 350000000,
    phase: 'expansion',
    cycleIntensity: 68,
    seasonalAdjusted: false,
    quarterlyGrowth: 8.2,
    yearOverYearGrowth: -2.2,
    marketCap: 2720000000000,
    operatingCashFlow: 495000000,
    workingCapital: -170000000,
    seasonalityIndex: 1.03
  },
  {
    quarter: 'Q3 FY23',
    quarterIndex: 6,
    revenue: 1280000000,
    netProfit: 335000000,
    phase: 'stable',
    cycleIntensity: 60,
    seasonalAdjusted: false,
    quarterlyGrowth: -3.0,
    yearOverYearGrowth: 11.3,
    marketCap: 2600000000000,
    operatingCashFlow: 460000000,
    workingCapital: -155000000,
    seasonalityIndex: 0.95
  },
  {
    quarter: 'Q4 FY23',
    quarterIndex: 7,
    revenue: 1420000000,
    netProfit: 395000000,
    phase: 'expansion',
    cycleIntensity: 82,
    seasonalAdjusted: false,
    quarterlyGrowth: 10.9,
    yearOverYearGrowth: 10.9,
    marketCap: 2950000000000,
    operatingCashFlow: 580000000,
    workingCapital: -190000000,
    seasonalityIndex: 1.12
  },
  {
    quarter: 'Q1 FY24',
    quarterIndex: 8,
    revenue: 1350000000,
    netProfit: 365000000,
    phase: 'stable',
    cycleIntensity: 58,
    seasonalAdjusted: false,
    quarterlyGrowth: -4.9,
    yearOverYearGrowth: 10.7,
    marketCap: 2750000000000,
    operatingCashFlow: 520000000,
    workingCapital: -175000000,
    seasonalityIndex: 1.01
  },
  {
    quarter: 'Q2 FY24',
    quarterIndex: 9,
    revenue: 1480000000,
    netProfit: 420000000,
    phase: 'expansion',
    cycleIntensity: 88,
    seasonalAdjusted: false,
    quarterlyGrowth: 9.6,
    yearOverYearGrowth: 12.1,
    marketCap: 3100000000000,
    operatingCashFlow: 630000000,
    workingCapital: -205000000,
    seasonalityIndex: 1.08
  },
  {
    quarter: 'Q3 FY24',
    quarterIndex: 10,
    revenue: 1380000000,
    netProfit: 385000000,
    phase: 'transition',
    cycleIntensity: 65,
    seasonalAdjusted: false,
    quarterlyGrowth: -6.8,
    yearOverYearGrowth: 7.8,
    marketCap: 2850000000000,
    operatingCashFlow: 555000000,
    workingCapital: -185000000,
    seasonalityIndex: 0.98
  },
  {
    quarter: 'Q4 FY24',
    quarterIndex: 11,
    revenue: 1520000000,
    netProfit: 445000000,
    phase: 'expansion',
    cycleIntensity: 90,
    seasonalAdjusted: false,
    quarterlyGrowth: 10.1,
    yearOverYearGrowth: 7.0,
    marketCap: 3200000000000,
    operatingCashFlow: 685000000,
    workingCapital: -220000000,
    seasonalityIndex: 1.15
  }
];

export default function QuarterlyCycleDemoPage() {
  const [selectedCompany, setSelectedCompany] = useState<'emami' | 'bank'>('emami');
  const [showPhaseIntensity, setShowPhaseIntensity] = useState(false);
  const [showSeasonalAdjustment, setShowSeasonalAdjustment] = useState(false);
  const [showQuarterlyGrowth, setShowQuarterlyGrowth] = useState(false);
  const [showYearOverYearGrowth, setShowYearOverYearGrowth] = useState(false);
  const [showWorkingCapital, setShowWorkingCapital] = useState(false);
  const [showOperatingCashFlow, setShowOperatingCashFlow] = useState(false);
  const [showSeasonalityIndicators, setShowSeasonalityIndicators] = useState(false);
  const [enableQuarterComparison, setEnableQuarterComparison] = useState(false);
  const [highlightSeasonalPatterns, setHighlightSeasonalPatterns] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState<string | null>(null);
  const [hoveredPhase, setHoveredPhase] = useState<PhaseType | null>(null);

  const currentData = selectedCompany === 'emami' ? emamiQuarterlyData : bankingQuarterlyData;
  const companyName = selectedCompany === 'emami' ? 'Emami Ltd (FMCG)' : 'Axis Bank (Banking)';

  const handleQuarterClick = (quarter: string, data: QuarterlyCycleData) => {
    setSelectedQuarter(quarter);
    console.log('Quarter clicked:', quarter, data);
  };

  const handlePhaseHover = (phase: PhaseType | null, quarter: string | null) => {
    setHoveredPhase(phase);
    console.log('Phase hovered:', phase, quarter);
  };

  const handleSeasonalPatternClick = (pattern: string, quarters: string[]) => {
    console.log('Seasonal pattern clicked:', pattern, quarters);
  };

  // Calculate summary statistics
  const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0);
  const totalProfit = currentData.reduce((sum, item) => sum + item.netProfit, 0);
  const averageGrowth = currentData.reduce((sum, item) => sum + (item.quarterlyGrowth || 0), 0) / currentData.length;
  const averageYoYGrowth = currentData.reduce((sum, item) => sum + (item.yearOverYearGrowth || 0), 0) / currentData.length;

  const expansionQuarters = currentData.filter(item => item.phase === 'expansion').length;
  const contractionQuarters = currentData.filter(item => item.phase === 'contraction').length;
  const stableQuarters = currentData.filter(item => item.phase === 'stable').length;
  const transitionQuarters = currentData.filter(item => item.phase === 'transition').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Task 6.3: Quarterly Cycle View Demo
          </h1>
          <p className="text-lg text-gray-600">
            Granular phase detection with 12 quarters of quarterly data and seasonal analysis
          </p>
        </div>

        {/* Company Selection */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Selection</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedCompany('emami')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedCompany === 'emami'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Emami Ltd (FMCG)
            </button>
            <button
              onClick={() => setSelectedCompany('bank')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedCompany === 'bank'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Axis Bank (Banking)
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Chart Controls</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showPhaseIntensity}
                onChange={(e) => setShowPhaseIntensity(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Phase Intensity</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showSeasonalAdjustment}
                onChange={(e) => setShowSeasonalAdjustment(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Seasonal Adjustment</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showQuarterlyGrowth}
                onChange={(e) => setShowQuarterlyGrowth(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">QoQ Growth</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showYearOverYearGrowth}
                onChange={(e) => setShowYearOverYearGrowth(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">YoY Growth</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showWorkingCapital}
                onChange={(e) => setShowWorkingCapital(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Working Capital</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showOperatingCashFlow}
                onChange={(e) => setShowOperatingCashFlow(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Operating Cash Flow</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showSeasonalityIndicators}
                onChange={(e) => setShowSeasonalityIndicators(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Seasonality Indicators</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={enableQuarterComparison}
                onChange={(e) => setEnableQuarterComparison(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Quarter Comparison</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={highlightSeasonalPatterns}
                onChange={(e) => setHighlightSeasonalPatterns(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Seasonal Patterns</span>
            </label>
          </div>
        </div>

        {/* Chart */}
        <QuarterlyCycleView
          data={currentData}
          showPhaseIntensity={showPhaseIntensity}
          showSeasonalAdjustment={showSeasonalAdjustment}
          showQuarterlyGrowth={showQuarterlyGrowth}
          showYearOverYearGrowth={showYearOverYearGrowth}
          showWorkingCapital={showWorkingCapital}
          showOperatingCashFlow={showOperatingCashFlow}
          showSeasonalityIndicators={showSeasonalityIndicators}
          enableQuarterComparison={enableQuarterComparison}
          highlightSeasonalPatterns={highlightSeasonalPatterns}
          height={600}
          onQuarterClick={handleQuarterClick}
          onPhaseHover={handlePhaseHover}
          onSeasonalPatternClick={handleSeasonalPatternClick}
        />

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{companyName}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Revenue:</span>
                <span className="font-medium">₹{(totalRevenue / 10000000000).toFixed(1)}B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Profit:</span>
                <span className="font-medium">₹{(totalProfit / 10000000000).toFixed(1)}B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg QoQ Growth:</span>
                <span className={`font-medium ${averageGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {averageGrowth >= 0 ? '+' : ''}{averageGrowth.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg YoY Growth:</span>
                <span className={`font-medium ${averageYoYGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {averageYoYGrowth >= 0 ? '+' : ''}{averageYoYGrowth.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Phase Distribution</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-600">Expansion:</span>
                <span className="font-medium">{expansionQuarters} quarters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stable:</span>
                <span className="font-medium">{stableQuarters} quarters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-600">Transition:</span>
                <span className="font-medium">{transitionQuarters} quarters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">Contraction:</span>
                <span className="font-medium">{contractionQuarters} quarters</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Selection</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Selected Quarter:</span>
                <span className="font-medium">{selectedQuarter || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hovered Phase:</span>
                <span className={`font-medium capitalize ${
                  hoveredPhase === 'expansion' ? 'text-green-600' :
                  hoveredPhase === 'contraction' ? 'text-red-600' :
                  hoveredPhase === 'stable' ? 'text-gray-600' :
                  hoveredPhase === 'transition' ? 'text-yellow-600' :
                  'text-gray-400'
                }`}>
                  {hoveredPhase || 'None'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Features Active</h3>
            <div className="space-y-1 text-xs">
              <div className={`px-2 py-1 rounded ${showPhaseIntensity ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>
                Phase Intensity
              </div>
              <div className={`px-2 py-1 rounded ${showQuarterlyGrowth ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                QoQ Growth
              </div>
              <div className={`px-2 py-1 rounded ${showYearOverYearGrowth ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-500'}`}>
                YoY Growth
              </div>
              <div className={`px-2 py-1 rounded ${highlightSeasonalPatterns ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-500'}`}>
                Seasonal Patterns
              </div>
            </div>
          </div>
        </div>

        {/* Data Summary */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Quarterly Features Tested</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>✅ Granular phase detection (12 quarters)</li>
                <li>✅ Quarter-over-quarter growth rates</li>
                <li>✅ Year-over-year growth comparison</li>
                <li>✅ Seasonal adjustment indicators</li>
                <li>✅ Working capital trends</li>
                <li>✅ Operating cash flow overlays</li>
                <li>✅ Interactive seasonal pattern analysis</li>
                <li>✅ Quarter comparison features</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Component Capabilities</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>📊 Multiple data overlays with dual Y-axes</li>
                <li>🎨 Apple-style glass morphism UI</li>
                <li>📱 Fully responsive design</li>
                <li>🔍 Interactive tooltips with detailed info</li>
                <li>⚡ Performance optimized with React.memo</li>
                <li>🎯 Granular phase background visualization</li>
                <li>📈 Real-time seasonal pattern detection</li>
                <li>🔄 Smooth transitions and animations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 