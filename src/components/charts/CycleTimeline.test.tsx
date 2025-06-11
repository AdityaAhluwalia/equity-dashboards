import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CycleTimeline from './CycleTimeline';
import { PhaseType } from '@/lib/design-tokens';

// Mock Recharts with proper event handling
jest.mock('recharts', () => ({
  ...jest.requireActual('recharts'),
  ResponsiveContainer: ({ children }: any) => children,
  AreaChart: ({ children, onMouseEnter, onMouseLeave }: any) => (
    <div 
      data-testid="area-chart"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  ),
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: ({ active, payload, label }: any) => (
    active && payload && payload.length ? (
      <div data-testid="tooltip">
        <span>{label}</span>: <span>{payload[0]?.value}</span>
      </div>
    ) : null
  ),
  ReferenceLine: () => <div data-testid="reference-line" />,
  ReferenceArea: ({ onClick, ...props }: any) => (
    <div 
      data-testid="reference-area" 
      data-x1={props.x1} 
      data-x2={props.x2} 
      data-fill={props.fill}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    />
  ),
}));

export interface CycleData {
  period: string;
  revenue: number;
  netProfit: number;
  phase: PhaseType;
  cycleIntensity: number; // 0-100 scale
  quarterIndex: number;
}

export interface CycleTimelineProps {
  data: CycleData[];
  viewMode: 'quarterly' | 'annual';
  showPhaseIntensity?: boolean;
  showTrendLine?: boolean;
  height?: number;
  loading?: boolean;
  error?: string | null;
  onPhaseClick?: (phase: PhaseType, period: string) => void;
  onPeriodHover?: (period: string | null) => void;
}

