'use client';

import { MarginsTimeline } from '@/components/margins/MarginsTimeline';
import type { Company } from '@/types/ui.types';

const demoCompany: Company = {
  id: 'emami-demo',
  name: 'Emami Limited',
  sector: 'Consumer Goods',
  industry: 'Personal Care',
  market_cap: 8500,
  marketCap: 8500,
  exchange: 'NSE',
  currentPhase: 'expansion',
  currentPrice: 425.75,
  priceChange: 2.1,
  companyType: 'non-finance',
  description: 'Leading Indian FMCG company focused on personal care and healthcare products.',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

const demoData = {
  company: demoCompany,
  annualData: [
    { year: 2019, revenue: 2845, netProfit: 285, operatingProfit: 456, grossProfit: 1422, operatingMargin: 16.0, netMargin: 10.0, grossMargin: 50.0 },
    { year: 2020, revenue: 3021, netProfit: 302, operatingProfit: 514, grossProfit: 1510, operatingMargin: 17.0, netMargin: 10.0, grossMargin: 50.0 },
    { year: 2021, revenue: 3156, netProfit: 347, operatingProfit: 568, grossProfit: 1578, operatingMargin: 18.0, netMargin: 11.0, grossMargin: 50.0 },
    { year: 2022, revenue: 3412, netProfit: 375, operatingProfit: 614, grossProfit: 1706, operatingMargin: 18.0, netMargin: 11.0, grossMargin: 50.0 },
    { year: 2023, revenue: 3598, netProfit: 396, operatingProfit: 647, grossProfit: 1799, operatingMargin: 18.0, netMargin: 11.0, grossMargin: 50.0 },
  ],
  quarterlyData: [
    { quarter: 'Q1 2023', year: 2023, quarter_number: 1, revenue: 850, netProfit: 85, operatingProfit: 153, grossProfit: 425, operatingMargin: 18.0, netMargin: 10.0, grossMargin: 50.0 },
    { quarter: 'Q2 2023', year: 2023, quarter_number: 2, revenue: 920, netProfit: 101, operatingProfit: 166, grossProfit: 460, operatingMargin: 18.0, netMargin: 11.0, grossMargin: 50.0 },
    { quarter: 'Q3 2023', year: 2023, quarter_number: 3, revenue: 900, netProfit: 99, operatingProfit: 162, grossProfit: 450, operatingMargin: 18.0, netMargin: 11.0, grossMargin: 50.0 },
    { quarter: 'Q4 2023', year: 2023, quarter_number: 4, revenue: 928, netProfit: 111, operatingProfit: 167, grossProfit: 464, operatingMargin: 18.0, netMargin: 12.0, grossMargin: 50.0 },
  ],
};

export default function MarginsTimelineDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Margins Timeline Demo</h1>
          <p className="text-gray-600">Tasks 8.1 & 8.2 - Multi-line margins with normal range shading</p>
        </div>

        {/* Annual View - Basic */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Annual View - Basic Margins</h2>
          <MarginsTimeline data={demoData} viewMode="annual" />
        </div>

        {/* Annual View - With Range Shading */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Annual View - With Normal Range Shading ✨</h2>
          <p className="text-sm text-gray-600">Shows performance context with colored background ranges and performance indicators</p>
          <MarginsTimeline data={demoData} viewMode="annual" showNormalRanges={true} />
        </div>

        {/* Quarterly View - With Custom Industry Ranges */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Quarterly View - Custom Industry Ranges</h2>
          <p className="text-sm text-gray-600">Using FMCG industry-specific range benchmarks</p>
          <MarginsTimeline 
            data={demoData} 
            viewMode="quarterly" 
            showNormalRanges={true}
            industryRanges={{
              grossMargin: { min: 45, max: 65, industry: 'FMCG' },
              operatingMargin: { min: 15, max: 25, industry: 'FMCG' },
              netMargin: { min: 8, max: 18, industry: 'FMCG' },
            }}
          />
        </div>

        {/* Feature Highlights */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">✨ Key Features</h3>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">🎨 Apple-Style Design</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Clean white backgrounds</li>
                <li>• Subtle shadows and borders</li>
                <li>• Rounded corners (16px)</li>
                <li>• System fonts</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">📊 Multi-line Display</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Gross Margin (Green)</li>
                <li>• Operating Margin (Blue)</li>
                <li>• Net Margin (Purple)</li>
                <li>• Smooth line curves</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">🎯 Normal Range Shading</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Background range zones</li>
                <li>• Performance indicators</li>
                <li>• Industry benchmarks</li>
                <li>• Sector-specific ranges</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">📱 Interactive Features</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Annual & quarterly views</li>
                <li>• Custom range tooltips</li>
                <li>• Performance badges</li>
                <li>• Mobile-optimized</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Performance Analysis */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Performance Analysis Features</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-800">🎯 Smart Range Detection</h4>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Automatic sector classification</li>
                <li>• Industry-specific benchmarks</li>
                <li>• Custom range overrides</li>
                <li>• Multi-sector support</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-800">🏆 Performance Scoring</h4>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Excellent/Good/Average/Poor ratings</li>
                <li>• Color-coded badges</li>
                <li>• Real-time calculations</li>
                <li>• Comparative analysis</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">🚀 Next: Task 8.3</h3>
          <p className="text-blue-700">QuarterlyMargins view - enhanced quarterly analysis with seasonal pattern detection</p>
        </div>
      </div>
    </div>
  );
} 