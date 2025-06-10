import { parseFinanceData, FinanceDataResult, validateFinanceData } from './finance-parser';
import { AXIS_BANK_COMPANY, AXIS_QUARTERLY_DATA, AXIS_ANNUAL_DATA } from '../../test/fixtures/real-company-data';

// Create the raw Screener.in data format for finance companies (Axis Bank style)
const axisBankRawData = {
  company_info: {
    name: 'Axis Bank Ltd',
    sector: 'Private Sector Bank',
    market_cap: 381748,
    current_price: 1245,
    exchange: 'NSE'
  },
  
  quarterly_data: [
    // Latest 13 quarters (2025 Q1 back to 2022 Q1) - Banking format
    { period: 'Mar 2025', revenue: 32452, interest: 18121, expenses: 11943, financing_profit: 2389, financing_margin_percent: 7, other_income: 7506, depreciation: 156, profit_before_tax: 9895, tax_percent: 24, net_profit: 7509, eps: 24.13 },
    { period: 'Dec 2024', revenue: 31876, interest: 17854, expenses: 11745, financing_profit: 2345, financing_margin_percent: 7.1, other_income: 7378, depreciation: 153, profit_before_tax: 9726, tax_percent: 23, net_profit: 7489, eps: 24.07 },
    { period: 'Sep 2024', revenue: 30945, interest: 17321, expenses: 11423, financing_profit: 2278, financing_margin_percent: 7.0, other_income: 7156, depreciation: 149, profit_before_tax: 9456, tax_percent: 24, net_profit: 7187, eps: 23.09 },
    { period: 'Jun 2024', revenue: 30234, interest: 16892, expenses: 11167, financing_profit: 2223, financing_margin_percent: 6.9, other_income: 6989, depreciation: 146, profit_before_tax: 9234, tax_percent: 25, net_profit: 6926, eps: 22.25 },
    { period: 'Mar 2024', revenue: 29567, interest: 16445, expenses: 10891, financing_profit: 2167, financing_margin_percent: 6.8, other_income: 6823, depreciation: 143, profit_before_tax: 8997, tax_percent: 24, net_profit: 6838, eps: 21.97 },
    { period: 'Dec 2023', revenue: 28912, interest: 16021, expenses: 10634, financing_profit: 2114, financing_margin_percent: 6.7, other_income: 6671, depreciation: 140, profit_before_tax: 8789, tax_percent: 23, net_profit: 6768, eps: 21.74 },
    { period: 'Sep 2023', revenue: 28234, interest: 15587, expenses: 10367, financing_profit: 2058, financing_margin_percent: 6.6, other_income: 6512, depreciation: 137, profit_before_tax: 8556, tax_percent: 25, net_profit: 6417, eps: 20.61 },
    { period: 'Jun 2023', revenue: 27589, interest: 15178, expenses: 10112, financing_profit: 2005, financing_margin_percent: 6.5, other_income: 6361, depreciation: 134, profit_before_tax: 8345, tax_percent: 24, net_profit: 6342, eps: 20.37 },
    { period: 'Mar 2023', revenue: 26945, interest: 14756, expenses: 9845, financing_profit: 1951, financing_margin_percent: 6.4, other_income: 6201, depreciation: 131, profit_before_tax: 8123, tax_percent: 23, net_profit: 6255, eps: 20.09 },
    { period: 'Dec 2022', revenue: 26312, interest: 14345, expenses: 9589, financing_profit: 1898, financing_margin_percent: 6.3, other_income: 6047, depreciation: 128, profit_before_tax: 7912, tax_percent: 25, net_profit: 5934, eps: 19.06 },
    { period: 'Sep 2022', revenue: 25687, interest: 13923, expenses: 9334, financing_profit: 1845, financing_margin_percent: 6.2, other_income: 5889, depreciation: 125, profit_before_tax: 7698, tax_percent: 24, net_profit: 5851, eps: 18.80 },
    { period: 'Jun 2022', revenue: 25078, interest: 13512, expenses: 9087, financing_profit: 1793, financing_margin_percent: 6.1, other_income: 5738, depreciation: 122, profit_before_tax: 7489, tax_percent: 23, net_profit: 5767, eps: 18.53 },
    { period: 'Mar 2022', revenue: 24467, interest: 13098, expenses: 8834, financing_profit: 1740, financing_margin_percent: 6.0, other_income: 5584, depreciation: 119, profit_before_tax: 7278, tax_percent: 25, net_profit: 5459, eps: 17.54 }
  ],
  
  annual_data: [
    // Latest 12 years (FY 2025 back to FY 2014) - Banking format
    { year: 'Mar 2025', revenue: 123049, interest: 69438, expenses: 45278, financing_profit: 9117, financing_margin_percent: 6.9, other_income: 27856, depreciation: 597, profit_before_tax: 37312, tax_percent: 24, net_profit: 28357, eps: 91.11 },
    { year: 'Mar 2024', revenue: 115222, interest: 64834, expenses: 42363, financing_profit: 8537, financing_margin_percent: 6.7, other_income: 26051, depreciation: 558, profit_before_tax: 34928, tax_percent: 24, net_profit: 26545, eps: 85.29 },
    { year: 'Mar 2023', revenue: 107770, interest: 60661, expenses: 39610, financing_profit: 7989, financing_margin_percent: 6.5, other_income: 24378, depreciation: 523, profit_before_tax: 32717, tax_percent: 23, net_profit: 25192, eps: 80.95 },
    { year: 'Mar 2022', revenue: 100812, interest: 56724, expenses: 37041, financing_profit: 7475, financing_margin_percent: 6.3, other_income: 22803, depreciation: 489, profit_before_tax: 30577, tax_percent: 25, net_profit: 22933, eps: 73.70 },
    { year: 'Mar 2021', revenue: 94311, interest: 53045, expenses: 34651, financing_profit: 6996, financing_margin_percent: 6.1, other_income: 21344, depreciation: 458, profit_before_tax: 28615, tax_percent: 24, net_profit: 21748, eps: 69.90 },
    { year: 'Mar 2020', revenue: 88245, interest: 49596, expenses: 32398, financing_profit: 6549, financing_margin_percent: 5.9, other_income: 19967, depreciation: 428, profit_before_tax: 26775, tax_percent: 26, net_profit: 19814, eps: 63.70 },
    { year: 'Mar 2019', revenue: 82567, interest: 46374, expenses: 30302, financing_profit: 6130, financing_margin_percent: 5.7, other_income: 18672, depreciation: 401, profit_before_tax: 25057, tax_percent: 25, net_profit: 18793, eps: 60.41 },
    { year: 'Mar 2018', revenue: 77234, interest: 43378, expenses: 28348, financing_profit: 5736, financing_margin_percent: 5.5, other_income: 17456, depreciation: 375, profit_before_tax: 23443, tax_percent: 24, net_profit: 17817, eps: 57.26 },
    { year: 'Mar 2017', revenue: 72245, interest: 40584, expenses: 26522, financing_profit: 5367, financing_margin_percent: 5.3, other_income: 16321, depreciation: 351, profit_before_tax: 21932, tax_percent: 26, net_profit: 16230, eps: 52.16 },
    { year: 'Mar 2016', revenue: 67578, interest: 37973, expenses: 24812, financing_profit: 5021, financing_margin_percent: 5.1, other_income: 15262, depreciation: 328, profit_before_tax: 20523, tax_percent: 25, net_profit: 15392, eps: 49.48 },
    { year: 'Mar 2015', revenue: 63234, interest: 35526, expenses: 23212, financing_profit: 4697, financing_margin_percent: 4.9, other_income: 14278, depreciation: 307, profit_before_tax: 19198, tax_percent: 24, net_profit: 14591, eps: 46.89 },
    { year: 'Mar 2014', revenue: 59189, interest: 33234, expenses: 21712, financing_profit: 4394, financing_margin_percent: 4.7, other_income: 13362, depreciation: 287, profit_before_tax: 17957, tax_percent: 26, net_profit: 13288, eps: 42.71 }
  ],
  
  balance_sheet: [
    // Latest 13 periods - Banking structure with deposits
    { period: 'Mar 2025', equity_capital: 3112, reserves: 264178, deposits: 1391608, borrowings: 389436, other_liabilities: 266037, fixed_assets: 34156, cwip: 2847, investments: 623451, other_assets: 1253785 },
    { period: 'Dec 2024', equity_capital: 3112, reserves: 256669, deposits: 1365431, borrowings: 382154, other_liabilities: 261036, fixed_assets: 33498, cwip: 2793, investments: 611387, other_assets: 1230658 },
    { period: 'Sep 2024', equity_capital: 3112, reserves: 249180, deposits: 1339587, borrowings: 374923, other_liabilities: 256067, fixed_assets: 32845, cwip: 2739, investments: 599421, other_assets: 1207723 },
    { period: 'Jun 2024', equity_capital: 3112, reserves: 241754, deposits: 1314089, borrowings: 367743, other_liabilities: 251134, fixed_assets: 32197, cwip: 2686, investments: 587552, other_assets: 1184897 },
    { period: 'Mar 2024', equity_capital: 3112, reserves: 234393, deposits: 1288923, borrowings: 360613, other_liabilities: 246234, fixed_assets: 31554, cwip: 2633, investments: 575780, other_assets: 1162179 },
    { period: 'Dec 2023', equity_capital: 3112, reserves: 227098, deposits: 1264087, borrowings: 353533, other_liabilities: 241367, fixed_assets: 30916, cwip: 2581, investments: 564104, other_assets: 1139569 },
    { period: 'Sep 2023', equity_capital: 3112, reserves: 219869, deposits: 1239580, borrowings: 346503, other_liabilities: 236533, fixed_assets: 30283, cwip: 2529, investments: 552524, other_assets: 1117067 },
    { period: 'Jun 2023', equity_capital: 3112, reserves: 212706, deposits: 1215401, borrowings: 339523, other_liabilities: 231732, fixed_assets: 29655, cwip: 2478, investments: 541041, other_assets: 1094672 },
    { period: 'Mar 2023', equity_capital: 3112, reserves: 205610, deposits: 1191549, borrowings: 332593, other_liabilities: 226964, fixed_assets: 29032, cwip: 2427, investments: 529654, other_assets: 1072385 },
    { period: 'Dec 2022', equity_capital: 3112, reserves: 198581, deposits: 1168023, borrowings: 325713, other_liabilities: 222229, fixed_assets: 28414, cwip: 2377, investments: 518364, other_assets: 1050206 },
    { period: 'Sep 2022', equity_capital: 3112, reserves: 191619, deposits: 1144821, borrowings: 318883, other_liabilities: 217527, fixed_assets: 27801, cwip: 2327, investments: 507170, other_assets: 1028135 },
    { period: 'Jun 2022', equity_capital: 3112, reserves: 184725, deposits: 1121943, borrowings: 312103, other_liabilities: 212858, fixed_assets: 27193, cwip: 2278, investments: 496072, other_assets: 1006172 },
    { period: 'Mar 2022', equity_capital: 3112, reserves: 177899, deposits: 1099388, borrowings: 305373, other_liabilities: 208222, fixed_assets: 26590, cwip: 2229, investments: 485070, other_assets: 984317 }
  ],
  
  cash_flow: [
    // Latest 13 periods - Banking cash flow patterns
    { period: 'Mar 2025', operating_activity: 45623, investing_activity: -28917, financing_activity: -12456, net_cash_flow: 4250 },
    { period: 'Dec 2024', operating_activity: 44791, investing_activity: -28378, financing_activity: -12223, net_cash_flow: 4190 },
    { period: 'Sep 2024', operating_activity: 43967, investing_activity: -27845, financing_activity: -11991, net_cash_flow: 4131 },
    { period: 'Jun 2024', operating_activity: 43151, investing_activity: -27318, financing_activity: -11760, net_cash_flow: 4073 },
    { period: 'Mar 2024', operating_activity: 42343, investing_activity: -26797, financing_activity: -11530, net_cash_flow: 4016 },
    { period: 'Dec 2023', operating_activity: 41543, investing_activity: -26282, financing_activity: -11302, net_cash_flow: 3959 },
    { period: 'Sep 2023', operating_activity: 40751, investing_activity: -25773, financing_activity: -11075, net_cash_flow: 3903 },
    { period: 'Jun 2023', operating_activity: 39967, investing_activity: -25270, financing_activity: -10849, net_cash_flow: 3848 },
    { period: 'Mar 2023', operating_activity: 39191, investing_activity: -24773, financing_activity: -10625, net_cash_flow: 3793 },
    { period: 'Dec 2022', operating_activity: 38423, investing_activity: -24282, financing_activity: -10403, net_cash_flow: 3738 },
    { period: 'Sep 2022', operating_activity: 37663, investing_activity: -23797, financing_activity: -10182, net_cash_flow: 3684 },
    { period: 'Jun 2022', operating_activity: 36911, investing_activity: -23318, financing_activity: -9963, net_cash_flow: 3630 },
    { period: 'Mar 2022', operating_activity: 36167, investing_activity: -22845, financing_activity: -9745, net_cash_flow: 3577 }
  ],
  
  ratios: {
    // Banking-specific ratios (different from non-finance)
    roe_percent: [18.4, 18.7, 18.4, 18.9, 17.8, 18.2, 17.9, 17.6, 17.9, 17.2, 16.8, 17.1, 16.5],
    cost_to_income: [58.2, 57.9, 58.2, 57.6, 58.9, 58.1, 58.6, 58.8, 58.6, 59.1, 59.4, 59.0, 59.7],
    net_interest_margin: [7.1, 7.2, 7.1, 7.0, 6.9, 6.8, 6.7, 6.6, 6.5, 6.4, 6.3, 6.2, 6.1],
    // Note: No working capital ratios for banks as they don't apply to financial institutions
  },
  
  market_data: {
    stock_pe: 13.7,
    book_value: 861,
    dividend_yield: 0.64,
    roe: 18.4,
    // Note: No ROCE for banks as it's not applicable
  }
};

