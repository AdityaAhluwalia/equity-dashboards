import { 
  getChartTheme, 
  formatChartData, 
  getPhaseColor,
  createPhaseAreas,
  type PhaseData 
} from './chart-config'

describe('Chart Configuration', () => {
  describe('getChartTheme', () => {
    it('should return light theme configuration', () => {
      const theme = getChartTheme('light')
      
      expect(theme.background).toBeDefined()
      expect(theme.text).toBeDefined()
      expect(theme.grid).toBeDefined()
      expect(theme.axis).toBeDefined()
    })

    it('should return dark theme configuration', () => {
      const theme = getChartTheme('dark')
      
      expect(theme.background).toBeDefined()
      expect(theme.text).toBeDefined()
      expect(theme.grid).toBeDefined()
      expect(theme.axis).toBeDefined()
    })

    it('should return system theme configuration', () => {
      const theme = getChartTheme('system')
      
      expect(theme.background).toBeDefined()
      expect(theme.text).toBeDefined()
      expect(theme.grid).toBeDefined()
      expect(theme.axis).toBeDefined()
    })
  })

  describe('formatChartData', () => {
    const mockData = [
      { quarter: 'Q1FY24', revenue: 100000, netIncome: 10000 },
      { quarter: 'Q2FY24', revenue: 120000, netIncome: 12000 },
      { quarter: 'Q3FY24', revenue: 110000, netIncome: 11000 },
    ]

    it('should format data for chart consumption', () => {
      const formatted = formatChartData(mockData, 'quarter')
      
      expect(formatted).toHaveLength(3)
      expect(formatted[0]).toHaveProperty('x', 'Q1FY24')
      expect(formatted[0]).toHaveProperty('revenue', 100000)
      expect(formatted[0]).toHaveProperty('netIncome', 10000)
    })

    it('should handle empty data array', () => {
      const formatted = formatChartData([], 'quarter')
      
      expect(formatted).toEqual([])
    })

    it('should handle missing x-axis field', () => {
      const dataWithoutQuarter = [
        { revenue: 100000, netIncome: 10000 },
      ]
      
      const formatted = formatChartData(dataWithoutQuarter, 'quarter')
      
      expect(formatted).toHaveLength(1)
      expect(formatted[0]).toHaveProperty('x', undefined)
    })
  })

  describe('getPhaseColor', () => {
    it('should return correct color for expansion phase', () => {
      const color = getPhaseColor('expansion')
      expect(color).toBe('hsl(var(--color-phase-expansion))')
    })

    it('should return correct color for contraction phase', () => {
      const color = getPhaseColor('contraction')
      expect(color).toBe('hsl(var(--color-phase-contraction))')
    })

    it('should return correct color for transition phase', () => {
      const color = getPhaseColor('transition')
      expect(color).toBe('hsl(var(--color-phase-transition))')
    })

    it('should return correct color for stable phase', () => {
      const color = getPhaseColor('stable')
      expect(color).toBe('hsl(var(--color-phase-stable))')
    })
  })

  describe('createPhaseAreas', () => {
    const mockPhaseData: PhaseData[] = [
      { startQuarter: 'Q1FY23', endQuarter: 'Q2FY23', phase: 'expansion' },
      { startQuarter: 'Q3FY23', endQuarter: 'Q4FY23', phase: 'contraction' },
      { startQuarter: 'Q1FY24', endQuarter: 'Q2FY24', phase: 'stable' },
    ]

    it('should create phase areas for chart', () => {
      const areas = createPhaseAreas(mockPhaseData)
      
      expect(areas).toHaveLength(3)
      expect(areas[0]).toHaveProperty('x1', 'Q1FY23')
      expect(areas[0]).toHaveProperty('x2', 'Q2FY23')
      expect(areas[0]).toHaveProperty('fill')
    })

    it('should handle empty phase data', () => {
      const areas = createPhaseAreas([])
      
      expect(areas).toEqual([])
    })

    it('should assign correct colors to phases', () => {
      const areas = createPhaseAreas(mockPhaseData)
      
      expect(areas[0].fill).toBe('hsl(var(--color-phase-expansion))')
      expect(areas[1].fill).toBe('hsl(var(--color-phase-contraction))')
      expect(areas[2].fill).toBe('hsl(var(--color-phase-stable))')
    })
  })
}) 