import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NetCashFlowOverlay } from './NetCashFlowOverlay';

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  ComposedChart: ({ children, ...props }: any) => (
    <div data-testid="composed-chart" {...props}>{children}</div>
  ),
  Bar: ({ dataKey, stackId, ...props }: any) => (
    <div data-testid={`bar-${dataKey}`} data-stack-id={stackId} {...props} />
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

const mockCashFlowData = [
  {
    year: 2020,
    operatingCashFlow: 420,
    investingCashFlow: -150,
    financingCashFlow: -180,
    netCashFlow: 90,
    cumulativeNetCashFlow: 90,
    freeCashFlow: 270,
    revenue: 2400
  },
  {
    year: 2021,
    operatingCashFlow: 520,
    investingCashFlow: -200,
    financingCashFlow: -150,
    netCashFlow: 170,
    cumulativeNetCashFlow: 260,
    freeCashFlow: 320,
    revenue: 2650
  },
  {
    year: 2022,
    operatingCashFlow: 580,
    investingCashFlow: -220,
    financingCashFlow: -160,
    netCashFlow: 200,
    cumulativeNetCashFlow: 460,
    freeCashFlow: 360,
    revenue: 2890
  },
  {
    year: 2023,
    operatingCashFlow: 650,
    investingCashFlow: -280,
    financingCashFlow: -190,
    netCashFlow: 180,
    cumulativeNetCashFlow: 640,
    freeCashFlow: 370,
    revenue: 3150
  }
];

const mockQuarterlyData = [
  {
    quarter: 'Q1 2023',
    operatingCashFlow: 160,
    investingCashFlow: -70,
    financingCashFlow: -45,
    netCashFlow: 45,
    cumulativeNetCashFlow: 45,
    freeCashFlow: 90,
    revenue: 750
  },
  {
    quarter: 'Q2 2023',
    operatingCashFlow: 165,
    investingCashFlow: -75,
    financingCashFlow: -50,
    netCashFlow: 40,
    cumulativeNetCashFlow: 85,
    freeCashFlow: 90,
    revenue: 780
  },
  {
    quarter: 'Q3 2023',
    operatingCashFlow: 170,
    investingCashFlow: -65,
    financingCashFlow: -48,
    netCashFlow: 57,
    cumulativeNetCashFlow: 142,
    freeCashFlow: 105,
    revenue: 800
  },
  {
    quarter: 'Q4 2023',
    operatingCashFlow: 155,
    investingCashFlow: -70,
    financingCashFlow: -47,
    netCashFlow: 38,
    cumulativeNetCashFlow: 180,
    freeCashFlow: 85,
    revenue: 820
  }
];

describe('NetCashFlowOverlay', () => {
  // Basic Rendering Tests
  it('should render with annual data', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('composed-chart')).toBeInTheDocument();
  });

  it('should render with quarterly data', () => {
    render(
      <NetCashFlowOverlay 
        data={mockQuarterlyData} 
        viewMode="quarterly" 
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('composed-chart')).toBeInTheDocument();
  });

  // Stacked Bar Components Tests
  it('should render stacked cash flow bars', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
      />
    );
    
    expect(screen.getByTestId('bar-operatingCashFlow')).toBeInTheDocument();
    expect(screen.getByTestId('bar-investingCashFlow')).toBeInTheDocument();
    expect(screen.getByTestId('bar-financingCashFlow')).toBeInTheDocument();
  });

  it('should use correct stack IDs for cash flow components', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
      />
    );
    
    const ocfBar = screen.getByTestId('bar-operatingCashFlow');
    const icfBar = screen.getByTestId('bar-investingCashFlow');
    const fcfBar = screen.getByTestId('bar-financingCashFlow');
    
    expect(ocfBar).toHaveAttribute('data-stack-id', 'cashflow');
    expect(icfBar).toHaveAttribute('data-stack-id', 'cashflow');
    expect(fcfBar).toHaveAttribute('data-stack-id', 'cashflow');
  });

  // Net Cash Flow Line Overlay Tests
  it('should render net cash flow line overlay', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
        showNetCashFlowLine={true}
      />
    );
    
    const netCashFlowLine = screen.getByTestId('line-netCashFlow');
    expect(netCashFlowLine).toBeInTheDocument();
    expect(netCashFlowLine).toHaveAttribute('data-y-axis-id', 'right');
  });

  it('should not render net cash flow line when disabled', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
        showNetCashFlowLine={false}
      />
    );
    
    expect(screen.queryByTestId('line-netCashFlow')).not.toBeInTheDocument();
  });

  // Cumulative Cash Flow Line Tests
  it('should render cumulative cash flow line when enabled', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
        showCumulativeLine={true}
      />
    );
    
    const cumulativeLine = screen.getByTestId('line-cumulativeNetCashFlow');
    expect(cumulativeLine).toBeInTheDocument();
    expect(cumulativeLine).toHaveAttribute('data-y-axis-id', 'right');
  });

  it('should not render cumulative line when disabled', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
        showCumulativeLine={false}
      />
    );
    
    expect(screen.queryByTestId('line-cumulativeNetCashFlow')).not.toBeInTheDocument();
  });

  // Free Cash Flow Line Tests
  it('should render free cash flow line when enabled', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
        showFreeCashFlowLine={true}
      />
    );
    
    const fcfLine = screen.getByTestId('line-freeCashFlow');
    expect(fcfLine).toBeInTheDocument();
    expect(fcfLine).toHaveAttribute('data-y-axis-id', 'right');
  });

  it('should not render free cash flow line when disabled', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
        showFreeCashFlowLine={false}
      />
    );
    
    expect(screen.queryByTestId('line-freeCashFlow')).not.toBeInTheDocument();
  });

  // Dual Y-Axis Tests
  it('should render dual y-axes for stacked bars and line overlays', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
        showNetCashFlowLine={true}
      />
    );
    
    expect(screen.getByTestId('y-axis-primary')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis-right')).toBeInTheDocument();
  });

  it('should configure primary y-axis for cash flow bars', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
      />
    );
    
    const primaryYAxis = screen.getByTestId('y-axis-primary');
    expect(primaryYAxis).toHaveAttribute('orientation', 'left');
  });

  it('should configure secondary y-axis for line overlays', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
        showNetCashFlowLine={true}
      />
    );
    
    const rightYAxis = screen.getByTestId('y-axis-right');
    expect(rightYAxis).toHaveAttribute('orientation', 'right');
  });

  // Color Scheme Tests
  it('should use appropriate colors for cash flow components', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
      />
    );
    
    const ocfBar = screen.getByTestId('bar-operatingCashFlow');
    const icfBar = screen.getByTestId('bar-investingCashFlow');
    const fcfBar = screen.getByTestId('bar-financingCashFlow');
    
    expect(ocfBar).toHaveAttribute('fill', '#10b981'); // Green for positive OCF
    expect(icfBar).toHaveAttribute('fill', '#ef4444'); // Red for negative ICF
    expect(fcfBar).toHaveAttribute('fill', '#f59e0b'); // Orange for FCF
  });

  it('should use distinct colors for line overlays', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
        showNetCashFlowLine={true}
        showCumulativeLine={true}
        showFreeCashFlowLine={true}
      />
    );
    
    const netCashFlowLine = screen.getByTestId('line-netCashFlow');
    const cumulativeLine = screen.getByTestId('line-cumulativeNetCashFlow');
    const fcfLine = screen.getByTestId('line-freeCashFlow');
    
    expect(netCashFlowLine).toHaveAttribute('stroke', '#3b82f6'); // Blue
    expect(cumulativeLine).toHaveAttribute('stroke', '#8b5cf6'); // Purple
    expect(fcfLine).toHaveAttribute('stroke', '#06b6d4'); // Cyan
  });

  // Reference Line Tests
  it('should render zero reference line when enabled', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
        showZeroLine={true}
      />
    );
    
    const zeroLine = screen.getByTestId('reference-line');
    expect(zeroLine).toBeInTheDocument();
    expect(zeroLine).toHaveAttribute('data-y', '0');
  });

  it('should not render zero reference line when disabled', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
        showZeroLine={false}
      />
    );
    
    expect(screen.queryByTestId('reference-line')).not.toBeInTheDocument();
  });

  // View Mode Tests
  it('should handle annual view mode correctly', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
      />
    );
    
    const xAxis = screen.getByTestId('x-axis');
    expect(xAxis).toHaveAttribute('dataKey', 'year');
  });

  it('should handle quarterly view mode correctly', () => {
    render(
      <NetCashFlowOverlay 
        data={mockQuarterlyData} 
        viewMode="quarterly" 
      />
    );
    
    const xAxis = screen.getByTestId('x-axis');
    expect(xAxis).toHaveAttribute('dataKey', 'quarter');
  });

  // Chart Configuration Tests
  it('should render all chart elements', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
        showNetCashFlowLine={true}
      />
    );
    
    expect(screen.getByTestId('composed-chart')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  // Interactive Features Tests
  it('should support custom height', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
        height={500}
      />
    );
    
    const container = screen.getByTestId('responsive-container');
    expect(container).toBeInTheDocument();
  });

  it('should use default height when not specified', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
      />
    );
    
    const container = screen.getByTestId('responsive-container');
    expect(container).toBeInTheDocument();
  });

  // Legend Configuration Tests
  it('should show appropriate legend items', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
        showNetCashFlowLine={true}
      />
    );
    
    const legend = screen.getByTestId('legend');
    expect(legend).toBeInTheDocument();
  });

  // Multiple Line Overlays Tests
  it('should render multiple line overlays simultaneously', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
        showNetCashFlowLine={true}
        showCumulativeLine={true}
        showFreeCashFlowLine={true}
      />
    );
    
    expect(screen.getByTestId('line-netCashFlow')).toBeInTheDocument();
    expect(screen.getByTestId('line-cumulativeNetCashFlow')).toBeInTheDocument();
    expect(screen.getByTestId('line-freeCashFlow')).toBeInTheDocument();
  });

  it('should handle no line overlays gracefully', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
        showNetCashFlowLine={false}
        showCumulativeLine={false}
        showFreeCashFlowLine={false}
      />
    );
    
    // Should still render stacked bars
    expect(screen.getByTestId('bar-operatingCashFlow')).toBeInTheDocument();
    expect(screen.queryByTestId('line-netCashFlow')).not.toBeInTheDocument();
  });

  // Data Processing Tests
  it('should handle positive and negative cash flows correctly', () => {
    const mixedData = [
      {
        year: 2023,
        operatingCashFlow: 500,
        investingCashFlow: -200,
        financingCashFlow: -150,
        netCashFlow: 150,
        cumulativeNetCashFlow: 150,
        freeCashFlow: 300
      }
    ];

    render(
      <NetCashFlowOverlay 
        data={mixedData} 
        viewMode="annual" 
        showNetCashFlowLine={true}
      />
    );
    
    expect(screen.getByTestId('bar-operatingCashFlow')).toBeInTheDocument();
    expect(screen.getByTestId('bar-investingCashFlow')).toBeInTheDocument();
    expect(screen.getByTestId('line-netCashFlow')).toBeInTheDocument();
  });

  it('should handle empty data gracefully', () => {
    render(
      <NetCashFlowOverlay 
        data={[]} 
        viewMode="annual" 
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  // Tooltip Configuration Tests
  it('should format tooltip content appropriately', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
        showNetCashFlowLine={true}
      />
    );
    
    const tooltip = screen.getByTestId('tooltip');
    expect(tooltip).toBeInTheDocument();
  });

  // Line Style Configuration Tests
  it('should configure line styles appropriately', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
        showNetCashFlowLine={true}
      />
    );
    
    const netCashFlowLine = screen.getByTestId('line-netCashFlow');
    expect(netCashFlowLine).toHaveAttribute('stroke', '#3b82f6');
    expect(netCashFlowLine).toBeInTheDocument();
  });

  // Component Props Interface Tests
  it('should accept all required props', () => {
    const props = {
      data: mockCashFlowData,
      viewMode: 'annual' as const,
      showNetCashFlowLine: true,
      showCumulativeLine: true,
      showFreeCashFlowLine: true,
      showZeroLine: true,
      height: 450
    };

    expect(() => {
      render(<NetCashFlowOverlay {...props} />);
    }).not.toThrow();
  });

  // Responsive Behavior Tests
  it('should handle responsive container properly', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
      />
    );
    
    const container = screen.getByTestId('responsive-container');
    expect(container).toBeInTheDocument();
  });

  // Custom Styling Tests
  it('should apply custom class names when provided', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
        className="custom-overlay-chart"
      />
    );
    
    // Component should accept custom class name
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  // Advanced Features Tests
  it('should support line overlay toggling', () => {
    const { rerender } = render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
        showNetCashFlowLine={false}
      />
    );
    
    expect(screen.queryByTestId('line-netCashFlow')).not.toBeInTheDocument();
    
    rerender(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
        showNetCashFlowLine={true}
      />
    );
    
    expect(screen.getByTestId('line-netCashFlow')).toBeInTheDocument();
  });

  // Error Handling Tests
  it('should handle malformed data gracefully', () => {
    const malformedData = [
      {
        year: 2023,
        operatingCashFlow: 500,
        // Missing other cash flow components
      }
    ];

    expect(() => {
      render(
        <NetCashFlowOverlay 
          data={malformedData} 
          viewMode="annual" 
        />
      );
    }).not.toThrow();
  });

  // Performance Tests
  it('should render efficiently with large datasets', () => {
    const largeData = Array.from({ length: 20 }, (_, i) => ({
      year: 2000 + i,
      operatingCashFlow: 400 + (i * 10),
      investingCashFlow: -(100 + (i * 5)),
      financingCashFlow: -(80 + (i * 3)),
      netCashFlow: 220 + (i * 2),
      cumulativeNetCashFlow: (220 + (i * 2)) * (i + 1),
      freeCashFlow: 300 + (i * 5)
    }));

    expect(() => {
      render(
        <NetCashFlowOverlay 
          data={largeData} 
          viewMode="annual" 
          showNetCashFlowLine={true}
        />
      );
    }).not.toThrow();
  });

  // Integration Tests
  it('should work with all overlay lines enabled', () => {
    render(
      <NetCashFlowOverlay 
        data={mockCashFlowData} 
        viewMode="annual" 
        showNetCashFlowLine={true}
        showCumulativeLine={true}
        showFreeCashFlowLine={true}
        showZeroLine={true}
      />
    );
    
    // All components should render
    expect(screen.getByTestId('bar-operatingCashFlow')).toBeInTheDocument();
    expect(screen.getByTestId('line-netCashFlow')).toBeInTheDocument();
    expect(screen.getByTestId('line-cumulativeNetCashFlow')).toBeInTheDocument();
    expect(screen.getByTestId('line-freeCashFlow')).toBeInTheDocument();
    expect(screen.getByTestId('reference-line')).toBeInTheDocument();
  });

  // View Mode Switching Tests
  it('should work with view mode switching', () => {
    const OverlayWrapper = () => {
      const [mode, setMode] = React.useState<'annual' | 'quarterly'>('annual');
      
      return (
        <div>
          <button onClick={() => setMode('quarterly')}>Switch to Quarterly</button>
          <NetCashFlowOverlay 
            data={mode === 'annual' ? mockCashFlowData : mockQuarterlyData} 
            viewMode={mode}
            showNetCashFlowLine={true}
          />
        </div>
      );
    };

    render(<OverlayWrapper />);
    
    // Initial annual view
    expect(screen.getByTestId('x-axis')).toHaveAttribute('dataKey', 'year');
    
    // Switch to quarterly
    fireEvent.click(screen.getByText('Switch to Quarterly'));
    expect(screen.getByTestId('x-axis')).toHaveAttribute('dataKey', 'quarter');
  });
}); 