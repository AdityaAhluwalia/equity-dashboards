# Data Layer & Financial Calculation Engine PRD v1

## 1. Overview

This PRD defines the data layer architecture for parsing Screener.in financial data and calculating 30+ financial ratios for both finance and non-finance companies.

**Based on Real Data Analysis**: Emami Ltd (FMCG) and Axis Bank (Banking)

## 2. Architecture Design

### 2.1 Dual Parser System

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Raw JSON     │───▶│  Sector Detection │───▶│  Router         │
│  (Screener.in) │    │  & Validation    │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                        │
                               ┌────────────────────────┼────────────────────────┐
                               ▼                        ▼                        ▼
                    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
                    │ Non-Finance     │    │ Finance Company │    │ Common Fields   │
                    │ Parser          │    │ Parser          │    │ Parser          │
                    │ (Manufacturing, │    │ (Banks, NBFCs,  │    │ (Market Data,   │
                    │  FMCG, etc.)    │    │  Insurance)     │    │  Shareholding)  │
                    └─────────────────┘    └─────────────────┘    └─────────────────┘
                               │                        │                        │
                               └────────────────────────┼────────────────────────┘
                                                        ▼
                                            ┌─────────────────┐
                                            │ Unified Data    │
                                            │ Model & Storage │
                                            └─────────────────┘
```

### 2.2 Calculation Engine Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Financial Data  │───▶│ Ratio Calculator │───▶│ Calculated      │
│ (Normalized)    │    │ Engine           │    │ Ratios          │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                       ┌────────┼────────┐
                       ▼        ▼        ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │ Universal   │ │ Non-Finance │ │ Finance     │
            │ Ratios      │ │ Specific    │ │ Specific    │
            │ (12 ratios) │ │ (12 ratios) │ │ (6 ratios)  │
            └─────────────┘ └─────────────┘ └─────────────┘
```

## 3. Data Models

### 3.1 Raw Company Data (Input)

```typescript
interface RawScreenerData {
  company_info: {
    name: string
    sector: string
    market_cap: number
    current_price: number
    exchange: 'NSE' | 'BSE'
  }
  
  quarterly_data: Array<{
    period: string // "Mar 2025", "Dec 2024"
    // Non-Finance fields
    sales?: number
    expenses?: number  
    operating_profit?: number
    opm_percent?: number
    
    // Finance fields  
    revenue?: number
    interest?: number
    financing_profit?: number
    financing_margin_percent?: number
    
    // Common fields
    other_income: number
    depreciation: number
    profit_before_tax: number
    tax_percent: number
    net_profit: number
    eps: number
  }>
  
  annual_data: Array<{
    year: string // "Mar 2025", "Mar 2024"
    // Same structure as quarterly_data
  }>
  
  balance_sheet: Array<{
    period: string
    equity_capital: number
    reserves: number
    borrowings?: number // Non-finance
    deposits?: number   // Finance  
    other_liabilities: number
    fixed_assets: number
    cwip: number
    investments: number
    other_assets: number
  }>
  
  cash_flow: Array<{
    period: string
    operating_activity: number
    investing_activity: number
    financing_activity: number
    net_cash_flow: number
  }>
  
  ratios?: {
    // Non-finance specific
    debtor_days?: number[]
    inventory_days?: number[]
    days_payable?: number[]
    cash_conversion_cycle?: number[]
    working_capital_days?: number[]
    roce_percent?: number[]
    
    // Finance specific  
    roe_percent?: number[]
  }
  
  market_data: {
    stock_pe: number
    book_value: number
    dividend_yield: number
    roce?: number // Non-finance
    roe: number
  }
}
```

### 3.2 Normalized Data Model (Output)

