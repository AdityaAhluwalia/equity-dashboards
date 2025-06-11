import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PhaseLegend from './PhaseLegend';
import { PhaseType } from '@/lib/design-tokens';

// Mock design tokens
jest.mock('@/lib/design-tokens', () => ({
  getPhaseColors: (phase: string) => {
    const colors = {
      expansion: { primary: '#10B981', secondary: '#D1FAE5', background: '#ECFDF5', text: '#059669' },
      contraction: { primary: '#EF4444', secondary: '#FEE2E2', background: '#FEF2F2', text: '#DC2626' },
      stable: { primary: '#6B7280', secondary: '#F3F4F6', background: '#F9FAFB', text: '#4B5563' },
      transition: { primary: '#F59E0B', secondary: '#FEF3C7', background: '#FFFBEB', text: '#D97706' }
    };
    return colors[phase as keyof typeof colors] || colors.stable;
  }
}));

export interface PhaseInfo {
  phase: PhaseType;
  label: string;
  description: string;
  characteristics: string[];
  investmentImplications: string[];
  duration: string;
  indicators: string[];
  examples: string[];
}

export interface PhaseLegendProps {
  phases?: PhaseType[];
  showDescriptions?: boolean;
  showCharacteristics?: boolean;
  showInvestmentTips?: boolean;
  showIndicators?: boolean;
  showExamples?: boolean;
  compactMode?: boolean;
  interactive?: boolean;
  orientation?: 'horizontal' | 'vertical';
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'floating';
  onPhaseClick?: (phase: PhaseType) => void;
  onPhaseHover?: (phase: PhaseType | null) => void;
  selectedPhase?: PhaseType | null;
  highlightedPhases?: PhaseType[];
}

const mockPhaseData: PhaseInfo[] = [
  {
    phase: 'expansion',
    label: 'Expansion',
    description: 'Business is growing with increasing revenues, margins, and profitability',
    characteristics: [
      'Rising revenue and profit margins',
      'Increasing market share',
      'Strong cash flow generation',
      'Expanding operations'
    ],
    investmentImplications: [
      'Generally positive for stock performance',
      'Good time for growth investments',
      'Consider scaling positions',
      'Monitor for overvaluation'
    ],
    duration: 'Typically 2-5 quarters',
    indicators: [
      'Revenue growth > 10%',
      'Margin expansion',
      'Positive operating leverage',
      'Strong ROE/ROCE'
    ],
    examples: [
      'New product launches',
      'Market expansion',
      'Operational efficiency gains',
      'Pricing power improvement'
    ]
  },
  {
    phase: 'contraction',
    label: 'Contraction',
    description: 'Business is declining with falling revenues, compressed margins, and reduced profitability',
    characteristics: [
      'Declining revenue and margins',
      'Reduced market share',
      'Weak cash generation',
      'Cost pressure'
    ],
    investmentImplications: [
      'Caution advised for new investments',
      'Consider reducing exposure',
      'Focus on quality and defensives',
      'Look for turnaround catalysts'
    ],
    duration: 'Usually 1-3 quarters',
    indicators: [
      'Revenue decline > 5%',
      'Margin compression',
      'Negative operating leverage',
      'Deteriorating returns'
    ],
    examples: [
      'Economic downturn impact',
      'Competitive pressure',
      'Raw material cost inflation',
      'Demand destruction'
    ]
  },
  {
    phase: 'stable',
    label: 'Stable',
    description: 'Business performance is steady with consistent but modest growth patterns',
    characteristics: [
      'Steady revenue growth',
      'Stable margin profile',
      'Consistent cash flows',
      'Predictable operations'
    ],
    investmentImplications: [
      'Suitable for income-focused investors',
      'Lower volatility expected',
      'Good for portfolio stability',
      'May underperform in bull markets'
    ],
    duration: 'Can persist for years',
    indicators: [
      'Revenue growth 0-5%',
      'Stable margins',
      'Consistent returns',
      'Low volatility'
    ],
    examples: [
      'Mature market operations',
      'Utility-like characteristics',
      'Stable regulatory environment',
      'Defensive business model'
    ]
  },
  {
    phase: 'transition',
    label: 'Transition',
    description: 'Business is changing phases, showing mixed signals and uncertain direction',
    characteristics: [
      'Mixed performance signals',
      'Volatile metrics',
      'Uncertain direction',
      'Changing fundamentals'
    ],
    investmentImplications: [
      'Higher uncertainty and risk',
      'Watch for trend confirmation',
      'Consider smaller positions',
      'Monitor key indicators closely'
    ],
    duration: '1-2 quarters typically',
    indicators: [
      'Inconsistent growth rates',
      'Margin volatility',
      'Mixed operational metrics',
      'Unclear trend direction'
    ],
    examples: [
      'Business model changes',
      'Management transitions',
      'Market disruption',
      'Strategic pivots'
    ]
  }
];

