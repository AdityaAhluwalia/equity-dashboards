/**
 * Historical Trend Analysis Engine - Task 3.4
 * 
 * Analyzes growth trends and historical patterns:
 * - Multi-period CAGR (1Y, 3Y, 5Y, 10Y)
 * - Quarterly growth patterns and seasonality
 * - Trend direction classification (up/down/stable)
 * - Missing data handling and gap interpolation
 * 
 * Real Data Testing: 12-year Emami & Axis Bank datasets
 */

export type TrendDirection = 'upward' | 'downward' | 'stable';
export type TrendStrength = 'weak' | 'moderate' | 'strong';

export interface DataPoint {
  period: string;
  value: number;
}

export interface TrendClassification {
  primary: TrendDirection;
  strength: TrendStrength;
  confidence: number;
  consistency: number;
}

export interface TrendStrengthMetrics {
  magnitude: number;
  consistency: number;
  acceleration: number;
}

export interface GrowthPattern {
  seasonalityScore: number;
  quarterlyAverages: { [key: string]: number };
  quarterlyGrowthRates: number[];
  growthVariance: number;
  dataCompleteness: number;
  volatility: number;
}

export interface SeasonalAdjustment {
  adjustedData: DataPoint[];
  seasonalIndices: { [key: string]: number };
}

export interface TrendAnalysisInput {
  annualData: DataPoint[];
  quarterlyData?: DataPoint[];
  companyInfo: {
    name: string;
    sector: string;
    type: 'finance' | 'non_finance';
  };
}

export interface TrendAnalysisResult {
  // CAGR calculations
  cagr1Y: number;
  cagr3Y: number;
  cagr5Y: number;
  cagr10Y: number;
  
  // Trend classification
  trendDirection: TrendDirection;
  trendStrength: TrendStrength;
  trendConsistency: number;
  
  // Growth patterns
  growthPattern: GrowthPattern;
  
  // Overall scores
  trendScore: number;
  dataCompleteness: number;
}

/**
 * Calculate Compound Annual Growth Rate (CAGR)
 * Formula: (End Value / Start Value)^(1/years) - 1
 */
export function calculateCAGR(endValue: number, startValue: number, years: number): number {
  if (!endValue || !startValue || startValue === 0 || years <= 0) {
    if (endValue === 0 && startValue > 0) return -1; // Complete decline
    return 0;
  }
  
  if (endValue === startValue) return 0; // No growth
  
  // Handle negative values carefully
  if (startValue < 0 || endValue < 0) {
    if (years === 1) {
      return (endValue - startValue) / Math.abs(startValue);
    }
    return 0; // Can't calculate CAGR with negative values over multiple periods
  }
  
  return Math.pow(endValue / startValue, 1 / years) - 1;
}

/**
 * Calculate quarterly growth pattern and seasonality
 */
export function calculateQuarterlyGrowthPattern(quarterlyData: DataPoint[]): GrowthPattern {
  if (!quarterlyData || quarterlyData.length < 2) {
    return {
      seasonalityScore: 0,
      quarterlyAverages: {},
      quarterlyGrowthRates: [],
      growthVariance: 0,
      dataCompleteness: 0,
      volatility: 0
    };
  }
  
  // Calculate quarter-over-quarter growth rates
  const quarterlyGrowthRates: number[] = [];
  for (let i = 1; i < quarterlyData.length; i++) {
    const current = quarterlyData[i - 1].value; // Data is in reverse chronological order
    const previous = quarterlyData[i].value;
    if (previous && previous !== 0) {
      quarterlyGrowthRates.push((current - previous) / previous);
    }
  }
  
  // Calculate quarterly averages (Q1, Q2, Q3, Q4)
  const quarterlyAverages: { [key: string]: number } = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
  const quarterCounts = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
  
  quarterlyData.forEach(point => {
    const quarter = getQuarterFromPeriod(point.period);
    if (quarter) {
      quarterlyAverages[quarter] += point.value;
      quarterCounts[quarter]++;
    }
  });
  
  // Calculate averages
  Object.keys(quarterlyAverages).forEach(quarter => {
    if (quarterCounts[quarter as keyof typeof quarterCounts] > 0) {
      quarterlyAverages[quarter] = quarterlyAverages[quarter] / quarterCounts[quarter as keyof typeof quarterCounts];
    }
  });
  
  // Calculate seasonality score (variance between quarters)
  const averageValues = Object.values(quarterlyAverages);
  const mean = averageValues.reduce((sum, val) => sum + val, 0) / averageValues.length;
  const variance = averageValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / averageValues.length;
  const seasonalityScore = Math.sqrt(variance) / mean;
  
  // Calculate growth variance
  const meanGrowth = quarterlyGrowthRates.reduce((sum, rate) => sum + rate, 0) / quarterlyGrowthRates.length;
  const growthVariance = quarterlyGrowthRates.reduce((sum, rate) => sum + Math.pow(rate - meanGrowth, 2), 0) / quarterlyGrowthRates.length;
  
  // Data completeness (assuming 13 quarters is complete)
  const dataCompleteness = Math.min(quarterlyData.length / 13, 1);
  
  // Calculate volatility
  const volatility = calculateVolatility(quarterlyData);
  
  return {
    seasonalityScore: Math.min(seasonalityScore, 1.0),
    quarterlyAverages,
    quarterlyGrowthRates,
    growthVariance,
    dataCompleteness,
    volatility
  };
}

