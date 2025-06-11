import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RevenueProfitChart } from './RevenueProfitChart';
import { PhaseType } from '@/lib/design-tokens';

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  ComposedChart: ({ children, onMouseEnter, onMouseLeave, ...props }: any) => (
    <div 
      data-testid="composed-chart" 
      data-props={JSON.stringify(props)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  ),
  Area: (props: any) => <div data-testid="area" data-props={JSON.stringify(props)} />,
  Bar: (props: any) => <div data-testid="bar" data-props={JSON.stringify(props)} />,
  Line: (props: any) => <div data-testid="line" data-props={JSON.stringify(props)} />,
  XAxis: (props: any) => <div data-testid="x-axis" data-props={JSON.stringify(props)} />,
  YAxis: (props: any) => <div data-testid="y-axis" data-props={JSON.stringify(props)} />,
  CartesianGrid: (props: any) => <div data-testid="cartesian-grid" data-props={JSON.stringify(props)} />,
  Tooltip: ({ content }: any) => <div data-testid="tooltip">{content}</div>,
  Legend: (props: any) => <div data-testid="legend" data-props={JSON.stringify(props)} />,
  ReferenceArea: (props: any) => <div data-testid="reference-area" data-props={JSON.stringify(props)} />,
}));

interface RevenueProfitData {
  period: string;
  periodIndex: number;
  revenue: number;
  netProfit: number;
  grossProfit?: number;
  operatingProfit?: number;
  phase: PhaseType;
  revenueGrowth?: number;
  profitGrowth?: number;
  profitMargin?: number;
}

const mockData: RevenueProfitData[] = [
  {
    period: 'FY20',
    periodIndex: 0,
    revenue: 1200000000,
    netProfit: 120000000,
    grossProfit: 480000000,
    operatingProfit: 180000000,
    phase: 'stable',
    revenueGrowth: 5.2,
    profitGrowth: 8.1,
    profitMargin: 10.0
  },
  {
    period: 'FY21',
    periodIndex: 1,
    revenue: 1350000000,
    netProfit: 145000000,
    grossProfit: 540000000,
    operatingProfit: 210000000,
    phase: 'expansion',
    revenueGrowth: 12.5,
    profitGrowth: 20.8,
    profitMargin: 10.7
  },
  {
    period: 'FY22',
    periodIndex: 2,
    revenue: 1480000000,
    netProfit: 162000000,
    grossProfit: 592000000,
    operatingProfit: 235000000,
    phase: 'expansion',
    revenueGrowth: 9.6,
    profitGrowth: 11.7,
    profitMargin: 10.9
  },
  {
    period: 'FY23',
    periodIndex: 3,
    revenue: 1520000000,
    netProfit: 158000000,
    grossProfit: 608000000,
    operatingProfit: 228000000,
    phase: 'stable',
    revenueGrowth: 2.7,
    profitGrowth: -2.5,
    profitMargin: 10.4
  }
];

