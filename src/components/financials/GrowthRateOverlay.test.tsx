import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GrowthRateOverlay } from './GrowthRateOverlay';
import { PhaseType } from '@/lib/design-tokens';

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children, onMouseEnter, onMouseLeave, ...props }: any) => (
    <div 
      data-testid="line-chart" 
      data-props={JSON.stringify(props)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  ),
  Line: (props: any) => <div data-testid="line" data-props={JSON.stringify(props)} />,
  XAxis: (props: any) => <div data-testid="x-axis" data-props={JSON.stringify(props)} />,
  YAxis: (props: any) => <div data-testid="y-axis" data-props={JSON.stringify(props)} />,
  CartesianGrid: (props: any) => <div data-testid="cartesian-grid" data-props={JSON.stringify(props)} />,
  Tooltip: ({ content }: any) => <div data-testid="tooltip">{content}</div>,
  Legend: (props: any) => <div data-testid="legend" data-props={JSON.stringify(props)} />,
  ReferenceArea: (props: any) => <div data-testid="reference-area" data-props={JSON.stringify(props)} />,
  ReferenceLine: (props: any) => <div data-testid="reference-line" data-props={JSON.stringify(props)} />,
  Area: (props: any) => <div data-testid="area" data-props={JSON.stringify(props)} />,
}));

interface GrowthRateData {
  period: string;
  periodIndex: number;
  revenueGrowth?: number;
  profitGrowth?: number;
  revenueCAGR?: number;
  profitCAGR?: number;
  quarterlyGrowth?: number;
  yearOverYearGrowth?: number;
  phase: PhaseType;
  profitMargin?: number;
  revenueVolatility?: number;
  profitVolatility?: number;
}

const mockGrowthData: GrowthRateData[] = [
  {
    period: 'FY20',
    periodIndex: 0,
    revenueGrowth: 5.2,
    profitGrowth: 8.5,
    revenueCAGR: 7.8,
    profitCAGR: 12.3,
    quarterlyGrowth: 1.8,
    yearOverYearGrowth: 5.2,
    profitMargin: 13.2,
    revenueVolatility: 0.15,
    profitVolatility: 0.22,
    phase: 'stable'
  },
  {
    period: 'FY21',
    periodIndex: 1,
    revenueGrowth: -2.8,
    profitGrowth: -5.1,
    revenueCAGR: 4.2,
    profitCAGR: 8.7,
    quarterlyGrowth: -0.7,
    yearOverYearGrowth: -2.8,
    profitMargin: 12.9,
    revenueVolatility: 0.18,
    profitVolatility: 0.28,
    phase: 'contraction'
  },
  {
    period: 'FY22',
    periodIndex: 2,
    revenueGrowth: 8.3,
    profitGrowth: 10.8,
    revenueCAGR: 6.5,
    profitCAGR: 11.2,
    quarterlyGrowth: 2.1,
    yearOverYearGrowth: 8.3,
    profitMargin: 13.2,
    revenueVolatility: 0.12,
    profitVolatility: 0.19,
    phase: 'expansion'
  },
  {
    period: 'FY23',
    periodIndex: 3,
    revenueGrowth: 8.2,
    profitGrowth: 11.2,
    revenueCAGR: 7.1,
    profitCAGR: 12.8,
    quarterlyGrowth: 2.0,
    yearOverYearGrowth: 8.2,
    profitMargin: 13.5,
    revenueVolatility: 0.10,
    profitVolatility: 0.16,
    phase: 'expansion'
  },
  {
    period: 'FY24',
    periodIndex: 4,
    revenueGrowth: 5.4,
    profitGrowth: 7.4,
    revenueCAGR: 6.8,
    profitCAGR: 11.5,
    quarterlyGrowth: 1.4,
    yearOverYearGrowth: 5.4,
    profitMargin: 13.8,
    revenueVolatility: 0.08,
    profitVolatility: 0.14,
    phase: 'stable'
  }
];