```typescript
interface NormalizedFinancialData {
  company_id: string
  company_type: 'finance' | 'non_finance'
  period: string
  period_type: 'quarterly' | 'annual'
  
  // Income Statement (Normalized)
  primary_income: number      // Sales (non-finance) or Revenue (finance)
  operating_expenses: number  
  core_profit: number         // Operating Profit or Financing Profit
  core_margin_percent: number // OPM or Financing Margin
  other_income: number
  interest: number           // Expense for non-finance, part of revenue for finance
  depreciation: number
  profit_before_tax: number
  tax_percent: number
  net_profit: number
  eps: number
  
  // Balance Sheet (Normalized)
  equity_capital: number
  reserves: number
  total_debt: number         // Borrowings (non-finance) or Borrowings+Deposits (finance)
  other_liabilities: number
  fixed_assets: number
  cwip: number
  investments: number
  other_assets: number
  
  // Cash Flow
  operating_cash_flow: number
  investing_cash_flow: number
  financing_cash_flow: number
  net_cash_flow: number
  
  // Sector-specific fields
  non_finance_data?: {
    sales: number
    operating_profit: number
    borrowings: number
  }
  
  finance_data?: {
    revenue: number
    financing_profit: number
    deposits: number
    loan_assets: number
  }
}
```

### 3.3 Calculated Ratios Model

```typescript
interface CalculatedRatios {
  company_id: string
  period: string
  company_type: 'finance' | 'non_finance'
  
  // Universal Ratios (12)
  return_on_equity: number
  net_profit_margin: number  
  revenue_growth_1y: number
  revenue_growth_3y_cagr: number
  revenue_growth_5y_cagr: number
  profit_growth_1y: number
  profit_growth_3y_cagr: number
  profit_growth_5y_cagr: number
  asset_turnover: number
  debt_to_equity: number
  price_to_earnings: number
  price_to_book: number
  
  // Non-Finance Specific (12)
  operating_profit_margin?: number
  return_on_capital_employed?: number
  cash_conversion_cycle?: number
  debtor_days?: number
  inventory_days?: number
  days_payable_outstanding?: number
  working_capital_days?: number
  interest_coverage_ratio?: number
  current_ratio?: number
  quick_ratio?: number
  free_cash_flow_margin?: number
  asset_quality_ratio?: number
  
  // Finance Specific (6)
  net_interest_margin?: number
  cost_to_income_ratio?: number
  loan_growth_rate?: number
  deposit_growth_rate?: number
  non_interest_income_ratio?: number
  capital_adequacy_basic?: number
}
```

## 4. Parsing Specifications

### 4.1 Sector Detection Algorithm

```typescript
function detectCompanyType(data: RawScreenerData): 'finance' | 'non_finance' {
  // Method 1: Check for finance-specific fields
  if (data.quarterly_data.some(q => 
    q.financing_profit !== undefined || 
    q.financing_margin_percent !== undefined
  )) {
    return 'finance'
  }
  
  // Method 2: Check balance sheet structure  
  if (data.balance_sheet.some(bs => bs.deposits !== undefined)) {
    return 'finance'
  }
  
  // Method 3: Sector classification
  const financeSectors = [
    'Banks', 'Financial Services', 'Insurance', 
    'NBFCs', 'Asset Management'
  ]
  
  if (financeSectors.some(sector => 
    data.company_info.sector.includes(sector)
  )) {
    return 'finance'
  }
  
  return 'non_finance'
}
```

### 4.2 Field Mapping Rules

#### Non-Finance Mapping
```typescript
{
  primary_income: quarterly_data.sales,
  operating_expenses: quarterly_data.expenses,
  core_profit: quarterly_data.operating_profit,
  core_margin_percent: quarterly_data.opm_percent,
  total_debt: balance_sheet.borrowings,
  // Interest is an expense
  interest_expense: quarterly_data.interest
}
```

#### Finance Mapping  
```typescript
{
  primary_income: quarterly_data.revenue,
  operating_expenses: quarterly_data.expenses,
  core_profit: quarterly_data.financing_profit,
  core_margin_percent: quarterly_data.financing_margin_percent,
  total_debt: balance_sheet.borrowings + balance_sheet.deposits,
  // Interest is part of core business
  interest_component: quarterly_data.interest
}
```

### 4.3 Data Validation Rules

