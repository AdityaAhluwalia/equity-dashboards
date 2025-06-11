/**
 * Database Service Tests
 * Task 4.1: Database Schema Implementation Service Layer
 * Following TDD principles - testing all database operations
 */

import { DatabaseService, Company, AnnualMetrics, CalculatedRatios, CompanyOverview } from './database.service';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
    rpc: jest.fn(),
  })),
}));

describe('DatabaseService', () => {
  let databaseService: DatabaseService;
  let mockSupabase: any;
  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    // Store original environment
    originalEnv = process.env;
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  beforeEach(() => {
    // Reset environment for each test
    process.env = { ...originalEnv };
    
    // Set up test environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

    databaseService = new DatabaseService();
    mockSupabase = (databaseService as any).supabase;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should throw error when Supabase URL is missing', () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;

      expect(() => new DatabaseService()).toThrow('Missing Supabase configuration');
    });

    it('should throw error when Supabase key is missing', () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      expect(() => new DatabaseService()).toThrow('Missing Supabase configuration');
    });

    it('should initialize successfully with valid configuration', () => {
      expect(databaseService).toBeInstanceOf(DatabaseService);
    });
  });

  describe('Company Operations', () => {
    const mockCompany: Company = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      sector: 'Energy',
      industry: 'Oil & Gas',
      company_type: 'general',
      market_cap: 1500000.00,
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    describe('getCompanies', () => {
      it('should fetch companies with default parameters', async () => {
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: [mockCompany], error: null }),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        const result = await databaseService.getCompanies();

        expect(mockSupabase.from).toHaveBeenCalledWith('companies');
        expect(mockQuery.select).toHaveBeenCalledWith('*');
        expect(mockQuery.eq).toHaveBeenCalledWith('is_active', true);
        expect(mockQuery.order).toHaveBeenCalledWith('name');
        expect(result).toEqual([mockCompany]);
      });

      it('should filter by sector when provided', async () => {
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: [mockCompany], error: null }),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        await databaseService.getCompanies({ sector: 'Energy' });

        expect(mockQuery.eq).toHaveBeenCalledWith('sector', 'Energy');
        expect(mockQuery.eq).toHaveBeenCalledWith('is_active', true);
      });

      it('should filter by company type when provided', async () => {
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: [mockCompany], error: null }),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        await databaseService.getCompanies({ company_type: 'banking' });

        expect(mockQuery.eq).toHaveBeenCalledWith('company_type', 'banking');
      });

      it('should handle pagination with limit and offset', async () => {
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          range: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: [mockCompany], error: null }),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        await databaseService.getCompanies({ limit: 10, offset: 20 });

        expect(mockQuery.limit).toHaveBeenCalledWith(10);
        expect(mockQuery.range).toHaveBeenCalledWith(20, 29);
      });

      it('should throw error when database operation fails', async () => {
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ 
            data: null, 
            error: { message: 'Database error' } 
          }),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        await expect(databaseService.getCompanies()).rejects.toThrow('Failed to fetch companies: Database error');
      });
    });

    describe('getCompanyBySymbol', () => {
      it('should fetch company by symbol successfully', async () => {
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockCompany, error: null }),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        const result = await databaseService.getCompanyBySymbol('RELIANCE');

        expect(mockSupabase.from).toHaveBeenCalledWith('companies');
        expect(mockQuery.eq).toHaveBeenCalledWith('symbol', 'RELIANCE');
        expect(result).toEqual(mockCompany);
      });

      it('should return null when company is not found', async () => {
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ 
            data: null, 
            error: { code: 'PGRST116' } // No rows returned
          }),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        const result = await databaseService.getCompanyBySymbol('NONEXISTENT');

        expect(result).toBeNull();
      });

      it('should throw error for other database errors', async () => {
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ 
            data: null, 
            error: { code: 'OTHER_ERROR', message: 'Database error' } 
          }),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        await expect(databaseService.getCompanyBySymbol('RELIANCE')).rejects.toThrow('Failed to fetch company: Database error');
      });
    });

    describe('createCompany', () => {
      it('should create company successfully', async () => {
        const newCompany = {
          symbol: 'NEWCO',
          name: 'New Company Ltd',
          sector: 'Technology',
          industry: 'Software',
          company_type: 'general' as const,
          market_cap: 50000.00,
          is_active: true,
        };

        const mockQuery = {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { ...newCompany, id: 'new-id' }, error: null }),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        const result = await databaseService.createCompany(newCompany);

        expect(mockSupabase.from).toHaveBeenCalledWith('companies');
        expect(mockQuery.insert).toHaveBeenCalledWith(newCompany);
        expect(result.symbol).toBe('NEWCO');
        expect(result.id).toBe('new-id');
      });

      it('should throw error when company creation fails', async () => {
        const mockQuery = {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ 
            data: null, 
            error: { message: 'Duplicate symbol' } 
          }),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        await expect(databaseService.createCompany({} as any)).rejects.toThrow('Failed to create company: Duplicate symbol');
      });
    });
  });

  describe('Annual Metrics Operations', () => {
    const mockMetrics: AnnualMetrics = {
      id: '456e7890-e89b-12d3-a456-426614174000',
      company_id: '123e4567-e89b-12d3-a456-426614174000',
      fiscal_year: 2023,
      revenue: 500000.00,
      operating_profit: 50000.00,
      net_profit: 40000.00,
      ebitda: 60000.00,
      opm_percent: 10.0,
      npm_percent: 8.0,
      ebitda_margin_percent: 12.0,
      total_assets: 1000000.00,
      total_equity: 600000.00,
      total_debt: 300000.00,
      cash_and_equivalents: 100000.00,
      operating_cash_flow: 45000.00,
      investing_cash_flow: -20000.00,
      financing_cash_flow: -15000.00,
      free_cash_flow: 25000.00,
      eps: 25.50,
      book_value_per_share: 380.00,
      revenue_growth_yoy: 15.5,
      profit_growth_yoy: 12.3,
      eps_growth_yoy: 18.2,
      created_at: '2024-01-01T00:00:00Z',
      snapshot_id: null,
    };

    describe('getAnnualMetrics', () => {
      it('should fetch annual metrics with default parameters', async () => {
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: [mockMetrics], error: null }),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        const result = await databaseService.getAnnualMetrics('123e4567-e89b-12d3-a456-426614174000');

        expect(mockSupabase.from).toHaveBeenCalledWith('annual_metrics');
        expect(mockQuery.eq).toHaveBeenCalledWith('company_id', '123e4567-e89b-12d3-a456-426614174000');
        expect(mockQuery.order).toHaveBeenCalledWith('fiscal_year', { ascending: false });
        expect(mockQuery.limit).toHaveBeenCalledWith(12);
        expect(result).toEqual([mockMetrics]);
      });

      it('should filter by year range when provided', async () => {
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          gte: jest.fn().mockReturnThis(),
          lte: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: [mockMetrics], error: null }),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        await databaseService.getAnnualMetrics('company-id', { 
          from_year: 2020, 
          to_year: 2023 
        });

        expect(mockQuery.gte).toHaveBeenCalledWith('fiscal_year', 2020);
        expect(mockQuery.lte).toHaveBeenCalledWith('fiscal_year', 2023);
      });
    });

    describe('createAnnualMetrics', () => {
      it('should create annual metrics successfully', async () => {
        const newMetrics = { ...mockMetrics };
        delete (newMetrics as any).id;
        delete (newMetrics as any).created_at;

        const mockQuery = {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockMetrics, error: null }),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        const result = await databaseService.createAnnualMetrics(newMetrics);

        expect(mockSupabase.from).toHaveBeenCalledWith('annual_metrics');
        expect(mockQuery.insert).toHaveBeenCalledWith(newMetrics);
        expect(result).toEqual(mockMetrics);
      });
    });
  });

  describe('Calculated Ratios Operations', () => {
    const mockRatios: CalculatedRatios = {
      id: '789e0123-e89b-12d3-a456-426614174000',
      company_id: '123e4567-e89b-12d3-a456-426614174000',
      period_date: '2023-12-31',
      period_type: 'annual',
      price_to_book: 2.5,
      price_to_sales: 1.8,
      pe_ratio: 15.2,
      roe_percent: 25.3,
      roce_percent: 22.1,
      roa_percent: 12.5,
      debt_to_equity: 0.45,
      current_ratio: 1.8,
      calculated_at: '2024-01-01T00:00:00Z',
      snapshot_id: null,
      market_cap_to_cash_flow: null,
      ev_to_ebitda: null,
      asset_turnover: null,
      equity_turnover: null,
      working_capital_days: null,
      cash_conversion_cycle: null,
      debt_to_assets: null,
      equity_ratio: null,
      interest_coverage: null,
      quick_ratio: null,
      operating_cash_flow_margin: null,
      free_cash_flow_yield: null,
      cash_conversion_efficiency: null,
      earnings_quality_score: null,
      revenue_volatility: null,
      margin_stability: null,
      revenue_cagr_3y: null,
      revenue_cagr_5y: null,
      revenue_cagr_10y: null,
      profit_cagr_3y: null,
      profit_cagr_5y: null,
      profit_cagr_10y: null,
      npa_percent: null,
      loan_book_growth: null,
      credit_cost_ratio: null,
    };

    describe('getCalculatedRatios', () => {
      it('should fetch calculated ratios with default parameters', async () => {
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: [mockRatios], error: null }),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        const result = await databaseService.getCalculatedRatios('123e4567-e89b-12d3-a456-426614174000');

        expect(mockSupabase.from).toHaveBeenCalledWith('calculated_ratios');
        expect(mockQuery.eq).toHaveBeenCalledWith('company_id', '123e4567-e89b-12d3-a456-426614174000');
        expect(mockQuery.eq).toHaveBeenCalledWith('period_type', 'annual');
        expect(result).toEqual([mockRatios]);
      });

      it('should filter by period type when provided', async () => {
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({ data: [mockRatios], error: null }),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        await databaseService.getCalculatedRatios('company-id', 'quarterly');

        expect(mockQuery.eq).toHaveBeenCalledWith('period_type', 'quarterly');
      });
    });

    describe('upsertCalculatedRatios', () => {
      it('should upsert calculated ratios successfully', async () => {
        const newRatios = { ...mockRatios };
        delete (newRatios as any).id;
        delete (newRatios as any).calculated_at;

        const mockQuery = {
          upsert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockRatios, error: null }),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        const result = await databaseService.upsertCalculatedRatios(newRatios);

        expect(mockSupabase.from).toHaveBeenCalledWith('calculated_ratios');
        expect(mockQuery.upsert).toHaveBeenCalledWith(newRatios, {
          onConflict: 'company_id,period_date,period_type'
        });
        expect(result).toEqual(mockRatios);
      });
    });
  });

  describe('Company Overview Operations', () => {
    const mockOverview: CompanyOverview = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      sector: 'Energy',
      industry: 'Oil & Gas',
      company_type: 'general',
      market_cap: 1500000.00,
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      revenue: 500000.00,
      net_profit: 40000.00,
      revenue_growth_yoy: 15.5,
      opm_percent: 10.0,
      npm_percent: 8.0,
      pe_ratio: 15.2,
      price_to_book: 2.5,
      roe_percent: 25.3,
      debt_to_equity: 0.45,
    };

    describe('getCompanyOverview', () => {
      it('should fetch company overview successfully', async () => {
        const mockQuery = {
          select: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: [mockOverview], error: null }),
        };
        mockSupabase.from.mockReturnValue(mockQuery);

        const result = await databaseService.getCompanyOverview();

        expect(mockSupabase.from).toHaveBeenCalledWith('company_overview');
        expect(mockQuery.select).toHaveBeenCalledWith('*');
        expect(result).toEqual([mockOverview]);
      });
    });
  });

  describe('Time Series Operations', () => {
    describe('getCompanyTimeSeries', () => {
      it('should fetch time series data successfully', async () => {
        const mockTimeSeriesData = [
          { period_date: '2023-12-31', metric_value: 500000 },
          { period_date: '2022-12-31', metric_value: 450000 },
        ];

        mockSupabase.rpc.mockResolvedValue({ data: mockTimeSeriesData, error: null });

        const result = await databaseService.getCompanyTimeSeries('company-id', 'revenue');

        expect(mockSupabase.rpc).toHaveBeenCalledWith('get_company_time_series', {
          p_company_id: 'company-id',
          p_metric_name: 'revenue',
          p_limit: 12
        });
        expect(result).toEqual(mockTimeSeriesData);
      });
    });
  });

  describe('Health Check', () => {
    it('should return true when database is healthy', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ error: null }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await databaseService.healthCheck();

      expect(result).toBe(true);
    });

    it('should return false when database has errors', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ error: { message: 'Connection error' } }),
      };
      mockSupabase.from.mockReturnValue(mockQuery);

      const result = await databaseService.healthCheck();

      expect(result).toBe(false);
    });

    it('should return false when database throws exception', async () => {
      mockSupabase.from.mockImplementation(() => {
        throw new Error('Connection error');
      });

      const result = await databaseService.healthCheck();

      expect(result).toBe(false);
    });
  });
}); 