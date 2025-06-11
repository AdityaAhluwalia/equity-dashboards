'use client';

import React, { useState } from 'react';
import CycleTimeline, { CycleData } from '@/components/charts/CycleTimeline';
import { PhaseType } from '@/lib/design-tokens';

export default function CycleTimelineDemoPage() {
  const [selectedView, setSelectedView] = useState<'quarterly' | 'annual'>('quarterly');
  const [showIntensity, setShowIntensity] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('emami');

  // Emami quarterly data with business cycle phases
  const emamiQuarterlyData: CycleData[] = [
    {
      period: 'Q1 FY21',
      revenue: 620000,
      netProfit: 45000,
      phase: 'contraction',
      cycleIntensity: 25,
      quarterIndex: 0
    },
    {
      period: 'Q2 FY21',
      revenue: 640000,
      netProfit: 48000,
      phase: 'transition',
      cycleIntensity: 45,
      quarterIndex: 1
    },
    {
      period: 'Q3 FY21',
      revenue: 680000,
      netProfit: 52000,
      phase: 'expansion',
      cycleIntensity: 75,
      quarterIndex: 2
    },
    {
      period: 'Q4 FY21',
      revenue: 720000,
      netProfit: 58000,
      phase: 'expansion',
      cycleIntensity: 85,
      quarterIndex: 3
    },
    {
      period: 'Q1 FY22',
      revenue: 710000,
      netProfit: 55000,
      phase: 'stable',
      cycleIntensity: 50,
      quarterIndex: 4
    },
    {
      period: 'Q2 FY22',
      revenue: 700000,
      netProfit: 52000,
      phase: 'contraction',
      cycleIntensity: 30,
      quarterIndex: 5
    },
    {
      period: 'Q3 FY22',
      revenue: 680000,
      netProfit: 48000,
      phase: 'contraction',
      cycleIntensity: 20,
      quarterIndex: 6
    },
    {
      period: 'Q4 FY22',
      revenue: 695000,
      netProfit: 50000,
      phase: 'transition',
      cycleIntensity: 40,
      quarterIndex: 7
    },
    {
      period: 'Q1 FY23',
      revenue: 715000,
      netProfit: 53000,
      phase: 'expansion',
      cycleIntensity: 65,
      quarterIndex: 8
    },
    {
      period: 'Q2 FY23',
      revenue: 740000,
      netProfit: 58000,
      phase: 'expansion',
      cycleIntensity: 80,
      quarterIndex: 9
    },
    {
      period: 'Q3 FY23',
      revenue: 760000,
      netProfit: 62000,
      phase: 'expansion',
      cycleIntensity: 90,
      quarterIndex: 10
    },
    {
      period: 'Q4 FY23',
      revenue: 755000,
      netProfit: 60000,
      phase: 'stable',
      cycleIntensity: 55,
      quarterIndex: 11
    }
  ];

  // Emami annual data
  const emamiAnnualData: CycleData[] = [
    {
      period: 'FY19',
      revenue: 2200000,
      netProfit: 180000,
      phase: 'contraction',
      cycleIntensity: 20,
      quarterIndex: 0
    },
    {
      period: 'FY20',
      revenue: 2450000,
      netProfit: 190000,
      phase: 'transition',
      cycleIntensity: 40,
      quarterIndex: 1
    },
    {
      period: 'FY21',
      revenue: 2660000,
      netProfit: 203000,
      phase: 'expansion',
      cycleIntensity: 80,
      quarterIndex: 2
    },
    {
      period: 'FY22',
      revenue: 2580000,
      netProfit: 195000,
      phase: 'stable',
      cycleIntensity: 55,
      quarterIndex: 3
    },
    {
      period: 'FY23',
      revenue: 2730000,
      netProfit: 233000,
      phase: 'expansion',
      cycleIntensity: 85,
      quarterIndex: 4
    },
    {
      period: 'FY24',
      revenue: 2765000,
      netProfit: 238000,
      phase: 'stable',
      cycleIntensity: 60,
      quarterIndex: 5
    }
  ];

  // Axis Bank quarterly data (banking sector has different cycles)
  const axisQuarterlyData: CycleData[] = [
    {
      period: 'Q1 FY21',
      revenue: 185000,
      netProfit: 112,
      phase: 'contraction',
      cycleIntensity: 15,
      quarterIndex: 0
    },
    {
      period: 'Q2 FY21',
      revenue: 187500,
      netProfit: 1505,
      phase: 'transition',
      cycleIntensity: 35,
      quarterIndex: 1
    },
    {
      period: 'Q3 FY21',
      revenue: 192000,
      netProfit: 2677,
      phase: 'expansion',
      cycleIntensity: 60,
      quarterIndex: 2
    },
    {
      period: 'Q4 FY21',
      revenue: 198000,
      netProfit: 2848,
      phase: 'expansion',
      cycleIntensity: 70,
      quarterIndex: 3
    },
    {
      period: 'Q1 FY22',
      revenue: 205000,
      netProfit: 3133,
      phase: 'expansion',
      cycleIntensity: 85,
      quarterIndex: 4
    },
    {
      period: 'Q2 FY22',
      revenue: 212000,
      netProfit: 3133,
      phase: 'stable',
      cycleIntensity: 75,
      quarterIndex: 5
    },
    {
      period: 'Q3 FY22',
      revenue: 220000,
      netProfit: 2160,
      phase: 'stable',
      cycleIntensity: 65,
      quarterIndex: 6
    },
    {
      period: 'Q4 FY22',
      revenue: 225000,
      netProfit: 3562,
      phase: 'expansion',
      cycleIntensity: 80,
      quarterIndex: 7
    },
    {
      period: 'Q1 FY23',
      revenue: 232000,
      netProfit: 4125,
      phase: 'expansion',
      cycleIntensity: 90,
      quarterIndex: 8
    },
    {
      period: 'Q2 FY23',
      revenue: 238000,
      netProfit: 4525,
      phase: 'expansion',
      cycleIntensity: 95,
      quarterIndex: 9
    },
    {
      period: 'Q3 FY23',
      revenue: 245000,
      netProfit: 5437,
      phase: 'expansion',
      cycleIntensity: 100,
      quarterIndex: 10
    },
    {
      period: 'Q4 FY23',
      revenue: 248000,
      netProfit: 5797,
      phase: 'stable',
      cycleIntensity: 85,
      quarterIndex: 11
    }
  ];

  // Get current dataset
  const getCurrentData = () => {
    const baseData = selectedCompany === 'emami' ? 
      (selectedView === 'quarterly' ? emamiQuarterlyData : emamiAnnualData) :
      axisQuarterlyData;
    
    return baseData;
  };

  const handlePhaseClick = (phase: PhaseType, period: string) => {
    console.log(`Clicked on ${phase} phase for period ${period}`);
  };

  const handlePeriodHover = (period: string | null) => {
    if (period) {
      console.log(`Hovering over period: ${period}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CycleTimeline Component Demo
          </h1>
          <p className="text-lg text-gray-600">
            Interactive demonstration of business cycle visualization with real company data
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Company Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <select 
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="emami">Emami Ltd (FMCG)</option>
                <option value="axis">Axis Bank (Banking)</option>
              </select>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Mode
              </label>
              <div className="flex rounded-lg border border-gray-300 p-1">
                <button
                  onClick={() => setSelectedView('quarterly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    selectedView === 'quarterly' 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Quarterly
                </button>
                <button
                  onClick={() => setSelectedView('annual')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    selectedView === 'annual' 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  disabled={selectedCompany === 'axis'}
                >
                  Annual
                </button>
              </div>
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showIntensity}
                    onChange={(e) => setShowIntensity(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show Phase Intensity</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Main Timeline */}
        <div className="mb-8">
          <CycleTimeline
            data={getCurrentData()}
            viewMode={selectedView}
            showPhaseIntensity={showIntensity}
            showTrendLine={true}
            height={400}
            onPhaseClick={handlePhaseClick}
            onPeriodHover={handlePeriodHover}
          />
        </div>

        {/* Comparison View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Compact View (height: 250px)
            </h3>
            <CycleTimeline
              data={getCurrentData().slice(0, 6)}
              viewMode={selectedView}
              showPhaseIntensity={false}
              showTrendLine={true}
              height={250}
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Intensity Only View
            </h3>
            <CycleTimeline
              data={getCurrentData().slice(0, 6)}
              viewMode={selectedView}
              showPhaseIntensity={true}
              showTrendLine={false}
              height={250}
            />
          </div>
        </div>

        {/* States Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Loading State
            </h3>
            <CycleTimeline
              data={[]}
              viewMode="quarterly"
              loading={true}
              height={200}
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Error State
            </h3>
            <CycleTimeline
              data={[]}
              viewMode="quarterly"
              error="Failed to load financial data from API"
              height={200}
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Empty State
            </h3>
            <CycleTimeline
              data={[]}
              viewMode="quarterly"
              height={200}
            />
          </div>
        </div>

        {/* Data Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Current Dataset Summary
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {getCurrentData().length}
              </div>
              <div className="text-sm text-gray-600">Data Points</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {getCurrentData().filter(d => d.phase === 'expansion').length}
              </div>
              <div className="text-sm text-gray-600">Expansion Periods</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {getCurrentData().filter(d => d.phase === 'contraction').length}
              </div>
              <div className="text-sm text-gray-600">Contraction Periods</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {Math.round(getCurrentData().reduce((acc, d) => acc + d.cycleIntensity, 0) / getCurrentData().length)}%
              </div>
              <div className="text-sm text-gray-600">Avg Intensity</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            Demo data based on publicly available financial information. 
            Phase classifications and intensity scores are illustrative.
          </p>
        </div>
      </div>
    </div>
  );
} 