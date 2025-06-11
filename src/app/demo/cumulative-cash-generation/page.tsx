'use client';

import React, { useState } from 'react';
import { CumulativeCashFlow } from '@/components/cashflow/CumulativeCashFlow';

// Mock quarterly data for Emami Limited (2022-2024)
const quarterlyData = [
  {
    year: 2022,
    quarter: 'Q1 2022',
    operatingCashFlow: 178,
    investingCashFlow: -45,
    financingCashFlow: -65,
    netCashFlow: 68,
    cumulativeOperatingCF: 178,
    cumulativeInvestingCF: -45,
    cumulativeFinancingCF: -65,
    cumulativeNetCF: 68,
    periodEndingCash: 568
  },
  {
    year: 2022,
    quarter: 'Q2 2022',
    operatingCashFlow: 156,
    investingCashFlow: -78,
    financingCashFlow: -45,
    netCashFlow: 33,
    cumulativeOperatingCF: 334,
    cumulativeInvestingCF: -123,
    cumulativeFinancingCF: -110,
    cumulativeNetCF: 101,
    periodEndingCash: 601
  },
  {
    year: 2022,
    quarter: 'Q3 2022',
    operatingCashFlow: 142,
    investingCashFlow: -62,
    financingCashFlow: -58,
    netCashFlow: 22,
    cumulativeOperatingCF: 476,
    cumulativeInvestingCF: -185,
    cumulativeFinancingCF: -168,
    cumulativeNetCF: 123,
    periodEndingCash: 623
  },
  {
    year: 2022,
    quarter: 'Q4 2022',
    operatingCashFlow: 198,
    investingCashFlow: -89,
    financingCashFlow: -72,
    netCashFlow: 37,
    cumulativeOperatingCF: 674,
    cumulativeInvestingCF: -274,
    cumulativeFinancingCF: -240,
    cumulativeNetCF: 160,
    periodEndingCash: 660
  },
  {
    year: 2023,
    quarter: 'Q1 2023',
    operatingCashFlow: 189,
    investingCashFlow: -95,
    financingCashFlow: -68,
    netCashFlow: 26,
    cumulativeOperatingCF: 863,
    cumulativeInvestingCF: -369,
    cumulativeFinancingCF: -308,
    cumulativeNetCF: 186,
    periodEndingCash: 686
  },
  {
    year: 2023,
    quarter: 'Q2 2023',
    operatingCashFlow: 167,
    investingCashFlow: -112,
    financingCashFlow: -42,
    netCashFlow: 13,
    cumulativeOperatingCF: 1030,
    cumulativeInvestingCF: -481,
    cumulativeFinancingCF: -350,
    cumulativeNetCF: 199,
    periodEndingCash: 699
  },
  {
    year: 2023,
    quarter: 'Q3 2023',
    operatingCashFlow: 153,
    investingCashFlow: -98,
    financingCashFlow: -55,
    netCashFlow: 0,
    cumulativeOperatingCF: 1183,
    cumulativeInvestingCF: -579,
    cumulativeFinancingCF: -405,
    cumulativeNetCF: 199,
    periodEndingCash: 699
  },
  {
    year: 2023,
    quarter: 'Q4 2023',
    operatingCashFlow: 223,
    investingCashFlow: -134,
    financingCashFlow: -78,
    netCashFlow: 11,
    cumulativeOperatingCF: 1406,
    cumulativeInvestingCF: -713,
    cumulativeFinancingCF: -483,
    cumulativeNetCF: 210,
    periodEndingCash: 710
  },
  {
    year: 2024,
    quarter: 'Q1 2024',
    operatingCashFlow: 201,
    investingCashFlow: -87,
    financingCashFlow: -85,
    netCashFlow: 29,
    cumulativeOperatingCF: 1607,
    cumulativeInvestingCF: -800,
    cumulativeFinancingCF: -568,
    cumulativeNetCF: 239,
    periodEndingCash: 739
  },
  {
    year: 2024,
    quarter: 'Q2 2024',
    operatingCashFlow: 178,
    investingCashFlow: -76,
    financingCashFlow: -69,
    netCashFlow: 33,
    cumulativeOperatingCF: 1785,
    cumulativeInvestingCF: -876,
    cumulativeFinancingCF: -637,
    cumulativeNetCF: 272,
    periodEndingCash: 772
  }
];

// Mock annual data for Emami Limited (2019-2023)
const annualData = [
  {
    year: 2019,
    operatingCashFlow: 487,
    investingCashFlow: -234,
    financingCashFlow: -178,
    netCashFlow: 75,
    cumulativeOperatingCF: 487,
    cumulativeInvestingCF: -234,
    cumulativeFinancingCF: -178,
    cumulativeNetCF: 75,
    yearEndingCash: 575
  },
  {
    year: 2020,
    operatingCashFlow: 623,
    investingCashFlow: -312,
    financingCashFlow: -205,
    netCashFlow: 106,
    cumulativeOperatingCF: 1110,
    cumulativeInvestingCF: -546,
    cumulativeFinancingCF: -383,
    cumulativeNetCF: 181,
    yearEndingCash: 681
  },
  {
    year: 2021,
    operatingCashFlow: 578,
    investingCashFlow: -289,
    financingCashFlow: -234,
    netCashFlow: 55,
    cumulativeOperatingCF: 1688,
    cumulativeInvestingCF: -835,
    cumulativeFinancingCF: -617,
    cumulativeNetCF: 236,
    yearEndingCash: 736
  },
  {
    year: 2022,
    operatingCashFlow: 674,
    investingCashFlow: -274,
    financingCashFlow: -240,
    netCashFlow: 160,
    cumulativeOperatingCF: 2362,
    cumulativeInvestingCF: -1109,
    cumulativeFinancingCF: -857,
    cumulativeNetCF: 396,
    yearEndingCash: 896
  },
  {
    year: 2023,
    operatingCashFlow: 732,
    investingCashFlow: -439,
    financingCashFlow: -243,
    netCashFlow: 50,
    cumulativeOperatingCF: 3094,
    cumulativeInvestingCF: -1548,
    cumulativeFinancingCF: -1100,
    cumulativeNetCF: 446,
    yearEndingCash: 946
  }
];