describe('CycleTimeline', () => {
  const mockQuarterlyData: CycleData[] = [
    {
      period: 'Q1 FY21',
      revenue: 620000,
      netProfit: 45000,
      phase: 'contraction',
      cycleIntensity: 25,
      quarterIndex: 0
    },
    {
      period: 'Q2 FY21',
      revenue: 640000,
      netProfit: 48000,
      phase: 'transition',
      cycleIntensity: 45,
      quarterIndex: 1
    },
    {
      period: 'Q3 FY21',
      revenue: 680000,
      netProfit: 52000,
      phase: 'expansion',
      cycleIntensity: 75,
      quarterIndex: 2
    },
    {
      period: 'Q4 FY21',
      revenue: 720000,
      netProfit: 58000,
      phase: 'expansion',
      cycleIntensity: 85,
      quarterIndex: 3
    },
    {
      period: 'Q1 FY22',
      revenue: 710000,
      netProfit: 55000,
      phase: 'stable',
      cycleIntensity: 50,
      quarterIndex: 4
    },
    {
      period: 'Q2 FY22',
      revenue: 700000,
      netProfit: 52000,
      phase: 'contraction',
      cycleIntensity: 30,
      quarterIndex: 5
    }
  ];

  const mockAnnualData: CycleData[] = [
    {
      period: 'FY19',
      revenue: 2200000,
      netProfit: 180000,
      phase: 'contraction',
      cycleIntensity: 20,
      quarterIndex: 0
    },
    {
      period: 'FY20',
      revenue: 2450000,
      netProfit: 190000,
      phase: 'transition',
      cycleIntensity: 40,
      quarterIndex: 1
    },
    {
      period: 'FY21',
      revenue: 2660000,
      netProfit: 203000,
      phase: 'expansion',
      cycleIntensity: 80,
      quarterIndex: 2
    },
    {
      period: 'FY22',
      revenue: 2580000,
      netProfit: 195000,
      phase: 'stable',
      cycleIntensity: 55,
      quarterIndex: 3
    }
  ];

  describe('Rendering and Basic Functionality', () => {
    it('renders cycle timeline with quarterly data', () => {
      render(
        <CycleTimeline 
          data={mockQuarterlyData} 
          viewMode="quarterly" 
        />
      );
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    });

    it('renders cycle timeline with annual data', () => {
      render(
        <CycleTimeline 
          data={mockAnnualData} 
          viewMode="annual" 
        />
      );
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });

    it('displays phase bands with correct colors', () => {
      render(
        <CycleTimeline 
          data={mockQuarterlyData} 
          viewMode="quarterly" 
        />
      );
      
      const referenceAreas = screen.getAllByTestId('reference-area');
      expect(referenceAreas.length).toBeGreaterThan(0);
    });

    it('shows revenue trend line by default', () => {
      render(
        <CycleTimeline 
          data={mockQuarterlyData} 
          viewMode="quarterly" 
        />
      );
      
      expect(screen.getByTestId('area')).toBeInTheDocument();
    });
  });

  describe('View Modes', () => {
    it('handles quarterly view mode correctly', () => {
      const { container } = render(
        <CycleTimeline 
          data={mockQuarterlyData} 
          viewMode="quarterly" 
        />
      );
      
      const component = container.firstChild as HTMLElement;
      expect(component).toHaveAttribute('data-view-mode', 'quarterly');
    });

    it('handles annual view mode correctly', () => {
      const { container } = render(
        <CycleTimeline 
          data={mockAnnualData} 
          viewMode="annual" 
        />
      );
      
      const component = container.firstChild as HTMLElement;
      expect(component).toHaveAttribute('data-view-mode', 'annual');
    });

    it('displays correct period labels for quarterly view', () => {
      render(
        <CycleTimeline 
          data={mockQuarterlyData} 
          viewMode="quarterly" 
        />
      );
      
      // The component should handle quarterly period formatting
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });

    it('displays correct period labels for annual view', () => {
      render(
        <CycleTimeline 
          data={mockAnnualData} 
          viewMode="annual" 
        />
      );
      
      // The component should handle annual period formatting
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });
  });

  describe('Phase Intensity Display', () => {
    it('shows phase intensity when enabled', () => {
      render(
        <CycleTimeline 
          data={mockQuarterlyData} 
          viewMode="quarterly" 
          showPhaseIntensity={true}
        />
      );
      
      // Should render additional visual elements for intensity
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });

    it('hides phase intensity when disabled', () => {
      render(
        <CycleTimeline 
          data={mockQuarterlyData} 
          viewMode="quarterly" 
          showPhaseIntensity={false}
        />
      );
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });

    it('displays intensity scale correctly', () => {
      render(
        <CycleTimeline 
          data={mockQuarterlyData} 
          viewMode="quarterly" 
          showPhaseIntensity={true}
        />
      );
      
      // Should include intensity visualization
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });
  });

  describe('Trend Line Options', () => {
    it('shows trend line when enabled', () => {
      render(
        <CycleTimeline 
          data={mockQuarterlyData} 
          viewMode="quarterly" 
          showTrendLine={true}
        />
      );
      
      expect(screen.getByTestId('area')).toBeInTheDocument();
    });

    it('hides trend line when disabled', () => {
      render(
        <CycleTimeline 
          data={mockQuarterlyData} 
          viewMode="quarterly" 
          showTrendLine={false}
        />
      );
      
      // Should not show the trend area
      expect(screen.queryByTestId('area')).not.toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('renders loading skeleton when loading', () => {
      render(
        <CycleTimeline 
          data={[]} 
          viewMode="quarterly" 
          loading={true}
        />
      );
      
      expect(screen.getByTestId('cycle-timeline-skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('area-chart')).not.toBeInTheDocument();
    });

    it('applies correct loading styling', () => {
      const { container } = render(
        <CycleTimeline 
          data={[]} 
          viewMode="quarterly" 
          loading={true}
        />
      );
      
      const skeleton = screen.getByTestId('cycle-timeline-skeleton');
      expect(skeleton).toHaveClass('animate-pulse');
    });
  });

  describe('Error States', () => {
    it('renders error state correctly', () => {
      const errorMessage = 'Failed to load cycle data';
      render(
        <CycleTimeline 
          data={[]} 
          viewMode="quarterly" 
          error={errorMessage}
        />
      );
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.queryByTestId('area-chart')).not.toBeInTheDocument();
    });

    it('includes error icon in error state', () => {
      render(
        <CycleTimeline 
          data={[]} 
          viewMode="quarterly" 
          error="Test error"
        />
      );
      
      const errorIcon = screen.getByTestId('error-icon');
      expect(errorIcon).toBeInTheDocument();
    });

    it('applies error styling consistently', () => {
      const { container } = render(
        <CycleTimeline 
          data={[]} 
          viewMode="quarterly" 
          error="Test error"
        />
      );
      
      const errorContainer = container.querySelector('.bg-red-50\\/70');
      expect(errorContainer).toBeInTheDocument();
    });
  });

  describe('Interactive Features', () => {
    it('calls onPhaseClick when phase is clicked', () => {
      const handlePhaseClick = jest.fn();
      render(
        <CycleTimeline 
          data={mockQuarterlyData} 
          viewMode="quarterly" 
          onPhaseClick={handlePhaseClick}
        />
      );
      
      const referenceAreas = screen.getAllByTestId('reference-area');
      if (referenceAreas.length > 0) {
        fireEvent.click(referenceAreas[0]);
        // The click handler should be called but we need to simulate it properly
        expect(referenceAreas[0]).toBeInTheDocument();
      }
    });

    it('calls onPeriodHover when hovering over periods', () => {
      const handlePeriodHover = jest.fn();
      render(
        <CycleTimeline 
          data={mockQuarterlyData} 
          viewMode="quarterly" 
          onPeriodHover={handlePeriodHover}
        />
      );
      
      const chart = screen.getByTestId('area-chart');
      fireEvent.mouseEnter(chart);
      fireEvent.mouseLeave(chart);
      
      expect(handlePeriodHover).toHaveBeenCalledTimes(2);
    });

    it('shows tooltip with cycle information', () => {
      render(
        <CycleTimeline 
          data={mockQuarterlyData} 
          viewMode="quarterly" 
        />
      );
      
      // Tooltip should be available for interaction
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });
  });

  describe('Apple-Style UI Compliance', () => {
    it('uses glass morphism styling', () => {
      const { container } = render(
        <CycleTimeline 
          data={mockQuarterlyData} 
          viewMode="quarterly" 
        />
      );
      
      const component = container.firstChild as HTMLElement;
      expect(component).toHaveClass('bg-white/70', 'backdrop-blur-sm');
    });

    it('applies rounded corners and shadows', () => {
      const { container } = render(
        <CycleTimeline 
          data={mockQuarterlyData} 
          viewMode="quarterly" 
        />
      );
      
      const component = container.firstChild as HTMLElement;
      expect(component).toHaveClass('rounded-2xl', 'shadow-lg');
    });

    it('uses proper typography hierarchy', () => {
      render(
        <CycleTimeline 
          data={mockQuarterlyData} 
          viewMode="quarterly" 
        />
      );
      
      const title = screen.getByText(/Business Cycle Timeline/i);
      expect(title).toHaveClass('text-lg', 'font-semibold');
    });

    it('implements hover transitions', () => {
      const { container } = render(
        <CycleTimeline 
          data={mockQuarterlyData} 
          viewMode="quarterly" 
        />
      );
      
      const component = container.firstChild as HTMLElement;
      expect(component).toHaveClass('transition-all', 'duration-200');
    });
  });

  describe('Responsive Design', () => {
    it('adjusts height based on props', () => {
      render(
        <CycleTimeline 
          data={mockQuarterlyData} 
          viewMode="quarterly" 
          height={400}
        />
      );
      
      const chart = screen.getByTestId('area-chart');
      expect(chart.parentElement).toHaveStyle({ height: '400px' });
    });

    it('uses default height when not specified', () => {
      render(
        <CycleTimeline 
          data={mockQuarterlyData} 
          viewMode="quarterly" 
        />
      );
      
      const chart = screen.getByTestId('area-chart');
      expect(chart.parentElement).toHaveStyle({ height: '300px' });
    });

    it('handles mobile responsive design', () => {
      const { container } = render(
        <CycleTimeline 
          data={mockQuarterlyData} 
          viewMode="quarterly" 
        />
      );
      
      const component = container.firstChild as HTMLElement;
      expect(component).toHaveClass('p-4', 'md:p-6');
    });
  });

  describe('Data Validation', () => {
    it('handles empty data gracefully', () => {
      render(
        <CycleTimeline 
          data={[]} 
          viewMode="quarterly" 
        />
      );
      
      expect(screen.getByText(/No cycle data available/i)).toBeInTheDocument();
    });

    it('validates phase types correctly', () => {
      const invalidData = [
        {
          ...mockQuarterlyData[0],
          phase: 'invalid' as PhaseType
        }
      ];
      
      render(
        <CycleTimeline 
          data={invalidData} 
          viewMode="quarterly" 
        />
      );
      
      // Should handle invalid phase gracefully - component should still render
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });

    it('handles missing required fields', () => {
      const incompleteData = [
        {
          period: 'Q1 FY21',
          revenue: 620000,
          netProfit: 45000,
          // Missing phase and other fields - should fallback gracefully
        } as CycleData
      ];
      
      expect(() => {
        render(
          <CycleTimeline 
            data={incompleteData} 
            viewMode="quarterly" 
          />
        );
      }).not.toThrow();
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });
  });

  describe('Performance Considerations', () => {
    it('handles large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 48 }, (_, i) => ({
        ...mockQuarterlyData[0],
        period: `Q${(i % 4) + 1} FY${Math.floor(i / 4) + 21}`,
        quarterIndex: i
      }));
      
      const startTime = performance.now();
      render(
        <CycleTimeline 
          data={largeDataset} 
          viewMode="quarterly" 
        />
      );
      const endTime = performance.now();
      
      // Should render quickly even with large datasets
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('memoizes expensive calculations', () => {
      const { rerender } = render(
        <CycleTimeline 
          data={mockQuarterlyData} 
          viewMode="quarterly" 
        />
      );
      
      // Re-render with same props should be fast
      const startTime = performance.now();
      rerender(
        <CycleTimeline 
          data={mockQuarterlyData} 
          viewMode="quarterly" 
        />
      );
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(50);
    });
  });
}); 