import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PhaseTransitionMarkers from './PhaseTransitionMarkers';
import { PhaseType } from '@/lib/design-tokens';

// Mock Recharts with proper event handling
jest.mock('recharts', () => ({
  ...jest.requireActual('recharts'),
  ResponsiveContainer: ({ children }: any) => children,
  ReferenceLine: ({ x, stroke, strokeDasharray, label }: any) => (
    <div 
      data-testid="reference-line"
      data-x={x}
      data-stroke={stroke}
      data-stroke-dasharray={strokeDasharray}
      data-label={label}
    />
  ),
  ReferenceArea: ({ x1, x2, fill, fillOpacity }: any) => (
    <div 
      data-testid="reference-area"
      data-x1={x1}
      data-x2={x2}
      data-fill={fill}
      data-fill-opacity={fillOpacity}
    />
  ),
}));

export interface PhaseTransition {
  fromPhase: PhaseType;
  toPhase: PhaseType;
  transitionDate: string; // Date or period identifier
  transitionIndex: number; // Index in the data array
  confidence: number; // 0-100 confidence in transition detection
  trigger: 'fundamental' | 'technical' | 'external' | 'mixed';
  severity: 'minor' | 'moderate' | 'major';
  duration: number; // Duration of transition in periods
  impact: {
    revenue: number; // % impact on revenue
    profitability: number; // % impact on margins
    volatility: number; // % change in volatility
  };
  context?: string; // Optional context description
  annotations?: string[]; // Additional notes
}

export interface PhaseTransitionMarkersProps {
  transitions: PhaseTransition[];
  chartData: Array<{
    period: string;
    [key: string]: any;
  }>;
  showTransitionLines?: boolean;
  showTransitionAreas?: boolean;
  showTransitionLabels?: boolean;
  showConfidenceIndicators?: boolean;
  showImpactMetrics?: boolean;
  showDetailedAnnotations?: boolean;
  enableTransitionTooltips?: boolean;
  enableTransitionClick?: boolean;
  highlightRecentTransitions?: boolean;
  transitionLineStyle?: 'solid' | 'dashed' | 'dotted';
  annotationPosition?: 'top' | 'bottom' | 'auto';
  compactMode?: boolean;
  onTransitionHover?: (transition: PhaseTransition | null) => void;
  onTransitionClick?: (transition: PhaseTransition) => void;
  onAnnotationClick?: (transition: PhaseTransition, annotation: string) => void;
}

const mockTransitions: PhaseTransition[] = [
  {
    fromPhase: 'stable',
    toPhase: 'expansion',
    transitionDate: 'Q2 FY22',
    transitionIndex: 2,
    confidence: 85,
    trigger: 'fundamental',
    severity: 'moderate',
    duration: 1,
    impact: {
      revenue: 15.5,
      profitability: 8.2,
      volatility: 12.0
    },
    context: 'Strong product launch and market expansion',
    annotations: ['New product line launched', 'Market share increased by 3%']
  },
  {
    fromPhase: 'expansion',
    toPhase: 'stable',
    transitionDate: 'Q4 FY22',
    transitionIndex: 4,
    confidence: 72,
    trigger: 'technical',
    severity: 'minor',
    duration: 2,
    impact: {
      revenue: -2.1,
      profitability: 1.5,
      volatility: -5.8
    },
    context: 'Margin stabilization after growth phase',
    annotations: ['Operational efficiency improvements', 'Cost optimization completed']
  },
  {
    fromPhase: 'stable',
    toPhase: 'contraction',
    transitionDate: 'Q2 FY23',
    transitionIndex: 6,
    confidence: 91,
    trigger: 'external',
    severity: 'major',
    duration: 3,
    impact: {
      revenue: -18.5,
      profitability: -12.3,
      volatility: 25.7
    },
    context: 'Economic downturn and supply chain disruptions',
    annotations: ['Global recession impact', 'Raw material cost increase', 'Demand slowdown']
  }
];

const mockChartData = [
  { period: 'Q1 FY22', revenue: 1200, phase: 'stable' },
  { period: 'Q2 FY22', revenue: 1380, phase: 'expansion' },
  { period: 'Q3 FY22', revenue: 1520, phase: 'expansion' },
  { period: 'Q4 FY22', revenue: 1450, phase: 'stable' },
  { period: 'Q1 FY23', revenue: 1480, phase: 'stable' },
  { period: 'Q2 FY23', revenue: 1200, phase: 'contraction' },
  { period: 'Q3 FY23', revenue: 1050, phase: 'contraction' },
  { period: 'Q4 FY23', revenue: 980, phase: 'contraction' },
];

