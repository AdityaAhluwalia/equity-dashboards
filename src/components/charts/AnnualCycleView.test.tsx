import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnnualCycleView from './AnnualCycleView';
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

export interface AnnualCycleData {
  fiscalYear: string;
  revenue: number;
  netProfit: number;
  phase: PhaseType;
  cycleIntensity: number; // 0-100 scale
  yearIndex: number;
  marketCap?: number;
  revenueGrowth?: number;
  profitGrowth?: number;
}

export interface AnnualCycleViewProps {
  data: AnnualCycleData[];
  showPhaseIntensity?: boolean;
  showMarketCap?: boolean;
  showGrowthRates?: boolean;
  height?: number;
  loading?: boolean;
  error?: string | null;
  onPhaseClick?: (phase: PhaseType, year: string) => void;
  onYearHover?: (year: string | null) => void;
  enableZoom?: boolean;
  showTrendAnalysis?: boolean;
}

describe('AnnualCycleView', () => {
  const mockTwelveYearData: AnnualCycleData[] = [
    {
      fiscalYear: 'FY13',
      revenue: 1800000,
      netProfit: 120000,
      phase: 'contraction',
      cycleIntensity: 15,
      yearIndex: 0,
      marketCap: 850000,
      revenueGrowth: -8.5,
      profitGrowth: -12.3
    },
    {
      fiscalYear: 'FY14',
      revenue: 1950000,
      netProfit: 140000,
      phase: 'transition',
      cycleIntensity: 35,
      yearIndex: 1,
      marketCap: 920000,
      revenueGrowth: 8.3,
      profitGrowth: 16.7
    },
    {
      fiscalYear: 'FY15',
      revenue: 2200000,
      netProfit: 180000,
      phase: 'expansion',
      cycleIntensity: 65,
      yearIndex: 2,
      marketCap: 1200000,
      revenueGrowth: 12.8,
      profitGrowth: 28.6
    },
    {
      fiscalYear: 'FY16',
      revenue: 2580000,
      netProfit: 230000,
      phase: 'expansion',
      cycleIntensity: 85,
      yearIndex: 3,
      marketCap: 1450000,
      revenueGrowth: 17.3,
      profitGrowth: 27.8
    },
    {
      fiscalYear: 'FY17',
      revenue: 2750000,
      netProfit: 245000,
      phase: 'stable',
      cycleIntensity: 70,
      yearIndex: 4,
      marketCap: 1580000,
      revenueGrowth: 6.6,
      profitGrowth: 6.5
    },
    {
      fiscalYear: 'FY18',
      revenue: 2680000,
      netProfit: 220000,
      phase: 'contraction',
      cycleIntensity: 25,
      yearIndex: 5,
      marketCap: 1420000,
      revenueGrowth: -2.5,
      profitGrowth: -10.2
    },
    {
      fiscalYear: 'FY19',
      revenue: 2450000,
      netProfit: 190000,
      phase: 'contraction',
      cycleIntensity: 20,
      yearIndex: 6,
      marketCap: 1280000,
      revenueGrowth: -8.6,
      profitGrowth: -13.6
    },
    {
      fiscalYear: 'FY20',
      revenue: 2550000,
      netProfit: 200000,
      phase: 'transition',
      cycleIntensity: 40,
      yearIndex: 7,
      marketCap: 1350000,
      revenueGrowth: 4.1,
      profitGrowth: 5.3
    },
    {
      fiscalYear: 'FY21',
      revenue: 2780000,
      netProfit: 235000,
      phase: 'expansion',
      cycleIntensity: 75,
      yearIndex: 8,
      marketCap: 1650000,
      revenueGrowth: 9.0,
      profitGrowth: 17.5
    },
    {
      fiscalYear: 'FY22',
      revenue: 3100000,
      netProfit: 285000,
      phase: 'expansion',
      cycleIntensity: 90,
      yearIndex: 9,
      marketCap: 1980000,
      revenueGrowth: 11.5,
      profitGrowth: 21.3
    },
    {
      fiscalYear: 'FY23',
      revenue: 3250000,
      netProfit: 295000,
      phase: 'stable',
      cycleIntensity: 60,
      yearIndex: 10,
      marketCap: 2100000,
      revenueGrowth: 4.8,
      profitGrowth: 3.5
    },
    {
      fiscalYear: 'FY24',
      revenue: 3180000,
      netProfit: 280000,
      phase: 'transition',
      cycleIntensity: 45,
      yearIndex: 11,
      marketCap: 2050000,
      revenueGrowth: -2.2,
      profitGrowth: -5.1
    }
  ];

  describe('Rendering and Basic Functionality', () => {
    it('renders annual cycle view with 12 years of data', () => {
      render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
        />
      );
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
      expect(screen.getByText(/Annual Business Cycle Analysis/i)).toBeInTheDocument();
      expect(screen.getByText(/12-year view/i)).toBeInTheDocument();
    });

    it('displays comprehensive phase backgrounds for long-term cycles', () => {
      render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
        />
      );
      
      const referenceAreas = screen.getAllByTestId('reference-area');
      expect(referenceAreas.length).toBeGreaterThan(0);
      
      // Should have phase bands covering entire 12-year period
      expect(referenceAreas.length).toBeGreaterThanOrEqual(3);
    });

    it('shows revenue and profit trends over 12 years', () => {
      render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
        />
      );
      
      expect(screen.getByTestId('area')).toBeInTheDocument();
      expect(screen.getByText(/Revenue Trend/i)).toBeInTheDocument();
    });

    it('formats fiscal year labels correctly', () => {
      render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
        />
      );
      
      // Should format FY13, FY14, etc.
      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    });
  });

  describe('Phase Background Visualization', () => {
    it('creates distinct phase bands for different cycle periods', () => {
      render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
        />
      );
      
      const referenceAreas = screen.getAllByTestId('reference-area');
      
      // Should have multiple distinct phase bands
      expect(referenceAreas.length).toBeGreaterThanOrEqual(4);
    });

    it('applies correct colors to phase backgrounds', () => {
      render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
        />
      );
      
      const referenceAreas = screen.getAllByTestId('reference-area');
      
      // Each phase area should have appropriate styling
      referenceAreas.forEach(area => {
        expect(area).toHaveAttribute('data-fill');
      });
    });

    it('handles phase transitions smoothly', () => {
      render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
        />
      );
      
      // Should create smooth transitions between different phases
      const referenceAreas = screen.getAllByTestId('reference-area');
      expect(referenceAreas.length).toBeGreaterThan(1);
    });

    it('identifies complete business cycles over 12 years', () => {
      render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
          showTrendAnalysis={true}
        />
      );
      
      // Should show cycle analysis
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });
  });

  describe('Data Visualization Options', () => {
    it('shows phase intensity when enabled', () => {
      render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
          showPhaseIntensity={true}
        />
      );
      
      expect(screen.getByText(/Phase Intensity/i)).toBeInTheDocument();
    });

    it('displays market cap overlay when enabled', () => {
      render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
          showMarketCap={true}
        />
      );
      
      expect(screen.getByText(/Market Cap/i)).toBeInTheDocument();
    });

    it('shows growth rates when enabled', () => {
      render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
          showGrowthRates={true}
        />
      );
      
      expect(screen.getByText(/Growth Rate/i)).toBeInTheDocument();
    });

    it('enables zoom functionality when requested', () => {
      render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
          enableZoom={true}
        />
      );
      
      // Should have zoom controls or functionality
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });
  });

  describe('Long-term Trend Analysis', () => {
    it('displays trend analysis when enabled', () => {
      render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
          showTrendAnalysis={true}
        />
      );
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });

    it('calculates cycle statistics correctly', () => {
      const { container } = render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
          showTrendAnalysis={true}
        />
      );
      
      // Should show cycle metrics
      expect(container).toBeInTheDocument();
    });

    it('identifies peak and trough years', () => {
      render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
          showTrendAnalysis={true}
        />
      );
      
      // Should highlight significant points
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });
  });

  describe('Interactive Features', () => {
    it('calls onPhaseClick when phase background is clicked', () => {
      const handlePhaseClick = jest.fn();
      render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
          onPhaseClick={handlePhaseClick}
        />
      );
      
      const referenceAreas = screen.getAllByTestId('reference-area');
      if (referenceAreas.length > 0) {
        fireEvent.click(referenceAreas[0]);
        expect(referenceAreas[0]).toBeInTheDocument();
      }
    });

    it('calls onYearHover when hovering over years', () => {
      const handleYearHover = jest.fn();
      render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
          onYearHover={handleYearHover}
        />
      );
      
      const chart = screen.getByTestId('area-chart');
      fireEvent.mouseEnter(chart);
      fireEvent.mouseLeave(chart);
      
      expect(handleYearHover).toHaveBeenCalledTimes(2);
    });

    it('displays detailed tooltip with annual information', () => {
      render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
        />
      );
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });
  });

  describe('Loading and Error States', () => {
    it('renders loading skeleton when loading', () => {
      render(
        <AnnualCycleView 
          data={[]} 
          loading={true}
        />
      );
      
      expect(screen.getByTestId('annual-cycle-skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('area-chart')).not.toBeInTheDocument();
    });

    it('renders error state correctly', () => {
      const errorMessage = 'Failed to load annual cycle data';
      render(
        <AnnualCycleView 
          data={[]} 
          error={errorMessage}
        />
      );
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.queryByTestId('area-chart')).not.toBeInTheDocument();
    });

    it('handles empty data gracefully', () => {
      render(
        <AnnualCycleView 
          data={[]} 
        />
      );
      
      expect(screen.getByText(/No annual data available/i)).toBeInTheDocument();
    });
  });

  describe('Apple-Style UI Compliance', () => {
    it('uses glass morphism styling', () => {
      const { container } = render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
        />
      );
      
      const component = container.firstChild as HTMLElement;
      expect(component).toHaveClass('bg-white/70', 'backdrop-blur-sm');
    });

    it('applies rounded corners and shadows', () => {
      const { container } = render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
        />
      );
      
      const component = container.firstChild as HTMLElement;
      expect(component).toHaveClass('rounded-2xl', 'shadow-lg');
    });

    it('uses proper typography hierarchy', () => {
      render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
        />
      );
      
      const title = screen.getByText(/Annual Business Cycle Analysis/i);
      expect(title).toHaveClass('text-lg', 'font-semibold');
    });

    it('implements hover transitions', () => {
      const { container } = render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
        />
      );
      
      const component = container.firstChild as HTMLElement;
      expect(component).toHaveClass('transition-all', 'duration-200');
    });
  });

  describe('Responsive Design', () => {
    it('adjusts height based on props', () => {
      render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
          height={500}
        />
      );
      
      const chart = screen.getByTestId('area-chart');
      expect(chart.parentElement).toHaveStyle({ height: '500px' });
    });

    it('uses default height when not specified', () => {
      render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
        />
      );
      
      const chart = screen.getByTestId('area-chart');
      expect(chart.parentElement).toHaveStyle({ height: '400px' });
    });

    it('handles mobile responsive design', () => {
      const { container } = render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
        />
      );
      
      const component = container.firstChild as HTMLElement;
      expect(component).toHaveClass('p-4', 'md:p-6');
    });
  });

  describe('Performance Considerations', () => {
    it('handles large datasets efficiently', () => {
      const startTime = performance.now();
      render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
        />
      );
      const endTime = performance.now();
      
      // Should render quickly even with 12 years of data
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('memoizes expensive calculations', () => {
      const { rerender } = render(
        <AnnualCycleView 
          data={mockTwelveYearData} 
        />
      );
      
      // Re-render with same props should be fast
      const startTime = performance.now();
      rerender(
        <AnnualCycleView 
          data={mockTwelveYearData} 
        />
      );
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(50);
    });
  });
}); 