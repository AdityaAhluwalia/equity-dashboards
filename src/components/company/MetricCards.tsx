import React from 'react';
import { MetricCard } from '@/types/ui.types';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MetricCardsProps {
  metrics: MetricCard[];
  loading?: boolean;
  error?: string | null;
}

const formatValue = (value: string | number, format: MetricCard['format']): string => {
  if (typeof value === 'string') return value;
  
  switch (format) {
    case 'currency':
      return `₹${new Intl.NumberFormat('en-IN').format(value)}`;
    case 'percentage':
      return `${value.toFixed(2)}%`;
    case 'ratio':
      return value.toFixed(2);
    case 'number':
    default:
      return new Intl.NumberFormat('en-IN').format(value);
  }
};

const getTrendIcon = (trend: MetricCard['trend']) => {
  switch (trend) {
    case 'up':
      return '↗️';
    case 'down':
      return '↘️';
    case 'stable':
    default:
      return '→';
  }
};

const getTrendColor = (trend: MetricCard['trend']) => {
  switch (trend) {
    case 'up':
      return 'text-green-600';
    case 'down':
      return 'text-red-600';
    case 'stable':
    default:
      return 'text-gray-600';
  }
};

export default function MetricCards({ 
  metrics, 
  loading = false, 
  error = null 
}: MetricCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((index) => (
          <div 
            key={index}
            className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
              <div className="h-6 bg-gray-200 rounded mb-2 w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-red-100">
        <div className="flex items-center text-red-600 text-sm">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  if (!metrics || metrics.length === 0) {
    return (
      <div className="bg-gray-50/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="text-gray-500 text-sm text-center">
          No metrics available
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
        >
          {/* Metric Label */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              {metric.label.toUpperCase()}
            </span>
            <span className="text-xs" role="img" aria-label={`${metric.trend} trend`}>
              {getTrendIcon(metric.trend)}
            </span>
          </div>

          {/* Metric Value */}
          <div className="mb-3">
            <div className="text-lg font-bold text-gray-900">
              {formatValue(metric.value, metric.format)}
            </div>
            {metric.change !== undefined && (
              <div className={`text-xs font-medium ${getTrendColor(metric.trend)}`}>
                {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(2)}%
              </div>
            )}
          </div>

          {/* Sparkline Chart */}
          {metric.sparklineData && metric.sparklineData.length > 0 && (
            <div className="h-8 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metric.sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="y"
                    stroke={metric.trend === 'up' ? '#10b981' : metric.trend === 'down' ? '#ef4444' : '#6b7280'}
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Fallback when no sparkline data */}
          {(!metric.sparklineData || metric.sparklineData.length === 0) && (
            <div className="h-8 w-full bg-gray-100 rounded-sm flex items-center justify-center">
              <span className="text-xs text-gray-400">No data</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 