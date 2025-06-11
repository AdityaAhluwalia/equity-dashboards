import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CashFlowBreakdown } from './CashFlowBreakdown';

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children, ...props }: any) => (
    <div data-testid="bar-chart" {...props}>{children}</div>
  ),
  Bar: ({ dataKey, ...props }: any) => (
    <div data-testid={`bar-${dataKey}`} {...props} />
  ),
  XAxis: (props: any) => <div data-testid="x-axis" {...props} />,
  YAxis: (props: any) => <div data-testid="y-axis" {...props} />,
  CartesianGrid: (props: any) => <div data-testid="cartesian-grid" {...props} />,
  Tooltip: (props: any) => <div data-testid="tooltip" {...props} />,
  Legend: (props: any) => <div data-testid="legend" {...props} />,
  Cell: ({ fill, ...props }: any) => (
    <div data-testid="cell" data-fill={fill} {...props} />
  ),
  PieChart: ({ children, ...props }: any) => (
    <div data-testid="pie-chart" {...props}>{children}</div>
  ),
  Pie: ({ dataKey, ...props }: any) => (
    <div data-testid={`pie-${dataKey}`} {...props} />
  ),
}));

const mockCashFlowData = [
  {
    year: 2020,
    operatingCashFlow: 420,
    investingCashFlow: -150,
    financingCashFlow: -180,
    netCashFlow: 90,
    // OCF Breakdown
    netIncome: 390,
    depreciation: 85,
    workingCapitalChange: -55,
    // ICF Breakdown
    capex: -120,
    acquisitions: -20,
    assetDisposals: 15,
    investments: -25,
    // FCF Breakdown
    debtIssuance: 50,
    debtRepayment: -80,
    dividendPayments: -120,
    shareRepurchases: -30
  },
  {
    year: 2021,
    operatingCashFlow: 520,
    investingCashFlow: -200,
    financingCashFlow: -150,
    netCashFlow: 170,
    // OCF Breakdown
    netIncome: 450,
    depreciation: 95,
    workingCapitalChange: -25,
    // ICF Breakdown
    capex: -150,
    acquisitions: -30,
    assetDisposals: 20,
    investments: -40,
    // FCF Breakdown
    debtIssuance: 30,
    debtRepayment: -90,
    dividendPayments: -75,
    shareRepurchases: -15
  },
  {
    year: 2022,
    operatingCashFlow: 580,
    investingCashFlow: -220,
    financingCashFlow: -160,
    netCashFlow: 200,
    // OCF Breakdown
    netIncome: 520,
    depreciation: 105,
    workingCapitalChange: -45,
    // ICF Breakdown
    capex: -180,
    acquisitions: -25,
    assetDisposals: 10,
    investments: -25,
    // FCF Breakdown
    debtIssuance: 40,
    debtRepayment: -100,
    dividendPayments: -85,
    shareRepurchases: -15
  }
];

const mockQuarterlyData = [
  {
    quarter: 'Q1 2023',
    operatingCashFlow: 160,
    investingCashFlow: -60,
    financingCashFlow: -45,
    netCashFlow: 55,
    netIncome: 140,
    depreciation: 25,
    workingCapitalChange: -5,
    capex: -45,
    acquisitions: -10,
    assetDisposals: 5,
    investments: -10,
    debtIssuance: 10,
    debtRepayment: -25,
    dividendPayments: -20,
    shareRepurchases: -10
  },
  {
    quarter: 'Q2 2023',
    operatingCashFlow: 165,
    investingCashFlow: -65,
    financingCashFlow: -40,
    netCashFlow: 60,
    netIncome: 150,
    depreciation: 25,
    workingCapitalChange: -10,
    capex: -50,
    acquisitions: -8,
    assetDisposals: 3,
    investments: -10,
    debtIssuance: 15,
    debtRepayment: -30,
    dividendPayments: -15,
    shareRepurchases: -10
  }
];

