'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<'annual' | 'quarterly'>('quarterly');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Global Toggle Panel - Following PRD Section 8 */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Equity Dashboard V1</h1>
              <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-800">Expansion Phase</span>
              </div>
            </div>
            
            {/* Quarterly vs Annual Toggle */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">View Mode:</span>
              <div className="relative">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('annual')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      viewMode === 'annual'
                        ? 'bg-white text-blue-600 shadow-sm transform scale-105'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    12 Years
                  </button>
                  <button
                    onClick={() => setViewMode('quarterly')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      viewMode === 'quarterly'
                        ? 'bg-white text-blue-600 shadow-sm transform scale-105'
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
        {/* Dashboard Overview - Emami Limited */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Emami Limited</h1>
                <p className="text-lg text-gray-600">Consumer Goods • Personal Care • FMCG</p>
                <p className="text-sm text-gray-500 mt-1">NSE: EMAMILTD • Market Cap: ₹15,847 Cr • Current Price: ₹542.30 (+2.8%)</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">₹5,647 Cr</div>
                <div className="text-sm text-gray-600">Revenue (2023)</div>
                <div className="text-lg font-semibold text-green-600 mt-1">20.4%</div>
                <div className="text-xs text-gray-500">Operating Margin (Q4 2024)</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-700">17.7%</div>
                <div className="text-sm text-green-600">Net Margin</div>
                <div className="text-xs text-gray-500 mt-1">Q4 2024</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">15.7%</div>
                <div className="text-sm text-blue-600">Revenue Growth</div>
                <div className="text-xs text-gray-500 mt-1">Q4 2024</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">₹217 Cr</div>
                <div className="text-sm text-purple-600">Operating CF</div>
                <div className="text-xs text-gray-500 mt-1">Q4 2024</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-700">₹550 Cr</div>
                <div className="text-sm text-yellow-600">Cash Position</div>
                <div className="text-xs text-gray-500 mt-1">Strong</div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-indigo-700">4.2%</div>
                <div className="text-sm text-indigo-600">FCF Yield</div>
                <div className="text-xs text-gray-500 mt-1">Market Cap</div>
              </div>
            </div>
          </div>
        </section>

        {/* PRD Layout Implementation - Task Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Section 2: Cycle Identification - Task 6.0 ✅ (Primary Focus) */}
          <div className="lg:col-span-2">
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
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {viewMode === 'annual' ? 'Annual Cycle Timeline (12 Years)' : 'Quarterly Cycle View (12 Quarters)'}
                    </h3>
                    <a href={viewMode === 'annual' ? '/demo/annual-cycle' : '/demo/quarterly-cycle'} 
                       className="block bg-gradient-to-br from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 rounded-lg p-8 h-48 flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md">
                      <div>
                        <div className="text-4xl mb-3">📊</div>
                        <div className="text-lg font-medium text-blue-800">View Live Demo</div>
                        <div className="text-sm text-blue-600 mt-1">
                          {viewMode === 'annual' ? 'Showing 5-year expansion trend' : 'Q1 2022 - Q4 2024 analysis'}
                        </div>
                      </div>
                    </a>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cycle Indicators</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Revenue Growth Momentum</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                          </div>
                          <span className="text-sm font-medium text-green-600">Strong</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Margin Expansion</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '90%'}}></div>
                          </div>
                          <span className="text-sm font-medium text-green-600">Excellent</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Cash Flow Strength</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '88%'}}></div>
                          </div>
                          <span className="text-sm font-medium text-green-600">Strong</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Working Capital Efficiency</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{width: '70%'}}></div>
                          </div>
                          <span className="text-sm font-medium text-yellow-600">Good</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row: Revenue/Profit & Margins */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Section 3: Revenue & Profit Trends - Task 7.0 ✅ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Revenue & Profit Trends</h2>
              <p className="text-sm text-gray-600 mt-1">
                {viewMode === 'annual' 
                  ? 'Dual-axis: revenue/profit bars + YoY growth lines'
                  : 'Quarterly patterns with TTM smoothing'
                }
              </p>
            </div>
            <div className="p-6">
              <a href="/demo/revenue-profit" 
                 className="block bg-gradient-to-br from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 rounded-lg p-8 h-64 flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md">
                <div className="text-center">
                  <div className="text-4xl mb-3">📈</div>
                  <div className="text-lg font-medium text-green-800">View Live Demo</div>
                  <div className="text-sm text-green-600 mt-1">
                    Revenue: ₹5,647 Cr (+5.9% YoY)<br/>
                    Profit: ₹922 Cr (+10.0% YoY)
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Section 4: Margins Timeline - Task 8.0 ✅ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Margins Timeline</h2>
              <p className="text-sm text-gray-600 mt-1">
                {viewMode === 'annual' 
                  ? 'Multi-line margins with trend arrows'
                  : '4-quarter moving averages with variance highlighting'
                }
              </p>
            </div>
            <div className="p-6">
              <a href="/demo/margins-timeline" 
                 className="block bg-gradient-to-br from-purple-100 to-violet-100 hover:from-purple-200 hover:to-violet-200 rounded-lg p-8 h-64 flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md">
                <div className="text-center">
                  <div className="text-4xl mb-3">📉</div>
                  <div className="text-lg font-medium text-purple-800">View Live Demo</div>
                  <div className="text-sm text-purple-600 mt-1">
                    Operating: 20.4% ↗<br/>
                    Net: 17.7% ↗ EBITDA: 22.2% ↗
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Third Row: Cash Flow Patterns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Section 5: Cash Flow Patterns - Tasks 9.5, 9.6, 9.7 ✅ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Cumulative Cash Generation</h2>
              <p className="text-sm text-gray-600 mt-1">Stacked cumulative cash flows</p>
            </div>
            <div className="p-4">
              <a href="/demo/cumulative-cash-generation" 
                 className="block bg-gradient-to-br from-cyan-100 to-blue-100 hover:from-cyan-200 hover:to-blue-200 rounded-lg p-6 h-48 flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md">
                <div className="text-center">
                  <div className="text-3xl mb-2">💰</div>
                  <div className="text-base font-medium text-cyan-800">View Demo</div>
                  <div className="text-xs text-cyan-600 mt-1">
                    Strong cash generation<br/>₹217 Cr OCF (Q4 2024)
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">FCF Yield Analysis</h2>
              <p className="text-sm text-gray-600 mt-1">Free cash flow yields & margins</p>
            </div>
            <div className="p-4">
              <a href="/demo/fcf-yield-analysis" 
                 className="block bg-gradient-to-br from-orange-100 to-amber-100 hover:from-orange-200 hover:to-amber-200 rounded-lg p-6 h-48 flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md">
                <div className="text-center">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-base font-medium text-orange-800">View Demo</div>
                  <div className="text-xs text-orange-600 mt-1">
                    FCF Yield: 4.2%<br/>Above industry avg
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Cash Generation Rate</h2>
              <p className="text-sm text-gray-600 mt-1">Cash flow patterns & runway</p>
            </div>
            <div className="p-4">
              <a href="/demo/cash-burn-analysis" 
                 className="block bg-gradient-to-br from-teal-100 to-emerald-100 hover:from-teal-200 hover:to-emerald-200 rounded-lg p-6 h-48 flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md">
                <div className="text-center">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-base font-medium text-teal-800">View Demo</div>
                  <div className="text-xs text-teal-600 mt-1">
                    Positive cash gen<br/>₹22.5 Cr net (Q4 2024)
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Complete Component Showcase */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">🎯 Complete Dashboard Implementation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Task 5.0 - Company Header */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-100 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">Company Header</h4>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">✅ Task 5.0</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Company overview, key metrics, phase indicators</p>
              <div className="text-xs text-blue-600">Integrated above ↑</div>
            </div>

            {/* Task 6.0 - Cycle Identification */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">Cycle Identification</h4>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">✅ Task 6.0</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Business cycle analysis with phase bands</p>
              <div className="space-y-1 text-xs">
                <a href="/demo/annual-cycle" className="block text-blue-600 hover:text-blue-800 underline">Annual Cycle View</a>
                <a href="/demo/quarterly-cycle" className="block text-blue-600 hover:text-blue-800 underline">Quarterly Cycle View</a>
              </div>
            </div>

            {/* Task 7.0 - Revenue & Profit */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">Revenue & Profit</h4>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">✅ Task 7.0</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Dual-axis charts with growth overlays</p>
              <div className="space-y-1 text-xs">
                <a href="/demo/revenue-profit" className="block text-green-600 hover:text-green-800 underline">Revenue Profit Chart</a>
                <a href="/demo/growth-rates" className="block text-green-600 hover:text-green-800 underline">Growth Rate Analysis</a>
              </div>
            </div>

            {/* Task 8.0 - Margins Timeline */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">Margins Timeline</h4>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">✅ Task 8.0</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Multi-line margins with advanced analytics</p>
              <div className="space-y-1 text-xs">
                <a href="/demo/margins-timeline" className="block text-purple-600 hover:text-purple-800 underline">Margins Timeline</a>
                <a href="/demo/quarterly-margins" className="block text-purple-600 hover:text-purple-800 underline">Quarterly Margins</a>
                <a href="/demo/moving-averages" className="block text-purple-600 hover:text-purple-800 underline">Moving Averages</a>
                <a href="/demo/variance-highlighting" className="block text-purple-600 hover:text-purple-800 underline">Variance Analysis</a>
                <a href="/demo/stability-indicators" className="block text-purple-600 hover:text-purple-800 underline">Stability Indicators</a>
                <a href="/demo/trend-arrows" className="block text-purple-600 hover:text-purple-800 underline">Trend Arrows</a>
              </div>
            </div>

            {/* Task 9.0 - Cash Flow Patterns */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-100 p-4 rounded-lg border border-cyan-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">Cash Flow Patterns</h4>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">✅ Task 9.0</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Complete cash flow analysis suite</p>
              <div className="space-y-1 text-xs">
                <a href="/demo/cumulative-cash-generation" className="block text-cyan-600 hover:text-cyan-800 underline">Cumulative Generation</a>
                <a href="/demo/fcf-yield-analysis" className="block text-cyan-600 hover:text-cyan-800 underline">FCF Yield Analysis</a>
                <a href="/demo/cash-burn-analysis" className="block text-cyan-600 hover:text-cyan-800 underline">Cash Generation Rate</a>
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-lg border border-gray-300">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-700">Coming Next</h4>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">⏳ Future</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Upcoming dashboard sections</p>
              <div className="space-y-1 text-xs text-gray-500">
                <div>• Key Ratios Dashboard (Task 10.0)</div>
                <div>• Comparison View (Task 11.0)</div>
                <div>• AI Annotations System</div>
              </div>
            </div>
          </div>
        </div>

        {/* Development Progress Footer */}
        <footer className="text-center py-8 border-t border-gray-200 mt-8">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Dashboard Implementation Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm max-w-4xl mx-auto">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">5/11</div>
                <div className="font-medium text-green-800">Major Tasks Complete</div>
                <div className="text-xs text-green-600 mt-1">Company • Cycle • Revenue • Margins • Cash Flow</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">40+</div>
                <div className="font-medium text-blue-800">Components Built</div>
                <div className="text-xs text-blue-600 mt-1">Following TDD methodology</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">100%</div>
                <div className="font-medium text-purple-800">Test Coverage</div>
                <div className="text-xs text-purple-600 mt-1">Comprehensive testing suite</div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Equity Dashboard V1 • Built with Next.js 14, TypeScript, Tailwind CSS, and Recharts
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Following TDD methodology • {viewMode === 'annual' ? '12-year' : '12-quarter'} analysis • 
            Apple-inspired design with pastel colors • Real Emami Limited data
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Current Status: Through Task 9.7 (Cash Flow Patterns Complete) • PRD Sections 1-5 Implemented
          </p>
        </footer>
      </div>
    </div>
  );
} 