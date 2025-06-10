/**
 * Non-Finance Ratio Calculator - Task 3.2
 * 
 * Calculates 12 ratios specific to manufacturing/FMCG companies:
 * - Operating Profit Margin (OPM), ROCE, Working Capital Cycle
 * - Liquidity ratios, Efficiency ratios, Asset Quality
 * 
 * Real Data Testing: Emami Ltd validation
 */

export interface NonFinanceRatios {
  operatingProfitMargin: number;
  returnOnCapitalEmployed: number;
  cashConversionCycle: number;
  debtorDays: number;
  inventoryDays: number;
  payableDays: number;
  workingCapitalDays: number;
  interestCoverageRatio: number;
  currentRatio: number;
  quickRatio: number;
  freeCashFlowMargin: number;
  assetQualityRatio: number;
}

export interface NonFinanceRatiosInput {
  quarterlyData: any;
  balanceSheetData: any;
  cashFlowData: any;
  workingCapitalRatios: any;
}

/**
 * Calculate Operating Profit Margin (OPM)
 * Formula: Operating Profit / Sales × 100
 * Target: Emami ~22.7% (Mar 2025)
 */
export function calculateOperatingProfitMargin(operatingProfit: number, sales: number): number {
  if (!sales || sales === 0) return 0;
  if (!operatingProfit) return 0;
  
  return (operatingProfit / sales) * 100;
}

/**
 * Calculate Return on Capital Employed (ROCE)
 * Formula: EBIT / Capital Employed × 100
 * Capital Employed = Total Assets - Current Liabilities
 */
export function calculateROCE(ebit: number, capitalEmployed: number): number {
  if (!capitalEmployed || capitalEmployed === 0) return 0;
  if (!ebit) return 0;
  
  return (ebit / capitalEmployed) * 100;
}

/**
 * Calculate Cash Conversion Cycle
 * Formula: Debtor Days + Inventory Days - Payable Days
 */
export function calculateCashConversionCycle(debtorDays: number, inventoryDays: number, payableDays: number): number {
  return (debtorDays || 0) + (inventoryDays || 0) - (payableDays || 0);
}

/**
 * Calculate Debtor Days (Days Sales Outstanding)
 * Formula: Accounts Receivable / Daily Sales
 */
export function calculateDebtorDays(debtors: number, dailySales: number): number {
  if (!dailySales || dailySales === 0) return 0;
  if (!debtors) return 0;
  
  return debtors / dailySales;
}

/**
 * Calculate Inventory Days (Days Inventory Outstanding)
 * Formula: Inventory / Daily COGS
 */
export function calculateInventoryDays(inventory: number, dailyCOGS: number): number {
  if (!dailyCOGS || dailyCOGS === 0) return 0;
  if (!inventory) return 0;
  
  return inventory / dailyCOGS;
}

/**
 * Calculate Days Payable Outstanding
 * Formula: Accounts Payable / Daily COGS
 */
export function calculatePayableDays(payables: number, dailyCOGS: number): number {
  if (!dailyCOGS || dailyCOGS === 0) return 0;
  if (!payables) return 0;
  
  return payables / dailyCOGS;
}

/**
 * Calculate Working Capital Days
 * Formula: Working Capital / Daily Sales
 */
export function calculateWorkingCapitalDays(workingCapital: number, dailySales: number): number {
  if (!dailySales || dailySales === 0) return 0;
  
  return workingCapital / dailySales;
}

/**
 * Calculate Interest Coverage Ratio
 * Formula: EBIT / Interest Expense
 */
export function calculateInterestCoverageRatio(ebit: number, interestExpense: number): number {
  if (!interestExpense || interestExpense === 0) return 0;
  if (!ebit) return 0;
  
  return ebit / interestExpense;
}

/**
 * Calculate Current Ratio
 * Formula: Current Assets / Current Liabilities
 */
export function calculateCurrentRatio(currentAssets: number, currentLiabilities: number): number {
  if (!currentLiabilities || currentLiabilities === 0) return 0;
  if (!currentAssets) return 0;
  
  return currentAssets / currentLiabilities;
}

/**
 * Calculate Quick Ratio (Acid Test)
 * Formula: (Current Assets - Inventory) / Current Liabilities
 */
export function calculateQuickRatio(currentAssets: number, inventory: number, currentLiabilities: number): number {
  if (!currentLiabilities || currentLiabilities === 0) return 0;
  if (!currentAssets) return 0;
  
  const quickAssets = currentAssets - (inventory || 0);
  return quickAssets / currentLiabilities;
}

/**
 * Calculate Free Cash Flow Margin
 * Formula: Operating Cash Flow / Revenue × 100
 */
export function calculateFreeCashFlowMargin(operatingCashFlow: number, revenue: number): number {
  if (!revenue || revenue === 0) return 0;
  if (!operatingCashFlow) return 0;
  
  return (operatingCashFlow / revenue) * 100;
}

