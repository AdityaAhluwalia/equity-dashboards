-- =============================================
-- EQUITY DASHBOARD - PHASE 1 CORE SCHEMA
-- =============================================
-- Essential tables for MVP functionality
-- Supports Task 4.0: Integration & Service Layer

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- =============================================
-- PHASE 1: ESSENTIAL ENUM TYPES
-- =============================================

-- Company types (finance vs non-finance have different metrics)
CREATE TYPE company_type AS ENUM ('general', 'finance', 'banking', 'nbfc');

-- Period types for metrics
CREATE TYPE period_type AS ENUM ('annual', 'quarterly', 'ttm');

-- Ratio categories for organization
CREATE TYPE ratio_category AS ENUM (
  'valuation',
  'profitability', 
  'growth',
  'efficiency',
  'leverage',
  'liquidity',
  'cash_flow',
  'quality',
  'finance_specific'
);

-- =============================================
-- PHASE 1: CORE TABLES
-- =============================================

-- 1. Companies master table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol VARCHAR(20) UNIQUE NOT NULL, -- NSE/BSE symbol
  name VARCHAR(255) NOT NULL,
  sector VARCHAR(100),
  industry VARCHAR(100),
  company_type company_type DEFAULT 'general',
  market_cap DECIMAL(20, 2),
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes for performance
  CONSTRAINT companies_symbol_key UNIQUE (symbol)
);

-- 2. Raw JSON snapshots (preserves original data)
CREATE TABLE financial_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  raw_json JSONB NOT NULL, -- Complete Screener.in JSON
  json_hash VARCHAR(64), -- To detect duplicates
  
  -- Metadata
  imported_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one snapshot per company per date
  CONSTRAINT unique_company_snapshot_date UNIQUE (company_id, snapshot_date)
);

-- 3. Annual financial metrics (denormalized for performance)
CREATE TABLE annual_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  fiscal_year INTEGER NOT NULL,
  
  -- Revenue & Profitability
  revenue DECIMAL(20, 2),
  operating_profit DECIMAL(20, 2),
  net_profit DECIMAL(20, 2),
  ebitda DECIMAL(20, 2),
  
  -- Margins (stored as percentages)
  opm_percent DECIMAL(8, 2), -- Operating Profit Margin
  npm_percent DECIMAL(8, 2), -- Net Profit Margin
  ebitda_margin_percent DECIMAL(8, 2),
  
  -- Balance Sheet
  total_assets DECIMAL(20, 2),
  total_equity DECIMAL(20, 2),
  total_debt DECIMAL(20, 2),
  cash_and_equivalents DECIMAL(20, 2),
  
  -- Cash Flow
  operating_cash_flow DECIMAL(20, 2),
  investing_cash_flow DECIMAL(20, 2),
  financing_cash_flow DECIMAL(20, 2),
  free_cash_flow DECIMAL(20, 2),
  
  -- Per Share
  eps DECIMAL(12, 2),
  book_value_per_share DECIMAL(12, 2),
  
  -- Growth Rates (YoY)
  revenue_growth_yoy DECIMAL(8, 2),
  profit_growth_yoy DECIMAL(8, 2),
  eps_growth_yoy DECIMAL(8, 2),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  snapshot_id UUID REFERENCES financial_snapshots(id),
  
  CONSTRAINT unique_company_year UNIQUE (company_id, fiscal_year)
);

-- 4. Calculated financial ratios (ALL 30+ ratios from Task 3.0)
CREATE TABLE calculated_ratios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  period_date DATE NOT NULL,
  period_type period_type NOT NULL,
  
  -- Valuation Ratios
  price_to_book DECIMAL(12, 4),
  price_to_sales DECIMAL(12, 4),
  market_cap_to_cash_flow DECIMAL(12, 4),
  pe_ratio DECIMAL(12, 4),
  ev_to_ebitda DECIMAL(12, 4),
  
  -- Profitability Ratios
  roe_percent DECIMAL(8, 2), -- Return on Equity
  roce_percent DECIMAL(8, 2), -- Return on Capital Employed
  roa_percent DECIMAL(8, 2), -- Return on Assets
  
  -- Efficiency Ratios
  asset_turnover DECIMAL(8, 4),
  equity_turnover DECIMAL(8, 4),
  working_capital_days INTEGER,
  cash_conversion_cycle INTEGER,
  
  -- Leverage Ratios
  debt_to_equity DECIMAL(8, 4),
  debt_to_assets DECIMAL(8, 4),
  equity_ratio DECIMAL(8, 4),
  interest_coverage DECIMAL(8, 4),
  
  -- Liquidity Ratios
  current_ratio DECIMAL(8, 4),
  quick_ratio DECIMAL(8, 4),
  
  -- Cash Flow Ratios
  operating_cash_flow_margin DECIMAL(8, 2),
  free_cash_flow_yield DECIMAL(8, 2),
  cash_conversion_efficiency DECIMAL(8, 4),
  
  -- Quality Scores
  earnings_quality_score VARCHAR(20), -- excellent/good/fair/poor
  revenue_volatility DECIMAL(8, 4),
  margin_stability DECIMAL(8, 4),
  
  -- Growth Metrics (stored for different periods)
  revenue_cagr_3y DECIMAL(8, 2),
  revenue_cagr_5y DECIMAL(8, 2),
  revenue_cagr_10y DECIMAL(8, 2),
  profit_cagr_3y DECIMAL(8, 2),
  profit_cagr_5y DECIMAL(8, 2),
  profit_cagr_10y DECIMAL(8, 2),
  
  -- Finance-Specific (nullable for non-finance companies)
  npa_percent DECIMAL(8, 2),
  loan_book_growth DECIMAL(8, 2),
  credit_cost_ratio DECIMAL(8, 2),
  
  -- Metadata
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  snapshot_id UUID REFERENCES financial_snapshots(id),
  
  CONSTRAINT unique_company_period_ratios UNIQUE (company_id, period_date, period_type)
);

