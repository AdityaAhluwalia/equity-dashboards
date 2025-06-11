'use client';

import React, { useState } from 'react';
import { FCFYieldChart, FCFYieldData } from '../../../components/cashflow/FCFYieldChart';

// Emami Limited - Quarterly FCF Yield Data (Q1 2022 - Q4 2024)
const emamiQuarterlyData: FCFYieldData[] = [
  {
    year: 2022,
    quarter: 'Q1 2022',
    freeCashFlow: 133.2,
    marketCap: 15420,
    enterpriseValue: 14890,
    fcfYieldMarketCap: 3.46, // Annualized
    fcfYieldEV: 3.58,
    totalAssets: 8750,
    revenue: 1245.6,
    fcfMargin: 10.69,
    assetTurnover: 0.57
  },
  {
    year: 2022,
    quarter: 'Q2 2022',
    freeCashFlow: 111.8,
    marketCap: 16120,
    enterpriseValue: 15580,
    fcfYieldMarketCap: 2.78,
    fcfYieldEV: 2.87,
    totalAssets: 8820,
    revenue: 1298.4,
    fcfMargin: 8.61,
    assetTurnover: 0.59
  },
  {
    year: 2022,
    quarter: 'Q3 2022',
    freeCashFlow: 122.5,
    marketCap: 15890,
    enterpriseValue: 15320,
    fcfYieldMarketCap: 3.09,
    fcfYieldEV: 3.20,
    totalAssets: 8900,
    revenue: 1356.2,
    fcfMargin: 9.03,
    assetTurnover: 0.61
  },
  {
    year: 2022,
    quarter: 'Q4 2022',
    freeCashFlow: 165.3,
    marketCap: 17250,
    enterpriseValue: 16680,
    fcfYieldMarketCap: 3.84,
    fcfYieldEV: 3.97,
    totalAssets: 9100,
    revenue: 1512.8,
    fcfMargin: 10.93,
    assetTurnover: 0.66
  },
  {
    year: 2023,
    quarter: 'Q1 2023',
    freeCashFlow: 145.7,
    marketCap: 16890,
    enterpriseValue: 16320,
    fcfYieldMarketCap: 3.46,
    fcfYieldEV: 3.57,
    totalAssets: 9250,
    revenue: 1398.5,
    fcfMargin: 10.42,
    assetTurnover: 0.60
  },
  {
    year: 2023,
    quarter: 'Q2 2023',
    freeCashFlow: 98.4,
    marketCap: 17450,
    enterpriseValue: 16890,
    fcfYieldMarketCap: 2.26,
    fcfYieldEV: 2.33,
    totalAssets: 9380,
    revenue: 1456.7,
    fcfMargin: 6.76,
    assetTurnover: 0.62
  },
  {
    year: 2023,
    quarter: 'Q3 2023',
    freeCashFlow: 178.9,
    marketCap: 18200,
    enterpriseValue: 17640,
    fcfYieldMarketCap: 3.94,
    fcfYieldEV: 4.06,
    totalAssets: 9520,
    revenue: 1587.3,
    fcfMargin: 11.27,
    assetTurnover: 0.67
  },
  {
    year: 2023,
    quarter: 'Q4 2023',
    freeCashFlow: 201.5,
    marketCap: 19100,
    enterpriseValue: 18510,
    fcfYieldMarketCap: 4.22,
    fcfYieldEV: 4.36,
    totalAssets: 9780,
    revenue: 1698.2,
    fcfMargin: 11.87,
    assetTurnover: 0.69
  },
  {
    year: 2024,
    quarter: 'Q1 2024',
    freeCashFlow: 167.3,
    marketCap: 18750,
    enterpriseValue: 18190,
    fcfYieldMarketCap: 3.57,
    fcfYieldEV: 3.68,
    totalAssets: 9890,
    revenue: 1534.6,
    fcfMargin: 10.90,
    assetTurnover: 0.62
  },
  {
    year: 2024,
    quarter: 'Q2 2024',
    freeCashFlow: 142.8,
    marketCap: 19320,
    enterpriseValue: 18760,
    fcfYieldMarketCap: 2.96,
    fcfYieldEV: 3.05,
    totalAssets: 10050,
    revenue: 1623.4,
    fcfMargin: 8.80,
    assetTurnover: 0.64
  },
  {
    year: 2024,
    quarter: 'Q3 2024',
    freeCashFlow: 189.6,
    marketCap: 20150,
    enterpriseValue: 19580,
    fcfYieldMarketCap: 3.77,
    fcfYieldEV: 3.88,
    totalAssets: 10200,
    revenue: 1756.8,
    fcfMargin: 10.79,
    assetTurnover: 0.69
  },
  {
    year: 2024,
    quarter: 'Q4 2024',
    freeCashFlow: 218.4,
    marketCap: 21200,
    enterpriseValue: 20620,
    fcfYieldMarketCap: 4.12,
    fcfYieldEV: 4.24,
    totalAssets: 10450,
    revenue: 1867.5,
    fcfMargin: 11.69,
    assetTurnover: 0.71
  }
];

