# Master Financial Ratios List - Equity Dashboard V1

**Combined from real data analysis (Emami + Axis) and JSON extraction experience**
**Focus: Easily calculatable ratios from Screener.in JSON data**

## 🎯 **MASTER LIST: 35 Financial Ratios**

### **UNIVERSAL RATIOS (12 ratios) - All Company Types**

#### **Valuation Ratios (5)**
1. **Price-to-Earnings (P/E)** = Market Price ÷ EPS
   - *Data*: Market data + annual/quarterly results
2. **Price-to-Book (P/B)** = Market Price ÷ Book Value per Share
   - *Data*: Market data + balance sheet  
3. **Price-to-Sales (P/S)** = Market Cap ÷ Annual Revenue
   - *Data*: Market cap + P&L data
4. **Market Cap to Cash Flow** = Market Cap ÷ Operating Cash Flow
   - *Data*: Market cap + cash flow statements
5. **Dividend Yield** = Annual Dividend ÷ Market Price × 100
   - *Data*: Market data (readily available)

#### **Growth Ratios (4)**
6. **Revenue Growth (1Y)** = (Current Revenue - Previous Revenue) ÷ Previous Revenue × 100
   - *Data*: P&L annual data (12 years available)
7. **Revenue Growth (3Y CAGR)** = (Revenue₃ ÷ Revenue₀)^(1/3) - 1
   - *Data*: P&L annual data
8. **Profit Growth (1Y)** = (Current Profit - Previous Profit) ÷ Previous Profit × 100
   - *Data*: P&L annual data
9. **EPS Growth (1Y)** = (Current EPS - Previous EPS) ÷ Previous EPS × 100
   - *Data*: Quarterly/annual results

#### **Efficiency Ratios (3)**
10. **Return on Equity (ROE)** = Net Profit ÷ Shareholders Equity × 100
    - *Data*: P&L + balance sheet
11. **Asset Turnover** = Revenue ÷ Total Assets
    - *Data*: P&L + balance sheet
12. **Return on Assets (ROA)** = Net Profit ÷ Total Assets × 100
    - *Data*: P&L + balance sheet

---

### **NON-FINANCE SPECIFIC RATIOS (12 ratios) - Manufacturing/FMCG/Services**

#### **Profitability Ratios (4)**
13. **Net Profit Margin** = Net Profit ÷ Revenue × 100
    - *Data*: P&L quarterly/annual
14. **Operating Profit Margin (OPM)** = Operating Profit ÷ Sales × 100
    - *Data*: P&L quarterly data (available as OPM%)
15. **Return on Capital Employed (ROCE)** = EBIT ÷ Capital Employed × 100
    - *Data*: Available directly in market data
16. **Free Cash Flow Margin** = Free Cash Flow ÷ Revenue × 100
    - *Data*: Cash flow statements

#### **Leverage Ratios (4)**
17. **Debt-to-Equity** = Total Debt ÷ Shareholders Equity
    - *Data*: Balance sheet (borrowing + equity)
18. **Debt-to-Assets** = Total Debt ÷ Total Assets
    - *Data*: Balance sheet
19. **Interest Coverage** = EBIT ÷ Interest Expense
    - *Data*: P&L data (operating profit + interest)
20. **Equity Ratio** = Shareholders Equity ÷ Total Assets
    - *Data*: Balance sheet

#### **Working Capital Ratios (4)**
21. **Cash Conversion Cycle** = Debtor Days + Inventory Days - Creditor Days
    - *Data*: Available in ratios section for non-finance companies
22. **Working Capital Days** = (Current Assets - Current Liabilities) ÷ Daily Sales
    - *Data*: Available in ratios section
23. **Operating Cash Flow Margin** = Operating Cash Flow ÷ Revenue × 100
    - *Data*: Cash flow + P&L
24. **Cash Conversion Efficiency** = Operating Cash Flow ÷ Net Profit
    - *Data*: Cash flow + P&L

---

### **FINANCE SPECIFIC RATIOS (8 ratios) - Banks/NBFCs/Insurance**

#### **Core Banking Ratios (4)**
25. **Net Interest Margin (NIM)** = Financing Profit ÷ Total Assets × 100
    - *Data*: Quarterly results (financing margin % available)
26. **Cost-to-Income Ratio** = Operating Expenses ÷ Total Income × 100
    - *Data*: Quarterly results (expenses ÷ revenue)
