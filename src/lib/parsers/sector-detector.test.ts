import { detectSector, SectorType, SectorDetectionResult } from './sector-detector';
import { 
  EMAMI_COMPANY, 
  EMAMI_QUARTERLY_DATA, 
  EMAMI_ANNUAL_DATA,
  AXIS_BANK_COMPANY,
  AXIS_QUARTERLY_DATA,
  AXIS_ANNUAL_DATA
} from '../../test/fixtures/real-company-data';

// Create compound data objects that match the expected Screener.in format
const emamiData = {
  ...EMAMI_COMPANY,
  quarterly: EMAMI_QUARTERLY_DATA,
  annual: EMAMI_ANNUAL_DATA
};

const axisBankData = {
  ...AXIS_BANK_COMPANY,
  quarterly: AXIS_QUARTERLY_DATA,
  annual: AXIS_ANNUAL_DATA
};

describe('Sector Detection & Classification System', () => {
  describe('Finance Company Detection', () => {
    test('should correctly identify Axis Bank as finance company', () => {
      const result = detectSector(axisBankData);
      
      expect(result.sector).toBe('finance');
      expect(result.confidence).toBeGreaterThan(0.95);
      expect(result.indicators).toContain('deposits_field_present');
      expect(result.indicators).toContain('financing_profit_structure');
      expect(result.indicators).toContain('banking_balance_sheet');
    });

    test('should detect banking sector keywords in Axis Bank', () => {
      const result = detectSector(axisBankData);
      
      expect(result.subSector).toBe('banking');
      expect(result.indicators).toContain('sector_keyword_bank');
    });

    test('should identify finance-specific field patterns', () => {
      const result = detectSector(axisBankData);
      
      // Check for finance-specific fields
      expect(result.fieldAnalysis.hasDeposits).toBe(true);
      expect(result.fieldAnalysis.hasFinancingProfit).toBe(true);
      expect(result.fieldAnalysis.hasNetInterestMargin).toBe(true);
      expect(result.fieldAnalysis.hasBorrowings).toBe(true);
    });
  });

  describe('Non-Finance Company Detection', () => {
    test('should correctly identify Emami as non-finance company', () => {
      const result = detectSector(emamiData);
      
      expect(result.sector).toBe('non_finance');
      expect(result.confidence).toBeGreaterThan(0.95);
      expect(result.indicators).toContain('sales_field_present');
      expect(result.indicators).toContain('operating_profit_structure');
      expect(result.indicators).toContain('manufacturing_balance_sheet');
    });

    test('should detect FMCG sector classification for Emami', () => {
      const result = detectSector(emamiData);
      
      expect(result.subSector).toBe('fmcg');
      expect(result.indicators).toContain('sector_keyword_fmcg');
    });

    test('should identify non-finance field patterns', () => {
      const result = detectSector(emamiData);
      
      // Check for non-finance specific fields
      expect(result.fieldAnalysis.hasSales).toBe(true);
      expect(result.fieldAnalysis.hasOperatingProfit).toBe(true);
      expect(result.fieldAnalysis.hasInventory).toBe(true);
      expect(result.fieldAnalysis.hasDebtors).toBe(true);
    });
  });

  describe('Balance Sheet Structure Analysis', () => {
    test('should detect banking balance sheet structure in Axis Bank', () => {
      const result = detectSector(axisBankData);
      
      expect(result.balanceSheetAnalysis.hasTypicalBankStructure).toBe(true);
      expect(result.balanceSheetAnalysis.depositsToTotalLiabilities).toBeGreaterThan(0.5);
      expect(result.balanceSheetAnalysis.hasAdvancesAssets).toBe(true);
    });

    test('should detect manufacturing balance sheet structure in Emami', () => {
      const result = detectSector(emamiData);
      
      expect(result.balanceSheetAnalysis.hasTypicalManufacturingStructure).toBe(true);
      expect(result.balanceSheetAnalysis.hasWorkingCapitalComponents).toBe(true);
      expect(result.balanceSheetAnalysis.hasFixedAssets).toBe(true);
    });
  });

  describe('Sector Keywords Detection', () => {
    test('should detect banking keywords in company data', () => {
      const result = detectSector(axisBankData);
      
      expect(result.keywordAnalysis.bankingKeywords).toContain('bank');
      expect(result.keywordAnalysis.score).toBeGreaterThan(0.8);
    });

    test('should detect FMCG keywords in company data', () => {
      const result = detectSector(emamiData);
      
      expect(result.keywordAnalysis.fmcgKeywords.length).toBeGreaterThan(0);
      expect(result.keywordAnalysis.score).toBeGreaterThan(0.7);
    });
  });

  describe('Performance Requirements', () => {
    test('should classify sector within 10ms', () => {
      const startTime = performance.now();
      const result = detectSector(emamiData);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(10);
      expect(result.sector).toBeDefined();
    });

    test('should handle large datasets efficiently', () => {
      const startTime = performance.now();
      
      // Test with both companies
      const results = [
        detectSector(emamiData),
        detectSector(axisBankData)
      ];
      
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(20);
      expect(results).toHaveLength(2);
      expect(results[0].sector).toBe('non_finance');
      expect(results[1].sector).toBe('finance');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle malformed data gracefully', () => {
      const malformedData = {
        name: 'Test Company',
        // Missing critical fields
      };
      
      const result = detectSector(malformedData);
      
      expect(result.sector).toBe('unknown');
      expect(result.confidence).toBeLessThan(0.5);
      expect(result.errors).toContain('insufficient_data');
    });

    test('should handle missing balance sheet data', () => {
      const incompleteData = {
        ...emamiData,
        balance_sheet: null
      };
      
      const result = detectSector(incompleteData);
      
      expect(result.confidence).toBeLessThan(0.9);
      expect(result.warnings).toContain('missing_balance_sheet');
    });

    test('should handle mixed sector signals', () => {
      const mixedData = {
        name: 'Hybrid Company',
        quarterly: {
          'Mar 2025': {
            sales: 1000,
            deposits: 500, // This creates confusion
            operating_profit: 200,
            financing_profit: 100
          }
        }
      };
      
      const result = detectSector(mixedData);
      
      expect(result.confidence).toBeLessThan(0.8);
      expect(result.warnings).toContain('mixed_sector_signals');
    });
  });

  describe('Accuracy Requirements', () => {
    test('should achieve 95%+ accuracy requirement', () => {
      const testCases = [
        { data: emamiData, expected: 'non_finance' },
        { data: axisBankData, expected: 'finance' }
      ];
      
      const results = testCases.map(testCase => ({
        actual: detectSector(testCase.data).sector,
        expected: testCase.expected
      }));
      
      const accuracy = results.filter(r => r.actual === r.expected).length / results.length;
      
      expect(accuracy).toBeGreaterThanOrEqual(0.95);
    });
  });

  describe('Future Sector Support', () => {
    test('should be extensible for NBFC classification', () => {
      // Test framework for future NBFC support
      const mockNBFCData = {
        name: 'Test NBFC',
        quarterly: {
          'Mar 2025': {
            revenue: 1000,
            financing_profit: 200,
            // NBFC has some banking features but different structure
            borrowings: 5000,
            advances: 4000
          }
        }
      };
      
      const result = detectSector(mockNBFCData);
      
      // Should detect as finance but with lower confidence
      expect(result.sector).toBe('finance');
      expect(result.subSector).toBe('nbfc');
    });

    test('should handle insurance company detection framework', () => {
      const mockInsuranceData = {
        name: 'Test Insurance',
        quarterly: {
          'Mar 2025': {
            premium_income: 1000,
            claims_paid: 600,
            underwriting_profit: 100
          }
        }
      };
      
      const result = detectSector(mockInsuranceData);
      
      expect(result.sector).toBe('finance');
      expect(result.subSector).toBe('insurance');
    });
  });
}); 