```typescript
interface ValidationRules {
  universal: {
    net_profit: 'can_be_negative'
    primary_income: 'must_be_positive'
    eps: 'can_be_negative'
    balance_sheet_equation: 'total_assets === total_liabilities'
  }
  
  non_finance: {
    sales: 'must_be_positive'
    operating_profit: 'can_be_negative'
    opm_percent: 'can_be_negative'
    working_capital_cycle: 'can_be_negative'
  }
  
  finance: {
    revenue: 'must_be_positive'
    financing_profit: 'can_be_negative'
    deposits: 'must_be_positive_for_banks'
    financing_margin: 'can_be_negative'
  }
}
```

## 5. Ratio Calculation Specifications

### 5.1 Universal Ratios

```typescript
class UniversalRatioCalculator {
  calculateROE(netProfit: number, shareholdersEquity: number): number {
    return (netProfit / shareholdersEquity) * 100
  }
  
  calculateNetProfitMargin(netProfit: number, revenue: number): number {
    return (netProfit / revenue) * 100
  }
  
  calculateCAGR(endValue: number, startValue: number, years: number): number {
    return Math.pow(endValue / startValue, 1 / years) - 1
  }
  
  calculateAssetTurnover(revenue: number, totalAssets: number): number {
    return revenue / totalAssets
  }
  
  calculateDebtToEquity(totalDebt: number, equity: number): number {
    return totalDebt / equity
  }
  
  calculatePE(marketPrice: number, eps: number): number {
    return marketPrice / eps
  }
  
  calculatePB(marketPrice: number, bookValue: number): number {
    return marketPrice / bookValue
  }
}
```

### 5.2 Non-Finance Specific Ratios

```typescript
class NonFinanceRatioCalculator {
  calculateOPM(operatingProfit: number, sales: number): number {
    return (operatingProfit / sales) * 100
  }
  
  calculateROCE(ebit: number, capitalEmployed: number): number {
    return (ebit / capitalEmployed) * 100
  }
  
  calculateCashConversionCycle(
    debtorDays: number, 
    inventoryDays: number, 
    payableDays: number
  ): number {
    return debtorDays + inventoryDays - payableDays
  }
  
  calculateDebtorDays(receivables: number, dailySales: number): number {
    return receivables / dailySales
  }
  
  calculateInventoryDays(inventory: number, dailyCOGS: number): number {
    return inventory / dailyCOGS
  }
  
  calculateWorkingCapitalDays(
    currentAssets: number, 
    currentLiabilities: number, 
    dailySales: number
  ): number {
    return (currentAssets - currentLiabilities) / dailySales
  }
  
  calculateInterestCoverage(ebit: number, interestExpense: number): number {
    return ebit / interestExpense
  }
  
  calculateCurrentRatio(currentAssets: number, currentLiabilities: number): number {
    return currentAssets / currentLiabilities
  }
  
  calculateQuickRatio(
    currentAssets: number, 
    inventory: number, 
    currentLiabilities: number
  ): number {
    return (currentAssets - inventory) / currentLiabilities
  }
}
```

### 5.3 Finance Specific Ratios

```typescript
class FinanceRatioCalculator {
  calculateNIM(financingProfit: number, totalAssets: number): number {
    return (financingProfit / totalAssets) * 100
  }
  
  calculateCostToIncomeRatio(expenses: number, totalIncome: number): number {
    return (expenses / totalIncome) * 100
  }
  
  calculateLoanGrowthRate(currentLoans: number, previousLoans: number): number {
    return ((currentLoans - previousLoans) / previousLoans) * 100
  }
  
  calculateDepositGrowthRate(currentDeposits: number, previousDeposits: number): number {
    return ((currentDeposits - previousDeposits) / previousDeposits) * 100
  }
  
  calculateNonInterestIncomeRatio(otherIncome: number, totalIncome: number): number {
    return (otherIncome / totalIncome) * 100
  }
  
  calculateBasicCapitalAdequacy(equityCapital: number, totalAssets: number): number {
    return (equityCapital / totalAssets) * 100
  }
}
```

