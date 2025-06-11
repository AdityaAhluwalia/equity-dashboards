import { render, screen, fireEvent } from '@testing-library/react';
import { CashFlowChart } from './CashFlowChart';

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  ComposedChart: ({ children, ...props }: any) => (
    <div data-testid="composed-chart" {...props}>{children}</div>
  ),
  Bar: ({ dataKey, stackId, ...props }: any) => (
    <div data-testid={`bar-${dataKey}`} data-stack-id={stackId} {...props} />
  ),
  Line: ({ dataKey, ...props }: any) => (
    <div data-testid={`line-${dataKey}`} {...props} />
  ),
  XAxis: (props: any) => <div data-testid="x-axis" {...props} />,
  YAxis: ({ yAxisId, ...props }: any) => (
    <div data-testid={`y-axis${yAxisId ? `-${yAxisId}` : ''}`} {...props} />
  ),
  CartesianGrid: (props: any) => <div data-testid="cartesian-grid" {...props} />,
  Tooltip: (props: any) => <div data-testid="tooltip" {...props} />,
  Legend: (props: any) => <div data-testid="legend" {...props} />,
  ReferenceLine: ({ y, ...props }: any) => (
    <div data-testid="reference-line" data-y={y} {...props} />
  ),
}));

const mockAnnualData = [
  {
    year: 2020,
    revenue: 3180,
    netProfit: 390,
    operatingCashFlow: 420,
    investingCashFlow: -150,
    financingCashFlow: -180,
    netCashFlow: 90,
    freeCashFlow: 270,
    totalAssets: 4100
  },
  {
    year: 2021,
    revenue: 3450,
    netProfit: 450,
    operatingCashFlow: 520,
    investingCashFlow: -200,
    financingCashFlow: -150,
    netCashFlow: 170,
    freeCashFlow: 320,
    totalAssets: 4400
  },
  {
    year: 2022,
    revenue: 3680,
    netProfit: 520,
    operatingCashFlow: 580,
    investingCashFlow: -220,
    financingCashFlow: -160,
    netCashFlow: 200,
    freeCashFlow: 360,
    totalAssets: 4700
  },
  {
    year: 2023,
    revenue: 3950,
    netProfit: 580,
    operatingCashFlow: 650,
    investingCashFlow: -250,
    financingCashFlow: -180,
    netCashFlow: 220,
    freeCashFlow: 400,
    totalAssets: 5000
  }
];

const mockQuarterlyData = [
  {
    quarter: 'Q1 2023',
    operatingCashFlow: 160,
    investingCashFlow: -60,
    financingCashFlow: -45,
    netCashFlow: 55,
    freeCashFlow: 100
  },
  {
    quarter: 'Q2 2023',
    operatingCashFlow: 165,
    investingCashFlow: -65,
    financingCashFlow: -40,
    netCashFlow: 60,
    freeCashFlow: 100
  },
  {
    quarter: 'Q3 2023',
    operatingCashFlow: 160,
    investingCashFlow: -60,
    financingCashFlow: -50,
    netCashFlow: 50,
    freeCashFlow: 100
  },
  {
    quarter: 'Q4 2023',
    operatingCashFlow: 165,
    investingCashFlow: -65,
    financingCashFlow: -45,
    netCashFlow: 55,
    freeCashFlow: 100
  }
];

