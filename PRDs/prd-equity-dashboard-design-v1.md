# Product Requirements Document: Equity Dashboard Design and Look V1

## Overview

This PRD defines the visual design, chart structure, and user interface layout for the Personal Investment Analysis Dashboard. The focus is on creating clean, effective visualizations that clearly show business cycles and trends through simplified chart types and intuitive design patterns.

## 📊 Simplified Dashboard Structure

### **1. Company Header**
- Company name, sector, current metrics
- **Phase Status Badge**: Current cycle phase (Expansion/Contraction/Stable)
- Last updated date

---

### **2. Cycle Identification Section** ⭐ (Primary Focus)

#### 2.1 **Annual Cycle Timeline** (12 years)
- **Time series with colored background bands**
  - Green bands: Expansion years
  - Red bands: Contraction years  
  - Yellow bands: Transition/Peak years
- Revenue + Profit lines overlaid
- Annotation markers for significant events

#### 2.2 **Quarterly Cycle View** (12 quarters)
- **Same colored band approach but quarterly**
- More granular phase identification
- QoQ growth rate line overlaid

#### 2.3 **Cycle Indicators Panel**
- Simple bar charts showing:
  - Revenue growth momentum
  - Margin expansion/contraction
  - Cash flow strength
  - Working capital efficiency
- Color-coded bars (green/red) for quick phase identification

---

### **3. Revenue & Profit Trends**

#### 3.1 **Annual View** (12 years)
- **Dual-axis time series**: 
  - Bars: Revenue & Profit absolute values
  - Lines: YoY growth rates
- CAGR indicators as simple text

#### 3.2 **Quarterly View** (12 quarters)
- **Same format but quarterly**
- Seasonal patterns visible
- TTM (trailing twelve months) line for smoothing

---

### **4. Margins Timeline**

#### 4.1 **Annual Margins** (12 years)
- **Multi-line time series**: OPM%, NPM%, EBITDA%
- Shaded area showing "normal range"
- Trend direction arrows

#### 4.2 **Quarterly Margins** (12 quarters)
- **Same multi-line format**
- 4-quarter moving average overlay
- Variance from average highlighted

---

### **5. Cash Flow Patterns**

#### 5.1 **Annual Cash Flows**
- **Stacked bar chart**: OCF, ICF, FCF
- Net cash flow line
- Free cash flow yield % as overlay

#### 5.2 **Quarterly Cash Flows**
- **Simple bar chart** with positive/negative bars
- Cumulative cash generation line

---

### **6. Key Ratios Dashboard**

#### 6.1 **Profitability Ratios Timeline**
- **Line charts**: ROE, ROCE, ROA over time
- Industry average as dotted line
- Above/below average shading

#### 6.2 **Valuation Ratios Timeline**
- **Line charts**: P/E, P/B, EV/EBITDA
- Historical average band
- Current position marker

#### 6.3 **Leverage & Liquidity**
- **Simple line charts**: Debt/Equity, Current Ratio
- Safe zone shading
- Trend arrows

#### 6.4 **Growth Metrics**
- **Bar chart**: 3yr, 5yr, 10yr CAGRs
- Side-by-side comparison
- Color coding by performance

---

### **7. Comparison View** (When Multiple Companies Selected)

#### 7.1 **Indexed Performance**
- **Multi-line time series** (base = 100)
- Up to 10 companies overlaid
- Key metrics: Revenue, Profit, Margins

#### 7.2 **Growth Comparison**
- **Grouped bar charts**
- Side-by-side growth rates
- Clear color coding per company

#### 7.3 **Ratio Comparison**
- **Simple table with sparklines**
- Current values + mini trend charts
- Best performer highlighting

---

### **8. Quarterly vs Annual Toggle Panel**
- **Single toggle** to switch all charts between:
  - Last 12 quarters (detailed)
  - Last 12 years (long-term)
- Maintains context across views

---

## 🎯 Key Design Principles

### **Visual Phase Identification**
1. **Color-coded backgrounds** on all time series:
   - Green: Expansion (growing above average)
   - Red: Contraction (declining or below average)
   - Yellow: Transition/Peak
   - Gray: Stable/Neutral

2. **Phase indicators** calculated from:
   - Revenue growth rate vs 3-year average
   - Margin expansion/contraction
   - Cash flow trends
   - Working capital changes

### **Chart Annotations** (Future AI Enhancement)
- Placeholder for automatic annotations like:
  - "Margin expansion phase started Q3 2023"
  - "Revenue growth deceleration observed"
  - "Working capital improvement trend"
  - "Entering potential contraction phase"

### **Simple Interactions**
- Hover for exact values
- Click to drill down
- Drag to zoom time periods
- Toggle between quarterly/annual

### **Clean Layout**
```
+------------------+------------------+
| Cycle Timeline   | Key Metrics      |
| (Main Focus)     | Summary Cards    |
+------------------+------------------+
| Revenue/Profit   | Margins          |
| Time Series      | Time Series      |
+------------------+------------------+
| Cash Flows       | Key Ratios       |
| Bar Charts       | Line Charts      |
+------------------+------------------+
| Comparison View (When Active)       |
+-------------------------------------+
```

### **Mobile Responsive**
- Stack sections vertically
- Swipeable time periods
- Collapsible sections
- Same visualizations, just reordered

## Focus Areas

This approach focuses on:
- **Time series everywhere** to show movement
- **Simple lines and bars** only
- **Clear phase identification** through colors
- **Easy comparisons** with overlaid lines
- **Future-ready for AI annotations**

## Visual Hierarchy

1. **Primary Focus**: Cycle identification through colored timeline backgrounds
2. **Secondary Focus**: Revenue/profit trends with dual-axis visualization
3. **Supporting Elements**: Margins, cash flows, and ratio timelines
4. **Comparison Mode**: Multi-company overlay with indexed performance

## Color Strategy

- **Phase Colors**: Green (expansion), Red (contraction), Yellow (transition), Gray (stable)
- **Data Colors**: Consistent pastel palette for different metrics
- **Emphasis Colors**: High contrast for important data points
- **Background**: Clean white with subtle grid lines 