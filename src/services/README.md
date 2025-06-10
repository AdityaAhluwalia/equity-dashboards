# Services

This directory contains data layer services for API communication and data processing.

## Services

### Data Services
- **screener-service.ts** - Screener.in API integration
- **supabase-service.ts** - Database operations
- **market-data-service.ts** - Real-time market data
- **company-service.ts** - Company data management

### Processing Services
- **data-processor.ts** - Raw data transformation
- **calculation-service.ts** - Financial calculations orchestration
- **cache-service.ts** - Data caching and optimization
- **sync-service.ts** - Data synchronization

## Features

- **API Integration**: RESTful API communication
- **Data Transformation**: Raw data to application models
- **Caching**: Intelligent caching for performance
- **Error Handling**: Robust error handling and retry logic
- **Type Safety**: Full TypeScript support

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components    │───▶│    Services     │───▶│   External APIs │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Zustand Store │
                       └─────────────────┘
```

## Usage

```tsx
import { 
  fetchCompanyData, 
  processFinancialData,
  syncMarketData 
} from '@/services'

// Fetch and process company data
const companyData = await fetchCompanyData('RELIANCE')
const processedData = processFinancialData(companyData)

// Real-time market data
const marketData = await syncMarketData(['RELIANCE', 'TCS'])
``` 