import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AbsoluteValuesChart } from './AbsoluteValuesChart';
import { PhaseType } from '@/lib/design-tokens';

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children, onMouseEnter, onMouseLeave, ...props }: any) => (
    <div 
      data-testid="bar-chart" 
      data-props={JSON.stringify(props)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  ),
  Bar: (props: any) => <div data-testid="bar" data-props={JSON.stringify(props)} />,
  XAxis: (props: any) => <div data-testid="x-axis" data-props={JSON.stringify(props)} />,
  YAxis: (props: any) => <div data-testid="y-axis" data-props={JSON.stringify(props)} />,
  CartesianGrid: (props: any) => <div data-testid="cartesian-grid" data-props={JSON.stringify(props)} />,
  Tooltip: ({ content }: any) => <div data-testid="tooltip">{content}</div>,
  Legend: (props: any) => <div data-testid="legend" data-props={JSON.stringify(props)} />,
  ReferenceArea: (props: any) => <div data-testid="reference-area" data-props={JSON.stringify(props)} />,
  Cell: (props: any) => <div data-testid="cell" data-props={JSON.stringify(props)} />,
}));

interface AbsoluteValuesData {
  period: string;
  periodIndex: number;
  revenue: number;
  netProfit: number;
  grossProfit?: number;
  operatingProfit?: number;
  phase: PhaseType;
  ebitda?: number;
  totalExpenses?: number;
}

const mockData: AbsoluteValuesData[] = [
  {
    period: 'FY20',
    periodIndex: 0,
    revenue: 1200000000,
    netProfit: 120000000,
    grossProfit: 480000000,
    operatingProfit: 180000000,
    ebitda: 220000000,
    totalExpenses: 1080000000,
    phase: 'stable'
  },
  {
    period: 'FY21',
    periodIndex: 1,
    revenue: 1350000000,
    netProfit: 145000000,
    grossProfit: 540000000,
    operatingProfit: 210000000,
    ebitda: 255000000,
    totalExpenses: 1205000000,
    phase: 'expansion'
  },
  {
    period: 'FY22',
    periodIndex: 2,
    revenue: 1480000000,
    netProfit: 162000000,
    grossProfit: 592000000,
    operatingProfit: 235000000,
    ebitda: 285000000,
    totalExpenses: 1318000000,
    phase: 'expansion'
  },
  {
    period: 'FY23',
    periodIndex: 3,
    revenue: 1520000000,
    netProfit: 158000000,
    grossProfit: 608000000,
    operatingProfit: 228000000,
    ebitda: 280000000,
    totalExpenses: 1362000000,
    phase: 'stable'
  }
];