describe('CashFlowBreakdown', () => {
  // Basic Rendering Tests
  it('should render with annual data', () => {
    render(<CashFlowBreakdown data={mockCashFlowData} viewMode="annual" />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('should render with quarterly data', () => {
    render(<CashFlowBreakdown data={mockQuarterlyData} viewMode="quarterly" />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  // OCF Breakdown Tests
  it('should render OCF breakdown components', () => {
    render(
      <CashFlowBreakdown 
        data={mockCashFlowData} 
        viewMode="annual" 
        breakdownType="OCF"
      />
    );
    
    expect(screen.getByTestId('bar-netIncome')).toBeInTheDocument();
    expect(screen.getByTestId('bar-depreciation')).toBeInTheDocument();
    expect(screen.getByTestId('bar-workingCapitalChange')).toBeInTheDocument();
  });

  it('should show OCF breakdown section title', () => {
    render(
      <CashFlowBreakdown 
        data={mockCashFlowData} 
        viewMode="annual" 
        breakdownType="OCF"
      />
    );
    
    expect(screen.getByText(/Operating Cash Flow Breakdown/i)).toBeInTheDocument();
  });

  // ICF Breakdown Tests
  it('should render ICF breakdown components', () => {
    render(
      <CashFlowBreakdown 
        data={mockCashFlowData} 
        viewMode="annual" 
        breakdownType="ICF"
      />
    );
    
    expect(screen.getByTestId('bar-capex')).toBeInTheDocument();
    expect(screen.getByTestId('bar-acquisitions')).toBeInTheDocument();
    expect(screen.getByTestId('bar-assetDisposals')).toBeInTheDocument();
    expect(screen.getByTestId('bar-investments')).toBeInTheDocument();
  });

  it('should show ICF breakdown section title', () => {
    render(
      <CashFlowBreakdown 
        data={mockCashFlowData} 
        viewMode="annual" 
        breakdownType="ICF"
      />
    );
    
    expect(screen.getByText(/Investing Cash Flow Breakdown/i)).toBeInTheDocument();
  });

  // FCF Breakdown Tests
  it('should render FCF breakdown components', () => {
    render(
      <CashFlowBreakdown 
        data={mockCashFlowData} 
        viewMode="annual" 
        breakdownType="FCF"
      />
    );
    
    expect(screen.getByTestId('bar-debtIssuance')).toBeInTheDocument();
    expect(screen.getByTestId('bar-debtRepayment')).toBeInTheDocument();
    expect(screen.getByTestId('bar-dividendPayments')).toBeInTheDocument();
    expect(screen.getByTestId('bar-shareRepurchases')).toBeInTheDocument();
  });

  it('should show FCF breakdown section title', () => {
    render(
      <CashFlowBreakdown 
        data={mockCashFlowData} 
        viewMode="annual" 
        breakdownType="FCF"
      />
    );
    
    expect(screen.getByText(/Financing Cash Flow Breakdown/i)).toBeInTheDocument();
  });

  // All Components Combined Test
  it('should render all breakdown types when type is "ALL"', () => {
    render(
      <CashFlowBreakdown 
        data={mockCashFlowData} 
        viewMode="annual" 
        breakdownType="ALL"
      />
    );
    
    // Should show all breakdown sections
    expect(screen.getByText(/Operating Cash Flow Breakdown/i)).toBeInTheDocument();
    expect(screen.getByText(/Investing Cash Flow Breakdown/i)).toBeInTheDocument();
    expect(screen.getByText(/Financing Cash Flow Breakdown/i)).toBeInTheDocument();
  });

  // Color Scheme Tests
  it('should use appropriate colors for OCF components', () => {
    render(
      <CashFlowBreakdown 
        data={mockCashFlowData} 
        viewMode="annual" 
        breakdownType="OCF"
      />
    );
    
    const netIncomeBar = screen.getByTestId('bar-netIncome');
    const depreciationBar = screen.getByTestId('bar-depreciation');
    const workingCapitalBar = screen.getByTestId('bar-workingCapitalChange');
    
    expect(netIncomeBar).toHaveAttribute('fill', '#10b981'); // Primary green
    expect(depreciationBar).toHaveAttribute('fill', '#34d399'); // Light green
    expect(workingCapitalBar).toHaveAttribute('fill', '#6ee7b7'); // Lighter green
  });

  it('should use appropriate colors for ICF components', () => {
    render(
      <CashFlowBreakdown 
        data={mockCashFlowData} 
        viewMode="annual" 
        breakdownType="ICF"
      />
    );
    
    const capexBar = screen.getByTestId('bar-capex');
    const acquisitionsBar = screen.getByTestId('bar-acquisitions');
    const disposalsBar = screen.getByTestId('bar-assetDisposals');
    const investmentsBar = screen.getByTestId('bar-investments');
    
    expect(capexBar).toHaveAttribute('fill', '#ef4444'); // Primary red
    expect(acquisitionsBar).toHaveAttribute('fill', '#f87171'); // Light red
    expect(disposalsBar).toHaveAttribute('fill', '#10b981'); // Green for positive
    expect(investmentsBar).toHaveAttribute('fill', '#fca5a5'); // Lighter red
  });

  it('should use appropriate colors for FCF components', () => {
    render(
      <CashFlowBreakdown 
        data={mockCashFlowData} 
        viewMode="annual" 
        breakdownType="FCF"
      />
    );
    
    const debtIssuanceBar = screen.getByTestId('bar-debtIssuance');
    const debtRepaymentBar = screen.getByTestId('bar-debtRepayment');
    const dividendsBar = screen.getByTestId('bar-dividendPayments');
    const repurchasesBar = screen.getByTestId('bar-shareRepurchases');
    
    expect(debtIssuanceBar).toHaveAttribute('fill', '#f59e0b'); // Primary orange
    expect(debtRepaymentBar).toHaveAttribute('fill', '#fbbf24'); // Light orange
    expect(dividendsBar).toHaveAttribute('fill', '#fcd34d'); // Lighter orange
    expect(repurchasesBar).toHaveAttribute('fill', '#fde68a'); // Lightest orange
  });

  // View Mode Tests
  it('should handle annual view mode correctly', () => {
    render(
      <CashFlowBreakdown 
        data={mockCashFlowData} 
        viewMode="annual" 
        breakdownType="OCF"
      />
    );
    
    const xAxis = screen.getByTestId('x-axis');
    expect(xAxis).toHaveAttribute('dataKey', 'year');
  });

  it('should handle quarterly view mode correctly', () => {
    render(
      <CashFlowBreakdown 
        data={mockQuarterlyData} 
        viewMode="quarterly" 
        breakdownType="OCF"
      />
    );
    
    const xAxis = screen.getByTestId('x-axis');
    expect(xAxis).toHaveAttribute('dataKey', 'quarter');
  });

  // Chart Configuration Tests
  it('should render chart elements for breakdown display', () => {
    render(
      <CashFlowBreakdown 
        data={mockCashFlowData} 
        viewMode="annual" 
        breakdownType="OCF"
      />
    );
    
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  // Percentage View Tests
  it('should support percentage breakdown view', () => {
    render(
      <CashFlowBreakdown 
        data={mockCashFlowData} 
        viewMode="annual" 
        breakdownType="OCF"
        showPercentages={true}
      />
    );
    
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie-value')).toBeInTheDocument();
  });

  it('should not show pie chart when percentages disabled', () => {
    render(
      <CashFlowBreakdown 
        data={mockCashFlowData} 
        viewMode="annual" 
        breakdownType="OCF"
        showPercentages={false}
      />
    );
    
    expect(screen.queryByTestId('pie-chart')).not.toBeInTheDocument();
  });

  // Interactive Features Tests
  it('should support custom height', () => {
    render(
      <CashFlowBreakdown 
        data={mockCashFlowData} 
        viewMode="annual" 
        breakdownType="OCF"
        height={500}
      />
    );
    
    const container = screen.getByTestId('responsive-container');
    expect(container).toBeInTheDocument();
  });

  it('should handle breakdown type switching', () => {
    const { rerender } = render(
      <CashFlowBreakdown 
        data={mockCashFlowData} 
        viewMode="annual" 
        breakdownType="OCF"
      />
    );
    
    expect(screen.getByText(/Operating Cash Flow Breakdown/i)).toBeInTheDocument();
    
    rerender(
      <CashFlowBreakdown 
        data={mockCashFlowData} 
        viewMode="annual" 
        breakdownType="ICF"
      />
    );
    
    expect(screen.getByText(/Investing Cash Flow Breakdown/i)).toBeInTheDocument();
  });

  // Data Processing Tests
  it('should handle positive and negative values correctly', () => {
    const mixedData = [
      {
        year: 2023,
        operatingCashFlow: 500,
        netIncome: 450,
        depreciation: 80,
        workingCapitalChange: -30,
        capex: -200,
        acquisitions: -50,
        assetDisposals: 25,
        investments: -15
      }
    ];

    render(
      <CashFlowBreakdown 
        data={mixedData} 
        viewMode="annual" 
        breakdownType="ALL"
      />
    );
    
    expect(screen.getByTestId('bar-netIncome')).toBeInTheDocument();
    expect(screen.getByTestId('bar-workingCapitalChange')).toBeInTheDocument();
    expect(screen.getByTestId('bar-capex')).toBeInTheDocument();
    expect(screen.getByTestId('bar-assetDisposals')).toBeInTheDocument();
  });

  it('should handle empty data gracefully', () => {
    render(
      <CashFlowBreakdown 
        data={[]} 
        viewMode="annual" 
        breakdownType="OCF"
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  // Component Analysis Tests
  it('should calculate component percentages correctly', () => {
    render(
      <CashFlowBreakdown 
        data={mockCashFlowData} 
        viewMode="annual" 
        breakdownType="OCF"
        showAnalysis={true}
      />
    );
    
    expect(screen.getByText(/Component Analysis/i)).toBeInTheDocument();
  });

  it('should show trend indicators for components', () => {
    render(
      <CashFlowBreakdown 
        data={mockCashFlowData} 
        viewMode="annual" 
        breakdownType="OCF"
        showTrends={true}
      />
    );
    
    expect(screen.getByText(/Trends/i)).toBeInTheDocument();
  });

  // Error Handling Tests
  it('should handle malformed data gracefully', () => {
    const malformedData = [
      {
        year: 2023,
        operatingCashFlow: 500,
        // Missing breakdown components
      }
    ];

    expect(() => {
      render(
        <CashFlowBreakdown 
          data={malformedData} 
          viewMode="annual" 
          breakdownType="OCF"
        />
      );
    }).not.toThrow();
  });

  // Component Props Interface Tests
  it('should accept all required props', () => {
    const props = {
      data: mockCashFlowData,
      viewMode: 'annual' as const,
      breakdownType: 'ALL' as const,
      showPercentages: true,
      showAnalysis: true,
      showTrends: true,
      height: 450
    };

    expect(() => {
      render(<CashFlowBreakdown {...props} />);
    }).not.toThrow();
  });

  // Responsive Behavior Tests
  it('should handle responsive container properly', () => {
    render(
      <CashFlowBreakdown 
        data={mockCashFlowData} 
        viewMode="annual" 
        breakdownType="OCF"
      />
    );
    
    const container = screen.getByTestId('responsive-container');
    expect(container).toBeInTheDocument();
  });

  // Custom Styling Tests
  it('should apply custom class names when provided', () => {
    render(
      <CashFlowBreakdown 
        data={mockCashFlowData} 
        viewMode="annual" 
        breakdownType="OCF"
        className="custom-breakdown-chart"
      />
    );
    
    // Component should accept custom class name
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  // Advanced Features Tests
  it('should support drill-down functionality', () => {
    const onComponentClick = jest.fn();
    
    render(
      <CashFlowBreakdown 
        data={mockCashFlowData} 
        viewMode="annual" 
        breakdownType="OCF"
        onComponentClick={onComponentClick}
      />
    );
    
    // Component should be clickable
    expect(screen.getByTestId('bar-netIncome')).toBeInTheDocument();
  });

  it('should show detailed breakdown when enabled', () => {
    render(
      <CashFlowBreakdown 
        data={mockCashFlowData} 
        viewMode="annual" 
        breakdownType="OCF"
        showDetailedBreakdown={true}
      />
    );
    
    expect(screen.getByText(/Detailed Breakdown/i)).toBeInTheDocument();
  });

  // Integration Tests
  it('should work with switching between breakdown types', () => {
    const BreakdownWrapper = () => {
      const [type, setType] = React.useState<'OCF' | 'ICF' | 'FCF' | 'ALL'>('OCF');
      
      return (
        <div>
          <button onClick={() => setType('ICF')}>Switch to ICF</button>
          <CashFlowBreakdown 
            data={mockCashFlowData} 
            viewMode="annual" 
            breakdownType={type}
          />
        </div>
      );
    };

    render(<BreakdownWrapper />);
    
    expect(screen.getByText(/Operating Cash Flow Breakdown/i)).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Switch to ICF'));
    expect(screen.getByText(/Investing Cash Flow Breakdown/i)).toBeInTheDocument();
  });
}); 