/**
 * Finance-Specific Ratios Calculator - Task 3.3
 * 
 * Calculates 6 ratios specific to finance companies (banks, NBFCs):
 * - Net Interest Margin (NIM)
 * - Cost-to-Income Ratio  
 * - Loan Growth Rate
 * - Deposit Growth Rate
 * - Non-Interest Income Ratio
 * - Capital Adequacy Ratio (Basic)
 */

export interface FinanceRatios {
  // Core banking profitability
  netInterestMargin: number;
  costToIncomeRatio: number;
  
  // Growth ratios
  loanGrowthRate: number;
  depositGrowthRate: number;
  
  // Income diversification
  nonInterestIncomeRatio: number;
  
  // Capital strength
  capitalAdequacyRatio: number;
}

export interface FinanceRatiosInput {
  financialData: any[];
  companyInfo: any;
}

/**
 * Calculate Net Interest Margin (NIM)
 * Formula: Net Interest Income / Average Earning Assets
 * For our data: Use financing profit or derive from revenue structure
 */
export function calculateNetInterestMargin(
  netInterestIncome: number, 
  totalAssets: number
): number {
  if (!totalAssets || totalAssets === 0) return 0;
  if (!netInterestIncome) return 0;
  
  return netInterestIncome / totalAssets;
}

/**
 * Calculate Cost-to-Income Ratio
 * Formula: Operating Expenses / Total Operating Income
 * For our data: Derive expenses from revenue - net_income - tax
 */
export function calculateCostToIncomeRatio(
  operatingExpenses: number, 
  totalIncome: number
): number {
  if (!totalIncome || totalIncome === 0) return 0;
  if (!operatingExpenses) return 0;
  
  return operatingExpenses / totalIncome;
}

/**
 * Calculate Loan Growth Rate
 * Formula: (Current Loans - Previous Loans) / Previous Loans
 * For our data: Use current_assets as proxy for loan book
 */
export function calculateLoanGrowthRate(
  currentLoans: number, 
  previousLoans: number
): number {
  if (!previousLoans || previousLoans === 0) return 0;
  if (!currentLoans) return -1; // Complete decline
  
  return (currentLoans - previousLoans) / previousLoans;
}

/**
 * Calculate Deposit Growth Rate
 * Formula: (Current Deposits - Previous Deposits) / Previous Deposits
 * For our data: Extract deposits from debt (deposits + borrowings)
 */
export function calculateDepositGrowthRate(
  currentDeposits: number, 
  previousDeposits: number
): number {
  if (!previousDeposits || previousDeposits === 0) return 0;
  if (!currentDeposits) return -1; // Complete decline
  
  return (currentDeposits - previousDeposits) / previousDeposits;
}

/**
 * Calculate Non-Interest Income Ratio
 * Formula: Non-Interest Income / Total Operating Income
 * For our data: Derive from revenue structure and other income sources
 */
export function calculateNonInterestIncomeRatio(
  nonInterestIncome: number, 
  totalIncome: number
): number {
  if (!totalIncome || totalIncome === 0) return 0;
  if (!nonInterestIncome) return 0;
  
  return nonInterestIncome / totalIncome;
}

/**
 * Calculate Capital Adequacy Ratio (Basic)
 * Formula: Tier 1 Capital / Risk-Weighted Assets
 * Simplified: Shareholders Equity / Total Assets
 */
export function calculateCapitalAdequacyRatio(
  shareholdersEquity: number, 
  totalAssets: number
): number {
  if (!totalAssets || totalAssets === 0) return 0;
  if (!shareholdersEquity) return 0;
  
  return shareholdersEquity / totalAssets;
}

/**
 * Calculate all 6 finance-specific ratios for a banking company
 */
export function calculateFinanceRatios(input: FinanceRatiosInput): FinanceRatios {
  const { financialData, companyInfo } = input;
  
  // Handle missing data
  if (!financialData || financialData.length === 0) {
    return {
      netInterestMargin: 0,
      costToIncomeRatio: 0,
      loanGrowthRate: 0,
      depositGrowthRate: 0,
      nonInterestIncomeRatio: 0,
      capitalAdequacyRatio: 0
    };
  }
  
  const latest = financialData[0];
  const previous = financialData[1];
  
  // Calculate derived fields for banking ratios
  
  // 1. Net Interest Margin - derive from revenue structure
  // For banks, assume 70% of revenue is net interest income
  const estimatedNetInterestIncome = latest.revenue * 0.7;
  const netInterestMargin = calculateNetInterestMargin(
    estimatedNetInterestIncome, 
    latest.total_assets
  );
  
  // 2. Cost-to-Income Ratio - derive from revenue and net income
  // Operating expenses = Revenue - Net Income - Tax
  const estimatedTax = latest.net_income * 0.3; // Assume 30% tax rate
  const operatingExpenses = latest.revenue - latest.net_income - estimatedTax;
  const costToIncomeRatio = calculateCostToIncomeRatio(
    operatingExpenses, 
    latest.revenue
  );
  
  // 3. Loan Growth Rate - use current_assets as proxy
  const loanGrowthRate = previous 
    ? calculateLoanGrowthRate(latest.current_assets, previous.current_assets)
    : 0;
  
  // 4. Deposit Growth Rate - extract from debt
  // Assume 85% of debt is customer deposits, 15% is institutional borrowings
  const currentDeposits = latest.debt * 0.85;
  const previousDeposits = previous ? previous.debt * 0.85 : currentDeposits;
  const depositGrowthRate = previous 
    ? calculateDepositGrowthRate(currentDeposits, previousDeposits)
    : 0;
  
  // 5. Non-Interest Income Ratio - assume 30% of revenue is fees/other income
  const estimatedNonInterestIncome = latest.revenue * 0.3;
  const nonInterestIncomeRatio = calculateNonInterestIncomeRatio(
    estimatedNonInterestIncome, 
    latest.revenue
  );
  
  // 6. Capital Adequacy Ratio - basic calculation
  const capitalAdequacyRatio = calculateCapitalAdequacyRatio(
    latest.shareholders_equity, 
    latest.total_assets
  );
  
  return {
    netInterestMargin,
    costToIncomeRatio,
    loanGrowthRate,
    depositGrowthRate,
    nonInterestIncomeRatio,
    capitalAdequacyRatio
  };
} 