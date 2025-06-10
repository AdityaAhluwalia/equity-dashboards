/**
 * Universal Financial Ratios Calculator - Task 3.1
 * 
 * Calculates 12 ratios common to all company types:
 * - Return on Equity (ROE)
 * - Net Profit Margin  
 * - Revenue Growth (1Y, 3Y, 5Y CAGR)
 * - Profit Growth (1Y, 3Y, 5Y CAGR)
 * - Asset Turnover
 * - Debt to Equity
 * - Price to Earnings (P/E)
 * - Price to Book (P/B)
 */

export interface UniversalRatios {
  // Profitability ratios
  roe: number;
  netProfitMargin: number;
  
  // Growth ratios
  revenueGrowth1Y: number;
  revenueGrowth3Y: number;
  revenueGrowth5Y: number;
  profitGrowth1Y: number;
  profitGrowth3Y: number;
  profitGrowth5Y: number;
  
  // Efficiency ratios
  assetTurnover: number;
  debtToEquity: number;
  
  // Market ratios
  priceToEarnings: number;
  priceToBook: number;
}

export interface UniversalRatiosInput {
  financialData: any[];
  marketData: any;
  companyInfo: any;
}

/**
 * Calculate Return on Equity (ROE)
 * Formula: Net Income / Shareholders Equity
 * Target: Emami ~31.2%, Axis Bank ~16.4%
 */
export function calculateROE(netIncome: number, shareholdersEquity: number): number {
  if (!shareholdersEquity || shareholdersEquity === 0) return 0;
  if (!netIncome) return 0;
  
  return netIncome / shareholdersEquity;
}

/**
 * Calculate Net Profit Margin
 * Formula: Net Income / Revenue
 */
export function calculateNetProfitMargin(netIncome: number, revenue: number): number {
  if (!revenue || revenue === 0) return 0;
  if (!netIncome) return 0;
  
  return netIncome / revenue;
}

/**
 * Calculate Revenue Growth (including CAGR)
 * Formula: ((Current / Previous) ^ (1/years)) - 1
 */
export function calculateRevenueGrowth(currentRevenue: number, previousRevenue: number, years: number): number {
  if (!previousRevenue || previousRevenue === 0) return 0;
  if (!currentRevenue) return -1; // Complete decline
  if (years <= 0) return 0;
  
  if (years === 1) {
    return (currentRevenue - previousRevenue) / previousRevenue;
  }
  
  // CAGR calculation
  return Math.pow(currentRevenue / previousRevenue, 1 / years) - 1;
}

/**
 * Calculate Profit Growth (including CAGR)
 * Formula: Same as revenue growth but for profit
 */
export function calculateProfitGrowth(currentProfit: number, previousProfit: number, years: number): number {
  if (!previousProfit || previousProfit === 0) {
    return currentProfit > 0 ? 1 : 0; // From zero to positive is 100% growth
  }
  if (years <= 0) return 0;
  
  if (years === 1) {
    return (currentProfit - previousProfit) / Math.abs(previousProfit);
  }
  
  // Handle negative profits carefully
  if (previousProfit < 0 && currentProfit > 0) return 1; // Recovery
  if (previousProfit > 0 && currentProfit < 0) return -1; // Loss
  
  return Math.pow(Math.abs(currentProfit) / Math.abs(previousProfit), 1 / years) - 1;
}

/**
 * Calculate Asset Turnover
 * Formula: Revenue / Total Assets
 */
export function calculateAssetTurnover(revenue: number, totalAssets: number): number {
  if (!totalAssets || totalAssets === 0) return 0;
  if (!revenue) return 0;
  
  return revenue / totalAssets;
}

/**
 * Calculate Debt to Equity
 * Formula: Total Debt / Shareholders Equity
 */
export function calculateDebtToEquity(totalDebt: number, shareholdersEquity: number): number {
  if (!shareholdersEquity || shareholdersEquity === 0) return 0;
  if (!totalDebt) return 0;
  
  return totalDebt / shareholdersEquity;
}