/**
 * Helper function to extract quarter from period string
 */
function getQuarterFromPeriod(period: string): string | null {
  if (period.includes('Mar')) return 'Q1';
  if (period.includes('Jun')) return 'Q2';
  if (period.includes('Sep')) return 'Q3';
  if (period.includes('Dec')) return 'Q4';
  return null;
}

/**
 * Calculate trend strength metrics
 */
export function calculateTrendStrength(data: DataPoint[]): TrendStrengthMetrics {
  if (!data || data.length < 2) {
    return { magnitude: 0, consistency: 0, acceleration: 0 };
  }
  
  // Calculate growth rates between consecutive periods
  const growthRates: number[] = [];
  for (let i = 1; i < data.length; i++) {
    const current = data[i - 1].value; // Data is in reverse chronological order
    const previous = data[i].value;
    if (previous && previous !== 0) {
      growthRates.push((current - previous) / previous);
    }
  }
  
  if (growthRates.length === 0) {
    return { magnitude: 0, consistency: 0, acceleration: 0 };
  }
  
  // Calculate magnitude (average absolute growth rate)
  const magnitude = growthRates.reduce((sum, rate) => sum + Math.abs(rate), 0) / growthRates.length;
  
  // Calculate consistency (inverse of growth rate variance)
  const meanGrowth = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
  const variance = growthRates.reduce((sum, rate) => sum + Math.pow(rate - meanGrowth, 2), 0) / growthRates.length;
  const consistency = Math.max(0, 1 - Math.sqrt(variance));
  
  // Calculate acceleration (change in growth rate)
  let acceleration = 0;
  if (growthRates.length >= 2) {
    const firstHalf = growthRates.slice(0, Math.floor(growthRates.length / 2));
    const secondHalf = growthRates.slice(Math.floor(growthRates.length / 2));
    const firstHalfAvg = firstHalf.reduce((sum, rate) => sum + rate, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, rate) => sum + rate, 0) / secondHalf.length;
    acceleration = secondHalfAvg - firstHalfAvg;
  }
  
  return {
    magnitude: Math.min(magnitude * 10, 1.0), // Scale to 0-1 range
    consistency,
    acceleration
  };
}

/**
 * Classify trend direction and strength
 */
export function classifyTrendDirection(data: DataPoint[]): TrendClassification {
  if (!data || data.length < 2) {
    return { primary: 'stable', strength: 'weak', confidence: 0, consistency: 0 };
  }
  
  // Calculate overall CAGR
  const startValue = data[data.length - 1].value;
  const endValue = data[0].value;
  const years = data.length - 1;
  const overallCAGR = calculateCAGR(endValue, startValue, years);
  
  // Calculate trend strength metrics
  const strengthMetrics = calculateTrendStrength(data);
  
  // Determine direction
  let primary: TrendDirection = 'stable';
  if (overallCAGR > 0.02) primary = 'upward'; // > 2% CAGR
  else if (overallCAGR < -0.02) primary = 'downward'; // < -2% CAGR
  
  // Determine strength based on magnitude and consistency
  let strength: TrendStrength = 'weak';
  if (strengthMetrics.magnitude > 0.8 && strengthMetrics.consistency > 0.7) {
    strength = 'strong';
  } else if (strengthMetrics.magnitude > 0.5 && strengthMetrics.consistency > 0.6) {
    strength = 'moderate';
  }
  
  // Calculate confidence based on consistency and data quality
  const confidence = Math.min(strengthMetrics.consistency + (strengthMetrics.magnitude * 0.3), 1.0);
  
  return {
    primary,
    strength,
    confidence,
    consistency: strengthMetrics.consistency
  };
}

/**
 * Calculate volatility of data series
 */
export function calculateVolatility(data: DataPoint[]): number {
  if (!data || data.length < 2) return 0;
  
  // Calculate period-over-period growth rates
  const growthRates: number[] = [];
  for (let i = 1; i < data.length; i++) {
    const current = data[i - 1].value;
    const previous = data[i].value;
    if (previous && previous !== 0) {
      growthRates.push((current - previous) / previous);
    }
  }
  
  if (growthRates.length === 0) return 0;
  
  // Calculate standard deviation of growth rates
  const mean = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
  const variance = growthRates.reduce((sum, rate) => sum + Math.pow(rate - mean, 2), 0) / growthRates.length;
  
  return Math.sqrt(variance);
}

