import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CashBurnRateChart } from './CashBurnRateChart';

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
  Area: ({ dataKey, yAxisId, stackId, ...props }: any) => (
    <div data-testid={`area-${dataKey}`} data-y-axis-id={yAxisId} data-stack-id={stackId} {...props} />
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
    operatingCashFlow: 133.2,
    investingCashFlow: -45.6,
    financingCashFlow: -23.1,
    netCashFlow: 64.5,
    cashPosition: 450.2,
    burnRate: -85.7,
    burnRateMA: -82.3,
    cashRunwayMonths: 63.1,
    operatingBurnRate: -133.2,
    investingBurnRate: 45.6,
    totalExpenses: 1112.4,
    revenue: 1245.6
  }
];

describe('CashBurnRateChart', () => {
  it('should render cash burn rate chart', () => {
    render(
      <CashBurnRateChart 
        data={mockQuarterlyData} 
        viewMode="quarterly"
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('composed-chart')).toBeInTheDocument();
  });

  it('should render burn rate line when enabled', () => {
    render(
      <CashBurnRateChart 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        showBurnRate={true}
      />
    );
    
    expect(screen.getByTestId('line-burnRate')).toBeInTheDocument();
  });

  it('should render cash runway when enabled', () => {
    render(
      <CashBurnRateChart 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        showCashRunway={true}
      />
    );
    
    expect(screen.getByTestId('line-cashRunwayMonths')).toBeInTheDocument();
  });

  it('should handle empty data gracefully', () => {
    render(
      <CashBurnRateChart 
        data={[]} 
        viewMode="quarterly"
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });
}); 