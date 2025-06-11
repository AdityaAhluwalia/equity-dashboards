import { Company as BaseCompany } from './index';
import { PhaseType } from '@/lib/design-tokens';

/**
 * Extended Company interface for UI components
 * Includes additional properties not in the base database schema
 */
export interface Company extends BaseCompany {
  // Additional UI properties
  industry?: string;
  description?: string;
  currentPhase: PhaseType;
  currentPrice?: number;
  priceChange?: number;
  companyType: 'finance' | 'non-finance';
  
  // Rename snake_case to camelCase for UI consistency
  marketCap: number; // Override snake_case market_cap
}

/**
 * Company with market data for dashboard display
 */
export interface CompanyWithMarketData extends Company {
  latestPrice: number;
  priceChange24h: number;
  volume: number;
  marketCapFormatted: string;
}

/**
 * Loading states for UI components
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  progress?: number;
}

/**
 * Chart display preferences
 */
export interface ChartPreferences {
  period: 'quarterly' | 'annual';
  timeRange: '1Y' | '3Y' | '5Y' | '10Y' | 'MAX';
  showPhases: boolean;
  showTrends: boolean;
  chartType: 'line' | 'bar' | 'area';
}

/**
 * Dashboard section visibility
 */
export interface SectionVisibility {
  header: boolean;
  cycles: boolean;
  revenue: boolean;
  margins: boolean;
  cashflow: boolean;
  ratios: boolean;
  comparison: boolean;
}

/**
 * Metric card data for company header
 */
export interface MetricCard {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  trend: 'up' | 'down' | 'stable';
  sparklineData?: Array<{ x: string; y: number }>;
  format: 'currency' | 'percentage' | 'number' | 'ratio';
}

/**
 * Navigation state for multi-step processes
 */
export interface NavigationState {
  currentStep: number;
  totalSteps: number;
  canGoBack: boolean;
  canGoForward: boolean;
  steps: Array<{
    id: string;
    label: string;
    completed: boolean;
    active: boolean;
  }>;
} 