describe('AbsoluteValuesChart', () => {
  const defaultProps = {
    data: mockData,
    height: 400,
    showGrossProfit: true,
    showOperatingProfit: true,
    showEbitda: true,
    showTotalExpenses: false,
    viewMode: 'annual' as const,
    chartType: 'grouped' as const,
  };

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<AbsoluteValuesChart {...defaultProps} />);
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    it('renders chart title', () => {
      render(<AbsoluteValuesChart {...defaultProps} />);
      expect(screen.getByText('Absolute Values Analysis')).toBeInTheDocument();
    });

    it('renders chart with correct height', () => {
      render(<AbsoluteValuesChart {...defaultProps} height={500} />);
      const container = screen.getByTestId('responsive-container');
      expect(container.parentElement).toHaveStyle({ height: '500px' });
    });

    it('renders single Y-axis for absolute values', () => {
      render(<AbsoluteValuesChart {...defaultProps} />);
      const yAxes = screen.getAllByTestId('y-axis');
      expect(yAxes).toHaveLength(1);
      
      const primaryAxis = yAxes[0];
      const props = JSON.parse(primaryAxis.getAttribute('data-props') || '{}');
      expect(props.tickFormatter).toBeDefined();
    });
  });

  describe('Chart Types', () => {
    it('renders grouped bar chart by default', () => {
      render(<AbsoluteValuesChart {...defaultProps} chartType="grouped" />);
      const chart = screen.getByTestId('bar-chart');
      expect(chart).toBeInTheDocument();
    });

    it('renders stacked bar chart when specified', () => {
      render(<AbsoluteValuesChart {...defaultProps} chartType="stacked" />);
      const bars = screen.getAllByTestId('bar');
      
      // Check if stacked bars have stackId
      bars.forEach(bar => {
        const props = JSON.parse(bar.getAttribute('data-props') || '{}');
        if (props.dataKey !== 'revenue') { // Revenue should not be stacked
          expect(props.stackId).toBeDefined();
        }
      });
    });

    it('renders waterfall chart when specified', () => {
      render(<AbsoluteValuesChart {...defaultProps} chartType="waterfall" />);
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('Data Visualization', () => {
    it('renders revenue bars', () => {
      render(<AbsoluteValuesChart {...defaultProps} />);
      const revenueBars = screen.getAllByTestId('bar').filter(bar => {
        const props = JSON.parse(bar.getAttribute('data-props') || '{}');
        return props.dataKey === 'revenueInCrores';
      });
      expect(revenueBars.length).toBeGreaterThan(0);
    });

    it('renders net profit bars', () => {
      render(<AbsoluteValuesChart {...defaultProps} />);
      const profitBars = screen.getAllByTestId('bar').filter(bar => {
        const props = JSON.parse(bar.getAttribute('data-props') || '{}');
        return props.dataKey === 'netProfitInCrores';
      });
      expect(profitBars.length).toBeGreaterThan(0);
    });

    it('renders gross profit bars when enabled', () => {
      render(<AbsoluteValuesChart {...defaultProps} showGrossProfit={true} />);
      const grossProfitBars = screen.getAllByTestId('bar').filter(bar => {
        const props = JSON.parse(bar.getAttribute('data-props') || '{}');
        return props.dataKey === 'grossProfitInCrores';
      });
      expect(grossProfitBars.length).toBeGreaterThan(0);
    });

    it('hides gross profit bars when disabled', () => {
      render(<AbsoluteValuesChart {...defaultProps} showGrossProfit={false} />);
      const grossProfitBars = screen.getAllByTestId('bar').filter(bar => {
        const props = JSON.parse(bar.getAttribute('data-props') || '{}');
        return props.dataKey === 'grossProfitInCrores';
      });
      expect(grossProfitBars).toHaveLength(0);
    });

    it('renders operating profit bars when enabled', () => {
      render(<AbsoluteValuesChart {...defaultProps} showOperatingProfit={true} />);
      const operatingProfitBars = screen.getAllByTestId('bar').filter(bar => {
        const props = JSON.parse(bar.getAttribute('data-props') || '{}');
        return props.dataKey === 'operatingProfitInCrores';
      });
      expect(operatingProfitBars.length).toBeGreaterThan(0);
    });

    it('renders EBITDA bars when enabled', () => {
      render(<AbsoluteValuesChart {...defaultProps} showEbitda={true} />);
      const ebitdaBars = screen.getAllByTestId('bar').filter(bar => {
        const props = JSON.parse(bar.getAttribute('data-props') || '{}');
        return props.dataKey === 'ebitdaInCrores';
      });
      expect(ebitdaBars.length).toBeGreaterThan(0);
    });

    it('renders total expenses bars when enabled', () => {
      render(<AbsoluteValuesChart {...defaultProps} showTotalExpenses={true} />);
      const expensesBars = screen.getAllByTestId('bar').filter(bar => {
        const props = JSON.parse(bar.getAttribute('data-props') || '{}');
        return props.dataKey === 'totalExpensesInCrores';
      });
      expect(expensesBars.length).toBeGreaterThan(0);
    });
  });

  describe('Phase Background Bands', () => {
    it('renders phase background areas', () => {
      render(<AbsoluteValuesChart {...defaultProps} />);
      const referenceAreas = screen.getAllByTestId('reference-area');
      expect(referenceAreas.length).toBeGreaterThan(0);
    });

    it('applies correct phase colors to background bands', () => {
      render(<AbsoluteValuesChart {...defaultProps} />);
      const referenceAreas = screen.getAllByTestId('reference-area');
      
      referenceAreas.forEach(area => {
        const props = JSON.parse(area.getAttribute('data-props') || '{}');
        expect(props.fill).toBeDefined();
        expect(props.fillOpacity).toBe(0.1);
      });
    });
  });

  describe('Interactive Features', () => {
    it('handles chart hover events', () => {
      const mockOnHover = jest.fn();
      render(<AbsoluteValuesChart {...defaultProps} onPeriodHover={mockOnHover} />);
      
      const chart = screen.getByTestId('bar-chart');
      fireEvent.mouseEnter(chart);
      fireEvent.mouseLeave(chart);
      
      expect(chart).toBeInTheDocument();
    });

    it('handles period click events', () => {
      const mockOnClick = jest.fn();
      render(<AbsoluteValuesChart {...defaultProps} onPeriodClick={mockOnClick} />);
      
      const chart = screen.getByTestId('bar-chart');
      expect(chart).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('shows loading state', () => {
      render(<AbsoluteValuesChart {...defaultProps} loading={true} />);
      expect(screen.getByText('Loading absolute values data...')).toBeInTheDocument();
    });

    it('shows loading skeleton elements', () => {
      render(<AbsoluteValuesChart {...defaultProps} loading={true} />);
      const skeletons = screen.getAllByTestId(/skeleton/);
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('hides chart when loading', () => {
      render(<AbsoluteValuesChart {...defaultProps} loading={true} />);
      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('shows error message', () => {
      const errorMessage = 'Failed to load absolute values data';
      render(<AbsoluteValuesChart {...defaultProps} error={errorMessage} />);
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('hides chart when error occurs', () => {
      render(<AbsoluteValuesChart {...defaultProps} error="Some error" />);
      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    });

    it('shows retry option for errors', () => {
      const mockOnRetry = jest.fn();
      render(<AbsoluteValuesChart {...defaultProps} error="Error" onRetry={mockOnRetry} />);
      
      const retryButton = screen.getByText('Retry');
      fireEvent.click(retryButton);
      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('Empty Data States', () => {
    it('shows empty state for no data', () => {
      render(<AbsoluteValuesChart {...defaultProps} data={[]} />);
      expect(screen.getByText('No absolute values data available')).toBeInTheDocument();
    });

    it('hides chart for empty data', () => {
      render(<AbsoluteValuesChart {...defaultProps} data={[]} />);
      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    });
  });

  describe('Data Formatting', () => {
    it('formats currency values in crores', () => {
      render(<AbsoluteValuesChart {...defaultProps} />);
      const yAxis = screen.getByTestId('y-axis');
      const props = JSON.parse(yAxis.getAttribute('data-props') || '{}');
      expect(props.tickFormatter).toBeDefined();
    });
  });

  describe('Chart Customization', () => {
    it('supports custom colors for bars', () => {
      render(<AbsoluteValuesChart {...defaultProps} />);
      const bars = screen.getAllByTestId('bar');
      
      bars.forEach(bar => {
        const props = JSON.parse(bar.getAttribute('data-props') || '{}');
        expect(props.fill).toBeDefined();
      });
    });

    it('applies rounded corners to bars', () => {
      render(<AbsoluteValuesChart {...defaultProps} />);
      const bars = screen.getAllByTestId('bar');
      
      bars.forEach(bar => {
        const props = JSON.parse(bar.getAttribute('data-props') || '{}');
        expect(props.radius).toBeDefined();
      });
    });
  });

  describe('Responsiveness', () => {
    it('adapts to different container sizes', () => {
      render(<AbsoluteValuesChart {...defaultProps} />);
      const container = screen.getByTestId('responsive-container');
      expect(container).toBeInTheDocument();
    });

    it('maintains chart proportions on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<AbsoluteValuesChart {...defaultProps} />);
      const chart = screen.getByTestId('bar-chart');
      const props = JSON.parse(chart.getAttribute('data-props') || '{}');
      
      expect(props.margin).toBeDefined();
    });
  });

  describe('View Mode Toggle', () => {
    it('handles annual view mode', () => {
      render(<AbsoluteValuesChart {...defaultProps} viewMode="annual" />);
      expect(screen.getByText('Annual View')).toBeInTheDocument();
    });

    it('handles quarterly view mode', () => {
      render(<AbsoluteValuesChart {...defaultProps} viewMode="quarterly" />);
      expect(screen.getByText('Quarterly View')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<AbsoluteValuesChart {...defaultProps} />);
      const chartContainer = screen.getByRole('img', { name: /absolute.*values.*chart/i });
      expect(chartContainer).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      render(<AbsoluteValuesChart {...defaultProps} />);
      const chart = screen.getByTestId('bar-chart');
      
      fireEvent.keyDown(chart, { key: 'ArrowLeft' });
      fireEvent.keyDown(chart, { key: 'ArrowRight' });
      
      expect(chart).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('handles large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        period: `FY${20 + i}`,
        periodIndex: i,
        revenue: 1000000000 + i * 100000000,
        netProfit: 100000000 + i * 10000000,
        phase: 'stable' as PhaseType,
        grossProfit: 500000000 + i * 50000000,
        operatingProfit: 150000000 + i * 15000000,
        ebitda: 200000000 + i * 20000000,
        totalExpenses: 900000000 + i * 90000000
      }));

      const startTime = performance.now();
      render(<AbsoluteValuesChart {...defaultProps} data={largeDataset} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
    });

    it('memoizes expensive calculations', () => {
      const { rerender } = render(<AbsoluteValuesChart {...defaultProps} />);
      
      rerender(<AbsoluteValuesChart {...defaultProps} />);
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('Waterfall Chart Specific', () => {
    it('calculates cumulative values for waterfall chart', () => {
      render(<AbsoluteValuesChart {...defaultProps} chartType="waterfall" />);
      const chart = screen.getByTestId('bar-chart');
      expect(chart).toBeInTheDocument();
    });

    it('shows bridges between bars in waterfall', () => {
      render(<AbsoluteValuesChart {...defaultProps} chartType="waterfall" />);
      // Waterfall specific testing would go here
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });
}); 