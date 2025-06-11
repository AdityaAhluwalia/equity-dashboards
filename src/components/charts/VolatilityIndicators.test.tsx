import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VolatilityIndicators from './VolatilityIndicators';
import { PhaseType } from '@/lib/design-tokens';

// Mock Recharts components
jest.mock('recharts', () => ({
  ...jest.requireActual('recharts'),
  ResponsiveContainer: ({ children }: any) => children,
  BarChart: ({ children, data }: any) => (
    <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Bar: ({ dataKey, fill }: any) => (
    <div data-testid="bar" data-key={dataKey} data-fill={fill} />
  ),
  XAxis: ({ dataKey }: any) => (
    <div data-testid="x-axis" data-key={dataKey} />
  ),
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Cell: ({ fill }: any) => <div data-testid="cell" data-fill={fill} />,
}));

export interface VolatilityMetric {
  period: string;
  value: number;
  volatility: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'extreme';
  standardDeviation: number;
  variance: number;
  coefficient: number; // Coefficient of variation
  trend: 'increasing' | 'decreasing' | 'stable';
  phase?: PhaseType;
}

export interface HeatmapData {
  metric: string;
  periods: Array<{
    period: string;
    value: number;
    volatility: number;
    normalizedValue: number; // 0-1 scale for heatmap coloring
    riskLevel: 'low' | 'moderate' | 'high' | 'extreme';
  }>;
}

export interface VolatilityIndicatorsProps {
  data: VolatilityMetric[];
  heatmapData?: HeatmapData[];
  showVolatilityTrend?: boolean;
  showRiskLevels?: boolean;
  showHeatmap?: boolean;
  showStatistics?: boolean;
  showAlerts?: boolean;
  showComparative?: boolean;
  enableInteraction?: boolean;
  enableTooltips?: boolean;
  volatilityThresholds?: {
    low: number;
    moderate: number;
    high: number;
    extreme: number;
  };
  heatmapConfig?: {
    colorScheme: 'risk' | 'performance' | 'custom';
    cellSize: 'small' | 'medium' | 'large';
    showValues: boolean;
    showGradient: boolean;
  };
  timeRange?: '3M' | '6M' | '1Y' | '2Y' | '5Y' | 'ALL';
  compactMode?: boolean;
  onMetricHover?: (metric: VolatilityMetric | null) => void;
  onMetricClick?: (metric: VolatilityMetric) => void;
  onHeatmapCellClick?: (data: HeatmapData, period: string) => void;
  onAlertClick?: (alert: any) => void;
}

const mockVolatilityData: VolatilityMetric[] = [
  {
    period: 'Q1 FY22',
    value: 1200,
    volatility: 12.5,
    riskLevel: 'low',
    standardDeviation: 45.2,
    variance: 2043.04,
    coefficient: 0.125,
    trend: 'stable',
    phase: 'stable'
  },
  {
    period: 'Q2 FY22',
    value: 1380,
    volatility: 18.7,
    riskLevel: 'moderate',
    standardDeviation: 65.8,
    variance: 4329.64,
    coefficient: 0.187,
    trend: 'increasing',
    phase: 'expansion'
  },
  {
    period: 'Q3 FY22',
    value: 1520,
    volatility: 25.3,
    riskLevel: 'high',
    standardDeviation: 89.1,
    variance: 7938.81,
    coefficient: 0.253,
    trend: 'increasing',
    phase: 'expansion'
  },
  {
    period: 'Q4 FY22',
    value: 1450,
    volatility: 31.8,
    riskLevel: 'extreme',
    standardDeviation: 112.4,
    variance: 12633.76,
    coefficient: 0.318,
    trend: 'increasing',
    phase: 'transition'
  }
];

const mockHeatmapData: HeatmapData[] = [
  {
    metric: 'Revenue',
    periods: [
      { period: 'Q1', value: 1200, volatility: 12.5, normalizedValue: 0.3, riskLevel: 'low' },
      { period: 'Q2', value: 1380, volatility: 18.7, normalizedValue: 0.5, riskLevel: 'moderate' },
      { period: 'Q3', value: 1520, volatility: 25.3, normalizedValue: 0.7, riskLevel: 'high' },
      { period: 'Q4', value: 1450, volatility: 31.8, normalizedValue: 0.9, riskLevel: 'extreme' }
    ]
  },
  {
    metric: 'Gross Margin',
    periods: [
      { period: 'Q1', value: 45.2, volatility: 8.1, normalizedValue: 0.2, riskLevel: 'low' },
      { period: 'Q2', value: 47.8, volatility: 12.3, normalizedValue: 0.4, riskLevel: 'low' },
      { period: 'Q3', value: 44.1, volatility: 19.7, normalizedValue: 0.6, riskLevel: 'moderate' },
      { period: 'Q4', value: 42.5, volatility: 28.9, normalizedValue: 0.8, riskLevel: 'high' }
    ]
  }
];

describe('VolatilityIndicators', () => {
  describe('Rendering and Basic Functionality', () => {
    it('renders volatility indicators component', () => {
      render(
        <VolatilityIndicators data={mockVolatilityData} />
      );
      
      expect(screen.getByTestId('volatility-indicators')).toBeInTheDocument();
    });

    it('displays volatility metrics for each period', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showVolatilityTrend={true}
        />
      );
      
      expect(screen.getByText('Q1 FY22')).toBeInTheDocument();
      expect(screen.getByText('Q2 FY22')).toBeInTheDocument();
    });

    it('handles empty data gracefully', () => {
      render(
        <VolatilityIndicators data={[]} />
      );
      
      expect(screen.getByTestId('volatility-indicators')).toBeInTheDocument();
      expect(screen.getByText(/no volatility data/i)).toBeInTheDocument();
    });

    it('applies compact mode styling when enabled', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          compactMode={true}
        />
      );
      
      const container = screen.getByTestId('volatility-indicators');
      expect(container).toHaveClass('compact');
    });
  });

  describe('Volatility Trend Visualization', () => {
    it('shows volatility trend chart when enabled', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showVolatilityTrend={true}
        />
      );
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByText(/volatility trend/i)).toBeInTheDocument();
    });

    it('displays volatility values in the chart', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showVolatilityTrend={true}
        />
      );
      
      expect(screen.getByText('12.5%')).toBeInTheDocument();
      expect(screen.getByText('31.8%')).toBeInTheDocument();
    });

    it('color codes bars based on risk levels', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showVolatilityTrend={true}
        />
      );
      
      const bars = screen.getAllByTestId('bar');
      expect(bars.length).toBeGreaterThan(0);
    });

    it('shows trend direction indicators', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showVolatilityTrend={true}
        />
      );
      
      expect(screen.getByText(/increasing/i)).toBeInTheDocument();
      expect(screen.getByText(/stable/i)).toBeInTheDocument();
    });
  });

  describe('Risk Level Indicators', () => {
    it('displays risk level badges when enabled', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showRiskLevels={true}
        />
      );
      
      expect(screen.getByText(/low/i)).toBeInTheDocument();
      expect(screen.getByText(/moderate/i)).toBeInTheDocument();
      expect(screen.getByText(/high/i)).toBeInTheDocument();
      expect(screen.getByText(/extreme/i)).toBeInTheDocument();
    });

    it('applies correct styling for each risk level', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showRiskLevels={true}
        />
      );
      
      const lowRisk = screen.getByText(/low/i);
      const extremeRisk = screen.getByText(/extreme/i);
      
      expect(lowRisk).toHaveClass('bg-green-100', 'text-green-800');
      expect(extremeRisk).toHaveClass('bg-red-100', 'text-red-800');
    });

    it('shows risk level distribution summary', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showRiskLevels={true}
        />
      );
      
      expect(screen.getByText(/risk distribution/i)).toBeInTheDocument();
    });

    it('uses custom volatility thresholds when provided', () => {
      const customThresholds = {
        low: 10,
        moderate: 20,
        high: 30,
        extreme: 40
      };
      
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showRiskLevels={true}
          volatilityThresholds={customThresholds}
        />
      );
      
      expect(screen.getByTestId('volatility-indicators')).toBeInTheDocument();
    });
  });

  describe('Heatmap Visualization', () => {
    it('displays heatmap when enabled and data provided', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          heatmapData={mockHeatmapData}
          showHeatmap={true}
        />
      );
      
      expect(screen.getByTestId('volatility-heatmap')).toBeInTheDocument();
      expect(screen.getByText(/volatility heatmap/i)).toBeInTheDocument();
    });

    it('shows metric names in heatmap rows', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          heatmapData={mockHeatmapData}
          showHeatmap={true}
        />
      );
      
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('Gross Margin')).toBeInTheDocument();
    });

    it('displays period columns in heatmap', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          heatmapData={mockHeatmapData}
          showHeatmap={true}
        />
      );
      
      expect(screen.getByText('Q1')).toBeInTheDocument();
      expect(screen.getByText('Q4')).toBeInTheDocument();
    });

    it('applies color coding based on risk levels', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          heatmapData={mockHeatmapData}
          showHeatmap={true}
        />
      );
      
      const heatmapCells = screen.getAllByTestId('heatmap-cell');
      expect(heatmapCells.length).toBeGreaterThan(0);
    });

    it('shows values in heatmap cells when configured', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          heatmapData={mockHeatmapData}
          showHeatmap={true}
          heatmapConfig={{
            colorScheme: 'risk',
            cellSize: 'medium',
            showValues: true,
            showGradient: false
          }}
        />
      );
      
      expect(screen.getByText('12.5')).toBeInTheDocument();
    });

    it('supports different color schemes', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          heatmapData={mockHeatmapData}
          showHeatmap={true}
          heatmapConfig={{
            colorScheme: 'performance',
            cellSize: 'large',
            showValues: false,
            showGradient: true
          }}
        />
      );
      
      expect(screen.getByTestId('volatility-heatmap')).toBeInTheDocument();
    });
  });

  describe('Statistical Information', () => {
    it('displays statistical metrics when enabled', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showStatistics={true}
        />
      );
      
      expect(screen.getByText(/standard deviation/i)).toBeInTheDocument();
      expect(screen.getByText(/variance/i)).toBeInTheDocument();
      expect(screen.getByText(/coefficient of variation/i)).toBeInTheDocument();
    });

    it('shows statistical values for each metric', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showStatistics={true}
        />
      );
      
      expect(screen.getByText('45.2')).toBeInTheDocument(); // Standard deviation
      expect(screen.getByText('0.125')).toBeInTheDocument(); // Coefficient
    });

    it('calculates and displays summary statistics', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showStatistics={true}
        />
      );
      
      expect(screen.getByText(/average volatility/i)).toBeInTheDocument();
      expect(screen.getByText(/maximum volatility/i)).toBeInTheDocument();
      expect(screen.getByText(/minimum volatility/i)).toBeInTheDocument();
    });

    it('shows volatility percentiles', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showStatistics={true}
        />
      );
      
      expect(screen.getByText(/75th percentile/i)).toBeInTheDocument();
      expect(screen.getByText(/25th percentile/i)).toBeInTheDocument();
    });
  });

  describe('Alert System', () => {
    it('displays volatility alerts when enabled', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showAlerts={true}
        />
      );
      
      expect(screen.getByText(/volatility alerts/i)).toBeInTheDocument();
    });

    it('shows high volatility warnings', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showAlerts={true}
        />
      );
      
      expect(screen.getByText(/high volatility detected/i)).toBeInTheDocument();
    });

    it('displays trend change alerts', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showAlerts={true}
        />
      );
      
      expect(screen.getByText(/volatility trend change/i)).toBeInTheDocument();
    });

    it('shows extreme risk alerts with proper styling', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showAlerts={true}
        />
      );
      
      const alerts = screen.getAllByTestId('volatility-alert');
      expect(alerts.length).toBeGreaterThan(0);
    });

    it('calls onAlertClick when alert is clicked', () => {
      const handleAlertClick = jest.fn();
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showAlerts={true}
          onAlertClick={handleAlertClick}
        />
      );
      
      const alert = screen.getAllByTestId('volatility-alert')[0];
      fireEvent.click(alert);
      
      expect(handleAlertClick).toHaveBeenCalled();
    });
  });

  describe('Comparative Analysis', () => {
    it('shows comparative volatility analysis when enabled', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showComparative={true}
        />
      );
      
      expect(screen.getByText(/comparative analysis/i)).toBeInTheDocument();
    });

    it('displays volatility ranking', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showComparative={true}
        />
      );
      
      expect(screen.getByText(/volatility ranking/i)).toBeInTheDocument();
    });

    it('shows period-over-period comparisons', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showComparative={true}
        />
      );
      
      expect(screen.getByText(/period comparison/i)).toBeInTheDocument();
    });

    it('calculates volatility changes between periods', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showComparative={true}
        />
      );
      
      // Should show percentage changes
      expect(screen.getByText(/\+49\.6%/)).toBeInTheDocument(); // Q1 to Q2 change
    });
  });

  describe('Interactive Features', () => {
    it('enables interaction when specified', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          enableInteraction={true}
        />
      );
      
      const container = screen.getByTestId('volatility-indicators');
      expect(container).toHaveAttribute('data-interactive', 'true');
    });

    it('calls onMetricHover when hovering over metrics', async () => {
      const handleMetricHover = jest.fn();
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          enableInteraction={true}
          onMetricHover={handleMetricHover}
        />
      );
      
      const metricElement = screen.getAllByTestId('volatility-metric')[0];
      fireEvent.mouseEnter(metricElement);
      
      await waitFor(() => {
        expect(handleMetricHover).toHaveBeenCalledWith(mockVolatilityData[0]);
      });
      
      fireEvent.mouseLeave(metricElement);
      await waitFor(() => {
        expect(handleMetricHover).toHaveBeenCalledWith(null);
      });
    });

    it('calls onMetricClick when clicking metrics', () => {
      const handleMetricClick = jest.fn();
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          enableInteraction={true}
          onMetricClick={handleMetricClick}
        />
      );
      
      const metricElement = screen.getAllByTestId('volatility-metric')[0];
      fireEvent.click(metricElement);
      
      expect(handleMetricClick).toHaveBeenCalledWith(mockVolatilityData[0]);
    });

    it('calls onHeatmapCellClick when clicking heatmap cells', () => {
      const handleHeatmapCellClick = jest.fn();
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          heatmapData={mockHeatmapData}
          showHeatmap={true}
          enableInteraction={true}
          onHeatmapCellClick={handleHeatmapCellClick}
        />
      );
      
      const cell = screen.getAllByTestId('heatmap-cell')[0];
      fireEvent.click(cell);
      
      expect(handleHeatmapCellClick).toHaveBeenCalled();
    });

    it('enables tooltips when specified', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          enableTooltips={true}
        />
      );
      
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });
  });

  describe('Time Range Filtering', () => {
    it('filters data based on time range selection', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          timeRange="6M"
        />
      );
      
      expect(screen.getByText(/last 6 months/i)).toBeInTheDocument();
    });

    it('shows time range selector', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          timeRange="1Y"
        />
      );
      
      expect(screen.getByText(/time range/i)).toBeInTheDocument();
    });

    it('updates display based on selected time range', () => {
      const { rerender } = render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          timeRange="3M"
        />
      );
      
      expect(screen.getByText(/3 months/i)).toBeInTheDocument();
      
      rerender(
        <VolatilityIndicators 
          data={mockVolatilityData}
          timeRange="1Y"
        />
      );
      
      expect(screen.getByText(/1 year/i)).toBeInTheDocument();
    });
  });

  describe('Performance and Accessibility', () => {
    it('handles large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        ...mockVolatilityData[0],
        period: `Period ${i}`,
        volatility: Math.random() * 50
      }));
      
      const startTime = performance.now();
      render(
        <VolatilityIndicators data={largeDataset} />
      );
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(200);
    });

    it('provides ARIA labels for accessibility', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showVolatilityTrend={true}
        />
      );
      
      const chart = screen.getByTestId('bar-chart');
      expect(chart).toHaveAttribute('aria-label');
    });

    it('supports keyboard navigation', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          enableInteraction={true}
        />
      );
      
      const metrics = screen.getAllByTestId('volatility-metric');
      expect(metrics[0]).toHaveAttribute('tabIndex', '0');
    });

    it('provides descriptive text for screen readers', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showStatistics={true}
        />
      );
      
      expect(screen.getByText(/volatility analysis/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('handles invalid volatility data gracefully', () => {
      const invalidData = [
        { ...mockVolatilityData[0], volatility: NaN },
        { ...mockVolatilityData[1], volatility: Infinity }
      ];
      
      render(
        <VolatilityIndicators data={invalidData} />
      );
      
      expect(screen.getByTestId('volatility-indicators')).toBeInTheDocument();
    });

    it('shows error message for corrupted data', () => {
      const corruptedData = [
        { period: 'Q1', value: null, volatility: undefined } as any
      ];
      
      render(
        <VolatilityIndicators data={corruptedData} />
      );
      
      expect(screen.getByText(/data error/i)).toBeInTheDocument();
    });

    it('handles missing heatmap data appropriately', () => {
      render(
        <VolatilityIndicators 
          data={mockVolatilityData}
          showHeatmap={true}
          heatmapData={[]}
        />
      );
      
      expect(screen.getByText(/no heatmap data/i)).toBeInTheDocument();
    });
  });
}); 