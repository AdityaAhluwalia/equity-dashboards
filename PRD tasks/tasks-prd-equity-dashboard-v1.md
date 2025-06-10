# Investment Dashboard Implementation Tasks

## Relevant Files

### Core Application Structure
- `src/app/layout.tsx` - Root layout with theme provider
- `src/app/page.tsx` - Main dashboard page
- `src/app/page.test.tsx` - Dashboard page tests
- `src/app/company/[id]/page.tsx` - Individual company dashboard
- `src/app/company/[id]/page.test.tsx` - Company dashboard tests
- `src/app/comparison/page.tsx` - Multi-company comparison view
- `src/app/comparison/page.test.tsx` - Comparison view tests

### Design System & Theme
- `src/styles/globals.css` - Global styles and CSS variables
- `src/styles/theme.ts` - Pastel color palette and design tokens
- `src/components/ui/Card.tsx` - Base card component with glass morphism
- `src/components/ui/Card.test.tsx` - Card component tests
- `src/components/ui/Badge.tsx` - Phase status badges
- `src/components/ui/Badge.test.tsx` - Badge component tests

### Company Header Section
- `src/components/company/CompanyHeader.tsx` - Header with phase badge
- `src/components/company/CompanyHeader.test.tsx` - Header tests
- `src/components/company/PhaseIndicator.tsx` - Cycle phase status indicator
- `src/components/company/PhaseIndicator.test.tsx` - Phase indicator tests
- `src/components/company/MetricCards.tsx` - Quick stats cards with sparklines
- `src/components/company/MetricCards.test.tsx` - Metric cards tests

### Cycle Identification Section (Primary Focus)
- `src/components/cycles/CycleTimeline.tsx` - Annual cycle timeline with colored bands
- `src/components/cycles/CycleTimeline.test.tsx` - Cycle timeline tests
- `src/components/cycles/QuarterlyCycleView.tsx` - Quarterly cycle identification
- `src/components/cycles/QuarterlyCycleView.test.tsx` - Quarterly cycle tests
- `src/components/cycles/CycleIndicatorsPanel.tsx` - Bar charts for cycle indicators
- `src/components/cycles/CycleIndicatorsPanel.test.tsx` - Indicators panel tests
- `src/lib/calculations/cycle-detection.ts` - Cycle phase detection algorithms
- `src/lib/calculations/cycle-detection.test.ts` - Cycle detection tests

### Revenue & Profit Section
- `src/components/financials/RevenueProfitChart.tsx` - Dual-axis time series
- `src/components/financials/RevenueProfitChart.test.tsx` - Revenue/profit tests
- `src/components/financials/QuarterlyRevenueChart.tsx` - Quarterly view
- `src/components/financials/QuarterlyRevenueChart.test.tsx` - Quarterly tests
- `src/components/financials/GrowthRateOverlay.tsx` - Growth rate lines
- `src/components/financials/GrowthRateOverlay.test.tsx` - Growth overlay tests

### Margins Timeline Section
- `src/components/margins/MarginsTimeline.tsx` - Multi-line margin trends
- `src/components/margins/MarginsTimeline.test.tsx` - Margins timeline tests
- `src/components/margins/QuarterlyMargins.tsx` - Quarterly margins view
- `src/components/margins/QuarterlyMargins.test.tsx` - Quarterly margins tests
- `src/components/margins/MarginRangeIndicator.tsx` - Normal range shading
- `src/components/margins/MarginRangeIndicator.test.tsx` - Range indicator tests

### Cash Flow Section
- `src/components/cashflow/CashFlowChart.tsx` - Stacked bar cash flows
- `src/components/cashflow/CashFlowChart.test.tsx` - Cash flow tests
- `src/components/cashflow/QuarterlyCashFlow.tsx` - Quarterly cash patterns
- `src/components/cashflow/QuarterlyCashFlow.test.tsx` - Quarterly CF tests
- `src/components/cashflow/FCFYieldOverlay.tsx` - FCF yield line overlay
- `src/components/cashflow/FCFYieldOverlay.test.tsx` - FCF yield tests

### Ratios Dashboard Section
- `src/components/ratios/ProfitabilityRatios.tsx` - ROE, ROCE, ROA charts
- `src/components/ratios/ProfitabilityRatios.test.tsx` - Profitability tests
- `src/components/ratios/ValuationRatios.tsx` - P/E, P/B timeline
- `src/components/ratios/ValuationRatios.test.tsx` - Valuation tests
- `src/components/ratios/LeverageRatios.tsx` - Debt metrics charts
- `src/components/ratios/LeverageRatios.test.tsx` - Leverage tests
- `src/components/ratios/GrowthMetrics.tsx` - CAGR comparison bars
- `src/components/ratios/GrowthMetrics.test.tsx` - Growth metrics tests