// Emami Limited - Annual FCF Yield Data (2019-2023)
const emamiAnnualData: FCFYieldData[] = [
  {
    year: 2019,
    freeCashFlow: 456.8,
    marketCap: 13250,
    enterpriseValue: 12890,
    fcfYieldMarketCap: 3.45,
    fcfYieldEV: 3.54,
    totalAssets: 7890,
    revenue: 4234.5,
    fcfMargin: 10.79,
    assetTurnover: 0.54
  },
  {
    year: 2020,
    freeCashFlow: 489.3,
    marketCap: 14250,
    enterpriseValue: 13820,
    fcfYieldMarketCap: 3.43,
    fcfYieldEV: 3.54,
    totalAssets: 8250,
    revenue: 4356.7,
    fcfMargin: 11.23,
    assetTurnover: 0.53
  },
  {
    year: 2021,
    freeCashFlow: 523.7,
    marketCap: 15680,
    enterpriseValue: 15120,
    fcfYieldMarketCap: 3.34,
    fcfYieldEV: 3.47,
    totalAssets: 8750,
    revenue: 4789.4,
    fcfMargin: 10.93,
    assetTurnover: 0.55
  },
  {
    year: 2022,
    freeCashFlow: 532.8,
    marketCap: 16315,
    enterpriseValue: 15745,
    fcfYieldMarketCap: 3.27,
    fcfYieldEV: 3.38,
    totalAssets: 9100,
    revenue: 5413.0,
    fcfMargin: 9.84,
    assetTurnover: 0.59
  },
  {
    year: 2023,
    freeCashFlow: 624.5,
    marketCap: 17910,
    enterpriseValue: 17340,
    fcfYieldMarketCap: 3.49,
    fcfYieldEV: 3.60,
    totalAssets: 9780,
    revenue: 6140.7,
    fcfMargin: 10.17,
    assetTurnover: 0.63
  }
];

