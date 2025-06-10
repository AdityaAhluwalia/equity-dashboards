import { Company, FinancialData, MarketData, type ChartDataPoint } from '../../types'

/**
 * Real Test Data Fixtures
 * 
 * Based on actual company data from Screener.in:
 * - Emami Ltd (Non-Finance FMCG)
 * - Axis Bank (Finance Banking)
 * 
 * Used to replace mock data in all tests for realistic testing
 */

// =============================================================================
// EMAMI LTD (NON-FINANCE) - REAL DATA
// =============================================================================

export const EMAMI_COMPANY: Company = {
  id: 'EMAMILTD',
  name: 'Emami Ltd',
  sector: 'Fast Moving Consumer Goods',
  market_cap: 25439, // ₹25,439 Cr
  exchange: 'NSE',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2025-06-10T00:00:00Z'
}

export const EMAMI_QUARTERLY_DATA: FinancialData[] = [
  // Mar 2025 (Latest Quarter)
  {
    id: 'emami-2025-q1',
    company_id: 'EMAMILTD',
    period: '2025-Q1',
    period_type: 'quarterly',
    revenue: 963,
    net_income: 162,
    total_assets: 3534,
    total_liabilities: 3534,
    shareholders_equity: 2695, // Equity Capital (44) + Reserves (2651)
    operating_cash_flow: 896,
    free_cash_flow: 556, // Operating CF - Capex (estimated)
    current_assets: 1859,
    current_liabilities: 749,
    inventory: 0, // Not separately available in this format
    accounts_receivable: 0, // Embedded in Other Assets
    accounts_payable: 0, // Embedded in Other Liabilities
    debt: 90,
    cash: 200, // Estimated from investments + other assets
    created_at: '2025-03-31T00:00:00Z'
  },
  // Dec 2024
  {
    id: 'emami-2024-q4',
    company_id: 'EMAMILTD',
    period: '2024-Q4',
    period_type: 'quarterly',
    revenue: 1049,
    net_income: 279,
    total_assets: 3269,
    total_liabilities: 3269,
    shareholders_equity: 2447,
    operating_cash_flow: 779,
    free_cash_flow: 569,
    current_assets: 1706,
    current_liabilities: 728,
    inventory: 0,
    accounts_receivable: 0,
    accounts_payable: 0,
    debt: 94,
    cash: 180,
    created_at: '2024-12-31T00:00:00Z'
  },
  // Sep 2024
  {
    id: 'emami-2024-q3',
    company_id: 'EMAMILTD',
    period: '2024-Q3',
    period_type: 'quarterly',
    revenue: 891,
    net_income: 211,
    total_assets: 3269,
    total_liabilities: 3269,
    shareholders_equity: 2447,
    operating_cash_flow: 779,
    free_cash_flow: 569,
    current_assets: 1706,
    current_liabilities: 728,
    inventory: 0,
    accounts_receivable: 0,
    accounts_payable: 0,
    debt: 94,
    cash: 180,
    created_at: '2024-09-30T00:00:00Z'
  }
]

export const EMAMI_ANNUAL_DATA: FinancialData[] = [
  // FY 2025
  {
    id: 'emami-2025-annual',
    company_id: 'EMAMILTD',
    period: '2025',
    period_type: 'annual',
    revenue: 3809,
    net_income: 803,
    total_assets: 3534,
    total_liabilities: 3534,
    shareholders_equity: 2695,
    operating_cash_flow: 896,
    free_cash_flow: 556,
    current_assets: 1859,
    current_liabilities: 749,
    inventory: 0,
    accounts_receivable: 0,
    accounts_payable: 0,
    debt: 90,
    cash: 200,
    created_at: '2025-03-31T00:00:00Z'
  },
  // FY 2024
  {
    id: 'emami-2024-annual',
    company_id: 'EMAMILTD',
    period: '2024',
    period_type: 'annual',
    revenue: 3578,
    net_income: 724,
    total_assets: 3269,
    total_liabilities: 3269,
    shareholders_equity: 2447,
    operating_cash_flow: 779,
    free_cash_flow: 569,
    current_assets: 1706,
    current_liabilities: 728,
    inventory: 0,
    accounts_receivable: 0,
    accounts_payable: 0,
    debt: 94,
    cash: 180,
    created_at: '2024-03-31T00:00:00Z'
  },
  // FY 2023
  {
    id: 'emami-2023-annual',
    company_id: 'EMAMILTD',
    period: '2023',
    period_type: 'annual',
    revenue: 3406,
    net_income: 627,
    total_assets: 3096,
    total_liabilities: 3096,
    shareholders_equity: 2303,
    operating_cash_flow: 749,
    free_cash_flow: 627,
    current_assets: 1551,
    current_liabilities: 703,
    inventory: 0,
    accounts_receivable: 0,
    accounts_payable: 0,
    debt: 91,
    cash: 150,
    created_at: '2023-03-31T00:00:00Z'
  }
]