### Comparison View Section
- `src/components/comparison/IndexedPerformance.tsx` - Multi-company lines
- `src/components/comparison/IndexedPerformance.test.tsx` - Indexed perf tests
- `src/components/comparison/GrowthComparison.tsx` - Grouped bar charts
- `src/components/comparison/GrowthComparison.test.tsx` - Growth comp tests
- `src/components/comparison/RatioComparisonTable.tsx` - Table with sparklines
- `src/components/comparison/RatioComparisonTable.test.tsx` - Ratio table tests
- `src/components/comparison/CompanySelector.tsx` - Company selection UI
- `src/components/comparison/CompanySelector.test.tsx` - Selector tests

### Shared Chart Components
- `src/components/charts/TimeSeriesChart.tsx` - Reusable time series base
- `src/components/charts/TimeSeriesChart.test.tsx` - Time series tests
- `src/components/charts/BarChart.tsx` - Reusable bar chart base
- `src/components/charts/BarChart.test.tsx` - Bar chart tests
- `src/components/charts/ColoredPhaseBands.tsx` - Phase background bands
- `src/components/charts/ColoredPhaseBands.test.tsx` - Phase bands tests
- `src/components/charts/ChartTooltip.tsx` - Custom tooltip component
- `src/components/charts/ChartTooltip.test.tsx` - Tooltip tests
- `src/components/charts/ChartAnnotations.tsx` - Annotation layer
- `src/components/charts/ChartAnnotations.test.tsx` - Annotations tests

### Data Layer
- `src/lib/supabase/schema.sql` - Complete database schema
- `src/lib/supabase/client.ts` - Supabase client configuration
- `src/lib/parsers/screener-parser.ts` - Screener.in JSON parser
- `src/lib/parsers/screener-parser.test.ts` - Parser tests
- `src/lib/parsers/finance-company-parser.ts` - Finance company variant
- `src/lib/parsers/finance-company-parser.test.ts` - Finance parser tests
- `src/services/company.service.ts` - Company data operations
- `src/services/company.service.test.ts` - Company service tests
- `src/services/snapshot.service.ts` - Historical snapshot management
- `src/services/snapshot.service.test.ts` - Snapshot service tests
- `src/services/comparison.service.ts` - Comparison set operations
- `src/services/comparison.service.test.ts` - Comparison service tests

### Financial Calculations
- `src/lib/calculations/basic-ratios.ts` - Basic ratio calculations
- `src/lib/calculations/basic-ratios.test.ts` - Basic ratio tests
- `src/lib/calculations/growth-ratios.ts` - Growth rate calculations
- `src/lib/calculations/growth-ratios.test.ts` - Growth ratio tests
- `src/lib/calculations/efficiency-ratios.ts` - Efficiency metrics
- `src/lib/calculations/efficiency-ratios.test.ts` - Efficiency tests
- `src/lib/calculations/quality-scores.ts` - Quality scoring logic
- `src/lib/calculations/quality-scores.test.ts` - Quality score tests
- `src/lib/calculations/finance-specific.ts` - Finance company ratios
- `src/lib/calculations/finance-specific.test.ts` - Finance ratio tests
- `src/lib/calculations/trend-analyzer.ts` - Historical trend analysis
- `src/lib/calculations/trend-analyzer.test.ts` - Trend analysis tests

### State Management
- `src/stores/dashboard.store.ts` - Main dashboard state
- `src/stores/dashboard.store.test.ts` - Dashboard store tests
- `src/stores/comparison.store.ts` - Comparison view state
- `src/stores/comparison.store.test.ts` - Comparison store tests
- `src/stores/ui.store.ts` - UI preferences and toggles
- `src/stores/ui.store.test.ts` - UI store tests

### Utilities & Types
- `src/types/company.types.ts` - Company data types
- `src/types/financial.types.ts` - Financial metrics types
- `src/types/chart.types.ts` - Chart configuration types
- `src/utils/formatters.ts` - Number and date formatters
- `src/utils/formatters.test.ts` - Formatter tests
- `src/utils/colors.ts` - Color utilities for phases
- `src/utils/colors.test.ts` - Color utility tests

### Testing Infrastructure
- `jest.config.js` - Jest configuration
- `jest.setup.js` - Jest setup with testing-library
- `playwright.config.ts` - E2E test configuration
- `src/test/fixtures/company-data.ts` - Test data fixtures
- `src/test/factories/company.factory.ts` - Company data factories
- `src/test/mocks/handlers.ts` - MSW API mock handlers
- `e2e/dashboard.spec.ts` - Dashboard E2E tests
- `e2e/comparison.spec.ts` - Comparison view E2E tests

