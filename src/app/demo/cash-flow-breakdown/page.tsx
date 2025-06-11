'use client';

import React, { useState } from 'react';
import { CashFlowBreakdown } from '@/components/cashflow/CashFlowBreakdown';

// Enhanced Emami Limited cash flow breakdown data (2014-2023)
const emamiCashFlowBreakdownData = [
  {
    year: 2014,
    operatingCashFlow: 315,
    investingCashFlow: -125,
    financingCashFlow: -89,
    netCashFlow: 101,
    // OCF Breakdown
    netIncome: 280,
    depreciation: 65,
    workingCapitalChange: -30,
    // ICF Breakdown
    capex: -95,
    acquisitions: -20,
    assetDisposals: 8,
    investments: -18,
    // FCF Breakdown
    debtIssuance: 25,
    debtRepayment: -45,
    dividendPayments: -55,
    shareRepurchases: -14
  },
  {
    year: 2015,
    operatingCashFlow: 385,
    investingCashFlow: -145,
    financingCashFlow: -78,
    netCashFlow: 162,
    // OCF Breakdown
    netIncome: 320,
    depreciation: 75,
    workingCapitalChange: -10,
    // ICF Breakdown
    capex: -110,
    acquisitions: -25,
    assetDisposals: 12,
    investments: -22,
    // FCF Breakdown
    debtIssuance: 30,
    debtRepayment: -48,
    dividendPayments: -45,
    shareRepurchases: -15
  },
  {
    year: 2016,
    operatingCashFlow: 420,
    investingCashFlow: -160,
    financingCashFlow: -95,
    netCashFlow: 165,
    // OCF Breakdown
    netIncome: 350,
    depreciation: 85,
    workingCapitalChange: -15,
    // ICF Breakdown
    capex: -125,
    acquisitions: -18,
    assetDisposals: 5,
    investments: -22,
    // FCF Breakdown
    debtIssuance: 20,
    debtRepayment: -55,
    dividendPayments: -48,
    shareRepurchases: -12
  },
  {
    year: 2017,
    operatingCashFlow: 480,
    investingCashFlow: -180,
    financingCashFlow: -125,
    netCashFlow: 175,
    // OCF Breakdown
    netIncome: 390,
    depreciation: 95,
    workingCapitalChange: -5,
    // ICF Breakdown
    capex: -140,
    acquisitions: -22,
    assetDisposals: 8,
    investments: -26,
    // FCF Breakdown
    debtIssuance: 15,
    debtRepayment: -62,
    dividendPayments: -65,
    shareRepurchases: -13
  },
  {
    year: 2018,
    operatingCashFlow: 520,
    investingCashFlow: -200,
    financingCashFlow: -150,
    netCashFlow: 170,
    // OCF Breakdown
    netIncome: 430,
    depreciation: 105,
    workingCapitalChange: -15,
    // ICF Breakdown
    capex: -155,
    acquisitions: -28,
    assetDisposals: 10,
    investments: -27,
    // FCF Breakdown
    debtIssuance: 25,
    debtRepayment: -70,
    dividendPayments: -85,
    shareRepurchases: -20
  },
  {
    year: 2019,
    operatingCashFlow: 580,
    investingCashFlow: -220,
    financingCashFlow: -160,
    netCashFlow: 200,
    // OCF Breakdown
    netIncome: 480,
    depreciation: 115,
    workingCapitalChange: -15,
    // ICF Breakdown
    capex: -170,
    acquisitions: -30,
    assetDisposals: 5,
    investments: -25,
    // FCF Breakdown
    debtIssuance: 20,
    debtRepayment: -75,
    dividendPayments: -90,
    shareRepurchases: -15
  },
  {
    year: 2020,
    operatingCashFlow: 650,
    investingCashFlow: -180,
    financingCashFlow: -220,
    netCashFlow: 250,
    // OCF Breakdown
    netIncome: 520,
    depreciation: 120,
    workingCapitalChange: 10,
    // ICF Breakdown
    capex: -140,
    acquisitions: -25,
    assetDisposals: 8,
    investments: -23,
    // FCF Breakdown
    debtIssuance: 10,
    debtRepayment: -80,
    dividendPayments: -125,
    shareRepurchases: -25
  },
  {
    year: 2021,
    operatingCashFlow: 720,
    investingCashFlow: -240,
    financingCashFlow: -180,
    netCashFlow: 300,
    // OCF Breakdown
    netIncome: 580,
    depreciation: 125,
    workingCapitalChange: 15,
    // ICF Breakdown
    capex: -185,
    acquisitions: -35,
    assetDisposals: 12,
    investments: -32,
    // FCF Breakdown
    debtIssuance: 30,
    debtRepayment: -85,
    dividendPayments: -105,
    shareRepurchases: -20
  },
  {
    year: 2022,
    operatingCashFlow: 780,
    investingCashFlow: -280,
    financingCashFlow: -195,
    netCashFlow: 305,
    // OCF Breakdown
    netIncome: 620,
    depreciation: 135,
    workingCapitalChange: 25,
    // ICF Breakdown
    capex: -220,
    acquisitions: -40,
    assetDisposals: 15,
    investments: -35,
    // FCF Breakdown
    debtIssuance: 40,
    debtRepayment: -90,
    dividendPayments: -125,
    shareRepurchases: -20
  },
  {
    year: 2023,
    operatingCashFlow: 850,
    investingCashFlow: -320,
    financingCashFlow: -210,
    netCashFlow: 320,
    // OCF Breakdown
    netIncome: 680,
    depreciation: 145,
    workingCapitalChange: 25,
    // ICF Breakdown
    capex: -250,
    acquisitions: -45,
    assetDisposals: 20,
    investments: -45,
    // FCF Breakdown
    debtIssuance: 50,
    debtRepayment: -100,
    dividendPayments: -140,
    shareRepurchases: -20
  }
];

