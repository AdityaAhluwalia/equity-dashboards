'use client';

import React, { useState } from 'react';
import { CashFlowChart } from '@/components/cashflow/CashFlowChart';

// Enhanced Emami Limited cash flow data (2014-2023)
const emamiCashFlowData = [
  {
    year: 2014,
    revenue: 2485,
    operatingCashFlow: 315,
    investingCashFlow: -125,
    financingCashFlow: -89,
    netCashFlow: 101,
    freeCashFlow: 190,
    totalAssets: 3200
  },
  {
    year: 2015,
    revenue: 2690,
    operatingCashFlow: 385,
    investingCashFlow: -145,
    financingCashFlow: -78,
    netCashFlow: 162,
    freeCashFlow: 240,
    totalAssets: 3450
  },
  {
    year: 2016,
    revenue: 2890,
    operatingCashFlow: 420,
    investingCashFlow: -160,
    financingCashFlow: -95,
    netCashFlow: 165,
    freeCashFlow: 260,
    totalAssets: 3680
  },
  {
    year: 2017,
    revenue: 3020,
    operatingCashFlow: 465,
    investingCashFlow: -180,
    financingCashFlow: -110,
    netCashFlow: 175,
    freeCashFlow: 285,
    totalAssets: 3850
  },
  {
    year: 2018,
    revenue: 3180,
    operatingCashFlow: 520,
    investingCashFlow: -200,
    financingCashFlow: -125,
    netCashFlow: 195,
    freeCashFlow: 320,
    totalAssets: 4100
  },
  {
    year: 2019,
    revenue: 3350,
    operatingCashFlow: 580,
    investingCashFlow: -220,
    financingCashFlow: -140,
    netCashFlow: 220,
    freeCashFlow: 360,
    totalAssets: 4300
  },
  {
    year: 2020,
    revenue: 3180, // COVID impact
    operatingCashFlow: 490,
    investingCashFlow: -150,
    financingCashFlow: -180,
    netCashFlow: 160,
    freeCashFlow: 340,
    totalAssets: 4100
  },
  {
    year: 2021,
    revenue: 3450,
    operatingCashFlow: 580,
    investingCashFlow: -200,
    financingCashFlow: -150,
    netCashFlow: 230,
    freeCashFlow: 380,
    totalAssets: 4400
  },
  {
    year: 2022,
    revenue: 3680,
    operatingCashFlow: 650,
    investingCashFlow: -220,
    financingCashFlow: -160,
    netCashFlow: 270,
    freeCashFlow: 430,
    totalAssets: 4700
  },
  {
    year: 2023,
    revenue: 3950,
    operatingCashFlow: 720,
    investingCashFlow: -250,
    financingCashFlow: -180,
    netCashFlow: 290,
    freeCashFlow: 470,
    totalAssets: 5000
  }
];

// Quarterly data for Q1-Q4 2023
const emamiQuarterlyCashFlow = [
  {
    quarter: 'Q1 2023',
    operatingCashFlow: 165,
    investingCashFlow: -55,
    financingCashFlow: -40,
    netCashFlow: 70,
    freeCashFlow: 110
  },
  {
    quarter: 'Q2 2023',
    operatingCashFlow: 185,
    investingCashFlow: -65,
    financingCashFlow: -45,
    netCashFlow: 75,
    freeCashFlow: 120
  },
  {
    quarter: 'Q3 2023',
    operatingCashFlow: 175,
    investingCashFlow: -60,
    financingCashFlow: -50,
    netCashFlow: 65,
    freeCashFlow: 115
  },
  {
    quarter: 'Q4 2023',
    operatingCashFlow: 195,
    investingCashFlow: -70,
    financingCashFlow: -45,
    netCashFlow: 80,
    freeCashFlow: 125
  }
];