export default function CumulativeCashGenerationDemo() {
  const [viewMode, setViewMode] = useState<'quarterly' | 'annual'>('quarterly');
  const [showCumulativeOperating, setShowCumulativeOperating] = useState(true);
  const [showCumulativeInvesting, setShowCumulativeInvesting] = useState(true);
  const [showCumulativeFinancing, setShowCumulativeFinancing] = useState(true);
  const [showCumulativeNetLine, setShowCumulativeNetLine] = useState(true);
  const [showCashPosition, setShowCashPosition] = useState(true);
  const [showZeroLine, setShowZeroLine] = useState(true);
  const [chartHeight, setChartHeight] = useState(400);

  const currentData = viewMode === 'quarterly' ? quarterlyData : annualData;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Cumulative Cash Flow Generation Demo
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Track cumulative cash generation over time with stacked cumulative areas 
            and line overlays showing cash flow accumulation patterns.
          </p>
        </div>

        {/* Company Context */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Emami Limited</h2>
              <p className="text-gray-600">Consumer Goods | BSE: 531162</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Cumulative Cash Generation Analysis</p>
              <p className="text-lg font-medium text-gray-900">
                {viewMode === 'quarterly' 
                  ? 'Q1 2022 - Q2 2024 (10 Quarters)' 
                  : '2019 - 2023 (5 Years)'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chart Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Mode
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('quarterly')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'quarterly'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  Quarterly
                </button>
                <button
                  onClick={() => setViewMode('annual')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'annual'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  Annual
                </button>
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
                onChange={(e) => setChartHeight(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Zero Line */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Lines
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showZeroLine}
                  onChange={(e) => setShowZeroLine(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Zero Line</span>
              </label>
            </div>
          </div>

          {/* Cumulative Areas */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Cumulative Areas</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showCumulativeOperating}
                  onChange={(e) => setShowCumulativeOperating(e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Operating Cash Flow</span>
                <div className="ml-2 w-4 h-4 bg-green-500 rounded-sm opacity-60"></div>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showCumulativeInvesting}
                  onChange={(e) => setShowCumulativeInvesting(e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700">Investing Cash Flow</span>
                <div className="ml-2 w-4 h-4 bg-red-500 rounded-sm opacity-60"></div>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showCumulativeFinancing}
                  onChange={(e) => setShowCumulativeFinancing(e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700">Financing Cash Flow</span>
                <div className="ml-2 w-4 h-4 bg-orange-500 rounded-sm opacity-60"></div>
              </label>
            </div>
          </div>

          {/* Line Overlays */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Line Overlays</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showCumulativeNetLine}
                  onChange={(e) => setShowCumulativeNetLine(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Cumulative Net Cash Flow</span>
                <div className="ml-2 w-4 h-1 bg-blue-500 rounded-sm"></div>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showCashPosition}
                  onChange={(e) => setShowCashPosition(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">Cash Position</span>
                <div className="ml-2 w-4 h-1 bg-purple-500 rounded-sm border-dashed border border-purple-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cumulative Cash Flow Generation
          </h3>
          <CumulativeCashFlow
            data={currentData}
            viewMode={viewMode}
            showCumulativeOperating={showCumulativeOperating}
            showCumulativeInvesting={showCumulativeInvesting}
            showCumulativeFinancing={showCumulativeFinancing}
            showCumulativeNetLine={showCumulativeNetLine}
            showCashPosition={showCashPosition}
            showZeroLine={showZeroLine}
            height={chartHeight}
            className="cumulative-demo-chart"
          />
        </div>

        {/* Insights Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cash Generation Analysis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Key Observations</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Strong operating cash flow generation consistently positive</li>
                <li>• Investing activities show consistent capital deployment</li>
                <li>• Financing activities primarily debt servicing and dividends</li>
                <li>• Net cumulative cash flow trending upward over time</li>
                <li>• Cash position showing steady improvement</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Chart Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Stacked cumulative areas show cash flow accumulation</li>
                <li>• Dual y-axis for areas (left) and lines (right)</li>
                <li>• Color-coded: Green (Operating), Red (Investing), Orange (Financing)</li>
                <li>• Interactive legend and tooltip with Indian currency formatting</li>
                <li>• Support for both quarterly and annual views</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Insight</h4>
            <p className="text-sm text-blue-800">
              The cumulative cash flow chart helps identify long-term cash generation trends 
              and capital allocation patterns. The steady upward trend in cumulative operating 
              cash flow demonstrates Emami's consistent ability to generate cash from core operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 