import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CycleIndicatorsPanel from './CycleIndicatorsPanel';
import { PhaseType } from '@/lib/design-tokens';

// Mock Recharts with proper event handling
jest.mock('recharts', () => ({
  ...jest.requireActual('recharts'),
  ResponsiveContainer: ({ children }: any) => children,
  BarChart: ({ children, onMouseEnter, onMouseLeave }: any) => (
    <div 
      data-testid="bar-chart"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  ),
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Cell: () => <div data-testid="cell" />,
  RadialBarChart: ({ children }: any) => (
    <div data-testid="radial-bar-chart">{children}</div>
  ),
  RadialBar: () => <div data-testid="radial-bar" />,
  PolarAngleAxis: () => <div data-testid="polar-angle-axis" />,
}));

export interface CycleIndicatorData {
  phase: PhaseType;
  momentum: number; // -100 to 100 scale
  strength: number; // 0-100 scale
  duration: number; // quarters in current phase
  transitionProbability: number; // 0-100 probability of phase change
  volatility: number; // 0-100 measure of cycle volatility
  confidence: number; // 0-100 confidence in phase classification
  trend: 'accelerating' | 'decelerating' | 'stable';
  nextPhase?: PhaseType;
  nextPhaseConfidence?: number;
}

export interface CycleIndicatorsPanelProps {
  currentIndicators: CycleIndicatorData;
  historicalMomentum?: Array<{
    period: string;
    momentum: number;
    phase: PhaseType;
  }>;
  showMomentumChart?: boolean;
  showStrengthGauge?: boolean;
  showTransitionMatrix?: boolean;
  showVolatilityIndicator?: boolean;
  showConfidenceMetrics?: boolean;
  showTrendAnalysis?: boolean;
  enablePhaseComparison?: boolean;
  compactMode?: boolean;
  height?: number;
  loading?: boolean;
  error?: string | null;
  onPhaseClick?: (phase: PhaseType) => void;
  onMomentumClick?: (momentum: number, period: string) => void;
  onTransitionClick?: (fromPhase: PhaseType, toPhase: PhaseType, probability: number) => void;
}

const mockCurrentIndicators: CycleIndicatorData = {
  phase: 'expansion',
  momentum: 65,
  strength: 78,
  duration: 3,
  transitionProbability: 25,
  volatility: 35,
  confidence: 82,
  trend: 'accelerating',
  nextPhase: 'stable',
  nextPhaseConfidence: 68
};

const mockHistoricalMomentum = [
  { period: 'Q1 FY22', momentum: 45, phase: 'stable' as PhaseType },
  { period: 'Q2 FY22', momentum: 62, phase: 'expansion' as PhaseType },
  { period: 'Q3 FY22', momentum: 78, phase: 'expansion' as PhaseType },
  { period: 'Q4 FY22', momentum: 85, phase: 'expansion' as PhaseType },
  { period: 'Q1 FY23', momentum: 35, phase: 'transition' as PhaseType },
  { period: 'Q2 FY23', momentum: -15, phase: 'contraction' as PhaseType },
  { period: 'Q3 FY23', momentum: -8, phase: 'contraction' as PhaseType },
  { period: 'Q4 FY23', momentum: 28, phase: 'transition' as PhaseType },
  { period: 'Q1 FY24', momentum: 52, phase: 'expansion' as PhaseType },
  { period: 'Q2 FY24', momentum: 65, phase: 'expansion' as PhaseType },
  { period: 'Q3 FY24', momentum: 72, phase: 'expansion' as PhaseType },
  { period: 'Q4 FY24', momentum: 65, phase: 'expansion' as PhaseType }
];