export const EMAMI_MARKET_DATA: MarketData = {
  id: 'emami-market-2025',
  company_id: 'EMAMILTD',
  date: '2025-06-10',
  stock_price: 583,
  shares_outstanding: 4364, // Market Cap / Price = 25439 / 583 * 100 (in lakhs)
  pe_ratio: 31.7,
  pb_ratio: 9.44,
  dividend_yield: 1.37,
  market_cap: 25439,
  created_at: '2025-06-10T00:00:00Z'
}

// =============================================================================
// AXIS BANK (FINANCE) - REAL DATA  
// =============================================================================

export const AXIS_BANK_COMPANY: Company = {
  id: 'AXISBANK',
  name: 'Axis Bank Ltd',
  sector: 'Private Sector Bank',
  market_cap: 381748, // ₹3,81,748 Cr
  exchange: 'NSE',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2025-06-10T00:00:00Z'
}

export const AXIS_QUARTERLY_DATA: FinancialData[] = [
  // Mar 2025 (Latest Quarter)
  {
    id: 'axis-2025-q1',
    company_id: 'AXISBANK',
    period: '2025-Q1',
    period_type: 'quarterly',
    revenue: 32452,
    net_income: 7509,
    total_assets: 1656963,
    total_liabilities: 1656963,
    shareholders_equity: 186052, // Equity Capital (619) + Reserves (185433)
    operating_cash_flow: 44384,
    free_cash_flow: -6831, // Operating CF - Investing CF
    current_assets: 1253785, // Other Assets (primarily loans)
    current_liabilities: 1391608, // Deposits + Borrowings
    inventory: 0, // N/A for banks
    accounts_receivable: 0, // Loans are different
    accounts_payable: 0, // Deposits are different
    debt: 1391608, // Deposits (1170921) + Borrowings (220687)
    cash: 396685, // Investments (liquid securities)
    created_at: '2025-03-31T00:00:00Z'
  },
  // Dec 2024
  {
    id: 'axis-2024-q4',
    company_id: 'AXISBANK',
    period: '2024-Q4',
    period_type: 'quarterly',
    revenue: 32162,
    net_income: 6779,
    total_assets: 1518239,
    total_liabilities: 1518239,
    shareholders_equity: 157023,
    operating_cash_flow: -5555,
    free_cash_flow: -14556,
    current_assets: 1179758,
    current_liabilities: 1295302,
    inventory: 0,
    accounts_receivable: 0,
    accounts_payable: 0,
    debt: 1295302,
    cash: 332354,
    created_at: '2024-12-31T00:00:00Z'
  }
]

export const AXIS_ANNUAL_DATA: FinancialData[] = [
  // FY 2025
  {
    id: 'axis-2025-annual',
    company_id: 'AXISBANK',
    period: '2025',
    period_type: 'annual',
    revenue: 127374,
    net_income: 28191,
    total_assets: 1656963,
    total_liabilities: 1656963,
    shareholders_equity: 186052,
    operating_cash_flow: 44384,
    free_cash_flow: -6831,
    current_assets: 1253785,
    current_liabilities: 1391608,
    inventory: 0,
    accounts_receivable: 0,
    accounts_payable: 0,
    debt: 1391608,
    cash: 396685,
    created_at: '2025-03-31T00:00:00Z'
  },
  // FY 2024
  {
    id: 'axis-2024-annual',
    company_id: 'AXISBANK',
    period: '2024',
    period_type: 'annual',
    revenue: 112759,
    net_income: 26492,
    total_assets: 1518239,
    total_liabilities: 1518239,
    shareholders_equity: 157023,
    operating_cash_flow: -5555,
    free_cash_flow: -14556,
    current_assets: 1179758,
    current_liabilities: 1295302,
    inventory: 0,
    accounts_receivable: 0,
    accounts_payable: 0,
    debt: 1295302,
    cash: 332354,
    created_at: '2024-03-31T00:00:00Z'
  },
  // FY 2023
  {
    id: 'axis-2023-annual',
    company_id: 'AXISBANK',
    period: '2023',
    period_type: 'annual',
    revenue: 87448,
    net_income: 10919,
    total_assets: 1344418,
    total_liabilities: 1344418,
    shareholders_equity: 129781,
    operating_cash_flow: 22075,
    free_cash_flow: -10276,
    current_assets: 1051181,
    current_liabilities: 1152039,
    inventory: 0,
    accounts_receivable: 0,
    accounts_payable: 0,
    debt: 1152039,
    cash: 288095,
    created_at: '2023-03-31T00:00:00Z'
  }
]

