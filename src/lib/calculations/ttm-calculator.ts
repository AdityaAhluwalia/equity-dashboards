/**
 * TTM (Trailing Twelve Months) Calculator - Task 7.5
 * 
 * Calculates trailing twelve months metrics for smoothing quarterly variations
 * and providing annualized figures based on most recent 4 quarters.
 */

export interface QuarterlyFinancialData {
  quarter: string; // e.g., "Q4 FY24"
  quarterIndex: number; // 0-11 for ordering
  period: string; // e.g., "Mar 2024"
  revenue: number;
  grossProfit: number;
  operatingProfit: number;
  netProfit: number;
  totalAssets: number;
  shareholders_equity: number;
  debt: number;
  interest: number;
  depreciation: number;
  tax: number;
  operatingCashFlow: number;
  capex: number;
  workingCapital: number;
}

export interface TTMMetrics {
  ttmRevenue: number;
  ttmGrossProfit: number;
  ttmOperatingProfit: number;
  ttmNetProfit: number;
  ttmOperatingCashFlow: number;
  ttmCapex: number;
  ttmFreeCashFlow: number;
  ttmInterest: number;
  ttmDepreciation: number;
  ttmTax: number;
}

export interface TTMMargins {
  grossProfitMargin: number;
  operatingProfitMargin: number;
  netProfitMargin: number;
  operatingCashFlowMargin: number;
  freeCashFlowMargin: number;
}

export interface TTMRatios {
  roe: number; // Return on Equity
  roa: number; // Return on Assets
  assetTurnover: number;
  debtToEquity: number;
  interestCoverage: number;
  cashConversion: number;
  capexToRevenue: number;
}

export interface TTMGrowth {
  revenueGrowth: number;
  profitGrowth: number;
  operatingProfitGrowth: number;
  cashFlowGrowth: number;
  assetGrowth: number;
}

export interface TTMData {
  period: string; // TTM ending period
  endPeriod: string; // Latest quarter end date
  ttmRevenue: number;
  ttmNetProfit: number;
  ttmOperatingProfit: number;
  ttmGrossProfit: number;
  ttmOperatingCashFlow: number;
  ttmFreeCashFlow: number;
  margins: TTMMargins;
  ratios: TTMRatios;
  growth?: TTMGrowth;
  quarters: string[]; // Quarters included in this TTM
}

export interface TTMCalculationResult {
  current: TTMData;
  previous?: TTMData;
  growth: TTMGrowth;
  trend: {
    direction: 'improving' | 'declining' | 'stable';
    strength: number; // 0-100
    consistency: number; // 0-100
  };
}

/**
 * Calculate TTM revenue from latest 4 quarters
 */
export function calculateTTMRevenue(quarterlyData: QuarterlyFinancialData[]): number {
  if (!quarterlyData || quarterlyData.length === 0) {
    return 0;
  }

  // Take up to 4 quarters and sum revenue
  const quarters = quarterlyData.slice(0, Math.min(4, quarterlyData.length));
  return quarters.reduce((sum, quarter) => sum + (quarter.revenue || 0), 0);
}

/**
 * Calculate TTM profit based on profit type
 */
export function calculateTTMProfit(
  quarterlyData: QuarterlyFinancialData[], 
  profitType: 'net' | 'operating' | 'gross'
): number {
  if (!quarterlyData || quarterlyData.length === 0) {
    return 0;
  }

  const quarters = quarterlyData.slice(0, Math.min(4, quarterlyData.length));
  
  switch (profitType) {
    case 'net':
      return quarters.reduce((sum, quarter) => sum + (quarter.netProfit || 0), 0);
    case 'operating':
      return quarters.reduce((sum, quarter) => sum + (quarter.operatingProfit || 0), 0);
    case 'gross':
      return quarters.reduce((sum, quarter) => sum + (quarter.grossProfit || 0), 0);
    default:
      return 0;
  }
}

/**
 * Calculate TTM metrics for all financial items
 */