export default function FCFYieldAnalysisDemo() {
  const [viewMode, setViewMode] = useState<'quarterly' | 'annual'>('quarterly');
  const [showFreeCashFlowBars, setShowFreeCashFlowBars] = useState(true);
  const [showFCFYieldMarketCap, setShowFCFYieldMarketCap] = useState(true);
  const [showFCFYieldEV, setShowFCFYieldEV] = useState(true);
  const [showFCFMargin, setShowFCFMargin] = useState(false);
  const [showIndustryAverage, setShowIndustryAverage] = useState(true);
  const [chartHeight, setChartHeight] = useState(450);

  const currentData = viewMode === 'quarterly' ? emamiQuarterlyData : emamiAnnualData;
  const industryAverageFCFYield = 3.8; // FMCG industry average

  // Calculate key metrics for insights
  const latestData = currentData[currentData.length - 1];
  const firstData = currentData[0];
  const avgFCFYield = currentData.reduce((sum, item) => sum + item.fcfYieldMarketCap, 0) / currentData.length;
  const fcfGrowth = ((latestData.freeCashFlow - firstData.freeCashFlow) / firstData.freeCashFlow) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            FCF Yield Analysis Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive Free Cash Flow yield analysis showing the relationship between cash generation 
            and company valuation over time
          </p>
        </div>

        {/* Company Context */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Emami Limited</h2>
            <div className="text-sm text-gray-500">
              FMCG • Personal Care • Indian Market
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm font-medium text-blue-700">Latest FCF Yield</div>
              <div className="text-2xl font-bold text-blue-900">
                {latestData.fcfYieldMarketCap.toFixed(2)}%
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm font-medium text-green-700">Average FCF Yield</div>
              <div className="text-2xl font-bold text-green-900">
                {avgFCFYield.toFixed(2)}%
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm font-medium text-purple-700">FCF Growth</div>
              <div className="text-2xl font-bold text-purple-900">
                {fcfGrowth > 0 ? '+' : ''}{fcfGrowth.toFixed(1)}%
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-sm font-medium text-orange-700">vs Industry</div>
              <div className="text-2xl font-bold text-orange-900">
                {latestData.fcfYieldMarketCap > industryAverageFCFYield ? '+' : ''}
                {(latestData.fcfYieldMarketCap - industryAverageFCFYield).toFixed(2)}%
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
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Quarterly
                </button>
                <button
                  onClick={() => setViewMode('annual')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'annual'
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
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
                    checked={showFreeCashFlowBars}
                    onChange={(e) => setShowFreeCashFlowBars(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">FCF Bars</span>
                  <div className="ml-2 w-3 h-3 bg-green-500 rounded"></div>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showFCFYieldMarketCap}
                    onChange={(e) => setShowFCFYieldMarketCap(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">FCF Yield (Market Cap)</span>
                  <div className="ml-2 w-3 h-3 bg-blue-500 rounded"></div>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showFCFYieldEV}
                    onChange={(e) => setShowFCFYieldEV(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">FCF Yield (EV)</span>
                  <div className="ml-2 w-3 h-3 bg-purple-500 rounded"></div>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showFCFMargin}
                    onChange={(e) => setShowFCFMargin(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">FCF Margin</span>
                  <div className="ml-2 w-3 h-3 bg-yellow-500 rounded"></div>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showIndustryAverage}
                    onChange={(e) => setShowIndustryAverage(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Industry Average</span>
                  <div className="ml-2 w-3 h-3 bg-red-500 rounded border-dashed border border-red-500"></div>
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
              FCF Yield Analysis - {viewMode === 'quarterly' ? 'Quarterly View' : 'Annual View'}
            </h3>
            <div className="text-sm text-gray-500">
              {viewMode === 'quarterly' ? '12 Quarters' : '5 Years'} • Emami Limited
            </div>
          </div>

          <FCFYieldChart
            data={currentData}
            viewMode={viewMode}
            showFreeCashFlowBars={showFreeCashFlowBars}
            showFCFYieldMarketCap={showFCFYieldMarketCap}
            showFCFYieldEV={showFCFYieldEV}
            showFCFMargin={showFCFMargin}
            showIndustryAverage={showIndustryAverage}
            industryAverageFCFYield={industryAverageFCFYield}
            height={chartHeight}
            className="mt-4"
          />
        </div>

        {/* Insights Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">FCF Yield Performance</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Current FCF yield of {latestData.fcfYieldMarketCap.toFixed(2)}% {latestData.fcfYieldMarketCap > industryAverageFCFYield ? 'above' : 'below'} industry average</li>
                <li>• Enterprise value-based yield shows {latestData.fcfYieldEV.toFixed(2)}% return potential</li>
                <li>• {fcfGrowth > 0 ? 'Improving' : 'Declining'} FCF generation with {Math.abs(fcfGrowth).toFixed(1)}% change</li>
                <li>• FCF margin of {latestData.fcfMargin.toFixed(1)}% indicates operational efficiency</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Chart Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <span className="text-green-600">Green bars</span>: Free cash flow generation amounts</li>
                <li>• <span className="text-blue-600">Blue line</span>: FCF yield based on market capitalization</li>
                <li>• <span className="text-purple-600">Purple dashed</span>: FCF yield based on enterprise value</li>
                <li>• <span className="text-yellow-600">Orange line</span>: FCF margin percentage</li>
                <li>• <span className="text-red-600">Red dashed</span>: Industry average reference line</li>
                <li>• Dual Y-axis: Currency amounts (left) and percentages (right)</li>
                <li>• Interactive tooltips with Indian currency formatting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 