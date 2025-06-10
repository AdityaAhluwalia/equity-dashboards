import { 
  calculateUniversalRatios,
  calculateROE,
  calculateNetProfitMargin,
  calculateRevenueGrowth,
  calculateProfitGrowth,
  calculateAssetTurnover,
  calculateDebtToEquity,
  calculatePriceToEarnings,
  calculatePriceToBook,
  UniversalRatios
} from './universal-ratios';
import { 
  EMAMI_COMPANY, 
  EMAMI_QUARTERLY_DATA, 
  EMAMI_ANNUAL_DATA,
  EMAMI_MARKET_DATA,
  AXIS_BANK_COMPANY,
  AXIS_QUARTERLY_DATA,
  AXIS_ANNUAL_DATA
} from '../../test/fixtures/real-company-data';

describe('Universal Ratio Calculator - Task 3.1', () => {
  
  describe('Return on Equity (ROE)', () => {
    test('should calculate ROE correctly for Emami (target: ~29.8%)', () => {
      const latestAnnual = EMAMI_ANNUAL_DATA[0]; // Latest year
      const roe = calculateROE(latestAnnual.net_income, latestAnnual.shareholders_equity);
      
      expect(roe).toBeGreaterThan(0.28); // At least 28%
      expect(roe).toBeLessThan(0.32); // Less than 32%
      expect(roe).toBeCloseTo(0.298, 2); // Target: 29.8%
    });

    test('should calculate ROE correctly for Axis Bank (target: ~15.15%)', () => {
      const latestAnnual = AXIS_ANNUAL_DATA[0]; // Use annual data for proper ROE
      const roe = calculateROE(latestAnnual.net_income, latestAnnual.shareholders_equity);
      
      expect(roe).toBeGreaterThan(0.14); // At least 14%
      expect(roe).toBeLessThan(0.17); // Less than 17%
      expect(roe).toBeCloseTo(0.1515, 2); // Target: 15.15%
    });

    test('should handle edge cases', () => {
      expect(calculateROE(0, 1000)).toBe(0); // Zero profit
      expect(calculateROE(100, 0)).toBe(0); // Zero equity
      expect(calculateROE(-100, 1000)).toBeLessThan(0); // Negative profit
    });
  });

  describe('Net Profit Margin', () => {
    test('should calculate net profit margin for Emami', () => {
      const latestAnnual = EMAMI_ANNUAL_DATA[0];
      const margin = calculateNetProfitMargin(latestAnnual.net_income, latestAnnual.revenue);
      
      expect(margin).toBeGreaterThan(0.15); // At least 15%
      expect(margin).toBeLessThan(0.30); // Less than 30%
    });

    test('should calculate net profit margin for Axis Bank', () => {
      const latestQuarterly = AXIS_QUARTERLY_DATA[0];
      const margin = calculateNetProfitMargin(latestQuarterly.net_income, latestQuarterly.revenue);
      
      expect(margin).toBeGreaterThan(0.10); // At least 10%
      expect(margin).toBeLessThan(0.30); // Less than 30%
    });

    test('should handle edge cases for margin', () => {
      expect(calculateNetProfitMargin(0, 1000)).toBe(0); // Zero profit
      expect(calculateNetProfitMargin(100, 0)).toBe(0); // Zero revenue
    });
  });

  describe('Revenue Growth Calculations', () => {
    test('should calculate 1-year revenue growth for Emami', () => {
      const currentYear = EMAMI_ANNUAL_DATA[0];
      const previousYear = EMAMI_ANNUAL_DATA[1];
      
      const growth = calculateRevenueGrowth(currentYear.revenue, previousYear.revenue, 1);
      
      expect(growth).toBeGreaterThan(-0.20); // Not declining more than 20%
      expect(growth).toBeLessThan(0.50); // Not growing more than 50%
    });

    test('should calculate 3-year CAGR for Emami', () => {
      const currentYear = EMAMI_ANNUAL_DATA[0];
      const threeYearsAgo = EMAMI_ANNUAL_DATA[2];
      
      const cagr = calculateRevenueGrowth(currentYear.revenue, threeYearsAgo.revenue, 3);
      
      expect(cagr).toBeGreaterThan(-0.10); // Not declining more than 10% CAGR
      expect(cagr).toBeLessThan(0.30); // Not growing more than 30% CAGR
    });

    test('should handle growth edge cases', () => {
      expect(calculateRevenueGrowth(1100, 1000, 1)).toBeCloseTo(0.1, 2); // 10% growth
      expect(calculateRevenueGrowth(1000, 1000, 1)).toBe(0); // No growth
      expect(calculateRevenueGrowth(900, 1000, 1)).toBeCloseTo(-0.1, 2); // 10% decline
    });
  });

  describe('Profit Growth Calculations', () => {
    test('should calculate profit growth for Emami', () => {
      const currentYear = EMAMI_ANNUAL_DATA[0];
      const previousYear = EMAMI_ANNUAL_DATA[1];
      
      const growth = calculateProfitGrowth(currentYear.net_income, previousYear.net_income, 1);
      
      expect(typeof growth).toBe('number');
      expect(growth).toBeGreaterThan(-0.50); // Not declining more than 50%
    });

    test('should handle volatile profit patterns', () => {
      expect(calculateProfitGrowth(200, 100, 1)).toBeCloseTo(1.0, 1); // 100% growth
      expect(calculateProfitGrowth(100, 200, 1)).toBeCloseTo(-0.5, 1); // 50% decline
    });
  });

  describe('Asset Turnover', () => {
    test('should calculate asset turnover for Emami', () => {
      const latestAnnual = EMAMI_ANNUAL_DATA[0];
      const turnover = calculateAssetTurnover(latestAnnual.revenue, latestAnnual.total_assets);
      
      expect(turnover).toBeGreaterThan(0.5); // At least 0.5x
      expect(turnover).toBeLessThan(3.0); // Less than 3x (reasonable range)
    });

    test('should calculate asset turnover for Axis Bank', () => {
      const latestQuarterly = AXIS_QUARTERLY_DATA[0];
      const turnover = calculateAssetTurnover(latestQuarterly.revenue, latestQuarterly.total_assets);
      
      expect(turnover).toBeGreaterThan(0.01); // Banks have lower turnover
      expect(turnover).toBeLessThan(0.5); // But still positive
    });
  });

  describe('Debt to Equity', () => {
    test('should calculate debt-to-equity for Emami (almost debt-free)', () => {
      const latestAnnual = EMAMI_ANNUAL_DATA[0];
      const debtToEquity = calculateDebtToEquity(latestAnnual.debt, latestAnnual.shareholders_equity);
      
      expect(debtToEquity).toBeGreaterThan(0); // Some debt
      expect(debtToEquity).toBeLessThan(0.20); // Very low debt (almost debt-free)
    });

    test('should handle zero debt scenarios', () => {
      expect(calculateDebtToEquity(0, 1000)).toBe(0); // No debt
    });
  });

  describe('Market Ratios', () => {
    test('should calculate P/E ratio for Emami (target: ~31.7)', () => {
      const pe = calculatePriceToEarnings(EMAMI_MARKET_DATA.stock_price, EMAMI_MARKET_DATA.pe_ratio);
      
      expect(pe).toBeGreaterThan(25); // At least 25
      expect(pe).toBeLessThan(40); // Less than 40
      expect(pe).toBeCloseTo(31.7, 0); // Target from real data
    });

    test('should calculate P/B ratio for Emami (target: ~9.44)', () => {
      const pb = calculatePriceToBook(EMAMI_MARKET_DATA.stock_price, EMAMI_MARKET_DATA.pb_ratio);
      
      expect(pb).toBeGreaterThan(8); // At least 8
      expect(pb).toBeLessThan(12); // Less than 12  
      expect(pb).toBeCloseTo(9.44, 1); // Target from real data
    });
  });

  describe('Complete Universal Ratios Suite', () => {
    test('should calculate all 12 universal ratios for Emami', () => {
      const ratios = calculateUniversalRatios({
        financialData: EMAMI_ANNUAL_DATA,
        marketData: EMAMI_MARKET_DATA,
        companyInfo: EMAMI_COMPANY
      });

      // Verify all 12 ratios are calculated
      expect(ratios).toHaveProperty('roe');
      expect(ratios).toHaveProperty('netProfitMargin');
      expect(ratios).toHaveProperty('revenueGrowth1Y');
      expect(ratios).toHaveProperty('revenueGrowth3Y');
      expect(ratios).toHaveProperty('revenueGrowth5Y');
      expect(ratios).toHaveProperty('profitGrowth1Y');
      expect(ratios).toHaveProperty('profitGrowth3Y');
      expect(ratios).toHaveProperty('profitGrowth5Y');
      expect(ratios).toHaveProperty('assetTurnover');
      expect(ratios).toHaveProperty('debtToEquity');
      expect(ratios).toHaveProperty('priceToEarnings');
      expect(ratios).toHaveProperty('priceToBook');

      // Verify key ratios match expected ranges
      expect(ratios.roe).toBeGreaterThan(0.25);
      expect(ratios.priceToEarnings).toBeCloseTo(31.7, 0);
      expect(ratios.priceToBook).toBeCloseTo(9.44, 1);
    });

    test('should calculate all universal ratios for Axis Bank', () => {
      const ratios = calculateUniversalRatios({
        financialData: AXIS_ANNUAL_DATA, // Use annual data for accurate ROE
        marketData: { 
          stock_price: 1231, 
          pe_ratio: 13.6, 
          pb_ratio: 1.8,
          market_cap: 381748
        },
        companyInfo: AXIS_BANK_COMPANY
      });

      // Verify banking ratios are reasonable
      expect(ratios.roe).toBeGreaterThan(0.14); // Banks typically 14%+ (using annual data)
      expect(ratios.assetTurnover).toBeLessThan(0.5); // Banks have lower turnover
      expect(ratios.priceToEarnings).toBeCloseTo(13.6, 1);
    });
  });

  describe('Performance Requirements', () => {
    test('should calculate ratios within 10ms per company', () => {
      const startTime = performance.now();
      
      calculateUniversalRatios({
        financialData: EMAMI_ANNUAL_DATA,
        marketData: EMAMI_MARKET_DATA,
        companyInfo: EMAMI_COMPANY
      });
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(10);
    });

    test('should handle missing data gracefully', () => {
      const ratios = calculateUniversalRatios({
        financialData: [], // Empty data
        marketData: EMAMI_MARKET_DATA,
        companyInfo: EMAMI_COMPANY
      });

      // Should return object with null/default values, not crash
      expect(ratios).toBeDefined();
      expect(ratios.roe).toBe(0); // Default for missing data
    });
  });

  describe('Accuracy Requirements', () => {
    test('should match known benchmarks within 1% tolerance', () => {
      // Use Emami's known values for validation
      const latestAnnual = EMAMI_ANNUAL_DATA[0];
      const calculatedROE = calculateROE(latestAnnual.net_income, latestAnnual.shareholders_equity);
      
      // Allow 1% variance from expected 29.8%
      expect(Math.abs(calculatedROE - 0.298)).toBeLessThan(0.01);
    });
  });
}); 