'use client';

import React, { useState } from 'react';
import { CashBurnRateChart, CashBurnRateData } from '../../../components/cashflow/CashBurnRateChart';

// Emami Limited - Quarterly Cash Flow Data (Q1 2022 - Q4 2024)
const emamiQuarterlyData: CashBurnRateData[] = [
  {
    year: 2022,
    quarter: 'Q1 2022',
    operatingCashFlow: 133.2,
    investingCashFlow: -45.6,
    financingCashFlow: -67.4,
    netCashFlow: 20.2,
    cashPosition: 234.5,
    burnRate: 20.2, // Positive indicates cash generation
    burnRateMA: 18.7, // 3-period moving average
    cashRunwayMonths: 999, // Infinite runway for profitable company
    operatingBurnRate: -133.2, // Negative indicates cash generation from operations
    investingBurnRate: 45.6,
    totalExpenses: 1112.4,
    revenue: 1245.6
  },
  {
    year: 2022,
    quarter: 'Q2 2022',
    operatingCashFlow: 111.8,
    investingCashFlow: -52.3,
    financingCashFlow: -35.2,
    netCashFlow: 24.3,
    cashPosition: 258.8,
    burnRate: 24.3,
    burnRateMA: 21.1,
    cashRunwayMonths: 999,
    operatingBurnRate: -111.8,
    investingBurnRate: 52.3,
    totalExpenses: 1186.6,
    revenue: 1298.4
  },
  {
    year: 2022,
    quarter: 'Q3 2022',
    operatingCashFlow: 122.5,
    investingCashFlow: -38.7,
    financingCashFlow: -45.8,
    netCashFlow: 38.0,
    cashPosition: 296.8,
    burnRate: 38.0,
    burnRateMA: 27.5,
    cashRunwayMonths: 999,
    operatingBurnRate: -122.5,
    investingBurnRate: 38.7,
    totalExpenses: 1233.7,
    revenue: 1356.2
  },
  {
    year: 2022,
    quarter: 'Q4 2022',
    operatingCashFlow: 145.3,
    investingCashFlow: -62.1,
    financingCashFlow: -78.9,
    netCashFlow: 4.3,
    cashPosition: 301.1,
    burnRate: 4.3,
    burnRateMA: 22.2,
    cashRunwayMonths: 999,
    operatingBurnRate: -145.3,
    investingBurnRate: 62.1,
    totalExpenses: 1287.3,
    revenue: 1432.6
  },
  {
    year: 2023,
    quarter: 'Q1 2023',
    operatingCashFlow: 156.7,
    investingCashFlow: -34.2,
    financingCashFlow: -89.1,
    netCashFlow: 33.4,
    cashPosition: 334.5,
    burnRate: 33.4,
    burnRateMA: 25.3,
    cashRunwayMonths: 999,
    operatingBurnRate: -156.7,
    investingBurnRate: 34.2,
    totalExpenses: 1198.3,
    revenue: 1355.0
  },
  {
    year: 2023,
    quarter: 'Q2 2023',
    operatingCashFlow: 142.9,
    investingCashFlow: -41.5,
    financingCashFlow: -67.8,
    netCashFlow: 33.6,
    cashPosition: 368.1,
    burnRate: 33.6,
    burnRateMA: 23.8,
    cashRunwayMonths: 999,
    operatingBurnRate: -142.9,
    investingBurnRate: 41.5,
    totalExpenses: 1243.7,
    revenue: 1386.6
  },
  {
    year: 2023,
    quarter: 'Q3 2023',
    operatingCashFlow: 167.2,
    investingCashFlow: -55.8,
    financingCashFlow: -78.4,
    netCashFlow: 33.0,
    cashPosition: 401.1,
    burnRate: 33.0,
    burnRateMA: 33.3,
    cashRunwayMonths: 999,
    operatingBurnRate: -167.2,
    investingBurnRate: 55.8,
    totalExpenses: 1289.8,
    revenue: 1457.0
  },
  {
    year: 2023,
    quarter: 'Q4 2023',
    operatingCashFlow: 178.5,
    investingCashFlow: -43.7,
    financingCashFlow: -89.2,
    netCashFlow: 45.6,
    cashPosition: 446.7,
    burnRate: 45.6,
    burnRateMA: 37.4,
    cashRunwayMonths: 999,
    operatingBurnRate: -178.5,
    investingBurnRate: 43.7,
    totalExpenses: 1267.9,
    revenue: 1446.4
  },
  {
    year: 2024,
    quarter: 'Q1 2024',
    operatingCashFlow: 189.3,
    investingCashFlow: -67.9,
    financingCashFlow: -95.7,
    netCashFlow: 25.7,
    cashPosition: 472.4,
    burnRate: 25.7,
    burnRateMA: 34.8,
    cashRunwayMonths: 999,
    operatingBurnRate: -189.3,
    investingBurnRate: 67.9,
    totalExpenses: 1334.2,
    revenue: 1523.5
  },
  {
    year: 2024,
    quarter: 'Q2 2024',
    operatingCashFlow: 198.7,
    investingCashFlow: -78.3,
    financingCashFlow: -87.4,
    netCashFlow: 33.0,
    cashPosition: 505.4,
    burnRate: 33.0,
    burnRateMA: 34.8,
    cashRunwayMonths: 999,
    operatingBurnRate: -198.7,
    investingBurnRate: 78.3,
    totalExpenses: 1378.9,
    revenue: 1577.6
  },
  {
    year: 2024,
    quarter: 'Q3 2024',
    operatingCashFlow: 203.4,
    investingCashFlow: -89.2,
    financingCashFlow: -92.1,
    netCashFlow: 22.1,
    cashPosition: 527.5,
    burnRate: 22.1,
    burnRateMA: 26.9,
    cashRunwayMonths: 999,
    operatingBurnRate: -203.4,
    investingBurnRate: 89.2,
    totalExpenses: 1423.6,
    revenue: 1627.0
  },
  {
    year: 2024,
    quarter: 'Q4 2024',
    operatingCashFlow: 216.8,
    investingCashFlow: -95.6,
    financingCashFlow: -98.7,
    netCashFlow: 22.5,
    cashPosition: 550.0,
    burnRate: 22.5,
    burnRateMA: 25.9,
    cashRunwayMonths: 999,
    operatingBurnRate: -216.8,
    investingBurnRate: 95.6,
    totalExpenses: 1456.8,
    revenue: 1673.6
  }
];