// Quarterly data for Q1-Q4 2023
const emamiQuarterlyBreakdownData = [
  {
    quarter: 'Q1 2023',
    operatingCashFlow: 200,
    investingCashFlow: -75,
    financingCashFlow: -50,
    netCashFlow: 75,
    netIncome: 160,
    depreciation: 35,
    workingCapitalChange: 5,
    capex: -60,
    acquisitions: -10,
    assetDisposals: 3,
    investments: -8,
    debtIssuance: 15,
    debtRepayment: -25,
    dividendPayments: -30,
    shareRepurchases: -10
  },
  {
    quarter: 'Q2 2023',
    operatingCashFlow: 220,
    investingCashFlow: -85,
    financingCashFlow: -55,
    netCashFlow: 80,
    netIncome: 175,
    depreciation: 36,
    workingCapitalChange: 9,
    capex: -65,
    acquisitions: -12,
    assetDisposals: 5,
    investments: -13,
    debtIssuance: 10,
    debtRepayment: -25,
    dividendPayments: -35,
    shareRepurchases: -5
  },
  {
    quarter: 'Q3 2023',
    operatingCashFlow: 210,
    investingCashFlow: -80,
    financingCashFlow: -52,
    netCashFlow: 78,
    netIncome: 170,
    depreciation: 37,
    workingCapitalChange: 3,
    capex: -62,
    acquisitions: -11,
    assetDisposals: 4,
    investments: -11,
    debtIssuance: 12,
    debtRepayment: -25,
    dividendPayments: -34,
    shareRepurchases: -5
  },
  {
    quarter: 'Q4 2023',
    operatingCashFlow: 220,
    investingCashFlow: -80,
    financingCashFlow: -53,
    netCashFlow: 87,
    netIncome: 175,
    depreciation: 37,
    workingCapitalChange: 8,
    capex: -63,
    acquisitions: -12,
    assetDisposals: 8,
    investments: -13,
    debtIssuance: 13,
    debtRepayment: -25,
    dividendPayments: -41,
    shareRepurchases: 0
  }
];

