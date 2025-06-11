'use client';

import React, { useState } from 'react';
import { AbsoluteValuesChart, AbsoluteValuesData } from '@/components/financials/AbsoluteValuesChart';
import { PhaseType } from '@/lib/design-tokens';

// Sample data based on a typical FMCG company like Emami Limited
const emamiAbsoluteData: AbsoluteValuesData[] = [
  {
    period: 'FY19',
    periodIndex: 0,
    revenue: 29420000000, // 2942 Cr
    netProfit: 3920000000, // 392 Cr
    grossProfit: 16750000000, // 1675 Cr
    operatingProfit: 5080000000, // 508 Cr
    ebitda: 5680000000, // 568 Cr
    totalExpenses: 25500000000, // 2550 Cr
    phase: 'stable'
  },
  {
    period: 'FY20',
    periodIndex: 1,
    revenue: 28850000000, // 2885 Cr
    netProfit: 3720000000, // 372 Cr
    grossProfit: 16420000000, // 1642 Cr
    operatingProfit: 4850000000, // 485 Cr
    ebitda: 5450000000, // 545 Cr
    totalExpenses: 25130000000, // 2513 Cr
    phase: 'contraction'
  },
  {
    period: 'FY21',
    periodIndex: 2,
    revenue: 31250000000, // 3125 Cr
    netProfit: 4120000000, // 412 Cr
    grossProfit: 17800000000, // 1780 Cr
    operatingProfit: 5460000000, // 546 Cr
    ebitda: 6060000000, // 606 Cr
    totalExpenses: 27130000000, // 2713 Cr
    phase: 'expansion'
  },
  {
    period: 'FY22',
    periodIndex: 3,
    revenue: 33820000000, // 3382 Cr
    netProfit: 4580000000, // 458 Cr
    grossProfit: 19250000000, // 1925 Cr
    operatingProfit: 6120000000, // 612 Cr
    ebitda: 6720000000, // 672 Cr
    totalExpenses: 29240000000, // 2924 Cr
    phase: 'expansion'
  },
  {
    period: 'FY23',
    periodIndex: 4,
    revenue: 35640000000, // 3564 Cr
    netProfit: 4920000000, // 492 Cr
    grossProfit: 20280000000, // 2028 Cr
    operatingProfit: 6580000000, // 658 Cr
    ebitda: 7180000000, // 718 Cr
    totalExpenses: 30720000000, // 3072 Cr
    phase: 'expansion'
  },
  {
    period: 'FY24',
    periodIndex: 5,
    revenue: 37250000000, // 3725 Cr
    netProfit: 5180000000, // 518 Cr
    grossProfit: 21120000000, // 2112 Cr
    operatingProfit: 6950000000, // 695 Cr
    ebitda: 7550000000, // 755 Cr
    totalExpenses: 32070000000, // 3207 Cr
    phase: 'stable'
  }
];

// Quarterly data sample
const quarterlyAbsoluteData: AbsoluteValuesData[] = [
  {
    period: 'Q1 FY23',
    periodIndex: 0,
    revenue: 8420000000, // 842 Cr
    netProfit: 1150000000, // 115 Cr
    grossProfit: 4780000000, // 478 Cr
    operatingProfit: 1520000000, // 152 Cr
    ebitda: 1720000000, // 172 Cr
    totalExpenses: 7270000000, // 727 Cr
    phase: 'expansion'
  },
  {
    period: 'Q2 FY23',
    periodIndex: 1,
    revenue: 9180000000, // 918 Cr
    netProfit: 1280000000, // 128 Cr
    grossProfit: 5210000000, // 521 Cr
    operatingProfit: 1690000000, // 169 Cr
    ebitda: 1890000000, // 189 Cr
    totalExpenses: 7900000000, // 790 Cr
    phase: 'expansion'
  },
  {
    period: 'Q3 FY23',
    periodIndex: 2,
    revenue: 9650000000, // 965 Cr
    netProfit: 1340000000, // 134 Cr
    grossProfit: 5480000000, // 548 Cr
    operatingProfit: 1780000000, // 178 Cr
    ebitda: 1980000000, // 198 Cr
    totalExpenses: 8310000000, // 831 Cr
    phase: 'stable'
  },
  {
    period: 'Q4 FY23',
    periodIndex: 3,
    revenue: 8390000000, // 839 Cr
    netProfit: 1150000000, // 115 Cr
    grossProfit: 4770000000, // 477 Cr
    operatingProfit: 1520000000, // 152 Cr
    ebitda: 1720000000, // 172 Cr
    totalExpenses: 7240000000, // 724 Cr
    phase: 'stable'
  },
  {
    period: 'Q1 FY24',
    periodIndex: 4,
    revenue: 8950000000, // 895 Cr
    netProfit: 1220000000, // 122 Cr
    grossProfit: 5080000000, // 508 Cr
    operatingProfit: 1620000000, // 162 Cr
    ebitda: 1820000000, // 182 Cr
    totalExpenses: 7730000000, // 773 Cr
    phase: 'expansion'
  },
  {
    period: 'Q2 FY24',
    periodIndex: 5,
    revenue: 9420000000, // 942 Cr
    netProfit: 1310000000, // 131 Cr
    grossProfit: 5340000000, // 534 Cr
    operatingProfit: 1740000000, // 174 Cr
    ebitda: 1940000000, // 194 Cr
    totalExpenses: 8110000000, // 811 Cr
    phase: 'expansion'
  },
  {
    period: 'Q3 FY24',
    periodIndex: 6,
    revenue: 9780000000, // 978 Cr
    netProfit: 1380000000, // 138 Cr
    grossProfit: 5550000000, // 555 Cr
    operatingProfit: 1830000000, // 183 Cr
    ebitda: 2030000000, // 203 Cr
    totalExpenses: 8400000000, // 840 Cr
    phase: 'stable'
  },
  {
    period: 'Q4 FY24',
    periodIndex: 7,
    revenue: 9100000000, // 910 Cr
    netProfit: 1270000000, // 127 Cr
    grossProfit: 5150000000, // 515 Cr
    operatingProfit: 1760000000, // 176 Cr
    ebitda: 1960000000, // 196 Cr
    totalExpenses: 7830000000, // 783 Cr
    phase: 'stable'
  }
];