// Emami Limited - Annual Cash Flow Data (2019-2023)
const emamiAnnualData: CashBurnRateData[] = [
  {
    year: 2019,
    operatingCashFlow: 489.3,
    investingCashFlow: -156.7,
    financingCashFlow: -287.4,
    netCashFlow: 45.2,
    cashPosition: 387.6,
    burnRate: 45.2,
    burnRateMA: 42.8,
    cashRunwayMonths: 999,
    operatingBurnRate: -489.3,
    investingBurnRate: 156.7,
    totalExpenses: 3867.4,
    revenue: 4356.7
  },
  {
    year: 2020,
    operatingCashFlow: 523.7,
    investingCashFlow: -178.9,
    financingCashFlow: -312.1,
    netCashFlow: 32.7,
    cashPosition: 420.3,
    burnRate: 32.7,
    burnRateMA: 39.0,
    cashRunwayMonths: 999,
    operatingBurnRate: -523.7,
    investingBurnRate: 178.9,
    totalExpenses: 4265.7,
    revenue: 4789.4
  },
  {
    year: 2021,
    operatingCashFlow: 612.8,
    investingCashFlow: -198.4,
    financingCashFlow: -378.2,
    netCashFlow: 36.2,
    cashPosition: 456.5,
    burnRate: 36.2,
    burnRateMA: 38.0,
    cashRunwayMonths: 999,
    operatingBurnRate: -612.8,
    investingBurnRate: 198.4,
    totalExpenses: 4687.3,
    revenue: 5300.1
  },
  {
    year: 2022,
    operatingCashFlow: 512.8,
    investingCashFlow: -198.7,
    financingCashFlow: -227.3,
    netCashFlow: 86.8,
    cashPosition: 543.3,
    burnRate: 86.8,
    burnRateMA: 51.9,
    cashRunwayMonths: 999,
    operatingBurnRate: -512.8,
    investingBurnRate: 198.7,
    totalExpenses: 4820.2,
    revenue: 5333.0
  },
  {
    year: 2023,
    operatingCashFlow: 645.3,
    investingCashFlow: -175.2,
    financingCashFlow: -324.5,
    netCashFlow: 145.6,
    cashPosition: 688.9,
    burnRate: 145.6,
    burnRateMA: 86.4,
    cashRunwayMonths: 999,
    operatingBurnRate: -645.3,
    investingBurnRate: 175.2,
    totalExpenses: 5001.5,
    revenue: 5646.8
  }
];

