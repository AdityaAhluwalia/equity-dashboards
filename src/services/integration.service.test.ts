/**
 * Integration Service Tests
 * Task 4.2: Parser Service Integration
 * Following TDD principles - testing the connection between calculation engine and database
 */

import { IntegrationService, ImportResult, ImportOptions } from './integration.service';
import { DatabaseService } from './database.service';

// Mock the database service
jest.mock('./database.service', () => ({
  DatabaseService: jest.fn().mockImplementation(() => ({
    getCompanyBySymbol: jest.fn(),
    createCompany: jest.fn(),
    createFinancialSnapshot: jest.fn(),
    createAnnualMetrics: jest.fn(),
    upsertCalculatedRatios: jest.fn(),
  })),
  getDatabaseService: jest.fn(() => ({
    getCompanyBySymbol: jest.fn(),
    createCompany: jest.fn(),
    createFinancialSnapshot: jest.fn(),
    createAnnualMetrics: jest.fn(),
    upsertCalculatedRatios: jest.fn(),
  })),
}));

// Mock the parsers
jest.mock('../lib/parsers/non-finance-parser', () => ({
  parseNonFinanceData: jest.fn(),
}));

jest.mock('../lib/parsers/finance-parser', () => ({
  parseFinanceData: jest.fn(),
}));

// Mock the calculation functions
jest.mock('../lib/calculations/universal-ratios', () => ({
  calculateUniversalRatios: jest.fn(),
}));

jest.mock('../lib/calculations/non-finance-ratios', () => ({
  calculateNonFinanceRatios: jest.fn(),
}));

jest.mock('../lib/calculations/finance-ratios', () => ({
  calculateFinanceRatios: jest.fn(),
}));

