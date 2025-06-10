import { 
  normalizeFinancialData, 
  NormalizedFinancialData,
  DataNormalizationResult,
  validateNormalizedData,
  calculateDataQualityScore
} from './data-normalizer';
import { parseNonFinanceData } from './non-finance-parser';
import { parseFinanceData } from './finance-parser';

// Use our established real company data
const emamiRawData = {
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

const axisBankRawData = {
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

describe('Data Normalizer (Unified Format)', () => {
  describe('Basic Normalization', () => {
    test('should normalize Emami (non-finance) data to unified format', () => {
      const parsedData = parseNonFinanceData(emamiRawData);
      const result = normalizeFinancialData(parsedData.data!, 'non_finance');
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.company_type).toBe('non_finance');
      expect(result.data?.normalized_data).toBeDefined();
    });

    test('should normalize Axis Bank (finance) data to unified format', () => {
      const parsedData = parseFinanceData(axisBankRawData);
      const result = normalizeFinancialData(parsedData.data!, 'finance');
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.company_type).toBe('finance');
      expect(result.data?.normalized_data).toBeDefined();
    });

    test('should apply normalization rules correctly for non-finance', () => {
      const parsedData = parseNonFinanceData(emamiRawData);
      const result = normalizeFinancialData(parsedData.data!, 'non_finance');
      
      const normalizedQuarter = result.data?.normalized_data.quarterly_data[0];
      
      // Primary Income: Sales for non-finance
      expect(normalizedQuarter?.primary_income).toBe(902); // Emami sales
      
      // Core Profit: Operating Profit for non-finance  
      expect(normalizedQuarter?.core_profit).toBeDefined();
      expect(normalizedQuarter?.core_profit).toBeGreaterThan(0);
      
      // Total Debt: All liabilities for non-finance (borrowings + other_liabilities + current_liabilities)
      const normalizedBalance = result.data?.normalized_data.balance_sheet_data[0];
      expect(normalizedBalance?.total_debt).toBe(2168); // 445 + 892 + 831
    });

    test('should apply normalization rules correctly for finance', () => {
      const parsedData = parseFinanceData(axisBankRawData);
      const result = normalizeFinancialData(parsedData.data!, 'finance');
      
      const normalizedQuarter = result.data?.normalized_data.quarterly_data[0];
      
      // Primary Income: Revenue for finance
      expect(normalizedQuarter?.primary_income).toBe(32452); // Axis revenue
      
      // Core Profit: Financing Profit for finance
      expect(normalizedQuarter?.core_profit).toBe(2389); // Axis financing profit
      
      // Total Debt: Borrowings + Deposits for finance
      const normalizedBalance = result.data?.normalized_data.balance_sheet_data[0];
      expect(normalizedBalance?.total_debt).toBe(1781044); // 389436 + 1391608
    });
  });

  describe('Unified Interface Structure', () => {
    test('should create consistent quarterly data structure', () => {
      const emamiParsed = parseNonFinanceData(emamiRawData);
      const axisParsed = parseFinanceData(axisBankRawData);
      
      const emamiNormalized = normalizeFinancialData(emamiParsed.data!, 'non_finance');
      const axisNormalized = normalizeFinancialData(axisParsed.data!, 'finance');
      
      const emamiQ = emamiNormalized.data?.normalized_data.quarterly_data[0];
      const axisQ = axisNormalized.data?.normalized_data.quarterly_data[0];
      
      // Both should have same structure despite different source fields
      const expectedFields = [
        'period', 'primary_income', 'core_profit', 'other_income', 
        'depreciation', 'profit_before_tax', 'net_profit', 'eps'
      ];
      
      expectedFields.forEach(field => {
        expect(emamiQ).toHaveProperty(field);
        expect(axisQ).toHaveProperty(field);
      });
    });

    test('should create consistent balance sheet structure', () => {
      const emamiParsed = parseNonFinanceData(emamiRawData);
      const axisParsed = parseFinanceData(axisBankRawData);
      
      const emamiNormalized = normalizeFinancialData(emamiParsed.data!, 'non_finance');
      const axisNormalized = normalizeFinancialData(axisParsed.data!, 'finance');
      
      const emamiBS = emamiNormalized.data?.normalized_data.balance_sheet_data[0];
      const axisBS = axisNormalized.data?.normalized_data.balance_sheet_data[0];
      
      const expectedFields = [
        'period', 'equity_capital', 'reserves', 'total_debt', 
        'fixed_assets', 'investments', 'total_assets'
      ];
      
      expectedFields.forEach(field => {
        expect(emamiBS).toHaveProperty(field);
        expect(axisBS).toHaveProperty(field);
      });
    });

    test('should maintain period consistency across sections', () => {
      const parsedData = parseNonFinanceData(emamiRawData);
      const result = normalizeFinancialData(parsedData.data!, 'non_finance');
      
      const quarterlyPeriods = result.data?.normalized_data.quarterly_data.map(q => q.period);
      const balanceSheetPeriods = result.data?.normalized_data.balance_sheet_data.map(bs => bs.period);
      
      expect(quarterlyPeriods).toEqual(balanceSheetPeriods);
      expect(quarterlyPeriods?.[0]).toBe('Mar 2025');
    });
  });

  describe('Sector-Specific Data Preservation', () => {
    test('should preserve non-finance specific fields', () => {
      const parsedData = parseNonFinanceData(emamiRawData);
      const result = normalizeFinancialData(parsedData.data!, 'non_finance');
      
      expect(result.data?.sector_specific_data).toBeDefined();
      expect(result.data?.sector_specific_data.working_capital_ratios).toBeDefined();
      expect(result.data?.sector_specific_data.working_capital_ratios.cash_conversion_cycle).toEqual([145, 147, 149, 151, 153, 155, 157, 159, 161, 163, 165, 167, 169]);
    });

    test('should preserve finance specific fields', () => {
      const parsedData = parseFinanceData(axisBankRawData);
      const result = normalizeFinancialData(parsedData.data!, 'finance');
      
      expect(result.data?.sector_specific_data).toBeDefined();
      expect(result.data?.sector_specific_data.banking_ratios).toBeDefined();
      expect(result.data?.sector_specific_data.banking_ratios.net_interest_margin).toEqual([7.1, 7.2, 7.1, 7.0, 6.9, 6.8, 6.7, 6.6, 6.5, 6.4, 6.3, 6.2, 6.1]);
    });

    test('should include sector-specific balance sheet fields', () => {
      const axisParsed = parseFinanceData(axisBankRawData);
      const axisNormalized = normalizeFinancialData(axisParsed.data!, 'finance');
      
      // Finance companies should have deposits preserved
      expect(axisNormalized.data?.sector_specific_data.banking_balance_sheet).toBeDefined();
      expect(axisNormalized.data?.sector_specific_data.banking_balance_sheet[0].deposits).toBe(1391608);
      expect(axisNormalized.data?.sector_specific_data.banking_balance_sheet[0].loans_and_advances).toBe(1253785);
    });

    test('should handle interest treatment differences', () => {
      const emamiParsed = parseNonFinanceData(emamiRawData);
      const axisParsed = parseFinanceData(axisBankRawData);
      
      const emamiNormalized = normalizeFinancialData(emamiParsed.data!, 'non_finance');
      const axisNormalized = normalizeFinancialData(axisParsed.data!, 'finance');
      
      // For non-finance, interest should be expense
      expect(emamiNormalized.data?.interest_treatment).toBe('expense');
      
      // For finance, interest should be core component
      expect(axisNormalized.data?.interest_treatment).toBe('core_component');
    });
  });

  describe('Data Quality Scoring', () => {
    test('should calculate accurate data quality scores', () => {
      const parsedData = parseNonFinanceData(emamiRawData);
      const result = normalizeFinancialData(parsedData.data!, 'non_finance');
      
      expect(result.data?.data_quality_score).toBeGreaterThan(90); // High quality for complete data
      expect(result.data?.completeness_score).toBeGreaterThan(85); // Good completeness
    });

    test('should score finance data quality correctly', () => {
      const parsedData = parseFinanceData(axisBankRawData);
      const result = normalizeFinancialData(parsedData.data!, 'finance');
      
      expect(result.data?.data_quality_score).toBeGreaterThan(90);
      expect(result.data?.normalization_quality).toBeGreaterThan(95); // Should be high for good normalization
    });

    test('should handle incomplete data gracefully', () => {
      const incompleteData = {
        ...emamiRawData,
        quarterly_data: [emamiRawData.quarterly_data[0]] // Only one quarter
      };
      
      const parsedData = parseNonFinanceData(incompleteData);
      const result = normalizeFinancialData(parsedData.data!, 'non_finance');
      
      expect(result.success).toBe(true);
      expect(result.data?.completeness_score).toBeLessThan(60); // Lower due to missing data
    });
  });

  describe('Metadata Tracking', () => {
    test('should include normalization metadata', () => {
      const parsedData = parseNonFinanceData(emamiRawData);
      const result = normalizeFinancialData(parsedData.data!, 'non_finance');
      
      expect(result.data?.metadata).toBeDefined();
      expect(result.data?.metadata.normalization_timestamp).toBeDefined();
      expect(result.data?.metadata.source_data_type).toBe('non_finance');
      expect(result.data?.metadata.normalization_version).toBeDefined();
    });

    test('should track data source information', () => {
      const parsedData = parseFinanceData(axisBankRawData);
      const result = normalizeFinancialData(parsedData.data!, 'finance');
      
      expect(result.data?.metadata.original_company_name).toBe('Axis Bank Ltd');
      expect(result.data?.metadata.original_sector).toBe('Private Sector Bank');
      expect(result.data?.metadata.data_source).toBe('screener_in');
    });

    test('should preserve normalization rules applied', () => {
      const parsedData = parseNonFinanceData(emamiRawData);
      const result = normalizeFinancialData(parsedData.data!, 'non_finance');
      
      const rulesApplied = result.data?.metadata.normalization_rules_applied;
      expect(rulesApplied).toContain('primary_income_from_sales');
      expect(rulesApplied).toContain('core_profit_from_operating_profit');
      expect(rulesApplied).toContain('total_debt_from_borrowings');
      expect(rulesApplied).toContain('interest_as_expense');
    });
  });

  describe('Validation & Error Handling', () => {
    test('should validate normalized data structure', () => {
      const parsedData = parseNonFinanceData(emamiRawData);
      const result = normalizeFinancialData(parsedData.data!, 'non_finance');
      
      const validation = validateNormalizedData(result.data!);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should detect normalization inconsistencies', () => {
      const invalidParsedData = {
        company_type: 'non_finance' as const,
        quarterly_data: [
          { period: 'Mar 2025', sales: -100 } // Negative sales should be caught
        ],
        annual_data: [],
        balance_sheet_data: [],
        cash_flow_data: [],
        working_capital_ratios: { cash_conversion_cycle: [], debtor_days: [], inventory_days: [], working_capital_days: [] },
        data_quality_score: 0,
        completeness_score: 0,
        sector_classification: '',
        industry_type: ''
      };
      
      const result = normalizeFinancialData(invalidParsedData, 'non_finance');
      
      expect(result.success).toBe(false);
      expect(result.errors).toContain('negative_primary_income');
    });

    test('should handle null input gracefully', () => {
      const result = normalizeFinancialData(null as any, 'non_finance');
      
      expect(result.success).toBe(false);
      expect(result.errors).toContain('null_input_data');
    });

    test('should validate sector consistency', () => {
      const parsedData = parseFinanceData(axisBankRawData);
      // Try to normalize finance data as non-finance (should fail)
      const result = normalizeFinancialData(parsedData.data!, 'non_finance');
      
      expect(result.success).toBe(false);
      expect(result.errors).toContain('sector_type_mismatch');
    });
  });

  describe('Performance Requirements', () => {
    test('should normalize data within 50ms', () => {
      const parsedData = parseNonFinanceData(emamiRawData);
      
      const startTime = performance.now();
      const result = normalizeFinancialData(parsedData.data!, 'non_finance');
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(50);
      expect(result.success).toBe(true);
    });

    test('should handle batch normalization efficiently', () => {
      const emamiParsed = parseNonFinanceData(emamiRawData);
      const axisParsed = parseFinanceData(axisBankRawData);
      
      const startTime = performance.now();
      
      // Simulate normalizing 20 companies (10 each type)
      const results = [];
      for (let i = 0; i < 10; i++) {
        results.push(normalizeFinancialData(emamiParsed.data!, 'non_finance'));
        results.push(normalizeFinancialData(axisParsed.data!, 'finance'));
      }
      
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(500); // 25ms per company average
      expect(results.every(r => r.success)).toBe(true);
    });
  });

  describe('Real Data Integration', () => {
    test('should preserve calculation-ready format', () => {
      const parsedData = parseNonFinanceData(emamiRawData);
      const result = normalizeFinancialData(parsedData.data!, 'non_finance');
      
      const normalizedData = result.data?.normalized_data;
      
      // Should be ready for universal ratio calculations
      expect(normalizedData?.quarterly_data[0].primary_income).toBeGreaterThan(0);
      expect(normalizedData?.quarterly_data[0].net_profit).toBeGreaterThan(0);
      expect(normalizedData?.balance_sheet_data[0].total_assets).toBeGreaterThan(0);
    });

    test('should maintain data precision during normalization', () => {
      const parsedData = parseFinanceData(axisBankRawData);
      const result = normalizeFinancialData(parsedData.data!, 'finance');
      
      // Original Axis quarterly data should be preserved precisely
      expect(result.data?.normalized_data.quarterly_data[0].primary_income).toBe(32452);
      expect(result.data?.normalized_data.quarterly_data[0].net_profit).toBe(7509);
      expect(result.data?.normalized_data.quarterly_data[0].eps).toBe(24.13);
    });

    test('should support both quarterly and annual normalization', () => {
      const parsedData = parseNonFinanceData(emamiRawData);
      const result = normalizeFinancialData(parsedData.data!, 'non_finance');
      
      expect(result.data?.normalized_data.quarterly_data).toHaveLength(2);
      expect(result.data?.normalized_data.annual_data).toHaveLength(2);
      
      // Annual data should also follow normalization rules
      expect(result.data?.normalized_data.annual_data[0].primary_income).toBe(3421); // Emami annual sales
    });
  });
}); 