### Performance & Build
- `next.config.js` - Next.js configuration with optimizations
- `tailwind.config.js` - Tailwind with custom color palette
- `.env.example` - Environment variables template
- `src/lib/workers/calculation.worker.ts` - Web worker for heavy calculations
- `src/lib/workers/calculation.worker.test.ts` - Worker tests

### Notes

- All components follow TDD: Write failing tests first, then implement
- Use Recharts for all visualizations with custom styling
- Maintain consistent pastel color palette throughout
- Every chart must support both quarterly (12 quarters) and annual (12 years) views
- Phase identification colors: Green (expansion), Red (contraction), Yellow (transition), Gray (stable)
- All financial calculations must have 100% test coverage
- Use virtual scrolling for company lists exceeding 100 items

## Tasks

- [x] 1.0 Project Foundation & Design System ✅ COMPLETED
  - [x] 1.1 Initialize Next.js 14 project with TypeScript and app router ✅
  - [x] 1.2 Set up testing infrastructure (Jest, React Testing Library, Playwright) ✅
  - [x] 1.3 Configure Tailwind CSS with custom pastel color palette ✅
  - [x] 1.4 Set up Zustand for state management ✅
  - [x] 1.5 Create basic folder structure ✅
  - [x] 1.6 Set up Supabase client and database connection ✅
  - [x] 1.7 Install and configure Recharts ✅
  - [x] 1.8 Create initial TypeScript types and interfaces ✅

- [x] 2.0 Database & Data Layer Setup (Based on Real Emami & Axis Bank Data) ✅ COMPLETED
  - [x] 2.1 Sector Detection & Classification System (Finance vs Non-Finance) ✅ COMPLETED
  - [x] 2.2 Non-Finance Parser (Manufacturing/FMCG - Emami style) ✅ COMPLETED
  - [x] 2.3 Finance Parser (Banking/NBFC - Axis Bank style) ✅ COMPLETED
  - [x] 2.4 Unified Data Normalization Engine ✅ COMPLETED
  - [x] 2.5 Data Validation & Quality Framework ✅ COMPLETED

- [x] 3.0 Financial Calculations Engine (30+ Ratios with Real Data Testing) ✅ COMPLETED
  - [x] 3.1 Universal Ratio Calculator (12 ratios - ROE, Growth, P/E, etc.) ✅ COMPLETED
  - [x] 3.2 Non-Finance Ratio Calculator (12 ratios - OPM, ROCE, Working Capital) ✅ COMPLETED
  - [x] 3.3 Finance-Specific Ratio Calculator (6 ratios - NIM, Cost-to-Income) ✅ COMPLETED
  - [x] 3.4 Historical Trend Analysis Engine (CAGR, Growth patterns) ✅ COMPLETED
  - [x] 3.5 Cycle Detection Algorithm (Expansion/Contraction phases) ✅ COMPLETED
  - [x] 3.6 Real-Time Calculation Engine (Performance optimization) ✅ COMPLETED
  - [x] 3.7 Calculation Validation & Testing (Real data accuracy testing) ✅ COMPLETED

- [ ] 4.0 Integration & Service Layer
  - [ ] 4.1 Database Schema Implementation (Supabase production schema)
  - [ ] 4.2 Parser Service Integration (Unified parsing service)
  - [ ] 4.3 Real Data Test Fixtures (Emami & Axis 12-year datasets)
  - [ ] 4.4 Performance Optimization (1000+ companies, memory management)

- [ ] 4.0 Company Header & Overview Section
  - [ ] 4.1 Build CompanyHeader component with company info display
  - [ ] 4.2 Create PhaseIndicator badge showing current cycle status
  - [ ] 4.3 Implement MetricCards with sparkline visualizations
  - [ ] 4.4 Add loading and error states for header section
  - [ ] 4.5 Create responsive mobile layout for header

- [ ] 5.0 Cycle Identification Section (Primary Focus)
  - [ ] 5.1 Build CycleTimeline component with colored phase bands
  - [ ] 5.2 Implement annual view (12 years) with phase backgrounds
  - [ ] 5.3 Create QuarterlyCycleView with granular phase detection
  - [ ] 5.4 Build CycleIndicatorsPanel with momentum bar charts
  - [ ] 5.5 Add phase transition markers and annotations
  - [ ] 5.6 Implement hover interactions showing phase details
  - [ ] 5.7 Create phase legend and explanation tooltips
  - [ ] 5.8 Add export functionality for cycle analysis

- [ ] 6.0 Revenue & Profit Trends Section
  - [ ] 6.1 Build RevenueProfitChart with dual-axis display
  - [ ] 6.2 Implement bar charts for absolute values
  - [ ] 6.3 Add growth rate line overlays
  - [ ] 6.4 Create QuarterlyRevenueChart with seasonal patterns
  - [ ] 6.5 Implement TTM (trailing twelve months) calculations
  - [ ] 6.6 Add CAGR indicators and period selectors
  - [ ] 6.7 Create custom tooltips with detailed information
  - [ ] 6.8 Implement zoom and pan functionality

