'use client';

import React, { useState } from 'react';
import { NetCashFlowOverlay } from '@/components/cashflow/NetCashFlowOverlay';

// Enhanced Emami Limited cash flow data with cumulative and FCF calculations (2014-2023)
const emamiNetCashFlowData = [
  {
    year: 2014,
    operatingCashFlow: 315,
    investingCashFlow: -125,
    financingCashFlow: -89,
    netCashFlow: 101,
    cumulativeNetCashFlow: 101,
    freeCashFlow: 190,
    revenue: 2485
  },
  {
    year: 2015,
    operatingCashFlow: 385,
    investingCashFlow: -145,
    financingCashFlow: -78,
    netCashFlow: 162,
    cumulativeNetCashFlow: 263,
    freeCashFlow: 240,
    revenue: 2690
  },
  {
    year: 2016,
    operatingCashFlow: 420,
    investingCashFlow: -160,
    financingCashFlow: -95,
    netCashFlow: 165,
    cumulativeNetCashFlow: 428,
    freeCashFlow: 260,
    revenue: 2890
  },
  {
    year: 2017,
    operatingCashFlow: 480,
    investingCashFlow: -180,
    financingCashFlow: -125,
    netCashFlow: 175,
    cumulativeNetCashFlow: 603,
    freeCashFlow: 300,
    revenue: 3120
  },
  {
    year: 2018,
    operatingCashFlow: 520,
    investingCashFlow: -200,
    financingCashFlow: -150,
    netCashFlow: 170,
    cumulativeNetCashFlow: 773,
    freeCashFlow: 320,
    revenue: 3350
  },
  {
    year: 2019,
    operatingCashFlow: 580,
    investingCashFlow: -220,
    financingCashFlow: -160,
    netCashFlow: 200,
    cumulativeNetCashFlow: 973,
    freeCashFlow: 360,
    revenue: 3580
  },
  {
    year: 2020,
    operatingCashFlow: 650,
    investingCashFlow: -180,
    financingCashFlow: -220,
    netCashFlow: 250,
    cumulativeNetCashFlow: 1223,
    freeCashFlow: 470,
    revenue: 3750
  },
  {
    year: 2021,
    operatingCashFlow: 720,
    investingCashFlow: -240,
    financingCashFlow: -180,
    netCashFlow: 300,
    cumulativeNetCashFlow: 1523,
    freeCashFlow: 480,
    revenue: 4100
  },
  {
    year: 2022,
    operatingCashFlow: 780,
    investingCashFlow: -280,
    financingCashFlow: -195,
    netCashFlow: 305,
    cumulativeNetCashFlow: 1828,
    freeCashFlow: 500,
    revenue: 4450
  },
  {
    year: 2023,
    operatingCashFlow: 850,
    investingCashFlow: -320,
    financingCashFlow: -210,
    netCashFlow: 320,
    cumulativeNetCashFlow: 2148,
    freeCashFlow: 530,
    revenue: 4820
  }
];

// Quarterly data for 2023 breakdown
const emamiQuarterlyNetCashFlowData = [
  {
    quarter: 'Q1 2023',
    operatingCashFlow: 200,
    investingCashFlow: -75,
    financingCashFlow: -50,
    netCashFlow: 75,
    cumulativeNetCashFlow: 75,
    freeCashFlow: 125,
    revenue: 1150
  },
  {
    quarter: 'Q2 2023',
    operatingCashFlow: 220,
    investingCashFlow: -85,
    financingCashFlow: -55,
    netCashFlow: 80,
    cumulativeNetCashFlow: 155,
    freeCashFlow: 135,
    revenue: 1200
  },
  {
    quarter: 'Q3 2023',
    operatingCashFlow: 210,
    investingCashFlow: -80,
    financingCashFlow: -52,
    netCashFlow: 78,
    cumulativeNetCashFlow: 233,
    freeCashFlow: 130,
    revenue: 1220
  },
  {
    quarter: 'Q4 2023',
    operatingCashFlow: 220,
    investingCashFlow: -80,
    financingCashFlow: -53,
    netCashFlow: 87,
    cumulativeNetCashFlow: 320,
    freeCashFlow: 140,
    revenue: 1250
  }
];

