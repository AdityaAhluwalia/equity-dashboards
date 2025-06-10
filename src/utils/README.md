# Utility Functions

This directory contains helper functions and utilities used throughout the application.

## Utility Categories

### Data Utilities
- **format.ts** - Number, currency, and date formatting
- **validation.ts** - Input validation and sanitization
- **transform.ts** - Data transformation helpers
- **sort.ts** - Sorting and filtering utilities

### UI Utilities
- **classnames.ts** - CSS class name utilities
- **responsive.ts** - Responsive design helpers
- **animation.ts** - Animation and transition utilities
- **accessibility.ts** - A11y helper functions

### Performance Utilities
- **debounce.ts** - Debouncing and throttling
- **memoization.ts** - Memoization helpers
- **lazy-loading.ts** - Lazy loading utilities
- **virtual-scroll.ts** - Virtual scrolling helpers

### Business Logic Utilities
- **financial-helpers.ts** - Financial calculation helpers
- **phase-detection.ts** - Operating cycle phase detection
- **comparison.ts** - Company comparison utilities
- **export.ts** - Data export utilities

## Features

- **Pure Functions**: Side-effect free utility functions
- **Type Safety**: Full TypeScript support
- **Performance**: Optimized for frequent use
- **Testing**: Comprehensive test coverage
- **Documentation**: JSDoc comments for all functions

## Usage

```tsx
import { 
  formatCurrency, 
  validateInput,
  detectPhase,
  debounce 
} from '@/utils'

// Format financial data
const formattedPrice = formatCurrency(2500.50, 'INR')

// Validate user input
const isValid = validateInput(userInput, 'number')

// Detect operating cycle phase
const phase = detectPhase(operatingCycleData)

// Debounce search function
const debouncedSearch = debounce(searchFunction, 300)
``` 