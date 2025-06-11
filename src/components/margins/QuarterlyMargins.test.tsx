import React from 'react';
import { render, screen } from '@testing-library/react';
import { QuarterlyMargins } from './QuarterlyMargins';
import type { Company } from '@/types/ui.types';

// Mock company data with seasonal patterns
const mockCompanyData = {
  company: {
    id: 'test-company',
    name: 'Test Company',
    sector: 'Consumer Goods',
    marketCap: 1000,
    currentPhase: 'expansion',
  } as Company,
  quarterlyData: [
    // FY 2022-23 - showing seasonal patterns
    { quarter: 'Q1 2023', year: 2023, quarter_number: 1, revenue: 850, netProfit: 85, operatingProfit: 153, grossProfit: 425, operatingMargin: 18.0, netMargin: 10.0, grossMargin: 50.0 },
    { quarter: 'Q2 2023', year: 2023, quarter_number: 2, revenue: 920, netProfit: 101, operatingProfit: 166, grossProfit: 460, operatingMargin: 18.0, netMargin: 11.0, grossMargin: 50.0 },
    { quarter: 'Q3 2023', year: 2023, quarter_number: 3, revenue: 900, netProfit: 99, operatingProfit: 162, grossProfit: 450, operatingMargin: 18.0, netMargin: 11.0, grossMargin: 50.0 },
    { quarter: 'Q4 2023', year: 2023, quarter_number: 4, revenue: 1050, netProfit: 126, operatingProfit: 189, grossProfit: 525, operatingMargin: 18.0, netMargin: 12.0, grossMargin: 50.0 },
    // FY 2023-24 - continuing pattern
    { quarter: 'Q1 2024', year: 2024, quarter_number: 1, revenue: 890, netProfit: 89, operatingProfit: 160, grossProfit: 445, operatingMargin: 18.0, netMargin: 10.0, grossMargin: 50.0 },
    { quarter: 'Q2 2024', year: 2024, quarter_number: 2, revenue: 960, netProfit: 106, operatingProfit: 173, grossProfit: 480, operatingMargin: 18.0, netMargin: 11.0, grossMargin: 50.0 },
    { quarter: 'Q3 2024', year: 2024, quarter_number: 3, revenue: 940, netProfit: 103, operatingProfit: 169, grossProfit: 470, operatingMargin: 18.0, netMargin: 11.0, grossMargin: 50.0 },
    { quarter: 'Q4 2024', year: 2024, quarter_number: 4, revenue: 1100, netProfit: 132, operatingProfit: 198, grossProfit: 550, operatingMargin: 18.0, netMargin: 12.0, grossMargin: 50.0 },
  ],
};

