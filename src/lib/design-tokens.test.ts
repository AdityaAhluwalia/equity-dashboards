import { colors, getPhaseColors, getChartColor } from './design-tokens'

describe('Design Tokens', () => {
  describe('colors', () => {
    it('should have all required base colors', () => {
      expect(colors.background).toBeDefined()
      expect(colors.foreground).toBeDefined()
      expect(colors.primary).toBeDefined()
      expect(colors.secondary).toBeDefined()
    })

    it('should have all phase colors', () => {
      expect(colors.phase.expansion).toBeDefined()
      expect(colors.phase.contraction).toBeDefined()
      expect(colors.phase.transition).toBeDefined()
      expect(colors.phase.stable).toBeDefined()
    })

    it('should have all chart colors', () => {
      expect(colors.chart[1]).toBeDefined()
      expect(colors.chart[2]).toBeDefined()
      expect(colors.chart[3]).toBeDefined()
      expect(colors.chart[4]).toBeDefined()
      expect(colors.chart[5]).toBeDefined()
      expect(colors.chart[6]).toBeDefined()
    })

    it('should have status colors', () => {
      expect(colors.success).toBeDefined()
      expect(colors.warning).toBeDefined()
      expect(colors.destructive).toBeDefined()
    })
  })

  describe('getPhaseColors', () => {
    it('should return correct colors for expansion phase', () => {
      const phaseColors = getPhaseColors('expansion')
      expect(phaseColors.background).toBe(colors.phase.expansion)
      expect(phaseColors.foreground).toBe(colors.phase.expansionForeground)
      expect(phaseColors.border).toBe(colors.phase.expansionBorder)
    })

    it('should return correct colors for contraction phase', () => {
      const phaseColors = getPhaseColors('contraction')
      expect(phaseColors.background).toBe(colors.phase.contraction)
      expect(phaseColors.foreground).toBe(colors.phase.contractionForeground)
      expect(phaseColors.border).toBe(colors.phase.contractionBorder)
    })

    it('should return correct colors for transition phase', () => {
      const phaseColors = getPhaseColors('transition')
      expect(phaseColors.background).toBe(colors.phase.transition)
      expect(phaseColors.foreground).toBe(colors.phase.transitionForeground)
      expect(phaseColors.border).toBe(colors.phase.transitionBorder)
    })

    it('should return correct colors for stable phase', () => {
      const phaseColors = getPhaseColors('stable')
      expect(phaseColors.background).toBe(colors.phase.stable)
      expect(phaseColors.foreground).toBe(colors.phase.stableForeground)
      expect(phaseColors.border).toBe(colors.phase.stableBorder)
    })
  })

  describe('getChartColor', () => {
    it('should return first chart color for index 0', () => {
      expect(getChartColor(0)).toBe(colors.chart[1])
    })

    it('should return second chart color for index 1', () => {
      expect(getChartColor(1)).toBe(colors.chart[2])
    })

    it('should cycle through colors when index exceeds available colors', () => {
      expect(getChartColor(6)).toBe(colors.chart[1]) // Should wrap around
      expect(getChartColor(7)).toBe(colors.chart[2])
    })

    it('should handle negative indices', () => {
      expect(getChartColor(-1)).toBe(colors.chart[6]) // Should wrap to last color
    })
  })
}) 