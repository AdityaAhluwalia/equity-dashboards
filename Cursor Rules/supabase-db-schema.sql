-- =============================================
-- INVESTMENT DASHBOARD SUPABASE SCHEMA
-- =============================================
-- Optimized for 5000+ companies with historical tracking
-- Supports quarterly and annual data with cycle identification

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- =============================================
-- ENUM TYPES
-- =============================================

-- Company types (finance vs non-finance have different metrics)
CREATE TYPE company_type AS ENUM ('general', 'finance', 'banking', 'nbfc');

-- Cycle phases for visual identification
CREATE TYPE cycle_phase AS ENUM ('expansion', 'peak', 'contraction', 'trough', 'stable');

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
-- CORE TABLES
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

CREATE INDEX idx_companies_sector ON companies(sector);
CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_companies_name_search ON companies USING gin(name gin_trgm_ops);

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

CREATE INDEX idx_snapshots_company_date ON financial_snapshots(company_id, snapshot_date DESC);
CREATE INDEX idx_snapshots_json_gin ON financial_snapshots USING gin(raw_json);

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

CREATE INDEX idx_annual_metrics_company_year ON annual_metrics(company_id, fiscal_year DESC);

-- 4. Quarterly financial metrics
CREATE TABLE quarterly_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  fiscal_year INTEGER NOT NULL,
  quarter INTEGER NOT NULL CHECK (quarter BETWEEN 1 AND 4),
  quarter_end_date DATE NOT NULL,
  
  -- Revenue & Profitability
  revenue DECIMAL(20, 2),
  operating_profit DECIMAL(20, 2),
  net_profit DECIMAL(20, 2),
  
  -- Margins
  opm_percent DECIMAL(8, 2),
  npm_percent DECIMAL(8, 2),
  
  -- Growth Rates
  revenue_growth_qoq DECIMAL(8, 2), -- Quarter over Quarter
  revenue_growth_yoy DECIMAL(8, 2), -- Year over Year
  profit_growth_qoq DECIMAL(8, 2),
  profit_growth_yoy DECIMAL(8, 2),
  
  -- Per Share
  eps DECIMAL(12, 2),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  snapshot_id UUID REFERENCES financial_snapshots(id),
  
  CONSTRAINT unique_company_quarter UNIQUE (company_id, fiscal_year, quarter)
);

CREATE INDEX idx_quarterly_metrics_company_date ON quarterly_metrics(company_id, quarter_end_date DESC);

-- 5. Calculated financial ratios
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

CREATE INDEX idx_ratios_company_date ON calculated_ratios(company_id, period_date DESC, period_type);

-- 6. Cycle phase tracking
CREATE TABLE cycle_phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  phase cycle_phase NOT NULL,
  confidence_score DECIMAL(5, 2), -- 0-100%
  
  -- Indicators that triggered this phase
  revenue_growth_indicator BOOLEAN DEFAULT false,
  margin_indicator BOOLEAN DEFAULT false,
  cash_flow_indicator BOOLEAN DEFAULT false,
  working_capital_indicator BOOLEAN DEFAULT false,
  
  -- Supporting metrics at phase start
  revenue_growth_rate DECIMAL(8, 2),
  margin_change DECIMAL(8, 2),
  
  -- Metadata
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  
  CONSTRAINT unique_company_phase_period UNIQUE (company_id, start_date)
);

CREATE INDEX idx_cycle_phases_company ON cycle_phases(company_id, start_date DESC);
CREATE INDEX idx_cycle_phases_active ON cycle_phases(company_id, end_date) WHERE end_date IS NULL;

-- 7. Comparison sets for saving company groups
CREATE TABLE comparison_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  company_ids UUID[] NOT NULL, -- Array of company IDs
  
  -- Settings
  default_view VARCHAR(20) DEFAULT 'annual', -- annual/quarterly
  default_metrics TEXT[], -- Array of metric names to show
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ
);

CREATE INDEX idx_comparison_sets_companies ON comparison_sets USING gin(company_ids);

-- 8. Import history for tracking updates
CREATE TABLE import_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  file_name VARCHAR(255),
  import_type VARCHAR(50), -- manual/scheduled/api
  records_processed INTEGER,
  records_failed INTEGER,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- pending/processing/completed/failed
  error_details JSONB,
  
  -- Timing
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Metadata
  imported_by VARCHAR(255)
);

CREATE INDEX idx_import_history_company ON import_history(company_id, started_at DESC);

-- =============================================
-- VIEWS FOR COMMON QUERIES
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

-- 2. Current cycle phase for each company
CREATE VIEW current_cycle_phases AS
SELECT DISTINCT ON (company_id)
  cp.*,
  c.symbol,
  c.name
FROM cycle_phases cp
JOIN companies c ON c.id = cp.company_id
WHERE cp.end_date IS NULL
ORDER BY company_id, start_date DESC;

-- 3. Company overview with latest ratios
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
  cr.debt_to_equity,
  ccp.phase as current_phase
FROM companies c
LEFT JOIN latest_annual_metrics lam ON lam.company_id = c.id
LEFT JOIN LATERAL (
  SELECT * FROM calculated_ratios 
  WHERE company_id = c.id AND period_type = 'annual'
  ORDER BY period_date DESC 
  LIMIT 1
) cr ON true
LEFT JOIN current_cycle_phases ccp ON ccp.company_id = c.id;

