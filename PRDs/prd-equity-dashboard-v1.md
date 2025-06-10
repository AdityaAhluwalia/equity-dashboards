# Product Requirements Document: Personal Investment Analysis Dashboard

## 1. Introduction/Overview

This dashboard is a personal investment analysis tool designed to visually identify operating cycles (expansion, contraction) of companies across different sectors. It will process financial data from Screener.in JSON format, calculate 25+ financial ratios, and present them through intuitive visualizations inspired by modern dashboard designs with an Apple-style aesthetic using pastel colors.

The entire development will follow **Test-Driven Development (TDD)** methodology, ensuring high code quality, reliability, and maintainability through comprehensive test coverage.

**Goal**: Enable fundamental analysis and shortlisting of companies by visualizing financial trends and operating cycles across 5000+ Indian companies.

## 2. Goals

1. **Visual Cycle Identification**: Clearly show expansion/contraction phases through visual patterns
2. **Comprehensive Ratio Analysis**: Calculate and display 25+ financial ratios over 12 years and 12 quarters
3. **Efficient Comparison**: Compare up to 10 companies simultaneously with overlaid visualizations
4. **Historical Tracking**: Maintain complete historical data with monthly updates
5. **Scalable Performance**: Handle 5000+ companies with fast load times
6. **Mobile-First Design**: Fully responsive interface optimized for all devices
7. **Test-Driven Quality**: Achieve >90% test coverage with all features developed using TDD methodology

## 3. User Stories

1. **As an investor**, I want to see visual patterns in company financials so that I can identify operating cycles at a glance.
2. **As an investor**, I want to compare multiple companies' metrics overlaid on the same chart so that I can spot relative performance trends.
3. **As an investor**, I want to track historical changes monthly so that I can see how companies evolve over time.
4. **As an investor**, I want to save comparison sets so that I can quickly access my watchlists.
5. **As an investor**, I want to filter companies by sector/category so that I can analyze peer groups effectively.

## 4. Functional Requirements

### 4.0 Test-Driven Development Requirements
1. **Every feature must have tests written BEFORE implementation**
2. **All tests must fail initially (Red phase)**
3. **Write minimal code to pass tests (Green phase)**
4. **Refactor only after tests pass (Refactor phase)**
5. **Maintain test documentation for each feature**

### 4.1 Data Management
1. System must import JSON data from Screener.in format (both finance and non-finance variants)
2. System must calculate and store 25+ financial ratios upon data import
3. System must maintain historical snapshots with monthly granularity
4. System must handle batch updates for 5000+ companies efficiently

### 4.2 Core Visualizations
1. **Revenue/Profit Trends**: Combined bar and line charts showing absolute values and growth rates
2. **Growth Percentage Charts**: Bar charts for YoY and QoQ growth metrics
3. **Margin Analysis**: Line charts showing OPM, NPM, and other margin trends
4. **Quarterly Comparisons**: Side-by-side quarterly performance metrics
5. **Stock Performance**: Visual indicators for price movements and returns
6. **Cycle Indicators**: Visual markers for expansion/contraction phases
7. **Peer Comparison Tables**: Sortable tables with key metrics

### 4.3 Company Analysis Features
1. Display all 25+ calculated ratios in organized sections
2. Show 12-year annual trends for key metrics
3. Display 12-quarter rolling trends for recent performance
4. Highlight cycle phases with visual indicators (colors/patterns)
5. Provide ratio quality scores (excellent/good/fair/poor)

### 4.4 Comparison Features
1. Compare up to 10 companies simultaneously
2. Overlay multiple company metrics on single charts
3. Normalize data for meaningful comparisons
4. Save and load comparison sets
5. Quick toggle between companies in comparison view

### 4.5 Navigation & Organization
1. Category-based navigation (sector/industry grouping)
2. Search functionality for company names
3. Filter by financial metrics thresholds
4. Sort companies by any metric
5. Breadcrumb navigation for context

## 5. Non-Goals (Out of Scope)

1. Real-time stock price updates
2. News feed integration
3. AI-powered insights or predictions
4. Social features (sharing, comments, collaboration)
5. Multi-user authentication
6. External data sources beyond Screener.in
7. Trading functionality
8. Portfolio tracking
9. Export to PDF/Excel
10. Email alerts or notifications

## 6. Design Considerations

### Visual Design
- **Theme**: Apple-inspired design with pastel color palette
- **Color Scheme**: Soft pastels (blues, purples, greens, oranges) with high contrast for data
- **Typography**: Clean, modern sans-serif (Inter or SF Pro)
- **Layout**: Card-based with generous white space
- **Charts**: Smooth animations, hover interactions, consistent styling
- **Mobile**: Touch-optimized with responsive layouts

### UI Components
- Metric cards with trend indicators
- Interactive charts with tooltips
- Sliding panels for detailed views
- Tab navigation for data sections
- Toggle switches for comparisons
- Loading skeletons for data fetching

## 7. Technical Considerations

