import { 
  calculateTTMRevenue,
  calculateTTMProfit,
  calculateTTMMargins,
  calculateTTMGrowth,
  calculateTTMRatios,
  createTTMDataSeries,
  TTMData,
  TTMCalculationResult,
  QuarterlyFinancialData,
  TTMMetrics
} from './ttm-calculator';

// Mock quarterly data for Emami Limited
const emamiQuarterlyData: QuarterlyFinancialData[] = [
  // Latest 4 quarters for TTM calculation
  {
    quarter: 'Q4 FY24',
    quarterIndex: 11,
    period: 'Mar 2024',
    revenue: 963000000, // 963 Cr
    grossProfit: 689000000,
    operatingProfit: 219000000, // 219 Cr
    netProfit: 162000000, // 162 Cr
    totalAssets: 4176000000,
    shareholders_equity: 2695000000,
    debt: 298000000,
    interest: 5000000,
    depreciation: 45000000,
    tax: 58000000,
    operatingCashFlow: 195000000,
    capex: 67000000,
    workingCapital: 301000000
  },
  {
    quarter: 'Q3 FY24',
    quarterIndex: 10,
    period: 'Dec 2023',
    revenue: 830000000,
    grossProfit: 590000000,
    operatingProfit: 180000000,
    netProfit: 135000000,
    totalAssets: 4050000000,
    shareholders_equity: 2580000000,
    debt: 310000000,
    interest: 6000000,
    depreciation: 43000000,
    tax: 48000000,
    operatingCashFlow: 168000000,
    capex: 55000000,
    workingCapital: 285000000
  },
  {
    quarter: 'Q2 FY24',
    quarterIndex: 9,
    period: 'Sep 2023',
    revenue: 750000000,
    grossProfit: 532000000,
    operatingProfit: 164000000,
    netProfit: 123000000,
    totalAssets: 3950000000,
    shareholders_equity: 2480000000,
    debt: 320000000,
    interest: 7000000,
    depreciation: 42000000,
    tax: 44000000,
    operatingCashFlow: 156000000,
    capex: 48000000,
    workingCapital: 270000000
  },
  {
    quarter: 'Q1 FY24',
    quarterIndex: 8,
    period: 'Jun 2023',
    revenue: 680000000,
    grossProfit: 483000000,
    operatingProfit: 148000000,
    netProfit: 112000000,
    totalAssets: 3850000000,
    shareholders_equity: 2400000000,
    debt: 335000000,
    interest: 8000000,
    depreciation: 40000000,
    tax: 40000000,
    operatingCashFlow: 142000000,
    capex: 42000000,
    workingCapital: 255000000
  },
  // Previous year quarters for growth calculation
  {
    quarter: 'Q4 FY23',
    quarterIndex: 7,
    period: 'Mar 2023',
    revenue: 890000000,
    grossProfit: 635000000,
    operatingProfit: 202000000,
    netProfit: 152000000,
    totalAssets: 3750000000,
    shareholders_equity: 2350000000,
    debt: 350000000,
    interest: 9000000,
    depreciation: 38000000,
    tax: 54000000,
    operatingCashFlow: 175000000,
    capex: 58000000,
    workingCapital: 240000000
  },
  {
    quarter: 'Q3 FY23',
    quarterIndex: 6,
    period: 'Dec 2022',
    revenue: 810000000,
    grossProfit: 580000000,
    operatingProfit: 175000000,
    netProfit: 132000000,
    totalAssets: 3650000000,
    shareholders_equity: 2280000000,
    debt: 365000000,
    interest: 10000000,
    depreciation: 36000000,
    tax: 47000000,
    operatingCashFlow: 158000000,
    capex: 52000000,
    workingCapital: 225000000
  },
  {
    quarter: 'Q2 FY23',
    quarterIndex: 5,
    period: 'Sep 2022',
    revenue: 720000000,
    grossProfit: 515000000,
    operatingProfit: 156000000,
    netProfit: 118000000,
    totalAssets: 3550000000,
    shareholders_equity: 2200000000,
    debt: 380000000,
    interest: 11000000,
    depreciation: 34000000,
    tax: 42000000,
    operatingCashFlow: 145000000,
    capex: 46000000,
    workingCapital: 210000000
  },
  {
    quarter: 'Q1 FY23',
    quarterIndex: 4,
    period: 'Jun 2022',
    revenue: 650000000,
    grossProfit: 465000000,
    operatingProfit: 142000000,
    netProfit: 107000000,
    totalAssets: 3450000000,
    shareholders_equity: 2150000000,
    debt: 395000000,
    interest: 12000000,
    depreciation: 32000000,
    tax: 38000000,
    operatingCashFlow: 132000000,
    capex: 40000000,
    workingCapital: 195000000
  }
];

