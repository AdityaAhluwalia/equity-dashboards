'use client';

import React from 'react';
import MetricCards from '@/components/company/MetricCards';
import { MetricCard } from '@/types/ui.types';

export default function MetricCardsDemoPage() {
  // Real Emami data-based metric cards
  const emamiMetrics: MetricCard[] = [
    {
      id: 'revenue',
      label: 'Revenue',
      value: 276500, // FY2024 Revenue in lakhs
      change: 8.2,
      trend: 'up',
      format: 'currency',
      sparklineData: [
        { x: 'FY21', y: 235600 },
        { x: 'FY22', y: 255200 },
        { x: 'FY23', y: 255800 },
        { x: 'FY24', y: 276500 }
      ]
    },
    {
      id: 'opm',
      label: 'Operating Margin',
      value: 17.8,
      change: -1.2,
      trend: 'down',
      format: 'percentage',
      sparklineData: [
        { x: 'FY21', y: 20.1 },
        { x: 'FY22', y: 19.5 },
        { x: 'FY23', y: 19.0 },
        { x: 'FY24', y: 17.8 }
      ]
    },
    {
      id: 'roe',
      label: 'ROE',
      value: 28.5,
      change: 2.8,
      trend: 'up',
      format: 'percentage',
      sparklineData: [
        { x: 'FY21', y: 24.2 },
        { x: 'FY22', y: 26.1 },
        { x: 'FY23', y: 25.7 },
        { x: 'FY24', y: 28.5 }
      ]
    },
    {
      id: 'debt_equity',
      label: 'Debt to Equity',
      value: 0.12,
      change: -15.2,
      trend: 'up', // Lower debt is good
      format: 'ratio',
      sparklineData: [
        { x: 'FY21', y: 0.18 },
        { x: 'FY22', y: 0.15 },
        { x: 'FY23', y: 0.14 },
        { x: 'FY24', y: 0.12 }
      ]
    }
  ];

  // Real Axis Bank data-based metric cards
  const axisMetrics: MetricCard[] = [
    {
      id: 'revenue',
      label: 'Net Interest Income',
      value: 5847400, // FY2024 NII in lakhs
      change: 15.2,
      trend: 'up',
      format: 'currency',
      sparklineData: [
        { x: 'FY21', y: 4210300 },
        { x: 'FY22', y: 4579200 },
        { x: 'FY23', y: 5076500 },
        { x: 'FY24', y: 5847400 }
      ]
    },
    {
      id: 'nim',
      label: 'NIM',
      value: 4.05,
      change: 0.15,
      trend: 'up',
      format: 'percentage',
      sparklineData: [
        { x: 'FY21', y: 3.65 },
        { x: 'FY22', y: 3.78 },
        { x: 'FY23', y: 3.90 },
        { x: 'FY24', y: 4.05 }
      ]
    },
    {
      id: 'roe',
      label: 'ROE',
      value: 18.2,
      change: 3.8,
      trend: 'up',
      format: 'percentage',
      sparklineData: [
        { x: 'FY21', y: 12.8 },
        { x: 'FY22', y: 15.1 },
        { x: 'FY23', y: 14.4 },
        { x: 'FY24', y: 18.2 }
      ]
    },
    {
      id: 'car',
      label: 'Capital Adequacy',
      value: 16.85,
      change: 0.45,
      trend: 'up',
      format: 'percentage',
      sparklineData: [
        { x: 'FY21', y: 19.02 },
        { x: 'FY22', y: 18.15 },
        { x: 'FY23', y: 16.40 },
        { x: 'FY24', y: 16.85 }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            MetricCards Component Demo
          </h1>
          <p className="text-gray-600">
            Real financial data from Emami Limited and Axis Bank with Apple-style design
          </p>
        </div>

        {/* Emami Section */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Emami Limited (Non-Finance Company)
            </h2>
            <p className="text-sm text-gray-600">
              FMCG company showing revenue growth and strong ROE with declining margins
            </p>
          </div>
          <MetricCards metrics={emamiMetrics} />
        </div>

        {/* Axis Bank Section */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Axis Bank Limited (Finance Company)
            </h2>
            <p className="text-sm text-gray-600">
              Banking metrics showing strong NII growth and improving ROE
            </p>
          </div>
          <MetricCards metrics={axisMetrics} />
        </div>

        {/* Loading State Demo */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Loading State
            </h2>
            <p className="text-sm text-gray-600">
              Apple-style skeleton loading with glass morphism
            </p>
          </div>
          <MetricCards metrics={[]} loading={true} />
        </div>

        {/* Error State Demo */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Error State
            </h2>
            <p className="text-sm text-gray-600">
              Error handling with consistent design language
            </p>
          </div>
          <MetricCards 
            metrics={[]} 
            error="Failed to load financial metrics. Please try again." 
          />
        </div>

        {/* Design Guidelines */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Design System Compliance
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">✅ Apple-Style Features</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Glass morphism with backdrop blur</li>
                <li>• System font stack (SF Pro)</li>
                <li>• Subtle shadows and hover effects</li>
                <li>• Rounded corners (16px)</li>
                <li>• Semantic color usage</li>
                <li>• 4px base spacing system</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">💎 Interactive Elements</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Smooth hover transitions</li>
                <li>• Micro-animations (translate Y)</li>
                <li>• Touch-friendly sizing</li>
                <li>• Sparkline charts with trend colors</li>
                <li>• ARIA accessibility labels</li>
                <li>• Loading skeleton animations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 