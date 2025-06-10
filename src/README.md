# Source Code Architecture

This directory contains the complete source code for the Equity Dashboard V1 application.

## Directory Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── globals.css        # Global styles and Tailwind config
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Homepage component
│   └── page.test.tsx      # Homepage tests
├── components/             # React components
│   ├── ui/                # Base UI components (Button, Card, Input, etc.)
│   ├── charts/            # Chart components (Recharts-based)
│   └── company/           # Company-specific components
├── lib/                   # Utilities and calculations
│   ├── calculations/      # Financial calculation functions (100% test coverage)
│   └── design-tokens.ts   # Design system tokens and utilities
├── services/              # Data layer services
│   └── README.md          # API integration and data processing
├── stores/                # Zustand state management
│   ├── app-store.ts       # Global application state
│   ├── company-store.ts   # Company data management
│   └── index.ts           # Store exports and utilities
├── types/                 # TypeScript type definitions
│   └── README.md          # Type organization and guidelines
└── utils/                 # Helper functions and utilities
    └── README.md          # Utility function categories
```

## Architecture Principles

### 1. **Test-Driven Development (TDD)**
- All development follows RED-GREEN-REFACTOR cycle
- 100% test coverage for financial calculations
- >90% overall test coverage

### 2. **Type Safety**
- Strict TypeScript configuration
- Comprehensive type definitions
- Type-safe API communication

### 3. **Component Architecture**
- Atomic design principles
- Reusable UI components
- Feature-specific components

### 4. **State Management**
- Zustand for global state
- Persistent user preferences
- Optimistic updates

### 5. **Performance**
- Virtual scrolling for large datasets
- Lazy loading for chart sections
- Web Workers for heavy calculations
- React.memo for expensive components

## Data Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Screener.in   │───▶│    Services     │───▶│   Zustand Store │
│   JSON Data     │    │   (Transform)   │    │   (Normalize)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components    │◀───│   Calculations  │◀───│   Raw Data      │
│   (Display)     │    │   (Process)     │    │   (Financial)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Key Features

- **25+ Financial Ratios**: Comprehensive financial analysis
- **Operating Cycle Visualization**: Phase identification with color coding
- **Apple-inspired Design**: Pastel colors and smooth animations
- **Mobile-first Responsive**: Optimized for all screen sizes
- **Real-time Updates**: Live market data integration
- **Accessibility**: WCAG 2.1 compliance

## Development Workflow

1. **Write Tests First**: Follow TDD principles
2. **Implement Features**: Build to pass tests
3. **Refactor**: Clean up while maintaining tests
4. **Document**: Update README and JSDoc comments
5. **Test Coverage**: Ensure >90% coverage (100% for calculations)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Build for production
npm run build
``` 