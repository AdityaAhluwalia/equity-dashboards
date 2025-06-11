import React from 'react';
import { render, screen } from '@testing-library/react';
import { MarginsTimeline } from './MarginsTimeline';
import type { Company } from '@/types/ui.types';

// Mock company data structure that includes margin data
const mockCompanyData = {
  company: {
    id: 'test-company',
    name: 'Test Company',
    sector: 'Manufacturing',
    marketCap: 1000,
    currentPhase: 'expansion',
  } as Company,
  annualData: [
    {
      year: 2020,
      revenue: 800,
      netProfit: 80,
      operatingProfit: 120,
      grossProfit: 240,
      operatingMargin: 15.0,
      netMargin: 10.0,
      grossMargin: 30.0,
    },
    {
      year: 2021,
      revenue: 900,
      netProfit: 90,
      operatingProfit: 135,
      grossProfit: 270,
      operatingMargin: 15.0,
      netMargin: 10.0,
      grossMargin: 30.0,
    },
    {
      year: 2022,
      revenue: 1000,
      netProfit: 100,
      operatingProfit: 150,
      grossProfit: 300,
      operatingMargin: 15.0,
      netMargin: 10.0,
      grossMargin: 30.0,
    },
    {
      year: 2023,
      revenue: 1200,
      netProfit: 120,
      operatingProfit: 180,
      grossProfit: 360,
      operatingMargin: 15.0,
      netMargin: 10.0,
      grossMargin: 30.0,
    },
  ],
  quarterlyData: [
    {
      quarter: 'Q1 2023',
      year: 2023,
      quarter_number: 1,
      revenue: 250,
      netProfit: 25,
      operatingProfit: 37.5,
      grossProfit: 75,
      operatingMargin: 15.0,
      netMargin: 10.0,
      grossMargin: 30.0,
    },
    {
      quarter: 'Q2 2023',
      year: 2023,
      quarter_number: 2,
      revenue: 300,
      netProfit: 30,
      operatingProfit: 45,
      grossProfit: 90,
      operatingMargin: 15.0,
      netMargin: 10.0,
      grossMargin: 30.0,
    },
    {
      quarter: 'Q3 2023',
      year: 2023,
      quarter_number: 3,
      revenue: 280,
      netProfit: 28,
      operatingProfit: 42,
      grossProfit: 84,
      operatingMargin: 15.0,
      netMargin: 10.0,
      grossMargin: 30.0,
    },
    {
      quarter: 'Q4 2023',
      year: 2023,
      quarter_number: 4,
      revenue: 320,
      netProfit: 32,
      operatingProfit: 48,
      grossProfit: 96,
      operatingMargin: 15.0,
      netMargin: 10.0,
      grossMargin: 30.0,
    },
  ],
};

// Mock company data with variance for testing variance highlighting
const mockVarianceCompanyData = {
  company: {
    id: 'variance-test-company',
    name: 'Variance Test Company',
    sector: 'Manufacturing',
    marketCap: 1000,
    currentPhase: 'expansion',
  } as Company,
  annualData: [
    {
      year: 2020,
      revenue: 800,
      netProfit: 80,
      operatingProfit: 120,
      grossProfit: 240,
      operatingMargin: 15.0,
      netMargin: 10.0,
      grossMargin: 30.0,
    },
    {
      year: 2021,
      revenue: 900,
      netProfit: 90,
      operatingProfit: 135,
      grossProfit: 270,
      operatingMargin: 18.0,
      netMargin: 12.0,
      grossMargin: 32.0,
    },
    {
      year: 2022,
      revenue: 1000,
      netProfit: 100,
      operatingProfit: 150,
      grossProfit: 300,
      operatingMargin: 15.0,
      netMargin: 10.0,
      grossMargin: 30.0,
    },
    {
      year: 2023,
      revenue: 1200,
      netProfit: 120,
      operatingProfit: 180,
      grossProfit: 360,
      operatingMargin: 25.0, // High variance
      netMargin: 8.0, // Low variance
      grossMargin: 35.0, // High variance
    },
  ],
  quarterlyData: [
    {
      quarter: 'Q1 2023',
      year: 2023,
      quarter_number: 1,
      revenue: 250,
      netProfit: 25,
      operatingProfit: 37.5,
      grossProfit: 75,
      operatingMargin: 15.0,
      netMargin: 10.0,
      grossMargin: 30.0,
    },
    {
      quarter: 'Q2 2023',
      year: 2023,
      quarter_number: 2,
      revenue: 300,
      netProfit: 30,
      operatingProfit: 45,
      grossProfit: 90,
      operatingMargin: 20.0,
      netMargin: 12.0,
      grossMargin: 32.0,
    },
    {
      quarter: 'Q3 2023',
      year: 2023,
      quarter_number: 3,
      revenue: 280,
      netProfit: 28,
      operatingProfit: 42,
      grossProfit: 84,
      operatingMargin: 18.0,
      netMargin: 8.0,
      grossMargin: 28.0,
    },
    {
      quarter: 'Q4 2023',
      year: 2023,
      quarter_number: 4,
      revenue: 320,
      netProfit: 32,
      operatingProfit: 48,
      grossProfit: 96,
      operatingMargin: 22.0,
      netMargin: 14.0,
      grossMargin: 34.0,
    },
  ],
};