describe('PhaseTransitionMarkers', () => {
  describe('Rendering and Basic Functionality', () => {
    it('renders phase transition markers component', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
        />
      );
      
      expect(screen.getByTestId('phase-transition-markers')).toBeInTheDocument();
    });

    it('displays transition markers for each transition', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showTransitionLines={true}
        />
      );
      
      const referenceLines = screen.getAllByTestId('reference-line');
      expect(referenceLines).toHaveLength(mockTransitions.length);
    });

    it('handles empty transitions array gracefully', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={[]}
          chartData={mockChartData}
        />
      );
      
      expect(screen.getByTestId('phase-transition-markers')).toBeInTheDocument();
      expect(screen.queryByTestId('reference-line')).not.toBeInTheDocument();
    });

    it('handles missing chart data gracefully', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={[]}
        />
      );
      
      expect(screen.getByTestId('phase-transition-markers')).toBeInTheDocument();
    });
  });

  describe('Transition Lines', () => {
    it('shows transition lines when enabled', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showTransitionLines={true}
        />
      );
      
      const referenceLines = screen.getAllByTestId('reference-line');
      expect(referenceLines.length).toBeGreaterThan(0);
    });

    it('hides transition lines when disabled', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showTransitionLines={false}
        />
      );
      
      expect(screen.queryByTestId('reference-line')).not.toBeInTheDocument();
    });

    it('applies different line styles based on transition severity', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showTransitionLines={true}
        />
      );
      
      const referenceLines = screen.getAllByTestId('reference-line');
      const majorTransitionLine = referenceLines.find(line => 
        line.getAttribute('data-stroke') === '#EF4444' // Red for major
      );
      expect(majorTransitionLine).toBeInTheDocument();
    });

    it('supports different line styles (solid, dashed, dotted)', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showTransitionLines={true}
          transitionLineStyle="dashed"
        />
      );
      
      const referenceLines = screen.getAllByTestId('reference-line');
      expect(referenceLines[0]).toHaveAttribute('data-stroke-dasharray');
    });

    it('positions lines correctly based on transition index', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showTransitionLines={true}
        />
      );
      
      const referenceLines = screen.getAllByTestId('reference-line');
      expect(referenceLines[0]).toHaveAttribute('data-x', '2'); // First transition at index 2
    });
  });

  describe('Transition Areas', () => {
    it('shows transition areas when enabled', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showTransitionAreas={true}
        />
      );
      
      const referenceAreas = screen.getAllByTestId('reference-area');
      expect(referenceAreas.length).toBeGreaterThan(0);
    });

    it('applies different colors based on transition direction', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showTransitionAreas={true}
        />
      );
      
      const referenceAreas = screen.getAllByTestId('reference-area');
      const expansionArea = referenceAreas.find(area => 
        area.getAttribute('data-fill')?.includes('green') // Green for expansion
      );
      expect(expansionArea).toBeInTheDocument();
    });

    it('sets appropriate opacity for transition areas', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showTransitionAreas={true}
        />
      );
      
      const referenceAreas = screen.getAllByTestId('reference-area');
      expect(referenceAreas[0]).toHaveAttribute('data-fill-opacity');
    });

    it('spans correct duration for multi-period transitions', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showTransitionAreas={true}
        />
      );
      
      const referenceAreas = screen.getAllByTestId('reference-area');
      const longTransition = referenceAreas.find(area => {
        const x1 = parseInt(area.getAttribute('data-x1') || '0');
        const x2 = parseInt(area.getAttribute('data-x2') || '0');
        return (x2 - x1) > 1; // Multi-period transition
      });
      expect(longTransition).toBeInTheDocument();
    });
  });

  describe('Transition Labels', () => {
    it('shows transition labels when enabled', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showTransitionLabels={true}
        />
      );
      
      expect(screen.getByText(/stable → expansion/i)).toBeInTheDocument();
    });

    it('displays correct phase transition names', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showTransitionLabels={true}
        />
      );
      
      expect(screen.getByText(/expansion → stable/i)).toBeInTheDocument();
      expect(screen.getByText(/stable → contraction/i)).toBeInTheDocument();
    });

    it('includes confidence percentage in labels', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showTransitionLabels={true}
          showConfidenceIndicators={true}
        />
      );
      
      expect(screen.getByText(/85%/)).toBeInTheDocument();
      expect(screen.getByText(/91%/)).toBeInTheDocument();
    });

    it('positions labels based on annotation position setting', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showTransitionLabels={true}
          annotationPosition="top"
        />
      );
      
      // Labels should be positioned at top
      expect(screen.getByText(/stable → expansion/i)).toBeInTheDocument();
    });
  });

  describe('Confidence Indicators', () => {
    it('displays confidence indicators when enabled', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showConfidenceIndicators={true}
        />
      );
      
      expect(screen.getByText(/confidence/i)).toBeInTheDocument();
    });

    it('shows different visual styles for confidence levels', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showConfidenceIndicators={true}
        />
      );
      
      // High confidence (85%+) should have different styling
      expect(screen.getByText(/91%/)).toBeInTheDocument();
      expect(screen.getByText(/72%/)).toBeInTheDocument();
    });

    it('applies confidence-based opacity to markers', () => {
      const { container } = render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showTransitionLines={true}
          showConfidenceIndicators={true}
        />
      );
      
      // Lower confidence should result in lower opacity
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Impact Metrics', () => {
    it('displays impact metrics when enabled', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showImpactMetrics={true}
        />
      );
      
      expect(screen.getByText(/revenue/i)).toBeInTheDocument();
      expect(screen.getByText(/profitability/i)).toBeInTheDocument();
    });

    it('shows percentage impact values', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showImpactMetrics={true}
        />
      );
      
      expect(screen.getByText(/15.5%/)).toBeInTheDocument(); // Revenue impact
      expect(screen.getByText(/-18.5%/)).toBeInTheDocument(); // Negative impact
    });

    it('color codes positive and negative impacts', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showImpactMetrics={true}
        />
      );
      
      const positiveImpact = screen.getByText(/15.5%/);
      const negativeImpact = screen.getByText(/-18.5%/);
      
      expect(positiveImpact).toHaveClass('text-green-600');
      expect(negativeImpact).toHaveClass('text-red-600');
    });
  });

  describe('Detailed Annotations', () => {
    it('shows detailed annotations when enabled', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showDetailedAnnotations={true}
        />
      );
      
      expect(screen.getByText(/Strong product launch/i)).toBeInTheDocument();
      expect(screen.getByText(/Economic downturn/i)).toBeInTheDocument();
    });

    it('displays all annotation notes for transitions', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showDetailedAnnotations={true}
        />
      );
      
      expect(screen.getByText(/New product line launched/i)).toBeInTheDocument();
      expect(screen.getByText(/Market share increased/i)).toBeInTheDocument();
      expect(screen.getByText(/Global recession impact/i)).toBeInTheDocument();
    });

    it('shows trigger type for each transition', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showDetailedAnnotations={true}
        />
      );
      
      expect(screen.getByText(/fundamental/i)).toBeInTheDocument();
      expect(screen.getByText(/external/i)).toBeInTheDocument();
    });

    it('includes severity indicators', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showDetailedAnnotations={true}
        />
      );
      
      expect(screen.getByText(/major/i)).toBeInTheDocument();
      expect(screen.getByText(/moderate/i)).toBeInTheDocument();
    });
  });

  describe('Interactive Features', () => {
    it('enables transition tooltips when specified', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          enableTransitionTooltips={true}
        />
      );
      
      const transitionElement = screen.getByTestId('phase-transition-markers');
      expect(transitionElement).toHaveAttribute('data-tooltip-enabled', 'true');
    });

    it('calls onTransitionHover when hovering over transitions', async () => {
      const handleTransitionHover = jest.fn();
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          onTransitionHover={handleTransitionHover}
        />
      );
      
      const transitionMarker = screen.getAllByTestId('transition-marker')[0];
      fireEvent.mouseEnter(transitionMarker);
      
      await waitFor(() => {
        expect(handleTransitionHover).toHaveBeenCalledWith(mockTransitions[0]);
      });
      
      fireEvent.mouseLeave(transitionMarker);
      await waitFor(() => {
        expect(handleTransitionHover).toHaveBeenCalledWith(null);
      });
    });

    it('calls onTransitionClick when clicking transitions', () => {
      const handleTransitionClick = jest.fn();
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          enableTransitionClick={true}
          onTransitionClick={handleTransitionClick}
        />
      );
      
      const transitionMarker = screen.getAllByTestId('transition-marker')[0];
      fireEvent.click(transitionMarker);
      
      expect(handleTransitionClick).toHaveBeenCalledWith(mockTransitions[0]);
    });

    it('calls onAnnotationClick when clicking annotation notes', () => {
      const handleAnnotationClick = jest.fn();
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          showDetailedAnnotations={true}
          onAnnotationClick={handleAnnotationClick}
        />
      );
      
      const annotation = screen.getByText(/New product line launched/i);
      fireEvent.click(annotation);
      
      expect(handleAnnotationClick).toHaveBeenCalledWith(
        mockTransitions[0], 
        'New product line launched'
      );
    });
  });

  describe('Recent Transition Highlighting', () => {
    it('highlights recent transitions when enabled', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          highlightRecentTransitions={true}
        />
      );
      
      const recentTransition = screen.getByTestId('recent-transition');
      expect(recentTransition).toBeInTheDocument();
    });

    it('applies special styling to recent transitions', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          highlightRecentTransitions={true}
        />
      );
      
      const recentTransition = screen.getByTestId('recent-transition');
      expect(recentTransition).toHaveClass('ring-2', 'ring-blue-500');
    });

    it('shows "NEW" badge for very recent transitions', () => {
      const recentTransitions = [
        {
          ...mockTransitions[0],
          transitionDate: 'Q4 FY24', // Recent date
        }
      ];
      
      render(
        <PhaseTransitionMarkers 
          transitions={recentTransitions}
          chartData={mockChartData}
          highlightRecentTransitions={true}
        />
      );
      
      expect(screen.getByText(/new/i)).toBeInTheDocument();
    });
  });

  describe('Compact Mode', () => {
    it('renders in compact layout when enabled', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          compactMode={true}
        />
      );
      
      const container = screen.getByTestId('phase-transition-markers');
      expect(container).toHaveClass('compact');
    });

    it('hides detailed annotations in compact mode', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          compactMode={true}
          showDetailedAnnotations={true}
        />
      );
      
      // Should not show detailed annotations in compact mode
      expect(screen.queryByText(/Strong product launch and market expansion/i)).not.toBeInTheDocument();
    });

    it('shows simplified labels in compact mode', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          compactMode={true}
          showTransitionLabels={true}
        />
      );
      
      // Should show simplified transition labels
      expect(screen.getByText(/→/)).toBeInTheDocument();
    });
  });

  describe('Performance Considerations', () => {
    it('handles large number of transitions efficiently', () => {
      const manyTransitions = Array.from({ length: 50 }, (_, i) => ({
        ...mockTransitions[0],
        transitionIndex: i,
        transitionDate: `Q${(i % 4) + 1} FY${Math.floor(i / 4) + 20}`
      }));
      
      const startTime = performance.now();
      render(
        <PhaseTransitionMarkers 
          transitions={manyTransitions}
          chartData={mockChartData}
        />
      );
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('memoizes expensive transition calculations', () => {
      const { rerender } = render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
        />
      );
      
      const startTime = performance.now();
      rerender(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
        />
      );
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(50);
    });

    it('optimizes rendering for overlapping transitions', () => {
      const overlappingTransitions = [
        { ...mockTransitions[0], transitionIndex: 2 },
        { ...mockTransitions[1], transitionIndex: 2 }, // Same index
      ];
      
      render(
        <PhaseTransitionMarkers 
          transitions={overlappingTransitions}
          chartData={mockChartData}
          showTransitionLines={true}
        />
      );
      
      // Should handle overlapping transitions gracefully
      expect(screen.getAllByTestId('reference-line')).toHaveLength(2);
    });
  });

  describe('Accessibility Features', () => {
    it('provides ARIA labels for transitions', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
        />
      );
      
      const transitionMarker = screen.getAllByTestId('transition-marker')[0];
      expect(transitionMarker).toHaveAttribute('aria-label');
    });

    it('supports keyboard navigation', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
          enableTransitionClick={true}
        />
      );
      
      const transitionMarker = screen.getAllByTestId('transition-marker')[0];
      expect(transitionMarker).toHaveAttribute('tabIndex', '0');
    });

    it('provides descriptive text for screen readers', () => {
      render(
        <PhaseTransitionMarkers 
          transitions={mockTransitions}
          chartData={mockChartData}
        />
      );
      
      expect(screen.getByText(/phase transition/i)).toBeInTheDocument();
    });
  });
}); 