import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  CAGRIndicators, 
  CAGRPeriodSelector,
  CAGRData,
  CAGRCalculationResult,
  calculateCAGRForPeriods,
  formatCAGRValue,
  CAGRTrendAnalysis,
  PeriodType
} from './CAGRIndicators';

// Mock financial data for testing
const mockFinancialData = [
  { period: 'FY24', year: 2024, revenue: 4776, netProfit: 803, totalAssets: 4176 },
  { period: 'FY23', year: 2023, revenue: 4488, netProfit: 724, totalAssets: 3890 },
  { period: 'FY22', year: 2022, revenue: 3996, netProfit: 651, totalAssets: 3654 },
  { period: 'FY21', year: 2021, revenue: 3785, netProfit: 582, totalAssets: 3421 },
  { period: 'FY20', year: 2020, revenue: 3542, netProfit: 523, totalAssets: 3198 },
  { period: 'FY19', year: 2019, revenue: 3321, netProfit: 489, totalAssets: 2987 },
  { period: 'FY18', year: 2018, revenue: 3123, netProfit: 445, totalAssets: 2776 },
  { period: 'FY17', year: 2017, revenue: 2945, netProfit: 398, totalAssets: 2565 },
  { period: 'FY16', year: 2016, revenue: 2789, netProfit: 356, totalAssets: 2354 },
  { period: 'FY15', year: 2015, revenue: 2634, netProfit: 312, totalAssets: 2145 },
  { period: 'FY14', year: 2014, revenue: 2487, netProfit: 278, totalAssets: 1987 },
  { period: 'FY13', year: 2013, revenue: 2341, netProfit: 245, totalAssets: 1834 }
];

