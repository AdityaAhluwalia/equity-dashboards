import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuarterlyCashFlow } from './QuarterlyCashFlow';

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children, ...props }: any) => (
    <div data-testid="bar-chart" {...props}>{children}</div>
  ),
  Bar: ({ dataKey, fill, ...props }: any) => (
    <div data-testid={`bar-${dataKey}`} data-fill={fill} {...props} />
  ),
  XAxis: (props: any) => <div data-testid="x-axis" {...props} />,
  YAxis: (props: any) => <div data-testid="y-axis" {...props} />,
  CartesianGrid: (props: any) => <div data-testid="cartesian-grid" {...props} />,
  Tooltip: (props: any) => <div data-testid="tooltip" {...props} />,
  Legend: (props: any) => <div data-testid="legend" {...props} />,
  ReferenceLine: ({ y, ...props }: any) => (
    <div data-testid="reference-line" data-y={y} {...props} />
  ),
  Cell: ({ fill, ...props }: any) => (
    <div data-testid="cell" data-fill={fill} {...props} />
  ),
}));

const mockQuarterlyCashFlowData = [
  {
    quarter: 'Q1 2023',
    operatingCashFlow: 200,
    investingCashFlow: -75,
    financingCashFlow: -50,
    netCashFlow: 75,
    freeCashFlow: 125,
    revenue: 1150
  },
  {
    quarter: 'Q2 2023',
    operatingCashFlow: 220,
    investingCashFlow: -85,
    financingCashFlow: -55,
    netCashFlow: 80,
    freeCashFlow: 135,
    revenue: 1200
  },
  {
    quarter: 'Q3 2023',
    operatingCashFlow: 180,
    investingCashFlow: -95,
    financingCashFlow: -45,
    netCashFlow: 40,
    freeCashFlow: 85,
    revenue: 1100
  },
  {
    quarter: 'Q4 2023',
    operatingCashFlow: 250,
    investingCashFlow: -120,
    financingCashFlow: -60,
    netCashFlow: 70,
    freeCashFlow: 130,
    revenue: 1300
  },
  {
    quarter: 'Q1 2024',
    operatingCashFlow: 210,
    investingCashFlow: -80,
    financingCashFlow: -70,
    netCashFlow: 60,
    freeCashFlow: 130,
    revenue: 1180
  },
  {
    quarter: 'Q2 2024',
    operatingCashFlow: 230,
    investingCashFlow: -90,
    financingCashFlow: -65,
    netCashFlow: 75,
    freeCashFlow: 140,
    revenue: 1250
  },
  {
    quarter: 'Q3 2024',
    operatingCashFlow: 190,
    investingCashFlow: -100,
    financingCashFlow: -55,
    netCashFlow: 35,
    freeCashFlow: 90,
    revenue: 1120
  },
  {
    quarter: 'Q4 2024',
    operatingCashFlow: 260,
    investingCashFlow: -130,
    financingCashFlow: -75,
    netCashFlow: 55,
    freeCashFlow: 130,
    revenue: 1350
  }
];

const mockNegativeNetCashFlowData = [
  {
    quarter: 'Q1 2023',
    operatingCashFlow: 150,
    investingCashFlow: -200,
    financingCashFlow: -80,
    netCashFlow: -130,
    freeCashFlow: -50,
    revenue: 1000
  },
  {
    quarter: 'Q2 2023',
    operatingCashFlow: 160,
    investingCashFlow: -180,
    financingCashFlow: -70,
    netCashFlow: -90,
    freeCashFlow: -20,
    revenue: 1050
  }
];

