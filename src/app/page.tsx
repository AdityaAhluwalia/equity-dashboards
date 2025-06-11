'use client';

import { useState } from 'react';
import CompanyHeader from '@/components/company/CompanyHeader';
import PhaseIndicator from '@/components/company/PhaseIndicator';
import MetricCards from '@/components/company/MetricCards';
import CycleTimeline from '@/components/charts/CycleTimeline';
import AnnualCycleView from '@/components/charts/AnnualCycleView';
import QuarterlyCycleView from '@/components/charts/QuarterlyCycleView';
import CycleIndicatorsPanel from '@/components/charts/CycleIndicatorsPanel';
import { RevenueProfitChart } from '@/components/financials/RevenueProfitChart';
import { AbsoluteValuesChart } from '@/components/financials/AbsoluteValuesChart';
import { QuarterlyRevenueChart } from '@/components/financials/QuarterlyRevenueChart';
import { MarginsTimeline } from '@/components/margins/MarginsTimeline';
import { QuarterlyMargins } from '@/components/margins/QuarterlyMargins';

// Comprehensive Emami Limited dataset - production-ready sample data
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
    description: 'Leading FMCG company in India with strong brand portfolio including Fair & Handsome, Navratna, and BoroPlus',
    website: 'https://emamigroup.com',
    exchange: 'NSE',
    stockSymbol: 'EMAMILTD.NS',
    currentPhase: 'expansion' as const,
    companyType: 'non-finance' as const,
    marketCap: 15000,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  annualData: [
    {
      year: 2014,
      revenue: 2200,
      netProfit: 250,
      operatingProfit: 320,
      grossProfit: 1100,
      grossMargin: 50.0,
      operatingMargin: 14.5,
      netMargin: 11.4,
      assets: 2800,
      equity: 1800,
      debt: 600,
      cashFlow: 280,
      workingCapital: 450
    },
    {
      year: 2015,
      revenue: 2450,
      netProfit: 290,
      operatingProfit: 370,
      grossProfit: 1225,
      grossMargin: 50.0,
      operatingMargin: 15.1,
      netMargin: 11.8,
      assets: 3100,
      equity: 2000,
      debt: 650,
      cashFlow: 320,
      workingCapital: 480
    },
    {
      year: 2016,
      revenue: 2680,
      netProfit: 310,
      operatingProfit: 390,
      grossProfit: 1285,
      grossMargin: 47.9,
      operatingMargin: 14.6,
      netMargin: 11.6,
      assets: 3400,
      equity: 2200,
      debt: 700,
      cashFlow: 350,
      workingCapital: 500
    },
    {
      year: 2017,
      revenue: 2850,
      netProfit: 320,
      operatingProfit: 410,
      grossProfit: 1370,
      grossMargin: 48.1,
      operatingMargin: 14.4,
      netMargin: 11.2,
      assets: 3600,
      equity: 2300,
      debt: 750,
      cashFlow: 380,
      workingCapital: 520
    },
    {
      year: 2018,
      revenue: 3100,
      netProfit: 380,
      operatingProfit: 480,
      grossProfit: 1550,
      grossMargin: 50.0,
      operatingMargin: 15.5,
      netMargin: 12.3,
      assets: 3900,
      equity: 2500,
      debt: 800,
      cashFlow: 420,
      workingCapital: 580
    },
    {
      year: 2019,
      revenue: 3350,
      netProfit: 440,
      operatingProfit: 550,
      grossProfit: 1675,
      grossMargin: 50.0,
      operatingMargin: 16.4,
      netMargin: 13.1,
      assets: 4200,
      equity: 2700,
      debt: 850,
      cashFlow: 480,
      workingCapital: 620
    },
    {
      year: 2020,
      revenue: 3180,
      netProfit: 390,
      operatingProfit: 480,
      grossProfit: 1590,
      grossMargin: 50.0,
      operatingMargin: 15.1,
      netMargin: 12.3,
      assets: 4100,
      equity: 2650,
      debt: 800,
      cashFlow: 420,
      workingCapital: 580
    },
    {
      year: 2021,
      revenue: 3450,
      netProfit: 450,
      operatingProfit: 560,
      grossProfit: 1725,
      grossMargin: 50.0,
      operatingMargin: 16.2,
      netMargin: 13.0,
      assets: 4400,
      equity: 2800,
      debt: 850,
      cashFlow: 520,
      workingCapital: 650
    },
    {
      year: 2022,
      revenue: 3680,
      netProfit: 520,
      operatingProfit: 630,
      grossProfit: 1840,
      grossMargin: 50.0,
      operatingMargin: 17.1,
      netMargin: 14.1,
      assets: 4700,
      equity: 3000,
      debt: 900,
      cashFlow: 580,
      workingCapital: 720
    },
    {
      year: 2023,
      revenue: 3950,
      netProfit: 580,
      operatingProfit: 710,
      grossProfit: 1975,
      grossMargin: 50.0,
      operatingMargin: 18.0,
      netMargin: 14.7,
      assets: 5000,
      equity: 3200,
      debt: 950,
      cashFlow: 650,
      workingCapital: 800
    }
  ],
  quarterlyData: [
    // Q1 2023
    {
      quarter: 'Q1 2023',
      year: 2023,
      quarter_number: 1,
      revenue: 950,
      netProfit: 140,
      operatingProfit: 170,
      grossProfit: 475,
      grossMargin: 50.0,
      operatingMargin: 17.9,
      netMargin: 14.7
    },
    // Q2 2023
    {
      quarter: 'Q2 2023',
      year: 2023,
      quarter_number: 2,
      revenue: 980,
      netProfit: 145,
      operatingProfit: 176,
      grossProfit: 490,
      grossMargin: 50.0,
      operatingMargin: 18.0,
      netMargin: 14.8
    },
    // Q3 2023
    {
      quarter: 'Q3 2023',
      year: 2023,
      quarter_number: 3,
      revenue: 1000,
      netProfit: 148,
      operatingProfit: 180,
      grossProfit: 500,
      grossMargin: 50.0,
      operatingMargin: 18.0,
      netMargin: 14.8
    },
    // Q4 2023
    {
      quarter: 'Q4 2023',
      year: 2023,
      quarter_number: 4,
      revenue: 1020,
      netProfit: 147,
      operatingProfit: 184,
      grossProfit: 510,
      grossMargin: 50.0,
      operatingMargin: 18.0,
      netMargin: 14.4
    }
  ]
};

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<'annual' | 'quarterly'>('annual');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Toggle Panel - Following PRD Design */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Equity Dashboard V1</h1>
              <PhaseIndicator currentPhase={sampleCompanyData.company.currentPhase} />
            </div>
            
            {/* Quarterly vs Annual Toggle - Section 8 from PRD */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">View Mode:</span>
              <div className="relative">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('annual')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      viewMode === 'annual'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    12 Years
                  </button>
                  <button
                    onClick={() => setViewMode('quarterly')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      viewMode === 'quarterly'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    12 Quarters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section 1: Company Header - PRD Section 1 */}
        <section className="mb-8">
          <CompanyHeader company={sampleCompanyData.company} />
          <div className="mt-6">
            <MetricCards data={sampleCompanyData} />
          </div>
        </section>

        {/* Section 2: Cycle Identification Section - PRD Section 2 (Primary Focus) */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">⭐ Cycle Identification</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Primary focus: Business cycle analysis with colored phase bands
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Expansion</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Contraction</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Transition</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-8">
              {/* 2.1 Annual/Quarterly Cycle Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {viewMode === 'annual' ? 'Annual Cycle Timeline (12 Years)' : 'Quarterly Cycle View (12 Quarters)'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {viewMode === 'annual' 
                    ? 'Time series with colored background bands - Green (expansion), Red (contraction), Yellow (transition)'
                    : 'Granular quarterly phase identification with QoQ growth rate overlays'
                  }
                </p>
                {viewMode === 'annual' ? (
                  <AnnualCycleView data={sampleCompanyData} />
                ) : (
                  <QuarterlyCycleView data={sampleCompanyData} />
                )}
              </div>

              {/* 2.3 Cycle Indicators Panel */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cycle Indicators Panel</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Simple bar charts showing revenue growth momentum, margin expansion, cash flow strength - color-coded for quick phase identification
                </p>
                <CycleIndicatorsPanel data={sampleCompanyData} viewMode={viewMode} />
              </div>

              {/* Comprehensive Cycle Analysis */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Comprehensive Cycle Analysis</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Advanced cycle timeline with annotation markers for significant events
                </p>
                <CycleTimeline data={sampleCompanyData} viewMode={viewMode} />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Revenue & Profit Trends - PRD Section 3 */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Revenue & Profit Trends</h2>
              <p className="text-sm text-gray-600 mt-1">
                {viewMode === 'annual' 
                  ? 'Dual-axis time series with bars (revenue & profit) and lines (YoY growth rates) - CAGR indicators'
                  : 'Quarterly patterns with seasonal visibility and TTM (trailing twelve months) smoothing'
                }
              </p>
            </div>
            
            <div className="p-6 space-y-8">
              {/* 3.1 Annual/3.2 Quarterly View */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {viewMode === 'annual' ? 'Annual Revenue & Profit (12 Years)' : 'Quarterly Revenue & Profit (12 Quarters)'}
                </h3>
                {viewMode === 'annual' ? (
                  <RevenueProfitChart data={sampleCompanyData} />
                ) : (
                  <QuarterlyRevenueChart data={sampleCompanyData} />
                )}
              </div>

              {/* Absolute Values Analysis */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Absolute Values Analysis</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Bar charts for absolute revenue and profit values with growth rate overlays
                </p>
                <AbsoluteValuesChart data={sampleCompanyData} viewMode={viewMode} />
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Margins Timeline - PRD Section 4 */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Margins Timeline</h2>
              <p className="text-sm text-gray-600 mt-1">
                {viewMode === 'annual' 
                  ? 'Multi-line time series: OPM%, NPM%, EBITDA% with normal range shading and trend arrows'
                  : 'Quarterly margins with 4-quarter moving average overlay and variance highlighting'
                }
              </p>
            </div>
            
            <div className="p-6 space-y-8">
              {/* 4.1 Annual/4.2 Quarterly Margins */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {viewMode === 'annual' ? 'Annual Margins Analysis (12 Years)' : 'Quarterly Margins Analysis (12 Quarters)'}
                </h3>
                {viewMode === 'annual' ? (
                  <MarginsTimeline 
                    data={sampleCompanyData}
                    viewMode="annual"
                    showMovingAverages={true}
                    showVarianceHighlighting={true}
                    showStabilityIndicators={true}
                    showTrendArrows={true}
                  />
                ) : (
                  <QuarterlyMargins 
                    data={sampleCompanyData}
                    showMovingAverages={true}
                    showTrendAnalysis={true}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Sections Preview - Following PRD Structure */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300 p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Coming Next - Following PRD Design</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">5. Cash Flow Patterns</h3>
                  <p className="text-sm text-gray-600">
                    • Stacked bar chart: OCF, ICF, FCF<br/>
                    • Net cash flow line overlay<br/>
                    • Free cash flow yield % display
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">6. Key Ratios Dashboard</h3>
                  <p className="text-sm text-gray-600">
                    • Profitability: ROE, ROCE, ROA<br/>
                    • Valuation: P/E, P/B, EV/EBITDA<br/>
                    • Industry average comparisons
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">7. Comparison View</h3>
                  <p className="text-sm text-gray-600">
                    • Multi-line indexed performance<br/>
                    • Grouped bar growth comparisons<br/>
                    • Ratio comparison with sparklines
                  </p>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  <strong>Design Principles:</strong> Time series everywhere • Simple lines and bars only • 
                  Clear phase identification through colors • Easy comparisons with overlaid lines
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Navigation */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Component Demos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <a href="/demo/margins-timeline" className="bg-blue-50 hover:bg-blue-100 p-3 rounded-lg text-center transition-colors">
                <div className="text-sm font-medium text-blue-900">Margins Timeline</div>
                <div className="text-xs text-blue-600 mt-1">Task 8.0</div>
              </a>
              <a href="/demo/moving-averages" className="bg-green-50 hover:bg-green-100 p-3 rounded-lg text-center transition-colors">
                <div className="text-sm font-medium text-green-900">Moving Averages</div>
                <div className="text-xs text-green-600 mt-1">Task 8.4</div>
              </a>
              <a href="/demo/variance-highlighting" className="bg-purple-50 hover:bg-purple-100 p-3 rounded-lg text-center transition-colors">
                <div className="text-sm font-medium text-purple-900">Variance Analysis</div>
                <div className="text-xs text-purple-600 mt-1">Task 8.5</div>
              </a>
              <a href="/demo/stability-indicators" className="bg-yellow-50 hover:bg-yellow-100 p-3 rounded-lg text-center transition-colors">
                <div className="text-sm font-medium text-yellow-900">Stability Indicators</div>
                <div className="text-xs text-yellow-600 mt-1">Task 8.6</div>
              </a>
              <a href="/demo/trend-arrows" className="bg-indigo-50 hover:bg-indigo-100 p-3 rounded-lg text-center transition-colors">
                <div className="text-sm font-medium text-indigo-900">Trend Arrows</div>
                <div className="text-xs text-indigo-600 mt-1">Task 8.7</div>
              </a>
              <a href="/demo/quarterly-margins" className="bg-pink-50 hover:bg-pink-100 p-3 rounded-lg text-center transition-colors">
                <div className="text-sm font-medium text-pink-900">Quarterly Margins</div>
                <div className="text-xs text-pink-600 mt-1">Task 8.3</div>
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-200">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard Progress</h3>
            <div className="flex justify-center space-x-8 text-sm">
              <div className="text-green-600">✅ Company Header (5.0)</div>
              <div className="text-green-600">✅ Cycle Identification (6.0)</div>
              <div className="text-green-600">✅ Revenue & Profit (7.0)</div>
              <div className="text-green-600">✅ Margins Timeline (8.0)</div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Equity Dashboard V1 • Built with Next.js 14, TypeScript, Tailwind CSS, and Recharts
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Following TDD methodology • {viewMode === 'annual' ? '12-year' : '12-quarter'} analysis • 
            Apple-inspired design with pastel colors • Real Emami Limited data
          </p>
        </footer>
      </div>
    </div>
  );
}
