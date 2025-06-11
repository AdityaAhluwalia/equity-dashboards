'use client';

import React, { useState } from 'react';
import { RevenueProfitChart, RevenueProfitData } from '@/components/financials/RevenueProfitChart';
import { PhaseType } from '@/lib/design-tokens';

// Sample data based on Emami Limited
const emamiData: RevenueProfitData[] = [
  {
    period: 'FY16',
    periodIndex: 0,
    revenue: 25450000000, // 2545 Cr
    netProfit: 3420000000, // 342 Cr  
    grossProfit: 14270000000, // 1427 Cr
    operatingProfit: 4260000000, // 426 Cr
    phase: 'stable',
    revenueGrowth: 8.2,
    profitGrowth: 12.5,
    profitMargin: 13.4
  },
  {
    period: 'FY17',
    periodIndex: 1,
    revenue: 27180000000, // 2718 Cr
    netProfit: 3650000000, // 365 Cr
    grossProfit: 15320000000, // 1532 Cr
    operatingProfit: 4580000000, // 458 Cr
    phase: 'expansion',
    revenueGrowth: 6.8,
    profitGrowth: 6.7,
    profitMargin: 13.4
  },
  {
    period: 'FY18',
    periodIndex: 2,
    revenue: 28950000000, // 2895 Cr
    netProfit: 3820000000, // 382 Cr
    grossProfit: 16480000000, // 1648 Cr
    operatingProfit: 4920000000, // 492 Cr
    phase: 'expansion',
    revenueGrowth: 6.5,
    profitGrowth: 4.7,
    profitMargin: 13.2
  },
  {
    period: 'FY19',
    periodIndex: 3,
    revenue: 29420000000, // 2942 Cr
    netProfit: 3920000000, // 392 Cr
    grossProfit: 16750000000, // 1675 Cr
    operatingProfit: 5080000000, // 508 Cr
    phase: 'stable',
    revenueGrowth: 1.6,
    profitGrowth: 2.6,
    profitMargin: 13.3
  },
  {
    period: 'FY20',
    periodIndex: 4,
    revenue: 28850000000, // 2885 Cr
    netProfit: 3720000000, // 372 Cr
    grossProfit: 16420000000, // 1642 Cr
    operatingProfit: 4850000000, // 485 Cr
    phase: 'contraction',
    revenueGrowth: -1.9,
    profitGrowth: -5.1,
    profitMargin: 12.9
  },
  {
    period: 'FY21',
    periodIndex: 5,
    revenue: 31250000000, // 3125 Cr
    netProfit: 4120000000, // 412 Cr
    grossProfit: 17800000000, // 1780 Cr
    operatingProfit: 5460000000, // 546 Cr
    phase: 'expansion',
    revenueGrowth: 8.3,
    profitGrowth: 10.8,
    profitMargin: 13.2
  },
  {
    period: 'FY22',
    periodIndex: 6,
    revenue: 33820000000, // 3382 Cr
    netProfit: 4580000000, // 458 Cr
    grossProfit: 19250000000, // 1925 Cr
    operatingProfit: 6120000000, // 612 Cr
    phase: 'expansion',
    revenueGrowth: 8.2,
    profitGrowth: 11.2,
    profitMargin: 13.5
  },
  {
    period: 'FY23',
    periodIndex: 7,
    revenue: 35640000000, // 3564 Cr
    netProfit: 4920000000, // 492 Cr
    grossProfit: 20280000000, // 2028 Cr
    operatingProfit: 6580000000, // 658 Cr
    phase: 'expansion',
    revenueGrowth: 5.4,
    profitGrowth: 7.4,
    profitMargin: 13.8
  },
  {
    period: 'FY24',
    periodIndex: 8,
    revenue: 37250000000, // 3725 Cr
    netProfit: 5180000000, // 518 Cr
    grossProfit: 21120000000, // 2112 Cr
    operatingProfit: 6950000000, // 695 Cr
    phase: 'stable',
    revenueGrowth: 4.5,
    profitGrowth: 5.3,
    profitMargin: 13.9
  }
];