export default function CashBurnAnalysisDemo() {
  const [viewMode, setViewMode] = useState<'quarterly' | 'annual'>('quarterly');
  const [showBurnRate, setShowBurnRate] = useState(true);
  const [showBurnRateMA, setShowBurnRateMA] = useState(true);
  const [showCashRunway, setShowCashRunway] = useState(true);
  const [showCashPosition, setShowCashPosition] = useState(false);
  const [showCashFlowAreas, setShowCashFlowAreas] = useState(false);
  const [showZeroLine, setShowZeroLine] = useState(true);
  const [showCriticalThreshold, setShowCriticalThreshold] = useState(true);
  const [chartHeight, setChartHeight] = useState(450);

  const currentData = viewMode === 'quarterly' ? emamiQuarterlyData : emamiAnnualData;
  const criticalRunwayMonths = 12; // 12 months critical threshold

  // Calculate key metrics for insights
  const latestData = currentData[currentData.length - 1];
  const firstData = currentData[0];
  const avgBurnRate = currentData.reduce((sum: number, item: CashBurnRateData) => sum + Math.abs(item.burnRate), 0) / currentData.length;
  const burnImprovement = ((Math.abs(firstData.burnRate) - Math.abs(latestData.burnRate)) / Math.abs(firstData.burnRate)) * 100;
  const isPositiveCashGen = latestData.burnRate > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cash Generation Analysis Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive cash flow analysis and runway assessment for established companies, 
            showing cash generation patterns and financial sustainability
          </p>
        </div>

        {/* Company Context */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Emami Limited</h2>
            <div className="text-sm text-gray-500">
              FMCG • Consumer Products • Listed Company
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`rounded-lg p-4 ${isPositiveCashGen ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className={`text-sm font-medium ${isPositiveCashGen ? 'text-green-700' : 'text-red-700'}`}>
                Net Cash Flow
              </div>
              <div className={`text-2xl font-bold ${isPositiveCashGen ? 'text-green-900' : 'text-red-900'}`}>
                {isPositiveCashGen ? '+' : ''}₹{Math.abs(latestData.burnRate).toFixed(1)}L
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {isPositiveCashGen ? 'Positive Generation' : 'Cash Outflow'}
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm font-medium text-blue-700">Cash Runway</div>
              <div className="text-2xl font-bold text-blue-900">
                {latestData.cashRunwayMonths >= 999 ? '∞' : latestData.cashRunwayMonths.toFixed(0)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {latestData.cashRunwayMonths >= 999 ? 'Self-sustaining' : 'Months remaining'}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm font-medium text-purple-700">Cash Flow Change</div>
              <div className="text-2xl font-bold text-purple-900">
                {burnImprovement > 0 ? '+' : ''}{burnImprovement.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                vs 2022 baseline
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-sm font-medium text-orange-700">Cash Position</div>
              <div className="text-2xl font-bold text-orange-900">
                ₹{latestData.cashPosition.toFixed(1)}L
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Current balance
              </div>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chart Configuration</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Mode
              </label>
              <div className="flex space-x-3">
                <button
                  onClick={() => setViewMode('quarterly')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'quarterly'
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Quarterly
                </button>
                <button
                  onClick={() => setViewMode('annual')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'annual'
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Annual
                </button>
              </div>
            </div>

            {/* Chart Elements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chart Elements
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showBurnRate}
                    onChange={(e) => setShowBurnRate(e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Net Cash Flow</span>
                  <div className="ml-2 w-3 h-3 bg-red-500 rounded"></div>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showBurnRateMA}
                    onChange={(e) => setShowBurnRateMA(e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Cash Flow MA</span>
                  <div className="ml-2 w-3 h-3 bg-orange-500 rounded border-dashed border border-orange-500"></div>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showCashRunway}
                    onChange={(e) => setShowCashRunway(e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Cash Runway</span>
                  <div className="ml-2 w-3 h-3 bg-blue-500 rounded"></div>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showCashPosition}
                    onChange={(e) => setShowCashPosition(e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Cash Position</span>
                  <div className="ml-2 w-3 h-3 bg-green-500 rounded opacity-30"></div>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showCashFlowAreas}
                    onChange={(e) => setShowCashFlowAreas(e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Cash Flow Areas</span>
                  <div className="ml-2 flex space-x-1">
                    <div className="w-2 h-3 bg-green-500 opacity-60"></div>
                    <div className="w-2 h-3 bg-red-500 opacity-60"></div>
                    <div className="w-2 h-3 bg-yellow-500 opacity-60"></div>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showZeroLine}
                    onChange={(e) => setShowZeroLine(e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Zero Line</span>
                  <div className="ml-2 w-3 h-3 bg-gray-500 rounded border-dashed border border-gray-500"></div>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showCriticalThreshold}
                    onChange={(e) => setShowCriticalThreshold(e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Critical Threshold</span>
                  <div className="ml-2 w-3 h-3 bg-red-600 rounded border-dashed border border-red-600"></div>
                </label>
              </div>
            </div>

            {/* Chart Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chart Height: {chartHeight}px
              </label>
              <input
                type="range"
                min="300"
                max="600"
                step="50"
                value={chartHeight}
                onChange={(e) => setChartHeight(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>300px</span>
                <span>600px</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Cash Generation Analysis - {viewMode === 'quarterly' ? 'Quarterly View' : 'Annual View'}
            </h3>
            <div className="text-sm text-gray-500">
              {viewMode === 'quarterly' ? '12 Quarters' : '5 Years'} • Emami Limited
            </div>
          </div>

          <CashBurnRateChart
            data={currentData}
            viewMode={viewMode}
            showBurnRate={showBurnRate}
            showBurnRateMA={showBurnRateMA}
            showCashRunway={showCashRunway}
            showCashPosition={showCashPosition}
            showCashFlowAreas={showCashFlowAreas}
            showZeroLine={showZeroLine}
            showCriticalThreshold={showCriticalThreshold}
            criticalRunwayMonths={criticalRunwayMonths}
            height={chartHeight}
            className="mt-4"
          />
        </div>

        {/* Insights Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Cash Flow Performance</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Company {isPositiveCashGen ? `generating ₹${latestData.burnRate.toFixed(1)}L net cash per ${viewMode.slice(0, -2)}` : `experiencing net outflow of ₹${Math.abs(latestData.burnRate).toFixed(1)}L per ${viewMode.slice(0, -2)}`}</li>
                <li>• Cash position of {latestData.cashRunwayMonths >= 999 ? 'self-sustaining operations' : `${latestData.cashRunwayMonths.toFixed(0)} months runway`}</li>
                <li>• Net cash flow changed by {burnImprovement.toFixed(1)}% from 2022 baseline</li>
                <li>• Current cash & equivalents: ₹{latestData.cashPosition.toFixed(1)}L</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Chart Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <span className="text-red-600">Red line</span>: Net cash flow (positive = generation)</li>
                <li>• <span className="text-orange-600">Orange dashed</span>: 3-period moving average cash flow</li>
                <li>• <span className="text-blue-600">Blue line</span>: Cash runway in months (right axis)</li>
                <li>• <span className="text-green-600">Green bars</span>: Cash & equivalents position</li>
                <li>• <span className="text-gray-600">Gray dashed</span>: Zero reference line</li>
                <li>• <span className="text-red-600">Red threshold</span>: Critical 12-month runway warning</li>
                <li>• Stacked areas: Operating, investing, financing cash flows</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2">💡 Interpretation Guide</h4>
            <p className="text-sm text-yellow-700">
              <strong>Net Cash Flow:</strong> Positive values indicate cash generation from operations minus investments and financing. 
              <strong>Runway:</strong> For profitable companies like Emami, typically shows self-sustaining operations. 
              <strong>Cash Flow Areas:</strong> Green (operating), Red (investing), Orange (financing) show cash flow sources and uses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 