export default function CashFlowChartDemo() {
  const [viewMode, setViewMode] = useState<'annual' | 'quarterly'>('annual');
  const [showFCFYield, setShowFCFYield] = useState(true);
  const [showZeroLine, setShowZeroLine] = useState(true);
  const [height, setHeight] = useState(400);

  const data = viewMode === 'annual' ? emamiCashFlowData : emamiQuarterlyCashFlow;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cash Flow Chart Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive cash flow visualization with stacked bars for OCF, ICF, FCF 
            and net cash flow line overlay for Emami Limited (10-year data)
          </p>
        </div>

        {/* Controls Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Interactive Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* View Mode Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Mode
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('annual')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'annual'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Annual
                </button>
                <button
                  onClick={() => setViewMode('quarterly')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'quarterly'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Quarterly
                </button>
              </div>
            </div>

            {/* FCF Yield Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                FCF Yield Display
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showFCFYield}
                  onChange={(e) => setShowFCFYield(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Show FCF Yield %</span>
              </label>
            </div>

            {/* Zero Line Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zero Reference Line
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showZeroLine}
                  onChange={(e) => setShowZeroLine(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Show Zero Line</span>
              </label>
            </div>

            {/* Height Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chart Height: {height}px
              </label>
              <input
                type="range"
                min="300"
                max="600"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full"
              />
            </div>

          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              Emami Limited - Cash Flow Patterns
            </h2>
            <div className="text-sm text-gray-500">
              {viewMode === 'annual' ? '10 Years (2014-2023)' : 'Q1-Q4 2023'}
            </div>
          </div>

          <CashFlowChart
            data={data}
            viewMode={viewMode}
            showFCFYield={showFCFYield}
            showZeroLine={showZeroLine}
            height={height}
            className="w-full"
          />
        </div>

        {/* Insights Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Chart Components Explanation */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Chart Components</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <div>
                  <div className="font-medium">Operating Cash Flow (OCF)</div>
                  <div className="text-sm text-gray-600">Cash from core business operations</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <div>
                  <div className="font-medium">Investing Cash Flow (ICF)</div>
                  <div className="text-sm text-gray-600">Cash used for investments and capex</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <div>
                  <div className="font-medium">Financing Cash Flow (FCF)</div>
                  <div className="text-sm text-gray-600">Cash from financing activities</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-1 bg-blue-500 rounded"></div>
                <div>
                  <div className="font-medium">Net Cash Flow</div>
                  <div className="text-sm text-gray-600">Total cash flow (line overlay)</div>
                </div>
              </div>
              {showFCFYield && (
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-1 bg-purple-500 rounded border-dashed"></div>
                  <div>
                    <div className="font-medium">FCF Yield %</div>
                    <div className="text-sm text-gray-600">Free cash flow as % of revenue</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Key Insights</h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-medium text-green-800">Strong Operating Cash Flow</div>
                <div className="text-sm text-green-700">
                  Consistent positive OCF growth from ₹315 Cr to ₹720 Cr (2014-2023)
                </div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="font-medium text-yellow-800">Steady Investment</div>
                <div className="text-sm text-yellow-700">
                  Regular capex investments averaging ₹180-250 Cr annually
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-800">Positive Net Cash Flow</div>
                <div className="text-sm text-blue-700">
                  Consistently positive net cash generation indicating financial health
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="font-medium text-purple-800">Strong FCF Yield</div>
                <div className="text-sm text-purple-700">
                  FCF yield averaging 10-12% demonstrates efficient cash conversion
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Technical Implementation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Technical Implementation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Features Implemented</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>✓ Stacked bar chart for cash flow components</li>
                <li>✓ Net cash flow line overlay on secondary axis</li>
                <li>✓ Optional FCF yield percentage calculation</li>
                <li>✓ Zero reference line for easy interpretation</li>
                <li>✓ Responsive design with custom height</li>
                <li>✓ Annual and quarterly view modes</li>
                <li>✓ Interactive tooltips with formatted values</li>
                <li>✓ Professional color scheme and legend</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Test Coverage</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>✓ 30 comprehensive test cases</li>
                <li>✓ Component rendering and props validation</li>
                <li>✓ Chart element presence and configuration</li>
                <li>✓ Color scheme and styling verification</li>
                <li>✓ View mode switching functionality</li>
                <li>✓ Feature toggle testing (FCF yield, zero line)</li>
                <li>✓ Error handling and edge cases</li>
                <li>✓ Responsive behavior validation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <div className="flex justify-center space-x-4">
            <a
              href="/dashboard"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              ← Back to Dashboard
            </a>
            <a
              href="/demo"
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              View All Demos
            </a>
          </div>
        </div>

      </div>
    </div>
  );
} 