// Sample quarterly data
const quarterlyData: RevenueProfitData[] = [
  {
    period: 'Q1 FY23',
    periodIndex: 0,
    revenue: 8420000000,
    netProfit: 1150000000,
    grossProfit: 4780000000,
    operatingProfit: 1520000000,
    phase: 'expansion',
    revenueGrowth: 12.5,
    profitGrowth: 15.2,
    profitMargin: 13.7
  },
  {
    period: 'Q2 FY23',
    periodIndex: 1,
    revenue: 9180000000,
    netProfit: 1280000000,
    grossProfit: 5210000000,
    operatingProfit: 1690000000,
    phase: 'expansion',
    revenueGrowth: 9.0,
    profitGrowth: 11.3,
    profitMargin: 13.9
  },
  {
    period: 'Q3 FY23',
    periodIndex: 2,
    revenue: 9650000000,
    netProfit: 1340000000,
    grossProfit: 5480000000,
    operatingProfit: 1780000000,
    phase: 'stable',
    revenueGrowth: 5.1,
    profitGrowth: 4.7,
    profitMargin: 13.9
  },
  {
    period: 'Q4 FY23',
    periodIndex: 3,
    revenue: 8390000000,
    netProfit: 1150000000,
    grossProfit: 4770000000,
    operatingProfit: 1520000000,
    phase: 'stable',
    revenueGrowth: -13.1,
    profitGrowth: -14.2,
    profitMargin: 13.7
  },
  {
    period: 'Q1 FY24',
    periodIndex: 4,
    revenue: 8950000000,
    netProfit: 1220000000,
    grossProfit: 5080000000,
    operatingProfit: 1620000000,
    phase: 'expansion',
    revenueGrowth: 6.3,
    profitGrowth: 6.1,
    profitMargin: 13.6
  },
  {
    period: 'Q2 FY24',
    periodIndex: 5,
    revenue: 9420000000,
    netProfit: 1310000000,
    grossProfit: 5340000000,
    operatingProfit: 1740000000,
    phase: 'expansion',
    revenueGrowth: 2.6,
    profitGrowth: 2.3,
    profitMargin: 13.9
  },
  {
    period: 'Q3 FY24',
    periodIndex: 6,
    revenue: 9780000000,
    netProfit: 1380000000,
    grossProfit: 5550000000,
    operatingProfit: 1830000000,
    phase: 'stable',
    revenueGrowth: 1.3,
    profitGrowth: 3.0,
    profitMargin: 14.1
  },
  {
    period: 'Q4 FY24',
    periodIndex: 7,
    revenue: 9100000000,
    netProfit: 1270000000,
    grossProfit: 5150000000,
    operatingProfit: 1680000000,
    phase: 'stable',
    revenueGrowth: 8.5,
    profitGrowth: 10.4,
    profitMargin: 14.0
  }
];