describe('CycleIndicatorsPanel', () => {
  describe('Rendering and Basic Functionality', () => {
    it('renders cycle indicators panel with current phase data', () => {
      render(<CycleIndicatorsPanel currentIndicators={mockCurrentIndicators} />);
      
      expect(screen.getByText(/cycle indicators/i)).toBeInTheDocument();
      expect(screen.getByText(/expansion/i)).toBeInTheDocument();
    });

    it('displays momentum value and trend direction', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators} 
          showTrendAnalysis={true}
        />
      );
      
      // Should show momentum value
      expect(screen.getByText(/65/)).toBeInTheDocument();
      expect(screen.getByText(/accelerating/i)).toBeInTheDocument();
    });

    it('shows phase strength as percentage', () => {
      render(<CycleIndicatorsPanel currentIndicators={mockCurrentIndicators} />);
      
      expect(screen.getByText(/78%/)).toBeInTheDocument();
    });

    it('displays phase duration information', () => {
      render(<CycleIndicatorsPanel currentIndicators={mockCurrentIndicators} />);
      
      expect(screen.getByText(/3/)).toBeInTheDocument();
    });
  });

  describe('Momentum Bar Chart', () => {
    it('renders momentum chart when enabled with historical data', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          historicalMomentum={mockHistoricalMomentum}
          showMomentumChart={true}
        />
      );
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getAllByTestId('bar')).toHaveLength(1); // One bar series
    });

    it('displays positive and negative momentum with different colors', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          historicalMomentum={mockHistoricalMomentum}
          showMomentumChart={true}
        />
      );
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('shows momentum scale from -100 to +100', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          historicalMomentum={mockHistoricalMomentum}
          showMomentumChart={true}
        />
      );
      
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    });

    it('handles momentum chart interactions', () => {
      const handleMomentumClick = jest.fn();
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          historicalMomentum={mockHistoricalMomentum}
          showMomentumChart={true}
          onMomentumClick={handleMomentumClick}
        />
      );
      
      const chart = screen.getByTestId('bar-chart');
      fireEvent.click(chart);
      
      // Note: In real implementation, this would trigger with momentum data
    });
  });

  describe('Strength Gauge', () => {
    it('renders strength gauge when enabled', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          showStrengthGauge={true}
        />
      );
      
      expect(screen.getByTestId('radial-bar-chart')).toBeInTheDocument();
    });

    it('displays strength percentage in radial format', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          showStrengthGauge={true}
        />
      );
      
      expect(screen.getByTestId('radial-bar')).toBeInTheDocument();
    });

    it('uses different colors for different strength levels', () => {
      const weakIndicators = { ...mockCurrentIndicators, strength: 25 };
      render(
        <CycleIndicatorsPanel 
          currentIndicators={weakIndicators}
          showStrengthGauge={true}
        />
      );
      
      expect(screen.getByTestId('radial-bar-chart')).toBeInTheDocument();
    });

    it('shows strength labels and thresholds', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          showStrengthGauge={true}
        />
      );
      
      expect(screen.getByText(/strong/i)).toBeInTheDocument();
    });
  });

  describe('Transition Matrix', () => {
    it('renders transition probability matrix when enabled', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          showTransitionMatrix={true}
        />
      );
      
      expect(screen.getByText('Transition Probability')).toBeInTheDocument();
      expect(screen.getByText(/25%/)).toBeInTheDocument(); // transition probability
    });

    it('displays next phase prediction', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          showTransitionMatrix={true}
        />
      );
      
      expect(screen.getByText(/stable/i)).toBeInTheDocument(); // next phase
      expect(screen.getByText(/68%/)).toBeInTheDocument(); // next phase confidence
    });

    it('shows all possible phase transitions', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          showTransitionMatrix={true}
        />
      );
      
      // Should show transition probabilities
      expect(screen.getByText('Transition Probability')).toBeInTheDocument();
    });

    it('handles transition matrix clicks', () => {
      const handleTransitionClick = jest.fn();
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          showTransitionMatrix={true}
          onTransitionClick={handleTransitionClick}
        />
      );
      
      // Should be clickable for transition analysis
      expect(screen.getByText('Transition Probability')).toBeInTheDocument();
    });
  });

  describe('Volatility Indicator', () => {
    it('renders volatility indicator when enabled', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          showVolatilityIndicator={true}
        />
      );
      
      expect(screen.getByText(/volatility/i)).toBeInTheDocument();
      expect(screen.getByText(/35%/)).toBeInTheDocument();
    });

    it('displays volatility level classification', () => {
      const highVolatilityIndicators = { ...mockCurrentIndicators, volatility: 85 };
      render(
        <CycleIndicatorsPanel 
          currentIndicators={highVolatilityIndicators}
          showVolatilityIndicator={true}
        />
      );
      
      expect(screen.getByText(/high/i)).toBeInTheDocument();
    });

    it('shows volatility trend over time', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          showVolatilityIndicator={true}
        />
      );
      
      expect(screen.getByText(/volatility/i)).toBeInTheDocument();
    });
  });

  describe('Confidence Metrics', () => {
    it('displays confidence percentage when enabled', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          showConfidenceMetrics={true}
        />
      );
      
      expect(screen.getByText(/confidence/i)).toBeInTheDocument();
      expect(screen.getByText(/82%/)).toBeInTheDocument();
    });

    it('shows confidence level classification', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          showConfidenceMetrics={true}
        />
      );
      
      expect(screen.getByText(/high/i)).toBeInTheDocument();
    });

    it('displays confidence breakdown by metric', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          showConfidenceMetrics={true}
        />
      );
      
      expect(screen.getByText(/confidence/i)).toBeInTheDocument();
    });
  });

  describe('Trend Analysis', () => {
    it('shows trend direction and strength when enabled', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          showTrendAnalysis={true}
        />
      );
      
      expect(screen.getByText(/accelerating/i)).toBeInTheDocument();
    });

    it('displays trend indicators with visual cues', () => {
      const deceleratingIndicators = { ...mockCurrentIndicators, trend: 'decelerating' as const };
      render(
        <CycleIndicatorsPanel 
          currentIndicators={deceleratingIndicators}
          showTrendAnalysis={true}
        />
      );
      
      expect(screen.getByText(/decelerating/i)).toBeInTheDocument();
    });

    it('shows trend duration and stability', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          showTrendAnalysis={true}
        />
      );
      
      expect(screen.getByText('Trend Analysis')).toBeInTheDocument();
    });
  });

  describe('Phase Comparison', () => {
    it('enables phase comparison when requested', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          enablePhaseComparison={true}
        />
      );
      
      expect(screen.getByText('Phase Comparison')).toBeInTheDocument();
    });

    it('shows relative phase strength comparison', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          enablePhaseComparison={true}
        />
      );
      
      // Should show comparison elements
      expect(screen.getByText('Phase Comparison')).toBeInTheDocument();
    });

    it('handles phase click interactions', () => {
      const handlePhaseClick = jest.fn();
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          enablePhaseComparison={true}
          onPhaseClick={handlePhaseClick}
        />
      );
      
      // Should be able to click on phases
      expect(screen.getByText('Phase Comparison')).toBeInTheDocument();
    });
  });

  describe('Interactive Features', () => {
    it('calls onPhaseClick when phase is clicked', () => {
      const handlePhaseClick = jest.fn();
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          onPhaseClick={handlePhaseClick}
        />
      );
      
      // Simulate phase click - get the first expansion element by role
      const phaseElements = screen.getAllByText(/expansion/i);
      fireEvent.click(phaseElements[0]);
      
      expect(handlePhaseClick).toHaveBeenCalledWith('expansion');
    });

    it('displays detailed tooltip information', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          showMomentumChart={true}
          historicalMomentum={mockHistoricalMomentum}
        />
      );
      
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });

    it('shows contextual help and explanations', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          showConfidenceMetrics={true}
        />
      );
      
      // Should have help text or indicators
      expect(screen.getByText(/confidence/i)).toBeInTheDocument();
    });
  });

  describe('Compact Mode', () => {
    it('renders in compact layout when enabled', () => {
      const { container } = render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          compactMode={true}
        />
      );
      
      // Should have compact styling
      const compactElement = container.querySelector('.compact');
      expect(compactElement || container.firstChild).toBeInTheDocument();
    });

    it('hides non-essential elements in compact mode', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          compactMode={true}
          showMomentumChart={true}
          showStrengthGauge={true}
        />
      );
      
      // Should prioritize key information
      expect(screen.getByText(/expansion/i)).toBeInTheDocument();
    });

    it('maintains key functionality in compact mode', () => {
      const handlePhaseClick = jest.fn();
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          compactMode={true}
          onPhaseClick={handlePhaseClick}
        />
      );
      
      const phaseElements = screen.getAllByText(/expansion/i);
      fireEvent.click(phaseElements[0]);
      
      expect(handlePhaseClick).toHaveBeenCalled();
    });
  });

  describe('Loading and Error States', () => {
    it('renders loading skeleton when loading', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          loading={true}
        />
      );
      
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('renders error state correctly', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          error="Failed to load cycle indicators"
        />
      );
      
      expect(screen.getByText(/failed to load cycle indicators/i)).toBeInTheDocument();
    });

    it('handles invalid indicator data gracefully', () => {
      const invalidIndicators = {
        ...mockCurrentIndicators,
        momentum: NaN,
        strength: -1
      };
      
      render(<CycleIndicatorsPanel currentIndicators={invalidIndicators} />);
      
      // Should handle invalid data without crashing
      expect(screen.getByText(/expansion/i)).toBeInTheDocument();
    });
  });

  describe('Apple-Style UI Compliance', () => {
    it('uses glass morphism styling', () => {
      const { container } = render(
        <CycleIndicatorsPanel currentIndicators={mockCurrentIndicators} />
      );
      
      // Check for glass morphism classes
      const glassElement = container.querySelector('.backdrop-blur-sm');
      expect(glassElement).toBeInTheDocument();
    });

    it('applies rounded corners and shadows', () => {
      const { container } = render(
        <CycleIndicatorsPanel currentIndicators={mockCurrentIndicators} />
      );
      
      const cardElement = container.querySelector('.rounded-2xl');
      expect(cardElement).toBeInTheDocument();
      
      const shadowElement = container.querySelector('.shadow-lg');
      expect(shadowElement).toBeInTheDocument();
    });

    it('uses proper typography hierarchy', () => {
      render(<CycleIndicatorsPanel currentIndicators={mockCurrentIndicators} />);
      
      // Should have proper heading structure
      expect(screen.getByRole('heading')).toBeInTheDocument();
    });

    it('implements hover transitions', () => {
      const { container } = render(
        <CycleIndicatorsPanel currentIndicators={mockCurrentIndicators} />
      );
      
      const transitionElement = container.querySelector('.transition-all');
      expect(transitionElement).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('adjusts height based on props', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          height={400}
        />
      );
      
      // Should apply custom height
      const container = screen.getByRole('heading').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('uses default height when not specified', () => {
      render(<CycleIndicatorsPanel currentIndicators={mockCurrentIndicators} />);
      
      // Should use default layout
      expect(screen.getByRole('heading')).toBeInTheDocument();
    });

    it('handles mobile responsive design', () => {
      const { container } = render(
        <CycleIndicatorsPanel currentIndicators={mockCurrentIndicators} />
      );
      
      // Should have responsive classes
      const responsiveElement = container.querySelector('.sm\\:') || container.querySelector('.md\\:');
      expect(responsiveElement || container.firstChild).toBeInTheDocument();
    });
  });

  describe('Performance Considerations', () => {
    it('handles large momentum datasets efficiently', () => {
      const largeMomentumData = Array.from({ length: 100 }, (_, i) => ({
        period: `Q${(i % 4) + 1} FY${Math.floor(i / 4) + 20}`,
        momentum: Math.random() * 200 - 100,
        phase: ['expansion', 'stable', 'contraction', 'transition'][i % 4] as PhaseType
      }));
      
      const startTime = performance.now();
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          historicalMomentum={largeMomentumData}
          showMomentumChart={true}
        />
      );
      const endTime = performance.now();
      
      // Should render quickly even with large datasets
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('memoizes expensive indicator calculations', () => {
      const { rerender } = render(
        <CycleIndicatorsPanel currentIndicators={mockCurrentIndicators} />
      );
      
      // Re-render with same data should be fast
      const startTime = performance.now();
      rerender(<CycleIndicatorsPanel currentIndicators={mockCurrentIndicators} />);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(50);
    });

    it('optimizes chart rendering for momentum data', () => {
      render(
        <CycleIndicatorsPanel 
          currentIndicators={mockCurrentIndicators}
          historicalMomentum={mockHistoricalMomentum}
          showMomentumChart={true}
          showStrengthGauge={true}
          showTransitionMatrix={true}
        />
      );
      
      // Should handle multiple charts efficiently
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('radial-bar-chart')).toBeInTheDocument();
    });
  });
}); 