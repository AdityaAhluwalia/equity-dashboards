import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PhaseIndicator from './PhaseIndicator';
import { PhaseType } from '@/lib/design-tokens';

describe('PhaseIndicator', () => {
  describe('Phase Display', () => {
    it('renders expansion phase correctly', () => {
      render(<PhaseIndicator phase="expansion" />);
      
      expect(screen.getByText('Expansion')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /expansion phase/i })).toBeInTheDocument();
    });

    it('renders contraction phase correctly', () => {
      render(<PhaseIndicator phase="contraction" />);
      
      expect(screen.getByText('Contraction')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /contraction phase/i })).toBeInTheDocument();
    });

    it('renders transition phase correctly', () => {
      render(<PhaseIndicator phase="transition" />);
      
      expect(screen.getByText('Transition')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /transition phase/i })).toBeInTheDocument();
    });

    it('renders stable phase correctly', () => {
      render(<PhaseIndicator phase="stable" />);
      
      expect(screen.getByText('Stable')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /stable phase/i })).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('applies small size classes correctly', () => {
      const { container } = render(<PhaseIndicator phase="expansion" size="small" />);
      const indicator = container.firstChild as HTMLElement;
      
      expect(indicator).toHaveClass('px-2', 'py-1', 'text-xs');
    });

    it('applies medium size classes correctly (default)', () => {
      const { container } = render(<PhaseIndicator phase="expansion" />);
      const indicator = container.firstChild as HTMLElement;
      
      expect(indicator).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('applies large size classes correctly', () => {
      const { container } = render(<PhaseIndicator phase="expansion" size="large" />);
      const indicator = container.firstChild as HTMLElement;
      
      expect(indicator).toHaveClass('px-4', 'py-2', 'text-base');
    });
  });

  describe('Text Display Options', () => {
    it('shows text by default', () => {
      render(<PhaseIndicator phase="expansion" />);
      
      expect(screen.getByText('Expansion')).toBeInTheDocument();
    });

    it('hides text when showText is false', () => {
      render(<PhaseIndicator phase="expansion" showText={false} />);
      
      expect(screen.queryByText('Expansion')).not.toBeInTheDocument();
      expect(screen.getByRole('img', { name: /expansion phase/i })).toBeInTheDocument();
    });

    it('shows text when showText is explicitly true', () => {
      render(<PhaseIndicator phase="expansion" showText={true} />);
      
      expect(screen.getByText('Expansion')).toBeInTheDocument();
    });
  });

  describe('Styling and Interaction', () => {
    it('applies base styling classes', () => {
      const { container } = render(<PhaseIndicator phase="expansion" />);
      const indicator = container.firstChild as HTMLElement;
      
      expect(indicator).toHaveClass(
        'inline-flex',
        'items-center',
        'gap-1.5', 
        'rounded-full',
        'font-medium',
        'transition-all',
        'duration-200',
        'hover:scale-105'
      );
    });

    it('applies inline styles for phase colors', () => {
      const { container } = render(<PhaseIndicator phase="expansion" />);
      const indicator = container.firstChild as HTMLElement;
      
      expect(indicator).toHaveStyle('border-width: 1px');
      // Note: We can't easily test CSS custom properties in jest, 
      // but we verify the style attribute is applied
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels for icons', () => {
      render(<PhaseIndicator phase="expansion" />);
      
      expect(screen.getByRole('img', { name: 'expansion phase' })).toBeInTheDocument();
    });

    it('maintains accessibility when text is hidden', () => {
      render(<PhaseIndicator phase="contraction" showText={false} />);
      
      expect(screen.getByRole('img', { name: 'contraction phase' })).toBeInTheDocument();
    });
  });

  describe('All Phase Types', () => {
    const phases: PhaseType[] = ['expansion', 'contraction', 'transition', 'stable'];
    const expectedIcons = ['↗️', '↘️', '↔️', '→'];
    const expectedLabels = ['Expansion', 'Contraction', 'Transition', 'Stable'];

    phases.forEach((phase, index) => {
      it(`renders ${phase} phase with correct icon and label`, () => {
        render(<PhaseIndicator phase={phase} />);
        
        expect(screen.getByText(expectedLabels[index])).toBeInTheDocument();
        expect(screen.getByRole('img', { name: `${phase} phase` })).toBeInTheDocument();
        expect(screen.getByText(expectedIcons[index])).toBeInTheDocument();
      });
    });
  });

  describe('Combination Tests', () => {
    it('renders small indicator without text correctly', () => {
      render(<PhaseIndicator phase="stable" size="small" showText={false} />);
      
      expect(screen.queryByText('Stable')).not.toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'stable phase' })).toBeInTheDocument();
      expect(screen.getByText('→')).toBeInTheDocument();
    });

    it('renders large indicator with text correctly', () => {
      const { container } = render(<PhaseIndicator phase="transition" size="large" showText={true} />);
      const indicator = container.firstChild as HTMLElement;
      
      expect(screen.getByText('Transition')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'transition phase' })).toBeInTheDocument();
      expect(indicator).toHaveClass('px-4', 'py-2', 'text-base');
    });
  });
}); 