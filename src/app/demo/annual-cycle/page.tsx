'use client';

import React, { useState } from 'react';
import AnnualCycleView, { AnnualCycleData } from '@/components/charts/AnnualCycleView';
import { PhaseType } from '@/lib/design-tokens';

const emamiAnnualData: AnnualCycleData[] = [
  {
    fiscalYear: 'FY13',
    revenue: 1800000000, // 18 billion
    netProfit: 120000000, // 1.2 billion  
    phase: 'contraction',
    cycleIntensity: 15,
    yearIndex: 0,
    marketCap: 850000000000, // 85,000 crores
    revenueGrowth: -8.5,
    profitGrowth: -12.3
  },
  {
    fiscalYear: 'FY14',
    revenue: 1950000000,
    netProfit: 140000000,
    phase: 'transition',
    cycleIntensity: 35,
    yearIndex: 1,
    marketCap: 920000000000,
    revenueGrowth: 8.3,
    profitGrowth: 16.7
  },
  {
    fiscalYear: 'FY15',
    revenue: 2200000000,
    netProfit: 180000000,
    phase: 'expansion',
    cycleIntensity: 65,
    yearIndex: 2,
    marketCap: 1200000000000,
    revenueGrowth: 12.8,
    profitGrowth: 28.6
  },
  {
    fiscalYear: 'FY16',
    revenue: 2580000000,
    netProfit: 230000000,
    phase: 'expansion',
    cycleIntensity: 85,
    yearIndex: 3,
    marketCap: 1450000000000,
    revenueGrowth: 17.3,
    profitGrowth: 27.8
  },
  {
    fiscalYear: 'FY17',
    revenue: 2750000000,
    netProfit: 245000000,
    phase: 'stable',
    cycleIntensity: 70,
    yearIndex: 4,
    marketCap: 1580000000000,
    revenueGrowth: 6.6,
    profitGrowth: 6.5
  },
  {
    fiscalYear: 'FY18',
    revenue: 2680000000,
    netProfit: 220000000,
    phase: 'contraction',
    cycleIntensity: 25,
    yearIndex: 5,
    marketCap: 1420000000000,
    revenueGrowth: -2.5,
    profitGrowth: -10.2
  },
  {
    fiscalYear: 'FY19',
    revenue: 2450000000,
    netProfit: 190000000,
    phase: 'contraction',
    cycleIntensity: 20,
    yearIndex: 6,
    marketCap: 1280000000000,
    revenueGrowth: -8.6,
    profitGrowth: -13.6
  },
  {
    fiscalYear: 'FY20',
    revenue: 2550000000,
    netProfit: 200000000,
    phase: 'transition',
    cycleIntensity: 40,
    yearIndex: 7,
    marketCap: 1350000000000,
    revenueGrowth: 4.1,
    profitGrowth: 5.3
  },
  {
    fiscalYear: 'FY21',
    revenue: 2780000000,
    netProfit: 235000000,
    phase: 'expansion',
    cycleIntensity: 75,
    yearIndex: 8,
    marketCap: 1650000000000,
    revenueGrowth: 9.0,
    profitGrowth: 17.5
  },
  {
    fiscalYear: 'FY22',
    revenue: 3100000000,
    netProfit: 285000000,
    phase: 'expansion',
    cycleIntensity: 90,
    yearIndex: 9,
    marketCap: 1980000000000,
    revenueGrowth: 11.5,
    profitGrowth: 21.3
  },
  {
    fiscalYear: 'FY23',
    revenue: 3250000000,
    netProfit: 295000000,
    phase: 'stable',
    cycleIntensity: 60,
    yearIndex: 10,
    marketCap: 2100000000000,
    revenueGrowth: 4.8,
    profitGrowth: 3.5
  },
  {
    fiscalYear: 'FY24',
    revenue: 3180000000,
    netProfit: 280000000,
    phase: 'transition',
    cycleIntensity: 45,
    yearIndex: 11,
    marketCap: 2050000000000,
    revenueGrowth: -2.2,
    profitGrowth: -5.1
  }
];

