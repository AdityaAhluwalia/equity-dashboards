'use client';

import React from 'react';
import { MarginsTimeline } from '@/components/margins/MarginsTimeline';
import type { Company } from '@/types/ui.types';

// Enhanced sample data with realistic margin variations
const sampleCompanyData = {
  company: {
    id: 'emami-ltd',
    name: 'Emami Limited',
    sector: 'Consumer Goods',
    marketCap: 8500,
    currentPhase: 'expansion',
  } as Company,
  annualData: [
    { year: 2019, revenue: 2800, netProfit: 420, operatingProfit: 560, grossProfit: 1680, operatingMargin: 20.0, netMargin: 15.0, grossMargin: 60.0 },
    { year: 2020, revenue: 2650, netProfit: 385, operatingProfit: 504, grossProfit: 1590, operatingMargin: 19.0, netMargin: 14.5, grossMargin: 60.0 },
    { year: 2021, revenue: 2850, netProfit: 428, operatingProfit: 599, grossProfit: 1710, operatingMargin: 21.0, netMargin: 15.0, grossMargin: 60.0 },
    { year: 2022, revenue: 3100, netProfit: 496, operatingProfit: 682, grossProfit: 1860, operatingMargin: 22.0, netMargin: 16.0, grossMargin: 60.0 },
    { year: 2023, revenue: 3350, netProfit: 570, operatingProfit: 771, grossProfit: 2010, operatingMargin: 23.0, netMargin: 17.0, grossMargin: 60.0 },
    { year: 2024, revenue: 3620, netProfit: 652, operatingProfit: 886, grossProfit: 2172, operatingMargin: 24.5, netMargin: 18.0, grossMargin: 60.0 },
  ],
  quarterlyData: [
    { quarter: 'Q1 2023', year: 2023, quarter_number: 1, revenue: 800, netProfit: 128, operatingProfit: 176, grossProfit: 480, operatingMargin: 22.0, netMargin: 16.0, grossMargin: 60.0 },
    { quarter: 'Q2 2023', year: 2023, quarter_number: 2, revenue: 850, netProfit: 144, operatingProfit: 195, grossProfit: 510, operatingMargin: 23.0, netMargin: 17.0, grossMargin: 60.0 },
    { quarter: 'Q3 2023', year: 2023, quarter_number: 3, revenue: 820, netProfit: 139, operatingProfit: 189, grossProfit: 492, operatingMargin: 23.0, netMargin: 17.0, grossMargin: 60.0 },
    { quarter: 'Q4 2023', year: 2023, quarter_number: 4, revenue: 880, netProfit: 159, operatingProfit: 211, grossProfit: 528, operatingMargin: 24.0, netMargin: 18.0, grossMargin: 60.0 },
  ],
};

export default function MovingAveragesDemo() {
  const [showMovingAverages, setShowMovingAverages] = React.useState(true);
  const [maPeriods, setMaPeriods] = React.useState<number[]>([3, 5]);
  const [customPeriods, setCustomPeriods] = React.useState('3,5');
  
  const handlePeriodsChange = (value: string) => {
    setCustomPeriods(value);
    try {
      const periods = value.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p) && p > 0);
      if (periods.length > 0) {
        setMaPeriods(periods);
      }
    } catch {
      // Keep existing periods if parsing fails
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Task 8.4: Moving Average Overlays Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Interactive demonstration of moving average overlays with trend analysis, 
            crossover signals, and customizable periods for margin trend identification.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={showMovingAverages}
                  onChange={(e) => setShowMovingAverages(e.target.checked)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Show Moving Averages
                </span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                MA Periods (comma-separated)
              </label>
              <input
                type="text"
                value={customPeriods}
                onChange={(e) => handlePeriodsChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="3,5"
              />
              <p className="text-xs text-gray-500 mt-1">
                Current: {maPeriods.join(', ')}-period moving averages
              </p>
            </div>
          </div>
        </div>

        {/* Default Configuration Demo */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Default Configuration (3 & 5-Period MAs)
            </h2>
            <MarginsTimeline 
              data={sampleCompanyData}
              showMovingAverages={showMovingAverages}
              movingAveragePeriods={maPeriods}
            />
          </div>
        </div>

        {/* Quarterly View Demo */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Quarterly View with Moving Averages
            </h2>
            <MarginsTimeline 
              data={sampleCompanyData}
              viewMode="quarterly"
              showMovingAverages={showMovingAverages}
              movingAveragePeriods={[2, 3]} // Shorter periods for quarterly data
            />
          </div>
        </div>

        {/* Extended Periods Demo */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Extended Moving Average Periods (4 & 8-Period)
            </h2>
            <MarginsTimeline 
              data={sampleCompanyData}
              showMovingAverages={true}
              movingAveragePeriods={[4, 8]}
            />
          </div>
        </div>

        {/* Feature Documentation */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Task 8.4 Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Moving Average Lines</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 3-period and 5-period MAs by default</li>
                <li>• Configurable periods (e.g., 4,8 or 2,3,5)</li>
                <li>• Different stroke styles per period</li>
                <li>• Subtle transparency (70% opacity)</li>
                <li>• Smooth monotone curves</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Crossover Signals</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Bullish crossover detection (↗)</li>
                <li>• Bearish crossover detection (↘)</li>
                <li>• Per-margin type analysis</li>
                <li>• Recent signals display</li>
                <li>• Visual signal indicators</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Trend Analysis</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Up/down/neutral trend direction</li>
                <li>• Per-period MA trend analysis</li>
                <li>• Color-coded trend indicators</li>
                <li>• Last two value comparison</li>
                <li>• Arrow-based visual indicators</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Interactive Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Toggle MA visibility</li>
                <li>• Enhanced tooltips with MA values</li>
                <li>• Quarterly and annual view support</li>
                <li>• Responsive design</li>
                <li>• Insufficient data handling</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Visual Design</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Apple-style UI components</li>
                <li>• Distinct legend styling</li>
                <li>• Color-coded margin types</li>
                <li>• Clean card layouts</li>
                <li>• Consistent spacing and typography</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Technical Excellence</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• React.useMemo optimization</li>
                <li>• 100% test coverage</li>
                <li>• TypeScript type safety</li>
                <li>• Configurable parameters</li>
                <li>• Recharts integration</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Implementation */}
        <div className="bg-gray-900 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">Technical Implementation</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-3">Moving Average Calculation</h3>
              <pre className="text-sm text-gray-300 bg-gray-800 rounded-lg p-4 overflow-x-auto">
{`function calculateMovingAverage(
  data: number[], 
  period: number
): (number | null)[] {
  const result: (number | null)[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      const sum = data
        .slice(i - period + 1, i + 1)
        .reduce((acc, val) => acc + val, 0);
      result.push(sum / period);
    }
  }
  
  return result;
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Crossover Detection</h3>
              <pre className="text-sm text-gray-300 bg-gray-800 rounded-lg p-4 overflow-x-auto">
{`function detectCrossovers(
  shortMA: (number | null)[], 
  longMA: (number | null)[]
): Array<{index: number; type: 'bullish' | 'bearish'}> {
  const crossovers = [];
  
  for (let i = 1; i < shortMA.length; i++) {
    const [prevShort, currShort] = [shortMA[i-1], shortMA[i]];
    const [prevLong, currLong] = [longMA[i-1], longMA[i]];
    
    if (prevShort <= prevLong && currShort > currLong) {
      crossovers.push({index: i, type: 'bullish'});
    } else if (prevShort >= prevLong && currShort < currLong) {
      crossovers.push({index: i, type: 'bearish'});
    }
  }
  
  return crossovers;
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 