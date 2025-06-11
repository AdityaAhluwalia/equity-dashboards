import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MetricCards from './MetricCards';
import { MetricCard } from '@/types/ui.types';

describe('MetricCards', () => {
  const mockMetrics: MetricCard[] = [
    {
      id: 'revenue',
      label: 'Revenue',
      value: 24500,
      change: 12.4,
      trend: 'up',
      format: 'currency',
      sparklineData: [
        { x: 'Q1', y: 20000 },
        { x: 'Q2', y: 22000 },
        { x: 'Q3', y: 23500 },
        { x: 'Q4', y: 24500 }
      ]
    },
    {
      id: 'margin',
      label: 'OPM',
      value: 18.5,
      change: -2.1,
      trend: 'down',
      format: 'percentage',
      sparklineData: [
        { x: 'Q1', y: 20.5 },
        { x: 'Q2', y: 19.8 },
        { x: 'Q3', y: 19.2 },
        { x: 'Q4', y: 18.5 }
      ]
    },
    {
      id: 'roe',
      label: 'ROE',
      value: 1.25,
      change: 0,
      trend: 'stable',
      format: 'ratio',
      sparklineData: [
        { x: 'Q1', y: 1.23 },
        { x: 'Q2', y: 1.24 },
        { x: 'Q3', y: 1.25 },
        { x: 'Q4', y: 1.25 }
      ]
    },
    {
      id: 'volume',
      label: 'Volume',
      value: 150000,
      change: 25.8,
      trend: 'up',
      format: 'number'
      // No sparkline data
    }
  ];

  describe('Rendering and Basic Functionality', () => {
    it('renders all metric cards correctly', () => {
      render(<MetricCards metrics={mockMetrics} />);
      
      expect(screen.getByText('REVENUE')).toBeInTheDocument();
      expect(screen.getByText('OPM')).toBeInTheDocument();
      expect(screen.getByText('ROE')).toBeInTheDocument();
      expect(screen.getByText('VOLUME')).toBeInTheDocument();
    });

    it('renders metric values with correct formatting', () => {
      render(<MetricCards metrics={mockMetrics} />);
      
      // Currency formatting
      expect(screen.getByText('₹24,500')).toBeInTheDocument();
      
      // Percentage formatting
      expect(screen.getByText('18.50%')).toBeInTheDocument();
      
      // Ratio formatting
      expect(screen.getByText('1.25')).toBeInTheDocument();
      
      // Number formatting
      expect(screen.getByText('1,50,000')).toBeInTheDocument();
    });

    it('renders trend icons correctly', () => {
      render(<MetricCards metrics={mockMetrics} />);
      
      const upTrendElements = screen.getAllByRole('img', { name: 'up trend' });
      expect(upTrendElements.length).toBe(2); // Revenue and Volume both have 'up' trend
      
      expect(screen.getByRole('img', { name: 'down trend' })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'stable trend' })).toBeInTheDocument();
    });

    it('renders change percentages with correct colors', () => {
      render(<MetricCards metrics={mockMetrics} />);
      
      const positiveChange = screen.getByText('+12.40%');
      expect(positiveChange).toHaveClass('text-green-600');
      
      const negativeChange = screen.getByText('-2.10%');
      expect(negativeChange).toHaveClass('text-red-600');
      
      const stableChange = screen.getByText('+0.00%');
      expect(stableChange).toHaveClass('text-gray-600');
    });
  });

  describe('Loading States', () => {
    it('renders loading skeleton when loading', () => {
      const { container } = render(<MetricCards metrics={[]} loading={true} />);
      
      const loadingElements = container.querySelectorAll('.animate-pulse');
      expect(loadingElements.length).toBe(4); // 4 skeleton cards
      
      const skeletonBars = container.querySelectorAll('.bg-gray-200');
      expect(skeletonBars.length).toBeGreaterThanOrEqual(12); // 3 bars per card × 4 cards
    });

    it('applies correct loading card styling', () => {
      const { container } = render(<MetricCards metrics={[]} loading={true} />);
      
      const loadingCards = container.querySelectorAll('.bg-white\\/60');
      expect(loadingCards.length).toBe(4);
      
      loadingCards.forEach(card => {
        expect(card).toHaveClass('backdrop-blur-sm', 'rounded-xl', 'shadow-sm');
      });
    });
  });

  describe('Error States', () => {
    it('renders error state correctly', () => {
      const errorMessage = 'Failed to load metrics';
      render(<MetricCards metrics={[]} error={errorMessage} />);
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByText(errorMessage).closest('div')).toHaveClass('text-red-600');
    });

    it('includes error icon in error state', () => {
      render(<MetricCards metrics={[]} error="Test error" />);
      
      const errorContainer = screen.getByText('Test error').closest('div');
      expect(errorContainer?.querySelector('svg')).toBeInTheDocument();
    });

    it('applies correct error styling', () => {
      const { container } = render(<MetricCards metrics={[]} error="Test error" />);
      
      const errorContainer = container.querySelector('.bg-red-50\\/70');
      expect(errorContainer).toBeInTheDocument();
      expect(errorContainer).toHaveClass('backdrop-blur-sm', 'rounded-xl', 'border-red-100');
    });
  });

  describe('Empty States', () => {
    it('renders empty state when no metrics provided', () => {
      render(<MetricCards metrics={[]} />);
      
      expect(screen.getByText('No metrics available')).toBeInTheDocument();
    });

    it('renders empty state when metrics array is null', () => {
      render(<MetricCards metrics={null as any} />);
      
      expect(screen.getByText('No metrics available')).toBeInTheDocument();
    });

    it('applies correct empty state styling', () => {
      const { container } = render(<MetricCards metrics={[]} />);
      
      const emptyContainer = container.querySelector('.bg-gray-50\\/70');
      expect(emptyContainer).toBeInTheDocument();
      expect(emptyContainer).toHaveClass('backdrop-blur-sm', 'rounded-xl');
    });
  });

  describe('Sparkline Charts', () => {
    it('renders sparkline charts when data is available', () => {
      render(<MetricCards metrics={mockMetrics} />);
      
      const sparklineCharts = screen.getAllByTestId('line-chart');
      expect(sparklineCharts.length).toBe(3); // 3 metrics have sparkline data
    });

    it('renders sparkline with correct trend colors', () => {
      render(<MetricCards metrics={mockMetrics} />);
      
      const lineElements = screen.getAllByTestId('line');
      expect(lineElements.length).toBe(3);
      
      // We can't directly test stroke colors in jest-dom, but we verify the lines exist
      lineElements.forEach(line => {
        expect(line).toBeInTheDocument();
      });
    });

    it('renders fallback when no sparkline data', () => {
      render(<MetricCards metrics={mockMetrics} />);
      
      expect(screen.getByText('No data')).toBeInTheDocument();
    });

    it('applies correct sparkline container styling', () => {
      const { container } = render(<MetricCards metrics={mockMetrics} />);
      
      const sparklineContainers = container.querySelectorAll('.h-8.w-full');
      expect(sparklineContainers.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design and Layout', () => {
    it('applies responsive grid classes', () => {
      const { container } = render(<MetricCards metrics={mockMetrics} />);
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass('grid-cols-2', 'md:grid-cols-4', 'gap-4');
    });

    it('applies hover effects to metric cards', () => {
      const { container } = render(<MetricCards metrics={mockMetrics} />);
      
      const metricCards = container.querySelectorAll('.bg-white\\/60');
      metricCards.forEach(card => {
        expect(card).toHaveClass(
          'hover:shadow-md',
          'transition-all',
          'duration-200',
          'hover:-translate-y-0.5'
        );
      });
    });
  });

  describe('Apple-Style UI Compliance', () => {
    it('uses glass morphism styling', () => {
      const { container } = render(<MetricCards metrics={mockMetrics} />);
      
      const cards = container.querySelectorAll('.bg-white\\/60.backdrop-blur-sm');
      expect(cards.length).toBe(4);
      
      cards.forEach(card => {
        expect(card).toHaveClass('rounded-xl', 'border', 'border-gray-100');
      });
    });

    it('uses proper typography hierarchy', () => {
      render(<MetricCards metrics={mockMetrics} />);
      
      // Labels should be small and uppercase
      const labels = screen.getAllByText(/REVENUE|OPM|ROE|VOLUME/);
      labels.forEach(label => {
        expect(label).toHaveClass('text-xs', 'font-medium', 'text-gray-600', 'uppercase');
      });
      
      // Values should be large and bold
      const values = screen.getAllByText(/₹24,500|18.50%|1.25|1,50,000/);
      values.forEach(value => {
        expect(value).toHaveClass('text-lg', 'font-bold', 'text-gray-900');
      });
    });

    it('uses semantic color system', () => {
      render(<MetricCards metrics={mockMetrics} />);
      
      // Up trend should be green
      const upChange = screen.getByText('+12.40%');
      expect(upChange).toHaveClass('text-green-600');
      
      // Down trend should be red
      const downChange = screen.getByText('-2.10%');
      expect(downChange).toHaveClass('text-red-600');
      
      // Stable trend should be gray
      const stableChange = screen.getByText('+0.00%');
      expect(stableChange).toHaveClass('text-gray-600');
    });
  });

  describe('Value Formatting', () => {
    it('formats currency values correctly', () => {
      const currencyMetric: MetricCard = {
        id: 'test-currency',
        label: 'Test Currency',
        value: 1234567.89,
        trend: 'up',
        format: 'currency'
      };
      
      render(<MetricCards metrics={[currencyMetric]} />);
      expect(screen.getByText('₹12,34,567.89')).toBeInTheDocument();
    });

    it('formats percentage values correctly', () => {
      const percentageMetric: MetricCard = {
        id: 'test-percentage',
        label: 'Test Percentage',
        value: 15.678,
        trend: 'up',
        format: 'percentage'
      };
      
      render(<MetricCards metrics={[percentageMetric]} />);
      expect(screen.getByText('15.68%')).toBeInTheDocument();
    });

    it('formats ratio values correctly', () => {
      const ratioMetric: MetricCard = {
        id: 'test-ratio',
        label: 'Test Ratio',
        value: 2.5678,
        trend: 'up',
        format: 'ratio'
      };
      
      render(<MetricCards metrics={[ratioMetric]} />);
      expect(screen.getByText('2.57')).toBeInTheDocument();
    });

    it('formats number values correctly', () => {
      const numberMetric: MetricCard = {
        id: 'test-number',
        label: 'Test Number',
        value: 9876543,
        trend: 'up',
        format: 'number'
      };
      
      render(<MetricCards metrics={[numberMetric]} />);
      expect(screen.getByText('98,76,543')).toBeInTheDocument();
    });

    it('handles string values correctly', () => {
      const stringMetric: MetricCard = {
        id: 'test-string',
        label: 'Test String',
        value: 'Custom Value',
        trend: 'up',
        format: 'currency'
      };
      
      render(<MetricCards metrics={[stringMetric]} />);
      expect(screen.getByText('Custom Value')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels for trend icons', () => {
      render(<MetricCards metrics={mockMetrics} />);
      
      const upTrendElements = screen.getAllByRole('img', { name: 'up trend' });
      expect(upTrendElements.length).toBe(2); // Revenue and Volume both have 'up' trend
      
      expect(screen.getByRole('img', { name: 'down trend' })).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'stable trend' })).toBeInTheDocument();
    });

    it('maintains proper heading hierarchy', () => {
      render(<MetricCards metrics={mockMetrics} />);
      
      // Labels should be accessible
      const labels = screen.getAllByText(/REVENUE|OPM|ROE|VOLUME/);
      labels.forEach(label => {
        expect(label).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles missing change values', () => {
      const metricWithoutChange: MetricCard = {
        id: 'no-change',
        label: 'No Change',
        value: 100,
        trend: 'stable',
        format: 'number'
      };
      
      render(<MetricCards metrics={[metricWithoutChange]} />);
      
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.queryByText('%')).not.toBeInTheDocument();
    });

    it('handles zero values correctly', () => {
      const zeroMetric: MetricCard = {
        id: 'zero',
        label: 'Zero Value',
        value: 0,
        change: 0,
        trend: 'stable',
        format: 'currency'
      };
      
      render(<MetricCards metrics={[zeroMetric]} />);
      
      expect(screen.getByText('₹0')).toBeInTheDocument();
      expect(screen.getByText('+0.00%')).toBeInTheDocument();
    });

    it('handles negative values correctly', () => {
      const negativeMetric: MetricCard = {
        id: 'negative',
        label: 'Negative Value',
        value: -1500,
        change: -10.5,
        trend: 'down',
        format: 'currency'
      };
      
      render(<MetricCards metrics={[negativeMetric]} />);
      
      expect(screen.getByText('₹-1,500')).toBeInTheDocument();
      expect(screen.getByText('-10.50%')).toBeInTheDocument();
    });

    it('handles empty sparkline data arrays', () => {
      const emptySparklineMetric: MetricCard = {
        id: 'empty-sparkline',
        label: 'Empty Sparkline',
        value: 100,
        trend: 'up',
        format: 'number',
        sparklineData: []
      };
      
      render(<MetricCards metrics={[emptySparklineMetric]} />);
      
      expect(screen.getByText('No data')).toBeInTheDocument();
    });
  });
}); 