describe('CAGR Indicators - Task 7.6', () => {
  describe('CAGR Calculation Functions', () => {
    describe('calculateCAGRForPeriods', () => {
      it('calculates 1-year CAGR correctly', () => {
        const result = calculateCAGRForPeriods(mockFinancialData, 'revenue');
        
        // 1Y CAGR: (4776/4488)^(1/1) - 1 = 6.4%
        expect(result.cagr1Y).toBeCloseTo(0.064, 2);
        expect(result.cagr1Y).toBeGreaterThan(0);
      });

      it('calculates 3-year CAGR correctly', () => {
        const result = calculateCAGRForPeriods(mockFinancialData, 'revenue');
        
        // 3Y CAGR: (4776/3996)^(1/3) - 1 = 8.06%
        expect(result.cagr3Y).toBeCloseTo(0.0806, 2);
        expect(result.cagr3Y).toBeGreaterThan(0);
      });

      it('calculates 5-year CAGR correctly', () => {
        const result = calculateCAGRForPeriods(mockFinancialData, 'revenue');
        
        // 5Y CAGR: (4776/3542)^(1/5) - 1 = 7.54%
        expect(result.cagr5Y).toBeCloseTo(0.0754, 2);
        expect(result.cagr5Y).toBeGreaterThan(0);
      });

      it('calculates 10-year CAGR correctly', () => {
        const result = calculateCAGRForPeriods(mockFinancialData, 'revenue');
        
        // 10Y CAGR: (4776/2634)^(1/10) - 1 = 6.74%
        expect(result.cagr10Y).toBeCloseTo(0.0674, 2);
        expect(result.cagr10Y).toBeGreaterThan(0);
      });

      it('handles profit CAGR calculations', () => {
        const result = calculateCAGRForPeriods(mockFinancialData, 'netProfit');
        
        expect(result.cagr1Y).toBeCloseTo(0.109, 2); // 10.9% profit growth
        expect(result.cagr3Y).toBeCloseTo(0.113, 2); // 11.3% 3Y profit CAGR
        expect(result.cagr5Y).toBeCloseTo(0.104, 2); // 10.4% 5Y profit CAGR
        expect(result.cagr10Y).toBeCloseTo(0.112, 2); // 11.2% 10Y profit CAGR
      });

      it('handles asset CAGR calculations', () => {
        const result = calculateCAGRForPeriods(mockFinancialData, 'totalAssets');
        
        expect(result.cagr1Y).toBeCloseTo(0.073, 2); // 7.3% asset growth
        expect(result.cagr3Y).toBeCloseTo(0.069, 2); // 6.9% 3Y asset CAGR
        expect(result.cagr5Y).toBeCloseTo(0.066, 2); // 6.6% 5Y asset CAGR
        expect(result.cagr10Y).toBeCloseTo(0.082, 2); // 8.2% 10Y asset CAGR
      });

      it('handles insufficient data gracefully', () => {
        const limitedData = mockFinancialData.slice(0, 2);
        const result = calculateCAGRForPeriods(limitedData, 'revenue');
        
        expect(result.cagr1Y).toBeCloseTo(0.064, 2);
        expect(result.cagr3Y).toBe(0); // Not enough data
        expect(result.cagr5Y).toBe(0); // Not enough data
        expect(result.cagr10Y).toBe(0); // Not enough data
      });

      it('handles zero and negative values', () => {
        const problematicData = [
          { period: 'FY24', year: 2024, revenue: 0, netProfit: -100, totalAssets: 1000 },
          { period: 'FY23', year: 2023, revenue: 1000, netProfit: -200, totalAssets: 900 },
          { period: 'FY22', year: 2022, revenue: 2000, netProfit: -150, totalAssets: 800 }
        ];
        
        const revenueResult = calculateCAGRForPeriods(problematicData, 'revenue');
        const profitResult = calculateCAGRForPeriods(problematicData, 'netProfit');
        
        expect(revenueResult.cagr1Y).toBe(-1); // Complete decline
        expect(profitResult.cagr1Y).toBe(0.5); // Relative change from -200 to -100
      });
    });

    describe('formatCAGRValue', () => {
      it('formats positive CAGR values correctly', () => {
        expect(formatCAGRValue(0.064)).toBe('+6.4%');
        expect(formatCAGRValue(0.123)).toBe('+12.3%');
        expect(formatCAGRValue(0.001)).toBe('+0.1%');
      });

      it('formats negative CAGR values correctly', () => {
        expect(formatCAGRValue(-0.064)).toBe('-6.4%');
        expect(formatCAGRValue(-0.123)).toBe('-12.3%');
        expect(formatCAGRValue(-1)).toBe('-100.0%');
      });

      it('formats zero CAGR correctly', () => {
        expect(formatCAGRValue(0)).toBe('0.0%');
        expect(formatCAGRValue(0.0001)).toBe('+0.0%');
      });

      it('handles extreme values', () => {
        expect(formatCAGRValue(1.5)).toBe('+150.0%');
        expect(formatCAGRValue(-0.99)).toBe('-99.0%');
      });
    });

    describe('CAGRTrendAnalysis', () => {
      it('analyzes trend consistency correctly', () => {
        const data: CAGRData[] = [
          { period: 'FY24', cagr1Y: 0.06, cagr3Y: 0.06, cagr5Y: 0.06, cagr10Y: 0.06 },
          { period: 'FY23', cagr1Y: 0.08, cagr3Y: 0.07, cagr5Y: 0.06, cagr10Y: 0.06 },
          { period: 'FY22', cagr1Y: 0.05, cagr3Y: 0.06, cagr5Y: 0.06, cagr10Y: 0.06 }
        ];
        
        const analysis = new CAGRTrendAnalysis(data);
        const consistency = analysis.getConsistency();
        
        expect(consistency.score).toBeGreaterThan(0.8); // Should be consistent
        expect(consistency.classification).toBe('consistent');
      });

      it('identifies accelerating trends', () => {
        const data: CAGRData[] = [
          { period: 'FY24', cagr1Y: 0.10, cagr3Y: 0.08, cagr5Y: 0.06, cagr10Y: 0.05 },
          { period: 'FY23', cagr1Y: 0.08, cagr3Y: 0.06, cagr5Y: 0.05, cagr10Y: 0.04 },
          { period: 'FY22', cagr1Y: 0.06, cagr3Y: 0.05, cagr5Y: 0.04, cagr10Y: 0.04 }
        ];
        
        const analysis = new CAGRTrendAnalysis(data);
        const acceleration = analysis.getAcceleration();
        
        expect(acceleration.trend).toBe('accelerating');
        expect(acceleration.rate).toBeGreaterThan(0);
      });

      it('identifies decelerating trends', () => {
        const data: CAGRData[] = [
          { period: 'FY24', cagr1Y: 0.03, cagr3Y: 0.05, cagr5Y: 0.07, cagr10Y: 0.08 },
          { period: 'FY23', cagr1Y: 0.05, cagr3Y: 0.07, cagr5Y: 0.08, cagr10Y: 0.09 },
          { period: 'FY22', cagr1Y: 0.07, cagr3Y: 0.08, cagr5Y: 0.09, cagr10Y: 0.09 }
        ];
        
        const analysis = new CAGRTrendAnalysis(data);
        const acceleration = analysis.getAcceleration();
        
        expect(acceleration.trend).toBe('decelerating');
        expect(acceleration.rate).toBeLessThan(0);
      });

      it('calculates volatility correctly', () => {
        const data: CAGRData[] = [
          { period: 'FY24', cagr1Y: 0.10, cagr3Y: 0.06, cagr5Y: 0.06, cagr10Y: 0.06 },
          { period: 'FY23', cagr1Y: 0.02, cagr3Y: 0.06, cagr5Y: 0.06, cagr10Y: 0.06 },
          { period: 'FY22', cagr1Y: 0.15, cagr3Y: 0.06, cagr5Y: 0.06, cagr10Y: 0.06 }
        ];
        
        const analysis = new CAGRTrendAnalysis(data);
        const volatility = analysis.getVolatility();
        
        expect(volatility.cagr1YVolatility).toBeGreaterThan(0.02); // High 1Y volatility
        expect(volatility.cagr5YVolatility).toBeLessThan(0.01); // Low 5Y volatility
      });
    });
  });

  describe('CAGRPeriodSelector Component', () => {
    const mockPeriods: PeriodType[] = ['1Y', '3Y', '5Y', '10Y'];
    const mockOnPeriodChange = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders all period options', () => {
      render(
        <CAGRPeriodSelector
          periods={mockPeriods}
          selectedPeriod="3Y"
          onPeriodChange={mockOnPeriodChange}
        />
      );

      expect(screen.getByText('1Y')).toBeInTheDocument();
      expect(screen.getByText('3Y')).toBeInTheDocument();
      expect(screen.getByText('5Y')).toBeInTheDocument();
      expect(screen.getByText('10Y')).toBeInTheDocument();
    });

    it('highlights selected period', () => {
      render(
        <CAGRPeriodSelector
          periods={mockPeriods}
          selectedPeriod="5Y"
          onPeriodChange={mockOnPeriodChange}
        />
      );

      const selectedButton = screen.getByText('5Y').closest('button');
      expect(selectedButton).toHaveClass('bg-blue-100');
    });

    it('calls onPeriodChange when period is clicked', () => {
      render(
        <CAGRPeriodSelector
          periods={mockPeriods}
          selectedPeriod="3Y"
          onPeriodChange={mockOnPeriodChange}
        />
      );

      fireEvent.click(screen.getByText('5Y'));
      expect(mockOnPeriodChange).toHaveBeenCalledWith('5Y');
    });

    it('shows disabled state correctly', () => {
      render(
        <CAGRPeriodSelector
          periods={mockPeriods}
          selectedPeriod="3Y"
          onPeriodChange={mockOnPeriodChange}
          disabled={true}
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });

    it('shows loading state', () => {
      render(
        <CAGRPeriodSelector
          periods={mockPeriods}
          selectedPeriod="3Y"
          onPeriodChange={mockOnPeriodChange}
          loading={true}
        />
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('displays period descriptions on hover', async () => {
      render(
        <CAGRPeriodSelector
          periods={mockPeriods}
          selectedPeriod="3Y"
          onPeriodChange={mockOnPeriodChange}
          showDescriptions={true}
        />
      );

      const threeYearButton = screen.getByText('3Y');
      fireEvent.mouseEnter(threeYearButton);

      await waitFor(() => {
        expect(screen.getByText(/3 Year Compound Annual Growth Rate/i)).toBeInTheDocument();
      });
    });
  });

  describe('CAGRIndicators Component', () => {
    const mockCAGRData: CAGRData[] = [
      {
        period: 'FY24',
        cagr1Y: 0.064,
        cagr3Y: 0.0806,
        cagr5Y: 0.0754,
        cagr10Y: 0.0674
      },
      {
        period: 'FY23',
        cagr1Y: 0.082,
        cagr3Y: 0.065,
        cagr5Y: 0.065,
        cagr10Y: 0.062
      }
    ];

    const mockOnPeriodChange = jest.fn();
    const mockOnMetricClick = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders CAGR indicators correctly', () => {
      render(
        <CAGRIndicators
          data={mockCAGRData}
          selectedPeriod="3Y"
          onPeriodChange={mockOnPeriodChange}
          onMetricClick={mockOnMetricClick}
        />
      );

      expect(screen.getAllByText('+8.1%')[0]).toBeInTheDocument(); // 3Y CAGR (main display)
      expect(screen.getByText('3Y CAGR')).toBeInTheDocument();
    });

    it('shows trend indicators', () => {
      render(
        <CAGRIndicators
          data={mockCAGRData}
          selectedPeriod="3Y"
          onPeriodChange={mockOnPeriodChange}
          onMetricClick={mockOnMetricClick}
          showTrends={true}
        />
      );

      // Should show trend arrow or indicator
      const trendElements = screen.getAllByText(/↗|↘|→/);
      expect(trendElements.length).toBeGreaterThan(0);
    });

    it('displays comparison with previous period', () => {
      render(
        <CAGRIndicators
          data={mockCAGRData}
          selectedPeriod="3Y"
          onPeriodChange={mockOnPeriodChange}
          onMetricClick={mockOnMetricClick}
          showComparison={true}
        />
      );

      // Should show period-over-period change
      expect(screen.getByText(/vs previous/i)).toBeInTheDocument();
    });

    it('handles metric clicks', () => {
      render(
        <CAGRIndicators
          data={mockCAGRData}
          selectedPeriod="3Y"
          onPeriodChange={mockOnPeriodChange}
          onMetricClick={mockOnMetricClick}
        />
      );

      const cagrValue = screen.getAllByText('+8.1%')[0]; // Get the main display
      fireEvent.click(cagrValue);

      expect(mockOnMetricClick).toHaveBeenCalledWith('3Y', 0.0806, expect.any(Object));
    });

    it('shows loading state', () => {
      render(
        <CAGRIndicators
          data={[]}
          selectedPeriod="3Y"
          onPeriodChange={mockOnPeriodChange}
          onMetricClick={mockOnMetricClick}
          loading={true}
        />
      );

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('shows error state', () => {
      render(
        <CAGRIndicators
          data={[]}
          selectedPeriod="3Y"
          onPeriodChange={mockOnPeriodChange}
          onMetricClick={mockOnMetricClick}
          error="Failed to calculate CAGR"
        />
      );

      expect(screen.getByText(/failed to calculate/i)).toBeInTheDocument();
    });

    it('displays confidence indicators', () => {
      render(
        <CAGRIndicators
          data={mockCAGRData}
          selectedPeriod="5Y"
          onPeriodChange={mockOnPeriodChange}
          onMetricClick={mockOnMetricClick}
          showConfidence={true}
        />
      );

      // Should show confidence score or indicator
      expect(screen.getByText(/confidence/i)).toBeInTheDocument();
    });

    it('shows volatility warnings', () => {
      const volatileData: CAGRData[] = [
        { period: 'FY24', cagr1Y: 0.15, cagr3Y: 0.08, cagr5Y: 0.06, cagr10Y: 0.05 },
        { period: 'FY23', cagr1Y: -0.05, cagr3Y: 0.10, cagr5Y: 0.07, cagr10Y: 0.06 }
      ];

      render(
        <CAGRIndicators
          data={volatileData}
          selectedPeriod="1Y"
          onPeriodChange={mockOnPeriodChange}
          onMetricClick={mockOnMetricClick}
          showVolatilityWarning={true}
        />
      );

      expect(screen.getByText(/volatile/i)).toBeInTheDocument();
    });

    it('handles period selector integration', () => {
      render(
        <CAGRIndicators
          data={mockCAGRData}
          selectedPeriod="3Y"
          onPeriodChange={mockOnPeriodChange}
          onMetricClick={mockOnMetricClick}
          showPeriodSelector={true}
        />
      );

      // Should include period selector - get buttons specifically
      const periodButtons = screen.getAllByRole('button');
      const button1Y = periodButtons.find(btn => btn.textContent === '1Y');
      const button5Y = periodButtons.find(btn => btn.textContent === '5Y');
      
      expect(button1Y).toBeInTheDocument();
      expect(button5Y).toBeInTheDocument();

      // Test period change
      if (button5Y) fireEvent.click(button5Y);
      expect(mockOnPeriodChange).toHaveBeenCalledWith('5Y');
    });
  });

  describe('Integration and Performance Tests', () => {
    it('calculates CAGR efficiently for large datasets', () => {
      const largeDataset = Array.from({ length: 20 }, (_, i) => ({
        period: `FY${2024 - i}`,
        year: 2024 - i,
        revenue: 1000 + i * 100,
        netProfit: 100 + i * 10,
        totalAssets: 2000 + i * 200
      }));

      const startTime = performance.now();
      const result = calculateCAGRForPeriods(largeDataset, 'revenue');
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(10); // Should complete in <10ms
      expect(result.cagr10Y).toBeDefined();
    });

    it('maintains precision in CAGR calculations', () => {
      const result = calculateCAGRForPeriods(mockFinancialData, 'revenue');
      
      // Should maintain 3 decimal precision
      expect(result.cagr1Y.toString()).toMatch(/^\d+\.\d{3,}$/);
      expect(result.cagr3Y.toString()).toMatch(/^\d+\.\d{3,}$/);
    });

    it('produces consistent results across multiple runs', () => {
      const run1 = calculateCAGRForPeriods(mockFinancialData, 'revenue');
      const run2 = calculateCAGRForPeriods(mockFinancialData, 'revenue');
      const run3 = calculateCAGRForPeriods(mockFinancialData, 'revenue');

      expect(run1.cagr3Y).toBe(run2.cagr3Y);
      expect(run2.cagr3Y).toBe(run3.cagr3Y);
    });

    it('handles real-world data edge cases', () => {
      const realWorldData = [
        { period: 'FY24', year: 2024, revenue: 4776, netProfit: 803, totalAssets: 4176 },
        { period: 'FY23', year: 2023, revenue: 4488, netProfit: 724, totalAssets: 3890 },
        { period: 'FY21', year: 2021, revenue: 3785, netProfit: 582, totalAssets: 3421 }, // Missing FY22
        { period: 'FY20', year: 2020, revenue: 3542, netProfit: 523, totalAssets: 3198 }
      ];

      expect(() => calculateCAGRForPeriods(realWorldData, 'revenue')).not.toThrow();
      const result = calculateCAGRForPeriods(realWorldData, 'revenue');
      expect(result.cagr1Y).toBeCloseTo(0.064, 2);
    });
  });

  describe('Accessibility and UX Tests', () => {
    const accessibilityTestData: CAGRData[] = [
      {
        period: 'FY24',
        cagr1Y: 0.064,
        cagr3Y: 0.0806,
        cagr5Y: 0.0754,
        cagr10Y: 0.0674
      }
    ];

    it('provides proper ARIA labels', () => {
      render(
        <CAGRIndicators
          data={accessibilityTestData}
          selectedPeriod="3Y"
          onPeriodChange={jest.fn()}
          onMetricClick={jest.fn()}
        />
      );

      expect(screen.getByLabelText(/cagr indicators/i)).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      render(
        <CAGRPeriodSelector
          periods={['1Y', '3Y', '5Y', '10Y']}
          selectedPeriod="3Y"
          onPeriodChange={jest.fn()}
        />
      );

      const firstButton = screen.getByText('1Y');
      firstButton.focus();
      expect(document.activeElement).toBe(firstButton);

      // Test tab navigation
      fireEvent.keyDown(firstButton, { key: 'Tab' });
    });

    it('provides meaningful error messages', () => {
      render(
        <CAGRIndicators
          data={[]}
          selectedPeriod="3Y"
          onPeriodChange={jest.fn()}
          onMetricClick={jest.fn()}
          error="Insufficient data for CAGR calculation. Need at least 2 years of data."
        />
      );

      expect(screen.getByText(/insufficient data for cagr calculation/i)).toBeInTheDocument();
    });

    it('shows helpful tooltips', async () => {
      render(
        <CAGRIndicators
          data={accessibilityTestData}
          selectedPeriod="3Y"
          onPeriodChange={jest.fn()}
          onMetricClick={jest.fn()}
          showTooltips={true}
        />
      );

      const cagrValue = screen.getAllByText('+8.1%')[0];
      fireEvent.mouseEnter(cagrValue);

      await waitFor(() => {
        expect(screen.getByText(/compound annual growth rate/i)).toBeInTheDocument();
      });
    });
  });
}); 