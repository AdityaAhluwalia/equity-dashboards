/**
 * Real-Time Calculation Engine Tests - Task 3.6
 */

import {
  calculateBatch,
  createCalculationEngine,
  CalculationCache
} from './calculation-engine';

// Mock company data
const createMockCompany = (id: number) => ({
  companyId: `COMPANY${id.toString().padStart(4, '0')}`,
  companyInfo: {
    name: `Test Company ${id}`,
    sector: id % 2 === 0 ? 'FMCG' : 'Banking',
    type: id % 2 === 0 ? 'non_finance' as const : 'finance' as const
  },
  financialData: [
    {
      period: '2025',
      revenue: 1000 + (id * 10),
      operating_profit: 200 + (id * 2),
      net_profit: 150 + (id * 1.5),
      total_assets: 2000 + (id * 20),
      shareholders_equity: 800 + (id * 8),
      debt: 400 + (id * 4),
      operating_margin: 20 + (id % 10),
      revenue_growth: 0.05 + (id % 100) / 1000
    }
  ],
  marketData: {
    market_cap: 5000 + (id * 50),
    stock_price: 100 + (id % 50),
    shares_outstanding: 50 + (id * 0.5)
  }
});

describe('Real-Time Calculation Engine - Task 3.6', () => {
  describe('Batch Calculation Performance', () => {
    test('should handle batch calculations', async () => {
      const companies = Array.from({ length: 10 }, (_, i) => createMockCompany(i + 1));
      
      const result = await calculateBatch(companies);
      
      expect(result.success).toBe(true);
      expect(result.results.length).toBe(10);
      expect(result.performanceMetrics.totalTime).toBeGreaterThan(0);
    });
  });

  describe('Calculation Engine Class', () => {
    test('should create engine and track accuracy', () => {
      const engine = createCalculationEngine();
      
      expect(engine).toBeDefined();
      expect(engine.getAccuracyTrend()).toEqual([]);
      expect(engine.getAverageAccuracy()).toBe(0);
    });
  });

  describe('Caching System', () => {
    test('should manage cache properly', () => {
      const cache = new CalculationCache({ maxSize: 5, ttl: 60000 });
      
      cache.set('test1', { value: 1 });
      cache.set('test2', { value: 2 });
      
      expect(cache.size).toBe(2);
      expect(cache.get('test1')).toEqual({ value: 1 });
      expect(cache.memoryUsage).toBeGreaterThan(0);
    });
  });
});
