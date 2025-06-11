/**
 * Database Service Layer
 * Provides type-safe database operations for Supabase integration
 * Task 4.1: Database Schema Implementation Service Layer
 */

import { createClient } from '@supabase/supabase-js';

// =============================================
// DATABASE TYPES (Matching Supabase Schema)
// =============================================

export type CompanyType = 'general' | 'finance' | 'banking' | 'nbfc';
export type PeriodType = 'annual' | 'quarterly' | 'ttm';
export type CyclePhase = 'expansion' | 'peak' | 'contraction' | 'trough' | 'stable';

export interface Company {
  id: string;
  symbol: string;
  name: string;
  sector: string | null;
  industry: string | null;
  company_type: CompanyType;
  market_cap: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FinancialSnapshot {
  id: string;
  company_id: string;
  snapshot_date: string;
  raw_json: Record<string, any>;
  json_hash: string | null;
  imported_at: string;
}

export interface AnnualMetrics {
  id: string;
  company_id: string;
  fiscal_year: number;
  
  // Revenue & Profitability
  revenue: number | null;
  operating_profit: number | null;
  net_profit: number | null;
  ebitda: number | null;
  
  // Margins (percentages)
  opm_percent: number | null;
  npm_percent: number | null;
  ebitda_margin_percent: number | null;
  
  // Balance Sheet
  total_assets: number | null;
  total_equity: number | null;
  total_debt: number | null;
  cash_and_equivalents: number | null;
  
  // Cash Flow
  operating_cash_flow: number | null;
  investing_cash_flow: number | null;
  financing_cash_flow: number | null;
  free_cash_flow: number | null;
  
  // Per Share
  eps: number | null;
  book_value_per_share: number | null;
  
  // Growth Rates (YoY)
  revenue_growth_yoy: number | null;
  profit_growth_yoy: number | null;
  eps_growth_yoy: number | null;
  
  // Metadata
  created_at: string;
  snapshot_id: string | null;
}

export interface CalculatedRatios {
  id: string;
  company_id: string;
  period_date: string;
  period_type: PeriodType;
  
  // Valuation Ratios
  price_to_book: number | null;
  price_to_sales: number | null;
  market_cap_to_cash_flow: number | null;
  pe_ratio: number | null;
  ev_to_ebitda: number | null;
  
  // Profitability Ratios
  roe_percent: number | null;
  roce_percent: number | null;
  roa_percent: number | null;
  
  // Efficiency Ratios
  asset_turnover: number | null;
  equity_turnover: number | null;
  working_capital_days: number | null;
  cash_conversion_cycle: number | null;
  
  // Leverage Ratios
  debt_to_equity: number | null;
  debt_to_assets: number | null;
  equity_ratio: number | null;
  interest_coverage: number | null;
  
  // Liquidity Ratios
  current_ratio: number | null;
  quick_ratio: number | null;
  
  // Cash Flow Ratios
  operating_cash_flow_margin: number | null;
  free_cash_flow_yield: number | null;
  cash_conversion_efficiency: number | null;
  
  // Quality Scores
  earnings_quality_score: string | null;
  revenue_volatility: number | null;
  margin_stability: number | null;
  
  // Growth Metrics
  revenue_cagr_3y: number | null;
  revenue_cagr_5y: number | null;
  revenue_cagr_10y: number | null;
  profit_cagr_3y: number | null;
  profit_cagr_5y: number | null;
  profit_cagr_10y: number | null;
  
  // Finance-Specific
  npa_percent: number | null;
  loan_book_growth: number | null;
  credit_cost_ratio: number | null;
  
  // Metadata
  calculated_at: string;
  snapshot_id: string | null;
}

// Views
export interface CompanyOverview extends Company {
  revenue: number | null;
  net_profit: number | null;
  revenue_growth_yoy: number | null;
  opm_percent: number | null;
  npm_percent: number | null;
  pe_ratio: number | null;
  price_to_book: number | null;
  roe_percent: number | null;
  debt_to_equity: number | null;
}

// =============================================
// DATABASE SERVICE CLASS
// =============================================

export class DatabaseService {
  private supabase;
  
  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // =============================================
  // COMPANY OPERATIONS
  // =============================================

  async getCompanies(options?: {
    limit?: number;
    offset?: number;
    sector?: string;
    company_type?: CompanyType;
    active_only?: boolean;
  }): Promise<Company[]> {
    let query = this.supabase
      .from('companies')
      .select('*');

    if (options?.sector) {
      query = query.eq('sector', options.sector);
    }

    if (options?.company_type) {
      query = query.eq('company_type', options.company_type);
    }

    if (options?.active_only !== false) {
      query = query.eq('is_active', true);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
    }

    const { data, error } = await query.order('name');

    if (error) {
      throw new Error(`Failed to fetch companies: ${error.message}`);
    }

    return data || [];
  }