-- =============================================
-- FUNCTIONS
-- =============================================

-- 1. Function to get company metrics time series
CREATE OR REPLACE FUNCTION get_company_time_series(
  p_company_id UUID,
  p_metric_name TEXT,
  p_period_type period_type DEFAULT 'annual',
  p_limit INTEGER DEFAULT 12
)
RETURNS TABLE(
  period_date DATE,
  metric_value DECIMAL
) AS $$
BEGIN
  IF p_period_type = 'annual' THEN
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
  ELSE
    RETURN QUERY
    EXECUTE format('
      SELECT 
        quarter_end_date as period_date,
        %I as metric_value
      FROM quarterly_metrics
      WHERE company_id = $1
      ORDER BY quarter_end_date DESC
      LIMIT $2
    ', p_metric_name)
    USING p_company_id, p_limit;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 2. Function to detect cycle phase
CREATE OR REPLACE FUNCTION detect_cycle_phase(
  p_company_id UUID,
  p_as_of_date DATE DEFAULT CURRENT_DATE
)
RETURNS cycle_phase AS $$
DECLARE
  v_revenue_growth DECIMAL;
  v_margin_trend DECIMAL;
  v_cash_flow_trend DECIMAL;
  v_phase cycle_phase;
BEGIN
  -- Get recent metrics trends
  -- (Simplified logic - expand based on your specific algorithm)
  
  SELECT 
    AVG(revenue_growth_yoy),
    AVG(opm_percent) - LAG(AVG(opm_percent), 4) OVER (ORDER BY fiscal_year)
  INTO v_revenue_growth, v_margin_trend
  FROM annual_metrics
  WHERE company_id = p_company_id
    AND fiscal_year >= EXTRACT(YEAR FROM p_as_of_date) - 3
  GROUP BY fiscal_year
  ORDER BY fiscal_year DESC
  LIMIT 1;
  
  -- Simple phase detection logic
  IF v_revenue_growth > 15 AND v_margin_trend > 0 THEN
    v_phase := 'expansion';
  ELSIF v_revenue_growth < 0 AND v_margin_trend < 0 THEN
    v_phase := 'contraction';
  ELSIF v_revenue_growth > 10 THEN
    v_phase := 'peak';
  ELSIF v_revenue_growth < 5 AND v_revenue_growth > 0 THEN
    v_phase := 'trough';
  ELSE
    v_phase := 'stable';
  END IF;
  
  RETURN v_phase;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS
-- =============================================

-- 1. Update timestamp trigger
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

CREATE TRIGGER update_comparison_sets_updated_at
  BEFORE UPDATE ON comparison_sets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 2. Automatic cycle phase detection on new metrics
CREATE OR REPLACE FUNCTION check_cycle_phase_change()
RETURNS TRIGGER AS $$
DECLARE
  v_current_phase cycle_phase;
  v_last_phase cycle_phase;
BEGIN
  -- Get current detected phase
  v_current_phase := detect_cycle_phase(NEW.company_id);
  
  -- Get last recorded phase
  SELECT phase INTO v_last_phase
  FROM cycle_phases
  WHERE company_id = NEW.company_id
    AND end_date IS NULL
  ORDER BY start_date DESC
  LIMIT 1;
  
  -- If phase changed, update records
  IF v_current_phase IS DISTINCT FROM v_last_phase THEN
    -- Close previous phase
    UPDATE cycle_phases
    SET end_date = CURRENT_DATE
    WHERE company_id = NEW.company_id
      AND end_date IS NULL;
    
    -- Insert new phase
    INSERT INTO cycle_phases (company_id, start_date, phase)
    VALUES (NEW.company_id, CURRENT_DATE, v_current_phase);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER detect_phase_on_annual_metrics
  AFTER INSERT OR UPDATE ON annual_metrics
  FOR EACH ROW
  EXECUTE FUNCTION check_cycle_phase_change();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
-- Since this is a personal dashboard, we'll keep RLS simple
-- Enable it when you add authentication later

-- ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE financial_snapshots ENABLE ROW LEVEL SECURITY;
-- etc...

-- =============================================
-- SAMPLE INDEXES FOR PERFORMANCE
-- =============================================

-- For chart queries
CREATE INDEX idx_annual_metrics_charts ON annual_metrics(company_id, fiscal_year) 
  INCLUDE (revenue, net_profit, opm_percent, npm_percent);

CREATE INDEX idx_quarterly_metrics_charts ON quarterly_metrics(company_id, quarter_end_date) 
  INCLUDE (revenue, net_profit, revenue_growth_yoy, profit_growth_yoy);

-- For ratio analysis
CREATE INDEX idx_ratios_valuation ON calculated_ratios(company_id, period_date DESC) 
  WHERE period_type = 'annual';

-- For cycle detection
CREATE INDEX idx_metrics_cycle_detection ON annual_metrics(company_id, fiscal_year DESC) 
  INCLUDE (revenue_growth_yoy, opm_percent);

-- =============================================
-- PERMISSIONS (Adjust based on your setup)
-- =============================================

-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated; 