## 6. Real Data Test Cases

### 6.1 Emami Ltd Test Data (Non-Finance)

```typescript
const emamiTestData: NormalizedFinancialData = {
  company_id: 'EMAMILTD',
  company_type: 'non_finance',
  period: '2025-Q1',
  period_type: 'quarterly',
  primary_income: 963,
  operating_expenses: 744,
  core_profit: 219,
  core_margin_percent: 23,
  other_income: 21,
  interest: 3,
  depreciation: 44,
  profit_before_tax: 194,
  tax_percent: 16,
  net_profit: 162,
  eps: 3.72,
  equity_capital: 44,
  reserves: 2651,
  total_debt: 90,
  // ... balance sheet data
}

// Expected Ratios
const expectedEmamiRatios: CalculatedRatios = {
  company_id: 'EMAMILTD',
  period: '2025-Q1',
  company_type: 'non_finance',
  return_on_equity: 31.2, // Given in data
  net_profit_margin: 16.8, // 162/963 * 100
  operating_profit_margin: 22.7, // 219/963 * 100
  // ... other calculated ratios
}
```

### 6.2 Axis Bank Test Data (Finance)

```typescript
const axisTestData: NormalizedFinancialData = {
  company_id: 'AXISBANK',
  company_type: 'finance',
  period: '2025-Q1',
  period_type: 'quarterly',
  primary_income: 32452,
  operating_expenses: 11943,
  core_profit: 2389,
  core_margin_percent: 7,
  other_income: 7506,
  interest: 18121,
  profit_before_tax: 9895,
  tax_percent: 24,
  net_profit: 7509,
  eps: 24.13,
  equity_capital: 619,
  reserves: 185433,
  total_debt: 1391608, // Deposits + Borrowings
  // ... balance sheet data
}

// Expected Ratios
const expectedAxisRatios: CalculatedRatios = {
  company_id: 'AXISBANK',
  period: '2025-Q1', 
  company_type: 'finance',
  return_on_equity: 16.4, // Given in data
  net_profit_margin: 23.1, // 7509/32452 * 100
  net_interest_margin: 7, // Given as financing_margin_percent
  // ... other calculated ratios
}
```

## 7. Performance Requirements

- **Parse 1000 companies**: < 30 seconds
- **Calculate all ratios**: < 5 seconds per company
- **Memory usage**: < 500MB for 1000 companies
- **Accuracy**: 99.9% match with known good data
- **Error handling**: Graceful failure with detailed logs

## 8. Error Handling Strategy

```typescript
interface ParseResult<T> {
  success: boolean
  data?: T
  errors: Array<{
    field: string
    message: string
    severity: 'warning' | 'error' | 'critical'
  }>
  metadata: {
    company_id: string
    parse_timestamp: string
    data_quality_score: number // 0-100
  }
}
```

## 9. Success Criteria

1. **✅ Dual Parser System**: Successfully parse both Emami (non-finance) and Axis (finance) data
2. **✅ 30+ Ratios Calculated**: All universal, non-finance, and finance ratios implemented
3. **✅ Real Data Testing**: 100% test coverage using actual company data
4. **✅ Type Safety**: Complete TypeScript type definitions
5. **✅ Performance**: Meet all performance benchmarks
6. **✅ Error Resilience**: Handle malformed data gracefully
7. **✅ Data Quality**: Implement validation and quality scoring

## 10. Implementation Phases

### Phase 1: Core Parsing (Tasks 2.1-2.5)
- Sector detection algorithm
- Non-finance parser (Emami)
- Finance parser (Axis Bank)
- Data validation engine
- Error handling framework

### Phase 2: Ratio Calculations (Tasks 3.1-3.7)
- Universal ratio calculator
- Non-finance ratio calculator  
- Finance ratio calculator
- Historical trend calculations
- Performance optimization

### Phase 3: Integration & Testing (Tasks 2.6-2.9)
- Real data test fixtures
- Service layer integration
- Database operations
- Performance benchmarking
- Quality assurance 