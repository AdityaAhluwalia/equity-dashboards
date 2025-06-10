import { colors, type PhaseType } from './design-tokens'

export interface ChartTheme {
  background: string
  text: string
  grid: string
  axis: string
  tooltip: {
    background: string
    border: string
    text: string
  }
}

export interface PhaseData {
  startQuarter: string
  endQuarter: string
  phase: PhaseType
}

export interface PhaseArea {
  x1: string
  x2: string
  fill: string
  fillOpacity: number
}

export interface ChartDataPoint {
  x: string | number | null | undefined
  [key: string]: string | number | boolean | null | undefined
}

/**
 * Get chart theme configuration based on theme preference
 */
export function getChartTheme(theme: 'light' | 'dark' | 'system'): ChartTheme {
  // For system theme, default to light (in real app, would check system preference)
  const isDark = theme === 'dark'
  
  return {
    background: isDark ? '#0a0a0a' : '#fefefe',
    text: isDark ? '#fafafa' : '#1a1a1a',
    grid: isDark ? '#27272a' : '#e5e7eb',
    axis: isDark ? '#a1a1aa' : '#6b7280',
    tooltip: {
      background: isDark ? '#1a1a1a' : '#ffffff',
      border: isDark ? '#27272a' : '#e5e7eb',
      text: isDark ? '#fafafa' : '#1a1a1a',
    },
  }
}

/**
 * Format data for chart consumption with consistent x-axis naming
 */
export function formatChartData(
  data: Record<string, string | number | boolean | null | undefined>[], 
  xAxisField: string
): ChartDataPoint[] {
  return data.map(item => ({
    x: item[xAxisField],
    ...item,
  }))
}

/**
 * Get phase color from design tokens
 */
export function getPhaseColor(phase: PhaseType): string {
  return colors.phase[phase]
}

/**
 * Create phase areas for chart background visualization
 */
export function createPhaseAreas(phaseData: PhaseData[]): PhaseArea[] {
  return phaseData.map(phase => ({
    x1: phase.startQuarter,
    x2: phase.endQuarter,
    fill: getPhaseColor(phase.phase),
    fillOpacity: 0.1,
  }))
}

/**
 * Default chart colors for multiple data series
 */
export const CHART_COLORS = {
  primary: colors.chart[1],
  secondary: colors.chart[2],
  tertiary: colors.chart[3],
  quaternary: colors.chart[4],
  quinary: colors.chart[5],
  senary: colors.chart[6],
} as const

/**
 * Common chart configuration options
 */
export const CHART_CONFIG = {
  margin: { top: 20, right: 30, left: 20, bottom: 20 },
  animationDuration: 300,
  strokeWidth: 2,
  dotSize: 4,
  gridStrokeDasharray: '3 3',
} as const

/**
 * Responsive chart dimensions
 */
export const CHART_DIMENSIONS = {
  mobile: { width: '100%', height: 300 },
  tablet: { width: '100%', height: 400 },
  desktop: { width: '100%', height: 500 },
} as const

/**
 * Format numbers for chart display
 */
export function formatChartValue(value: number, type: 'currency' | 'percentage' | 'number' = 'number'): string {
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(value)
    
    case 'percentage':
      return new Intl.NumberFormat('en-IN', {
        style: 'percent',
        maximumFractionDigits: 1,
      }).format(value / 100)
    
    case 'number':
    default:
      return new Intl.NumberFormat('en-IN', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(value)
  }
}

/**
 * Generate tick values for chart axes
 */
export function generateTicks(min: number, max: number, count: number = 5): number[] {
  const step = (max - min) / (count - 1)
  return Array.from({ length: count }, (_, i) => min + i * step)
}

/**
 * Calculate chart domain with padding
 */
export function calculateDomain(data: number[], padding: number = 0.1): [number, number] {
  if (data.length === 0) return [0, 100]
  
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min
  const paddingValue = range * padding
  
  return [
    Math.max(0, min - paddingValue),
    max + paddingValue
  ]
} 