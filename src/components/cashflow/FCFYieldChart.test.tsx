import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FCFYieldChart } from './FCFYieldChart';

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  ComposedChart: ({ children, ...props }: any) => (
    <div data-testid="composed-chart" {...props}>{children}</div>
  ),
  Bar: ({ dataKey, yAxisId, ...props }: any) => (
    <div data-testid={`bar-${dataKey}`} data-y-axis-id={yAxisId} {...props} />
  ),
  Line: ({ dataKey, yAxisId, ...props }: any) => (
    <div data-testid={`line-${dataKey}`} data-y-axis-id={yAxisId} {...props} />
  ),
  XAxis: (props: any) => <div data-testid="x-axis" {...props} />,
  YAxis: ({ yAxisId, ...props }: any) => (
    <div data-testid={`y-axis-${yAxisId || 'primary'}`} {...props} />
  ),
  CartesianGrid: (props: any) => <div data-testid="cartesian-grid" {...props} />,
  Tooltip: (props: any) => <div data-testid="tooltip" {...props} />,
  Legend: (props: any) => <div data-testid="legend" {...props} />,
  ReferenceLine: ({ y, ...props }: any) => (
    <div data-testid="reference-line" data-y={y} {...props} />
  ),
}));

const mockQuarterlyData = [
  {
    year: 2022,
    quarter: 'Q1 2022',
    freeCashFlow: 133,
    marketCap: 15420,
    enterpriseValue: 14890,
    fcfYieldMarketCap: 3.44,
    fcfYieldEV: 3.57,
    totalAssets: 8750,
    revenue: 1245,
    fcfMargin: 10.68,
    assetTurnover: 0.57
  }
];

describe('FCFYieldChart', () => {
  it('should render FCF yield chart', () => {
    render(
      <FCFYieldChart 
        data={mockQuarterlyData} 
        viewMode="quarterly"
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('composed-chart')).toBeInTheDocument();
  });

  it('should render FCF yield based on market cap when enabled', () => {
    render(
      <FCFYieldChart 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        showFCFYieldMarketCap={true}
      />
    );
    
    expect(screen.getByTestId('line-fcfYieldMarketCap')).toBeInTheDocument();
  });

  it('should handle empty data gracefully', () => {
    render(
      <FCFYieldChart 
        data={[]} 
        viewMode="quarterly"
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });
}); 