  async getCompanyBySymbol(symbol: string): Promise<Company | null> {
    const { data, error } = await this.supabase
      .from('companies')
      .select('*')
      .eq('symbol', symbol)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch company: ${error.message}`);
    }

    return data;
  }

  async createCompany(company: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company> {
    const { data, error } = await this.supabase
      .from('companies')
      .insert(company)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create company: ${error.message}`);
    }

    return data;
  }

  // =============================================
  // FINANCIAL METRICS OPERATIONS
  // =============================================

  async getAnnualMetrics(
    companyId: string,
    options?: {
      years?: number;
      from_year?: number;
      to_year?: number;
    }
  ): Promise<AnnualMetrics[]> {
    let query = this.supabase
      .from('annual_metrics')
      .select('*')
      .eq('company_id', companyId);

    if (options?.from_year) {
      query = query.gte('fiscal_year', options.from_year);
    }

    if (options?.to_year) {
      query = query.lte('fiscal_year', options.to_year);
    }

    const { data, error } = await query
      .order('fiscal_year', { ascending: false })
      .limit(options?.years || 12);

    if (error) {
      throw new Error(`Failed to fetch annual metrics: ${error.message}`);
    }

    return data || [];
  }

  async createAnnualMetrics(metrics: Omit<AnnualMetrics, 'id' | 'created_at'>): Promise<AnnualMetrics> {
    const { data, error } = await this.supabase
      .from('annual_metrics')
      .insert(metrics)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create annual metrics: ${error.message}`);
    }

    return data;
  }

  // =============================================
  // CALCULATED RATIOS OPERATIONS
  // =============================================

  async getCalculatedRatios(
    companyId: string,
    periodType: PeriodType = 'annual',
    options?: {
      years?: number;
      from_date?: string;
      to_date?: string;
    }
  ): Promise<CalculatedRatios[]> {
    let query = this.supabase
      .from('calculated_ratios')
      .select('*')
      .eq('company_id', companyId)
      .eq('period_type', periodType);

    if (options?.from_date) {
      query = query.gte('period_date', options.from_date);
    }

    if (options?.to_date) {
      query = query.lte('period_date', options.to_date);
    }

    const { data, error } = await query
      .order('period_date', { ascending: false })
      .limit(options?.years || 12);

    if (error) {
      throw new Error(`Failed to fetch calculated ratios: ${error.message}`);
    }

    return data || [];
  }

  async upsertCalculatedRatios(ratios: Omit<CalculatedRatios, 'id' | 'calculated_at'>): Promise<CalculatedRatios> {
    const { data, error } = await this.supabase
      .from('calculated_ratios')
      .upsert(ratios, {
        onConflict: 'company_id,period_date,period_type'
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to upsert calculated ratios: ${error.message}`);
    }

    return data;
  }

  // =============================================
  // SNAPSHOT OPERATIONS
  // =============================================

  async createFinancialSnapshot(snapshot: Omit<FinancialSnapshot, 'id' | 'imported_at'>): Promise<FinancialSnapshot> {
    const { data, error } = await this.supabase
      .from('financial_snapshots')
      .insert(snapshot)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create financial snapshot: ${error.message}`);
    }

    return data;
  }

  // =============================================
  // VIEW OPERATIONS
  // =============================================

  async getCompanyOverview(options?: {
    limit?: number;
    sector?: string;
    company_type?: CompanyType;
  }): Promise<CompanyOverview[]> {
    let query = this.supabase
      .from('company_overview')
      .select('*');

    if (options?.sector) {
      query = query.eq('sector', options.sector);
    }

    if (options?.company_type) {
      query = query.eq('company_type', options.company_type);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query.order('name');

    if (error) {
      throw new Error(`Failed to fetch company overview: ${error.message}`);
    }

    return data || [];
  }

  // =============================================
  // TIME SERIES OPERATIONS
  // =============================================

  async getCompanyTimeSeries(
    companyId: string,
    metricName: string,
    options?: {
      years?: number;
    }
  ): Promise<Array<{ period_date: string; metric_value: number }>> {
    const { data, error } = await this.supabase
      .rpc('get_company_time_series', {
        p_company_id: companyId,
        p_metric_name: metricName,
        p_limit: options?.years || 12
      });

    if (error) {
      throw new Error(`Failed to fetch time series: ${error.message}`);
    }

    return data || [];
  }

  // =============================================
  // UTILITY OPERATIONS
  // =============================================

  async healthCheck(): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('companies')
        .select('id')
        .limit(1);

      return !error;
    } catch {
      return false;
    }
  }
}

// Singleton factory
let databaseServiceInstance: DatabaseService | null = null;

export const getDatabaseService = (): DatabaseService => {
  if (!databaseServiceInstance) {
    databaseServiceInstance = new DatabaseService();
  }
  return databaseServiceInstance;
};

// For testing purposes
export const resetDatabaseService = (): void => {
  databaseServiceInstance = null;
}; 