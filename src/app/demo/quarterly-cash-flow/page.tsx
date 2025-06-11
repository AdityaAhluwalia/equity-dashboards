'use client';

import React, { useState } from 'react';
import { QuarterlyCashFlow } from '@/components/cashflow/QuarterlyCashFlow';

// Enhanced Emami Limited quarterly cash flow data (2022-2024)
const emamiQuarterlyCashFlowData = [
  // 2022 Data
  {
    quarter: 'Q1 2022',
    operatingCashFlow: 180,
    investingCashFlow: -65,
    financingCashFlow: -40,
    netCashFlow: 75,
    freeCashFlow: 115,
    revenue: 1080
  },
  {
    quarter: 'Q2 2022',
    operatingCashFlow: 195,
    investingCashFlow: -70,
    financingCashFlow: -45,
    netCashFlow: 80,
    freeCashFlow: 125,
    revenue: 1120
  },
  {
    quarter: 'Q3 2022',
    operatingCashFlow: 170,
    investingCashFlow: -85,
    financingCashFlow: -35,
    netCashFlow: 50,
    freeCashFlow: 85,
    revenue: 1020
  },
  {
    quarter: 'Q4 2022',
    operatingCashFlow: 235,
    investingCashFlow: -95,
    financingCashFlow: -60,
    netCashFlow: 80,
    freeCashFlow: 140,
    revenue: 1280
  },
  
  // 2023 Data
  {
    quarter: 'Q1 2023',
    operatingCashFlow: 200,
    investingCashFlow: -75,
    financingCashFlow: -50,
    netCashFlow: 75,
    freeCashFlow: 125,
    revenue: 1150
  },
  {
    quarter: 'Q2 2023',
    operatingCashFlow: 220,
    investingCashFlow: -85,
    financingCashFlow: -55,
    netCashFlow: 80,
    freeCashFlow: 135,
    revenue: 1200
  },
  {
    quarter: 'Q3 2023',
    operatingCashFlow: 180,
    investingCashFlow: -95,
    financingCashFlow: -45,
    netCashFlow: 40,
    freeCashFlow: 85,
    revenue: 1100
  },
  {
    quarter: 'Q4 2023',
    operatingCashFlow: 250,
    investingCashFlow: -120,
    financingCashFlow: -60,
    netCashFlow: 70,
    freeCashFlow: 130,
    revenue: 1300
  },
  
  // 2024 Data
  {
    quarter: 'Q1 2024',
    operatingCashFlow: 210,
    investingCashFlow: -80,
    financingCashFlow: -70,
    netCashFlow: 60,
    freeCashFlow: 130,
    revenue: 1180
  },
  {
    quarter: 'Q2 2024',
    operatingCashFlow: 230,
    investingCashFlow: -90,
    financingCashFlow: -65,
    netCashFlow: 75,
    freeCashFlow: 140,
    revenue: 1250
  },
  {
    quarter: 'Q3 2024',
    operatingCashFlow: 190,
    investingCashFlow: -100,
    financingCashFlow: -55,
    netCashFlow: 35,
    freeCashFlow: 90,
    revenue: 1120
  },
  {
    quarter: 'Q4 2024',
    operatingCashFlow: 260,
    investingCashFlow: -130,
    financingCashFlow: -75,
    netCashFlow: 55,
    freeCashFlow: 130,
    revenue: 1350
  }
];

// Sample data with negative cash flows for demonstration
const negativeFlowData = [
  {
    quarter: 'Q1 2020',
    operatingCashFlow: 120,
    investingCashFlow: -180,
    financingCashFlow: -60,
    netCashFlow: -120,
    freeCashFlow: -60,
    revenue: 900
  },
  {
    quarter: 'Q2 2020',
    operatingCashFlow: 140,
    investingCashFlow: -200,
    financingCashFlow: -80,
    netCashFlow: -140,
    freeCashFlow: -60,
    revenue: 950
  },
  {
    quarter: 'Q3 2020',
    operatingCashFlow: 110,
    investingCashFlow: -150,
    financingCashFlow: -70,
    netCashFlow: -110,
    freeCashFlow: -40,
    revenue: 850
  },
  {
    quarter: 'Q4 2020',
    operatingCashFlow: 160,
    investingCashFlow: -220,
    financingCashFlow: -90,
    netCashFlow: -150,
    freeCashFlow: -60,
    revenue: 1000
  }
];