-- =============================================
-- PHASE 1: PERFORMANCE INDEXES
-- =============================================

-- Companies table indexes
CREATE INDEX idx_companies_sector ON companies(sector);
CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_companies_name_search ON companies USING gin(name gin_trgm_ops);

-- Financial snapshots indexes
CREATE INDEX idx_snapshots_company_date ON financial_snapshots(company_id, snapshot_date DESC);
CREATE INDEX idx_snapshots_json_gin ON financial_snapshots USING gin(raw_json);

-- Annual metrics indexes
CREATE INDEX idx_annual_metrics_company_year ON annual_metrics(company_id, fiscal_year DESC);

-- Chart-optimized indexes
CREATE INDEX idx_annual_metrics_charts ON annual_metrics(company_id, fiscal_year) 
  INCLUDE (revenue, net_profit, opm_percent, npm_percent);

-- Calculated ratios indexes
CREATE INDEX idx_ratios_company_date ON calculated_ratios(company_id, period_date DESC, period_type);

-- Ratio analysis index
CREATE INDEX idx_ratios_valuation ON calculated_ratios(company_id, period_date DESC) 
  WHERE period_type = 'annual';

-- =============================================
-- PHASE 1: ESSENTIAL VIEWS
-- =============================================

-- 1. Latest metrics for each company
CREATE VIEW latest_annual_metrics AS
SELECT DISTINCT ON (company_id)
  am.*,
  c.symbol,
  c.name,
  c.sector,
  c.industry
FROM annual_metrics am
JOIN companies c ON c.id = am.company_id
ORDER BY company_id, fiscal_year DESC;

-- 2. Company overview with latest ratios (dashboard summary view)
CREATE VIEW company_overview AS
SELECT 
  c.*,
  lam.revenue,
  lam.net_profit,
  lam.revenue_growth_yoy,
  lam.opm_percent,
  lam.npm_percent,
  cr.pe_ratio,
  cr.price_to_book,
  cr.roe_percent,
  cr.debt_to_equity
FROM companies c
LEFT JOIN latest_annual_metrics lam ON lam.company_id = c.id
LEFT JOIN LATERAL (
  SELECT * FROM calculated_ratios 
  WHERE company_id = c.id AND period_type = 'annual'
  ORDER BY period_date DESC 
  LIMIT 1
) cr ON true;

-- =============================================
-- PHASE 1: ESSENTIAL FUNCTIONS
-- =============================================

-- Function to get company metrics time series (for charts)
CREATE OR REPLACE FUNCTION get_company_time_series(
  p_company_id UUID,
  p_metric_name TEXT,
  p_limit INTEGER DEFAULT 12
)
RETURNS TABLE(
  period_date DATE,
  metric_value DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  EXECUTE format('
    SELECT 
      MAKE_DATE(fiscal_year, 12, 31) as period_date,
      %I as metric_value
    FROM annual_metrics
    WHERE company_id = $1
    ORDER BY fiscal_year DESC
    LIMIT $2
  ', p_metric_name)
  USING p_company_id, p_limit;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- PHASE 1: UPDATE TRIGGERS
-- =============================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================
-- PHASE 1: VALIDATION QUERIES
-- =============================================

-- Verify schema creation
DO $$
BEGIN
  -- Check if all tables exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'companies') THEN
    RAISE EXCEPTION 'Table companies not created';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'financial_snapshots') THEN
    RAISE EXCEPTION 'Table financial_snapshots not created';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'annual_metrics') THEN
    RAISE EXCEPTION 'Table annual_metrics not created';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'calculated_ratios') THEN
    RAISE EXCEPTION 'Table calculated_ratios not created';
  END IF;
  
  -- Check if views exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'latest_annual_metrics') THEN
    RAISE EXCEPTION 'View latest_annual_metrics not created';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'company_overview') THEN
    RAISE EXCEPTION 'View company_overview not created';
  END IF;
  
  RAISE NOTICE 'Phase 1 schema validation: ALL PASSED ✅';
END;
$$;

-- =============================================
-- PHASE 1: SAMPLE DATA FOR TESTING
-- =============================================

-- Insert sample company for testing
INSERT INTO companies (symbol, name, sector, industry, company_type, market_cap) 
VALUES 
  ('RELIANCE', 'Reliance Industries Ltd', 'Energy', 'Oil & Gas', 'general', 1500000.00),
  ('HDFCBANK', 'HDFC Bank Ltd', 'Financial Services', 'Private Bank', 'banking', 800000.00),
  ('TCS', 'Tata Consultancy Services Ltd', 'Information Technology', 'IT Services', 'general', 1200000.00)
ON CONFLICT (symbol) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Phase 1 Core Schema Successfully Created! 🚀';
  RAISE NOTICE 'Tables: companies, financial_snapshots, annual_metrics, calculated_ratios';
  RAISE NOTICE 'Views: latest_annual_metrics, company_overview';
  RAISE NOTICE 'Ready for Task 4.0 Integration & Service Layer';
END;
$$; 