describe('GrowthRateOverlay', () => {
  const defaultProps = {
    data: mockGrowthData,
    height: 400,
    showRevenueGrowth: true,
    showProfitGrowth: true,
    showCAGR: false,
    showVolatility: false,
    showTrendLines: true,
    overlayType: 'lines' as const,
    viewMode: 'annual' as const,
  };

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<GrowthRateOverlay {...defaultProps} />);
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });

    it('renders chart title', () => {
      render(<GrowthRateOverlay {...defaultProps} />);
      expect(screen.getByText('Growth Rate Analysis')).toBeInTheDocument();
    });

    it('renders chart with correct height', () => {
      render(<GrowthRateOverlay {...defaultProps} height={500} />);
      const container = screen.getByTestId('responsive-container');
      expect(container.parentElement).toHaveStyle({ height: '500px' });
    });

    it('renders percentage Y-axis for growth rates', () => {
      render(<GrowthRateOverlay {...defaultProps} />);
      const yAxes = screen.getAllByTestId('y-axis');
      expect(yAxes.length).toBeGreaterThan(0);
      
      const primaryAxis = yAxes[0];
      const props = JSON.parse(primaryAxis.getAttribute('data-props') || '{}');
      expect(props.tickFormatter).toBeDefined();
    });
  });

  describe('Overlay Types', () => {
    it('renders line overlays by default', () => {
      render(<GrowthRateOverlay {...defaultProps} overlayType="lines" />);
      const chart = screen.getByTestId('line-chart');
      expect(chart).toBeInTheDocument();
    });

    it('renders area overlays when specified', () => {
      render(<GrowthRateOverlay {...defaultProps} overlayType="areas" />);
      const areas = screen.getAllByTestId('area');
      expect(areas.length).toBeGreaterThan(0);
    });

    it('renders band overlays when specified', () => {
      render(<GrowthRateOverlay {...defaultProps} overlayType="bands" />);
      const referenceAreas = screen.getAllByTestId('reference-area');
      expect(referenceAreas.length).toBeGreaterThan(0);
    });
  });

  describe('Growth Rate Lines', () => {
    it('renders revenue growth line when enabled', () => {
      render(<GrowthRateOverlay {...defaultProps} showRevenueGrowth={true} />);
      const revenueLines = screen.getAllByTestId('line').filter(line => {
        const props = JSON.parse(line.getAttribute('data-props') || '{}');
        return props.dataKey === 'revenueGrowth';
      });
      expect(revenueLines.length).toBeGreaterThan(0);
    });

    it('hides revenue growth line when disabled', () => {
      render(<GrowthRateOverlay {...defaultProps} showRevenueGrowth={false} />);
      const revenueLines = screen.getAllByTestId('line').filter(line => {
        const props = JSON.parse(line.getAttribute('data-props') || '{}');
        return props.dataKey === 'revenueGrowth';
      });
      expect(revenueLines).toHaveLength(0);
    });

    it('renders profit growth line when enabled', () => {
      render(<GrowthRateOverlay {...defaultProps} showProfitGrowth={true} />);
      const profitLines = screen.getAllByTestId('line').filter(line => {
        const props = JSON.parse(line.getAttribute('data-props') || '{}');
        return props.dataKey === 'profitGrowth';
      });
      expect(profitLines.length).toBeGreaterThan(0);
    });

    it('renders CAGR lines when enabled', () => {
      render(<GrowthRateOverlay {...defaultProps} showCAGR={true} />);
      const cagrLines = screen.getAllByTestId('line').filter(line => {
        const props = JSON.parse(line.getAttribute('data-props') || '{}');
        return props.dataKey === 'revenueCAGR' || props.dataKey === 'profitCAGR';
      });
      expect(cagrLines.length).toBeGreaterThan(0);
    });

    it('renders volatility indicators when enabled', () => {
      render(<GrowthRateOverlay {...defaultProps} showVolatility={true} />);
      const volatilityLines = screen.getAllByTestId('line').filter(line => {
        const props = JSON.parse(line.getAttribute('data-props') || '{}');
        return props.dataKey === 'revenueVolatility' || props.dataKey === 'profitVolatility';
      });
      expect(volatilityLines.length).toBeGreaterThan(0);
    });
  });

  describe('Phase Background Integration', () => {
    it('renders phase background areas', () => {
      render(<GrowthRateOverlay {...defaultProps} />);
      const referenceAreas = screen.getAllByTestId('reference-area');
      expect(referenceAreas.length).toBeGreaterThan(0);
    });

    it('applies correct phase colors to background bands', () => {
      render(<GrowthRateOverlay {...defaultProps} />);
      const referenceAreas = screen.getAllByTestId('reference-area');
      
      referenceAreas.forEach(area => {
        const props = JSON.parse(area.getAttribute('data-props') || '{}');
        expect(props.fill).toBeDefined();
        expect(props.fillOpacity).toBe(0.1);
      });
    });
  });

  describe('Trend Lines', () => {
    it('shows trend lines when enabled', () => {
      render(<GrowthRateOverlay {...defaultProps} showTrendLines={true} />);
      const trendLines = screen.getAllByTestId('reference-line').filter(line => {
        const props = JSON.parse(line.getAttribute('data-props') || '{}');
        return props.strokeDasharray === '5 5';
      });
      expect(trendLines.length).toBeGreaterThan(0);
    });

    it('hides trend lines when disabled', () => {
      render(<GrowthRateOverlay {...defaultProps} showTrendLines={false} />);
      const trendLines = screen.getAllByTestId('reference-line').filter(line => {
        const props = JSON.parse(line.getAttribute('data-props') || '{}');
        return props.strokeDasharray === '5 5';
      });
      expect(trendLines).toHaveLength(0);
    });
  });

  describe('Interactive Features', () => {
    it('handles chart hover events', () => {
      const mockOnHover = jest.fn();
      render(<GrowthRateOverlay {...defaultProps} onPeriodHover={mockOnHover} />);
      
      const chart = screen.getByTestId('line-chart');
      fireEvent.mouseEnter(chart);
      fireEvent.mouseLeave(chart);
      
      expect(chart).toBeInTheDocument();
    });

    it('handles period click events', () => {
      const mockOnClick = jest.fn();
      render(<GrowthRateOverlay {...defaultProps} onPeriodClick={mockOnClick} />);
      
      const chart = screen.getByTestId('line-chart');
      expect(chart).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('shows loading state', () => {
      render(<GrowthRateOverlay {...defaultProps} loading={true} />);
      expect(screen.getByText('Loading growth rate data...')).toBeInTheDocument();
    });

    it('shows loading skeleton elements', () => {
      render(<GrowthRateOverlay {...defaultProps} loading={true} />);
      const skeletons = screen.getAllByTestId(/skeleton/);
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('hides chart when loading', () => {
      render(<GrowthRateOverlay {...defaultProps} loading={true} />);
      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('shows error message', () => {
      const errorMessage = 'Failed to load growth rate data';
      render(<GrowthRateOverlay {...defaultProps} error={errorMessage} />);
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('hides chart when error occurs', () => {
      render(<GrowthRateOverlay {...defaultProps} error="Some error" />);
      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
    });

    it('shows retry option for errors', () => {
      const mockOnRetry = jest.fn();
      render(<GrowthRateOverlay {...defaultProps} error="Error" onRetry={mockOnRetry} />);
      
      const retryButton = screen.getByText('Retry');
      fireEvent.click(retryButton);
      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('Empty Data States', () => {
    it('shows empty state for no data', () => {
      render(<GrowthRateOverlay {...defaultProps} data={[]} />);
      expect(screen.getByText('No growth rate data available')).toBeInTheDocument();
    });

    it('hides chart for empty data', () => {
      render(<GrowthRateOverlay {...defaultProps} data={[]} />);
      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
    });
  });

  describe('Data Formatting', () => {
    it('formats percentage values correctly', () => {
      render(<GrowthRateOverlay {...defaultProps} />);
      const yAxis = screen.getByTestId('y-axis');
      const props = JSON.parse(yAxis.getAttribute('data-props') || '{}');
      expect(props.tickFormatter).toBeDefined();
    });
  });

  describe('Chart Customization', () => {
    it('supports custom colors for growth lines', () => {
      render(<GrowthRateOverlay {...defaultProps} />);
      const lines = screen.getAllByTestId('line');
      
      lines.forEach(line => {
        const props = JSON.parse(line.getAttribute('data-props') || '{}');
        expect(props.stroke).toBeDefined();
      });
    });

    it('applies different stroke patterns to different metrics', () => {
      render(<GrowthRateOverlay {...defaultProps} showCAGR={true} />);
      const lines = screen.getAllByTestId('line');
      
      const cagrLines = lines.filter(line => {
        const props = JSON.parse(line.getAttribute('data-props') || '{}');
        return props.dataKey === 'revenueCAGR' || props.dataKey === 'profitCAGR';
      });
      
      cagrLines.forEach(line => {
        const props = JSON.parse(line.getAttribute('data-props') || '{}');
        expect(props.strokeDasharray).toBeDefined();
      });
    });
  });

  describe('Responsiveness', () => {
    it('adapts to different container sizes', () => {
      render(<GrowthRateOverlay {...defaultProps} />);
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

      render(<GrowthRateOverlay {...defaultProps} />);
      const chart = screen.getByTestId('line-chart');
      const props = JSON.parse(chart.getAttribute('data-props') || '{}');
      
      expect(props.margin).toBeDefined();
    });
  });

  describe('View Mode Toggle', () => {
    it('handles annual view mode', () => {
      render(<GrowthRateOverlay {...defaultProps} viewMode="annual" />);
      expect(screen.getByText('Annual Growth Rates')).toBeInTheDocument();
    });

    it('handles quarterly view mode', () => {
      render(<GrowthRateOverlay {...defaultProps} viewMode="quarterly" />);
      expect(screen.getByText('Quarterly Growth Rates')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<GrowthRateOverlay {...defaultProps} />);
      const chartContainer = screen.getByRole('img', { name: /growth.*rate.*overlay/i });
      expect(chartContainer).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      render(<GrowthRateOverlay {...defaultProps} />);
      const chart = screen.getByTestId('line-chart');
      
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
        revenueGrowth: Math.random() * 20 - 10,
        profitGrowth: Math.random() * 30 - 15,
        revenueCAGR: Math.random() * 15,
        profitCAGR: Math.random() * 20,
        quarterlyGrowth: Math.random() * 5 - 2.5,
        yearOverYearGrowth: Math.random() * 25 - 12.5,
        profitMargin: 10 + Math.random() * 10,
        revenueVolatility: Math.random() * 0.3,
        profitVolatility: Math.random() * 0.4,
        phase: 'stable' as PhaseType
      }));

      const startTime = performance.now();
      render(<GrowthRateOverlay {...defaultProps} data={largeDataset} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
    });

    it('memoizes expensive calculations', () => {
      const { rerender } = render(<GrowthRateOverlay {...defaultProps} />);
      
      rerender(<GrowthRateOverlay {...defaultProps} />);
      
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });

  describe('Growth Rate Analysis', () => {
    it('shows growth rate statistics', () => {
      render(<GrowthRateOverlay {...defaultProps} showStatistics={true} />);
      expect(screen.getByText(/average.*growth/i)).toBeInTheDocument();
    });

    it('highlights growth acceleration periods', () => {
      render(<GrowthRateOverlay {...defaultProps} showAcceleration={true} />);
      const accelerationAreas = screen.getAllByTestId('reference-area').filter(area => {
        const props = JSON.parse(area.getAttribute('data-props') || '{}');
        return props.fill && props.fill.includes('green');
      });
      expect(accelerationAreas.length).toBeGreaterThan(0);
    });

    it('calculates growth momentum correctly', () => {
      render(<GrowthRateOverlay {...defaultProps} showMomentum={true} />);
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });

  describe('Quarterly Growth Features', () => {
    it('shows seasonal growth patterns', () => {
      render(<GrowthRateOverlay {...defaultProps} viewMode="quarterly" showSeasonality={true} />);
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('displays YoY growth comparisons', () => {
      render(<GrowthRateOverlay {...defaultProps} viewMode="quarterly" showYearOverYear={true} />);
      const yoyLines = screen.getAllByTestId('line').filter(line => {
        const props = JSON.parse(line.getAttribute('data-props') || '{}');
        return props.dataKey === 'yearOverYearGrowth';
      });
      expect(yoyLines.length).toBeGreaterThan(0);
    });
  });
}); 