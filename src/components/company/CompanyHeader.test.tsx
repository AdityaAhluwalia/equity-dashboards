import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CompanyHeader from './CompanyHeader';
import { Company } from '@/types/ui.types';

// Mock the PhaseIndicator component
jest.mock('./PhaseIndicator', () => {
  return function PhaseIndicator({ phase, size }: { phase: string; size: string }) {
    return <div data-testid="phase-indicator" data-phase={phase} data-size={size}>
      Mock Phase Indicator - {phase} - {size}
    </div>;
  };
});

describe('CompanyHeader', () => {
  const mockCompany: Company = {
    id: 'test-company-1',
    name: 'Test Company Ltd',
    sector: 'Technology',
    industry: 'Software Services',
    market_cap: 50000, // 50,000 million = 50,000 crores
    marketCap: 50000, // UI version
    exchange: 'NSE',
    currentPhase: 'expansion',
    currentPrice: 1250.75,
    priceChange: 2.5,
    companyType: 'non-finance',
    description: 'A leading technology company providing software services globally.',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  describe('Loading States', () => {
    it('renders loading state correctly', () => {
      const { container } = render(<CompanyHeader company={mockCompany} loading={true} />);
      
      const pulseElement = container.querySelector('.animate-pulse');
      expect(pulseElement).toBeInTheDocument();
      expect(container.querySelectorAll('.bg-gray-200').length).toBeGreaterThanOrEqual(3);
    });

    it('renders loading skeleton with correct structure', () => {
      const { container } = render(<CompanyHeader company={mockCompany} loading={true} />);
      
      const skeletonElements = container.querySelectorAll('.bg-gray-200');
      expect(skeletonElements.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Error States', () => {
    it('renders error state correctly', () => {
      const errorMessage = 'Failed to load company data';
      const { container } = render(<CompanyHeader company={mockCompany} error={errorMessage} />);
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      const errorContainer = container.querySelector('.bg-red-50\\/70');
      expect(errorContainer).toBeInTheDocument();
    });

    it('includes error icon in error state', () => {
      render(<CompanyHeader company={mockCompany} error="Test error" />);
      
      const errorContainer = screen.getByText('Test error').closest('div');
      expect(errorContainer).toHaveClass('text-red-600');
      expect(errorContainer?.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Company Information Display', () => {
    it('renders company name correctly', () => {
      render(<CompanyHeader company={mockCompany} />);
      
      expect(screen.getByText('Test Company Ltd')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Company Ltd');
    });

    it('renders sector information correctly', () => {
      render(<CompanyHeader company={mockCompany} />);
      
      expect(screen.getByText('Sector:')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toHaveClass('bg-blue-50', 'text-blue-700');
    });

    it('renders industry information correctly', () => {
      render(<CompanyHeader company={mockCompany} />);
      
      expect(screen.getByText('Industry:')).toBeInTheDocument();
      expect(screen.getByText('Software Services')).toBeInTheDocument();
      expect(screen.getByText('Software Services')).toHaveClass('bg-green-50', 'text-green-700');
    });

    it('renders market cap in crores correctly', () => {
      render(<CompanyHeader company={mockCompany} />);
      
      expect(screen.getByText('Market Cap:')).toBeInTheDocument();
      expect(screen.getByText((content, element) => {
        return element?.textContent === '₹50 Cr';
      })).toBeInTheDocument();
    });

    it('renders company type for non-finance company', () => {
      render(<CompanyHeader company={mockCompany} />);
      
      expect(screen.getByText('Non-Financial')).toBeInTheDocument();
      expect(screen.getByText('Non-Financial')).toHaveClass('bg-gray-50', 'text-gray-700');
    });

    it('renders company type for finance company', () => {
      const financeCompany = { ...mockCompany, companyType: 'finance' as const };
      render(<CompanyHeader company={financeCompany} />);
      
      expect(screen.getByText('Financial Services')).toBeInTheDocument();
      expect(screen.getByText('Financial Services')).toHaveClass('bg-purple-50', 'text-purple-700');
    });
  });

  describe('Phase Indicator Integration', () => {
    it('renders phase indicator with correct props', () => {
      render(<CompanyHeader company={mockCompany} />);
      
      const phaseIndicator = screen.getByTestId('phase-indicator');
      expect(phaseIndicator).toHaveAttribute('data-phase', 'expansion');
      expect(phaseIndicator).toHaveAttribute('data-size', 'large');
    });

    it('passes different phase types correctly', () => {
      const contractionCompany = { ...mockCompany, currentPhase: 'contraction' as const };
      render(<CompanyHeader company={contractionCompany} />);
      
      const phaseIndicator = screen.getByTestId('phase-indicator');
      expect(phaseIndicator).toHaveAttribute('data-phase', 'contraction');
    });
  });

  describe('Price Information', () => {
    it('renders current price correctly', () => {
      render(<CompanyHeader company={mockCompany} />);
      
      expect(screen.getByText((content, element) => {
        return element?.textContent === '₹1,250.75';
      })).toBeInTheDocument();
      expect(screen.getByText('Current Price')).toBeInTheDocument();
    });

    it('renders positive price change correctly', () => {
      render(<CompanyHeader company={mockCompany} />);
      
      const priceChangeElement = screen.getByText((content, element) => {
        return element?.textContent === '+2.50%';
      });
      expect(priceChangeElement).toBeInTheDocument();
      expect(priceChangeElement).toHaveClass('text-green-600');
    });

    it('renders negative price change correctly', () => {
      const company = { ...mockCompany, priceChange: -1.5 };
      render(<CompanyHeader company={company} />);
      
      const priceChangeElement = screen.getByText((content, element) => {
        return element?.textContent === '-1.50%';
      });
      expect(priceChangeElement).toBeInTheDocument();
      expect(priceChangeElement).toHaveClass('text-red-600');
    });

    it('handles missing price information', () => {
      const company = { ...mockCompany, currentPrice: undefined, priceChange: undefined };
      render(<CompanyHeader company={company} />);
      
      expect(screen.getByText((content, element) => {
        return element?.textContent === '₹N/A';
      })).toBeInTheDocument();
      expect(screen.queryByText(/%/)).not.toBeInTheDocument();
    });
  });

  describe('Description Section', () => {
    it('renders description when provided', () => {
      render(<CompanyHeader company={mockCompany} />);
      
      expect(screen.getByText(mockCompany.description!)).toBeInTheDocument();
      expect(screen.getByText(mockCompany.description!)).toHaveClass('text-gray-600');
    });

    it('does not render description section when not provided', () => {
      const companyWithoutDescription = { ...mockCompany, description: undefined };
      render(<CompanyHeader company={companyWithoutDescription} />);
      
      const descriptionContainer = screen.queryByText('A leading technology company');
      expect(descriptionContainer).not.toBeInTheDocument();
    });

    it('includes proper border styling for description section', () => {
      render(<CompanyHeader company={mockCompany} />);
      
      const descriptionText = screen.getByText(mockCompany.description!);
      const descriptionContainer = descriptionText.closest('div');
      expect(descriptionContainer).toHaveClass('mt-4', 'pt-4', 'border-t', 'border-gray-100');
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive classes for mobile layout', () => {
      const { container } = render(<CompanyHeader company={mockCompany} />);
      
      const mainContainer = container.querySelector('.flex');
      expect(mainContainer).toHaveClass('flex-col', 'sm:flex-row');
      
      const titleElement = screen.getByRole('heading', { level: 1 });
      expect(titleElement).toHaveClass('text-2xl', 'sm:text-3xl');
    });

    it('applies grid layout for company information', () => {
      const { container } = render(<CompanyHeader company={mockCompany} />);
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1', 'sm:grid-cols-2');
    });
  });

  describe('Styling and Visual Design', () => {
    it('applies glass morphism styling', () => {
      const { container } = render(<CompanyHeader company={mockCompany} />);
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass(
        'bg-white/70',
        'backdrop-blur-sm',
        'rounded-2xl',
        'shadow-lg',
        'border',
        'border-gray-100'
      );
    });

    it('includes hover effect styling', () => {
      const { container } = render(<CompanyHeader company={mockCompany} />);
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('hover:shadow-xl', 'transition-all', 'duration-300');
    });
  });

  describe('Number Formatting', () => {
    it('formats market cap with Indian number system', () => {
      const company = { ...mockCompany, marketCap: 123456 };
      render(<CompanyHeader company={company} />);
      
      expect(screen.getByText((content, element) => {
        return element?.textContent === '₹123 Cr';
      })).toBeInTheDocument();
    });

    it('formats current price with Indian number system', () => {
      const company = { ...mockCompany, currentPrice: 12345.67 };
      render(<CompanyHeader company={company} />);
      
      expect(screen.getByText((content, element) => {
        return element?.textContent === '₹12,345.67';
      })).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles zero price change correctly', () => {
      const company = { ...mockCompany, priceChange: 0 };
      render(<CompanyHeader company={company} />);
      
      const priceChangeElement = screen.getByText((content, element) => {
        return element?.textContent === '+0.00%';
      });
      expect(priceChangeElement).toBeInTheDocument();
      expect(priceChangeElement).toHaveClass('text-green-600');
    });

    it('handles very large market cap numbers', () => {
      const company = { ...mockCompany, marketCap: 1000000 };
      render(<CompanyHeader company={company} />);
      
      expect(screen.getByText((content, element) => {
        return element?.textContent === '₹1,000 Cr';
      })).toBeInTheDocument();
    });

    it('handles missing optional fields gracefully', () => {
      const minimalCompany = {
        ...mockCompany,
        industry: undefined,
        description: undefined,
        currentPrice: undefined,
        priceChange: undefined
      };
      
      expect(() => render(<CompanyHeader company={minimalCompany} />)).not.toThrow();
    });
  });
}); 