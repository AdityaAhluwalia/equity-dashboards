'use client';

import { useState } from 'react';
import { MarginsTimeline } from '@/components/margins/MarginsTimeline';

// Extended Emami Limited sample data with 10 years for trend analysis
const sampleCompanyData = {
  company: {
    id: 'emami-ltd',
    name: 'Emami Limited',
    sector: 'Consumer Goods',
    industry: 'Personal Care',
    market_cap: 15000,
    employees: 2500,
    founded: 1974,
    headquarters: 'Kolkata, India',
    description: 'Leading FMCG company in India with strong brand portfolio',
    website: 'https://emamigroup.com',
    exchange: 'NSE',
    stockSymbol: 'EMAMILTD.NS',
    currentPhase: 'expansion' as const,
    companyType: 'Public' as const,
    marketCap: 15000,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  annualData: [
    // 2014 - Starting point
    {
      year: 2014,
      revenue: 2200,
      netProfit: 250,
      operatingProfit: 320,
      grossProfit: 1100,
      grossMargin: 50.0,
      operatingMargin: 14.5,
      netMargin: 11.4
    },
    // 2015 - Growth phase
    {
      year: 2015,
      revenue: 2450,
      netProfit: 290,
      operatingProfit: 370,
      grossProfit: 1225,
      grossMargin: 50.0,
      operatingMargin: 15.1,
      netMargin: 11.8
    },
    // 2016 - Expansion challenges
    {
      year: 2016,
      revenue: 2680,
      netProfit: 310,
      operatingProfit: 390,
      grossProfit: 1285,
      grossMargin: 47.9,
      operatingMargin: 14.6,
      netMargin: 11.6
    },
    // 2017 - Market pressures
    {
      year: 2017,
      revenue: 2850,
      netProfit: 320,
      operatingProfit: 410,
      grossProfit: 1370,
      grossMargin: 48.1,
      operatingMargin: 14.4,
      netMargin: 11.2
    },
    // 2018 - Recovery begins
    {
      year: 2018,
      revenue: 3100,
      netProfit: 380,
      operatingProfit: 480,
      grossProfit: 1550,
      grossMargin: 50.0,
      operatingMargin: 15.5,
      netMargin: 12.3
    },
    // 2019 - Strong growth
    {
      year: 2019,
      revenue: 3350,
      netProfit: 440,
      operatingProfit: 550,
      grossProfit: 1675,
      grossMargin: 50.0,
      operatingMargin: 16.4,
      netMargin: 13.1
    },
    // 2020 - COVID impact
    {
      year: 2020,
      revenue: 3180,
      netProfit: 390,
      operatingProfit: 480,
      grossProfit: 1590,
      grossMargin: 50.0,
      operatingMargin: 15.1,
      netMargin: 12.3
    },
    // 2021 - Recovery
    {
      year: 2021,
      revenue: 3450,
      netProfit: 450,
      operatingProfit: 560,
      grossProfit: 1725,
      grossMargin: 50.0,
      operatingMargin: 16.2,
      netMargin: 13.0
    },
    // 2022 - Premium positioning
    {
      year: 2022,
      revenue: 3680,
      netProfit: 520,
      operatingProfit: 630,
      grossProfit: 1840,
      grossMargin: 50.0,
      operatingMargin: 17.1,
      netMargin: 14.1
    },
    // 2023 - Market leadership
    {
      year: 2023,
      revenue: 3950,
      netProfit: 580,
      operatingProfit: 710,
      grossProfit: 1975,
      grossMargin: 50.0,
      operatingMargin: 18.0,
      netMargin: 14.7
    }
  ],
  quarterlyData: []
};

export default function TrendArrowsDemo() {
  const [showTrendArrows, setShowTrendArrows] = useState(true);
  const [trendPeriod, setTrendPeriod] = useState(4);
  const [showMovingAverages, setShowMovingAverages] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Task 8.7: Trend Direction Arrows & Annotations Demo
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Interactive demonstration of margin trend analysis with directional arrows, strength indicators, 
            velocity calculations, and comprehensive trend annotations for Emami Limited (10-year dataset).
          </p>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl mb-2">📈</div>
              <div className="text-sm font-medium text-gray-900">Trend Arrows</div>
              <div className="text-xs text-gray-600">Directional indicators</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium text-gray-900">Strength Analysis</div>
              <div className="text-xs text-gray-600">Trend confidence</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sm font-medium text-gray-900">Velocity Metrics</div>
              <div className="text-xs text-gray-600">Rate of change</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl mb-2">🔮</div>
              <div className="text-sm font-medium text-gray-900">Projections</div>
              <div className="text-xs text-gray-600">Next period forecast</div>
            </div>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Interactive Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showTrendArrows}
                  onChange={(e) => setShowTrendArrows(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">Show Trend Arrows</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trend Period
              </label>
              <select
                value={trendPeriod}
                onChange={(e) => setTrendPeriod(Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 text-sm"
              >
                <option value={3}>3 periods</option>
                <option value={4}>4 periods</option>
                <option value={5}>5 periods</option>
                <option value={6}>6 periods</option>
              </select>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showMovingAverages}
                  onChange={(e) => setShowMovingAverages(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">+ Moving Averages</span>
              </label>
            </div>
          </div>
        </div>

        {/* Main Demo */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Trend Analysis with Arrows</h3>
              <p className="text-sm text-gray-600 mt-1">
                {trendPeriod}-period trend analysis with directional arrows and comprehensive annotations
              </p>
            </div>
            <div className="p-6">
              <MarginsTimeline
                data={sampleCompanyData}
                showTrendArrows={showTrendArrows}
                trendPeriod={trendPeriod}
                trendArrowConfig={{
                  size: 'medium',
                  style: 'normal',
                  showLabels: true
                }}
                showMovingAverages={showMovingAverages}
                movingAveragePeriods={[3, 5]}
                viewMode="annual"
              />
            </div>
          </div>
        </div>

        {/* Technical Features */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Trend Analysis Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Core Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Directional arrows (↗ ↘ →) for each margin type</li>
                <li>• Trend strength classification (Strong/Moderate/Weak)</li>
                <li>• Velocity calculations (rate of change per period)</li>
                <li>• R² goodness of fit for trend confidence</li>
                <li>• Duration and consistency tracking</li>
                <li>• Next period projections</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Advanced Analytics</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Reversal detection and warnings</li>
                <li>• Cross-margin correlation analysis</li>
                <li>• Significance testing and confidence levels</li>
                <li>• Momentum indicators (strength + velocity)</li>
                <li>• Integration with moving averages</li>
                <li>• Configurable analysis periods</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Real-World Application */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Real-World Analysis Example</h2>
          <div className="prose text-sm text-gray-600">
            <p className="mb-3">
              <strong>Emami Limited Trend Analysis (2014-2023):</strong>
            </p>
            <ul className="space-y-1 mb-4">
              <li>• <strong>Gross Margin:</strong> Stable at 50% showing strong pricing power and cost control</li>
              <li>• <strong>Operating Margin:</strong> Strong upward trend from 14.5% to 18.0% indicating operational efficiency gains</li>
              <li>• <strong>Net Margin:</strong> Consistent improvement from 11.4% to 14.7% reflecting overall profitability enhancement</li>
            </ul>
            <p className="mb-3">
              <strong>Key Insights from Trend Arrows:</strong>
            </p>
            <ul className="space-y-1">
              <li>• Operating margin shows the strongest trend with high confidence (R² > 0.7)</li>
              <li>• Net margin follows operating margin trends with moderate correlation</li>
              <li>• Gross margin stability suggests strong market positioning</li>
              <li>• Recent momentum indicates continued margin expansion potential</li>
            </ul>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <a 
            href="/demo/stability-indicators" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Previous: Stability Indicators
          </a>
          <a 
            href="/demo/margins-timeline" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Margins Timeline →
          </a>
        </div>
      </div>
    </div>
  );
} 