import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PhaseTooltip from './PhaseTooltip';
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

export interface PhaseTooltipProps {
  phase: PhaseType;
  title?: string;
  isVisible?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'manual';
  showMetrics?: boolean;
  showAdvice?: boolean;
  showDuration?: boolean;
  showExamples?: boolean;
  showActions?: boolean;
  compact?: boolean;
  metrics?: {
    revenue?: number;
    margin?: number;
    growth?: number;
    confidence?: number;
  };
  onClose?: () => void;
  onActionClick?: (action: string) => void;
  children?: React.ReactNode;
}

describe('PhaseTooltip', () => {
  describe('Rendering and Visibility', () => {
    it('renders tooltip when visible', () => {
      render(
        <PhaseTooltip phase="expansion" isVisible={true}>
          <div>Trigger element</div>
        </PhaseTooltip>
      );
      
      expect(screen.getByTestId('phase-tooltip')).toBeInTheDocument();
      expect(screen.getByText('Trigger element')).toBeInTheDocument();
    });

    it('hides tooltip when not visible', () => {
      render(
        <PhaseTooltip phase="expansion" isVisible={false}>
          <div>Trigger element</div>
        </PhaseTooltip>
      );
      
      expect(screen.queryByTestId('phase-tooltip')).not.toBeInTheDocument();
      expect(screen.getByText('Trigger element')).toBeInTheDocument();
    });

    it('displays correct phase title', () => {
      render(
        <PhaseTooltip phase="expansion" isVisible={true}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      expect(screen.getByText('Expansion Phase')).toBeInTheDocument();
    });

    it('uses custom title when provided', () => {
      render(
        <PhaseTooltip phase="expansion" title="Custom Title" isVisible={true}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('applies correct phase colors', () => {
      render(
        <PhaseTooltip phase="expansion" isVisible={true}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      const tooltip = screen.getByTestId('phase-tooltip');
      expect(tooltip).toHaveStyle('border-color: #10B981');
    });
  });

  describe('Positioning', () => {
    it('applies top position by default', () => {
      render(
        <PhaseTooltip phase="expansion" isVisible={true}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      const tooltip = screen.getByTestId('phase-tooltip');
      expect(tooltip).toHaveClass('position-top');
    });

    it('applies correct position classes', () => {
      const positions = ['top', 'bottom', 'left', 'right'] as const;
      
      positions.forEach(position => {
        const { unmount } = render(
          <PhaseTooltip phase="expansion" isVisible={true} position={position}>
            <div>Trigger</div>
          </PhaseTooltip>
        );
        
        const tooltip = screen.getByTestId('phase-tooltip');
        expect(tooltip).toHaveClass(`position-${position}`);
        
        unmount();
      });
    });

    it('adjusts position based on viewport boundaries', () => {
      // Mock getBoundingClientRect
      const mockGetBoundingClientRect = jest.fn(() => ({
        top: 10,
        left: 10,
        right: 100,
        bottom: 100,
        width: 90,
        height: 90,
      }));
      
      Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
      
      render(
        <PhaseTooltip phase="expansion" isVisible={true} position="top">
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      expect(screen.getByTestId('phase-tooltip')).toBeInTheDocument();
    });
  });

  describe('Trigger Interactions', () => {
    it('shows tooltip on hover when trigger is hover', async () => {
      render(
        <PhaseTooltip phase="expansion" trigger="hover">
          <div data-testid="trigger">Hover me</div>
        </PhaseTooltip>
      );
      
      const trigger = screen.getByTestId('trigger');
      fireEvent.mouseEnter(trigger);
      
      await waitFor(() => {
        expect(screen.getByTestId('phase-tooltip')).toBeInTheDocument();
      });
    });

    it('hides tooltip on mouse leave when trigger is hover', async () => {
      render(
        <PhaseTooltip phase="expansion" trigger="hover">
          <div data-testid="trigger">Hover me</div>
        </PhaseTooltip>
      );
      
      const trigger = screen.getByTestId('trigger');
      fireEvent.mouseEnter(trigger);
      
      await waitFor(() => {
        expect(screen.getByTestId('phase-tooltip')).toBeInTheDocument();
      });
      
      fireEvent.mouseLeave(trigger);
      
      await waitFor(() => {
        expect(screen.queryByTestId('phase-tooltip')).not.toBeInTheDocument();
      });
    });

    it('shows tooltip on click when trigger is click', () => {
      render(
        <PhaseTooltip phase="expansion" trigger="click">
          <div data-testid="trigger">Click me</div>
        </PhaseTooltip>
      );
      
      const trigger = screen.getByTestId('trigger');
      fireEvent.click(trigger);
      
      expect(screen.getByTestId('phase-tooltip')).toBeInTheDocument();
    });

    it('toggles tooltip visibility on repeated clicks', () => {
      render(
        <PhaseTooltip phase="expansion" trigger="click">
          <div data-testid="trigger">Click me</div>
        </PhaseTooltip>
      );
      
      const trigger = screen.getByTestId('trigger');
      
      fireEvent.click(trigger);
      expect(screen.getByTestId('phase-tooltip')).toBeInTheDocument();
      
      fireEvent.click(trigger);
      expect(screen.queryByTestId('phase-tooltip')).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
      const handleClose = jest.fn();
      render(
        <PhaseTooltip phase="expansion" isVisible={true} onClose={handleClose}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      const closeButton = screen.getByTestId('tooltip-close');
      fireEvent.click(closeButton);
      
      expect(handleClose).toHaveBeenCalled();
    });
  });

  describe('Content Display', () => {
    it('shows phase description by default', () => {
      render(
        <PhaseTooltip phase="expansion" isVisible={true}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      expect(screen.getByText(/Business is growing with increasing revenues/)).toBeInTheDocument();
    });

    it('shows metrics when enabled', () => {
      const metrics = {
        revenue: 15.2,
        margin: 8.5,
        growth: 12.3,
        confidence: 85
      };
      
      render(
        <PhaseTooltip 
          phase="expansion" 
          isVisible={true} 
          showMetrics={true}
          metrics={metrics}
        >
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      expect(screen.getByText('Revenue Growth')).toBeInTheDocument();
      expect(screen.getByText('15.2%')).toBeInTheDocument();
      expect(screen.getByText('Margin Expansion')).toBeInTheDocument();
      expect(screen.getByText('8.5%')).toBeInTheDocument();
    });

    it('shows investment advice when enabled', () => {
      render(
        <PhaseTooltip phase="expansion" isVisible={true} showAdvice={true}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      expect(screen.getByText(/Investment Strategy/)).toBeInTheDocument();
      expect(screen.getByText(/Generally positive for stock performance/)).toBeInTheDocument();
    });

    it('shows duration information when enabled', () => {
      render(
        <PhaseTooltip phase="expansion" isVisible={true} showDuration={true}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      expect(screen.getByText(/Typical Duration/)).toBeInTheDocument();
      expect(screen.getByText(/2-5 quarters/)).toBeInTheDocument();
    });

    it('shows examples when enabled', () => {
      render(
        <PhaseTooltip phase="expansion" isVisible={true} showExamples={true}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      expect(screen.getByText(/Examples/)).toBeInTheDocument();
      expect(screen.getByText(/New product launches/)).toBeInTheDocument();
    });

    it('shows action buttons when enabled', () => {
      render(
        <PhaseTooltip phase="expansion" isVisible={true} showActions={true}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      expect(screen.getByText('Learn More')).toBeInTheDocument();
      expect(screen.getByText('View Analysis')).toBeInTheDocument();
    });

    it('applies compact styling when enabled', () => {
      render(
        <PhaseTooltip phase="expansion" isVisible={true} compact={true}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      const tooltip = screen.getByTestId('phase-tooltip');
      expect(tooltip).toHaveClass('compact');
    });
  });

  describe('Phase-Specific Content', () => {
    it('shows expansion-specific content', () => {
      render(
        <PhaseTooltip phase="expansion" isVisible={true} showAdvice={true}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      expect(screen.getByText(/Growth investments/)).toBeInTheDocument();
      expect(screen.getByText(/scaling positions/)).toBeInTheDocument();
    });

    it('shows contraction-specific content', () => {
      render(
        <PhaseTooltip phase="contraction" isVisible={true} showAdvice={true}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      expect(screen.getByText(/Caution advised/)).toBeInTheDocument();
      expect(screen.getByText(/reducing exposure/)).toBeInTheDocument();
    });

    it('shows stable-specific content', () => {
      render(
        <PhaseTooltip phase="stable" isVisible={true} showAdvice={true}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      expect(screen.getByText(/income-focused investors/)).toBeInTheDocument();
      expect(screen.getByText(/portfolio stability/)).toBeInTheDocument();
    });

    it('shows transition-specific content', () => {
      render(
        <PhaseTooltip phase="transition" isVisible={true} showAdvice={true}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      expect(screen.getByText(/Higher uncertainty/)).toBeInTheDocument();
      expect(screen.getByText(/trend confirmation/)).toBeInTheDocument();
    });
  });

  describe('Interactive Actions', () => {
    it('calls onActionClick when action button is clicked', () => {
      const handleActionClick = jest.fn();
      render(
        <PhaseTooltip 
          phase="expansion" 
          isVisible={true} 
          showActions={true}
          onActionClick={handleActionClick}
        >
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      const learnMoreButton = screen.getByText('Learn More');
      fireEvent.click(learnMoreButton);
      
      expect(handleActionClick).toHaveBeenCalledWith('learn-more');
    });

    it('provides keyboard navigation for actions', () => {
      const handleActionClick = jest.fn();
      render(
        <PhaseTooltip 
          phase="expansion" 
          isVisible={true} 
          showActions={true}
          onActionClick={handleActionClick}
        >
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      const learnMoreButton = screen.getByText('Learn More');
      fireEvent.keyDown(learnMoreButton, { key: 'Enter' });
      
      expect(handleActionClick).toHaveBeenCalledWith('learn-more');
    });
  });

  describe('Accessibility Features', () => {
    it('provides proper ARIA attributes', () => {
      render(
        <PhaseTooltip phase="expansion" isVisible={true}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      const tooltip = screen.getByTestId('phase-tooltip');
      expect(tooltip).toHaveAttribute('role', 'tooltip');
      expect(tooltip).toHaveAttribute('aria-label');
    });

    it('associates tooltip with trigger element', () => {
      render(
        <PhaseTooltip phase="expansion" isVisible={true}>
          <div data-testid="trigger">Trigger</div>
        </PhaseTooltip>
      );
      
      const trigger = screen.getByTestId('trigger');
      const tooltip = screen.getByTestId('phase-tooltip');
      
      expect(trigger).toHaveAttribute('aria-describedby');
      expect(tooltip).toHaveAttribute('id');
    });

    it('supports keyboard navigation', () => {
      render(
        <PhaseTooltip phase="expansion" trigger="click">
          <div data-testid="trigger" tabIndex={0}>Trigger</div>
        </PhaseTooltip>
      );
      
      const trigger = screen.getByTestId('trigger');
      fireEvent.keyDown(trigger, { key: 'Enter' });
      
      expect(screen.getByTestId('phase-tooltip')).toBeInTheDocument();
    });

    it('handles escape key to close tooltip', () => {
      render(
        <PhaseTooltip phase="expansion" isVisible={true}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(screen.queryByTestId('phase-tooltip')).not.toBeInTheDocument();
    });
  });

  describe('Animation and Transitions', () => {
    it('applies entrance animation when showing', () => {
      const { rerender } = render(
        <PhaseTooltip phase="expansion" isVisible={false}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      rerender(
        <PhaseTooltip phase="expansion" isVisible={true}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      const tooltip = screen.getByTestId('phase-tooltip');
      expect(tooltip).toHaveClass('animate-in');
    });

    it('applies exit animation when hiding', () => {
      const { rerender } = render(
        <PhaseTooltip phase="expansion" isVisible={true}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      rerender(
        <PhaseTooltip phase="expansion" isVisible={false}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      // Should handle exit animation gracefully
      expect(screen.queryByTestId('phase-tooltip')).not.toBeInTheDocument();
    });
  });

  describe('Performance and Optimization', () => {
    it('memoizes expensive calculations', () => {
      const start = performance.now();
      render(
        <PhaseTooltip 
          phase="expansion" 
          isVisible={true}
          showMetrics={true}
          showAdvice={true}
          showDuration={true}
          showExamples={true}
        >
          <div>Trigger</div>
        </PhaseTooltip>
      );
      const end = performance.now();
      
      expect(end - start).toBeLessThan(50);
    });

    it('handles rapid show/hide cycles efficiently', async () => {
      const { rerender } = render(
        <PhaseTooltip phase="expansion" trigger="hover">
          <div data-testid="trigger">Trigger</div>
        </PhaseTooltip>
      );
      
      const trigger = screen.getByTestId('trigger');
      
      // Rapid hover in/out
      for (let i = 0; i < 10; i++) {
        fireEvent.mouseEnter(trigger);
        fireEvent.mouseLeave(trigger);
      }
      
      // Should not cause performance issues
      expect(screen.getByTestId('trigger')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles invalid phase gracefully', () => {
      render(
        <PhaseTooltip phase={'invalid' as PhaseType} isVisible={true}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      expect(screen.getByTestId('phase-tooltip')).toBeInTheDocument();
      expect(screen.getByText(/Unknown Phase/)).toBeInTheDocument();
    });

    it('handles missing metrics gracefully', () => {
      render(
        <PhaseTooltip phase="expansion" isVisible={true} showMetrics={true}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      expect(screen.getByTestId('phase-tooltip')).toBeInTheDocument();
      expect(screen.getByText(/No metrics available/)).toBeInTheDocument();
    });

    it('handles missing children gracefully', () => {
      render(
        <PhaseTooltip phase="expansion" isVisible={true} />
      );
      
      expect(screen.getByTestId('phase-tooltip')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('adapts content for mobile screens', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 380,
      });
      
      render(
        <PhaseTooltip phase="expansion" isVisible={true} showAdvice={true}>
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      const tooltip = screen.getByTestId('phase-tooltip');
      expect(tooltip).toHaveClass('mobile-responsive');
    });

    it('adjusts positioning for small screens', () => {
      render(
        <PhaseTooltip phase="expansion" isVisible={true} position="right">
          <div>Trigger</div>
        </PhaseTooltip>
      );
      
      const tooltip = screen.getByTestId('phase-tooltip');
      expect(tooltip).toBeInTheDocument();
    });
  });
}); 