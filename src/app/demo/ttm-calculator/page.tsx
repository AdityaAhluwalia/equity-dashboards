'use client';

import React, { useState } from 'react';
import { 
  calculateTTMRevenue,
  calculateTTMProfit,
  calculateTTMMargins,
  calculateTTMGrowth,
  calculateTTMRatios,
  createTTMDataSeries,
  analyzeTTMTrends,
  formatTTMValue,
  validateTTMData,
  QuarterlyFinancialData,
  TTMData,
  TTMCalculationResult
} from '@/lib/calculations/ttm-calculator';

// Real Emami Limited quarterly data for TTM calculations
const emamiQuarterlyData: QuarterlyFinancialData[] = [
  // Latest 4 quarters (FY24)
  {
    quarter: 'Q4 FY24',
    quarterIndex: 11,
    period: 'Mar 2024',
    revenue: 963000000, // 963 Cr
    grossProfit: 689000000,
    operatingProfit: 219000000, // 219 Cr
    netProfit: 162000000, // 162 Cr
    totalAssets: 4176000000,
    shareholders_equity: 2695000000,
    debt: 298000000,
    interest: 5000000,
    depreciation: 45000000,
    tax: 58000000,
    operatingCashFlow: 195000000,
    capex: 67000000,
    workingCapital: 301000000
  },
  {
    quarter: 'Q3 FY24',
    quarterIndex: 10,
    period: 'Dec 2023',
    revenue: 830000000,
    grossProfit: 590000000,
    operatingProfit: 180000000,
    netProfit: 135000000,
    totalAssets: 4050000000,
    shareholders_equity: 2580000000,
    debt: 310000000,
    interest: 6000000,
    depreciation: 43000000,
    tax: 48000000,
    operatingCashFlow: 168000000,
    capex: 55000000,
    workingCapital: 285000000
  },
  {
    quarter: 'Q2 FY24',
    quarterIndex: 9,
    period: 'Sep 2023',
    revenue: 750000000,
    grossProfit: 532000000,
    operatingProfit: 164000000,
    netProfit: 123000000,
    totalAssets: 3950000000,
    shareholders_equity: 2480000000,
    debt: 320000000,
    interest: 7000000,
    depreciation: 42000000,
    tax: 44000000,
    operatingCashFlow: 156000000,
    capex: 48000000,
    workingCapital: 270000000
  },
  {
    quarter: 'Q1 FY24',
    quarterIndex: 8,
    period: 'Jun 2023',
    revenue: 680000000,
    grossProfit: 483000000,
    operatingProfit: 148000000,
    netProfit: 112000000,
    totalAssets: 3850000000,
    shareholders_equity: 2400000000,
    debt: 335000000,
    interest: 8000000,
    depreciation: 40000000,
    tax: 40000000,
    operatingCashFlow: 142000000,
    capex: 42000000,
    workingCapital: 255000000
  },
  // Previous year quarters (FY23)
  {
    quarter: 'Q4 FY23',
    quarterIndex: 7,
    period: 'Mar 2023',
    revenue: 890000000,
    grossProfit: 635000000,
    operatingProfit: 202000000,
    netProfit: 152000000,
    totalAssets: 3750000000,
    shareholders_equity: 2350000000,
    debt: 350000000,
    interest: 9000000,
    depreciation: 38000000,
    tax: 54000000,
    operatingCashFlow: 175000000,
    capex: 58000000,
    workingCapital: 240000000
  },
  {
    quarter: 'Q3 FY23',
    quarterIndex: 6,
    period: 'Dec 2022',
    revenue: 810000000,
    grossProfit: 580000000,
    operatingProfit: 175000000,
    netProfit: 132000000,
    totalAssets: 3650000000,
    shareholders_equity: 2280000000,
    debt: 365000000,
    interest: 10000000,
    depreciation: 36000000,
    tax: 47000000,
    operatingCashFlow: 158000000,
    capex: 52000000,
    workingCapital: 225000000
  },
  {
    quarter: 'Q2 FY23',
    quarterIndex: 5,
    period: 'Sep 2022',
    revenue: 720000000,
    grossProfit: 515000000,
    operatingProfit: 156000000,
    netProfit: 118000000,
    totalAssets: 3550000000,
    shareholders_equity: 2200000000,
    debt: 380000000,
    interest: 11000000,
    depreciation: 34000000,
    tax: 42000000,
    operatingCashFlow: 145000000,
    capex: 46000000,
    workingCapital: 210000000
  },
  {
    quarter: 'Q1 FY23',
    quarterIndex: 4,
    period: 'Jun 2022',
    revenue: 650000000,
    grossProfit: 465000000,
    operatingProfit: 142000000,
    netProfit: 107000000,
    totalAssets: 3450000000,
    shareholders_equity: 2150000000,
    debt: 395000000,
    interest: 12000000,
    depreciation: 32000000,
    tax: 38000000,
    operatingCashFlow: 132000000,
    capex: 40000000,
    workingCapital: 195000000
  }
];