export function calculateTTMMetrics(quarterlyData: QuarterlyFinancialData[]): TTMMetrics {
  if (!quarterlyData || quarterlyData.length === 0) {
    return {
      ttmRevenue: 0,
      ttmGrossProfit: 0,
      ttmOperatingProfit: 0,
      ttmNetProfit: 0,
      ttmOperatingCashFlow: 0,
      ttmCapex: 0,
      ttmFreeCashFlow: 0,
      ttmInterest: 0,
      ttmDepreciation: 0,
      ttmTax: 0
    };
  }

  const quarters = quarterlyData.slice(0, Math.min(4, quarterlyData.length));
  
  const ttmRevenue = quarters.reduce((sum, q) => sum + (q.revenue || 0), 0);
  const ttmGrossProfit = quarters.reduce((sum, q) => sum + (q.grossProfit || 0), 0);
  const ttmOperatingProfit = quarters.reduce((sum, q) => sum + (q.operatingProfit || 0), 0);
  const ttmNetProfit = quarters.reduce((sum, q) => sum + (q.netProfit || 0), 0);
  const ttmOperatingCashFlow = quarters.reduce((sum, q) => sum + (q.operatingCashFlow || 0), 0);
  const ttmCapex = quarters.reduce((sum, q) => sum + (q.capex || 0), 0);
  const ttmInterest = quarters.reduce((sum, q) => sum + (q.interest || 0), 0);
  const ttmDepreciation = quarters.reduce((sum, q) => sum + (q.depreciation || 0), 0);
  const ttmTax = quarters.reduce((sum, q) => sum + (q.tax || 0), 0);
  
  return {
    ttmRevenue,
    ttmGrossProfit,
    ttmOperatingProfit,
    ttmNetProfit,
    ttmOperatingCashFlow,
    ttmCapex,
    ttmFreeCashFlow: ttmOperatingCashFlow - ttmCapex,
    ttmInterest,
    ttmDepreciation,
    ttmTax
  };
}

/**
 * Calculate TTM margins
 */
export function calculateTTMMargins(quarterlyData: QuarterlyFinancialData[]): TTMMargins {
  const metrics = calculateTTMMetrics(quarterlyData);
  
  if (metrics.ttmRevenue === 0) {
    return {
      grossProfitMargin: 0,
      operatingProfitMargin: 0,
      netProfitMargin: 0,
      operatingCashFlowMargin: 0,
      freeCashFlowMargin: 0
    };
  }

  return {
    grossProfitMargin: (metrics.ttmGrossProfit / metrics.ttmRevenue) * 100,
    operatingProfitMargin: (metrics.ttmOperatingProfit / metrics.ttmRevenue) * 100,
    netProfitMargin: (metrics.ttmNetProfit / metrics.ttmRevenue) * 100,
    operatingCashFlowMargin: (metrics.ttmOperatingCashFlow / metrics.ttmRevenue) * 100,
    freeCashFlowMargin: (metrics.ttmFreeCashFlow / metrics.ttmRevenue) * 100
  };
}

/**
 * Calculate TTM-based financial ratios
 */
export function calculateTTMRatios(quarterlyData: QuarterlyFinancialData[]): TTMRatios {
  if (!quarterlyData || quarterlyData.length === 0) {
    return {
      roe: 0,
      roa: 0,
      assetTurnover: 0,
      debtToEquity: 0,
      interestCoverage: 0,
      cashConversion: 0,
      capexToRevenue: 0
    };
  }

  const metrics = calculateTTMMetrics(quarterlyData);
  const quarters = quarterlyData.slice(0, Math.min(4, quarterlyData.length));
  
  // Calculate average balance sheet items
  const avgTotalAssets = quarters.reduce((sum, q) => sum + (q.totalAssets || 0), 0) / quarters.length;
  const avgShareholdersEquity = quarters.reduce((sum, q) => sum + (q.shareholders_equity || 0), 0) / quarters.length;
  
  // Use latest quarter for point-in-time items
  const latestQuarter = quarters[0];
  const debt = latestQuarter?.debt || 0;
  const shareholdersEquity = latestQuarter?.shareholders_equity || 0;

  // Calculate ratios with safety checks
  const roe = avgShareholdersEquity > 0 ? (metrics.ttmNetProfit / avgShareholdersEquity) * 100 : 0;
  const roa = avgTotalAssets > 0 ? (metrics.ttmNetProfit / avgTotalAssets) * 100 : 0;
  const assetTurnover = avgTotalAssets > 0 ? metrics.ttmRevenue / avgTotalAssets : 0;
  const debtToEquity = shareholdersEquity > 0 ? debt / shareholdersEquity : 0;
  const interestCoverage = metrics.ttmInterest > 0 ? metrics.ttmOperatingProfit / metrics.ttmInterest : 0;
  const cashConversion = metrics.ttmRevenue > 0 ? (metrics.ttmOperatingCashFlow / metrics.ttmRevenue) * 100 : 0;
  const capexToRevenue = metrics.ttmRevenue > 0 ? (metrics.ttmCapex / metrics.ttmRevenue) * 100 : 0;

  return {
    roe,
    roa,
    assetTurnover,
    debtToEquity,
    interestCoverage,
    cashConversion,
    capexToRevenue
  };
}