export default function AbsoluteValuesDemo() {
  const [viewMode, setViewMode] = useState<'annual' | 'quarterly'>('annual');
  const [chartType, setChartType] = useState<'grouped' | 'stacked' | 'waterfall'>('grouped');
  const [showGrossProfit, setShowGrossProfit] = useState(true);
  const [showOperatingProfit, setShowOperatingProfit] = useState(true);
  const [showEbitda, setShowEbitda] = useState(true);
  const [showTotalExpenses, setShowTotalExpenses] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentData = viewMode === 'annual' ? emamiAbsoluteData : quarterlyAbsoluteData;

  const handlePeriodClick = (period: string, data: AbsoluteValuesData) => {
    console.log('Period clicked:', period, data);
  };

  const handlePeriodHover = (period: string | null, data: AbsoluteValuesData | null) => {
    console.log('Period hovered:', period, data);
  };

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const simulateError = () => {
    setError('Failed to load absolute values data. Please try again.');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Absolute Values Chart Demo
          </h1>
          <p className="text-gray-600">
            Task 7.2: Dedicated bar charts for absolute values with grouped, stacked, and waterfall views
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

            {/* Chart Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chart Type
              </label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as 'grouped' | 'stacked' | 'waterfall')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="grouped">Grouped Bars</option>
                <option value="stacked">Stacked Bars</option>
                <option value="waterfall">Waterfall Chart</option>
              </select>
            </div>

            {/* Display Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showGrossProfit}
                    onChange={(e) => setShowGrossProfit(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Gross Profit</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showOperatingProfit}
                    onChange={(e) => setShowOperatingProfit(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Operating Profit</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showEbitda}
                    onChange={(e) => setShowEbitda(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">EBITDA</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showTotalExpenses}
                    onChange={(e) => setShowTotalExpenses(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Total Expenses</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={simulateLoading}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Test Loading
            </button>
            <button
              onClick={simulateError}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Test Error
            </button>
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Clear Error
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="mb-8">
          <AbsoluteValuesChart
            data={currentData}
            height={500}
            viewMode={viewMode}
            chartType={chartType}
            showGrossProfit={showGrossProfit}
            showOperatingProfit={showOperatingProfit}
            showEbitda={showEbitda}
            showTotalExpenses={showTotalExpenses}
            loading={loading}
            error={error}
            onPeriodClick={handlePeriodClick}
            onPeriodHover={handlePeriodHover}
            onRetry={() => setError(null)}
          />
        </div>

        {/* Data Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {viewMode === 'annual' ? 'Annual' : 'Quarterly'} Absolute Values Summary
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
                    EBITDA (₹Cr)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Expenses (₹Cr)
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{item.ebitda ? (item.ebitda / 10000000).toFixed(0) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{item.totalExpenses ? (item.totalExpenses / 10000000).toFixed(0) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.phase === 'expansion' ? 'bg-green-100 text-green-800' :
                        item.phase === 'contraction' ? 'bg-red-100 text-red-800' :
                        item.phase === 'transition' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.phase.charAt(0).toUpperCase() + item.phase.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Features Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Task 7.2 Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">✅ Chart Types</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Grouped: Side-by-side comparison</li>
                <li>• Stacked: Composition view</li>
                <li>• Waterfall: Cumulative progression</li>
                <li>• Dynamic switching between types</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">✅ Absolute Values Display</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Revenue bars (primary metric)</li>
                <li>• Net profit bars</li>
                <li>• Gross profit bars (optional)</li>
                <li>• Operating profit bars (optional)</li>
                <li>• EBITDA bars (optional)</li>
                <li>• Total expenses bars (optional)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">✅ Interactive Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Phase background coloring</li>
                <li>• Rich tooltips with all metrics</li>
                <li>• Click and hover handlers</li>
                <li>• Toggle-able data series</li>
                <li>• Loading and error states</li>
                <li>• Annual/quarterly view modes</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">✅ Visual Design</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Apple-inspired glass morphism</li>
                <li>• Gradient bar fills</li>
                <li>• Rounded corners</li>
                <li>• Subtle shadows and borders</li>
                <li>• Consistent color scheme</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">✅ Responsive Behavior</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mobile-first design</li>
                <li>• Adaptive margins and spacing</li>
                <li>• Rotated labels on small screens</li>
                <li>• Flexible chart container</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">✅ Data Processing</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Automatic crores conversion</li>
                <li>• Phase band calculation</li>
                <li>• Waterfall cumulative values</li>
                <li>• Memoized expensive operations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 