# Chart Components

This directory contains chart components built with Recharts for financial data visualization.

## Components

- **OperatingCycleChart** - Main operating cycle visualization with phase bands
- **FinancialRatioChart** - Multi-ratio comparison charts
- **TrendChart** - Time series trend analysis
- **ComparisonChart** - Company comparison visualizations
- **PhaseIndicator** - Visual phase identification components

## Features

- **Phase Colors**: Green (expansion), Red (contraction), Yellow (transition), Gray (stable)
- **Responsive Design**: Adapts to mobile and desktop viewports
- **Interactive**: Hover effects, tooltips, and drill-down capabilities
- **Time Periods**: Support for quarterly (12 quarters) and annual (12 years) views
- **Smooth Animations**: Optimized for performance

## Chart Types

### Operating Cycle Chart
- Visualizes working capital cycle phases
- Color-coded phase bands for easy identification
- Supports both quarterly and annual data

### Financial Ratio Charts
- ROE, ROA, Debt-to-Equity, Current Ratio, etc.
- Multi-line charts for trend analysis
- Benchmark comparisons

## Usage

```tsx
import { OperatingCycleChart, FinancialRatioChart } from '@/components/charts'

export function CompanyDashboard({ companyData }) {
  return (
    <div>
      <OperatingCycleChart 
        data={companyData.operatingCycle}
        period="quarterly"
      />
      <FinancialRatioChart 
        data={companyData.ratios}
        ratios={['roe', 'roa', 'currentRatio']}
      />
    </div>
  )
}
``` 