/**
 * Calculate Price to Earnings (P/E)
 * Can use provided P/E or calculate from price and EPS
 */
export function calculatePriceToEarnings(stockPrice: number, peRatioOrEPS: number, isEPS: boolean = false): number {
  if (isEPS) {
    // Calculate from stock price and EPS
    if (!peRatioOrEPS || peRatioOrEPS === 0) return 0;
    return stockPrice / peRatioOrEPS;
  } else {
    // Use provided P/E ratio
    return peRatioOrEPS || 0;
  }
}

/**
 * Calculate Price to Book (P/B)
 * Can use provided P/B or calculate from price and book value per share
 */
export function calculatePriceToBook(stockPrice: number, pbRatioOrBookValue: number, isBookValue: boolean = false): number {
  if (isBookValue) {
    // Calculate from stock price and book value per share
    if (!pbRatioOrBookValue || pbRatioOrBookValue === 0) return 0;
    return stockPrice / pbRatioOrBookValue;
  } else {
    // Use provided P/B ratio
    return pbRatioOrBookValue || 0;
  }
}

/**
 * Calculate all 12 universal ratios for a company
 */
export function calculateUniversalRatios(input: UniversalRatiosInput): UniversalRatios {
  const { financialData, marketData, companyInfo } = input;
  
  // Handle missing data
  if (!financialData || financialData.length === 0) {
    return {
      roe: 0,
      netProfitMargin: 0,
      revenueGrowth1Y: 0,
      revenueGrowth3Y: 0,
      revenueGrowth5Y: 0,
      profitGrowth1Y: 0,
      profitGrowth3Y: 0,
      profitGrowth5Y: 0,
      assetTurnover: 0,
      debtToEquity: 0,
      priceToEarnings: 0,
      priceToBook: 0
    };
  }
  
  const latest = financialData[0];
  const previous1Y = financialData[1];
  const previous3Y = financialData[2];
  const previous5Y = financialData[4]; // Index 4 for 5 years ago
  
  // Calculate profitability ratios
  const roe = calculateROE(latest.net_income, latest.shareholders_equity);
  const netProfitMargin = calculateNetProfitMargin(latest.net_income, latest.revenue);
  
  // Calculate growth ratios
  const revenueGrowth1Y = previous1Y 
    ? calculateRevenueGrowth(latest.revenue, previous1Y.revenue, 1) 
    : 0;
  const revenueGrowth3Y = previous3Y 
    ? calculateRevenueGrowth(latest.revenue, previous3Y.revenue, 3) 
    : 0;
  const revenueGrowth5Y = previous5Y 
    ? calculateRevenueGrowth(latest.revenue, previous5Y.revenue, 5) 
    : 0;
    
  const profitGrowth1Y = previous1Y 
    ? calculateProfitGrowth(latest.net_income, previous1Y.net_income, 1) 
    : 0;
  const profitGrowth3Y = previous3Y 
    ? calculateProfitGrowth(latest.net_income, previous3Y.net_income, 3) 
    : 0;
  const profitGrowth5Y = previous5Y 
    ? calculateProfitGrowth(latest.net_income, previous5Y.net_income, 5) 
    : 0;
  
  // Calculate efficiency ratios
  const assetTurnover = calculateAssetTurnover(latest.revenue, latest.total_assets);
  const debtToEquity = calculateDebtToEquity(latest.debt, latest.shareholders_equity);
  
  // Calculate market ratios
  const priceToEarnings = marketData?.pe_ratio 
    ? calculatePriceToEarnings(marketData.stock_price, marketData.pe_ratio) 
    : 0;
  const priceToBook = marketData?.pb_ratio 
    ? calculatePriceToBook(marketData.stock_price, marketData.pb_ratio) 
    : 0;
  
  return {
    roe,
    netProfitMargin,
    revenueGrowth1Y,
    revenueGrowth3Y,
    revenueGrowth5Y,
    profitGrowth1Y,
    profitGrowth3Y,
    profitGrowth5Y,
    assetTurnover,
    debtToEquity,
    priceToEarnings,
    priceToBook
  };
} 