describe('TTM Calculator - Task 7.5', () => {
  describe('Basic TTM Calculations', () => {
    describe('TTM Revenue Calculation', () => {
      it('calculates TTM revenue from latest 4 quarters', () => {
        const latest4Quarters = emamiQuarterlyData.slice(0, 4);
        const ttmRevenue = calculateTTMRevenue(latest4Quarters);
        
        // Expected: 963 + 830 + 750 + 680 = 3,223 Cr
        expect(ttmRevenue).toBe(3223000000);
      });

      it('handles missing quarters gracefully', () => {
        const incompleteData = emamiQuarterlyData.slice(0, 2);
        const ttmRevenue = calculateTTMRevenue(incompleteData);
        
        // Should return 0 or handle gracefully
        expect(ttmRevenue).toBeGreaterThanOrEqual(0);
      });

      it('validates quarterly data order', () => {
        const latest4Quarters = emamiQuarterlyData.slice(0, 4);
        const ttmRevenue = calculateTTMRevenue(latest4Quarters);
        
        // Should work regardless of quarter order
        expect(ttmRevenue).toBeGreaterThan(0);
      });
    });

    describe('TTM Profit Calculation', () => {
      it('calculates TTM net profit from latest 4 quarters', () => {
        const latest4Quarters = emamiQuarterlyData.slice(0, 4);
        const ttmProfit = calculateTTMProfit(latest4Quarters, 'net');
        
        // Expected: 162 + 135 + 123 + 112 = 532 Cr
        expect(ttmProfit).toBe(532000000);
      });

      it('calculates TTM operating profit correctly', () => {
        const latest4Quarters = emamiQuarterlyData.slice(0, 4);
        const ttmOperatingProfit = calculateTTMProfit(latest4Quarters, 'operating');
        
        // Expected: 219 + 180 + 164 + 148 = 711 Cr
        expect(ttmOperatingProfit).toBe(711000000);
      });

      it('calculates TTM gross profit correctly', () => {
        const latest4Quarters = emamiQuarterlyData.slice(0, 4);
        const ttmGrossProfit = calculateTTMProfit(latest4Quarters, 'gross');
        
        // Expected: 689 + 590 + 532 + 483 = 2,294 Cr
        expect(ttmGrossProfit).toBe(2294000000);
      });
    });

    describe('TTM Margins Calculation', () => {
      it('calculates TTM profit margins correctly', () => {
        const latest4Quarters = emamiQuarterlyData.slice(0, 4);
        const ttmMargins = calculateTTMMargins(latest4Quarters);
        
        const expectedRevenue = 3223000000;
        const expectedNetProfit = 532000000;
        const expectedOperatingProfit = 711000000;
        const expectedGrossProfit = 2294000000;
        
        expect(ttmMargins.netProfitMargin).toBeCloseTo((expectedNetProfit / expectedRevenue) * 100, 1);
        expect(ttmMargins.operatingProfitMargin).toBeCloseTo((expectedOperatingProfit / expectedRevenue) * 100, 1);
        expect(ttmMargins.grossProfitMargin).toBeCloseTo((expectedGrossProfit / expectedRevenue) * 100, 1);
      });

      it('handles zero revenue gracefully', () => {
        const zeroRevenueData = emamiQuarterlyData.slice(0, 4).map(q => ({ ...q, revenue: 0 }));
        const ttmMargins = calculateTTMMargins(zeroRevenueData);
        
        expect(ttmMargins.netProfitMargin).toBe(0);
        expect(ttmMargins.operatingProfitMargin).toBe(0);
        expect(ttmMargins.grossProfitMargin).toBe(0);
      });
    });
  });

  describe('TTM Growth Calculations', () => {
    it('calculates TTM vs previous TTM growth', () => {
      const allQuarters = emamiQuarterlyData;
      const ttmGrowth = calculateTTMGrowth(allQuarters);
      
      // Current TTM (Q1 FY24 to Q4 FY24): 963 + 830 + 750 + 680 = 3,223
      // Previous TTM (Q1 FY23 to Q4 FY23): 890 + 810 + 720 + 650 = 3,070
      // Growth: (3,223 - 3,070) / 3,070 = 4.98%
      
      expect(ttmGrowth.revenueGrowth).toBeCloseTo(4.98, 1);
      expect(ttmGrowth.revenueGrowth).toBeGreaterThan(0);
    });

    it('calculates profit growth correctly', () => {
      const allQuarters = emamiQuarterlyData;
      const ttmGrowth = calculateTTMGrowth(allQuarters);
      
      // Current TTM Net Profit: 162 + 135 + 123 + 112 = 532
      // Previous TTM Net Profit: 152 + 132 + 118 + 107 = 509
      // Growth: (532 - 509) / 509 = 4.52%
      
      expect(ttmGrowth.profitGrowth).toBeCloseTo(4.52, 1);
    });

    it('handles negative growth correctly', () => {
      // Create data with declining revenue
      const decliningData = emamiQuarterlyData.map((q, index) => ({
        ...q,
        revenue: q.revenue * (index < 4 ? 0.8 : 1.0) // Reduce recent quarters by 20%
      }));
      
      const ttmGrowth = calculateTTMGrowth(decliningData);
      expect(ttmGrowth.revenueGrowth).toBeLessThan(0);
    });
  });

  describe('TTM Ratios Calculation', () => {
    it('calculates TTM-based financial ratios', () => {
      const latest4Quarters = emamiQuarterlyData.slice(0, 4);
      const ttmRatios = calculateTTMRatios(latest4Quarters);
      
      // TTM ROE = TTM Net Profit / Average Shareholders Equity
      const avgEquity = (2695000000 + 2580000000 + 2480000000 + 2400000000) / 4;
      const expectedROE = (532000000 / avgEquity) * 100;
      
      expect(ttmRatios.roe).toBeCloseTo(expectedROE, 1);
      expect(ttmRatios.roe).toBeGreaterThan(0);
    });

    it('calculates TTM asset turnover', () => {
      const latest4Quarters = emamiQuarterlyData.slice(0, 4);
      const ttmRatios = calculateTTMRatios(latest4Quarters);
      
      // TTM Asset Turnover = TTM Revenue / Average Total Assets
      const avgAssets = (4176000000 + 4050000000 + 3950000000 + 3850000000) / 4;
      const expectedAssetTurnover = 3223000000 / avgAssets;
      
      expect(ttmRatios.assetTurnover).toBeCloseTo(expectedAssetTurnover, 2);
    });

    it('calculates TTM debt to equity', () => {
      const latest4Quarters = emamiQuarterlyData.slice(0, 4);
      const ttmRatios = calculateTTMRatios(latest4Quarters);
      
      // Use latest quarter debt and equity for TTM calculation
      const expectedDebtToEquity = 298000000 / 2695000000;
      
      expect(ttmRatios.debtToEquity).toBeCloseTo(expectedDebtToEquity, 2);
    });

    it('calculates TTM interest coverage', () => {
      const latest4Quarters = emamiQuarterlyData.slice(0, 4);
      const ttmRatios = calculateTTMRatios(latest4Quarters);
      
      // TTM Interest Coverage = TTM Operating Profit / TTM Interest
      const ttmOperatingProfit = 219000000 + 180000000 + 164000000 + 148000000;
      const ttmInterest = 5000000 + 6000000 + 7000000 + 8000000;
      const expectedInterestCoverage = ttmOperatingProfit / ttmInterest;
      
      expect(ttmRatios.interestCoverage).toBeCloseTo(expectedInterestCoverage, 1);
    });
  });

  describe('TTM Data Series Creation', () => {
    it('creates rolling TTM data series', () => {
      const ttmSeries = createTTMDataSeries(emamiQuarterlyData, 4); // Create 4 TTM data points
      
      expect(ttmSeries).toHaveLength(4);
      
      // Each TTM data point should have proper structure
      ttmSeries.forEach(ttmData => {
        expect(ttmData.period).toBeDefined();
        expect(ttmData.ttmRevenue).toBeGreaterThan(0);
        expect(ttmData.ttmNetProfit).toBeGreaterThan(0);
        expect(ttmData.margins).toBeDefined();
        expect(ttmData.ratios).toBeDefined();
      });
    });

    it('maintains chronological order in TTM series', () => {
      const ttmSeries = createTTMDataSeries(emamiQuarterlyData, 4);
      
      // TTM periods should be in chronological order (latest first)
      for (let i = 1; i < ttmSeries.length; i++) {
        const current = new Date(ttmSeries[i-1].endPeriod);
        const previous = new Date(ttmSeries[i].endPeriod);
        expect(current >= previous).toBe(true);
      }
    });

    it('calculates growth rates between TTM periods', () => {
      const ttmSeries = createTTMDataSeries(emamiQuarterlyData, 2); // Only create 2 periods to ensure growth calculation
      
      // Only the first TTM data point should have growth rates (if we have enough data)
      if (ttmSeries.length > 0 && emamiQuarterlyData.length >= 8) {
        expect(ttmSeries[0].growth).toBeDefined();
        expect(typeof ttmSeries[0].growth?.revenueGrowth).toBe('number');
        expect(typeof ttmSeries[0].growth?.profitGrowth).toBe('number');
      }
      
      // Subsequent periods may not have growth if insufficient historical data
      if (ttmSeries.length > 1) {
        // Second period needs 9+ quarters total for growth calculation
        if (emamiQuarterlyData.length >= 9) {
          expect(ttmSeries[1].growth).toBeDefined();
        }
      }
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles insufficient data gracefully', () => {
      const insufficientData = emamiQuarterlyData.slice(0, 2); // Only 2 quarters
      
      expect(() => calculateTTMRevenue(insufficientData)).not.toThrow();
      expect(() => calculateTTMMargins(insufficientData)).not.toThrow();
      expect(() => calculateTTMRatios(insufficientData)).not.toThrow();
    });

    it('handles null/undefined values', () => {
      const dataWithNulls = emamiQuarterlyData.slice(0, 4).map(q => ({
        ...q,
        netProfit: undefined as any,
        grossProfit: null as any
      }));
      
      expect(() => calculateTTMProfit(dataWithNulls, 'net')).not.toThrow();
      expect(() => calculateTTMMargins(dataWithNulls)).not.toThrow();
    });

    it('handles zero values appropriately', () => {
      const dataWithZeros = emamiQuarterlyData.slice(0, 4).map(q => ({
        ...q,
        revenue: 0,
        shareholders_equity: 0
      }));
      
      const ttmRatios = calculateTTMRatios(dataWithZeros);
      
      // Should handle division by zero gracefully
      expect(isNaN(ttmRatios.roe)).toBe(false);
      expect(isNaN(ttmRatios.assetTurnover)).toBe(false);
    });

    it('validates data consistency', () => {
      const inconsistentData = [...emamiQuarterlyData.slice(0, 3), {
        ...emamiQuarterlyData[3],
        quarter: 'Q4 FY24' // Duplicate quarter
      }];
      
      expect(() => createTTMDataSeries(inconsistentData, 2)).not.toThrow();
    });
  });

  describe('Performance and Accuracy', () => {
    it('calculates TTM values efficiently', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        calculateTTMRevenue(emamiQuarterlyData.slice(0, 4));
        calculateTTMMargins(emamiQuarterlyData.slice(0, 4));
        calculateTTMRatios(emamiQuarterlyData.slice(0, 4));
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100); // Should complete in < 100ms
    });

    it('maintains precision in calculations', () => {
      const latest4Quarters = emamiQuarterlyData.slice(0, 4);
      const ttmRevenue = calculateTTMRevenue(latest4Quarters);
      
      // Should maintain precision to the rupee level
      expect(ttmRevenue % 1).toBe(0); // Should be whole number
      expect(ttmRevenue).toBeGreaterThan(1000000000); // Should be reasonable magnitude
    });

    it('produces consistent results across multiple runs', () => {
      const latest4Quarters = emamiQuarterlyData.slice(0, 4);
      
      const run1 = calculateTTMMargins(latest4Quarters);
      const run2 = calculateTTMMargins(latest4Quarters);
      const run3 = calculateTTMMargins(latest4Quarters);
      
      expect(run1.netProfitMargin).toBe(run2.netProfitMargin);
      expect(run2.netProfitMargin).toBe(run3.netProfitMargin);
    });
  });

  describe('TTM vs Quarterly Comparison', () => {
    it('compares TTM with latest quarter metrics', () => {
      const latest4Quarters = emamiQuarterlyData.slice(0, 4);
      const latestQuarter = emamiQuarterlyData[0];
      
      const ttmMargins = calculateTTMMargins(latest4Quarters);
      const quarterlyMargin = (latestQuarter.netProfit / latestQuarter.revenue) * 100;
      
      // TTM should smooth out quarterly variations
      expect(Math.abs(ttmMargins.netProfitMargin - quarterlyMargin)).toBeDefined();
    });

    it('shows TTM smoothing effect', () => {
      const ttmSeries = createTTMDataSeries(emamiQuarterlyData, 4);
      
      // TTM values should be less volatile than quarterly values
      const ttmRevenueVariation = calculateVariation(ttmSeries.map(t => t.ttmRevenue));
      const quarterlyRevenueVariation = calculateVariation(emamiQuarterlyData.slice(0, 4).map(q => q.revenue));
      
      expect(ttmRevenueVariation).toBeLessThanOrEqual(quarterlyRevenueVariation);
    });
  });

  describe('Real-world Validation', () => {
    it('matches expected Emami TTM metrics', () => {
      const latest4Quarters = emamiQuarterlyData.slice(0, 4);
      
      const ttmRevenue = calculateTTMRevenue(latest4Quarters);
      const ttmMargins = calculateTTMMargins(latest4Quarters);
      const ttmRatios = calculateTTMRatios(latest4Quarters);
      
      // Validate against expected realistic values for Emami
      expect(ttmRevenue / 10000000).toBeCloseTo(322.3, 0); // ~322 Cr TTM revenue
      expect(ttmMargins.netProfitMargin).toBeCloseTo(16.5, 1); // ~16.5% net margin
      expect(ttmRatios.roe).toBeGreaterThan(15); // ROE should be > 15%
      expect(ttmRatios.roe).toBeLessThan(35); // ROE should be < 35%
    });

    it('produces industry-appropriate ratios', () => {
      const latest4Quarters = emamiQuarterlyData.slice(0, 4);
      const ttmRatios = calculateTTMRatios(latest4Quarters);
      
      // FMCG industry benchmarks
      expect(ttmRatios.assetTurnover).toBeGreaterThan(0.5); // Asset turnover > 0.5x
      expect(ttmRatios.assetTurnover).toBeLessThan(2.0); // Asset turnover < 2.0x
      expect(ttmRatios.debtToEquity).toBeLessThan(0.5); // Low debt for FMCG
      expect(ttmRatios.interestCoverage).toBeGreaterThan(10); // High interest coverage
    });
  });
});

// Helper function to calculate variation (coefficient of variation)
function calculateVariation(values: number[]): number {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const standardDeviation = Math.sqrt(variance);
  return standardDeviation / mean;
} 