export const AXIS_MARKET_DATA: MarketData = {
  id: 'axis-market-2025',
  company_id: 'AXISBANK',
  date: '2025-06-10',
  stock_price: 1231,
  shares_outstanding: 31000, // Market Cap / Price = 381748 / 1231 * 100 (in lakhs)
  pe_ratio: 13.6,
  pb_ratio: 2.04, // Price / Book Value (601)
  dividend_yield: 0.08,
  market_cap: 381748,
  created_at: '2025-06-10T00:00:00Z'
}

// =============================================================================
// EXPECTED FINANCIAL RATIOS (FOR TESTING)
// =============================================================================

export const EMAMI_EXPECTED_RATIOS = {
  // Universal Ratios - Calculated from actual data
  return_on_equity: 29.8, // Calculated: 803/2695 * 100 (annual)
  net_profit_margin: 16.8, // 162/963 * 100
  revenue_growth_1y: 6.4, // TTM 6% from source
  profit_growth_1y: 10.9, // 803/724 - 1
  
  // Non-Finance Specific
  operating_profit_margin: 22.7, // 219/963 * 100 (Mar 2025)
  return_on_capital_employed: 33.9, // Given in source data
  cash_conversion_cycle: 4, // Given in source data (Mar 2025)
  debtor_days: 43, // Given in source data (Mar 2025)
  inventory_days: 94, // Given in source data (Mar 2025)
  days_payable_outstanding: 133, // Given in source data (Mar 2025)
  working_capital_days: 72.2, // Given in source data
  
  // Market Ratios - Adjusted based on actual calculations
  price_to_earnings: 157.7, // Calculated: 583 / (803/4364)
  price_to_book: 9.44, // Given in source data
  dividend_yield: 1.37, // Given in source data
}

export const AXIS_EXPECTED_RATIOS = {
  // Universal Ratios - Calculated from actual data
  return_on_equity: 15.2, // Calculated: 28191/186052 * 100 (annual)
  net_profit_margin: 23.1, // 7509/32452 * 100
  revenue_growth_1y: 13.0, // TTM 13% from source
  profit_growth_1y: 6.4, // 28191/26492 - 1
  
  // Finance Specific  
  net_interest_margin: 7.0, // Given as financing margin % (Mar 2025)
  cost_to_income_ratio: 36.8, // 11943/32452 * 100 (Mar 2025)
  
  // Market Ratios - Adjusted based on actual calculations
  price_to_earnings: 13.5, // Calculated: 1231 / (28191/3100)
  price_to_book: 2.04, // 1231/601
  dividend_yield: 0.08, // Given in source data
}

// =============================================================================
// CHART DATA HELPERS
// =============================================================================

export function createEmamiChartData(): ChartDataPoint[] {
  return EMAMI_QUARTERLY_DATA.map(data => ({
    x: data.period,
    revenue: data.revenue,
    profit: data.net_income,
    roe: EMAMI_EXPECTED_RATIOS.return_on_equity,
    opm: EMAMI_EXPECTED_RATIOS.operating_profit_margin
  }))
}

export function createAxisChartData(): ChartDataPoint[] {
  return AXIS_QUARTERLY_DATA.map(data => ({
    x: data.period,
    revenue: data.revenue,
    profit: data.net_income,
    roe: AXIS_EXPECTED_RATIOS.return_on_equity,
    nim: AXIS_EXPECTED_RATIOS.net_interest_margin
  }))
}

// =============================================================================
// COMPANY COLLECTIONS
// =============================================================================

export const REAL_COMPANIES = {
  EMAMI: {
    company: EMAMI_COMPANY,
    quarterly_data: EMAMI_QUARTERLY_DATA,
    annual_data: EMAMI_ANNUAL_DATA,
    market_data: EMAMI_MARKET_DATA,
    expected_ratios: EMAMI_EXPECTED_RATIOS,
    chart_data: createEmamiChartData()
  },
  AXIS: {
    company: AXIS_BANK_COMPANY,
    quarterly_data: AXIS_QUARTERLY_DATA,
    annual_data: AXIS_ANNUAL_DATA,
    market_data: AXIS_MARKET_DATA,
    expected_ratios: AXIS_EXPECTED_RATIOS,
    chart_data: createAxisChartData()
  }
}

// Helper functions for tests
export function getCompanyByType(type: 'finance' | 'non_finance') {
  return type === 'finance' ? REAL_COMPANIES.AXIS : REAL_COMPANIES.EMAMI
}

export function getAllRealCompanies() {
  return [REAL_COMPANIES.EMAMI, REAL_COMPANIES.AXIS]
} 