/**
 * Design tokens and color utilities for the Equity Dashboard
 * Based on Apple-inspired design with pastel colors
 */

export const colors = {
  // Base colors
  background: 'hsl(var(--color-background))',
  foreground: 'hsl(var(--color-foreground))',
  muted: 'hsl(var(--color-muted))',
  mutedForeground: 'hsl(var(--color-muted-foreground))',
  border: 'hsl(var(--color-border))',
  input: 'hsl(var(--color-input))',
  ring: 'hsl(var(--color-ring))',

  // Brand colors
  primary: 'hsl(var(--color-primary))',
  primaryForeground: 'hsl(var(--color-primary-foreground))',
  secondary: 'hsl(var(--color-secondary))',
  secondaryForeground: 'hsl(var(--color-secondary-foreground))',
  accent: 'hsl(var(--color-accent))',
  accentForeground: 'hsl(var(--color-accent-foreground))',

  // Phase colors for cycle identification
  phase: {
    expansion: 'hsl(var(--color-phase-expansion))',
    expansionForeground: 'hsl(var(--color-phase-expansion-foreground))',
    expansionBorder: 'hsl(var(--color-phase-expansion-border))',
    
    contraction: 'hsl(var(--color-phase-contraction))',
    contractionForeground: 'hsl(var(--color-phase-contraction-foreground))',
    contractionBorder: 'hsl(var(--color-phase-contraction-border))',
    
    transition: 'hsl(var(--color-phase-transition))',
    transitionForeground: 'hsl(var(--color-phase-transition-foreground))',
    transitionBorder: 'hsl(var(--color-phase-transition-border))',
    
    stable: 'hsl(var(--color-phase-stable))',
    stableForeground: 'hsl(var(--color-phase-stable-foreground))',
    stableBorder: 'hsl(var(--color-phase-stable-border))',
  },

  // Chart colors
  chart: {
    1: 'hsl(var(--color-chart-1))',
    2: 'hsl(var(--color-chart-2))',
    3: 'hsl(var(--color-chart-3))',
    4: 'hsl(var(--color-chart-4))',
    5: 'hsl(var(--color-chart-5))',
    6: 'hsl(var(--color-chart-6))',
  },

  // Status colors
  success: 'hsl(var(--color-success))',
  successForeground: 'hsl(var(--color-success-foreground))',
  warning: 'hsl(var(--color-warning))',
  warningForeground: 'hsl(var(--color-warning-foreground))',
  destructive: 'hsl(var(--color-destructive))',
  destructiveForeground: 'hsl(var(--color-destructive-foreground))',

  // Surface colors
  card: 'hsl(var(--color-card))',
  cardForeground: 'hsl(var(--color-card-foreground))',
  popover: 'hsl(var(--color-popover))',
  popoverForeground: 'hsl(var(--color-popover-foreground))',
} as const

export const spacing = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  '2xl': 'var(--spacing-2xl)',
} as const

export const radius = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
} as const

export const shadows = {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
} as const

export const fonts = {
  sans: 'var(--font-sans)',
  mono: 'var(--font-mono)',
} as const

/**
 * Phase identification utilities
 */
export type PhaseType = 'expansion' | 'contraction' | 'transition' | 'stable'

export const getPhaseColors = (phase: PhaseType) => {
  return {
    background: colors.phase[phase],
    foreground: colors.phase[`${phase}Foreground` as keyof typeof colors.phase],
    border: colors.phase[`${phase}Border` as keyof typeof colors.phase],
  }
}

/**
 * Chart color utilities
 */
export const getChartColor = (index: number): string => {
  const chartColors = Object.values(colors.chart)
  const normalizedIndex = ((index % chartColors.length) + chartColors.length) % chartColors.length
  return chartColors[normalizedIndex]
}

/**
 * Responsive breakpoints (matching Tailwind defaults)
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const 