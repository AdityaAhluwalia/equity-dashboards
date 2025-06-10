/**
 * Cycle Detection Algorithm Tests - Task 3.5
 */

import {
  detectCyclePhase,
  analyzeCycleIndicators,
  classifyCyclePhase,
  CycleDetectionInput
} from './cycle-detector';

// Real Emami historical data
const emamiData = [
  { period: '2025', revenue: 4776, operating_profit: 1099, revenue_growth: 0.064, operating_margin: 23.0 },
  { period: '2024', revenue: 4488, operating_profit: 1032, revenue_growth: 0.060, operating_margin: 23.0 },
  { period: '2023', revenue: 4234, operating_profit: 974, revenue_growth: 0.059, operating_margin: 23.0 }
];

describe('Cycle Detection Algorithm - Task 3.5', () => {
  describe('Growth Indicators Analysis', () => {
    test('should identify expansion phase indicators', () => {
      const indicators = analyzeCycleIndicators(emamiData, 'non_finance');
      
      expect(indicators.growthScore).toBeGreaterThanOrEqual(70);
      expect(['accelerating', 'stable']).toContain(indicators.revenueGrowthTrend);
      expect(indicators.marginStability).toBeGreaterThan(0.8);
    });
  });

  describe('Phase Classification', () => {
    test('should classify Emami as expansion phase', () => {
      const phase = classifyCyclePhase(emamiData, 'non_finance');
      
      expect(phase.currentPhase).toBe('expansion');
      expect(phase.confidence).toBeGreaterThan(0.75);
    });
  });

  describe('Comprehensive Cycle Detection', () => {
    test('should provide comprehensive analysis', () => {
      const input: CycleDetectionInput = {
        historicalData: emamiData,
        companyInfo: { name: 'Emami Ltd', sector: 'FMCG', type: 'non_finance' },
        currentQuarter: emamiData[0]
      };
      
      const result = detectCyclePhase(input);
      
      expect(result.currentPhase).toBe('expansion');
      expect(result.confidence).toBeGreaterThan(0.75);
    });
  });
});