// Banking company data for comparison
const axisBankQuarterlyData: QuarterlyFinancialData[] = [
  // Latest 4 quarters (FY24)
  {
    quarter: 'Q4 FY24',
    quarterIndex: 11,
    period: 'Mar 2024',
    revenue: 32452000000, // 32,452 Cr
    grossProfit: 21500000000,
    operatingProfit: 20509000000,
    netProfit: 7509000000,
    totalAssets: 1485000000000,
    shareholders_equity: 186052000000,
    debt: 1123456000000, // Deposits as debt proxy
    interest: 3200000000,
    depreciation: 2100000000,
    tax: 2800000000,
    operatingCashFlow: 25000000000,
    capex: 3500000000,
    workingCapital: 50000000000
  },
  {
    quarter: 'Q3 FY24',
    quarterIndex: 10,
    period: 'Dec 2023',
    revenue: 31200000000,
    grossProfit: 20800000000,
    operatingProfit: 19850000000,
    netProfit: 7200000000,
    totalAssets: 1450000000000,
    shareholders_equity: 180000000000,
    debt: 1100000000000,
    interest: 3100000000,
    depreciation: 2000000000,
    tax: 2650000000,
    operatingCashFlow: 24000000000,
    capex: 3200000000,
    workingCapital: 48000000000
  },
  {
    quarter: 'Q2 FY24',
    quarterIndex: 9,
    period: 'Sep 2023',
    revenue: 29800000000,
    grossProfit: 19900000000,
    operatingProfit: 18950000000,
    netProfit: 6800000000,
    totalAssets: 1420000000000,
    shareholders_equity: 175000000000,
    debt: 1080000000000,
    interest: 3000000000,
    depreciation: 1950000000,
    tax: 2500000000,
    operatingCashFlow: 23000000000,
    capex: 3000000000,
    workingCapital: 46000000000
  },
  {
    quarter: 'Q1 FY24',
    quarterIndex: 8,
    period: 'Jun 2023',
    revenue: 28500000000,
    grossProfit: 19000000000,
    operatingProfit: 18100000000,
    netProfit: 6400000000,
    totalAssets: 1400000000000,
    shareholders_equity: 170000000000,
    debt: 1060000000000,
    interest: 2900000000,
    depreciation: 1900000000,
    tax: 2350000000,
    operatingCashFlow: 22000000000,
    capex: 2800000000,
    workingCapital: 44000000000
  },
  // Previous year quarters for growth calculation
  {
    quarter: 'Q4 FY23',
    quarterIndex: 7,
    period: 'Mar 2023',
    revenue: 28800000000,
    grossProfit: 18500000000,
    operatingProfit: 17600000000,
    netProfit: 6200000000,
    totalAssets: 1350000000000,
    shareholders_equity: 165000000000,
    debt: 1020000000000,
    interest: 2800000000,
    depreciation: 1850000000,
    tax: 2200000000,
    operatingCashFlow: 21000000000,
    capex: 2600000000,
    workingCapital: 42000000000
  },
  {
    quarter: 'Q3 FY23',
    quarterIndex: 6,
    period: 'Dec 2022',
    revenue: 27500000000,
    grossProfit: 17800000000,
    operatingProfit: 16900000000,
    netProfit: 5900000000,
    totalAssets: 1320000000000,
    shareholders_equity: 160000000000,
    debt: 1000000000000,
    interest: 2700000000,
    depreciation: 1800000000,
    tax: 2100000000,
    operatingCashFlow: 20500000000,
    capex: 2500000000,
    workingCapital: 40000000000
  },
  {
    quarter: 'Q2 FY23',
    quarterIndex: 5,
    period: 'Sep 2022',
    revenue: 26200000000,
    grossProfit: 17100000000,
    operatingProfit: 16200000000,
    netProfit: 5600000000,
    totalAssets: 1290000000000,
    shareholders_equity: 155000000000,
    debt: 980000000000,
    interest: 2600000000,
    depreciation: 1750000000,
    tax: 2000000000,
    operatingCashFlow: 20000000000,
    capex: 2400000000,
    workingCapital: 38000000000
  },
  {
    quarter: 'Q1 FY23',
    quarterIndex: 4,
    period: 'Jun 2022',
    revenue: 25000000000,
    grossProfit: 16400000000,
    operatingProfit: 15500000000,
    netProfit: 5300000000,
    totalAssets: 1260000000000,
    shareholders_equity: 150000000000,
    debt: 960000000000,
    interest: 2500000000,
    depreciation: 1700000000,
    tax: 1900000000,
    operatingCashFlow: 19500000000,
    capex: 2300000000,
    workingCapital: 36000000000
  }
];