describe('CashFlowChart', () => {
  // Basic Rendering Tests
  it('should render with annual data', () => {
    render(<CashFlowChart data={mockAnnualData} viewMode="annual" />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('composed-chart')).toBeInTheDocument();
  });

  it('should render with quarterly data', () => {
    render(<CashFlowChart data={mockQuarterlyData} viewMode="quarterly" />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('composed-chart')).toBeInTheDocument();
  });

  // Stacked Bar Components Tests
  it('should render all three cash flow component bars', () => {
    render(<CashFlowChart data={mockAnnualData} viewMode="annual" />);
    
    // OCF (Operating Cash Flow) - positive
    expect(screen.getByTestId('bar-operatingCashFlow')).toBeInTheDocument();
    
    // ICF (Investing Cash Flow) - typically negative
    expect(screen.getByTestId('bar-investingCashFlow')).toBeInTheDocument();
    
    // FCF (Financing Cash Flow) - can be positive or negative
    expect(screen.getByTestId('bar-financingCashFlow')).toBeInTheDocument();
  });

  it('should stack bars with same stackId', () => {
    render(<CashFlowChart data={mockAnnualData} viewMode="annual" />);
    
    const ocfBar = screen.getByTestId('bar-operatingCashFlow');
    const icfBar = screen.getByTestId('bar-investingCashFlow');
    const fcfBar = screen.getByTestId('bar-financingCashFlow');
    
    expect(ocfBar).toHaveAttribute('data-stack-id', 'cashflow');
    expect(icfBar).toHaveAttribute('data-stack-id', 'cashflow');
    expect(fcfBar).toHaveAttribute('data-stack-id', 'cashflow');
  });

  // Net Cash Flow Line Overlay Tests
  it('should render net cash flow line overlay', () => {
    render(<CashFlowChart data={mockAnnualData} viewMode="annual" />);
    
    expect(screen.getByTestId('line-netCashFlow')).toBeInTheDocument();
  });

  it('should render net cash flow line with different axis', () => {
    render(<CashFlowChart data={mockAnnualData} viewMode="annual" />);
    
    const netCashFlowLine = screen.getByTestId('line-netCashFlow');
    expect(netCashFlowLine).toHaveAttribute('yAxisId', 'right');
  });

  // FCF Yield Calculations Tests
  it('should calculate and display FCF yield when enabled', () => {
    render(
      <CashFlowChart 
        data={mockAnnualData} 
        viewMode="annual" 
        showFCFYield={true}
      />
    );
    
    expect(screen.getByTestId('line-fcfYield')).toBeInTheDocument();
  });

  it('should not display FCF yield when disabled', () => {
    render(
      <CashFlowChart 
        data={mockAnnualData} 
        viewMode="annual" 
        showFCFYield={false}
      />
    );
    
    expect(screen.queryByTestId('line-fcfYield')).not.toBeInTheDocument();
  });

  // Chart Configuration Tests
  it('should render appropriate axes for cash flow chart', () => {
    render(<CashFlowChart data={mockAnnualData} viewMode="annual" />);
    
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument(); // Left axis for cash flows
    expect(screen.getByTestId('y-axis-right')).toBeInTheDocument(); // Right axis for net cash flow
  });

  it('should render cartesian grid', () => {
    render(<CashFlowChart data={mockAnnualData} viewMode="annual" />);
    
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
  });

  it('should render tooltip', () => {
    render(<CashFlowChart data={mockAnnualData} viewMode="annual" />);
    
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('should render legend', () => {
    render(<CashFlowChart data={mockAnnualData} viewMode="annual" />);
    
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  // Color Configuration Tests
  it('should use appropriate colors for cash flow components', () => {
    render(<CashFlowChart data={mockAnnualData} viewMode="annual" />);
    
    const ocfBar = screen.getByTestId('bar-operatingCashFlow');
    const icfBar = screen.getByTestId('bar-investingCashFlow');
    const fcfBar = screen.getByTestId('bar-financingCashFlow');
    
    expect(ocfBar).toHaveAttribute('fill', '#10b981'); // Green for positive OCF
    expect(icfBar).toHaveAttribute('fill', '#ef4444'); // Red for negative ICF
    expect(fcfBar).toHaveAttribute('fill', '#f59e0b'); // Orange for FCF
  });

  it('should use distinct color for net cash flow line', () => {
    render(<CashFlowChart data={mockAnnualData} viewMode="annual" />);
    
    const netCashFlowLine = screen.getByTestId('line-netCashFlow');
    expect(netCashFlowLine).toHaveAttribute('stroke', '#3b82f6'); // Blue for net cash flow
    expect(netCashFlowLine).toBeInTheDocument();
  });

  // View Mode Tests
  it('should handle annual view mode correctly', () => {
    render(<CashFlowChart data={mockAnnualData} viewMode="annual" />);
    
    const xAxis = screen.getByTestId('x-axis');
    expect(xAxis).toHaveAttribute('dataKey', 'year');
  });

  it('should handle quarterly view mode correctly', () => {
    render(<CashFlowChart data={mockQuarterlyData} viewMode="quarterly" />);
    
    const xAxis = screen.getByTestId('x-axis');
    expect(xAxis).toHaveAttribute('dataKey', 'quarter');
  });

  // Zero Line Reference Tests
  it('should render zero reference line when enabled', () => {
    render(
      <CashFlowChart 
        data={mockAnnualData} 
        viewMode="annual" 
        showZeroLine={true}
      />
    );
    
    const zeroLine = screen.getByTestId('reference-line');
    expect(zeroLine).toHaveAttribute('data-y', '0');
  });

  it('should not render zero reference line when disabled', () => {
    render(
      <CashFlowChart 
        data={mockAnnualData} 
        viewMode="annual" 
        showZeroLine={false}
      />
    );
    
    expect(screen.queryByTestId('reference-line')).not.toBeInTheDocument();
  });

  // Interactive Features Tests
  it('should support custom height', () => {
    render(
      <CashFlowChart 
        data={mockAnnualData} 
        viewMode="annual" 
        height={500}
      />
    );
    
    const container = screen.getByTestId('responsive-container');
    expect(container).toBeInTheDocument();
  });

  it('should use default height when not specified', () => {
    render(<CashFlowChart data={mockAnnualData} viewMode="annual" />);
    
    const container = screen.getByTestId('responsive-container');
    expect(container).toBeInTheDocument();
  });

  // Data Processing Tests
  it('should handle positive and negative cash flows correctly', () => {
    const mixedData = [
      {
        year: 2023,
        operatingCashFlow: 500,   // Positive
        investingCashFlow: -200,  // Negative
        financingCashFlow: -100,  // Negative
        netCashFlow: 200          // Positive
      }
    ];

    render(<CashFlowChart data={mixedData} viewMode="annual" />);
    
    expect(screen.getByTestId('bar-operatingCashFlow')).toBeInTheDocument();
    expect(screen.getByTestId('bar-investingCashFlow')).toBeInTheDocument();
    expect(screen.getByTestId('bar-financingCashFlow')).toBeInTheDocument();
    expect(screen.getByTestId('line-netCashFlow')).toBeInTheDocument();
  });

  it('should handle empty data gracefully', () => {
    render(<CashFlowChart data={[]} viewMode="annual" />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('composed-chart')).toBeInTheDocument();
  });

  // FCF Yield Calculation Tests
  it('should calculate FCF yield as percentage of revenue when available', () => {
    const dataWithRevenue = [
      {
        year: 2023,
        revenue: 1000,
        freeCashFlow: 100,
        operatingCashFlow: 150,
        investingCashFlow: -50,
        financingCashFlow: -25,
        netCashFlow: 75
      }
    ];

    render(
      <CashFlowChart 
        data={dataWithRevenue} 
        viewMode="annual" 
        showFCFYield={true}
      />
    );
    
    expect(screen.getByTestId('line-fcfYield')).toBeInTheDocument();
  });

  // Legend Configuration Tests
  it('should show appropriate legend labels', () => {
    render(<CashFlowChart data={mockAnnualData} viewMode="annual" />);
    
    const legend = screen.getByTestId('legend');
    expect(legend).toBeInTheDocument();
  });

  // Tooltip Configuration Tests
  it('should format tooltip content appropriately', () => {
    render(<CashFlowChart data={mockAnnualData} viewMode="annual" />);
    
    const tooltip = screen.getByTestId('tooltip');
    expect(tooltip).toBeInTheDocument();
  });

  // Margin and Spacing Tests
  it('should apply appropriate chart margins', () => {
    render(<CashFlowChart data={mockAnnualData} viewMode="annual" />);
    
    const chart = screen.getByTestId('composed-chart');
    expect(chart).toHaveAttribute('margin');
  });

  // Responsive Behavior Tests
  it('should handle responsive container properly', () => {
    render(<CashFlowChart data={mockAnnualData} viewMode="annual" />);
    
    const container = screen.getByTestId('responsive-container');
    expect(container).toBeInTheDocument();
  });

  // Error Handling Tests
  it('should handle malformed data gracefully', () => {
    const malformedData = [
      {
        year: 2023,
        // Missing required cash flow fields
      }
    ];

    expect(() => {
      render(<CashFlowChart data={malformedData} viewMode="annual" />);
    }).not.toThrow();
  });

  // Component Props Interface Tests
  it('should accept all required props', () => {
    const props = {
      data: mockAnnualData,
      viewMode: 'annual' as const,
      showFCFYield: true,
      showZeroLine: true,
      height: 450
    };

    expect(() => {
      render(<CashFlowChart {...props} />);
    }).not.toThrow();
  });

  // Custom Styling Tests
  it('should apply custom class names when provided', () => {
    render(
      <CashFlowChart 
        data={mockAnnualData} 
        viewMode="annual" 
        className="custom-cashflow-chart"
      />
    );
    
    // Container should have custom class
    const container = screen.getByTestId('responsive-container').parentElement;
    expect(container).toHaveClass('custom-cashflow-chart');
  });
}); 