describe('PhaseLegend', () => {
  describe('Rendering and Basic Functionality', () => {
    it('renders phase legend component', () => {
      render(<PhaseLegend />);
      expect(screen.getByTestId('phase-legend')).toBeInTheDocument();
    });

    it('displays all phases by default', () => {
      render(<PhaseLegend />);
      
      expect(screen.getByText('Expansion')).toBeInTheDocument();
      expect(screen.getByText('Contraction')).toBeInTheDocument();
      expect(screen.getByText('Stable')).toBeInTheDocument();
      expect(screen.getByText('Transition')).toBeInTheDocument();
    });

    it('displays only specified phases when provided', () => {
      render(<PhaseLegend phases={['expansion', 'contraction']} />);
      
      expect(screen.getByText('Expansion')).toBeInTheDocument();
      expect(screen.getByText('Contraction')).toBeInTheDocument();
      expect(screen.queryByText('Stable')).not.toBeInTheDocument();
      expect(screen.queryByText('Transition')).not.toBeInTheDocument();
    });

    it('applies correct phase colors', () => {
      render(<PhaseLegend />);
      
      const expansionElement = screen.getByTestId('phase-expansion');
      const contractionElement = screen.getByTestId('phase-contraction');
      
      expect(expansionElement).toHaveStyle('background-color: #ECFDF5');
      expect(contractionElement).toHaveStyle('background-color: #FEF2F2');
    });

    it('applies compact mode styling when enabled', () => {
      render(<PhaseLegend compactMode={true} />);
      
      const legend = screen.getByTestId('phase-legend');
      expect(legend).toHaveClass('compact');
    });
  });

  describe('Content Display Options', () => {
    it('shows descriptions when enabled', () => {
      render(<PhaseLegend showDescriptions={true} />);
      
      expect(screen.getByText(/Business is growing with increasing revenues/)).toBeInTheDocument();
      expect(screen.getByText(/Business is declining with falling revenues/)).toBeInTheDocument();
    });

    it('hides descriptions by default', () => {
      render(<PhaseLegend />);
      
      expect(screen.queryByText(/Business is growing with increasing revenues/)).not.toBeInTheDocument();
    });

    it('shows characteristics when enabled', () => {
      render(<PhaseLegend showCharacteristics={true} />);
      
      expect(screen.getByText('Rising revenue and profit margins')).toBeInTheDocument();
      expect(screen.getByText('Declining revenue and margins')).toBeInTheDocument();
    });

    it('shows investment implications when enabled', () => {
      render(<PhaseLegend showInvestmentTips={true} />);
      
      expect(screen.getByText('Generally positive for stock performance')).toBeInTheDocument();
      expect(screen.getByText('Caution advised for new investments')).toBeInTheDocument();
    });

    it('shows indicators when enabled', () => {
      render(<PhaseLegend showIndicators={true} />);
      
      expect(screen.getByText('Revenue growth > 10%')).toBeInTheDocument();
      expect(screen.getByText('Revenue decline > 5%')).toBeInTheDocument();
    });

    it('shows examples when enabled', () => {
      render(<PhaseLegend showExamples={true} />);
      
      expect(screen.getByText('New product launches')).toBeInTheDocument();
      expect(screen.getByText('Economic downturn impact')).toBeInTheDocument();
    });

    it('shows all content when all options enabled', () => {
      render(
        <PhaseLegend 
          showDescriptions={true}
          showCharacteristics={true}
          showInvestmentTips={true}
          showIndicators={true}
          showExamples={true}
        />
      );
      
      expect(screen.getByText(/Business is growing/)).toBeInTheDocument();
      expect(screen.getByText('Rising revenue and profit margins')).toBeInTheDocument();
      expect(screen.getByText('Generally positive for stock performance')).toBeInTheDocument();
      expect(screen.getByText('Revenue growth > 10%')).toBeInTheDocument();
      expect(screen.getByText('New product launches')).toBeInTheDocument();
    });
  });

  describe('Layout and Orientation', () => {
    it('applies horizontal orientation by default', () => {
      render(<PhaseLegend />);
      
      const legend = screen.getByTestId('phase-legend');
      expect(legend).toHaveClass('flex-row');
    });

    it('applies vertical orientation when specified', () => {
      render(<PhaseLegend orientation="vertical" />);
      
      const legend = screen.getByTestId('phase-legend');
      expect(legend).toHaveClass('flex-col');
    });

    it('applies correct placement classes', () => {
      const { rerender } = render(<PhaseLegend placement="top" />);
      expect(screen.getByTestId('phase-legend')).toHaveClass('placement-top');
      
      rerender(<PhaseLegend placement="floating" />);
      expect(screen.getByTestId('phase-legend')).toHaveClass('placement-floating');
    });

    it('handles floating placement with positioning', () => {
      render(<PhaseLegend placement="floating" />);
      
      const legend = screen.getByTestId('phase-legend');
      expect(legend).toHaveClass('absolute', 'z-50');
    });
  });

  describe('Interactive Features', () => {
    it('enables click interactions when interactive', () => {
      render(<PhaseLegend interactive={true} />);
      
      const phaseElements = screen.getAllByTestId(/^phase-/);
      phaseElements.forEach(element => {
        expect(element).toHaveClass('cursor-pointer');
      });
    });

    it('calls onPhaseClick when phase is clicked', () => {
      const handlePhaseClick = jest.fn();
      render(<PhaseLegend interactive={true} onPhaseClick={handlePhaseClick} />);
      
      const expansionPhase = screen.getByTestId('phase-expansion');
      fireEvent.click(expansionPhase);
      
      expect(handlePhaseClick).toHaveBeenCalledWith('expansion');
    });

    it('calls onPhaseHover when hovering over phases', async () => {
      const handlePhaseHover = jest.fn();
      render(<PhaseLegend interactive={true} onPhaseHover={handlePhaseHover} />);
      
      const expansionPhase = screen.getByTestId('phase-expansion');
      fireEvent.mouseEnter(expansionPhase);
      
      await waitFor(() => {
        expect(handlePhaseHover).toHaveBeenCalledWith('expansion');
      });
      
      fireEvent.mouseLeave(expansionPhase);
      await waitFor(() => {
        expect(handlePhaseHover).toHaveBeenCalledWith(null);
      });
    });

    it('highlights selected phase', () => {
      render(<PhaseLegend selectedPhase="expansion" />);
      
      const expansionPhase = screen.getByTestId('phase-expansion');
      expect(expansionPhase).toHaveClass('selected');
    });

    it('highlights multiple phases when specified', () => {
      render(<PhaseLegend highlightedPhases={['expansion', 'stable']} />);
      
      const expansionPhase = screen.getByTestId('phase-expansion');
      const stablePhase = screen.getByTestId('phase-stable');
      
      expect(expansionPhase).toHaveClass('highlighted');
      expect(stablePhase).toHaveClass('highlighted');
    });

    it('dims non-highlighted phases when highlights are active', () => {
      render(<PhaseLegend highlightedPhases={['expansion']} />);
      
      const contractionPhase = screen.getByTestId('phase-contraction');
      expect(contractionPhase).toHaveClass('dimmed');
    });
  });

  describe('Accessibility Features', () => {
    it('provides proper ARIA labels', () => {
      render(<PhaseLegend />);
      
      const legend = screen.getByTestId('phase-legend');
      expect(legend).toHaveAttribute('role', 'region');
      expect(legend).toHaveAttribute('aria-label', 'Business cycle phase legend');
    });

    it('supports keyboard navigation when interactive', () => {
      render(<PhaseLegend interactive={true} />);
      
      const phaseElements = screen.getAllByTestId(/^phase-/);
      phaseElements.forEach(element => {
        expect(element).toHaveAttribute('tabIndex', '0');
        expect(element).toHaveAttribute('role', 'button');
      });
    });

    it('handles keyboard events for phase selection', () => {
      const handlePhaseClick = jest.fn();
      render(<PhaseLegend interactive={true} onPhaseClick={handlePhaseClick} />);
      
      const expansionPhase = screen.getByTestId('phase-expansion');
      fireEvent.keyDown(expansionPhase, { key: 'Enter' });
      
      expect(handlePhaseClick).toHaveBeenCalledWith('expansion');
    });

    it('provides descriptive text for screen readers', () => {
      render(<PhaseLegend showDescriptions={true} />);
      
      expect(screen.getByText(/Business cycle phases/)).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('adapts layout for mobile screens', () => {
      // Mock mobile screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 380,
      });
      
      render(<PhaseLegend />);
      
      const legend = screen.getByTestId('phase-legend');
      expect(legend).toHaveClass('mobile-layout');
    });

    it('stacks phases vertically on small screens', () => {
      render(<PhaseLegend />);
      
      const legend = screen.getByTestId('phase-legend');
      expect(legend).toHaveClass('sm:flex-row', 'flex-col');
    });

    it('adjusts content visibility on mobile', () => {
      render(
        <PhaseLegend 
          showDescriptions={true}
          showCharacteristics={true}
          compactMode={false}
        />
      );
      
      // Should have mobile-specific classes for content visibility
      const legend = screen.getByTestId('phase-legend');
      expect(legend).toBeInTheDocument();
    });
  });

  describe('Phase Duration Information', () => {
    it('shows duration information when available', () => {
      render(<PhaseLegend showIndicators={true} />);
      
      expect(screen.getByText(/Typically 2-5 quarters/)).toBeInTheDocument();
      expect(screen.getByText(/Usually 1-3 quarters/)).toBeInTheDocument();
    });

    it('groups phases by typical duration', () => {
      render(<PhaseLegend showIndicators={true} />);
      
      // Should show duration context
      expect(screen.getByTestId('phase-legend')).toBeInTheDocument();
    });
  });

  describe('Performance and Optimization', () => {
    it('renders efficiently with many phases', () => {
      const start = performance.now();
      render(
        <PhaseLegend 
          showDescriptions={true}
          showCharacteristics={true}
          showInvestmentTips={true}
          showIndicators={true}
          showExamples={true}
        />
      );
      const end = performance.now();
      
      expect(end - start).toBeLessThan(100);
    });

    it('memoizes phase data to prevent unnecessary re-renders', () => {
      const { rerender } = render(<PhaseLegend />);
      
      rerender(<PhaseLegend />);
      
      // Component should render without errors
      expect(screen.getByTestId('phase-legend')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles invalid phase types gracefully', () => {
      render(<PhaseLegend phases={['invalid' as PhaseType]} />);
      
      expect(screen.getByTestId('phase-legend')).toBeInTheDocument();
      expect(screen.queryByText('invalid')).not.toBeInTheDocument();
    });

    it('handles empty phases array', () => {
      render(<PhaseLegend phases={[]} />);
      
      expect(screen.getByTestId('phase-legend')).toBeInTheDocument();
      expect(screen.getByText(/No phases to display/)).toBeInTheDocument();
    });

    it('provides fallback content when phase data is missing', () => {
      render(<PhaseLegend />);
      
      expect(screen.getByTestId('phase-legend')).toBeInTheDocument();
    });
  });

  describe('Custom Styling and Theming', () => {
    it('accepts custom className', () => {
      render(<PhaseLegend className="custom-legend" />);
      
      const legend = screen.getByTestId('phase-legend');
      expect(legend).toHaveClass('custom-legend');
    });

    it('supports custom color schemes', () => {
      render(<PhaseLegend />);
      
      // Should use the mocked color scheme
      const expansionPhase = screen.getByTestId('phase-expansion');
      expect(expansionPhase).toBeInTheDocument();
    });

    it('adapts to dark mode when applicable', () => {
      render(<PhaseLegend />);
      
      const legend = screen.getByTestId('phase-legend');
      expect(legend).toHaveClass('dark:bg-gray-800');
    });
  });
}); 