/**
 * Calculate TTM growth rates vs previous TTM
 */
export function calculateTTMGrowth(quarterlyData: QuarterlyFinancialData[]): TTMGrowth {
  if (!quarterlyData || quarterlyData.length < 8) {
    return {
      revenueGrowth: 0,
      profitGrowth: 0,
      operatingProfitGrowth: 0,
      cashFlowGrowth: 0,
      assetGrowth: 0
    };
  }

  // Current TTM (quarters 0-3)
  const currentTTM = calculateTTMMetrics(quarterlyData.slice(0, 4));
  
  // Previous TTM (quarters 4-7)
  const previousTTM = calculateTTMMetrics(quarterlyData.slice(4, 8));

  // Calculate growth rates
  const revenueGrowth = previousTTM.ttmRevenue > 0 
    ? ((currentTTM.ttmRevenue - previousTTM.ttmRevenue) / previousTTM.ttmRevenue) * 100 
    : 0;
    
  const profitGrowth = previousTTM.ttmNetProfit > 0 
    ? ((currentTTM.ttmNetProfit - previousTTM.ttmNetProfit) / previousTTM.ttmNetProfit) * 100 
    : 0;
    
  const operatingProfitGrowth = previousTTM.ttmOperatingProfit > 0 
    ? ((currentTTM.ttmOperatingProfit - previousTTM.ttmOperatingProfit) / previousTTM.ttmOperatingProfit) * 100 
    : 0;
    
  const cashFlowGrowth = previousTTM.ttmOperatingCashFlow > 0 
    ? ((currentTTM.ttmOperatingCashFlow - previousTTM.ttmOperatingCashFlow) / previousTTM.ttmOperatingCashFlow) * 100 
    : 0;

  // Asset growth based on latest quarters
  const currentAssets = quarterlyData[0]?.totalAssets || 0;
  const previousAssets = quarterlyData[4]?.totalAssets || 0;
  const assetGrowth = previousAssets > 0 
    ? ((currentAssets - previousAssets) / previousAssets) * 100 
    : 0;

  return {
    revenueGrowth,
    profitGrowth,
    operatingProfitGrowth,
    cashFlowGrowth,
    assetGrowth
  };
}

/**
 * Create rolling TTM data series
 */
export function createTTMDataSeries(
  quarterlyData: QuarterlyFinancialData[], 
  numPeriods: number = 4
): TTMData[] {
  if (!quarterlyData || quarterlyData.length < 4) {
    return [];
  }

  const ttmSeries: TTMData[] = [];
  
  // Create TTM data for each possible period
  for (let i = 0; i <= Math.min(numPeriods - 1, quarterlyData.length - 4); i++) {
    const quarterSet = quarterlyData.slice(i, i + 4);
    const metrics = calculateTTMMetrics(quarterSet);
    const margins = calculateTTMMargins(quarterSet);
    const ratios = calculateTTMRatios(quarterSet);
    
    // Calculate growth if we have sufficient data for previous TTM period
    let growth: TTMGrowth | undefined;
    if (quarterlyData.length >= i + 8) {
      // We need at least 8 quarters from current position to calculate growth
      const fullDataForGrowth = quarterlyData.slice(i);
      if (fullDataForGrowth.length >= 8) {
        growth = calculateTTMGrowth(fullDataForGrowth);
      }
    }

    const ttmData: TTMData = {
      period: `TTM ${quarterSet[0].quarter}`,
      endPeriod: quarterSet[0].period,
      ttmRevenue: metrics.ttmRevenue,
      ttmNetProfit: metrics.ttmNetProfit,
      ttmOperatingProfit: metrics.ttmOperatingProfit,
      ttmGrossProfit: metrics.ttmGrossProfit,
      ttmOperatingCashFlow: metrics.ttmOperatingCashFlow,
      ttmFreeCashFlow: metrics.ttmFreeCashFlow,
      margins,
      ratios,
      growth,
      quarters: quarterSet.map(q => q.quarter)
    };

    ttmSeries.push(ttmData);
  }

  return ttmSeries;
}