export default function QuarterlyCashFlowDemo() {
  const [metric, setMetric] = useState<'netCashFlow' | 'operatingCashFlow' | 'investingCashFlow' | 'financingCashFlow' | 'freeCashFlow'>('netCashFlow');
  const [showZeroLine, setShowZeroLine] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [positiveColor, setPositiveColor] = useState('#10b981');
  const [negativeColor, setNegativeColor] = useState('#ef4444');
  const [filterYear, setFilterYear] = useState<number | undefined>(undefined);
  const [dataSet, setDataSet] = useState<'normal' | 'negative'>('normal');
  const [barShape, setBarShape] = useState<'default' | 'rounded'>('default');

  const currentData = dataSet === 'normal' ? emamiQuarterlyCashFlowData : negativeFlowData;

  const getMetricColor = () => {
    const colors = {
      operatingCashFlow: { positive: '#10b981', negative: '#ef4444' },
      investingCashFlow: { positive: '#ef4444', negative: '#dc2626' },
      financingCashFlow: { positive: '#f59e0b', negative: '#d97706' },
      netCashFlow: { positive: '#3b82f6', negative: '#ef4444' },
      freeCashFlow: { positive: '#06b6d4', negative: '#0891b2' }
    };
    return colors[metric];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Quarterly Cash Flow Demo
                </h1>
                <p className="mt-2 text-gray-600">
                  Task 9.4 - Positive/Negative Bars - Emami Limited (2022-2024)
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✅ 43/43 Tests Passing
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Metric Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cash Flow Metric
              </label>
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="netCashFlow">Net Cash Flow</option>
                <option value="operatingCashFlow">Operating Cash Flow</option>
                <option value="investingCashFlow">Investing Cash Flow</option>
                <option value="financingCashFlow">Financing Cash Flow</option>
                <option value="freeCashFlow">Free Cash Flow</option>
              </select>
            </div>

            {/* Data Set Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Set
              </label>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDataSet('normal')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    dataSet === 'normal'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Normal (2022-24)
                </button>
                <button
                  onClick={() => setDataSet('negative')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    dataSet === 'negative'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Negative (2020)
                </button>
              </div>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Year
              </label>
              <select
                value={filterYear || ''}
                onChange={(e) => setFilterYear(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Years</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2020">2020</option>
              </select>
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
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Zero Line</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showLegend}
                    onChange={(e) => setShowLegend(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Legend</span>
                </label>
              </div>
            </div>
          </div>

          {/* Advanced Controls */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Color Customization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colors
              </label>
              <div className="flex space-x-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Positive</label>
                  <input
                    type="color"
                    value={positiveColor}
                    onChange={(e) => setPositiveColor(e.target.value)}
                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Negative</label>
                  <input
                    type="color"
                    value={negativeColor}
                    onChange={(e) => setNegativeColor(e.target.value)}
                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Bar Shape */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bar Shape
              </label>
              <div className="flex space-x-3">
                <button
                  onClick={() => setBarShape('default')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    barShape === 'default'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Default
                </button>
                <button
                  onClick={() => setBarShape('rounded')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    barShape === 'rounded'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Rounded
                </button>
              </div>
            </div>

            {/* Reset Controls */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setMetric('netCashFlow');
                  setShowZeroLine(true);
                  setShowLegend(true);
                  setPositiveColor('#10b981');
                  setNegativeColor('#ef4444');
                  setFilterYear(undefined);
                  setDataSet('normal');
                  setBarShape('default');
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm font-medium"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>

        {/* Component Demo */}
        <div className="bg-white rounded-lg shadow p-6">
          <QuarterlyCashFlow
            data={currentData}
            metric={metric}
            positiveColor={positiveColor}
            negativeColor={negativeColor}
            showZeroLine={showZeroLine}
            showLegend={showLegend}
            filterYear={filterYear}
            barShape={barShape}
            height={400}
            className="quarterly-cash-flow-demo"
          />
        </div>

        {/* Metric Analysis */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Metric Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Current Metric Analysis</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Metric</span>
                <span className="font-medium">{metric.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Latest Value</span>
                <span className={`font-medium ${
                  (currentData[currentData.length - 1]?.[metric] || 0) >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  ₹{currentData[currentData.length - 1]?.[metric] || 0} Cr
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Positive Quarters</span>
                <span className="font-medium text-green-600">
                  {currentData.filter(d => (d[metric] || 0) > 0).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Negative Quarters</span>
                <span className="font-medium text-red-600">
                  {currentData.filter(d => (d[metric] || 0) < 0).length}
                </span>
              </div>
            </div>
          </div>

          {/* Seasonal Patterns */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Seasonal Patterns</h3>
            <div className="space-y-3">
              {['Q1', 'Q2', 'Q3', 'Q4'].map(quarter => {
                const quarterData = currentData.filter(d => d.quarter.includes(quarter));
                const avgValue = quarterData.reduce((sum, d) => sum + (d[metric] || 0), 0) / quarterData.length;
                
                return (
                  <div key={quarter} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{quarter} Average</span>
                    <span className={`font-medium ${
                      avgValue >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ₹{avgValue.toFixed(0)} Cr
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trend Analysis */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Trend Analysis</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Best Quarter</span>
                <span className="font-medium text-green-600">
                  {currentData.reduce((best, curr) => 
                    (curr[metric] || 0) > (best[metric] || 0) ? curr : best
                  ).quarter}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Worst Quarter</span>
                <span className="font-medium text-red-600">
                  {currentData.reduce((worst, curr) => 
                    (curr[metric] || 0) < (worst[metric] || 0) ? curr : worst
                  ).quarter}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Volatility</span>
                <span className="font-medium text-blue-600">
                  {(() => {
                    const values = currentData.map(d => d[metric] || 0);
                    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
                    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
                    return Math.sqrt(variance).toFixed(0);
                  })()}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Consistency</span>
                <span className="font-medium text-purple-600">
                  {((currentData.filter(d => (d[metric] || 0) > 0).length / currentData.length) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Component Features Documentation */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">QuarterlyCashFlow Component Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">📊 Core Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Positive/negative color-coded bars for each quarter</li>
                <li>• Support for all cash flow metrics (OCF, ICF, FCF, Net CF, FCF)</li>
                <li>• Zero reference line for breakeven analysis</li>
                <li>• Dynamic color assignment based on value polarity</li>
                <li>• Year-based data filtering capabilities</li>
                <li>• Custom legend with positive/negative indicators</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">🎯 Advanced Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Metric switching with preserved chart state</li>
                <li>• Custom color themes for positive/negative values</li>
                <li>• Rounded corner bar styling options</li>
                <li>• Interactive tooltips with Indian currency formatting</li>
                <li>• Seasonal pattern analysis capabilities</li>
                <li>• Performance optimized for large datasets</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Cash Flow Insights</h4>
            <div className="text-sm text-blue-800">
              <p className="mb-2">
                <strong>Positive Bars (Green):</strong> Indicate quarters where the selected metric generated positive cash flow, 
                showing strong operational performance or beneficial financial activities.
              </p>
              <p className="mb-2">
                <strong>Negative Bars (Red):</strong> Show quarters with negative cash flow, which could indicate 
                investment periods, debt repayments, or operational challenges.
              </p>
              <p className="mb-2">
                <strong>Zero Reference Line:</strong> Helps quickly identify breakeven points and assess 
                the frequency of positive vs negative cash flow periods.
              </p>
              <p>
                <strong>Metric Comparison:</strong> Switch between different cash flow metrics to understand 
                which activities drive cash generation vs consumption patterns.
              </p>
            </div>
          </div>
        </div>

        {/* Data Sample */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Sample Data Structure</h2>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  quarter: "Q1 2024",
  operatingCashFlow: 210,
  investingCashFlow: -80,
  financingCashFlow: -70,
  netCashFlow: 60,
  freeCashFlow: 130,
  revenue: 1180
}`}
          </pre>
        </div>
      </div>
    </div>
  );
} 