### Development Methodology: Test-Driven Development (TDD)
**All development must follow strict TDD principles:**
1. Write failing tests first (Red)
2. Write minimal code to pass tests (Green)
3. Refactor while keeping tests passing (Refactor)
4. No feature code without corresponding tests
5. Maintain >90% test coverage

### Recommended Stack
- **Framework**: Next.js 14 (App Router) - for performance, SEO, and scalability
- **Database**: Supabase with optimized schema
- **Charts**: Recharts with custom styling (best balance of customization and ease)
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand for global state
- **Data Processing**: Web Workers for heavy calculations
- **Testing Framework**: 
  - Jest for unit tests
  - React Testing Library for component tests
  - Playwright for E2E tests
  - MSW (Mock Service Worker) for API mocking

### Database Schema
```
- companies (id, name, sector, category, json_type)
- financial_snapshots (company_id, date, raw_json)
- calculated_ratios (snapshot_id, ratio_type, value, period_type)
- comparison_sets (id, name, company_ids[])
- metric_history (company_id, metric_name, date, value)
```

### Performance Optimizations
- Implement virtual scrolling for large lists
- Use database indexing on frequently queried fields
- Cache calculated ratios
- Lazy load chart components
- Implement progressive data loading

### Testing Strategy

#### Unit Tests (Jest)
- All utility functions (ratio calculations, data transformations)
- Database operations and queries
- State management logic
- API endpoints

#### Component Tests (React Testing Library)
- All UI components in isolation
- User interactions (clicks, inputs, selections)
- Conditional rendering logic
- Responsive behavior

#### Integration Tests (React Testing Library + MSW)
- Complete user flows
- Data fetching and display
- Chart rendering with mock data
- Company comparison workflows

#### E2E Tests (Playwright)
- Critical user journeys
- Multi-company comparison flows
- Data import and processing
- Performance benchmarks

#### Test Data
- Maintain test fixtures for all JSON formats
- Create factories for generating test data
- Use consistent seed data for predictable tests

## 8. Success Metrics

### Performance Metrics
1. **Page Load Time**: < 2 seconds for company dashboard
2. **Data Processing**: < 5 seconds to process and store single company update
3. **Comparison Load**: < 3 seconds to load 10-company comparison
4. **Database Capacity**: Support 5000+ companies with full history
5. **Mobile Performance**: Lighthouse score > 90
6. **Chart Rendering**: < 1 second for any visualization

### Test Quality Metrics
1. **Code Coverage**: Minimum 90% overall, 100% for financial calculations
2. **Test Execution Time**: All unit tests < 30 seconds
3. **E2E Test Suite**: Complete in < 5 minutes
4. **Test Reliability**: 0% flaky tests
5. **TDD Compliance**: 100% of features have tests written first

## 9. Open Questions

1. Should we implement automatic cycle detection algorithms?
2. Do we need offline capability for viewing cached data?
3. Should we add keyboard shortcuts for power users?
4. Do we need data validation for corrupted JSON files?
5. Should we implement data compression for historical storage?
6. Should we use snapshot testing for chart components?
7. Do we need visual regression testing for UI consistency?
8. Should we implement mutation testing to verify test quality?

## 10. Implementation Phases (TDD Approach)

### Phase 1: Foundation (Week 1-2)
**Test First:**
- Write tests for database schema validation
- Write tests for JSON parsing (both finance/non-finance formats)
- Write tests for all 25+ ratio calculations
- Write tests for data import pipeline

**Then Implement:**
- Set up Next.js project with testing infrastructure
- Implement Supabase database schema
- Build JSON parser with error handling
- Create ratio calculation engine
- Develop data import pipeline

### Phase 2: Core Visualizations (Week 3-4)
**Test First:**
- Write component tests for each chart type
- Write tests for responsive behavior
- Write tests for data transformation for charts
- Write tests for loading and error states

**Then Implement:**
- Build chart components (Revenue/Profit, Growth, Margins)
- Create company dashboard layout
- Implement historical trend views
- Develop responsive design system

### Phase 3: Comparison Features (Week 5)
**Test First:**
- Write tests for comparison logic (max 10 companies)
- Write tests for data normalization
- Write tests for comparison set CRUD operations
- Write integration tests for comparison workflows

**Then Implement:**
- Build multi-company comparison interface
- Implement overlay visualization logic
- Create comparison set management
- Optimize performance for multiple datasets

### Phase 4: Polish & Scale (Week 6)
**Test First:**
- Write performance tests (load time benchmarks)
- Write tests for batch import (5000+ companies)
- Write E2E tests for complete user flows
- Write tests for cycle identification logic

**Then Implement:**
- Implement batch import system
- Add cycle identification markers
- Performance optimization
- Mobile responsiveness fine-tuning

### Test Coverage Requirements
- **Minimum 90% code coverage**
- **100% coverage for financial calculations**
- **All user interactions must have tests**
- **Performance benchmarks must pass before deployment** 