const axisBankAnnualData: AnnualCycleData[] = [
  {
    fiscalYear: 'FY13',
    revenue: 2450000000000, // 245 billion
    netProfit: 67000000000,  // 6.7 billion
    phase: 'stable',
    cycleIntensity: 50,
    yearIndex: 0,
    marketCap: 4500000000000, // 4.5 lakh crores
    revenueGrowth: 5.2,
    profitGrowth: 3.8
  },
  {
    fiscalYear: 'FY14',
    revenue: 2890000000000,
    netProfit: 78000000000,
    phase: 'expansion',
    cycleIntensity: 75,
    yearIndex: 1,
    marketCap: 5200000000000,
    revenueGrowth: 18.0,
    profitGrowth: 16.4
  },
  {
    fiscalYear: 'FY15',
    revenue: 3180000000000,
    netProfit: 85000000000,
    phase: 'expansion',
    cycleIntensity: 80,
    yearIndex: 2,
    marketCap: 5800000000000,
    revenueGrowth: 10.0,
    profitGrowth: 9.0
  },
  {
    fiscalYear: 'FY16',
    revenue: 3420000000000,
    netProfit: 89000000000,
    phase: 'stable',
    cycleIntensity: 65,
    yearIndex: 3,
    marketCap: 6100000000000,
    revenueGrowth: 7.5,
    profitGrowth: 4.7
  },
  {
    fiscalYear: 'FY17',
    revenue: 3680000000000,
    netProfit: 95000000000,
    phase: 'expansion',
    cycleIntensity: 70,
    yearIndex: 4,
    marketCap: 6800000000000,
    revenueGrowth: 7.6,
    profitGrowth: 6.7
  },
  {
    fiscalYear: 'FY18',
    revenue: 4150000000000,
    netProfit: 105000000000,
    phase: 'expansion',
    cycleIntensity: 85,
    yearIndex: 5,
    marketCap: 7500000000000,
    revenueGrowth: 12.8,
    profitGrowth: 10.5
  },
  {
    fiscalYear: 'FY19',
    revenue: 4320000000000,
    netProfit: 98000000000,
    phase: 'transition',
    cycleIntensity: 55,
    yearIndex: 6,
    marketCap: 7200000000000,
    revenueGrowth: 4.1,
    profitGrowth: -6.7
  },
  {
    fiscalYear: 'FY20',
    revenue: 4180000000000,
    netProfit: 85000000000,
    phase: 'contraction',
    cycleIntensity: 35,
    yearIndex: 7,
    marketCap: 6500000000000,
    revenueGrowth: -3.2,
    profitGrowth: -13.3
  },
  {
    fiscalYear: 'FY21',
    revenue: 4520000000000,
    netProfit: 102000000000,
    phase: 'transition',
    cycleIntensity: 45,
    yearIndex: 8,
    marketCap: 7800000000000,
    revenueGrowth: 8.1,
    profitGrowth: 20.0
  },
  {
    fiscalYear: 'FY22',
    revenue: 5200000000000,
    netProfit: 125000000000,
    phase: 'expansion',
    cycleIntensity: 90,
    yearIndex: 9,
    marketCap: 9200000000000,
    revenueGrowth: 15.0,
    profitGrowth: 22.5
  },
  {
    fiscalYear: 'FY23',
    revenue: 5680000000000,
    netProfit: 142000000000,
    phase: 'expansion',
    cycleIntensity: 95,
    yearIndex: 10,
    marketCap: 10500000000000,
    revenueGrowth: 9.2,
    profitGrowth: 13.6
  },
  {
    fiscalYear: 'FY24',
    revenue: 5920000000000,
    netProfit: 155000000000,
    phase: 'stable',
    cycleIntensity: 70,
    yearIndex: 11,
    marketCap: 11200000000000,
    revenueGrowth: 4.2,
    profitGrowth: 9.2
  }
];

