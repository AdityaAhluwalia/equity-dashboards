# Company Components

This directory contains components specific to company data display and interaction.

## Components

- **CompanyCard** - Company overview cards for lists and grids
- **CompanyDetails** - Detailed company information panel
- **CompanySearch** - Search and filter functionality
- **CompanyComparison** - Side-by-side company comparison
- **FinancialSummary** - Key financial metrics summary
- **SectorAnalysis** - Sector-specific analysis components

## Features

- **Company Profiles**: Basic info, sector, market cap, current price
- **Financial Metrics**: Revenue, profit, ratios, growth rates
- **Search & Filter**: By sector, market cap, performance metrics
- **Comparison Tools**: Multi-company analysis
- **Real-time Updates**: Live price and data updates

## Data Sources

- Screener.in JSON data processing
- Real-time market data integration
- Historical financial statements
- Calculated financial ratios

## Usage

```tsx
import { 
  CompanyCard, 
  CompanyDetails, 
  CompanySearch 
} from '@/components/company'

export function CompanyExplorer() {
  return (
    <div>
      <CompanySearch onFilter={handleFilter} />
      <div className="grid">
        {companies.map(company => (
          <CompanyCard 
            key={company.id}
            company={company}
            onClick={() => setSelected(company)}
          />
        ))}
      </div>
      {selectedCompany && (
        <CompanyDetails company={selectedCompany} />
      )}
    </div>
  )
}
``` 