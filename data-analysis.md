# Financial Data Structure Analysis

## Dataset Overview

### 1. Emami Ltd (Non-Finance FMCG)
- **Sector**: Fast Moving Consumer Goods
- **Market Cap**: ₹25,439 Cr
- **Data Period**: 12 years annual + 13 quarters

### 2. Axis Bank (Finance Banking)
- **Sector**: Private Sector Bank
- **Market Cap**: ₹3,81,748 Cr  
- **Data Period**: 12 years annual + 13 quarters

## Data Structure Comparison

### Non-Finance (Emami) Structure
```
Quarterly & Annual Data:
- Sales (Revenue)
- Expenses 
- Operating Profit
- Operating Profit Margin %
- Other Income
- Interest (expenses)
- Depreciation
- Profit before tax
- Tax %
- Net Profit
- EPS

Balance Sheet:
- Equity Capital
- Reserves
- Borrowings
- Other Liabilities
- Fixed Assets
- CWIP (Capital Work in Progress)
- Investments
- Other Assets

Cash Flow:
- Operating Activity
- Investing Activity  
- Financing Activity
- Net Cash Flow

Ratios:
- Debtor Days
- Inventory Days
- Days Payable
- Cash Conversion Cycle
- Working Capital Days
- ROCE %
```

### Finance (Axis Bank) Structure
```
Quarterly & Annual Data:
- Revenue (Total Income)
- Interest (Interest Expense)
- Expenses 
- Financing Profit (Net Interest Income)
- Financing Margin % (Net Interest Margin)
- Other Income (Non-Interest Income)
- Depreciation
- Profit before tax
- Tax %
- Net Profit
- EPS

Balance Sheet:
- Equity Capital
- Reserves
- Deposits (Customer Deposits)
- Borrowing (Interbank/Institutional)
- Other Liabilities
- Fixed Assets
- CWIP
- Investments (Securities)
- Other Assets (Loans & Advances)

Cash Flow:
- Operating Activity
- Investing Activity
- Financing Activity
- Net Cash Flow

Ratios:
- ROE %
- (Banking ratios different from manufacturing)
```

## 25+ Financial Ratios Identified

### Universal Ratios (Both Company Types)
1. **Return on Equity (ROE)** = Net Profit / Shareholders Equity × 100
2. **Net Profit Margin** = Net Profit / Revenue × 100
3. **Revenue Growth (CAGR)** = (Latest Revenue / Base Revenue)^(1/years) - 1
4. **Profit Growth (CAGR)** = (Latest Profit / Base Profit)^(1/years) - 1
5. **Asset Turnover** = Revenue / Total Assets
6. **Debt to Equity** = Total Debt / Shareholders Equity
7. **Price to Earnings (P/E)** = Market Price / EPS
8. **Price to Book (P/B)** = Market Price / Book Value per Share
9. **Market Cap to Sales** = Market Cap / Annual Revenue
10. **Book Value per Share** = Shareholders Equity / Number of Shares
11. **Dividend Yield** = Annual Dividend / Market Price × 100
12. **EPS Growth** = (Current EPS - Previous EPS) / Previous EPS × 100

### Non-Finance Specific Ratios
13. **Operating Profit Margin (OPM)** = Operating Profit / Sales × 100
14. **Return on Capital Employed (ROCE)** = EBIT / Capital Employed × 100
15. **Cash Conversion Cycle** = Debtor Days + Inventory Days - Days Payable
16. **Debtor Days (DSO)** = Accounts Receivable / Daily Sales
17. **Inventory Days (DIO)** = Inventory / Daily COGS  
18. **Days Payable Outstanding (DPO)** = Accounts Payable / Daily COGS
19. **Working Capital Days** = (Current Assets - Current Liabilities) / Daily Sales
20. **Interest Coverage Ratio** = EBIT / Interest Expense
21. **Current Ratio** = Current Assets / Current Liabilities
22. **Quick Ratio** = (Current Assets - Inventory) / Current Liabilities
23. **Free Cash Flow Margin** = Free Cash Flow / Revenue × 100
24. **Asset Quality Ratio** = Fixed Assets / Total Assets

### Finance-Specific Ratios
25. **Net Interest Margin (NIM)** = Financing Profit / Total Assets × 100
26. **Cost to Income Ratio** = Operating Expenses / Total Income × 100
27. **Loan Growth Rate** = (Current Loans - Previous Loans) / Previous Loans × 100
28. **Deposit Growth Rate** = (Current Deposits - Previous Deposits) / Previous Deposits × 100
29. **Non-Interest Income Ratio** = Other Income / Total Income × 100
30. **Capital Adequacy (Basic)** = Equity Capital / Total Assets × 100

## Key Parsing Differences

### Field Mapping Differences:
| Concept | Non-Finance | Finance |
|---------|-------------|---------|
| Primary Income | Sales | Revenue |
| Core Profitability | Operating Profit Margin | Financing Margin |
| Main Liabilities | Borrowings | Deposits + Borrowings |
| Efficiency Metric | ROCE | ROE (primary) |
| Cycle Analysis | Working Capital Cycle | Not Applicable |
| Interest | Expense Item | Core Business Component |

### Data Validation Rules:
1. **Non-Finance**: Sales > 0, Operating Profit can be negative
2. **Finance**: Revenue > Interest, Financing Profit can be negative
3. **Both**: Net Profit can be negative, especially in crisis periods
4. **Balance Sheet**: Total Assets = Total Liabilities (always)

## Real Data Points for Testing

### Emami (Non-Finance) - Mar 2025
```json
{
  "company_id": "EMAMILTD",
  "period": "2025-Q1", 
  "sales": 963,
  "expenses": 744,
  "operating_profit": 219,
  "opm_percent": 23,
  "other_income": 21,
  "interest": 3,
  "depreciation": 44,
  "profit_before_tax": 194,
  "tax_percent": 16,
  "net_profit": 162,
  "eps": 3.72
}
```

### Axis Bank (Finance) - Mar 2025
```json
{
  "company_id": "AXISBANK",
  "period": "2025-Q1",
  "revenue": 32452,
  "interest": 18121,
  "expenses": 11943,
  "financing_profit": 2389,
  "financing_margin_percent": 7,
  "other_income": 7506,
  "profit_before_tax": 9895,
  "tax_percent": 24,
  "net_profit": 7509,
  "eps": 24.13
}
```

## Implementation Strategy

1. **Dual Parser Architecture**: Separate parsers for finance vs non-finance
2. **Unified Calculation Engine**: Common interface for ratio calculations  
3. **Real Data Testing**: Use actual Emami/Axis data in all tests
4. **Sector Detection**: Auto-detect company type for appropriate parsing
5. **Ratio Variants**: Support both traditional and finance-specific ratio sets

## Next Steps

1. Create detailed PRD with parsing specifications
2. Generate updated task list for data layer implementation
3. Build real-data test fixtures
4. Implement dual parser system
5. Create comprehensive ratio calculation engine 