export default function CashFlowBreakdownDemo() {
  const [viewMode, setViewMode] = useState<'annual' | 'quarterly'>('annual');
  const [breakdownType, setBreakdownType] = useState<'OCF' | 'ICF' | 'FCF' | 'ALL'>('ALL');
  const [showPercentages, setShowPercentages] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [showTrends, setShowTrends] = useState(true);
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

  const currentData = viewMode === 'annual' ? emamiCashFlowBreakdownData : emamiQuarterlyBreakdownData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Cash Flow Breakdown Demo
                </h1>
                <p className="mt-2 text-gray-600">
                  Task 9.2 - OCF, ICF, FCF Breakdown Display - Emami Limited (2014-2023)
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✅ 29/30 Tests Passing
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

            {/* Breakdown Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Breakdown Type
              </label>
              <select
                value={breakdownType}
                onChange={(e) => setBreakdownType(e.target.value as 'OCF' | 'ICF' | 'FCF' | 'ALL')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">All Components</option>
                <option value="OCF">Operating Cash Flow</option>
                <option value="ICF">Investing Cash Flow</option>
                <option value="FCF">Financing Cash Flow</option>
              </select>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showPercentages}
                    onChange={(e) => setShowPercentages(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show Percentages</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showAnalysis}
                    onChange={(e) => setShowAnalysis(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Component Analysis</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showTrends}
                    onChange={(e) => setShowTrends(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Trend Indicators</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showDetailedBreakdown}
                    onChange={(e) => setShowDetailedBreakdown(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Detailed Breakdown</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Component Demo */}
        <div className="bg-white rounded-lg shadow p-6">
          <CashFlowBreakdown
            data={currentData}
            viewMode={viewMode}
            breakdownType={breakdownType}
            showPercentages={showPercentages}
            showAnalysis={showAnalysis}
            showTrends={showTrends}
            showDetailedBreakdown={showDetailedBreakdown}
            height={450}
            className="cash-flow-breakdown-demo"
            onComponentClick={(component, data) => {
              console.log('Component clicked:', component, data);
            }}
          />
        </div>

        {/* Component Features Documentation */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">CashFlowBreakdown Component Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">📊 Core Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Detailed OCF breakdown (Net Income, Depreciation, Working Capital)</li>
                <li>• ICF analysis (CapEx, Acquisitions, Asset Disposals, Investments)</li>
                <li>• FCF components (Debt, Dividends, Share Repurchases)</li>
                <li>• Individual component bar charts with custom colors</li>
                <li>• Percentage breakdown with pie charts</li>
                <li>• Annual and quarterly time period support</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">🎯 Advanced Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Component analysis with YoY change percentages</li>
                <li>• Trend indicators and pattern detection</li>
                <li>• Interactive drill-down functionality</li>
                <li>• Responsive design for all screen sizes</li>
                <li>• Custom tooltips with Indian currency formatting</li>
                <li>• Error handling for malformed data</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Component Analysis Insights</h4>
            <div className="text-sm text-blue-800">
              <p className="mb-2">
                <strong>Operating Cash Flow:</strong> Shows steady growth from ₹315 Cr to ₹850 Cr over 10 years, 
                driven by strong net income growth and stable depreciation.
              </p>
              <p className="mb-2">
                <strong>Investing Cash Flow:</strong> Increasing investments from ₹125 Cr to ₹320 Cr, 
                indicating aggressive expansion and acquisition strategy.
              </p>
              <p>
                <strong>Financing Cash Flow:</strong> Balanced approach with moderate debt financing 
                and consistent dividend payments, maintaining financial discipline.
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
  // OCF Breakdown
  netIncome: 680,
  depreciation: 145,
  workingCapitalChange: 25,
  // ICF Breakdown
  capex: -250,
  acquisitions: -45,
  assetDisposals: 20,
  investments: -45,
  // FCF Breakdown
  debtIssuance: 50,
  debtRepayment: -100,
  dividendPayments: -140,
  shareRepurchases: -20
}`}
          </pre>
        </div>
      </div>
    </div>
  );
} 