/**
 * Calculate seasonal adjustment for quarterly data
 */
export function calculateSeasonalAdjustment(quarterlyData: DataPoint[]): SeasonalAdjustment {
  if (!quarterlyData || quarterlyData.length < 4) {
    return {
      adjustedData: quarterlyData || [],
      seasonalIndices: { Q1: 1.0, Q2: 1.0, Q3: 1.0, Q4: 1.0 }
    };
  }
  
  // Calculate quarterly averages
  const quarterlyTotals: { [key: string]: number } = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
  const quarterCounts = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
  
  quarterlyData.forEach(point => {
    const quarter = getQuarterFromPeriod(point.period);
    if (quarter) {
      quarterlyTotals[quarter] += point.value;
      quarterCounts[quarter]++;
    }
  });
  
  // Calculate quarterly averages
  const quarterlyAverages: { [key: string]: number } = {};
  Object.keys(quarterlyTotals).forEach(quarter => {
    const count = quarterCounts[quarter as keyof typeof quarterCounts];
    quarterlyAverages[quarter] = count > 0 ? quarterlyTotals[quarter] / count : 0;
  });
  
  // Calculate overall average
  const overallAverage = Object.values(quarterlyAverages).reduce((sum, val) => sum + val, 0) / 4;
  
  // Calculate seasonal indices
  const seasonalIndices: { [key: string]: number } = {};
  Object.keys(quarterlyAverages).forEach(quarter => {
    seasonalIndices[quarter] = overallAverage > 0 ? quarterlyAverages[quarter] / overallAverage : 1.0;
  });
  
  // Adjust data
  const adjustedData: DataPoint[] = quarterlyData.map(point => {
    const quarter = getQuarterFromPeriod(point.period);
    const seasonalIndex = quarter ? seasonalIndices[quarter] : 1.0;
    return {
      period: point.period,
      value: seasonalIndex !== 0 ? point.value / seasonalIndex : point.value
    };
  });
  
  return {
    adjustedData,
    seasonalIndices
  };
}

/**
 * Comprehensive historical trend analysis
 */
export function analyzeHistoricalTrends(input: TrendAnalysisInput): TrendAnalysisResult {
  const { annualData, quarterlyData = [], companyInfo } = input;
  
  if (!annualData || annualData.length === 0) {
    return {
      cagr1Y: 0,
      cagr3Y: 0,
      cagr5Y: 0,
      cagr10Y: 0,
      trendDirection: 'stable',
      trendStrength: 'weak',
      trendConsistency: 0,
      growthPattern: {
        seasonalityScore: 0,
        quarterlyAverages: {},
        quarterlyGrowthRates: [],
        growthVariance: 0,
        dataCompleteness: 0,
        volatility: 0
      },
      trendScore: 0,
      dataCompleteness: 0
    };
  }
  
  // Calculate CAGR for different periods
  const current = annualData[0].value;
  const cagr1Y = annualData.length > 1 ? calculateCAGR(current, annualData[1].value, 1) : 0;
  const cagr3Y = annualData.length > 3 ? calculateCAGR(current, annualData[3].value, 3) : 0;
  const cagr5Y = annualData.length > 5 ? calculateCAGR(current, annualData[5].value, 5) : 0;
  const cagr10Y = annualData.length > 10 ? calculateCAGR(current, annualData[10].value, 10) : 0;
  
  // Analyze trend direction and strength
  const trendClassification = classifyTrendDirection(annualData);
  
  // Analyze growth patterns
  const growthPattern = calculateQuarterlyGrowthPattern(quarterlyData);
  
  // Calculate data completeness
  const expectedAnnual = 12;
  const expectedQuarterly = 13;
  const annualCompleteness = Math.min(annualData.length / expectedAnnual, 1);
  const quarterlyCompleteness = quarterlyData.length > 0 ? Math.min(quarterlyData.length / expectedQuarterly, 1) : 0.5;
  const dataCompleteness = (annualCompleteness + quarterlyCompleteness) / 2;
  
  // Calculate overall trend score (0-100)
  const growthScore = Math.max(0, Math.min(cagr5Y * 5, 0.5)) * 100; // Cap growth contribution
  const consistencyScore = trendClassification.consistency * 30;
  const dataQualityScore = dataCompleteness * 20;
  const trendScore = growthScore + consistencyScore + dataQualityScore;
  
  return {
    cagr1Y,
    cagr3Y,
    cagr5Y,
    cagr10Y,
    trendDirection: trendClassification.primary,
    trendStrength: trendClassification.strength,
    trendConsistency: trendClassification.consistency,
    growthPattern,
    trendScore: Math.min(trendScore, 100),
    dataCompleteness
  };
} 