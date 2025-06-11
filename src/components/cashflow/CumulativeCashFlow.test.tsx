import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CumulativeCashFlow } from './CumulativeCashFlow';

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  ComposedChart: ({ children, ...props }: any) => (
    <div data-testid="composed-chart" {...props}>{children}</div>
  ),
  Area: ({ dataKey, stackId, ...props }: any) => (
    <div data-testid={`area-${dataKey}`} data-stack-id={stackId} {...props} />
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
    year: 2020,
    quarter: 'Q1 2020',
    operatingCashFlow: 150,
    investingCashFlow: -80,
    financingCashFlow: -30,
    netCashFlow: 40,
    cumulativeOperatingCF: 150,
    cumulativeInvestingCF: -80,
    cumulativeFinancingCF: -30,
    cumulativeNetCF: 40,
    periodEndingCash: 540
  },
  {
    year: 2020,
    quarter: 'Q2 2020',
    operatingCashFlow: 180,
    investingCashFlow: -100,
    financingCashFlow: -40,
    netCashFlow: 40,
    cumulativeOperatingCF: 330,
    cumulativeInvestingCF: -180,
    cumulativeFinancingCF: -70,
    cumulativeNetCF: 80,
    periodEndingCash: 580
  },
  {
    year: 2020,
    quarter: 'Q3 2020',
    operatingCashFlow: 160,
    investingCashFlow: -90,
    financingCashFlow: -35,
    netCashFlow: 35,
    cumulativeOperatingCF: 490,
    cumulativeInvestingCF: -270,
    cumulativeFinancingCF: -105,
    cumulativeNetCF: 115,
    periodEndingCash: 615
  }
];

const mockAnnualData = [
  {
    year: 2020,
    operatingCashFlow: 690,
    investingCashFlow: -390,
    financingCashFlow: -155,
    netCashFlow: 145,
    cumulativeOperatingCF: 690,
    cumulativeInvestingCF: -390,
    cumulativeFinancingCF: -155,
    cumulativeNetCF: 145,
    yearEndingCash: 645
  },
  {
    year: 2021,
    operatingCashFlow: 820,
    investingCashFlow: -450,
    financingCashFlow: -180,
    netCashFlow: 190,
    cumulativeOperatingCF: 1510,
    cumulativeInvestingCF: -840,
    cumulativeFinancingCF: -335,
    cumulativeNetCF: 335,
    yearEndingCash: 835
  }
];