describe('QuarterlyMargins', () => {
  it('renders quarterly margins component', () => {
    render(<QuarterlyMargins data={mockCompanyData} />);
    
    expect(screen.getByTestId('quarterly-margins')).toBeInTheDocument();
    expect(screen.getByText('Quarterly Margins Analysis')).toBeInTheDocument();
  });

  it('displays quarterly chart with 8 quarters by default', () => {
    render(<QuarterlyMargins data={mockCompanyData} />);
    
    const chartContainer = screen.getByTestId('quarterly-chart-container');
    expect(chartContainer).toBeInTheDocument();
    expect(chartContainer).toHaveClass('h-80');
  });

  it('shows seasonal pattern indicators', () => {
    render(<QuarterlyMargins data={mockCompanyData} />);
    
    expect(screen.getByTestId('seasonal-patterns')).toBeInTheDocument();
    expect(screen.getByText('Seasonal Patterns')).toBeInTheDocument();
  });

  it('displays quarter-over-quarter growth rates', () => {
    render(<QuarterlyMargins data={mockCompanyData} />);
    
    expect(screen.getByTestId('qoq-growth')).toBeInTheDocument();
    expect(screen.getByText('QoQ Growth')).toBeInTheDocument();
  });

  it('shows year-over-year comparisons', () => {
    render(<QuarterlyMargins data={mockCompanyData} />);
    
    expect(screen.getByTestId('yoy-comparison')).toBeInTheDocument();
    expect(screen.getByText('YoY Comparison')).toBeInTheDocument();
  });

  it('detects and highlights seasonal peaks', () => {
    render(<QuarterlyMargins data={mockCompanyData} />);
    
    // Should detect Q4 as typically strong quarter
    expect(screen.getByTestId('seasonal-peak-indicator')).toBeInTheDocument();
    expect(screen.getByText('Q4 Peak Season')).toBeInTheDocument();
  });

  it('shows margin volatility indicators', () => {
    render(<QuarterlyMargins data={mockCompanyData} />);
    
    expect(screen.getByTestId('volatility-indicators')).toBeInTheDocument();
    expect(screen.getByText('Margin Volatility')).toBeInTheDocument();
  });

  it('supports different quarters range selection', () => {
    render(<QuarterlyMargins data={mockCompanyData} quartersToShow={12} />);
    
    expect(screen.getByTestId('quarterly-margins')).toBeInTheDocument();
  });

  it('displays average margin bands', () => {
    render(<QuarterlyMargins data={mockCompanyData} showAverageBands={true} />);
    
    expect(screen.getByTestId('average-bands-enabled')).toBeInTheDocument();
    expect(screen.getByText('Average Bands')).toBeInTheDocument();
  });

  it('shows quarterly performance summary', () => {
    render(<QuarterlyMargins data={mockCompanyData} />);
    
    expect(screen.getByTestId('quarterly-summary')).toBeInTheDocument();
    expect(screen.getByText('Quarterly Performance')).toBeInTheDocument();
  });

  it('handles empty quarterly data gracefully', () => {
    const emptyData = { ...mockCompanyData, quarterlyData: [] };
    render(<QuarterlyMargins data={emptyData} />);
    
    expect(screen.getByTestId('quarterly-margins')).toBeInTheDocument();
    expect(screen.getByText('No quarterly data available')).toBeInTheDocument();
  });

  it('detects seasonal consistency patterns', () => {
    render(<QuarterlyMargins data={mockCompanyData} />);
    
    expect(screen.getByTestId('seasonal-consistency')).toBeInTheDocument();
    expect(screen.getByText('Pattern Consistency: high')).toBeInTheDocument();
  });

  it('shows margin improvement/decline trends', () => {
    render(<QuarterlyMargins data={mockCompanyData} />);
    
    expect(screen.getByTestId('margin-trends')).toBeInTheDocument();
  });

  it('applies Apple-style design with rounded corners', () => {
    render(<QuarterlyMargins data={mockCompanyData} />);
    
    const container = screen.getByTestId('quarterly-margins');
    expect(container).toHaveClass('bg-white', 'rounded-2xl', 'p-6');
  });

  it('includes interactive quarter selection', () => {
    render(<QuarterlyMargins data={mockCompanyData} />);
    
    expect(screen.getByTestId('quarter-selector')).toBeInTheDocument();
  });

  it('displays margin range for each quarter type', () => {
    render(<QuarterlyMargins data={mockCompanyData} />);
    
    // Should show ranges for Q1, Q2, Q3, Q4
    expect(screen.getByTestId('q1-range')).toBeInTheDocument();
    expect(screen.getByTestId('q2-range')).toBeInTheDocument();
    expect(screen.getByTestId('q3-range')).toBeInTheDocument();
    expect(screen.getByTestId('q4-range')).toBeInTheDocument();
  });

  it('shows best and worst performing quarters', () => {
    render(<QuarterlyMargins data={mockCompanyData} />);
    
    expect(screen.getByTestId('best-quarter')).toBeInTheDocument();
    expect(screen.getByTestId('worst-quarter')).toBeInTheDocument();
  });
}); 