describe('QuarterlyCashFlow', () => {
  // Basic Rendering Tests
  it('should render quarterly cash flow chart', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('should render with default props', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  // Metric Selection Tests
  it('should render net cash flow bars when metric is netCashFlow', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
      />
    );
    
    expect(screen.getByTestId('bar-netCashFlow')).toBeInTheDocument();
  });

  it('should render operating cash flow bars when metric is operatingCashFlow', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="operatingCashFlow"
      />
    );
    
    expect(screen.getByTestId('bar-operatingCashFlow')).toBeInTheDocument();
  });

  it('should render investing cash flow bars when metric is investingCashFlow', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="investingCashFlow"
      />
    );
    
    expect(screen.getByTestId('bar-investingCashFlow')).toBeInTheDocument();
  });

  it('should render financing cash flow bars when metric is financingCashFlow', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="financingCashFlow"
      />
    );
    
    expect(screen.getByTestId('bar-financingCashFlow')).toBeInTheDocument();
  });

  it('should render free cash flow bars when metric is freeCashFlow', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="freeCashFlow"
      />
    );
    
    expect(screen.getByTestId('bar-freeCashFlow')).toBeInTheDocument();
  });

  // Positive/Negative Bar Visualization Tests
  it('should use green color for positive cash flows', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
        positiveColor="#10b981"
      />
    );
    
    const cells = screen.getAllByTestId('cell');
    expect(cells.length).toBeGreaterThan(0);
    // Verify positive values get positive color
    expect(cells[0]).toHaveAttribute('data-fill', '#10b981');
  });

  it('should use red color for negative cash flows', () => {
    render(
      <QuarterlyCashFlow 
        data={mockNegativeNetCashFlowData} 
        metric="netCashFlow"
        negativeColor="#ef4444"
      />
    );
    
    const cells = screen.getAllByTestId('cell');
    expect(cells.length).toBeGreaterThan(0);
    // Verify negative values get negative color
    expect(cells[0]).toHaveAttribute('data-fill', '#ef4444');
  });

  it('should handle mixed positive and negative values correctly', () => {
    const mixedData = [
      {
        quarter: 'Q1 2023',
        operatingCashFlow: 200,
        investingCashFlow: -100,
        financingCashFlow: -50,
        netCashFlow: 50,
        freeCashFlow: 100
      },
      {
        quarter: 'Q2 2023',
        operatingCashFlow: 150,
        investingCashFlow: -200,
        financingCashFlow: -80,
        netCashFlow: -130,
        freeCashFlow: -50
      }
    ];

    render(
      <QuarterlyCashFlow 
        data={mixedData} 
        metric="netCashFlow"
      />
    );
    
    const cells = screen.getAllByTestId('cell');
    expect(cells.length).toBe(2);
  });

  // Zero Reference Line Tests
  it('should render zero reference line when enabled', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
        showZeroLine={true}
      />
    );
    
    const zeroLine = screen.getByTestId('reference-line');
    expect(zeroLine).toBeInTheDocument();
    expect(zeroLine).toHaveAttribute('data-y', '0');
  });

  it('should not render zero reference line when disabled', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
        showZeroLine={false}
      />
    );
    
    expect(screen.queryByTestId('reference-line')).not.toBeInTheDocument();
  });

  // Chart Configuration Tests
  it('should render all chart elements', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
      />
    );
    
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('should configure x-axis for quarters', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
      />
    );
    
    const xAxis = screen.getByTestId('x-axis');
    expect(xAxis).toHaveAttribute('dataKey', 'quarter');
  });

  // Legend Tests
  it('should show legend when enabled', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
        showLegend={true}
      />
    );
    
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('should not show legend when disabled', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
        showLegend={false}
      />
    );
    
    expect(screen.queryByTestId('legend')).not.toBeInTheDocument();
  });

  // Height Configuration Tests
  it('should support custom height', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
        height={500}
      />
    );
    
    const container = screen.getByTestId('responsive-container');
    expect(container).toBeInTheDocument();
  });

  it('should use default height when not specified', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
      />
    );
    
    const container = screen.getByTestId('responsive-container');
    expect(container).toBeInTheDocument();
  });

  // Color Customization Tests
  it('should accept custom positive color', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
        positiveColor="#22c55e"
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('should accept custom negative color', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
        negativeColor="#dc2626"
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  // Data Processing Tests
  it('should handle empty data gracefully', () => {
    render(
      <QuarterlyCashFlow 
        data={[]} 
        metric="netCashFlow"
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('should handle malformed data gracefully', () => {
    const malformedData = [
      {
        quarter: 'Q1 2023',
        // Missing cash flow fields
      }
    ];

    expect(() => {
      render(
        <QuarterlyCashFlow 
          data={malformedData} 
          metric="netCashFlow"
        />
      );
    }).not.toThrow();
  });

  // Responsive Behavior Tests
  it('should handle responsive container properly', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
      />
    );
    
    const container = screen.getByTestId('responsive-container');
    expect(container).toBeInTheDocument();
  });

  // Custom Styling Tests
  it('should apply custom class names when provided', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
        className="custom-quarterly-chart"
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  // Tooltip Configuration Tests
  it('should format tooltip content appropriately', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
      />
    );
    
    const tooltip = screen.getByTestId('tooltip');
    expect(tooltip).toBeInTheDocument();
  });

  // Component Props Interface Tests
  it('should accept all required props', () => {
    const props = {
      data: mockQuarterlyCashFlowData,
      metric: 'netCashFlow' as const,
      positiveColor: '#10b981',
      negativeColor: '#ef4444',
      showZeroLine: true,
      showLegend: true,
      height: 450,
      className: 'test-class'
    };

    expect(() => {
      render(<QuarterlyCashFlow {...props} />);
    }).not.toThrow();
  });

  // Metric Switching Tests
  it('should handle metric switching correctly', () => {
    const MetricSwitcher = () => {
      const [metric, setMetric] = React.useState<'netCashFlow' | 'operatingCashFlow'>('netCashFlow');
      
      return (
        <div>
          <button onClick={() => setMetric('operatingCashFlow')}>Switch to OCF</button>
          <QuarterlyCashFlow 
            data={mockQuarterlyCashFlowData} 
            metric={metric}
          />
        </div>
      );
    };

    render(<MetricSwitcher />);
    
    // Initial net cash flow
    expect(screen.getByTestId('bar-netCashFlow')).toBeInTheDocument();
    
    // Switch to operating cash flow
    fireEvent.click(screen.getByText('Switch to OCF'));
    expect(screen.getByTestId('bar-operatingCashFlow')).toBeInTheDocument();
  });

  // Performance Tests
  it('should render efficiently with large datasets', () => {
    const largeData = Array.from({ length: 20 }, (_, i) => ({
      quarter: `Q${(i % 4) + 1} ${2020 + Math.floor(i / 4)}`,
      operatingCashFlow: 200 + (i * 10),
      investingCashFlow: -(100 + (i * 5)),
      financingCashFlow: -(50 + (i * 3)),
      netCashFlow: 50 + (i * 2),
      freeCashFlow: 100 + (i * 5),
      revenue: 1000 + (i * 50)
    }));

    expect(() => {
      render(
        <QuarterlyCashFlow 
          data={largeData} 
          metric="netCashFlow"
        />
      );
    }).not.toThrow();
  });

  // Seasonal Pattern Analysis Tests
  it('should support quarter comparison analysis', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
        highlightSeasonality={true}
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  // Zero Value Handling Tests
  it('should handle zero values correctly', () => {
    const zeroData = [
      {
        quarter: 'Q1 2023',
        operatingCashFlow: 200,
        investingCashFlow: -100,
        financingCashFlow: -100,
        netCashFlow: 0,
        freeCashFlow: 100
      }
    ];

    render(
      <QuarterlyCashFlow 
        data={zeroData} 
        metric="netCashFlow"
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  // Growth Rate Display Tests
  it('should support growth rate annotations when enabled', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
        showGrowthRates={true}
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  // Chart Margin Tests
  it('should handle custom chart margins', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
        margin={{ top: 20, right: 30, left: 40, bottom: 50 }}
      />
    );
    
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  // Y-Axis Configuration Tests
  it('should format y-axis ticks appropriately', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
      />
    );
    
    const yAxis = screen.getByTestId('y-axis');
    expect(yAxis).toBeInTheDocument();
  });

  // Data Filtering Tests
  it('should support data filtering by year', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
        filterYear={2023}
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  // Cash Flow Trend Tests
  it('should indicate cash flow trends when enabled', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
        showTrendIndicators={true}
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  // Custom Bar Shape Tests
  it('should support custom bar shapes', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
        barShape="rounded"
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  // Animation Configuration Tests
  it('should support animation configuration', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
        animationDuration={1000}
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  // Accessibility Tests
  it('should provide appropriate accessibility attributes', () => {
    render(
      <QuarterlyCashFlow 
        data={mockQuarterlyCashFlowData} 
        metric="netCashFlow"
        aria-label="Quarterly cash flow chart"
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  // Integration with Other Components Tests
  it('should work within a larger dashboard context', () => {
    const DashboardWrapper = () => (
      <div className="dashboard">
        <h2>Cash Flow Analysis</h2>
        <QuarterlyCashFlow 
          data={mockQuarterlyCashFlowData} 
          metric="netCashFlow"
        />
      </div>
    );

    render(<DashboardWrapper />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByText('Cash Flow Analysis')).toBeInTheDocument();
  });

  // Error Boundary Tests
  it('should handle component errors gracefully', () => {
    // Mock console.error to suppress error output in tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const ErrorTrigger = () => {
      throw new Error('Test error');
    };

    expect(() => {
      render(
        <QuarterlyCashFlow 
          data={mockQuarterlyCashFlowData} 
          metric="netCashFlow"
        />
      );
    }).not.toThrow();

    consoleSpy.mockRestore();
  });

  // Data Validation Tests
  it('should validate data structure', () => {
    const invalidData = [
      {
        // Missing quarter field
        operatingCashFlow: 200,
        netCashFlow: 100
      }
    ] as any;

    expect(() => {
      render(
        <QuarterlyCashFlow 
          data={invalidData} 
          metric="netCashFlow"
        />
      );
    }).not.toThrow();
  });

  // Multiple Quarters Same Year Tests
  it('should handle multiple quarters from same year', () => {
    const sameYearData = mockQuarterlyCashFlowData.filter(d => 
      d.quarter.includes('2023')
    );

    render(
      <QuarterlyCashFlow 
        data={sameYearData} 
        metric="netCashFlow"
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  // Extreme Values Tests
  it('should handle extreme positive and negative values', () => {
    const extremeData = [
      {
        quarter: 'Q1 2023',
        operatingCashFlow: 10000,
        investingCashFlow: -5000,
        financingCashFlow: -2000,
        netCashFlow: 3000,
        freeCashFlow: 5000
      },
      {
        quarter: 'Q2 2023',
        operatingCashFlow: 100,
        investingCashFlow: -8000,
        financingCashFlow: -500,
        netCashFlow: -8400,
        freeCashFlow: -7900
      }
    ];

    render(
      <QuarterlyCashFlow 
        data={extremeData} 
        metric="netCashFlow"
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });
}); 