import { 
  Company, 
  FinancialData, 
  MarketData, 
  FinancialRatios,
  OperatingCyclePeriod,
  ChartDataPoint,
  UserPreferences,
  APIResponse,
  validateCompany,
  validateFinancialData,
  validateMarketData
} from './index'

describe('TypeScript Types and Interfaces', () => {
  describe('Company interface', () => {
    const validCompany: Company = {
      id: 'TCS',
      name: 'Tata Consultancy Services',
      sector: 'Technology',
      market_cap: 1200000,
      exchange: 'NSE',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }

    it('should validate valid company data', () => {
      expect(validateCompany(validCompany)).toBe(true)
    })

    it('should reject company with missing required fields', () => {
      const invalidCompany = { ...validCompany }
      delete (invalidCompany as any).id
      expect(validateCompany(invalidCompany as Company)).toBe(false)
    })

    it('should reject company with invalid market cap', () => {
      const invalidCompany = { ...validCompany, market_cap: -100 }
      expect(validateCompany(invalidCompany)).toBe(false)
    })
  })

  describe('FinancialData interface', () => {
    const validFinancialData: FinancialData = {
      id: '1',
      company_id: 'TCS',
      period: '2024-Q1',
      period_type: 'quarterly',
      revenue: 100000,
      net_income: 25000,
      total_assets: 500000,
      total_liabilities: 200000,
      shareholders_equity: 300000,
      operating_cash_flow: 30000,
      free_cash_flow: 20000,
      current_assets: 150000,
      current_liabilities: 50000,
      inventory: 10000,
      accounts_receivable: 20000,
      accounts_payable: 15000,
      debt: 100000,
      cash: 80000,
      created_at: '2024-01-01T00:00:00Z'
    }

    it('should validate valid financial data', () => {
      expect(validateFinancialData(validFinancialData)).toBe(true)
    })

    it('should reject financial data with invalid revenue', () => {
      const invalidData = { ...validFinancialData, revenue: -1000 }
      expect(validateFinancialData(invalidData)).toBe(false)
    })

    it('should reject financial data with invalid period type', () => {
      const invalidData = { ...validFinancialData, period_type: 'invalid' as any }
      expect(validateFinancialData(invalidData)).toBe(false)
    })
  })

  describe('MarketData interface', () => {
    const validMarketData: MarketData = {
      id: '1',
      company_id: 'TCS',
      date: '2024-01-01',
      stock_price: 3500,
      shares_outstanding: 3700000000,
      pe_ratio: 25.5,
      pb_ratio: 8.2,
      dividend_yield: 1.5,
      market_cap: 1295000,
      created_at: '2024-01-01T00:00:00Z'
    }

    it('should validate valid market data', () => {
      expect(validateMarketData(validMarketData)).toBe(true)
    })

    it('should reject market data with negative stock price', () => {
      const invalidData = { ...validMarketData, stock_price: -100 }
      expect(validateMarketData(invalidData)).toBe(false)
    })

    it('should reject market data with invalid PE ratio', () => {
      const invalidData = { ...validMarketData, pe_ratio: -5 }
      expect(validateMarketData(invalidData)).toBe(false)
    })
  })

  describe('FinancialRatios interface', () => {
    it('should have all required ratio properties', () => {
      const ratios: FinancialRatios = {
        // Profitability ratios
        gross_profit_margin: 45.5,
        operating_profit_margin: 25.2,
        net_profit_margin: 18.7,
        return_on_assets: 12.5,
        return_on_equity: 28.3,
        return_on_capital_employed: 32.1,

        // Liquidity ratios
        current_ratio: 2.1,
        quick_ratio: 1.8,
        cash_ratio: 0.9,

        // Efficiency ratios
        asset_turnover: 0.8,
        inventory_turnover: 12.5,
        receivables_turnover: 8.2,
        payables_turnover: 6.1,

        // Leverage ratios
        debt_to_equity: 0.3,
        debt_to_assets: 0.2,
        interest_coverage: 15.5,

        // Market ratios
        price_to_earnings: 25.5,
        price_to_book: 8.2,
        enterprise_value_to_ebitda: 18.9,

        // Operating cycle metrics
        days_sales_outstanding: 45,
        days_inventory_outstanding: 30,
        days_payable_outstanding: 60,
        cash_conversion_cycle: 15,

        // Additional metrics
        working_capital: 100000,
        enterprise_value: 1400000,
        book_value_per_share: 425,
        earnings_per_share: 137
      }

      expect(typeof ratios.gross_profit_margin).toBe('number')
      expect(typeof ratios.current_ratio).toBe('number')
      expect(typeof ratios.debt_to_equity).toBe('number')
      expect(typeof ratios.price_to_earnings).toBe('number')
      expect(typeof ratios.cash_conversion_cycle).toBe('number')
    })
  })

  describe('OperatingCyclePeriod interface', () => {
    it('should define operating cycle period structure', () => {
      const period: OperatingCyclePeriod = {
        period: '2024-Q1',
        phase: 'expansion',
        days_sales_outstanding: 45,
        days_inventory_outstanding: 30,
        days_payable_outstanding: 60,
        cash_conversion_cycle: 15,
        efficiency_score: 85.5
      }

      expect(period.period).toBe('2024-Q1')
      expect(period.phase).toBe('expansion')
      expect(typeof period.efficiency_score).toBe('number')
    })
  })

  describe('ChartDataPoint interface', () => {
    it('should allow flexible chart data structure', () => {
      const dataPoint: ChartDataPoint = {
        x: '2024-Q1',
        revenue: 100000,
        profit: 25000,
        custom_metric: 42.5
      }

      expect(dataPoint.x).toBe('2024-Q1')
      expect(dataPoint.revenue).toBe(100000)
      expect(dataPoint.custom_metric).toBe(42.5)
    })
  })

  describe('UserPreferences interface', () => {
    it('should define user preference structure', () => {
      const preferences: UserPreferences = {
        theme: 'dark',
        chart_period: 'quarterly',
        default_view: 'dashboard',
        favorite_companies: ['TCS', 'INFY', 'WIPRO'],
        notifications_enabled: true
      }

      expect(preferences.theme).toBe('dark')
      expect(preferences.chart_period).toBe('quarterly')
      expect(Array.isArray(preferences.favorite_companies)).toBe(true)
      expect(preferences.notifications_enabled).toBe(true)
    })
  })

  describe('APIResponse interface', () => {
    it('should define successful API response', () => {
      const successResponse: APIResponse<Company[]> = {
        success: true,
        data: [{
          id: 'TCS',
          name: 'Tata Consultancy Services',
          sector: 'Technology',
          market_cap: 1200000,
          exchange: 'NSE',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }],
        message: 'Companies fetched successfully'
      }

      expect(successResponse.success).toBe(true)
      expect(Array.isArray(successResponse.data)).toBe(true)
      expect(successResponse.error).toBeUndefined()
    })

    it('should define error API response', () => {
      const errorResponse: APIResponse<null> = {
        success: false,
        data: null,
        error: 'Database connection failed',
        message: 'Failed to fetch companies'
      }

      expect(errorResponse.success).toBe(false)
      expect(errorResponse.data).toBeNull()
      expect(errorResponse.error).toBe('Database connection failed')
    })
  })
}) 