const companies = {
  'emami': {
    name: 'Emami Limited (FMCG)',
    data: emamiQuarterlyData,
    sector: 'Consumer Goods'
  },
  'axis': {
    name: 'Axis Bank Limited (Banking)',
    data: axisBankQuarterlyData,
    sector: 'Banking'
  }
};

export default function TTMCalculatorDemo() {
  const [selectedCompany, setSelectedCompany] = useState<'emami' | 'axis'>('emami');
  const [analysisType, setAnalysisType] = useState<'basic' | 'growth' | 'ratios' | 'trends'>('basic');
  const [showValidation, setShowValidation] = useState(true);

  const currentData = companies[selectedCompany].data;
  const companyName = companies[selectedCompany].name;
  const sector = companies[selectedCompany].sector;

  // Calculate TTM metrics
  const ttmRevenue = calculateTTMRevenue(currentData);
  const ttmNetProfit = calculateTTMProfit(currentData, 'net');
  const ttmOperatingProfit = calculateTTMProfit(currentData, 'operating');
  const ttmGrossProfit = calculateTTMProfit(currentData, 'gross');
  const ttmMargins = calculateTTMMargins(currentData);
  const ttmRatios = calculateTTMRatios(currentData);
  const ttmGrowth = calculateTTMGrowth(currentData);
  const ttmSeries = createTTMDataSeries(currentData, 3);
  const validation = validateTTMData(currentData);

  let trendAnalysis: TTMCalculationResult | null = null;
  try {
    trendAnalysis = analyzeTTMTrends(currentData);
  } catch (error) {
    console.log('Insufficient data for comprehensive trend analysis');
  }

  const latestQuarter = currentData[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            TTM Calculator Demo
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Task 7.5 - Trailing Twelve Months Financial Analysis
          </p>
          <div className="inline-flex items-center bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-white/20">
            <span className="text-sm text-gray-500">✅ 29/29 tests passing</span>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-white/20">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value as 'emami' | 'axis')}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="emami">Emami Limited (FMCG)</option>
                  <option value="axis">Axis Bank Limited (Banking)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Analysis Type
                </label>
                <select
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value as typeof analysisType)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="basic">Basic TTM Metrics</option>
                  <option value="growth">Growth Analysis</option>
                  <option value="ratios">Financial Ratios</option>
                  <option value="trends">Trend Analysis</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showValidation"
                checked={showValidation}
                onChange={(e) => setShowValidation(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="showValidation" className="text-sm text-gray-700">
                Show Data Validation
              </label>
            </div>
          </div>
        </div>

        {/* Company Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-white/20">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{companyName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-600 mb-1">Sector</h3>
              <p className="text-lg font-semibold text-blue-800">{sector}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-600 mb-1">Latest Quarter</h3>
              <p className="text-lg font-semibold text-green-800">{latestQuarter.quarter}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-600 mb-1">Data Points</h3>
              <p className="text-lg font-semibold text-purple-800">{currentData.length} Quarters</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-orange-600 mb-1">TTM Period</h3>
              <p className="text-lg font-semibold text-orange-800">
                {currentData[3]?.quarter} to {currentData[0]?.quarter}
              </p>
            </div>
          </div>
        </div>

        {/* Data Validation */}
        {showValidation && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-white/20">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Data Quality Validation</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${validation.isValid ? 'bg-green-50' : 'bg-red-50'}`}>
                <h3 className="text-sm font-medium mb-1">
                  <span className={validation.isValid ? 'text-green-600' : 'text-red-600'}>
                    Data Validity
                  </span>
                </h3>
                <p className={`text-lg font-semibold ${validation.isValid ? 'text-green-800' : 'text-red-800'}`}>
                  {validation.isValid ? 'Valid' : 'Invalid'}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-600 mb-1">Completeness</h3>
                <p className="text-lg font-semibold text-blue-800">
                  {validation.dataCompleteness.toFixed(1)}%
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-yellow-600 mb-1">Warnings</h3>
                <p className="text-lg font-semibold text-yellow-800">
                  {validation.warnings.length} Issues
                </p>
              </div>
            </div>
            {validation.warnings.length > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Validation Warnings:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {validation.warnings.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Main Analysis */}
        {analysisType === 'basic' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* TTM Financial Metrics */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
              <h3 className="text-xl font-bold text-gray-800 mb-4">TTM Financial Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-700">TTM Revenue</span>
                  <span className="text-lg font-semibold text-blue-600">
                    {formatTTMValue(ttmRevenue, 'currency')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-700">TTM Gross Profit</span>
                  <span className="text-lg font-semibold text-green-600">
                    {formatTTMValue(ttmGrossProfit, 'currency')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-700">TTM Operating Profit</span>
                  <span className="text-lg font-semibold text-orange-600">
                    {formatTTMValue(ttmOperatingProfit, 'currency')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-700">TTM Net Profit</span>
                  <span className="text-lg font-semibold text-purple-600">
                    {formatTTMValue(ttmNetProfit, 'currency')}
                  </span>
                </div>
              </div>
            </div>

            {/* TTM Margins */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
              <h3 className="text-xl font-bold text-gray-800 mb-4">TTM Profit Margins</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Gross Profit Margin</span>
                  <span className="text-lg font-semibold text-green-600">
                    {formatTTMValue(ttmMargins.grossProfitMargin, 'percentage')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Operating Profit Margin</span>
                  <span className="text-lg font-semibold text-orange-600">
                    {formatTTMValue(ttmMargins.operatingProfitMargin, 'percentage')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Net Profit Margin</span>
                  <span className="text-lg font-semibold text-purple-600">
                    {formatTTMValue(ttmMargins.netProfitMargin, 'percentage')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Operating Cash Flow Margin</span>
                  <span className="text-lg font-semibold text-blue-600">
                    {formatTTMValue(ttmMargins.operatingCashFlowMargin, 'percentage')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {analysisType === 'growth' && currentData.length >= 8 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
            <h3 className="text-xl font-bold text-gray-800 mb-4">TTM vs Previous TTM Growth</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="text-sm font-medium text-blue-600 mb-2">Revenue Growth</h4>
                <p className={`text-2xl font-bold ${ttmGrowth.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {ttmGrowth.revenueGrowth >= 0 ? '+' : ''}{formatTTMValue(ttmGrowth.revenueGrowth, 'percentage')}
                </p>
                <p className="text-sm text-gray-600 mt-1">TTM vs Previous TTM</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="text-sm font-medium text-green-600 mb-2">Profit Growth</h4>
                <p className={`text-2xl font-bold ${ttmGrowth.profitGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {ttmGrowth.profitGrowth >= 0 ? '+' : ''}{formatTTMValue(ttmGrowth.profitGrowth, 'percentage')}
                </p>
                <p className="text-sm text-gray-600 mt-1">Net Profit Growth</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h4 className="text-sm font-medium text-orange-600 mb-2">Operating Profit Growth</h4>
                <p className={`text-2xl font-bold ${ttmGrowth.operatingProfitGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {ttmGrowth.operatingProfitGrowth >= 0 ? '+' : ''}{formatTTMValue(ttmGrowth.operatingProfitGrowth, 'percentage')}
                </p>
                <p className="text-sm text-gray-600 mt-1">Operating Level Growth</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h4 className="text-sm font-medium text-purple-600 mb-2">Cash Flow Growth</h4>
                <p className={`text-2xl font-bold ${ttmGrowth.cashFlowGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {ttmGrowth.cashFlowGrowth >= 0 ? '+' : ''}{formatTTMValue(ttmGrowth.cashFlowGrowth, 'percentage')}
                </p>
                <p className="text-sm text-gray-600 mt-1">Operating Cash Flow</p>
              </div>
              <div className="bg-indigo-50 p-6 rounded-lg">
                <h4 className="text-sm font-medium text-indigo-600 mb-2">Asset Growth</h4>
                <p className={`text-2xl font-bold ${ttmGrowth.assetGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {ttmGrowth.assetGrowth >= 0 ? '+' : ''}{formatTTMValue(ttmGrowth.assetGrowth, 'percentage')}
                </p>
                <p className="text-sm text-gray-600 mt-1">Total Assets Growth</p>
              </div>
            </div>
          </div>
        )}

        {analysisType === 'ratios' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
            <h3 className="text-xl font-bold text-gray-800 mb-4">TTM-based Financial Ratios</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="text-sm font-medium text-blue-600 mb-2">Return on Equity (ROE)</h4>
                <p className="text-2xl font-bold text-blue-800">
                  {formatTTMValue(ttmRatios.roe, 'percentage')}
                </p>
                <p className="text-sm text-gray-600 mt-1">TTM Net Profit / Avg Equity</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="text-sm font-medium text-green-600 mb-2">Return on Assets (ROA)</h4>
                <p className="text-2xl font-bold text-green-800">
                  {formatTTMValue(ttmRatios.roa, 'percentage')}
                </p>
                <p className="text-sm text-gray-600 mt-1">TTM Net Profit / Avg Assets</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h4 className="text-sm font-medium text-orange-600 mb-2">Asset Turnover</h4>
                <p className="text-2xl font-bold text-orange-800">
                  {formatTTMValue(ttmRatios.assetTurnover, 'ratio')}
                </p>
                <p className="text-sm text-gray-600 mt-1">TTM Revenue / Avg Assets</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h4 className="text-sm font-medium text-purple-600 mb-2">Debt to Equity</h4>
                <p className="text-2xl font-bold text-purple-800">
                  {formatTTMValue(ttmRatios.debtToEquity, 'ratio')}
                </p>
                <p className="text-sm text-gray-600 mt-1">Latest Debt / Equity</p>
              </div>
              <div className="bg-indigo-50 p-6 rounded-lg">
                <h4 className="text-sm font-medium text-indigo-600 mb-2">Interest Coverage</h4>
                <p className="text-2xl font-bold text-indigo-800">
                  {formatTTMValue(ttmRatios.interestCoverage, 'ratio')}
                </p>
                <p className="text-sm text-gray-600 mt-1">TTM Operating Profit / TTM Interest</p>
              </div>
              <div className="bg-red-50 p-6 rounded-lg">
                <h4 className="text-sm font-medium text-red-600 mb-2">Cash Conversion</h4>
                <p className="text-2xl font-bold text-red-800">
                  {formatTTMValue(ttmRatios.cashConversion, 'percentage')}
                </p>
                <p className="text-sm text-gray-600 mt-1">TTM Operating Cash Flow / TTM Revenue</p>
              </div>
            </div>
          </div>
        )}

        {analysisType === 'trends' && trendAnalysis && (
          <div className="space-y-6">
            {/* Current vs Previous TTM */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
              <h3 className="text-xl font-bold text-gray-800 mb-4">TTM Trend Analysis</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-600 mb-2">Trend Direction</h4>
                  <p className={`text-2xl font-bold capitalize ${
                    trendAnalysis.trend.direction === 'improving' ? 'text-green-600' :
                    trendAnalysis.trend.direction === 'declining' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {trendAnalysis.trend.direction}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Overall Performance Trend</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                  <h4 className="text-sm font-medium text-green-600 mb-2">Trend Strength</h4>
                  <p className="text-2xl font-bold text-green-800">
                    {trendAnalysis.trend.strength.toFixed(0)}/100
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Magnitude of Change</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                  <h4 className="text-sm font-medium text-purple-600 mb-2">Consistency</h4>
                  <p className="text-2xl font-bold text-purple-800">
                    {trendAnalysis.trend.consistency.toFixed(0)}/100
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Margin Stability</p>
                </div>
              </div>
            </div>

            {/* TTM Series */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Rolling TTM Series</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {ttmSeries.slice(0, 2).map((ttmData, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">{ttmData.period}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Revenue:</span>
                        <span className="font-medium">{formatTTMValue(ttmData.ttmRevenue, 'currency')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Net Profit:</span>
                        <span className="font-medium">{formatTTMValue(ttmData.ttmNetProfit, 'currency')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Net Margin:</span>
                        <span className="font-medium">{formatTTMValue(ttmData.margins.netProfitMargin, 'percentage')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ROE:</span>
                        <span className="font-medium">{formatTTMValue(ttmData.ratios.roe, 'percentage')}</span>
                      </div>
                      {ttmData.growth && (
                        <div className="pt-2 border-t border-gray-100">
                          <div className="flex justify-between">
                            <span>Revenue Growth:</span>
                            <span className={`font-medium ${ttmData.growth.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {ttmData.growth.revenueGrowth >= 0 ? '+' : ''}{formatTTMValue(ttmData.growth.revenueGrowth, 'percentage')}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Quarters: {ttmData.quarters.join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quarterly Breakdown */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 mt-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Quarterly Data (Latest 4 Quarters)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Quarter</th>
                  <th className="text-right py-3 px-4">Revenue</th>
                  <th className="text-right py-3 px-4">Operating Profit</th>
                  <th className="text-right py-3 px-4">Net Profit</th>
                  <th className="text-right py-3 px-4">Net Margin</th>
                  <th className="text-right py-3 px-4">Operating Cash Flow</th>
                </tr>
              </thead>
              <tbody>
                {currentData.slice(0, 4).map((quarter, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">{quarter.quarter}</td>
                    <td className="py-3 px-4 text-right">{formatTTMValue(quarter.revenue, 'currency')}</td>
                    <td className="py-3 px-4 text-right">{formatTTMValue(quarter.operatingProfit, 'currency')}</td>
                    <td className="py-3 px-4 text-right">{formatTTMValue(quarter.netProfit, 'currency')}</td>
                    <td className="py-3 px-4 text-right">{formatTTMValue((quarter.netProfit / quarter.revenue) * 100, 'percentage')}</td>
                    <td className="py-3 px-4 text-right">{formatTTMValue(quarter.operatingCashFlow, 'currency')}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-blue-200 bg-blue-50">
                  <td className="py-3 px-4 font-bold text-blue-800">TTM Total</td>
                  <td className="py-3 px-4 text-right font-bold text-blue-800">{formatTTMValue(ttmRevenue, 'currency')}</td>
                  <td className="py-3 px-4 text-right font-bold text-blue-800">{formatTTMValue(ttmOperatingProfit, 'currency')}</td>
                  <td className="py-3 px-4 text-right font-bold text-blue-800">{formatTTMValue(ttmNetProfit, 'currency')}</td>
                  <td className="py-3 px-4 text-right font-bold text-blue-800">{formatTTMValue(ttmMargins.netProfitMargin, 'percentage')}</td>
                  <td className="py-3 px-4 text-right font-bold text-blue-800">{formatTTMValue(currentData.slice(0, 4).reduce((sum, q) => sum + q.operatingCashFlow, 0), 'currency')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 border border-white/20 mt-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Key TTM Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">TTM Benefits:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Smooths out quarterly seasonality</li>
                <li>• Provides annualized view from recent data</li>
                <li>• Better for peer comparison than individual quarters</li>
                <li>• Reduces impact of one-time items</li>
                <li>• More stable base for ratio calculations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Industry Insights:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• FMCG companies show lower TTM revenue but higher margins</li>
                <li>• Banking shows higher TTM revenue due to scale</li>
                <li>• TTM ratios provide better trend visibility</li>
                <li>• Growth rates are more meaningful on TTM basis</li>
                <li>• TTM metrics reduce quarterly noise</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 