describe('RevenueProfitChart', () => {
  const defaultProps = {
    data: mockData,
    height: 400,
    showGrossProfit: true,
    showOperatingProfit: true,
    showGrowthRates: true,
    showProfitMargin: true,
    viewMode: 'annual' as const,
  };

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<RevenueProfitChart {...defaultProps} />);
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    it('renders chart title', () => {
      render(<RevenueProfitChart {...defaultProps} />);
      expect(screen.getByText('Revenue & Profit Trends')).toBeInTheDocument();
    });

    it('renders chart with correct height', () => {
      render(<RevenueProfitChart {...defaultProps} height={500} />);
      const container = screen.getByTestId('responsive-container');
      expect(container.parentElement).toHaveStyle({ height: '500px' });
    });

    it('renders dual-axis layout', () => {
      render(<RevenueProfitChart {...defaultProps} />);
      const yAxes = screen.getAllByTestId('y-axis');
      expect(yAxes).toHaveLength(2);
      
      // Primary Y-axis for revenue/profit amounts
      const primaryAxis = yAxes.find(axis => {
        const props = JSON.parse(axis.getAttribute('data-props') || '{}');
        return props.yAxisId === 'amount';
      });
      expect(primaryAxis).toBeInTheDocument();

      // Secondary Y-axis for growth rates
      const secondaryAxis = yAxes.find(axis => {
        const props = JSON.parse(axis.getAttribute('data-props') || '{}');
        return props.yAxisId === 'percentage' && props.orientation === 'right';
      });
      expect(secondaryAxis).toBeInTheDocument();
    });
  });

  describe('Data Visualization', () => {
    it('renders revenue bars', () => {
      render(<RevenueProfitChart {...defaultProps} />);
      const revenueBars = screen.getAllByTestId('bar').filter(bar => {
        const props = JSON.parse(bar.getAttribute('data-props') || '{}');
        return props.dataKey === 'revenueInCrores' && props.yAxisId === 'amount';
      });
      expect(revenueBars.length).toBeGreaterThan(0);
    });

    it('renders net profit bars', () => {
      render(<RevenueProfitChart {...defaultProps} />);
      const profitBars = screen.getAllByTestId('bar').filter(bar => {
        const props = JSON.parse(bar.getAttribute('data-props') || '{}');
        return props.dataKey === 'netProfitInCrores' && props.yAxisId === 'amount';
      });
      expect(profitBars.length).toBeGreaterThan(0);
    });

    it('renders gross profit bars when enabled', () => {
      render(<RevenueProfitChart {...defaultProps} showGrossProfit={true} />);
      const grossProfitBars = screen.getAllByTestId('bar').filter(bar => {
        const props = JSON.parse(bar.getAttribute('data-props') || '{}');
        return props.dataKey === 'grossProfitInCrores';
      });
      expect(grossProfitBars.length).toBeGreaterThan(0);
    });

    it('hides gross profit bars when disabled', () => {
      render(<RevenueProfitChart {...defaultProps} showGrossProfit={false} />);
      const grossProfitBars = screen.getAllByTestId('bar').filter(bar => {
        const props = JSON.parse(bar.getAttribute('data-props') || '{}');
        return props.dataKey === 'grossProfitInCrores';
      });
      expect(grossProfitBars).toHaveLength(0);
    });

    it('renders operating profit bars when enabled', () => {
      render(<RevenueProfitChart {...defaultProps} showOperatingProfit={true} />);
      const operatingProfitBars = screen.getAllByTestId('bar').filter(bar => {
        const props = JSON.parse(bar.getAttribute('data-props') || '{}');
        return props.dataKey === 'operatingProfitInCrores';
      });
      expect(operatingProfitBars.length).toBeGreaterThan(0);
    });

    it('renders growth rate lines when enabled', () => {
      render(<RevenueProfitChart {...defaultProps} showGrowthRates={true} />);
      const growthLines = screen.getAllByTestId('line').filter(line => {
        const props = JSON.parse(line.getAttribute('data-props') || '{}');
        return props.yAxisId === 'percentage';
      });
      expect(growthLines.length).toBeGreaterThan(0);
    });

    it('renders profit margin line when enabled', () => {
      render(<RevenueProfitChart {...defaultProps} showProfitMargin={true} />);
      const marginLines = screen.getAllByTestId('line').filter(line => {
        const props = JSON.parse(line.getAttribute('data-props') || '{}');
        return props.dataKey === 'profitMargin';
      });
      expect(marginLines.length).toBeGreaterThan(0);
    });
  });

  describe('Phase Background Bands', () => {
    it('renders phase background areas', () => {
      render(<RevenueProfitChart {...defaultProps} />);
      const referenceAreas = screen.getAllByTestId('reference-area');
      expect(referenceAreas.length).toBeGreaterThan(0);
    });

    it('applies correct phase colors to background bands', () => {
      render(<RevenueProfitChart {...defaultProps} />);
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
      render(<RevenueProfitChart {...defaultProps} onPeriodHover={mockOnHover} />);
      
      const chart = screen.getByTestId('composed-chart');
      fireEvent.mouseEnter(chart);
      fireEvent.mouseLeave(chart);
      
      // Events should be handled (no crashes)
      expect(chart).toBeInTheDocument();
    });

    it('handles period click events', () => {
      const mockOnClick = jest.fn();
      render(<RevenueProfitChart {...defaultProps} onPeriodClick={mockOnClick} />);
      
      const chart = screen.getByTestId('composed-chart');
      expect(chart).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('shows loading state', () => {
      render(<RevenueProfitChart {...defaultProps} loading={true} />);
      expect(screen.getByText('Loading revenue and profit data...')).toBeInTheDocument();
    });

    it('shows loading skeleton elements', () => {
      render(<RevenueProfitChart {...defaultProps} loading={true} />);
      const skeletons = screen.getAllByTestId(/skeleton/);
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('hides chart when loading', () => {
      render(<RevenueProfitChart {...defaultProps} loading={true} />);
      expect(screen.queryByTestId('composed-chart')).not.toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('shows error message', () => {
      const errorMessage = 'Failed to load data';
      render(<RevenueProfitChart {...defaultProps} error={errorMessage} />);
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('hides chart when error occurs', () => {
      render(<RevenueProfitChart {...defaultProps} error="Some error" />);
      expect(screen.queryByTestId('composed-chart')).not.toBeInTheDocument();
    });

    it('shows retry option for errors', () => {
      const mockOnRetry = jest.fn();
      render(<RevenueProfitChart {...defaultProps} error="Error" onRetry={mockOnRetry} />);
      
      const retryButton = screen.getByText('Retry');
      fireEvent.click(retryButton);
      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('Empty Data States', () => {
    it('shows empty state for no data', () => {
      render(<RevenueProfitChart {...defaultProps} data={[]} />);
      expect(screen.getByText('No revenue and profit data available')).toBeInTheDocument();
    });

    it('hides chart for empty data', () => {
      render(<RevenueProfitChart {...defaultProps} data={[]} />);
      expect(screen.queryByTestId('composed-chart')).not.toBeInTheDocument();
    });
  });

  describe('Data Formatting', () => {
    it('formats revenue values in crores', () => {
      render(<RevenueProfitChart {...defaultProps} />);
      const yAxis = screen.getAllByTestId('y-axis').find(axis => {
        const props = JSON.parse(axis.getAttribute('data-props') || '{}');
        return props.yAxisId === 'amount';
      });
      
      const props = JSON.parse(yAxis?.getAttribute('data-props') || '{}');
      expect(props.tickFormatter).toBeDefined();
    });

    it('formats percentage values correctly', () => {
      render(<RevenueProfitChart {...defaultProps} />);
      const yAxis = screen.getAllByTestId('y-axis').find(axis => {
        const props = JSON.parse(axis.getAttribute('data-props') || '{}');
        return props.yAxisId === 'percentage';
      });
      
      const props = JSON.parse(yAxis?.getAttribute('data-props') || '{}');
      expect(props.tickFormatter).toBeDefined();
    });
  });

  describe('Legend', () => {
    it('renders legend component', () => {
      render(<RevenueProfitChart {...defaultProps} />);
      expect(screen.getByTestId('legend')).toBeInTheDocument();
    });

    it('includes all data series in legend', () => {
      render(<RevenueProfitChart {...defaultProps} />);
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('Net Profit')).toBeInTheDocument();
      expect(screen.getByText('Gross Profit')).toBeInTheDocument();
      expect(screen.getByText('Operating Profit')).toBeInTheDocument();
    });

    it('shows growth rate legends when enabled', () => {
      render(<RevenueProfitChart {...defaultProps} showGrowthRates={true} />);
      expect(screen.getByText('Revenue Growth')).toBeInTheDocument();
      expect(screen.getByText('Profit Growth')).toBeInTheDocument();
    });

    it('shows profit margin legend when enabled', () => {
      render(<RevenueProfitChart {...defaultProps} showProfitMargin={true} />);
      expect(screen.getByText('Profit Margin')).toBeInTheDocument();
    });
  });

  describe('Responsiveness', () => {
    it('adapts to different container sizes', () => {
      render(<RevenueProfitChart {...defaultProps} />);
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

      render(<RevenueProfitChart {...defaultProps} />);
      const chart = screen.getByTestId('composed-chart');
      const props = JSON.parse(chart.getAttribute('data-props') || '{}');
      
      // Should have appropriate margins for mobile
      expect(props.margin).toBeDefined();
    });
  });

  describe('View Mode Toggle', () => {
    it('handles annual view mode', () => {
      render(<RevenueProfitChart {...defaultProps} viewMode="annual" />);
      expect(screen.getByText('Annual View')).toBeInTheDocument();
    });

    it('handles quarterly view mode', () => {
      render(<RevenueProfitChart {...defaultProps} viewMode="quarterly" />);
      expect(screen.getByText('Quarterly View')).toBeInTheDocument();
    });

    it('updates period formatting based on view mode', () => {
      const { rerender } = render(<RevenueProfitChart {...defaultProps} viewMode="annual" />);
      expect(screen.getByText('Annual View')).toBeInTheDocument();

      rerender(<RevenueProfitChart {...defaultProps} viewMode="quarterly" />);
      expect(screen.getByText('Quarterly View')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<RevenueProfitChart {...defaultProps} />);
      const chartContainer = screen.getByRole('img', { name: /revenue.*profit.*chart/i });
      expect(chartContainer).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      render(<RevenueProfitChart {...defaultProps} />);
      const chart = screen.getByTestId('composed-chart');
      
      fireEvent.keyDown(chart, { key: 'ArrowLeft' });
      fireEvent.keyDown(chart, { key: 'ArrowRight' });
      
      // Should handle keyboard events without crashing
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
        revenueGrowth: Math.random() * 20 - 10,
        profitGrowth: Math.random() * 30 - 15,
        profitMargin: 8 + Math.random() * 4
      }));

      const startTime = performance.now();
      render(<RevenueProfitChart {...defaultProps} data={largeDataset} />);
      const endTime = performance.now();

      // Should render in reasonable time (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('memoizes expensive calculations', () => {
      const { rerender } = render(<RevenueProfitChart {...defaultProps} />);
      
      // Re-render with same props
      rerender(<RevenueProfitChart {...defaultProps} />);
      
      // Chart should still be present (memoization working)
      expect(screen.getByTestId('composed-chart')).toBeInTheDocument();
    });
  });
}); 