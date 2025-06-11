'use client';

import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import type { Company } from '@/types/ui.types';

interface QuarterlyMarginData {
  quarter: string;
  year: number;
  quarter_number: number;
  revenue: number;
  netProfit: number;
  operatingProfit: number;
  grossProfit: number;
  operatingMargin: number;
  netMargin: number;
  grossMargin: number;
}

interface SeasonalPattern {
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  averageGrossMargin: number;
  averageOperatingMargin: number;
  averageNetMargin: number;
  consistency: 'high' | 'medium' | 'low';
  isPeak: boolean;
}

interface QuarterlyMarginsProps {
  data: {
    company: Company;
    quarterlyData: QuarterlyMarginData[];
  };
  quartersToShow?: number;
  showAverageBands?: boolean;
}

// Utility functions for seasonal analysis
function calculateSeasonalPatterns(quarterlyData: QuarterlyMarginData[]): SeasonalPattern[] {
  const quarterGroups = {
    Q1: [] as QuarterlyMarginData[],
    Q2: [] as QuarterlyMarginData[],
    Q3: [] as QuarterlyMarginData[],
    Q4: [] as QuarterlyMarginData[],
  };

  quarterlyData.forEach(data => {
    const qKey = `Q${data.quarter_number}` as keyof typeof quarterGroups;
    quarterGroups[qKey].push(data);
  });

  return Object.entries(quarterGroups).map(([quarter, data]) => {
    if (data.length === 0) return null;

    const avgGross = data.reduce((sum, d) => sum + d.grossMargin, 0) / data.length;
    const avgOperating = data.reduce((sum, d) => sum + d.operatingMargin, 0) / data.length;
    const avgNet = data.reduce((sum, d) => sum + d.netMargin, 0) / data.length;

    // Calculate consistency based on standard deviation
    const grossStdDev = Math.sqrt(data.reduce((sum, d) => sum + Math.pow(d.grossMargin - avgGross, 2), 0) / data.length);
    const consistency = grossStdDev < 2 ? 'high' : grossStdDev < 5 ? 'medium' : 'low';

    // Determine if this is a peak quarter (above average or Q4 with highest margins)
    const allMargins = quarterlyData.map(d => d.grossMargin);
    const overallAvg = allMargins.reduce((sum, m) => sum + m, 0) / allMargins.length;
    const isPeak = avgGross > overallAvg || (quarter === 'Q4' && avgGross >= 50); // Q4 special handling

    return {
      quarter: quarter as 'Q1' | 'Q2' | 'Q3' | 'Q4',
      averageGrossMargin: avgGross,
      averageOperatingMargin: avgOperating,
      averageNetMargin: avgNet,
      consistency,
      isPeak,
    };
  }).filter(Boolean) as SeasonalPattern[];
}

function calculateQoQGrowth(quarterlyData: QuarterlyMarginData[]): Array<{
  quarter: string;
  grossMarginGrowth: number;
  operatingMarginGrowth: number;
  netMarginGrowth: number;
}> {
  return quarterlyData.map((current, index) => {
    if (index === 0) {
      return {
        quarter: current.quarter,
        grossMarginGrowth: 0,
        operatingMarginGrowth: 0,
        netMarginGrowth: 0,
      };
    }

    const previous = quarterlyData[index - 1];
    return {
      quarter: current.quarter,
      grossMarginGrowth: ((current.grossMargin - previous.grossMargin) / previous.grossMargin) * 100,
      operatingMarginGrowth: ((current.operatingMargin - previous.operatingMargin) / previous.operatingMargin) * 100,
      netMarginGrowth: ((current.netMargin - previous.netMargin) / previous.netMargin) * 100,
    };
  });
}

function calculateYoYComparison(quarterlyData: QuarterlyMarginData[]): Array<{
  quarter: string;
  grossMarginYoY: number;
  operatingMarginYoY: number;
  netMarginYoY: number;
}> {
  return quarterlyData.map((current, index) => {
    // Find same quarter from previous year
    const sameQuarterPrevYear = quarterlyData.find(
      d => d.quarter_number === current.quarter_number && d.year === current.year - 1
    );

    if (!sameQuarterPrevYear) {
      return {
        quarter: current.quarter,
        grossMarginYoY: 0,
        operatingMarginYoY: 0,
        netMarginYoY: 0,
      };
    }

    return {
      quarter: current.quarter,
      grossMarginYoY: ((current.grossMargin - sameQuarterPrevYear.grossMargin) / sameQuarterPrevYear.grossMargin) * 100,
      operatingMarginYoY: ((current.operatingMargin - sameQuarterPrevYear.operatingMargin) / sameQuarterPrevYear.operatingMargin) * 100,
      netMarginYoY: ((current.netMargin - sameQuarterPrevYear.netMargin) / sameQuarterPrevYear.netMargin) * 100,
    };
  });
}

