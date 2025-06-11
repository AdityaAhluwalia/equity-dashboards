'use client';

import { QuarterlyMargins } from '@/components/margins/QuarterlyMargins';
import type { Company } from '@/types/ui.types';

// Sample data inspired by Emami Limited with enhanced quarterly patterns
const sampleData = {
  company: {
    id: 'emami-limited',
    name: 'Emami Limited',
    sector: 'Consumer Goods',
    marketCap: 5000,
    currentPhase: 'expansion',
  } as Company,
  quarterlyData: [
    // FY 2022-23 - Showing clear seasonal patterns
    { quarter: 'Q1 2023', year: 2023, quarter_number: 1, revenue: 850, netProfit: 85, operatingProfit: 153, grossProfit: 425, operatingMargin: 18.0, netMargin: 10.0, grossMargin: 50.0 },
    { quarter: 'Q2 2023', year: 2023, quarter_number: 2, revenue: 920, netProfit: 101, operatingProfit: 166, grossProfit: 460, operatingMargin: 18.0, netMargin: 11.0, grossMargin: 50.0 },
    { quarter: 'Q3 2023', year: 2023, quarter_number: 3, revenue: 900, netProfit: 99, operatingProfit: 162, grossProfit: 450, operatingMargin: 18.0, netMargin: 11.0, grossMargin: 50.0 },
    { quarter: 'Q4 2023', year: 2023, quarter_number: 4, revenue: 1050, netProfit: 126, operatingProfit: 189, grossProfit: 525, operatingMargin: 18.0, netMargin: 12.0, grossMargin: 50.0 },
    
    // FY 2023-24 - Continuing the seasonal pattern with growth
    { quarter: 'Q1 2024', year: 2024, quarter_number: 1, revenue: 890, netProfit: 89, operatingProfit: 160, grossProfit: 445, operatingMargin: 18.0, netMargin: 10.0, grossMargin: 50.0 },
    { quarter: 'Q2 2024', year: 2024, quarter_number: 2, revenue: 980, netProfit: 108, operatingProfit: 176, grossProfit: 490, operatingMargin: 18.0, netMargin: 11.0, grossMargin: 50.0 },
    { quarter: 'Q3 2024', year: 2024, quarter_number: 3, revenue: 950, netProfit: 105, operatingProfit: 171, grossProfit: 475, operatingMargin: 18.0, netMargin: 11.0, grossMargin: 50.0 },
    { quarter: 'Q4 2024', year: 2024, quarter_number: 4, revenue: 1150, netProfit: 138, operatingProfit: 207, grossProfit: 575, operatingMargin: 18.0, netMargin: 12.0, grossMargin: 50.0 },
    
    // Recent quarters showing continued growth
    { quarter: 'Q1 2025', year: 2025, quarter_number: 1, revenue: 920, netProfit: 92, operatingProfit: 166, grossProfit: 460, operatingMargin: 18.0, netMargin: 10.0, grossMargin: 50.0 },
    { quarter: 'Q2 2025', year: 2025, quarter_number: 2, revenue: 1020, netProfit: 112, operatingProfit: 184, grossProfit: 510, operatingMargin: 18.0, netMargin: 11.0, grossMargin: 50.0 },
  ],
};

export default function QuarterlyMarginsDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Quarterly Margins Analysis Demo
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Advanced quarterly margin analysis with seasonal pattern detection, 
            QoQ/YoY comparisons, and volatility indicators
          </p>
          
          {/* Features Overview */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">🔍 Seasonal Detection</h3>
              <p className="text-sm text-gray-600">
                Automatically identifies peak quarters and seasonal consistency patterns
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">📈 QoQ/YoY Analysis</h3>
              <p className="text-sm text-gray-600">
                Quarter-over-quarter and year-over-year growth comparisons
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">📊 Multi-line Charts</h3>
              <p className="text-sm text-gray-600">
                Gross, operating, and net margin trends with interactive tooltips
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">🎯 Performance Insights</h3>
              <p className="text-sm text-gray-600">
                Best/worst quarters, volatility analysis, and pattern recognition
              </p>
            </div>
          </div>
        </div>

        {/* Basic QuarterlyMargins Demo */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Default View - Last 8 Quarters
          </h2>
          <QuarterlyMargins data={sampleData} />
        </div>

        {/* Extended View with Average Bands */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Extended View - 12 Quarters with Average Bands
          </h2>
          <QuarterlyMargins 
            data={sampleData} 
            quartersToShow={12}
            showAverageBands={true}
          />
        </div>

        {/* Analysis Summary */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Key Features Demonstrated
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🔄 Seasonal Pattern Analysis</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Q4 Peak Detection:</strong> Automatically identifies Q4 as peak season</li>
                <li>• <strong>Pattern Consistency:</strong> Measures seasonal reliability (high/medium/low)</li>
                <li>• <strong>Margin Averages:</strong> Calculates quarter-specific historical averages</li>
                <li>• <strong>Peak Indicators:</strong> Visual highlighting of seasonal peaks</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 Advanced Analytics</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>QoQ Growth:</strong> Quarter-over-quarter margin changes</li>
                <li>• <strong>YoY Comparison:</strong> Same quarter previous year analysis</li>
                <li>• <strong>Volatility Metrics:</strong> Standard deviation of margin fluctuations</li>
                <li>• <strong>Best/Worst Quarters:</strong> Performance extremes identification</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <h4 className="font-semibold text-amber-800 mb-2">💡 Seasonal Insights</h4>
            <p className="text-amber-700 text-sm">
              The demo data shows a clear Q4 seasonal pattern typical of consumer goods companies, 
              with consistently higher margins during festival/holiday seasons. This pattern helps 
              investors understand business cyclicality and plan for seasonal variations.
            </p>
          </div>
        </div>

        {/* Technical Notes */}
        <div className="mt-8 bg-gray-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Implementation</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <strong>Apple UI Design:</strong> Clean white cards, rounded corners, subtle shadows
            </div>
            <div>
              <strong>Responsive Charts:</strong> Recharts with 320px height, interactive tooltips
            </div>
            <div>
              <strong>Smart Analytics:</strong> Automatic pattern detection, performance scoring
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 