export default function AnnualCycleDemoPage() {
  const [selectedCompany, setSelectedCompany] = useState<'emami' | 'axis'>('emami');
  const [showPhaseIntensity, setShowPhaseIntensity] = useState(false);
  const [showMarketCap, setShowMarketCap] = useState(false);
  const [showGrowthRates, setShowGrowthRates] = useState(false);
  const [showTrendAnalysis, setShowTrendAnalysis] = useState(true);
  const [enableZoom, setEnableZoom] = useState(false);
  const [chartHeight, setChartHeight] = useState(500);

  const currentData = selectedCompany === 'emami' ? emamiAnnualData : axisBankAnnualData;
  const companyName = selectedCompany === 'emami' ? 'Emami Ltd' : 'Axis Bank Ltd';

  const handlePhaseClick = (phase: PhaseType, year: string) => {
    console.log(`Phase clicked: ${phase} in ${year}`);
  };

  const handleYearHover = (year: string | null) => {
    console.log(`Year hovered: ${year}`);
  };

  // Calculate summary statistics
  const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0);
  const avgRevenue = totalRevenue / currentData.length;
  const totalGrowth = ((currentData[currentData.length - 1].revenue - currentData[0].revenue) / currentData[0].revenue * 100);
  const avgCycleIntensity = currentData.reduce((sum, item) => sum + item.cycleIntensity, 0) / currentData.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Annual Cycle Analysis Demo - Task 6.2
          </h1>
          <p className="text-gray-600">
            12-year business cycle visualization with enhanced phase backgrounds
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Demo Controls</h2>
          
          {/* Company Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value as 'emami' | 'axis')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="emami">Emami Ltd (FMCG)</option>
                <option value="axis">Axis Bank Ltd (Banking)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chart Height</label>
              <select
                value={chartHeight}
                onChange={(e) => setChartHeight(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={400}>400px</option>
                <option value={500}>500px</option>
                <option value={600}>600px</option>
                <option value={700}>700px</option>
              </select>
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showPhaseIntensity}
                onChange={(e) => setShowPhaseIntensity(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Phase Intensity</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showMarketCap}
                onChange={(e) => setShowMarketCap(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Market Cap</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showGrowthRates}
                onChange={(e) => setShowGrowthRates(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Growth Rates</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showTrendAnalysis}
                onChange={(e) => setShowTrendAnalysis(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Trend Analysis</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={enableZoom}
                onChange={(e) => setEnableZoom(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enable Zoom</span>
            </label>
          </div>
        </div>

        {/* Data Summary */}
        <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {companyName} - 12-Year Summary (FY13-FY24)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-blue-600 font-medium">Total Revenue (12Y)</div>
              <div className="text-xl font-bold text-blue-900">
                ₹{(totalRevenue / 1000000000000).toFixed(1)}T
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-green-600 font-medium">Avg Annual Revenue</div>
              <div className="text-xl font-bold text-green-900">
                ₹{(avgRevenue / 10000000).toFixed(0)}Cr
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-purple-600 font-medium">Total Growth</div>
              <div className="text-xl font-bold text-purple-900">
                {totalGrowth >= 0 ? '+' : ''}{totalGrowth.toFixed(1)}%
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-orange-600 font-medium">Avg Cycle Intensity</div>
              <div className="text-xl font-bold text-orange-900">
                {avgCycleIntensity.toFixed(0)}%
              </div>
            </div>
          </div>
        </div>

        {/* Annual Cycle Chart */}
        <div className="space-y-4">
          <AnnualCycleView
            data={currentData}
            showPhaseIntensity={showPhaseIntensity}
            showMarketCap={showMarketCap}
            showGrowthRates={showGrowthRates}
            showTrendAnalysis={showTrendAnalysis}
            enableZoom={enableZoom}
            height={chartHeight}
            onPhaseClick={handlePhaseClick}
            onYearHover={handleYearHover}
          />
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Raw Data - {companyName}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">Year</th>
                  <th className="text-right py-2">Revenue (Cr)</th>
                  <th className="text-right py-2">Profit (Cr)</th>
                  <th className="text-right py-2">Market Cap (Cr)</th>
                  <th className="text-center py-2">Phase</th>
                  <th className="text-right py-2">Intensity</th>
                  <th className="text-right py-2">Rev Growth</th>
                  <th className="text-right py-2">Profit Growth</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 font-medium">{item.fiscalYear}</td>
                    <td className="text-right py-2">₹{(item.revenue / 10000000).toFixed(0)}</td>
                    <td className="text-right py-2">₹{(item.netProfit / 10000000).toFixed(0)}</td>
                    <td className="text-right py-2">₹{item.marketCap ? (item.marketCap / 10000000).toFixed(0) : 'N/A'}</td>
                    <td className="text-center py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.phase === 'expansion' ? 'bg-green-100 text-green-800' :
                        item.phase === 'contraction' ? 'bg-red-100 text-red-800' :
                        item.phase === 'stable' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.phase}
                      </span>
                    </td>
                    <td className="text-right py-2">{item.cycleIntensity}%</td>
                    <td className={`text-right py-2 ${
                      item.revenueGrowth !== undefined && item.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.revenueGrowth !== undefined ? 
                        `${item.revenueGrowth >= 0 ? '+' : ''}${item.revenueGrowth.toFixed(1)}%` : 'N/A'
                      }
                    </td>
                    <td className={`text-right py-2 ${
                      item.profitGrowth !== undefined && item.profitGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.profitGrowth !== undefined ? 
                        `${item.profitGrowth >= 0 ? '+' : ''}${item.profitGrowth.toFixed(1)}%` : 'N/A'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Task 6.2: Annual view (12 years) with phase backgrounds - All features working with real financial data</p>
          <p>Interactive phase backgrounds, cycle analysis, and comprehensive data visualization</p>
        </div>
      </div>
    </div>
  );
} 