- [ ] 7.0 Margins Timeline Section
  - [ ] 7.1 Build MarginsTimeline with multi-line display
  - [ ] 7.2 Create normal range shading and indicators
  - [ ] 7.3 Implement QuarterlyMargins view
  - [ ] 7.4 Add moving average overlays
  - [ ] 7.5 Create variance highlighting from averages
  - [ ] 7.6 Implement margin stability indicators
  - [ ] 7.7 Add trend direction arrows and annotations

- [ ] 8.0 Cash Flow Patterns Section
  - [ ] 8.1 Build CashFlowChart with stacked bars
  - [ ] 8.2 Implement OCF, ICF, FCF breakdown display
  - [ ] 8.3 Create net cash flow line overlay
  - [ ] 8.4 Build QuarterlyCashFlow with positive/negative bars
  - [ ] 8.5 Add cumulative cash generation tracking
  - [ ] 8.6 Implement FCF yield calculations and display
  - [ ] 8.7 Create cash burn rate indicators

- [ ] 9.0 Key Ratios Dashboard Section
  - [ ] 9.1 Build ProfitabilityRatios component (ROE, ROCE, ROA)
  - [ ] 9.2 Add industry average comparison lines
  - [ ] 9.3 Create ValuationRatios timeline (P/E, P/B, EV/EBITDA)
  - [ ] 9.4 Implement historical average bands
  - [ ] 9.5 Build LeverageRatios charts with safe zones
  - [ ] 9.6 Create GrowthMetrics comparison bars
  - [ ] 9.7 Add ratio quality indicators
  - [ ] 9.8 Implement ratio explanations and tooltips

- [ ] 10.0 Comparison View Section
  - [ ] 10.1 Build CompanySelector with search and filters
  - [ ] 10.2 Create IndexedPerformance chart (base = 100)
  - [ ] 10.3 Implement multi-company line overlays
  - [ ] 10.4 Build GrowthComparison grouped bars
  - [ ] 10.5 Create RatioComparisonTable with sparklines
  - [ ] 10.6 Implement best performer highlighting
  - [ ] 10.7 Add comparison set save/load functionality
  - [ ] 10.8 Create relative strength analysis

- [ ] 11.0 Quarterly/Annual Toggle System
  - [ ] 11.1 Build global period toggle component
  - [ ] 11.2 Implement context provider for period state
  - [ ] 11.3 Update all charts to respond to period changes
  - [ ] 11.4 Add smooth transitions between views
  - [ ] 11.5 Maintain scroll position and zoom levels

- [ ] 12.0 State Management & Data Flow
  - [ ] 12.1 Set up Zustand stores for dashboard state
  - [ ] 12.2 Implement company data caching strategy
  - [ ] 12.3 Create comparison state management
  - [ ] 12.4 Build UI preferences persistence
  - [ ] 12.5 Implement optimistic updates
  - [ ] 12.6 Add error boundary components

- [ ] 13.0 Data Import & Processing Pipeline
  - [ ] 13.1 Build file upload interface for JSON imports
  - [ ] 13.2 Create import progress tracking UI
  - [ ] 13.3 Implement batch import for multiple companies
  - [ ] 13.4 Add import validation and error reporting
  - [ ] 13.5 Build scheduled update system
  - [ ] 13.6 Create import history tracking

- [ ] 14.0 Performance Optimization
  - [ ] 14.1 Implement virtual scrolling for company lists
  - [ ] 14.2 Add React.memo to expensive components
  - [ ] 14.3 Optimize Recharts rendering with custom shapes
  - [ ] 14.4 Implement lazy loading for chart sections
  - [ ] 14.5 Add service worker for offline caching
  - [ ] 14.6 Optimize bundle size with code splitting

- [ ] 15.0 Mobile Responsiveness
  - [ ] 15.1 Create mobile-specific layouts for all sections
  - [ ] 15.2 Implement touch gestures for charts
  - [ ] 15.3 Add swipeable section navigation
  - [ ] 15.4 Optimize chart sizes for mobile screens
  - [ ] 15.5 Create mobile-friendly comparison view
  - [ ] 15.6 Test on various device sizes

- [ ] 16.0 Polish & Final Testing
  - [ ] 16.1 Add loading skeletons for all components
  - [ ] 16.2 Implement comprehensive error handling
  - [ ] 16.3 Create onboarding flow for first-time users
  - [ ] 16.4 Add keyboard navigation support
  - [ ] 16.5 Implement accessibility features (ARIA labels)
  - [ ] 16.6 Conduct performance testing with 5000+ companies
  - [ ] 16.7 Run full E2E test suite
  - [ ] 16.8 Create deployment configuration 