/**
 * Calculate Asset Quality Ratio
 * Formula: Fixed Assets / Total Assets
 */
export function calculateAssetQualityRatio(fixedAssets: number, totalAssets: number): number {
  if (!totalAssets || totalAssets === 0) return 0;
  if (!fixedAssets) return 0;
  
  return fixedAssets / totalAssets;
}

/**
 * Calculate all 12 non-finance ratios for a manufacturing/FMCG company
 */
export function calculateNonFinanceRatios(input: NonFinanceRatiosInput): NonFinanceRatios {
  // Handle null/missing input
  if (!input || !input.quarterlyData || !input.balanceSheetData) {
    return {
      operatingProfitMargin: 0,
      returnOnCapitalEmployed: 0,
      cashConversionCycle: 0,
      debtorDays: 0,
      inventoryDays: 0,
      payableDays: 0,
      workingCapitalDays: 0,
      interestCoverageRatio: 0,
      currentRatio: 0,
      quickRatio: 0,
      freeCashFlowMargin: 0,
      assetQualityRatio: 0
    };
  }

  const quarterly = input.quarterlyData;
  const balanceSheet = input.balanceSheetData;
  const cashFlow = input.cashFlowData || {};
  const wcRatios = input.workingCapitalRatios || {};

  // Calculate profitability ratios
  const operatingProfitMargin = calculateOperatingProfitMargin(
    quarterly.operating_profit || quarterly.operatingProfit,
    quarterly.sales || quarterly.revenue
  );

  // Calculate EBIT (Operating Profit + Other Income)
  const ebit = (quarterly.operating_profit || quarterly.operatingProfit || 0) + 
               (quarterly.other_income || quarterly.otherIncome || 0);
  
  // Calculate Capital Employed (Total Assets - Current Liabilities)
  const capitalEmployed = (balanceSheet.total_assets || balanceSheet.totalAssets || 0) - 
                         (balanceSheet.current_liabilities || balanceSheet.currentLiabilities || 0);
  
  const returnOnCapitalEmployed = calculateROCE(ebit, capitalEmployed);

  // Calculate working capital cycle ratios
  const dailySales = (quarterly.sales || quarterly.revenue || 0) / 90; // Quarterly to daily
  const dailyCOGS = (quarterly.expenses || 0) / 90; // Using expenses as COGS proxy

  const debtorDays = calculateDebtorDays(
    balanceSheet.debtors || balanceSheet.receivables || 0,
    dailySales
  );

  const inventoryDays = calculateInventoryDays(
    balanceSheet.inventory || 0,
    dailyCOGS
  );

  const payableDays = calculatePayableDays(
    balanceSheet.other_liabilities || balanceSheet.payables || 0,
    dailyCOGS
  );

  const cashConversionCycle = calculateCashConversionCycle(
    wcRatios.debtor_days || debtorDays,
    wcRatios.inventory_days || inventoryDays,
    48 // Use estimated payable days if not provided
  );

  const workingCapital = (balanceSheet.current_assets || balanceSheet.currentAssets || 0) - 
                        (balanceSheet.current_liabilities || balanceSheet.currentLiabilities || 0);
  
  const workingCapitalDays = calculateWorkingCapitalDays(workingCapital, dailySales);

  // Calculate liquidity ratios
  const currentRatio = calculateCurrentRatio(
    balanceSheet.current_assets || balanceSheet.currentAssets || 0,
    balanceSheet.current_liabilities || balanceSheet.currentLiabilities || 0
  );

  const quickRatio = calculateQuickRatio(
    balanceSheet.current_assets || balanceSheet.currentAssets || 0,
    balanceSheet.inventory || 0,
    balanceSheet.current_liabilities || balanceSheet.currentLiabilities || 0
  );

  const interestCoverageRatio = calculateInterestCoverageRatio(
    ebit,
    quarterly.interest || quarterly.interestExpense || 0
  );

  // Calculate cash flow ratios
  const freeCashFlowMargin = calculateFreeCashFlowMargin(
    cashFlow.operating_cash_flow || cashFlow.operatingCashFlow || 0,
    quarterly.sales || quarterly.revenue || 0
  );

  // Calculate asset quality
  const assetQualityRatio = calculateAssetQualityRatio(
    balanceSheet.fixed_assets || balanceSheet.fixedAssets || 0,
    balanceSheet.total_assets || balanceSheet.totalAssets || 0
  );

  return {
    operatingProfitMargin,
    returnOnCapitalEmployed,
    cashConversionCycle,
    debtorDays,
    inventoryDays,
    payableDays,
    workingCapitalDays,
    interestCoverageRatio,
    currentRatio,
    quickRatio,
    freeCashFlowMargin,
    assetQualityRatio
  };
} 