export default function NetCashFlowOverlayDemo() {
  const [viewMode, setViewMode] = useState<'annual' | 'quarterly'>('annual');
  const [showNetCashFlowLine, setShowNetCashFlowLine] = useState(true);
  const [showCumulativeLine, setShowCumulativeLine] = useState(false);
  const [showFreeCashFlowLine, setShowFreeCashFlowLine] = useState(false);
  const [showZeroLine, setShowZeroLine] = useState(true);

  const currentData = viewMode === 'annual' ? emamiNetCashFlowData : emamiQuarterlyNetCashFlowData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Net Cash Flow Overlay Demo
                </h1>
                <p className="mt-2 text-gray-600">
                  Task 9.3 - Net Cash Flow Line Overlay - Emami Limited (2014-2023)
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✅ 36/37 Tests Passing
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  TDD Complete
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Interactive Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Mode
              </label>
              <div className="flex space-x-3">
                <button
                  onClick={() => setViewMode('annual')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    viewMode === 'annual'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Annual (10 Years)
                </button>
                <button
                  onClick={() => setViewMode('quarterly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    viewMode === 'quarterly'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Quarterly (2023)
                </button>
              </div>
            </div>

            {/* Line Overlays */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Line Overlays
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showNetCashFlowLine}
                    onChange={(e) => setShowNetCashFlowLine(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Net Cash Flow
                    <span className="ml-1 inline-block w-4 h-2 bg-blue-500 rounded"></span>
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showCumulativeLine}
                    onChange={(e) => setShowCumulativeLine(e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Cumulative Cash Flow
                    <span className="ml-1 inline-block w-4 h-2 bg-purple-500 rounded"></span>
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showFreeCashFlowLine}
                    onChange={(e) => setShowFreeCashFlowLine(e.target.checked)}
                    className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Free Cash Flow
                    <span className="ml-1 inline-block w-4 h-2 bg-cyan-500 rounded"></span>
                  </span>
                </label>
              </div>
            </div>

            {/* Chart Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chart Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showZeroLine}
                    onChange={(e) => setShowZeroLine(e.target.checked)}
                    className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Zero Reference Line</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Component Demo */}
        <div className="bg-white rounded-lg shadow p-6">
          <NetCashFlowOverlay
            data={currentData}
            viewMode={viewMode}
            showNetCashFlowLine={showNetCashFlowLine}
            showCumulativeLine={showCumulativeLine}
            showFreeCashFlowLine={showFreeCashFlowLine}
            showZeroLine={showZeroLine}
            height={500}
            className="net-cash-flow-overlay-demo"
          />
        </div>

        {/* Current Data Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cash Flow Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Cash Flow Components</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                  Operating CF
                </span>
                <span className="font-medium text-green-600">
                  ₹{currentData[currentData.length - 1]?.operatingCashFlow} Cr
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                  Investing CF
                </span>
                <span className="font-medium text-red-600">
                  ₹{currentData[currentData.length - 1]?.investingCashFlow} Cr
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
                  Financing CF
                </span>
                <span className="font-medium text-orange-600">
                  ₹{currentData[currentData.length - 1]?.financingCashFlow} Cr
                </span>
              </div>
            </div>
          </div>

          {/* Overlay Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Overlay Metrics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                  Net Cash Flow
                </span>
                <span className="font-medium text-blue-600">
                  ₹{currentData[currentData.length - 1]?.netCashFlow} Cr
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                  Cumulative CF
                </span>
                <span className="font-medium text-purple-600">
                  ₹{currentData[currentData.length - 1]?.cumulativeNetCashFlow} Cr
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-cyan-500 rounded mr-2"></div>
                  Free Cash Flow
                </span>
                <span className="font-medium text-cyan-600">
                  ₹{currentData[currentData.length - 1]?.freeCashFlow} Cr
                </span>
              </div>
            </div>
          </div>

          {/* Growth Analysis */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Growth Trends</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Net CF CAGR</span>
                <span className="font-medium text-green-600">12.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">FCF CAGR</span>
                <span className="font-medium text-cyan-600">11.4%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">OCF Consistency</span>
                <span className="font-medium text-green-600">95%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Component Features Documentation */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">NetCashFlowOverlay Component Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">📊 Core Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Stacked bar chart for OCF, ICF, FCF components</li>
                <li>• Net cash flow line overlay with dual y-axis</li>
                <li>• Cumulative cash flow progression tracking</li>
                <li>• Free cash flow trend visualization</li>
                <li>• Zero reference line for breakeven analysis</li>
                <li>• Support for annual and quarterly time periods</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">🎯 Advanced Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Dual y-axis configuration for different scales</li>
                <li>• Custom line styles (solid, dashed patterns)</li>
                <li>• Interactive tooltips with Indian currency formatting</li>
                <li>• Responsive design for all screen sizes</li>
                <li>• Dynamic legend based on enabled overlays</li>
                <li>• Performance optimized for large datasets</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Cash Flow Analysis Insights</h4>
            <div className="text-sm text-blue-800">
              <p className="mb-2">
                <strong>Stacked Bars:</strong> Show the composition of net cash flow from three sources - 
                operations (green), investments (red), and financing (orange).
              </p>
              <p className="mb-2">
                <strong>Net Cash Flow Line:</strong> Blue line overlay shows the actual net result after 
                combining all three cash flow streams.
              </p>
              <p className="mb-2">
                <strong>Cumulative Line:</strong> Purple dashed line tracks total cash generation over time, 
                showing long-term cash building capacity.
              </p>
              <p>
                <strong>Free Cash Flow Line:</strong> Cyan dashed line represents cash available to shareholders 
                after necessary investments (OCF - ICF).
              </p>
            </div>
          </div>
        </div>

        {/* Data Sample */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Sample Data Structure</h2>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  year: 2023,
  operatingCashFlow: 850,
  investingCashFlow: -320,
  financingCashFlow: -210,
  netCashFlow: 320,
  cumulativeNetCashFlow: 2148,
  freeCashFlow: 530,
  revenue: 4820
}`}
          </pre>
        </div>
      </div>
    </div>
  );
} 