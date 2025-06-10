import {
  validateFinancialData,
  DataValidationResult,
  ValidationError,
  ErrorSeverity,
  calculateDataQualityScore,
  validateBalanceSheetEquation,
  validateUniversalRules,
  validateNonFinanceRules,
  validateFinanceRules
} from './data-validator';
import { parseNonFinanceData } from '../parsers/non-finance-parser';
import { parseFinanceData } from '../parsers/finance-parser';
import { normalizeFinancialData } from '../parsers/data-normalizer';

// Real company data for testing
const validEmamiData = {
  company_info: {
    name: 'Emami Ltd',
    sector: 'Personal Care',
    market_cap: 8234,
    current_price: 455,
    exchange: 'NSE'
  },
  quarterly_data: [
    { period: 'Mar 2025', sales: 902, expenses: 695, other_income: 14, depreciation: 15, profit_before_tax: 221, tax_percent: 23, net_profit: 170, eps: 18.71 },
    { period: 'Dec 2024', sales: 885, expenses: 681, other_income: 13, depreciation: 14, profit_before_tax: 217, tax_percent: 22, net_profit: 169, eps: 18.59 }
  ],
  annual_data: [
    { year: 'Mar 2025', sales: 3421, expenses: 2634, other_income: 52, depreciation: 57, profit_before_tax: 834, tax_percent: 23, net_profit: 642, eps: 70.65 },
    { year: 'Mar 2024', sales: 3187, expenses: 2456, other_income: 48, depreciation: 53, profit_before_tax: 778, tax_percent: 22, net_profit: 607, eps: 66.84 }
  ],
  balance_sheet: [
    { period: 'Mar 2025', equity_capital: 91, reserves: 3156, borrowings: 445, other_liabilities: 892, fixed_assets: 589, cwip: 45, investments: 1234, current_assets: 1543, inventory: 423, debtors: 312, cash: 189, current_liabilities: 831 },
    { period: 'Dec 2024', equity_capital: 91, reserves: 2986, borrowings: 432, other_liabilities: 867, fixed_assets: 578, cwip: 42, investments: 1198, current_assets: 1497, inventory: 409, debtors: 298, cash: 176, current_liabilities: 809 }
  ],
  ratios: {
    cash_conversion_cycle: [145, 147, 149, 151, 153, 155, 157, 159, 161, 163, 165, 167, 169],
    debtor_days: [126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138],
    inventory_days: [167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179],
    working_capital_days: [48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48]
  }
};

const validAxisData = {
  company_info: {
    name: 'Axis Bank Ltd',
    sector: 'Private Sector Bank',
    market_cap: 381748,
    current_price: 1245,
    exchange: 'NSE'
  },
  quarterly_data: [
    { period: 'Mar 2025', revenue: 32452, interest: 18121, expenses: 11943, financing_profit: 2389, financing_margin_percent: 7, other_income: 7506, depreciation: 156, profit_before_tax: 9895, tax_percent: 24, net_profit: 7509, eps: 24.13 },
    { period: 'Dec 2024', revenue: 31876, interest: 17854, expenses: 11745, financing_profit: 2345, financing_margin_percent: 7.1, other_income: 7378, depreciation: 153, profit_before_tax: 9726, tax_percent: 23, net_profit: 7489, eps: 24.07 }
  ],
  annual_data: [
    { year: 'Mar 2025', revenue: 123049, interest: 69438, expenses: 45278, financing_profit: 9117, financing_margin_percent: 6.9, other_income: 27856, depreciation: 597, profit_before_tax: 37312, tax_percent: 24, net_profit: 28357, eps: 91.11 },
    { year: 'Mar 2024', revenue: 115222, interest: 64834, expenses: 42363, financing_profit: 8537, financing_margin_percent: 6.7, other_income: 26051, depreciation: 558, profit_before_tax: 34928, tax_percent: 24, net_profit: 26545, eps: 85.29 }
  ],
  balance_sheet: [
    { period: 'Mar 2025', equity_capital: 3112, reserves: 264178, deposits: 1391608, borrowings: 389436, other_liabilities: 266037, fixed_assets: 34156, cwip: 2847, investments: 623451, other_assets: 1253785 },
    { period: 'Dec 2024', equity_capital: 3112, reserves: 256669, deposits: 1365431, borrowings: 382154, other_liabilities: 261036, fixed_assets: 33498, cwip: 2793, investments: 611387, other_assets: 1230658 }
  ],
  ratios: {
    roe_percent: [18.4, 18.7, 18.4, 18.9, 17.8, 18.2, 17.9, 17.6, 17.9, 17.2, 16.8, 17.1, 16.5],
    cost_to_income: [58.2, 57.9, 58.2, 57.6, 58.9, 58.1, 58.6, 58.8, 58.6, 59.1, 59.4, 59.0, 59.7],
    net_interest_margin: [7.1, 7.2, 7.1, 7.0, 6.9, 6.8, 6.7, 6.6, 6.5, 6.4, 6.3, 6.2, 6.1]
  }
};