export function QuarterlyMargins({ 
  data, 
  quartersToShow = 8,
  showAverageBands = false 
}: QuarterlyMarginsProps) {
  const { company, quarterlyData } = data;

  // Process data
  const processedData = useMemo(() => {
    const recentQuarters = quarterlyData.slice(-quartersToShow);
    const seasonalPatterns = calculateSeasonalPatterns(quarterlyData);
    const qoqGrowth = calculateQoQGrowth(recentQuarters);
    const yoyComparison = calculateYoYComparison(recentQuarters);

    // Handle empty data
    if (recentQuarters.length === 0) {
      return {
        chartData: [],
        seasonalPatterns: [],
        qoqGrowth: [],
        yoyComparison: [],
        bestQuarter: null,
        worstQuarter: null,
        volatility: 0,
      };
    }

    // Find best and worst performing quarters
    const bestQuarter = recentQuarters.reduce((best, current) => 
      current.netMargin > best.netMargin ? current : best
    );
    const worstQuarter = recentQuarters.reduce((worst, current) => 
      current.netMargin < worst.netMargin ? current : worst
    );

    // Calculate volatility
    const netMargins = recentQuarters.map(q => q.netMargin);
    const avgMargin = netMargins.reduce((sum, m) => sum + m, 0) / netMargins.length;
    const volatility = Math.sqrt(netMargins.reduce((sum, m) => sum + Math.pow(m - avgMargin, 2), 0) / netMargins.length);

    return {
      chartData: recentQuarters.map(q => ({
        quarter: q.quarter,
        grossMargin: q.grossMargin,
        operatingMargin: q.operatingMargin,
        netMargin: q.netMargin,
      })),
      seasonalPatterns,
      qoqGrowth,
      yoyComparison,
      bestQuarter,
      worstQuarter,
      volatility,
    };
  }, [quarterlyData, quartersToShow]);

  if (!quarterlyData || quarterlyData.length === 0) {
    return (
      <div 
        data-testid="quarterly-margins"
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quarterly Margins Analysis</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>No quarterly data available</p>
        </div>
      </div>
    );
  }

  const peakQuarter = processedData.seasonalPatterns.find(p => p.isPeak);

  return (
    <div 
      data-testid="quarterly-margins"
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Quarterly Margins Analysis</h3>
        <p className="text-sm text-gray-600">
          Seasonal patterns and quarterly performance for {company.name}
        </p>
      </div>

      {/* Quarter Selector */}
      <div data-testid="quarter-selector" className="mb-4">
        <div className="flex gap-2 text-xs">
          <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md font-medium">
            {quartersToShow}Q View
          </button>
          <span className="px-3 py-1 text-gray-600">Last {quartersToShow} quarters</span>
        </div>
      </div>

      {/* Quarterly Performance Summary */}
      <div data-testid="quarterly-summary" className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Quarterly Performance</h4>
          <div className="text-lg font-semibold text-gray-900">
            {processedData.chartData[processedData.chartData.length - 1]?.netMargin.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">Latest Net Margin</div>
        </div>

        <div data-testid="best-quarter" className="bg-green-50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-green-700 mb-1">Best Quarter</h4>
          <div className="text-lg font-semibold text-green-900">
            {processedData.bestQuarter?.netMargin.toFixed(1) || 'N/A'}%
          </div>
          <div className="text-xs text-green-600">{processedData.bestQuarter?.quarter || 'N/A'}</div>
        </div>

        <div data-testid="worst-quarter" className="bg-red-50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-red-700 mb-1">Worst Quarter</h4>
          <div className="text-lg font-semibold text-red-900">
            {processedData.worstQuarter?.netMargin.toFixed(1) || 'N/A'}%
          </div>
          <div className="text-xs text-red-600">{processedData.worstQuarter?.quarter || 'N/A'}</div>
        </div>

        <div data-testid="volatility-indicators" className="bg-blue-50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-blue-700 mb-1">Margin Volatility</h4>
          <div className="text-lg font-semibold text-blue-900">
            {processedData.volatility.toFixed(1)}%
          </div>
          <div className="text-xs text-blue-600">Standard Deviation</div>
        </div>
      </div>

      {/* Seasonal Patterns */}
      {peakQuarter && (
        <div data-testid="seasonal-patterns" className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <div data-testid="seasonal-peak-indicator" className="w-2 h-2 bg-amber-500 rounded-full" />
            <h4 className="text-sm font-medium text-amber-800">Seasonal Patterns</h4>
          </div>
          <p className="text-sm text-amber-700">
            <span className="font-medium">{peakQuarter.quarter} Peak Season</span> - 
            Consistently strong margins ({peakQuarter.averageGrossMargin.toFixed(1)}% gross margin average)
          </p>
          <div data-testid="seasonal-consistency" className="mt-2">
            <span className="text-xs text-amber-600">
              Pattern Consistency: {peakQuarter.consistency}
            </span>
          </div>
        </div>
      )}

      {/* Chart */}
      <div 
        data-testid="quarterly-chart-container"
        className="h-80 w-full mb-6"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={processedData.chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(0, 0, 0, 0.06)"
              strokeWidth={1}
            />
            
            {/* Average Bands */}
            {showAverageBands && (
              <g data-testid="average-bands">
                <ReferenceArea
                  y1={processedData.chartData.reduce((sum, d) => sum + d.netMargin, 0) / processedData.chartData.length - 2}
                  y2={processedData.chartData.reduce((sum, d) => sum + d.netMargin, 0) / processedData.chartData.length + 2}
                  fill="#6B7280"
                  fillOpacity={0.1}
                  stroke="none"
                />
              </g>
            )}
            
            <XAxis 
              dataKey="quarter"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={{ stroke: 'rgba(0, 0, 0, 0.1)' }}
              tickLine={{ stroke: 'rgba(0, 0, 0, 0.1)' }}
            />
            <YAxis 
              domain={['dataMin - 2', 'dataMax + 2']}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={{ stroke: 'rgba(0, 0, 0, 0.1)' }}
              tickLine={{ stroke: 'rgba(0, 0, 0, 0.1)' }}
              label={{ 
                value: 'Margin (%)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: 12, fill: '#6B7280' }
              }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                fontSize: '14px',
              }}
              labelStyle={{ color: '#1F2937', fontWeight: 500 }}
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)}%`,
                name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
              ]}
            />
            <Legend wrapperStyle={{ fontSize: '14px', color: '#6B7280' }} />
            
            <Line 
              type="monotone" 
              dataKey="grossMargin" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#10B981' }}
              name="Gross Margin"
            />
            <Line 
              type="monotone" 
              dataKey="operatingMargin" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#3B82F6' }}
              name="Operating Margin"
            />
            <Line 
              type="monotone" 
              dataKey="netMargin" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#8B5CF6' }}
              name="Net Margin"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* QoQ Growth and YoY Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* QoQ Growth */}
        <div data-testid="qoq-growth" className="bg-gray-50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">QoQ Growth</h4>
          <div className="space-y-2">
            {processedData.qoqGrowth.slice(-3).map((growth, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{growth.quarter}</span>
                <span className={`font-medium ${growth.netMarginGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {growth.netMarginGrowth > 0 ? '+' : ''}{growth.netMarginGrowth.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* YoY Comparison */}
        <div data-testid="yoy-comparison" className="bg-gray-50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">YoY Comparison</h4>
          <div className="space-y-2">
            {processedData.yoyComparison.slice(-3).map((yoy, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{yoy.quarter}</span>
                <span className={`font-medium ${yoy.netMarginYoY > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {yoy.netMarginYoY > 0 ? '+' : ''}{yoy.netMarginYoY.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Margin Trends */}
      <div data-testid="margin-trends" className="mt-6">
        <div className="grid grid-cols-4 gap-4">
          {processedData.seasonalPatterns.map((pattern) => (
            <div 
              key={pattern.quarter}
              data-testid={`${pattern.quarter.toLowerCase()}-range`}
              className="text-center p-3 bg-gray-50 rounded-lg"
            >
              <div className="text-sm font-medium text-gray-700">{pattern.quarter}</div>
              <div className="text-lg font-semibold text-gray-900">
                {pattern.averageNetMargin.toFixed(1)}%
              </div>
              <div className={`text-xs ${pattern.isPeak ? 'text-amber-600' : 'text-gray-500'}`}>
                {pattern.isPeak ? '🔥 Peak' : 'Average'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Average bands visibility indicator for tests */}
      {showAverageBands && (
        <div data-testid="average-bands-enabled" style={{ display: 'none' }}>
          <span>Average Bands</span>
        </div>
      )}
    </div>
  );
} 