/**
 * Comprehensive TTM analysis
 */
export function analyzeTTMTrends(quarterlyData: QuarterlyFinancialData[]): TTMCalculationResult {
  if (!quarterlyData || quarterlyData.length < 4) {
    throw new Error('Insufficient data for TTM analysis. Need at least 4 quarters.');
  }

  const ttmSeries = createTTMDataSeries(quarterlyData, 2);
  const current = ttmSeries[0];
  const previous = ttmSeries.length > 1 ? ttmSeries[1] : undefined;

  // Calculate overall growth
  const growth = calculateTTMGrowth(quarterlyData);

  // Analyze trend direction and strength
  let direction: 'improving' | 'declining' | 'stable' = 'stable';
  let strength = 0;
  let consistency = 0;

  if (growth.revenueGrowth > 5) {
    direction = 'improving';
    strength = Math.min(growth.revenueGrowth * 2, 100);
  } else if (growth.revenueGrowth < -5) {
    direction = 'declining';
    strength = Math.min(Math.abs(growth.revenueGrowth) * 2, 100);
  } else {
    direction = 'stable';
    strength = 50 - Math.abs(growth.revenueGrowth) * 5;
  }

  // Calculate consistency based on margin stability
  const marginVariation = ttmSeries.length > 1 
    ? Math.abs(current.margins.netProfitMargin - (previous?.margins.netProfitMargin || 0))
    : 0;
  consistency = Math.max(0, 100 - marginVariation * 10);

  return {
    current,
    previous,
    growth,
    trend: {
      direction,
      strength,
      consistency
    }
  };
}

/**
 * Format TTM value for display
 */
export function formatTTMValue(value: number, type: 'currency' | 'percentage' | 'ratio'): string {
  switch (type) {
    case 'currency':
      return `₹${(value / 10000000).toFixed(0)}Cr`;
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'ratio':
      return `${value.toFixed(2)}x`;
    default:
      return value.toString();
  }
}

/**
 * Validate TTM data quality
 */
export function validateTTMData(quarterlyData: QuarterlyFinancialData[]): {
  isValid: boolean;
  warnings: string[];
  dataCompleteness: number;
} {
  const warnings: string[] = [];
  let dataCompleteness = 0;

  if (!quarterlyData || quarterlyData.length === 0) {
    return {
      isValid: false,
      warnings: ['No quarterly data provided'],
      dataCompleteness: 0
    };
  }

  if (quarterlyData.length < 4) {
    warnings.push(`Only ${quarterlyData.length} quarters available. TTM requires 4 quarters.`);
  }

  // Check data completeness
  const requiredFields = ['revenue', 'netProfit', 'operatingProfit', 'totalAssets', 'shareholders_equity'];
  let completenessScore = 0;
  let totalFields = 0;

  quarterlyData.slice(0, 4).forEach(quarter => {
    requiredFields.forEach(field => {
      totalFields++;
      if (quarter[field as keyof QuarterlyFinancialData] != null && 
          quarter[field as keyof QuarterlyFinancialData] !== 0) {
        completenessScore++;
      }
    });
  });

  dataCompleteness = totalFields > 0 ? (completenessScore / totalFields) * 100 : 0;

  if (dataCompleteness < 80) {
    warnings.push(`Data completeness is ${dataCompleteness.toFixed(1)}%. Some calculations may be inaccurate.`);
  }

  // Check for data anomalies
  const latest4 = quarterlyData.slice(0, 4);
  const hasNegativeRevenue = latest4.some(q => q.revenue < 0);
  if (hasNegativeRevenue) {
    warnings.push('Negative revenue detected in quarterly data.');
  }

  const hasConsistentEquity = latest4.every(q => q.shareholders_equity > 0);
  if (!hasConsistentEquity) {
    warnings.push('Inconsistent shareholders equity data across quarters.');
  }

  return {
    isValid: quarterlyData.length >= 4 && dataCompleteness >= 50,
    warnings,
    dataCompleteness
  };
} 