describe('IntegrationService', () => {
  let integrationService: IntegrationService;
  let mockDbService: jest.Mocked<DatabaseService>;

  beforeEach(() => {
    mockDbService = {
      getCompanyBySymbol: jest.fn(),
      createCompany: jest.fn(),
      createFinancialSnapshot: jest.fn(),
      createAnnualMetrics: jest.fn(),
      upsertCalculatedRatios: jest.fn(),
    } as any;

    integrationService = new IntegrationService(mockDbService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Data Validation', () => {
    it('should validate required company symbol', async () => {
      const invalidData = {
        company: { name: 'Test Company' },
        annualData: { 2023: { revenue: 1000 } }
      };

      const result = await integrationService.importCompanyData(invalidData);

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Company symbol is required');
    });

    it('should validate required company name', async () => {
      const invalidData = {
        company: { symbol: 'TEST' },
        annualData: { 2023: { revenue: 1000 } }
      };

      const result = await integrationService.importCompanyData(invalidData);

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Company name is required');
    });

    it('should validate required annual data', async () => {
      const invalidData = {
        company: { symbol: 'TEST', name: 'Test Company' },
        annualData: {}
      };

      const result = await integrationService.importCompanyData(invalidData);

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Annual financial data is required');
    });

    it('should pass validation with complete data', async () => {
      const validData = {
        company: { 
          symbol: 'TEST', 
          name: 'Test Company',
          sector: 'Technology'
        },
        annualData: { 
          2023: { 
            revenue: 1000,
            netProfit: 100,
            totalAssets: 2000,
            totalEquity: 800
          } 
        }
      };

      // Mock successful parsing
      const { parseNonFinanceData } = require('../lib/parsers/non-finance-parser');
      parseNonFinanceData.mockReturnValue(validData);

      // Mock successful database operations
      mockDbService.getCompanyBySymbol.mockResolvedValue(null);
      mockDbService.createCompany.mockResolvedValue({ id: 'company-id', symbol: 'TEST' });
      mockDbService.createFinancialSnapshot.mockResolvedValue({ id: 'snapshot-id' });
      mockDbService.createAnnualMetrics.mockResolvedValue({ id: 'metrics-id' });
      mockDbService.upsertCalculatedRatios.mockResolvedValue({ id: 'ratios-id' });

      // Mock calculation functions
      const { calculateUniversalRatios } = require('../lib/calculations/universal-ratios');
      const { calculateNonFinanceRatios } = require('../lib/calculations/non-finance-ratios');
      
      calculateUniversalRatios.mockReturnValue({
        roe: 0.15,
        priceToBook: 2.5,
        priceToEarnings: 15,
        assetTurnover: 0.5,
        debtToEquity: 0.3,
        revenueGrowth3Y: 0.1,
        revenueGrowth5Y: 0.12,
        profitGrowth3Y: 0.15,
        profitGrowth5Y: 0.18
      });

      calculateNonFinanceRatios.mockReturnValue({
        returnOnCapitalEmployed: 0.18,
        workingCapitalDays: 45,
        cashConversionCycle: 60,
        interestCoverageRatio: 8,
        currentRatio: 1.5,
        quickRatio: 1.2
      });

      const result = await integrationService.importCompanyData(validData);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Company Management', () => {
    it('should create new company when not exists', async () => {
      const companyData = {
        company: { 
          symbol: 'NEWCO', 
          name: 'New Company',
          sector: 'Technology'
        },
        annualData: { 
          2023: { revenue: 1000 } 
        }
      };

      // Mock parsing
      const { parseNonFinanceData } = require('../lib/parsers/non-finance-parser');
      parseNonFinanceData.mockReturnValue(companyData);

      // Mock database operations
      mockDbService.getCompanyBySymbol.mockResolvedValue(null); // Company doesn't exist
      mockDbService.createCompany.mockResolvedValue({ 
        id: 'new-company-id', 
        symbol: 'NEWCO',
        name: 'New Company'
      });
      mockDbService.createFinancialSnapshot.mockResolvedValue({ id: 'snapshot-id' });
      mockDbService.createAnnualMetrics.mockResolvedValue({ id: 'metrics-id' });
      mockDbService.upsertCalculatedRatios.mockResolvedValue({ id: 'ratios-id' });

      // Mock calculations
      const { calculateUniversalRatios } = require('../lib/calculations/universal-ratios');
      const { calculateNonFinanceRatios } = require('../lib/calculations/non-finance-ratios');
      
      calculateUniversalRatios.mockReturnValue({ roe: 0.15 });
      calculateNonFinanceRatios.mockReturnValue({ currentRatio: 1.5 });

      const result = await integrationService.importCompanyData(companyData);

      expect(mockDbService.createCompany).toHaveBeenCalledWith({
        symbol: 'NEWCO',
        name: 'New Company',
        sector: 'Technology',
        industry: null,
        company_type: 'general',
        market_cap: null,
        is_active: true,
      });
      expect(result.success).toBe(true);
      expect(result.companyId).toBe('new-company-id');
    });

    it('should use existing company when found', async () => {
      const companyData = {
        company: { 
          symbol: 'EXISTING', 
          name: 'Existing Company'
        },
        annualData: { 
          2023: { revenue: 1000 } 
        }
      };

      // Mock parsing
      const { parseNonFinanceData } = require('../lib/parsers/non-finance-parser');
      parseNonFinanceData.mockReturnValue(companyData);

      // Mock database operations
      mockDbService.getCompanyBySymbol.mockResolvedValue({ 
        id: 'existing-company-id', 
        symbol: 'EXISTING' 
      });
      mockDbService.createFinancialSnapshot.mockResolvedValue({ id: 'snapshot-id' });
      mockDbService.createAnnualMetrics.mockResolvedValue({ id: 'metrics-id' });
      mockDbService.upsertCalculatedRatios.mockResolvedValue({ id: 'ratios-id' });

      // Mock calculations
      const { calculateUniversalRatios } = require('../lib/calculations/universal-ratios');
      const { calculateNonFinanceRatios } = require('../lib/calculations/non-finance-ratios');
      
      calculateUniversalRatios.mockReturnValue({ roe: 0.15 });
      calculateNonFinanceRatios.mockReturnValue({ currentRatio: 1.5 });

      const result = await integrationService.importCompanyData(companyData);

      expect(mockDbService.createCompany).not.toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.companyId).toBe('existing-company-id');
    });
  });

  describe('Finance Company Detection', () => {
    it('should detect finance company by sector', async () => {
      const financeCompanyData = {
        company: { 
          symbol: 'BANK', 
          name: 'Test Bank',
          sector: 'Banking'
        },
        annualData: { 
          2023: { revenue: 1000 } 
        }
      };

      // Mock parsing
      const { parseFinanceData } = require('../lib/parsers/finance-parser');
      parseFinanceData.mockReturnValue(financeCompanyData);

      // Mock database operations
      mockDbService.getCompanyBySymbol.mockResolvedValue(null);
      mockDbService.createCompany.mockResolvedValue({ 
        id: 'bank-id', 
        symbol: 'BANK' 
      });
      mockDbService.createFinancialSnapshot.mockResolvedValue({ id: 'snapshot-id' });
      mockDbService.createAnnualMetrics.mockResolvedValue({ id: 'metrics-id' });
      mockDbService.upsertCalculatedRatios.mockResolvedValue({ id: 'ratios-id' });

      // Mock calculations
      const { calculateUniversalRatios } = require('../lib/calculations/universal-ratios');
      const { calculateFinanceRatios } = require('../lib/calculations/finance-ratios');
      
      calculateUniversalRatios.mockReturnValue({ roe: 0.15 });
      calculateFinanceRatios.mockReturnValue({ 
        netInterestMargin: 0.03,
        loanGrowthRate: 0.12 
      });

      const result = await integrationService.importCompanyData(financeCompanyData);

      expect(mockDbService.createCompany).toHaveBeenCalledWith(
        expect.objectContaining({
          company_type: 'banking'
        })
      );
      expect(result.success).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle parsing errors gracefully', async () => {
      const invalidData = {
        company: { symbol: 'TEST', name: 'Test Company' },
        annualData: { 2023: { revenue: 1000 } }
      };

      // Mock parsing failure
      const { parseNonFinanceData } = require('../lib/parsers/non-finance-parser');
      parseNonFinanceData.mockReturnValue(null);

      const result = await integrationService.importCompanyData(invalidData);

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Failed to parse company data');
    });

    it('should handle database errors gracefully', async () => {
      const validData = {
        company: { symbol: 'TEST', name: 'Test Company' },
        annualData: { 2023: { revenue: 1000 } }
      };

      // Mock successful parsing
      const { parseNonFinanceData } = require('../lib/parsers/non-finance-parser');
      parseNonFinanceData.mockReturnValue(validData);

      // Mock database error
      mockDbService.getCompanyBySymbol.mockRejectedValue(new Error('Database connection failed'));

      const result = await integrationService.importCompanyData(validData);

      expect(result.success).toBe(false);
      expect(result.errors[0]).toContain('Failed to create or retrieve company');
    });
  });

  describe('Import Options', () => {
    it('should skip validation when validateData is false', async () => {
      const invalidData = {
        company: {}, // Missing required fields
        annualData: {}
      };

      const options: ImportOptions = {
        validateData: false
      };

      // Mock parsing failure (since data is invalid)
      const { parseNonFinanceData } = require('../lib/parsers/non-finance-parser');
      parseNonFinanceData.mockReturnValue(null);

      const result = await integrationService.importCompanyData(invalidData, options);

      // Should fail at parsing stage, not validation
      expect(result.errors).toContain('Failed to parse company data');
      expect(result.errors).not.toContain('Company symbol is required');
    });

    it('should skip ratio calculations when calculateRatios is false', async () => {
      const validData = {
        company: { symbol: 'TEST', name: 'Test Company' },
        annualData: { 2023: { revenue: 1000 } }
      };

      const options: ImportOptions = {
        calculateRatios: false
      };

      // Mock successful operations
      const { parseNonFinanceData } = require('../lib/parsers/non-finance-parser');
      parseNonFinanceData.mockReturnValue(validData);

      mockDbService.getCompanyBySymbol.mockResolvedValue(null);
      mockDbService.createCompany.mockResolvedValue({ id: 'company-id' });
      mockDbService.createFinancialSnapshot.mockResolvedValue({ id: 'snapshot-id' });
      mockDbService.createAnnualMetrics.mockResolvedValue({ id: 'metrics-id' });

      const result = await integrationService.importCompanyData(validData, options);

      expect(mockDbService.upsertCalculatedRatios).not.toHaveBeenCalled();
      expect(result.ratiosCalculated).toBe(false);
    });
  });
}); 