import { type PhaseType } from '../lib/design-tokens'

/**
 * Company information interface
 */
export interface Company {
  id: string
  name: string
  sector: string
  market_cap: number // in millions INR
  exchange: 'NSE' | 'BSE'
  created_at: string
  updated_at: string
}

/**
 * Financial data interface for quarterly/annual data
 */
export interface FinancialData {
  id: string
  company_id: string
  period: string // Format: YYYY-Q1 or YYYY
  period_type: 'quarterly' | 'annual'
  
  // Income Statement
  revenue: number
  net_income: number
  
  // Balance Sheet
  total_assets: number
  total_liabilities: number
  shareholders_equity: number
  current_assets: number
  current_liabilities: number
  inventory: number
  accounts_receivable: number
  accounts_payable: number
  debt: number
  cash: number
  
  // Cash Flow
  operating_cash_flow: number
  free_cash_flow: number
  
  created_at: string
}

/**
 * Market data interface for stock information
 */
export interface MarketData {
  id: string
  company_id: string
  date: string // YYYY-MM-DD format
  stock_price: number
  shares_outstanding: number
  pe_ratio: number | null
  pb_ratio: number | null
  dividend_yield: number | null
  market_cap: number // in millions INR
  created_at: string
}

/**
 * Comprehensive financial ratios interface
 */
export interface FinancialRatios {
  // Profitability ratios
  gross_profit_margin: number
  operating_profit_margin: number
  net_profit_margin: number
  return_on_assets: number
  return_on_equity: number
  return_on_capital_employed: number
  
  // Liquidity ratios
  current_ratio: number
  quick_ratio: number
  cash_ratio: number
  
  // Efficiency ratios (turnover ratios)
  asset_turnover: number
  inventory_turnover: number
  receivables_turnover: number
  payables_turnover: number
  
  // Leverage ratios
  debt_to_equity: number
  debt_to_assets: number
  interest_coverage: number
  
  // Market ratios
  price_to_earnings: number
  price_to_book: number
  enterprise_value_to_ebitda: number
  
  // Operating cycle metrics (in days)
  days_sales_outstanding: number
  days_inventory_outstanding: number
  days_payable_outstanding: number
  cash_conversion_cycle: number
  
  // Additional metrics
  working_capital: number
  enterprise_value: number
  book_value_per_share: number
  earnings_per_share: number
}

/**
 * Operating cycle period with phase identification
 */
export interface OperatingCyclePeriod {
  period: string
  phase: PhaseType
  days_sales_outstanding: number
  days_inventory_outstanding: number
  days_payable_outstanding: number
  cash_conversion_cycle: number
  efficiency_score: number // 0-100 score
}

/**
 * Flexible chart data point interface
 */
export interface ChartDataPoint {
  x: string | number
  [key: string]: any
}

/**
 * User preferences interface
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  chart_period: 'quarterly' | 'annual'
  default_view: 'dashboard' | 'companies' | 'analysis'
  favorite_companies: string[]
  notifications_enabled: boolean
}

/**
 * Generic API response interface
 */
export interface APIResponse<T> {
  success: boolean
  data: T
  error?: string
  message?: string
}

/**
 * Database table interfaces for Supabase
 */
export interface Database {
  public: {
    Tables: {
      companies: {
        Row: Company
        Insert: Omit<Company, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Company, 'id' | 'created_at' | 'updated_at'>>
      }
      financial_data: {
        Row: FinancialData
        Insert: Omit<FinancialData, 'id' | 'created_at'>
        Update: Partial<Omit<FinancialData, 'id' | 'created_at'>>
      }
      market_data: {
        Row: MarketData
        Insert: Omit<MarketData, 'id' | 'created_at'>
        Update: Partial<Omit<MarketData, 'id' | 'created_at'>>
      }
      user_preferences: {
        Row: UserPreferences & { id: string; user_id: string; created_at: string; updated_at: string }
        Insert: Omit<UserPreferences, 'id' | 'created_at' | 'updated_at'> & { user_id: string }
        Update: Partial<UserPreferences>
      }
    }
  }
}

/**
 * Chart configuration types
 */
export type ChartType = 'line' | 'bar' | 'area' | 'combo'
export type TimeRange = '1Y' | '3Y' | '5Y' | '10Y' | 'MAX'
export type MetricCategory = 'profitability' | 'liquidity' | 'efficiency' | 'leverage' | 'market' | 'operating_cycle'

/**
 * Analysis types
 */
export type TrendDirection = 'up' | 'down' | 'stable'
export type RiskLevel = 'low' | 'medium' | 'high'
export type InvestmentRating = 'buy' | 'hold' | 'sell'

/**
 * Validation functions
 */
export function validateCompany(company: Company): boolean {
  return !!(
    company.id &&
    company.name &&
    company.sector &&
    company.market_cap > 0 &&
    (company.exchange === 'NSE' || company.exchange === 'BSE') &&
    company.created_at &&
    company.updated_at
  )
}

export function validateFinancialData(data: FinancialData): boolean {
  return !!(
    data.id &&
    data.company_id &&
    data.period &&
    (data.period_type === 'quarterly' || data.period_type === 'annual') &&
    data.revenue >= 0 &&
    data.total_assets >= 0 &&
    data.created_at
  )
}

export function validateMarketData(data: MarketData): boolean {
  return !!(
    data.id &&
    data.company_id &&
    data.date &&
    data.stock_price > 0 &&
    data.shares_outstanding > 0 &&
    data.market_cap > 0 &&
    (data.pe_ratio === null || data.pe_ratio > 0) &&
    (data.pb_ratio === null || data.pb_ratio > 0) &&
    data.created_at
  )
}

/**
 * Type guards
 */
export function isCompany(obj: any): obj is Company {
  return obj && typeof obj === 'object' && validateCompany(obj)
}

export function isFinancialData(obj: any): obj is FinancialData {
  return obj && typeof obj === 'object' && validateFinancialData(obj)
}

export function isMarketData(obj: any): obj is MarketData {
  return obj && typeof obj === 'object' && validateMarketData(obj)
}

/**
 * Utility types
 */
export type Nullable<T> = T | null
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
} 