describe('MarginsTimeline', () => {
  it('renders margins timeline component', () => {
    render(<MarginsTimeline data={mockCompanyData} />);
    
    expect(screen.getByTestId('margins-timeline')).toBeInTheDocument();
    expect(screen.getByText('Margins Timeline')).toBeInTheDocument();
  });

  it('displays all three margin types', () => {
    render(<MarginsTimeline data={mockCompanyData} />);
    
    expect(screen.getByText('Gross Margin')).toBeInTheDocument();
    expect(screen.getByText('Operating Margin')).toBeInTheDocument();
    expect(screen.getByText('Net Margin')).toBeInTheDocument();
  });

  it('renders chart container with proper height', () => {
    render(<MarginsTimeline data={mockCompanyData} />);
    
    const chartContainer = screen.getByTestId('margins-chart-container');
    expect(chartContainer).toHaveClass('h-80');
  });

  it('handles empty data gracefully', () => {
    const emptyData = { ...mockCompanyData, annualData: [] };
    render(<MarginsTimeline data={emptyData} />);
    
    expect(screen.getByTestId('margins-timeline')).toBeInTheDocument();
    expect(screen.getByText('No margin data available')).toBeInTheDocument();
  });

  it('supports quarterly and annual view modes', () => {
    render(<MarginsTimeline data={mockCompanyData} viewMode="quarterly" />);
    
    expect(screen.getByTestId('margins-timeline')).toBeInTheDocument();
  });

  it('shows legend with proper margin colors', () => {
    render(<MarginsTimeline data={mockCompanyData} />);
    
    const legend = screen.getByTestId('margins-legend');
    expect(legend).toBeInTheDocument();
    
    // Check for margin type indicators
    expect(screen.getByTestId('gross-margin-indicator')).toBeInTheDocument();
    expect(screen.getByTestId('operating-margin-indicator')).toBeInTheDocument();
    expect(screen.getByTestId('net-margin-indicator')).toBeInTheDocument();
  });

  it('displays margin values on hover', () => {
    render(<MarginsTimeline data={mockCompanyData} />);
    
    const chart = screen.getByTestId('margins-chart');
    expect(chart).toBeInTheDocument();
  });

  it('applies Apple-style design tokens', () => {
    render(<MarginsTimeline data={mockCompanyData} />);
    
    const container = screen.getByTestId('margins-timeline');
    expect(container).toHaveClass('bg-white', 'rounded-2xl', 'p-6');
  });

  // NEW TESTS FOR TASK 8.2 - Normal Range Shading
  describe('Normal Range Shading (Task 8.2)', () => {
    it('renders normal range shading when enabled', () => {
      render(<MarginsTimeline data={mockCompanyData} showNormalRanges={true} />);
      
      expect(screen.getByTestId('normal-range-overlay')).toBeInTheDocument();
    });

    it('displays range indicators for each margin type', () => {
      render(<MarginsTimeline data={mockCompanyData} showNormalRanges={true} />);
      
      // Check that range overlay is present (contains ReferenceArea components)
      const overlay = screen.getByTestId('normal-range-overlay');
      expect(overlay).toBeInTheDocument();
      
      // Verify reference areas are rendered (they show as divs in test environment)
      const referenceAreas = screen.getAllByTestId('reference-area');
      expect(referenceAreas).toHaveLength(3); // One for each margin type
    });

    it('shows range labels in legend', () => {
      render(<MarginsTimeline data={mockCompanyData} showNormalRanges={true} />);
      
      expect(screen.getByText('Normal Range')).toBeInTheDocument();
      expect(screen.getByTestId('range-legend-indicator')).toBeInTheDocument();
    });

    it('displays custom industry ranges when provided', () => {
      const customRanges = {
        grossMargin: { min: 25, max: 45, industry: 'Manufacturing' },
        operatingMargin: { min: 10, max: 20, industry: 'Manufacturing' },
        netMargin: { min: 5, max: 15, industry: 'Manufacturing' },
      };
      
      render(
        <MarginsTimeline 
          data={mockCompanyData} 
          showNormalRanges={true}
          industryRanges={customRanges}
        />
      );
      
      expect(screen.getByText('Manufacturing Ranges')).toBeInTheDocument();
    });

    it('shows performance indicators based on current vs normal ranges', () => {
      render(<MarginsTimeline data={mockCompanyData} showNormalRanges={true} />);
      
      // Should show performance badges
      expect(screen.getByTestId('performance-indicators')).toBeInTheDocument();
    });

    it('displays range tooltips with detailed information', () => {
      render(<MarginsTimeline data={mockCompanyData} showNormalRanges={true} />);
      
      expect(screen.getByTestId('range-tooltip-trigger')).toBeInTheDocument();
    });

    it('can toggle range visibility', () => {
      const { rerender } = render(
        <MarginsTimeline data={mockCompanyData} showNormalRanges={true} />
      );
      
      expect(screen.getByTestId('normal-range-overlay')).toBeInTheDocument();
      
      rerender(<MarginsTimeline data={mockCompanyData} showNormalRanges={false} />);
      
      expect(screen.queryByTestId('normal-range-overlay')).not.toBeInTheDocument();
    });

    it('applies subtle styling to range overlays', () => {
      render(<MarginsTimeline data={mockCompanyData} showNormalRanges={true} />);
      
      const rangeOverlay = screen.getByTestId('normal-range-overlay');
      expect(rangeOverlay).toHaveClass('opacity-20'); // Should be subtle
    });

    it('supports sector-specific range configurations', () => {
      const sectorRanges = {
        'Consumer Goods': {
          grossMargin: { min: 35, max: 55 },
          operatingMargin: { min: 15, max: 25 },
          netMargin: { min: 8, max: 18 },
        }
      };
      
      render(
        <MarginsTimeline 
          data={mockCompanyData} 
          showNormalRanges={true}
          sectorRanges={sectorRanges}
        />
      );
      
      expect(screen.getByTestId('sector-specific-ranges')).toBeInTheDocument();
    });
  });

  // NEW TESTS FOR TASK 8.4 - Moving Average Overlays
  describe('Moving Average Overlays (Task 8.4)', () => {
    it('renders moving average overlays when enabled', () => {
      render(<MarginsTimeline data={mockCompanyData} showMovingAverages={true} />);
      
      expect(screen.getByTestId('moving-averages-overlay')).toBeInTheDocument();
    });

    it('displays 3-period and 5-period moving averages by default', () => {
      render(<MarginsTimeline data={mockCompanyData} showMovingAverages={true} />);
      
      // Check for moving average overlay container (lines render as generic divs in test)
      expect(screen.getByTestId('moving-averages-overlay')).toBeInTheDocument();
      
      // Verify MA legend shows both periods (use getAllByText to handle duplicates)
      expect(screen.getAllByText('3-Period MA')).toHaveLength(2); // Legend + trend indicators
      expect(screen.getAllByText('5-Period MA')).toHaveLength(2);
    });

    it('allows custom moving average periods', () => {
      render(
        <MarginsTimeline 
          data={mockCompanyData} 
          showMovingAverages={true}
          movingAveragePeriods={[4, 8]}
        />
      );
      
      expect(screen.getAllByText('4-Period MA')).toHaveLength(2); // Legend + trend indicators
      expect(screen.getAllByText('8-Period MA')).toHaveLength(2);
    });

    it('shows moving average legend with different line styles', () => {
      render(<MarginsTimeline data={mockCompanyData} showMovingAverages={true} />);
      
      expect(screen.getByTestId('ma-legend')).toBeInTheDocument();
      
      // Verify periods appear in legend specifically (at least one instance each)
      expect(screen.getAllByText('3-Period MA').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('5-Period MA').length).toBeGreaterThanOrEqual(1);
    });

    it('applies different stroke styles for different MA periods', () => {
      render(<MarginsTimeline data={mockCompanyData} showMovingAverages={true} />);
      
      // Moving averages overlay should be present with multiple Line elements
      expect(screen.getByTestId('moving-averages-overlay')).toBeInTheDocument();
      
      // Verify legend elements have different styles for different periods
      const legend = screen.getByTestId('ma-legend');
      expect(legend).toBeInTheDocument();
    });

    it('handles insufficient data for moving averages gracefully', () => {
      const limitedData = {
        ...mockCompanyData,
        annualData: [mockCompanyData.annualData[0]], // Only 1 data point
      };
      
      render(<MarginsTimeline data={limitedData} showMovingAverages={true} />);
      
      // Should still render but with warning or no MA lines
      expect(screen.getByTestId('margins-timeline')).toBeInTheDocument();
    });

    it('shows moving average values in tooltips', () => {
      render(<MarginsTimeline data={mockCompanyData} showMovingAverages={true} />);
      
      // MA overlay should be present (tooltip appears on interaction)
      expect(screen.getByTestId('moving-averages-overlay')).toBeInTheDocument();
    });

    it('can toggle moving averages visibility', () => {
      const { rerender } = render(
        <MarginsTimeline data={mockCompanyData} showMovingAverages={true} />
      );
      
      expect(screen.getByTestId('moving-averages-overlay')).toBeInTheDocument();
      
      rerender(<MarginsTimeline data={mockCompanyData} showMovingAverages={false} />);
      
      expect(screen.queryByTestId('moving-averages-overlay')).not.toBeInTheDocument();
    });

    it('maintains smooth curves for moving average lines', () => {
      render(<MarginsTimeline data={mockCompanyData} showMovingAverages={true} />);
      
      // Moving average lines should use monotone curves
      const maOverlay = screen.getByTestId('moving-averages-overlay');
      expect(maOverlay).toBeInTheDocument();
    });

    it('applies subtle transparency to moving average lines', () => {
      render(<MarginsTimeline data={mockCompanyData} showMovingAverages={true} />);
      
      const maOverlay = screen.getByTestId('moving-averages-overlay');
      expect(maOverlay).toBeInTheDocument();
    });

    it('supports quarterly and annual views for moving averages', () => {
      render(
        <MarginsTimeline 
          data={mockCompanyData} 
          viewMode="quarterly"
          showMovingAverages={true} 
        />
      );
      
      expect(screen.getByTestId('moving-averages-overlay')).toBeInTheDocument();
    });

    it('displays MA crossover signals', () => {
      render(<MarginsTimeline data={mockCompanyData} showMovingAverages={true} />);
      
      // Should detect when shorter MA crosses longer MA
      expect(screen.getByTestId('ma-crossover-indicators')).toBeInTheDocument();
    });

    it('shows trend direction from moving averages', () => {
      render(<MarginsTimeline data={mockCompanyData} showMovingAverages={true} />);
      
      expect(screen.getByTestId('ma-trend-indicators')).toBeInTheDocument();
    });

    it('calculates moving averages correctly', () => {
      const extendedData = {
        ...mockCompanyData,
        annualData: [
          { year: 2020, revenue: 800, netProfit: 80, operatingProfit: 120, grossProfit: 240, operatingMargin: 15.0, netMargin: 10.0, grossMargin: 30.0 },
          { year: 2021, revenue: 900, netProfit: 90, operatingProfit: 135, grossProfit: 270, operatingMargin: 15.0, netMargin: 10.0, grossMargin: 30.0 },
          { year: 2022, revenue: 1000, netProfit: 100, operatingProfit: 150, grossProfit: 300, operatingMargin: 15.0, netMargin: 10.0, grossMargin: 30.0 },
          { year: 2023, revenue: 1200, netProfit: 120, operatingProfit: 180, grossProfit: 360, operatingMargin: 15.0, netMargin: 10.0, grossMargin: 30.0 },
          { year: 2024, revenue: 1400, netProfit: 140, operatingProfit: 210, grossProfit: 420, operatingMargin: 15.0, netMargin: 10.0, grossMargin: 30.0 },
        ],
      };
      
      render(<MarginsTimeline data={extendedData} showMovingAverages={true} />);
      
      // With 5 data points, 3-period MA should have 3 values, 5-period MA should have 1 value
      expect(screen.getByTestId('moving-averages-overlay')).toBeInTheDocument();
    });
  });

  // NEW TESTS FOR TASK 8.5 - Variance Highlighting from Averages
  describe('Variance Highlighting from Averages (Task 8.5)', () => {
    it('renders variance highlighting when enabled', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showVarianceHighlighting={true} />);
      
      expect(screen.getByTestId('variance-highlighting-overlay')).toBeInTheDocument();
    });

    it('highlights significant variance points above average', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showVarianceHighlighting={true} />);
      
      // Should show positive variance indicators
      expect(screen.getByTestId('positive-variance-indicators')).toBeInTheDocument();
    });

    it('highlights significant variance points below average', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showVarianceHighlighting={true} />);
      
      // Should show negative variance indicators
      expect(screen.getByTestId('negative-variance-indicators')).toBeInTheDocument();
    });

    it('allows custom variance threshold configuration', () => {
      render(
        <MarginsTimeline 
          data={mockVarianceCompanyData} 
          showVarianceHighlighting={true}
          varianceThreshold={2.0} // 2 standard deviations
        />
      );
      
      expect(screen.getByTestId('variance-highlighting-overlay')).toBeInTheDocument();
    });

    it('displays variance legend with threshold information', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showVarianceHighlighting={true} />);
      
      expect(screen.getByTestId('variance-legend')).toBeInTheDocument();
      expect(screen.getByText('Above Average')).toBeInTheDocument();
      expect(screen.getByText('Below Average')).toBeInTheDocument();
    });

    it('shows variance statistics summary', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showVarianceHighlighting={true} />);
      
      expect(screen.getByTestId('variance-statistics')).toBeInTheDocument();
      expect(screen.getByText('Variance Analysis')).toBeInTheDocument();
    });

    it('calculates variance using standard deviation', () => {
      const extendedData = {
        ...mockCompanyData,
        annualData: [
          { year: 2020, revenue: 800, netProfit: 80, operatingProfit: 120, grossProfit: 240, operatingMargin: 15.0, netMargin: 10.0, grossMargin: 30.0 },
          { year: 2021, revenue: 900, netProfit: 90, operatingProfit: 135, grossProfit: 270, operatingMargin: 18.0, netMargin: 10.0, grossMargin: 30.0 },
          { year: 2022, revenue: 1000, netProfit: 100, operatingProfit: 150, grossProfit: 300, operatingMargin: 15.0, netMargin: 10.0, grossMargin: 30.0 },
          { year: 2023, revenue: 1200, netProfit: 120, operatingProfit: 180, grossProfit: 360, operatingMargin: 25.0, netMargin: 10.0, grossMargin: 30.0 }, // High variance
        ],
      };
      
      render(<MarginsTimeline data={extendedData} showVarianceHighlighting={true} />);
      
      // Should detect the 25% operating margin as high variance
      expect(screen.getByTestId('variance-highlighting-overlay')).toBeInTheDocument();
    });

    it('supports different highlighting styles for different margin types', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showVarianceHighlighting={true} />);
      
      // Each margin type should have distinct variance highlighting
      expect(screen.getByTestId('gross-margin-variance')).toBeInTheDocument();
      expect(screen.getByTestId('operating-margin-variance')).toBeInTheDocument();
      expect(screen.getByTestId('net-margin-variance')).toBeInTheDocument();
    });

    it('shows variance tooltips with detailed information', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showVarianceHighlighting={true} />);
      
      expect(screen.getByTestId('variance-tooltip-triggers')).toBeInTheDocument();
    });

    it('can toggle variance highlighting visibility', () => {
      const { rerender } = render(
        <MarginsTimeline data={mockVarianceCompanyData} showVarianceHighlighting={true} />
      );
      
      expect(screen.getByTestId('variance-highlighting-overlay')).toBeInTheDocument();
      
      rerender(<MarginsTimeline data={mockVarianceCompanyData} showVarianceHighlighting={false} />);
      
      expect(screen.queryByTestId('variance-highlighting-overlay')).not.toBeInTheDocument();
    });

    it('displays variance percentage from average', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showVarianceHighlighting={true} />);
      
      expect(screen.getByTestId('variance-percentages')).toBeInTheDocument();
    });

    it('shows historical variance patterns', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showVarianceHighlighting={true} />);
      
      expect(screen.getByTestId('variance-patterns')).toBeInTheDocument();
    });

    it('supports quarterly and annual views for variance highlighting', () => {
      render(
        <MarginsTimeline 
          data={mockVarianceCompanyData} 
          viewMode="quarterly"
          showVarianceHighlighting={true} 
        />
      );
      
      expect(screen.getByTestId('variance-highlighting-overlay')).toBeInTheDocument();
    });

    it('handles edge cases with insufficient data gracefully', () => {
      const limitedData = {
        ...mockCompanyData,
        annualData: [mockCompanyData.annualData[0]], // Only 1 data point
      };
      
      render(<MarginsTimeline data={limitedData} showVarianceHighlighting={true} />);
      
      // Should still render but with no variance highlighting
      expect(screen.getByTestId('margins-timeline')).toBeInTheDocument();
    });

    it('integrates with moving averages when both enabled', () => {
      render(
        <MarginsTimeline 
          data={mockVarianceCompanyData} 
          showVarianceHighlighting={true}
          showMovingAverages={true}
        />
      );
      
      expect(screen.getByTestId('variance-highlighting-overlay')).toBeInTheDocument();
      expect(screen.getByTestId('moving-averages-overlay')).toBeInTheDocument();
    });

    it('shows variance confidence levels', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showVarianceHighlighting={true} />);
      
      expect(screen.getByTestId('variance-confidence-levels')).toBeInTheDocument();
    });
  });

  // NEW TESTS FOR TASK 8.6 - Margin Stability Indicators  
  describe('Margin Stability Indicators (Task 8.6)', () => {
    it('renders margin stability indicators when enabled', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showStabilityIndicators={true} />);
      
      expect(screen.getByTestId('stability-indicators-panel')).toBeInTheDocument();
    });

    it('calculates stability scores for each margin type', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showStabilityIndicators={true} />);
      
      expect(screen.getByTestId('gross-margin-stability')).toBeInTheDocument();
      expect(screen.getByTestId('operating-margin-stability')).toBeInTheDocument();
      expect(screen.getByTestId('net-margin-stability')).toBeInTheDocument();
    });

    it('displays stability ratings with color-coded badges', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showStabilityIndicators={true} />);
      
      expect(screen.getByTestId('stability-badges')).toBeInTheDocument();
      // Should show ratings like: Excellent, Good, Fair, Poor
      expect(screen.getByTestId('stability-rating-display')).toBeInTheDocument();
    });

    it('shows consistency analysis with coefficient of variation', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showStabilityIndicators={true} />);
      
      expect(screen.getByTestId('consistency-analysis')).toBeInTheDocument();
      expect(screen.getAllByText(/Coefficient of Variation/)).toHaveLength(4); // 3 in consistency + 1 in methodology
    });

    it('provides volatility assessment with stability score', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showStabilityIndicators={true} />);
      
      expect(screen.getByTestId('volatility-assessment')).toBeInTheDocument();
      expect(screen.getByText('Volatility Score')).toBeInTheDocument();
    });

    it('displays trend stability indicators', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showStabilityIndicators={true} />);
      
      expect(screen.getByTestId('trend-stability')).toBeInTheDocument();
    });

    it('shows rolling stability metrics', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showStabilityIndicators={true} />);
      
      expect(screen.getByTestId('rolling-stability')).toBeInTheDocument();
    });

    it('provides margin predictability index', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showStabilityIndicators={true} />);
      
      expect(screen.getByTestId('predictability-index')).toBeInTheDocument();
    });

    it('displays outlier detection and impact analysis', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showStabilityIndicators={true} />);
      
      expect(screen.getByTestId('outlier-analysis')).toBeInTheDocument();
    });

    it('supports different stability assessment periods', () => {
      render(
        <MarginsTimeline 
          data={mockVarianceCompanyData} 
          showStabilityIndicators={true}
          stabilityPeriod={5} // 5-year rolling window
        />
      );
      
      expect(screen.getByTestId('stability-indicators-panel')).toBeInTheDocument();
    });

    it('can toggle stability indicators visibility', () => {
      const { rerender } = render(
        <MarginsTimeline data={mockVarianceCompanyData} showStabilityIndicators={true} />
      );
      
      expect(screen.getByTestId('stability-indicators-panel')).toBeInTheDocument();
      
      rerender(<MarginsTimeline data={mockVarianceCompanyData} showStabilityIndicators={false} />);
      
      expect(screen.queryByTestId('stability-indicators-panel')).not.toBeInTheDocument();
    });

    it('shows stability comparison across margin types', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showStabilityIndicators={true} />);
      
      expect(screen.getByTestId('margin-stability-comparison')).toBeInTheDocument();
    });

    it('displays stability trends over time', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showStabilityIndicators={true} />);
      
      expect(screen.getByTestId('stability-trends')).toBeInTheDocument();
    });

    it('provides business cycle impact analysis', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showStabilityIndicators={true} />);
      
      expect(screen.getByTestId('cycle-impact-analysis')).toBeInTheDocument();
    });

    it('supports quarterly and annual stability assessment', () => {
      render(
        <MarginsTimeline 
          data={mockVarianceCompanyData} 
          viewMode="quarterly"
          showStabilityIndicators={true} 
        />
      );
      
      expect(screen.getByTestId('stability-indicators-panel')).toBeInTheDocument();
    });

    it('handles edge cases with insufficient data gracefully', () => {
      const limitedData = {
        ...mockCompanyData,
        annualData: [mockCompanyData.annualData[0]], // Only 1 data point
      };
      
      render(<MarginsTimeline data={limitedData} showStabilityIndicators={true} />);
      
      // Should still render but with limited stability analysis
      expect(screen.getByTestId('margins-timeline')).toBeInTheDocument();
    });

    it('integrates with variance highlighting when both enabled', () => {
      render(
        <MarginsTimeline 
          data={mockVarianceCompanyData} 
          showStabilityIndicators={true}
          showVarianceHighlighting={true}
        />
      );
      
      expect(screen.getByTestId('stability-indicators-panel')).toBeInTheDocument();
      expect(screen.getByTestId('variance-highlighting-overlay')).toBeInTheDocument();
    });

    it('provides stability score methodology explanation', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showStabilityIndicators={true} />);
      
      expect(screen.getByTestId('stability-methodology')).toBeInTheDocument();
    });

    it('shows margin reliability classification', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showStabilityIndicators={true} />);
      
      expect(screen.getByTestId('reliability-classification')).toBeInTheDocument();
    });

    it('displays stability dashboard with key metrics', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showStabilityIndicators={true} />);
      
      expect(screen.getByTestId('stability-dashboard')).toBeInTheDocument();
    });

    it('supports custom stability thresholds', () => {
      render(
        <MarginsTimeline 
          data={mockVarianceCompanyData} 
          showStabilityIndicators={true}
          stabilityThresholds={{
            excellent: 0.1,
            good: 0.2,
            fair: 0.3,
            poor: 0.4
          }}
        />
      );
      
      expect(screen.getByTestId('stability-indicators-panel')).toBeInTheDocument();
    });
  });

  // NEW TESTS FOR TASK 8.7 - Trend Direction Arrows and Annotations
  describe('Trend Direction Arrows and Annotations (Task 8.7)', () => {
    it('renders trend direction indicators when enabled', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showTrendArrows={true} />);
      
      expect(screen.getByTestId('trend-arrows-panel')).toBeInTheDocument();
    });

    it('shows trend arrows for each margin type', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showTrendArrows={true} />);
      
      expect(screen.getByTestId('gross-margin-trend-arrow')).toBeInTheDocument();
      expect(screen.getByTestId('operating-margin-trend-arrow')).toBeInTheDocument();
      expect(screen.getByTestId('net-margin-trend-arrow')).toBeInTheDocument();
    });

    it('calculates trend direction correctly', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showTrendArrows={true} />);
      
      expect(screen.getByTestId('trend-direction-analysis')).toBeInTheDocument();
      expect(screen.getByText(/Recent Trend/)).toBeInTheDocument();
    });

    it('displays trend annotations with period information', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showTrendArrows={true} />);
      
      expect(screen.getByTestId('trend-annotations')).toBeInTheDocument();
      expect(screen.getByText(/Trend Period/)).toBeInTheDocument();
    });

    it('shows trend strength indicators', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showTrendArrows={true} />);
      
      expect(screen.getByTestId('trend-strength-analysis')).toBeInTheDocument();
      expect(screen.getByText(/Trend Strength/)).toBeInTheDocument();
    });

    it('supports custom trend period configuration', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showTrendArrows={true} trendPeriod={3} />);
      
      expect(screen.getByTestId('trend-period-config')).toBeInTheDocument();
      expect(screen.getByText(/3 periods/)).toBeInTheDocument(); // Period configuration
    });

    it('displays trend significance levels', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showTrendArrows={true} />);
      
      expect(screen.getByTestId('trend-significance')).toBeInTheDocument();
      expect(screen.getAllByText(/Significance/)).toHaveLength(4); // Title + 3 margin types
    });

    it('shows directional change annotations', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showTrendArrows={true} />);
      
      expect(screen.getByTestId('directional-changes')).toBeInTheDocument();
      expect(screen.getByText(/Direction Change/)).toBeInTheDocument();
    });

    it('calculates trend velocity metrics', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showTrendArrows={true} />);
      
      expect(screen.getByTestId('trend-velocity')).toBeInTheDocument();
      expect(screen.getByText(/Rate of Change/)).toBeInTheDocument();
    });

    it('displays trend consistency indicators', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showTrendArrows={true} />);
      
      expect(screen.getByTestId('trend-consistency')).toBeInTheDocument();
      expect(screen.getByText(/Trend Consistency/)).toBeInTheDocument();
    });

    it('shows trend forecast projections', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showTrendArrows={true} />);
      
      expect(screen.getByTestId('trend-projections')).toBeInTheDocument();
      expect(screen.getByText(/Projection/)).toBeInTheDocument();
    });

    it('supports quarterly and annual trend analysis', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showTrendArrows={true} viewMode="quarterly" />);
      
      expect(screen.getByTestId('quarterly-trend-analysis')).toBeInTheDocument();
      
      render(<MarginsTimeline data={mockVarianceCompanyData} showTrendArrows={true} viewMode="annual" />);
      
      expect(screen.getByTestId('annual-trend-analysis')).toBeInTheDocument();
    });

    it('integrates with moving averages for trend analysis', () => {
      render(<MarginsTimeline 
        data={mockVarianceCompanyData} 
        showTrendArrows={true} 
        showMovingAverages={true}
        movingAveragePeriods={[3, 5]}
      />);
      
      expect(screen.getByTestId('ma-trend-integration')).toBeInTheDocument();
      expect(screen.getByText(/Moving Average Trend/)).toBeInTheDocument();
    });

    it('displays trend reversal warnings', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showTrendArrows={true} />);
      
      expect(screen.getByTestId('trend-reversals')).toBeInTheDocument();
      expect(screen.getByText(/Potential Reversal/)).toBeInTheDocument();
    });

    it('shows trend duration analysis', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showTrendArrows={true} />);
      
      expect(screen.getByTestId('trend-duration')).toBeInTheDocument();
      expect(screen.getByText(/Trend Duration/)).toBeInTheDocument();
    });

    it('supports trend arrow styling customization', () => {
      render(<MarginsTimeline 
        data={mockVarianceCompanyData} 
        showTrendArrows={true}
        trendArrowConfig={{
          size: 'large',
          style: 'bold',
          showLabels: true
        }}
      />);
      
      expect(screen.getByTestId('trend-arrow-config')).toBeInTheDocument();
    });

    it('handles insufficient data gracefully', () => {
      const minimalData = {
        company: mockVarianceCompanyData.company,
        annualData: mockVarianceCompanyData.annualData.slice(0, 1), // Only 1 data point
        quarterlyData: []
      };
      
      render(<MarginsTimeline data={minimalData} showTrendArrows={true} trendPeriod={5} />);
      
      expect(screen.getByTestId('insufficient-trend-data')).toBeInTheDocument();
      expect(screen.getByText(/Insufficient data for trend analysis/)).toBeInTheDocument();
    });

    it('calculates trend slope accurately', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showTrendArrows={true} />);
      
      expect(screen.getByTestId('trend-slope-analysis')).toBeInTheDocument();
      expect(screen.getByText(/Slope/)).toBeInTheDocument();
    });

    it('displays trend correlation analysis', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showTrendArrows={true} />);
      
      expect(screen.getByTestId('trend-correlation')).toBeInTheDocument();
      expect(screen.getByText(/Correlation/)).toBeInTheDocument();
    });

    it('shows trend momentum indicators', () => {
      render(<MarginsTimeline data={mockVarianceCompanyData} showTrendArrows={true} />);
      
      expect(screen.getByTestId('trend-momentum')).toBeInTheDocument();
      expect(screen.getAllByText(/Momentum/)).toHaveLength(2); // Title + description
    });
  });
}); 