27. **Non-Interest Income Ratio** = Other Income ÷ Total Income × 100
    - *Data*: Quarterly results
28. **Return on Assets (ROA)** = Net Profit ÷ Total Assets × 100
    - *Data*: P&L + balance sheet

#### **Growth & Risk Ratios (4)**
29. **Loan Growth Rate** = (Current Loans - Previous Loans) ÷ Previous Loans × 100
    - *Data*: Balance sheet other assets (proxy for loans)
30. **Deposit Growth Rate** = (Current Deposits - Previous Deposits) ÷ Previous Deposits × 100
    - *Data*: Balance sheet deposits
31. **Financing Margin Trend** = Current Financing Margin - Previous Margin
    - *Data*: Quarterly financing margin %
32. **Credit Quality Trend** = Analysis of loan book quality over time
    - *Data*: Balance sheet trends

---

### **QUALITY & CONSISTENCY METRICS (3 ratios) - All Companies**

#### **Earnings Quality (3)**
33. **Earnings Quality Score** = Operating Cash Flow ÷ Net Profit
    - *Categories*: Excellent (>1.2), Good (0.8-1.2), Fair (0.5-0.8), Poor (<0.5)
    - *Data*: Cash flow + P&L
34. **Revenue Volatility** = Standard Deviation of Revenue Growth Rates
    - *Data*: P&L historical data (12 years)
35. **Margin Stability** = Consistency Score for Operating Margins
    - *Data*: P&L quarterly OPM% data

---

## 📊 **DATA AVAILABILITY MAPPING**

### **Readily Available from Screener.in JSON:**
✅ **Market Data**: Current Price, Market Cap, P/E, P/B, Book Value, Dividend Yield, ROCE, ROE
✅ **Quarterly Results**: Revenue, Net Profit, Operating Profit, OPM%, EPS (13 periods)
✅ **Annual P&L**: Revenue, Net Profit, EPS (12 years)
✅ **Balance Sheet**: Equity Capital, Reserves, Borrowing, Total Assets (12 years)
✅ **Cash Flow**: Operating, Investing, Financing (12 years)
✅ **Ratios Section**: Debtor Days, Inventory Days, Cash Conversion Cycle (non-finance)

### **Finance Company Specific Fields:**
✅ **Financing Data**: Financing Profit, Financing Margin %
✅ **Banking Balance Sheet**: Deposits, Borrowings, Investments
✅ **Banking Operations**: Interest Income/Expense structure

### **Calculated/Derived Fields:**
🔄 **Growth Rates**: From historical P&L data
🔄 **Efficiency Ratios**: From P&L + balance sheet combinations
🔄 **Quality Metrics**: From cash flow + earnings analysis

---

## 🎯 **IMPLEMENTATION PRIORITY**

### **Phase 1: Core Ratios (15 ratios)**
- All Valuation ratios (5)
- Basic Growth ratios (4) 
- Core Efficiency ratios (3)
- Key Profitability ratios (3)

### **Phase 2: Sector-Specific (12 ratios)**
- Non-finance working capital & leverage (8)
- Finance banking ratios (4)

### **Phase 3: Quality Metrics (8 ratios)**
- Advanced quality scores (3)
- Remaining leverage & efficiency ratios (5)

---

## 💡 **KEY DIFFERENCES FROM ORIGINAL LISTS**

### **Added from Your List:**
- Market Cap to Cash Flow
- Debt-to-Assets Ratio
- Equity Ratio
- Cash Conversion Efficiency
- Earnings Quality Score
- Revenue Volatility
- Margin Stability
- Financing Margin Trend

### **Enhanced from My List:**
- Combined P/E and P/B into valuation section
- Made ROA universal instead of finance-specific
- Focused on ratios with clear data availability
- Removed ratios requiring detailed working capital breakdown (Debtor Days, etc.) unless directly available
- Emphasized growth trends and quality metrics

### **Practical Focus:**
- ✅ Every ratio has **clear data source** from JSON structure
- ✅ **35 total ratios** covering all major analysis needs
- ✅ **Sector-aware** with appropriate ratios for different company types
- ✅ **Quality-focused** with earnings and consistency analysis
- ✅ **Growth-oriented** with multiple timeframe analysis

This master list ensures we can implement all ratios using the actual data structure from Emami and Axis Bank JSONs while providing comprehensive financial analysis coverage. 