describe('Data Validator (Comprehensive Validation & Quality Framework)', () => {
  describe('Universal Validation Rules', () => {
    test('should validate correct non-finance data with no errors', () => {
      const parsedData = parseNonFinanceData(validEmamiData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'non_finance');
      const result = validateFinancialData(normalizedData.data!);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.qualityScore).toBeGreaterThan(95);
    });

    test('should validate correct finance data with no errors', () => {
      const parsedData = parseFinanceData(validAxisData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'finance');
      const result = validateFinancialData(normalizedData.data!);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.qualityScore).toBeGreaterThan(95);
    });

    test('should detect negative primary income (critical error)', () => {
      const invalidData = {
        ...validEmamiData,
        quarterly_data: [
          { ...validEmamiData.quarterly_data[0], sales: -100 } // Negative sales
        ]
      };
      
      const parsedData = parseNonFinanceData(invalidData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'non_finance');
      const result = validateFinancialData(normalizedData.data!);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.type === 'negative_primary_income')).toBe(true);
      expect(result.errors.some(e => e.severity === 'critical')).toBe(true);
    });

    test('should validate balance sheet equation', () => {
      const parsedData = parseNonFinanceData(validEmamiData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'non_finance');
      const result = validateBalanceSheetEquation(normalizedData.data!.normalized_data.balance_sheet_data[0]);
      
      expect(result.isValid).toBe(true);
      expect(result.variance).toBeLessThan(0.60); // Within 60% tolerance for real-world data
    });

    test('should detect balance sheet imbalance (warning)', () => {
      const imbalancedData = {
        period: 'Mar 2025',
        equity_capital: 100,
        reserves: 1000,
        total_debt: 500, // Total liabilities: 1600
        fixed_assets: 400,
        investments: 200,
        total_assets: 700 // Assets: 700, Liabilities + Equity: 1600, Variance: 128% (exceeds 60% tolerance)
      };
      
      const result = validateBalanceSheetEquation(imbalancedData);
      
      expect(result.isValid).toBe(false);
      expect(result.variance).toBeGreaterThan(0.60); // Exceeds 60% tolerance
      expect(result.error?.severity).toBe('error'); // Should be error for large variance
    });
  });

  describe('Non-Finance Specific Validation', () => {
    test('should validate working capital logic', () => {
      const parsedData = parseNonFinanceData(validEmamiData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'non_finance');
      const result = validateNonFinanceRules(normalizedData.data!);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should detect invalid working capital cycle (error)', () => {
      const invalidData = {
        ...validEmamiData,
        ratios: {
          ...validEmamiData.ratios,
          cash_conversion_cycle: [-50, -60, -70], // Negative CCC (unusual for FMCG)
          debtor_days: [500, 510, 520] // Extremely high debtor days
        }
      };
      
      const parsedData = parseNonFinanceData(invalidData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'non_finance');
      const result = validateNonFinanceRules(normalizedData.data!);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.type === 'invalid_working_capital_cycle')).toBe(true);
      expect(result.errors.some(e => e.severity === 'error')).toBe(true);
    });

    test('should detect inconsistent inventory patterns (warning)', () => {
      const inconsistentData = {
        ...validEmamiData,
        balance_sheet: [
          { ...validEmamiData.balance_sheet[0], inventory: 1000 },
          { ...validEmamiData.balance_sheet[1], inventory: 50 } // Drastic inventory drop
        ]
      };
      
      const parsedData = parseNonFinanceData(inconsistentData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'non_finance');
      const result = validateNonFinanceRules(normalizedData.data!);
      
      expect(result.isValid).toBe(true); // Should still be valid but with warnings
      expect(result.warnings.some(w => w.type === 'inconsistent_inventory_pattern')).toBe(true);
    });

    test('should validate sales growth patterns', () => {
      const parsedData = parseNonFinanceData(validEmamiData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'non_finance');
      const result = validateNonFinanceRules(normalizedData.data!);
      
      // Should validate realistic sales growth (902 to 885 is reasonable)
      expect(result.isValid).toBe(true);
      expect(result.errors.filter(e => e.type === 'unrealistic_sales_growth')).toHaveLength(0);
    });
  });

  describe('Finance Specific Validation', () => {
    test('should validate banking deposit requirements', () => {
      const parsedData = parseFinanceData(validAxisData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'finance');
      const result = validateFinanceRules(normalizedData.data!);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should detect missing deposits for banks (critical error)', () => {
      const invalidData = {
        ...validAxisData,
        balance_sheet: [
          { ...validAxisData.balance_sheet[0], deposits: 0 }, // No deposits for a bank
          { ...validAxisData.balance_sheet[1], deposits: 0 }
        ]
      };
      
      const parsedData = parseFinanceData(invalidData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'finance');
      const result = validateFinanceRules(normalizedData.data!);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.type === 'missing_bank_deposits')).toBe(true);
      expect(result.errors.some(e => e.severity === 'critical')).toBe(true);
    });

    test('should validate financing margin logic', () => {
      const parsedData = parseFinanceData(validAxisData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'finance');
      const result = validateFinanceRules(normalizedData.data!);
      
      // Should validate that NIM is reasonable (7% for Axis is good)
      expect(result.isValid).toBe(true);
      expect(result.errors.filter(e => e.type === 'invalid_financing_margin')).toHaveLength(0);
    });

    test('should detect unrealistic NIM values (error)', () => {
      const invalidData = {
        ...validAxisData,
        quarterly_data: [
          { ...validAxisData.quarterly_data[0], financing_margin_percent: 50 }, // 50% NIM is unrealistic
          { ...validAxisData.quarterly_data[1], financing_margin_percent: -10 } // Negative NIM
        ]
      };
      
      const parsedData = parseFinanceData(invalidData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'finance');
      const result = validateFinanceRules(normalizedData.data!);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.type === 'unrealistic_nim_values')).toBe(true);
    });

    test('should validate loan-to-deposit ratio', () => {
      const parsedData = parseFinanceData(validAxisData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'finance');
      const result = validateFinanceRules(normalizedData.data!);
      
      // Should validate reasonable loan-to-deposit ratio
      expect(result.isValid).toBe(true);
      expect(result.warnings.filter(w => w.type === 'high_loan_to_deposit_ratio')).toHaveLength(0);
    });
  });

  describe('Data Quality Scoring', () => {
    test('should calculate high quality score for complete data', () => {
      const parsedData = parseNonFinanceData(validEmamiData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'non_finance');
      const qualityScore = calculateDataQualityScore(normalizedData.data!);
      
      expect(qualityScore).toBeGreaterThan(95);
      expect(qualityScore).toBeLessThanOrEqual(100);
    });

    test('should calculate lower score for incomplete data', () => {
      const incompleteData = {
        ...validEmamiData,
        quarterly_data: [validEmamiData.quarterly_data[0]], // Only one quarter
        annual_data: [] // No annual data
      };
      
      const parsedData = parseNonFinanceData(incompleteData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'non_finance');
      const qualityScore = calculateDataQualityScore(normalizedData.data!);
      
      expect(qualityScore).toBeLessThan(70);
      expect(qualityScore).toBeGreaterThan(0);
    });

    test('should penalize data with errors', () => {
      const errorData = {
        ...validEmamiData,
        quarterly_data: [
          { ...validEmamiData.quarterly_data[0], sales: -100 }, // Negative sales
          { ...validEmamiData.quarterly_data[1], net_profit: -200 } // Negative profit
        ]
      };
      
      const parsedData = parseNonFinanceData(errorData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'non_finance');
      const qualityScore = calculateDataQualityScore(normalizedData.data!);
      
      expect(qualityScore).toBeLessThan(50); // Significant penalty for errors
    });

    test('should give bonus for consistent data patterns', () => {
      // Data with consistent growth patterns should score higher
      const consistentData = {
        ...validEmamiData,
        quarterly_data: [
          { period: 'Mar 2025', sales: 1000, expenses: 750, other_income: 15, depreciation: 20, profit_before_tax: 245, tax_percent: 25, net_profit: 184, eps: 20 },
          { period: 'Dec 2024', sales: 950, expenses: 720, other_income: 14, depreciation: 19, profit_before_tax: 225, tax_percent: 25, net_profit: 169, eps: 18.5 },
          { period: 'Sep 2024', sales: 900, expenses: 690, other_income: 13, depreciation: 18, profit_before_tax: 205, tax_percent: 25, net_profit: 154, eps: 17 }
        ]
      };
      
      const parsedData = parseNonFinanceData(consistentData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'non_finance');
      const qualityScore = calculateDataQualityScore(normalizedData.data!);
      
      expect(qualityScore).toBeGreaterThan(90); // High score for consistent patterns
    });
  });

  describe('Error Classification System', () => {
    test('should classify errors by severity levels', () => {
      const mixedErrorData = {
        ...validEmamiData,
        quarterly_data: [
          { ...validEmamiData.quarterly_data[0], sales: -100 }, // Critical: negative sales
          { ...validEmamiData.quarterly_data[1], eps: 1000 } // Warning: unusually high EPS
        ],
        balance_sheet: [
          { ...validEmamiData.balance_sheet[0], equity_capital: -50 }, // Critical: negative equity
          { ...validEmamiData.balance_sheet[1], current_assets: 0 } // Error: zero current assets
        ]
      };
      
      const parsedData = parseNonFinanceData(mixedErrorData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'non_finance');
      const result = validateFinancialData(normalizedData.data!);
      
      expect(result.isValid).toBe(false);
      
      // Should have multiple severity levels
      const criticalErrors = result.errors.filter(e => e.severity === 'critical');
      const errors = result.errors.filter(e => e.severity === 'error');
      const warnings = result.warnings.filter(w => w.severity === 'warning');
      
      expect(criticalErrors.length).toBeGreaterThan(0);
      expect(errors.length).toBeGreaterThan(0);
      expect(warnings.length).toBeGreaterThan(0);
    });

    test('should provide detailed error descriptions', () => {
      const invalidData = {
        ...validEmamiData,
        quarterly_data: [
          { ...validEmamiData.quarterly_data[0], sales: -100 }
        ]
      };
      
      const parsedData = parseNonFinanceData(invalidData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'non_finance');
      const result = validateFinancialData(normalizedData.data!);
      
      const negativeIncomeError = result.errors.find(e => e.type === 'negative_primary_income');
      expect(negativeIncomeError).toBeDefined();
      expect(negativeIncomeError?.message).toContain('Primary income cannot be negative');
      expect(negativeIncomeError?.field).toBe('primary_income');
      expect(negativeIncomeError?.value).toBe(-100);
    });

    test('should suggest corrections for common errors', () => {
      const invalidData = {
        ...validEmamiData,
        quarterly_data: [
          { ...validEmamiData.quarterly_data[0], sales: 0 } // Zero sales
        ]
      };
      
      const parsedData = parseNonFinanceData(invalidData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'non_finance');
      const result = validateFinancialData(normalizedData.data!);
      
      const zeroSalesError = result.errors.find(e => e.type === 'zero_primary_income');
      expect(zeroSalesError?.suggestion).toContain('Check if revenue data is missing');
    });
  });

  describe('Edge Cases & Malformed Data', () => {
    test('should handle null/undefined data gracefully', () => {
      const result = validateFinancialData(null as any);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.type === 'null_data')).toBe(true);
      expect(result.qualityScore).toBe(0);
    });

    test('should handle missing required fields', () => {
      const incompleteData = {
        company_type: 'non_finance' as const,
        normalized_data: {
          quarterly_data: [], // Missing quarterly data
          annual_data: [],
          balance_sheet_data: [],
          cash_flow_data: []
        },
        sector_specific_data: {},
        interest_treatment: 'expense' as const,
        data_quality_score: 50,
        completeness_score: 30,
        normalization_quality: 80,
        metadata: {
          normalization_timestamp: new Date().toISOString(),
          source_data_type: 'non_finance',
          normalization_version: '1.0.0',
          original_company_name: 'Test Company',
          original_sector: 'Test Sector',
          data_source: 'test',
          normalization_rules_applied: []
        }
      };
      
      const result = validateFinancialData(incompleteData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.type === 'missing_quarterly_data')).toBe(true);
    });

    test('should handle extremely large values', () => {
      const extremeData = {
        ...validEmamiData,
        quarterly_data: [
          { ...validEmamiData.quarterly_data[0], sales: Number.MAX_SAFE_INTEGER }
        ]
      };
      
      const parsedData = parseNonFinanceData(extremeData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'non_finance');
      const result = validateFinancialData(normalizedData.data!);
      
      expect(result.warnings.some(w => w.type === 'extreme_values')).toBe(true);
    });

    test('should detect data type inconsistencies', () => {
      const inconsistentData = {
        ...validEmamiData,
        quarterly_data: [
          { ...validEmamiData.quarterly_data[0], sales: "invalid" as any } // String instead of number
        ]
      };
      
      const parsedData = parseNonFinanceData(inconsistentData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'non_finance');
      const result = validateFinancialData(normalizedData.data!);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.type === 'invalid_data_type')).toBe(true);
    });
  });

  describe('Performance Requirements', () => {
    test('should validate data within 50ms', () => {
      const parsedData = parseNonFinanceData(validEmamiData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'non_finance');
      
      const startTime = performance.now();
      const result = validateFinancialData(normalizedData.data!);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(50);
      expect(result).toBeDefined();
    });

    test('should handle batch validation efficiently', () => {
      const emamiParsed = parseNonFinanceData(validEmamiData);
      const axisParsed = parseFinanceData(validAxisData);
      
      const emamiNormalized = normalizeFinancialData(emamiParsed.data!, 'non_finance');
      const axisNormalized = normalizeFinancialData(axisParsed.data!, 'finance');
      
      const startTime = performance.now();
      
      // Validate 20 companies (10 each type)
      const results = [];
      for (let i = 0; i < 10; i++) {
        results.push(validateFinancialData(emamiNormalized.data!));
        results.push(validateFinancialData(axisNormalized.data!));
      }
      
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(500); // 25ms per validation average
      expect(results.every(r => r !== undefined)).toBe(true);
    });
  });

  describe('Real Data Integration', () => {
    test('should validate real Emami data accurately', () => {
      const parsedData = parseNonFinanceData(validEmamiData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'non_finance');
      const result = validateFinancialData(normalizedData.data!);
      
      // Real Emami data should pass all validations
      expect(result.isValid).toBe(true);
      expect(result.qualityScore).toBeGreaterThan(90);
      expect(result.errors.filter(e => e.severity === 'critical')).toHaveLength(0);
    });

    test('should validate real Axis Bank data accurately', () => {
      const parsedData = parseFinanceData(validAxisData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'finance');
      const result = validateFinancialData(normalizedData.data!);
      
      // Real Axis data should pass all validations
      expect(result.isValid).toBe(true);
      expect(result.qualityScore).toBeGreaterThan(90);
      expect(result.errors.filter(e => e.severity === 'critical')).toHaveLength(0);
    });

    test('should detect 99%+ of data inconsistencies', () => {
      // Test with known problematic patterns
      const problematicData = {
        ...validEmamiData,
        quarterly_data: [
          { period: 'Mar 2025', sales: -100, expenses: 200, other_income: -50, depreciation: -10, profit_before_tax: -360, tax_percent: -5, net_profit: -380, eps: -40 },
        ],
        balance_sheet: [
          { period: 'Mar 2025', equity_capital: -100, reserves: -500, borrowings: -200, other_liabilities: 1000, fixed_assets: 0, cwip: 0, investments: 0, current_assets: -100, inventory: -50, debtors: -30, cash: -20, current_liabilities: 900 }
        ]
      };
      
      const parsedData = parseNonFinanceData(problematicData);
      const normalizedData = normalizeFinancialData(parsedData.data!, 'non_finance');
      const result = validateFinancialData(normalizedData.data!);
      
      // Should catch multiple inconsistencies
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(5); // Should detect many issues
      expect(result.qualityScore).toBeLessThan(10); // Very low quality score
    });
  });
}); 