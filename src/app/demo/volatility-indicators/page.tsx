'use client';

import React, { useState } from 'react';
import VolatilityIndicators, { VolatilityMetric, HeatmapData } from '@/components/charts/VolatilityIndicators';

export default function VolatilityIndicatorsDemo() {
  const [events, setEvents] = useState<string[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'3M' | '6M' | '1Y' | '2Y' | '5Y' | 'ALL'>('1Y');
  const [showFeatures, setShowFeatures] = useState({
    volatilityTrend: true,
    riskLevels: true,
    heatmap: true,
    statistics: true,
    alerts: true,
    comparative: true,
  });

  // Mock volatility data with realistic financial scenarios
  const volatilityData: VolatilityMetric[] = [
    {
      period: 'Q1 FY22',
      value: 1200,
      volatility: 12.5,
      riskLevel: 'low',
      standardDeviation: 45.2,
      variance: 2043.04,
      coefficient: 0.125,
      trend: 'stable',
      phase: 'stable'
    },
    {
      period: 'Q2 FY22',
      value: 1380,
      volatility: 18.7,
      riskLevel: 'moderate',
      standardDeviation: 65.8,
      variance: 4329.64,
      coefficient: 0.187,
      trend: 'increasing',
      phase: 'expansion'
    },
    {
      period: 'Q3 FY22',
      value: 1520,
      volatility: 25.3,
      riskLevel: 'moderate',
      standardDeviation: 89.1,
      variance: 7938.81,
      coefficient: 0.253,
      trend: 'increasing',
      phase: 'expansion'
    },
    {
      period: 'Q4 FY22',
      value: 1450,
      volatility: 31.8,
      riskLevel: 'high',
      standardDeviation: 112.4,
      variance: 12633.76,
      coefficient: 0.318,
      trend: 'increasing',
      phase: 'transition'
    },
    {
      period: 'Q1 FY23',
      value: 1650,
      volatility: 42.1,
      riskLevel: 'extreme',
      standardDeviation: 145.7,
      variance: 21228.49,
      coefficient: 0.421,
      trend: 'increasing',
      phase: 'expansion'
    },
    {
      period: 'Q2 FY23',
      value: 1580,
      volatility: 38.9,
      riskLevel: 'high',
      standardDeviation: 134.2,
      variance: 18009.64,
      coefficient: 0.389,
      trend: 'decreasing',
      phase: 'contraction'
    },
    {
      period: 'Q3 FY23',
      value: 1720,
      volatility: 29.4,
      riskLevel: 'high',
      standardDeviation: 98.6,
      variance: 9722.96,
      coefficient: 0.294,
      trend: 'decreasing',
      phase: 'recovery'
    },
    {
      period: 'Q4 FY23',
      value: 1820,
      volatility: 22.1,
      riskLevel: 'moderate',
      standardDeviation: 76.3,
      variance: 5821.69,
      coefficient: 0.221,
      trend: 'decreasing',
      phase: 'stable'
    }
  ];

  // Mock heatmap data for multiple metrics
  const heatmapData: HeatmapData[] = [
    {
      metric: 'Revenue',
      periods: [
        { period: 'Q1', value: 1200, volatility: 12.5, normalizedValue: 0.25, riskLevel: 'low' },
        { period: 'Q2', value: 1380, volatility: 18.7, normalizedValue: 0.37, riskLevel: 'moderate' },
        { period: 'Q3', value: 1520, volatility: 25.3, normalizedValue: 0.51, riskLevel: 'moderate' },
        { period: 'Q4', value: 1450, volatility: 31.8, normalizedValue: 0.64, riskLevel: 'high' },
        { period: 'Q1+1', value: 1650, volatility: 42.1, normalizedValue: 0.84, riskLevel: 'extreme' },
        { period: 'Q2+1', value: 1580, volatility: 38.9, normalizedValue: 0.78, riskLevel: 'high' },
        { period: 'Q3+1', value: 1720, volatility: 29.4, normalizedValue: 0.59, riskLevel: 'high' },
        { period: 'Q4+1', value: 1820, volatility: 22.1, normalizedValue: 0.44, riskLevel: 'moderate' }
      ]
    },
    {
      metric: 'Gross Margin',
      periods: [
        { period: 'Q1', value: 45.2, volatility: 8.1, normalizedValue: 0.16, riskLevel: 'low' },
        { period: 'Q2', value: 47.8, volatility: 12.3, normalizedValue: 0.25, riskLevel: 'low' },
        { period: 'Q3', value: 44.1, volatility: 19.7, normalizedValue: 0.39, riskLevel: 'moderate' },
        { period: 'Q4', value: 42.5, volatility: 28.9, normalizedValue: 0.58, riskLevel: 'high' },
        { period: 'Q1+1', value: 46.8, volatility: 35.2, normalizedValue: 0.70, riskLevel: 'high' },
        { period: 'Q2+1', value: 48.3, volatility: 31.4, normalizedValue: 0.63, riskLevel: 'high' },
        { period: 'Q3+1', value: 49.1, volatility: 24.6, normalizedValue: 0.49, riskLevel: 'moderate' },
        { period: 'Q4+1', value: 47.9, volatility: 18.3, normalizedValue: 0.37, riskLevel: 'moderate' }
      ]
    },
    {
      metric: 'Operating Income',
      periods: [
        { period: 'Q1', value: 180, volatility: 15.4, normalizedValue: 0.31, riskLevel: 'moderate' },
        { period: 'Q2', value: 210, volatility: 22.8, normalizedValue: 0.46, riskLevel: 'moderate' },
        { period: 'Q3', value: 195, volatility: 33.5, normalizedValue: 0.67, riskLevel: 'high' },
        { period: 'Q4', value: 175, volatility: 41.2, normalizedValue: 0.82, riskLevel: 'extreme' },
        { period: 'Q1+1', value: 225, volatility: 45.8, normalizedValue: 0.92, riskLevel: 'extreme' },
        { period: 'Q2+1', value: 240, volatility: 39.6, normalizedValue: 0.79, riskLevel: 'high' },
        { period: 'Q3+1', value: 265, volatility: 31.7, normalizedValue: 0.63, riskLevel: 'high' },
        { period: 'Q4+1', value: 290, volatility: 25.9, normalizedValue: 0.52, riskLevel: 'moderate' }
      ]
    },
    {
      metric: 'Cash Flow',
      periods: [
        { period: 'Q1', value: 95, volatility: 9.8, normalizedValue: 0.20, riskLevel: 'low' },
        { period: 'Q2', value: 110, volatility: 14.2, normalizedValue: 0.28, riskLevel: 'low' },
        { period: 'Q3', value: 125, volatility: 21.6, normalizedValue: 0.43, riskLevel: 'moderate' },
        { period: 'Q4', value: 105, volatility: 29.7, normalizedValue: 0.59, riskLevel: 'high' },
        { period: 'Q1+1', value: 140, volatility: 36.4, normalizedValue: 0.73, riskLevel: 'high' },
        { period: 'Q2+1', value: 155, volatility: 33.1, normalizedValue: 0.66, riskLevel: 'high' },
        { period: 'Q3+1', value: 170, volatility: 27.8, normalizedValue: 0.56, riskLevel: 'moderate' },
        { period: 'Q4+1', value: 185, volatility: 20.5, normalizedValue: 0.41, riskLevel: 'moderate' }
      ]
    }
  ];

  // Event handlers
  const handleMetricHover = (metric: VolatilityMetric | null) => {
    if (metric) {
      setEvents(prev => [...prev.slice(-9), `Hovered: ${metric.period} (${metric.volatility}% volatility)`]);
    }
  };

  const handleMetricClick = (metric: VolatilityMetric) => {
    setEvents(prev => [...prev.slice(-9), `Clicked: ${metric.period} - ${metric.riskLevel} risk (${metric.volatility}%)`]);
  };

  const handleHeatmapCellClick = (data: HeatmapData, period: string) => {
    const cellData = data.periods.find(p => p.period === period);
    if (cellData) {
      setEvents(prev => [...prev.slice(-9), `Heatmap: ${data.metric} ${period} - ${cellData.volatility}% volatility`]);
    }
  };

  const handleAlertClick = (alert: any) => {
    setEvents(prev => [...prev.slice(-9), `Alert clicked: ${alert.message} (${alert.count} periods)`]);
  };

  const clearEvents = () => setEvents([]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Volatility Indicators Demo
          </h1>
          <p className="text-lg text-gray-600">
            Advanced volatility analysis with risk assessment, trend visualization, and interactive heatmaps
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Time Range Selector */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Range</h3>
              <div className="flex flex-wrap gap-2">
                {(['3M', '6M', '1Y', '2Y', '5Y', 'ALL'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedTimeRange === range
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Toggles */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(showFeatures).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setShowFeatures(prev => ({
                        ...prev,
                        [key]: e.target.checked
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Event Log */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Event Log</h3>
            <button
              onClick={clearEvents}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 h-32 overflow-y-auto">
            {events.length === 0 ? (
              <p className="text-gray-500 text-sm">Interact with the components to see events...</p>
            ) : (
              <div className="space-y-1">
                {events.map((event, index) => (
                  <div key={index} className="text-sm text-gray-700 font-mono">
                    {new Date().toLocaleTimeString()}: {event}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Volatility Indicators Component */}
        <div className="space-y-8">
          <VolatilityIndicators
            data={volatilityData}
            heatmapData={heatmapData}
            showVolatilityTrend={showFeatures.volatilityTrend}
            showRiskLevels={showFeatures.riskLevels}
            showHeatmap={showFeatures.heatmap}
            showStatistics={showFeatures.statistics}
            showAlerts={showFeatures.alerts}
            showComparative={showFeatures.comparative}
            enableInteraction={true}
            enableTooltips={true}
            timeRange={selectedTimeRange}
            volatilityThresholds={{
              low: 15,
              moderate: 25,
              high: 35,
              extreme: 45
            }}
            heatmapConfig={{
              colorScheme: 'risk',
              cellSize: 'medium',
              showValues: true,
              showGradient: false
            }}
            onMetricHover={handleMetricHover}
            onMetricClick={handleMetricClick}
            onHeatmapCellClick={handleHeatmapCellClick}
            onAlertClick={handleAlertClick}
          />
        </div>

        {/* Additional Examples */}
        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-bold text-gray-900">Additional Examples</h2>

          {/* Compact Mode */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compact Mode</h3>
            <VolatilityIndicators
              data={volatilityData.slice(0, 4)}
              showVolatilityTrend={true}
              showRiskLevels={true}
              compactMode={true}
              enableInteraction={true}
              onMetricClick={handleMetricClick}
            />
          </div>

          {/* Performance Color Scheme */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Color Scheme</h3>
            <VolatilityIndicators
              data={volatilityData.slice(0, 6)}
              heatmapData={heatmapData.slice(0, 2)}
              showHeatmap={true}
              showStatistics={true}
              heatmapConfig={{
                colorScheme: 'performance',
                cellSize: 'large',
                showValues: true,
                showGradient: true
              }}
              enableInteraction={true}
              onHeatmapCellClick={handleHeatmapCellClick}
            />
          </div>

          {/* Alerts Only */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">High Risk Alert Focus</h3>
            <VolatilityIndicators
              data={volatilityData.filter(d => d.riskLevel === 'high' || d.riskLevel === 'extreme')}
              showAlerts={true}
              showRiskLevels={true}
              showComparative={true}
              volatilityThresholds={{
                low: 10,
                moderate: 20,
                high: 30,
                extreme: 40
              }}
              enableInteraction={true}
              onAlertClick={handleAlertClick}
            />
          </div>
        </div>

        {/* Documentation */}
        <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Component Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Volatility Analysis</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time volatility trend visualization</li>
                <li>• Statistical metrics (std dev, variance, coefficient)</li>
                <li>• Risk level classification (low, moderate, high, extreme)</li>
                <li>• Trend direction indicators</li>
                <li>• Period-over-period comparisons</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Interactive Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Hover effects with detailed tooltips</li>
                <li>• Click interactions on metrics and heatmap cells</li>
                <li>• Alert system with customizable thresholds</li>
                <li>• Time range filtering</li>
                <li>• Responsive design with mobile support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Visualization Options</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Multi-metric heatmaps with color coding</li>
                <li>• Bar charts with risk-based coloring</li>
                <li>• Statistical summaries and percentiles</li>
                <li>• Compact and full-width display modes</li>
                <li>• Customizable color schemes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Data Handling</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Robust data validation and error handling</li>
                <li>• Support for missing or invalid values</li>
                <li>• Performance optimization for large datasets</li>
                <li>• Accessibility features and ARIA labels</li>
                <li>• Export and integration capabilities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 