export default function RevenueProfitDemo() {
  const [viewMode, setViewMode] = useState<'annual' | 'quarterly'>('annual');
  const [showGrossProfit, setShowGrossProfit] = useState(true);
  const [showOperatingProfit, setShowOperatingProfit] = useState(true);
  const [showGrowthRates, setShowGrowthRates] = useState(true);
  const [showProfitMargin, setShowProfitMargin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentData = viewMode === 'annual' ? emamiData : quarterlyData;

  const handlePeriodClick = (period: string, data: RevenueProfitData) => {
    console.log('Clicked period:', period, data);
  };

  const handlePeriodHover = (period: string | null, data: RevenueProfitData | null) => {
    console.log('Hovered period:', period, data);
  };

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const simulateError = () => {
    setError('Failed to load revenue and profit data');
    setTimeout(() => setError(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Revenue & Profit Trends Demo
          </h1>
          <p className="text-gray-600">
            Task 7.1: Dual-axis chart showing revenue bars, profit bars, and growth rate overlays
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Chart Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Display Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profit Types
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showGrossProfit}
                    onChange={(e) => setShowGrossProfit(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-600">Gross Profit</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showOperatingProfit}
                    onChange={(e) => setShowOperatingProfit(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-600">Operating Profit</span>
                </label>
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
                    checked={showGrowthRates}
                    onChange={(e) => setShowGrowthRates(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-600">Growth Rates</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showProfitMargin}
                    onChange={(e) => setShowProfitMargin(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-600">Profit Margin</span>
                </label>
              </div>
            </div>

            {/* Test States */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test States
              </label>
              <div className="space-y-2">
                <button
                  onClick={simulateLoading}
                  className="w-full px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium hover:bg-yellow-200 transition-colors"
                >
                  Test Loading
                </button>
                <button
                  onClick={simulateError}
                  className="w-full px-3 py-2 bg-red-100 text-red-800 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  Test Error
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mb-8">
          <RevenueProfitChart
            data={currentData}
            height={500}
            viewMode={viewMode}
            showGrossProfit={showGrossProfit}
            showOperatingProfit={showOperatingProfit}
            showGrowthRates={showGrowthRates}
            showProfitMargin={showProfitMargin}
            loading={loading}
            error={error}
            onPeriodClick={handlePeriodClick}
            onPeriodHover={handlePeriodHover}
            onRetry={() => setError(null)}
          />
        </div>

        {/* Data Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {viewMode === 'annual' ? 'Annual' : 'Quarterly'} Data Summary
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue (₹Cr)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Profit (₹Cr)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gross Profit (₹Cr)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operating Profit (₹Cr)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue Growth (%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit Growth (%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit Margin (%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phase
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{(item.revenue / 10000000).toFixed(0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{(item.netProfit / 10000000).toFixed(0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{item.grossProfit ? (item.grossProfit / 10000000).toFixed(0) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{item.operatingProfit ? (item.operatingProfit / 10000000).toFixed(0) : 'N/A'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      item.revenueGrowth !== undefined && item.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.revenueGrowth !== undefined ? 
                        `${item.revenueGrowth >= 0 ? '+' : ''}${item.revenueGrowth.toFixed(1)}%` : 'N/A'
                      }
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      item.profitGrowth !== undefined && item.profitGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.profitGrowth !== undefined ? 
                        `${item.profitGrowth >= 0 ? '+' : ''}${item.profitGrowth.toFixed(1)}%` : 'N/A'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.profitMargin !== undefined ? `${item.profitMargin.toFixed(1)}%` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.phase === 'expansion' ? 'bg-green-100 text-green-800' :
                        item.phase === 'contraction' ? 'bg-red-100 text-red-800' :
                        item.phase === 'stable' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.phase}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Task 7.1 Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">✅ Dual-Axis Display</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Left axis: Revenue and profit amounts (₹Cr)</li>
                <li>• Right axis: Growth rates and margins (%)</li>
                <li>• Proper scaling and formatting for each axis</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">✅ Bar Charts</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Revenue bars (blue gradient)</li>
                <li>• Net profit bars (green gradient)</li>
                <li>• Optional gross profit bars (emerald)</li>
                <li>• Optional operating profit bars (teal)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">✅ Growth Rate Overlays</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Revenue growth line (orange)</li>
                <li>• Profit growth line (red)</li>
                <li>• Profit margin line (purple, dashed)</li>
                <li>• Toggle-able visibility</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">✅ Phase Background</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Expansion phases (green background)</li>
                <li>• Contraction phases (red background)</li>
                <li>• Stable phases (gray background)</li>
                <li>• Transition phases (yellow background)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">✅ Interactive Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Custom tooltip with detailed metrics</li>
                <li>• Click handlers for period selection</li>
                <li>• Hover states and animations</li>
                <li>• Responsive design (mobile-first)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">✅ View Modes</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Annual view (9 years of Emami data)</li>
                <li>• Quarterly view (8 quarters)</li>
                <li>• Loading and error states</li>
                <li>• Empty data handling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 