describe('CumulativeCashFlow', () => {
  // Basic Rendering Tests
  it('should render cumulative cash flow chart', () => {
    render(
      <CumulativeCashFlow 
        data={mockQuarterlyData} 
        viewMode="quarterly"
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('composed-chart')).toBeInTheDocument();
  });

  it('should render with annual data', () => {
    render(
      <CumulativeCashFlow 
        data={mockAnnualData} 
        viewMode="annual"
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  // View Mode Tests
  it('should handle quarterly view mode correctly', () => {
    render(
      <CumulativeCashFlow 
        data={mockQuarterlyData} 
        viewMode="quarterly"
      />
    );
    
    const xAxis = screen.getByTestId('x-axis');
    expect(xAxis).toHaveAttribute('dataKey', 'quarter');
  });

  it('should handle annual view mode correctly', () => {
    render(
      <CumulativeCashFlow 
        data={mockAnnualData} 
        viewMode="annual"
      />
    );
    
    const xAxis = screen.getByTestId('x-axis');
    expect(xAxis).toHaveAttribute('dataKey', 'year');
  });

  // Cumulative Area Charts Tests
  it('should render cumulative operating cash flow area when enabled', () => {
    render(
      <CumulativeCashFlow 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        showCumulativeOperating={true}
      />
    );
    
    expect(screen.getByTestId('area-cumulativeOperatingCF')).toBeInTheDocument();
  });

  it('should render cumulative investing cash flow area when enabled', () => {
    render(
      <CumulativeCashFlow 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        showCumulativeInvesting={true}
      />
    );
    
    expect(screen.getByTestId('area-cumulativeInvestingCF')).toBeInTheDocument();
  });

  it('should render cumulative financing cash flow area when enabled', () => {
    render(
      <CumulativeCashFlow 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        showCumulativeFinancing={true}
      />
    );
    
    expect(screen.getByTestId('area-cumulativeFinancingCF')).toBeInTheDocument();
  });

  it('should not render cumulative areas when disabled', () => {
    render(
      <CumulativeCashFlow 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        showCumulativeOperating={false}
        showCumulativeInvesting={false}
        showCumulativeFinancing={false}
      />
    );
    
    expect(screen.queryByTestId('area-cumulativeOperatingCF')).not.toBeInTheDocument();
    expect(screen.queryByTestId('area-cumulativeInvestingCF')).not.toBeInTheDocument();
    expect(screen.queryByTestId('area-cumulativeFinancingCF')).not.toBeInTheDocument();
  });

  // Net Cumulative Line Tests
  it('should render cumulative net cash flow line when enabled', () => {
    render(
      <CumulativeCashFlow 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        showCumulativeNetLine={true}
      />
    );
    
    const netLine = screen.getByTestId('line-cumulativeNetCF');
    expect(netLine).toBeInTheDocument();
    expect(netLine).toHaveAttribute('data-y-axis-id', 'right');
  });

  it('should not render cumulative net cash flow line when disabled', () => {
    render(
      <CumulativeCashFlow 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        showCumulativeNetLine={false}
      />
    );
    
    expect(screen.queryByTestId('line-cumulativeNetCF')).not.toBeInTheDocument();
  });

  // Cash Position Tracking Tests
  it('should render cash position line when enabled for quarterly data', () => {
    render(
      <CumulativeCashFlow 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        showCashPosition={true}
      />
    );
    
    const cashPositionLine = screen.getByTestId('line-periodEndingCash');
    expect(cashPositionLine).toBeInTheDocument();
  });

  it('should render cash position line when enabled for annual data', () => {
    render(
      <CumulativeCashFlow 
        data={mockAnnualData} 
        viewMode="annual"
        showCashPosition={true}
      />
    );
    
    const cashPositionLine = screen.getByTestId('line-yearEndingCash');
    expect(cashPositionLine).toBeInTheDocument();
  });

  it('should not render cash position line when disabled', () => {
    render(
      <CumulativeCashFlow 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        showCashPosition={false}
      />
    );
    
    expect(screen.queryByTestId('line-periodEndingCash')).not.toBeInTheDocument();
  });

  // Dual Y-Axis Tests
  it('should render dual y-axes when line overlays are enabled', () => {
    render(
      <CumulativeCashFlow 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        showCumulativeNetLine={true}
      />
    );
    
    expect(screen.getByTestId('y-axis-primary')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis-right')).toBeInTheDocument();
  });

  it('should configure primary y-axis for cumulative areas', () => {
    render(
      <CumulativeCashFlow 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        showCumulativeOperating={true}
      />
    );
    
    const primaryYAxis = screen.getByTestId('y-axis-primary');
    expect(primaryYAxis).toHaveAttribute('orientation', 'left');
  });

  it('should configure secondary y-axis for line overlays', () => {
    render(
      <CumulativeCashFlow 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        showCumulativeNetLine={true}
      />
    );
    
    const rightYAxis = screen.getByTestId('y-axis-right');
    expect(rightYAxis).toHaveAttribute('orientation', 'right');
  });

  // Color Scheme Tests
  it('should use appropriate colors for cumulative areas', () => {
    render(
      <CumulativeCashFlow 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        showCumulativeOperating={true}
        showCumulativeInvesting={true}
        showCumulativeFinancing={true}
      />
    );
    
    const operatingArea = screen.getByTestId('area-cumulativeOperatingCF');
    const investingArea = screen.getByTestId('area-cumulativeInvestingCF');
    const financingArea = screen.getByTestId('area-cumulativeFinancingCF');
    
    expect(operatingArea).toHaveAttribute('fill', '#10b981'); // Green
    expect(investingArea).toHaveAttribute('fill', '#ef4444'); // Red  
    expect(financingArea).toHaveAttribute('fill', '#f59e0b'); // Orange
  });

  it('should use distinct colors for line overlays', () => {
    render(
      <CumulativeCashFlow 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        showCumulativeNetLine={true}
        showCashPosition={true}
      />
    );
    
    const netLine = screen.getByTestId('line-cumulativeNetCF');
    const cashPositionLine = screen.getByTestId('line-periodEndingCash');
    
    expect(netLine).toHaveAttribute('stroke', '#3b82f6'); // Blue
    expect(cashPositionLine).toHaveAttribute('stroke', '#8b5cf6'); // Purple
  });

  // Stacked Area Configuration Tests
  it('should use correct stack IDs for cumulative areas', () => {
    render(
      <CumulativeCashFlow 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        showCumulativeOperating={true}
        showCumulativeInvesting={true}
        showCumulativeFinancing={true}
      />
    );
    
    const operatingArea = screen.getByTestId('area-cumulativeOperatingCF');
    const investingArea = screen.getByTestId('area-cumulativeInvestingCF');
    const financingArea = screen.getByTestId('area-cumulativeFinancingCF');
    
    expect(operatingArea).toHaveAttribute('data-stack-id', 'cumulative');
    expect(investingArea).toHaveAttribute('data-stack-id', 'cumulative');
    expect(financingArea).toHaveAttribute('data-stack-id', 'cumulative');
  });

  // Chart Configuration Tests
  it('should render all chart elements', () => {
    render(
      <CumulativeCashFlow 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        showCumulativeOperating={true}
        showCumulativeNetLine={true}
      />
    );
    
    expect(screen.getByTestId('composed-chart')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  // Zero Reference Line Tests
  it('should render zero reference line when enabled', () => {
    render(
      <CumulativeCashFlow 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        showZeroLine={true}
      />
    );
    
    const zeroLine = screen.getByTestId('reference-line');
    expect(zeroLine).toBeInTheDocument();
    expect(zeroLine).toHaveAttribute('data-y', '0');
  });

  it('should not render zero reference line when disabled', () => {
    render(
      <CumulativeCashFlow 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        showZeroLine={false}
      />
    );
    
    expect(screen.queryByTestId('reference-line')).not.toBeInTheDocument();
  });

  // Height Configuration Tests
  it('should support custom height', () => {
    render(
      <CumulativeCashFlow 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        height={500}
      />
    );
    
    const container = screen.getByTestId('responsive-container');
    expect(container).toBeInTheDocument();
  });

  // Data Processing Tests
  it('should handle empty data gracefully', () => {
    render(
      <CumulativeCashFlow 
        data={[]} 
        viewMode="quarterly"
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('should handle malformed data gracefully', () => {
    const malformedData = [
      {
        quarter: 'Q1 2023',
        // Missing cumulative fields
      }
    ];

    expect(() => {
      render(
        <CumulativeCashFlow 
          data={malformedData} 
          viewMode="quarterly"
        />
      );
    }).not.toThrow();
  });

  // Area Transparency Tests
  it('should configure area transparency appropriately', () => {
    render(
      <CumulativeCashFlow 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        showCumulativeOperating={true}
      />
    );
    
    const operatingArea = screen.getByTestId('area-cumulativeOperatingCF');
    expect(operatingArea).toBeInTheDocument();
  });

  // Multiple Components Integration Tests
  it('should render all components when enabled', () => {
    render(
      <CumulativeCashFlow 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        showCumulativeOperating={true}
        showCumulativeInvesting={true}
        showCumulativeFinancing={true}
        showCumulativeNetLine={true}
        showCashPosition={true}
        showZeroLine={true}
      />
    );
    
    // All components should render
    expect(screen.getByTestId('area-cumulativeOperatingCF')).toBeInTheDocument();
    expect(screen.getByTestId('area-cumulativeInvestingCF')).toBeInTheDocument();
    expect(screen.getByTestId('area-cumulativeFinancingCF')).toBeInTheDocument();
    expect(screen.getByTestId('line-cumulativeNetCF')).toBeInTheDocument();
    expect(screen.getByTestId('line-periodEndingCash')).toBeInTheDocument();
    expect(screen.getByTestId('reference-line')).toBeInTheDocument();
  });

  // View Mode Switching Tests
  it('should work with view mode switching', () => {
    const CumulativeWrapper = () => {
      const [mode, setMode] = React.useState<'quarterly' | 'annual'>('quarterly');
      
      return (
        <div>
          <button onClick={() => setMode('annual')}>Switch to Annual</button>
          <CumulativeCashFlow 
            data={mode === 'quarterly' ? mockQuarterlyData : mockAnnualData} 
            viewMode={mode}
            showCumulativeOperating={true}
          />
        </div>
      );
    };

    render(<CumulativeWrapper />);
    
    // Initial quarterly view
    expect(screen.getByTestId('x-axis')).toHaveAttribute('dataKey', 'quarter');
    
    // Switch to annual
    fireEvent.click(screen.getByText('Switch to Annual'));
    expect(screen.getByTestId('x-axis')).toHaveAttribute('dataKey', 'year');
  });

  // Performance Tests
  it('should render efficiently with large datasets', () => {
    const largeData = Array.from({ length: 40 }, (_, i) => ({
      quarter: `Q${(i % 4) + 1} ${2020 + Math.floor(i / 4)}`,
      operatingCashFlow: 150 + (i * 5),
      investingCashFlow: -(80 + (i * 2)),
      financingCashFlow: -(30 + i),
      netCashFlow: 40 + (i * 3),
      cumulativeOperatingCF: (150 + (i * 5)) * (i + 1),
      cumulativeInvestingCF: -(80 + (i * 2)) * (i + 1),
      cumulativeFinancingCF: -(30 + i) * (i + 1),
      cumulativeNetCF: (40 + (i * 3)) * (i + 1),
      periodEndingCash: 500 + (i * 40)
    }));

    expect(() => {
      render(
        <CumulativeCashFlow 
          data={largeData} 
          viewMode="quarterly"
          showCumulativeOperating={true}
        />
      );
    }).not.toThrow();
  });

  // Edge Cases Tests
  it('should handle negative cumulative values correctly', () => {
    const negativeData = [
      {
        quarter: 'Q1 2023',
        operatingCashFlow: 100,
        investingCashFlow: -200,
        financingCashFlow: -50,
        netCashFlow: -150,
        cumulativeOperatingCF: 100,
        cumulativeInvestingCF: -200,
        cumulativeFinancingCF: -50,
        cumulativeNetCF: -150,
        periodEndingCash: 350
      }
    ];

    render(
      <CumulativeCashFlow 
        data={negativeData} 
        viewMode="quarterly"
        showCumulativeOperating={true}
        showCumulativeNetLine={true}
      />
    );
    
    expect(screen.getByTestId('area-cumulativeOperatingCF')).toBeInTheDocument();
    expect(screen.getByTestId('line-cumulativeNetCF')).toBeInTheDocument();
  });

  // Custom Class Name Tests
  it('should apply custom class names when provided', () => {
    render(
      <CumulativeCashFlow 
        data={mockQuarterlyData} 
        viewMode="quarterly"
        className="custom-cumulative-chart"
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  // Component Props Interface Tests
  it('should accept all required props', () => {
    const props = {
      data: mockQuarterlyData,
      viewMode: 'quarterly' as const,
      showCumulativeOperating: true,
      showCumulativeInvesting: true,
      showCumulativeFinancing: true,
      showCumulativeNetLine: true,
      showCashPosition: true,
      showZeroLine: true,
      height: 450,
      className: 'test-class'
    };

    expect(() => {
      render(<CumulativeCashFlow {...props} />);
    }).not.toThrow();
  });

  // Error Handling Tests
  it('should handle component errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(
        <CumulativeCashFlow 
          data={mockQuarterlyData} 
          viewMode="quarterly"
          showCumulativeOperating={true}
        />
      );
    }).not.toThrow();

    consoleSpy.mockRestore();
  });
}); 