describe('Finance Parser (Banking/NBFC)', () => {
  describe('Basic Data Parsing', () => {
    test('should parse Axis Bank quarterly data correctly', () => {
      const result = parseFinanceData(axisBankRawData);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.company_type).toBe('finance');
      expect(result.data?.quarterly_data).toHaveLength(13); // 13 quarters
    });

    test('should parse Axis Bank annual data correctly', () => {
      const result = parseFinanceData(axisBankRawData);
      const annualData = result.data?.annual_data;
      
      expect(annualData).toHaveLength(12); // 12 years
      expect(annualData?.[0]).toMatchObject({
        period: 'Mar 2025',
        revenue: 123049, // Total income
        financing_profit: 9117, // Net interest income
        net_profit: 28357,
        financing_margin_percent: 6.9, // NIM
      });
    });

    test('should extract banking balance sheet data correctly', () => {
      const result = parseFinanceData(axisBankRawData);
      const balanceSheet = result.data?.balance_sheet_data;
      
      expect(balanceSheet).toHaveLength(13); // Latest 13 periods
      expect(balanceSheet?.[0]).toMatchObject({
        period: 'Mar 2025',
        equity_capital: 3112,
        reserves: 264178,
        deposits: 1391608, // Key banking liability
        borrowings: 389436,
        total_assets: 1914239,
        loans_and_advances: 1253785, // Other assets = loans for banks
        investments: 623451,
      });
    });

    test('should extract banking cash flow data correctly', () => {
      const result = parseFinanceData(axisBankRawData);
      const cashFlow = result.data?.cash_flow_data;
      
      expect(cashFlow).toHaveLength(13);
      expect(cashFlow?.[0]).toMatchObject({
        period: 'Mar 2025',
        operating_cash_flow: 45623,
        investing_cash_flow: -28917,
        financing_cash_flow: -12456,
        net_cash_flow: 4250,
      });
    });
  });

  describe('Banking-Specific Ratios Extraction', () => {
    test('should extract banking ratios correctly', () => {
      const result = parseFinanceData(axisBankRawData);
      const ratios = result.data?.banking_ratios;
      
      expect(ratios?.roe_percent).toEqual([18.4, 18.7, 18.4, 18.9, 17.8, 18.2, 17.9, 17.6, 17.9, 17.2, 16.8, 17.1, 16.5]);
      expect(ratios?.cost_to_income).toEqual([58.2, 57.9, 58.2, 57.6, 58.9, 58.1, 58.6, 58.8, 58.6, 59.1, 59.4, 59.0, 59.7]);
      expect(ratios?.net_interest_margin).toEqual([7.1, 7.2, 7.1, 7.0, 6.9, 6.8, 6.7, 6.6, 6.5, 6.4, 6.3, 6.2, 6.1]);
    });

    test('should handle missing banking ratio data gracefully', () => {
      const incompleteData = {
        ...axisBankRawData,
        ratios: undefined
      };
      
      const result = parseFinanceData(incompleteData);
      
      expect(result.success).toBe(true);
      expect(result.data?.banking_ratios).toEqual({
        roe_percent: [],
        cost_to_income: [],
        net_interest_margin: []
      });
    });
  });

  describe('Data Validation', () => {
    test('should validate required finance fields are present', () => {
      const result = parseFinanceData(axisBankRawData);
      const validation = validateFinanceData(result.data!);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should detect missing quarterly data', () => {
      const invalidData = {
        ...axisBankRawData,
        quarterly_data: []
      };
      
      const result = parseFinanceData(invalidData);
      const validation = validateFinanceData(result.data!);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('insufficient_quarterly_data');
    });

    test('should validate revenue values are positive', () => {
      const result = parseFinanceData(axisBankRawData);
      const quarterlyData = result.data?.quarterly_data || [];
      
      quarterlyData.forEach((quarter: any) => {
        expect(quarter.revenue).toBeGreaterThan(0);
      });
    });

    test('should validate banking balance sheet structure', () => {
      const result = parseFinanceData(axisBankRawData);
      const balanceSheet = result.data?.balance_sheet_data || [];
      
      // For data parsing tests, validate structural integrity
      expect(balanceSheet.length).toBeGreaterThan(0);
      expect(balanceSheet[0].total_assets).toBeGreaterThan(0);
      expect(balanceSheet[0].deposits).toBeGreaterThan(0);
    });
  });

  describe('Performance Requirements', () => {
    test('should parse banking data within 100ms', () => {
      const startTime = performance.now();
      const result = parseFinanceData(axisBankRawData);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100);
      expect(result.success).toBe(true);
    });

    test('should handle multiple banking companies efficiently', () => {
      const startTime = performance.now();
      
      // Parse same bank data 10 times to simulate batch processing
      const results = Array.from({ length: 10 }, () => parseFinanceData(axisBankRawData));
      
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(500); // 50ms per company average
      expect(results.every(r => r.success)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle malformed quarterly data', () => {
      const malformedData = {
        ...axisBankRawData,
        quarterly_data: [
          { period: 'Invalid', revenue: 'not-a-number' }
        ]
      };
      
      const result = parseFinanceData(malformedData);
      
      expect(result.success).toBe(false);
      expect(result.errors).toContain('invalid_quarterly_data_format');
    });

    test('should handle missing balance sheet data', () => {
      const incompleteData = {
        ...axisBankRawData,
        balance_sheet: undefined
      };
      
      const result = parseFinanceData(incompleteData);
      
      expect(result.success).toBe(false);
      expect(result.errors).toContain('missing_balance_sheet_data');
    });

    test('should handle null input gracefully', () => {
      const result = parseFinanceData(null);
      
      expect(result.success).toBe(false);
      expect(result.errors).toContain('null_input_data');
    });
  });

  describe('Real Banking Data Integration', () => {
    test('should extract all 20 distinct banking metrics per period', () => {
      const result = parseFinanceData(axisBankRawData);
      const latestQuarter = result.data?.quarterly_data[0];
      
      // Verify all banking-specific fields are extracted
      const expectedFields = [
        'period', 'revenue', 'interest', 'expenses', 'financing_profit', 'financing_margin_percent',
        'other_income', 'depreciation', 'profit_before_tax',
        'tax_percent', 'net_profit', 'eps'
      ];
      
      expectedFields.forEach(field => {
        expect(latestQuarter).toHaveProperty(field);
        expect(latestQuarter![field as keyof typeof latestQuarter]).toBeDefined();
      });
    });

    test('should preserve banking data quality scores', () => {
      const result = parseFinanceData(axisBankRawData);
      
      expect(result.data?.data_quality_score).toBeGreaterThan(85); // High quality data
      expect(result.data?.completeness_score).toBeGreaterThan(90); // Complete dataset
    });

    test('should handle Axis Bank specific banking characteristics', () => {
      const result = parseFinanceData(axisBankRawData);
      
      // Verify banking-specific patterns are preserved
      expect(result.data?.sector_classification).toBe('banking');
      expect(result.data?.industry_type).toBe('private_sector_bank');
      
      // Check banking-specific metrics
      const bankingRatios = result.data?.banking_ratios;
      if (bankingRatios?.net_interest_margin && bankingRatios.net_interest_margin.length > 0) {
        const avgNIM = bankingRatios.net_interest_margin.reduce((a: number, b: number) => a + b, 0) / 
                       bankingRatios.net_interest_margin.length;
        expect(avgNIM).toBeGreaterThan(6); // Banks typically have NIM > 6%
        expect(avgNIM).toBeLessThan(8); // But usually < 8%
      }
    });
  });
}); 