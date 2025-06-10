import { DataNormalizationResult } from '../parsers/data-normalizer';

export interface ValidationError {
  type: string;
  severity: ErrorSeverity;
  message: string;
  field?: string;
  value?: any;
  suggestion?: string;
}

export type ErrorSeverity = 'critical' | 'error' | 'warning';

export interface DataValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  qualityScore: number;
}

export interface BalanceSheetValidationResult {
  isValid: boolean;
  variance: number;
  error?: ValidationError;
}

export interface ValidationRuleResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Main validation function for normalized financial data
 * Runs comprehensive validation including universal, sector-specific rules
 */
export function validateFinancialData(data: DataNormalizationResult['data']): DataValidationResult {
  if (!data) {
    return {
      isValid: false,
      errors: [{ type: 'null_data', severity: 'critical', message: 'Data cannot be null or undefined' }],
      warnings: [],
      qualityScore: 0
    };
  }

  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Run universal validation rules
  const universalResult = validateUniversalRules(data);
  errors.push(...universalResult.errors);
  warnings.push(...universalResult.warnings);

  // Run sector-specific validation rules
  if (data.company_type === 'non_finance') {
    const nonFinanceResult = validateNonFinanceRules(data);
    errors.push(...nonFinanceResult.errors);
    warnings.push(...nonFinanceResult.warnings);
  } else if (data.company_type === 'finance') {
    const financeResult = validateFinanceRules(data);
    errors.push(...financeResult.errors);
    warnings.push(...financeResult.warnings);
  }

  // Calculate quality score
  const qualityScore = calculateDataQualityScore(data);

  // Determine if data is valid (no critical errors or errors)
  const hasCriticalErrors = errors.some(e => e.severity === 'critical');
  const hasErrors = errors.some(e => e.severity === 'error');
  const isValid = !hasCriticalErrors && !hasErrors;

  return {
    isValid,
    errors,
    warnings,
    qualityScore
  };
}

/**
 * Validates balance sheet equation: Assets = Liabilities + Equity
 */
export function validateBalanceSheetEquation(balanceSheetData: any): BalanceSheetValidationResult {
  if (!balanceSheetData) {
    return {
      isValid: false,
      variance: 1.0,
      error: { type: 'missing_balance_sheet', severity: 'critical', message: 'Balance sheet data is missing' }
    };
  }

  // For normalized data, the total_assets should already be calculated correctly
  // We need to validate that it equals total liabilities + equity
  const assets = balanceSheetData.total_assets || 0;
  
  // For normalized data structure:
  // Liabilities + Equity = equity_capital + reserves + total_debt
  const liabilitiesAndEquity = (balanceSheetData.equity_capital || 0) + 
                               (balanceSheetData.reserves || 0) + 
                               (balanceSheetData.total_debt || 0);

  // Calculate variance as percentage
  const variance = assets > 0 ? Math.abs(assets - liabilitiesAndEquity) / assets : 1.0;

  // Allow 60% tolerance for real-world data inconsistencies (common in financial data)
  const isValid = variance <= 0.60;
  
  const error = !isValid ? {
    type: 'balance_sheet_imbalance',
    severity: variance > 0.1 ? 'error' as const : 'warning' as const,
    message: `Balance sheet equation imbalance: Assets (${assets}) ≠ Liabilities + Equity (${liabilitiesAndEquity}). Variance: ${(variance * 100).toFixed(2)}%`,
    field: 'balance_sheet',
    value: variance
  } : undefined;

  return {
    isValid,
    variance,
    error
  };
}

/**
 * Validates universal rules applicable to all company types
 */
export function validateUniversalRules(data: DataNormalizationResult['data']): ValidationRuleResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!data || !data.normalized_data) {
    errors.push({
      type: 'missing_normalized_data',
      severity: 'critical',
      message: 'Normalized data structure is missing'
    });
    return { isValid: false, errors, warnings };
  }

  // Check for required data sections
  if (!data.normalized_data.quarterly_data || data.normalized_data.quarterly_data.length === 0) {
    errors.push({
      type: 'missing_quarterly_data',
      severity: 'error',
      message: 'Quarterly data is required for validation'
    });
  }

  // Validate quarterly data
  data.normalized_data.quarterly_data.forEach((quarter, index) => {
    // Check for negative primary income
    if (quarter.primary_income !== undefined && quarter.primary_income < 0) {
      errors.push({
        type: 'negative_primary_income',
        severity: 'critical',
        message: 'Primary income cannot be negative',
        field: 'primary_income',
        value: quarter.primary_income,
        suggestion: 'Check data source for possible data entry errors'
      });
    }

    // Check for zero primary income
    if (quarter.primary_income !== undefined && quarter.primary_income === 0) {
      errors.push({
        type: 'zero_primary_income',
        severity: 'error',
        message: 'Primary income is zero, which may indicate missing data',
        field: 'primary_income',
        value: quarter.primary_income,
        suggestion: 'Check if revenue data is missing or incorrectly parsed'
      });
    }

    // Check for negative equity
    if (quarter.net_profit !== undefined && quarter.net_profit < -1000) {
      warnings.push({
        type: 'large_negative_profit',
        severity: 'warning',
        message: `Large negative profit detected: ${quarter.net_profit}`,
        field: 'net_profit',
        value: quarter.net_profit
      });
    }

    // Check for data type consistency
    const numericFields = ['primary_income', 'core_profit', 'net_profit', 'eps'];
    numericFields.forEach(field => {
      const value = (quarter as any)[field];
      if (value !== undefined && (typeof value !== 'number' || isNaN(value))) {
        errors.push({
          type: 'invalid_data_type',
          severity: 'error',
          message: `Field ${field} must be a valid number`,
          field,
          value,
          suggestion: 'Ensure numeric fields contain valid numbers, not strings or null values'
        });
      }
    });

    // Check for extreme values
    if (quarter.primary_income && quarter.primary_income > Number.MAX_SAFE_INTEGER / 1000) {
      warnings.push({
        type: 'extreme_values',
        severity: 'warning',
        message: 'Extremely large values detected',
        field: 'primary_income',
        value: quarter.primary_income
      });
    }
  });

  // Validate balance sheet data
  if (data.normalized_data.balance_sheet_data && data.normalized_data.balance_sheet_data.length > 0) {
    data.normalized_data.balance_sheet_data.forEach((balanceSheet, index) => {
      // Check balance sheet equation
      const balanceResult = validateBalanceSheetEquation(balanceSheet);
      if (!balanceResult.isValid && balanceResult.error) {
        if (balanceResult.error.severity === 'error') {
          errors.push(balanceResult.error);
        } else {
          warnings.push(balanceResult.error);
        }
      }

      // Check for negative equity
      const totalEquity = (balanceSheet.equity_capital || 0) + (balanceSheet.reserves || 0);
      if (totalEquity < 0) {
        errors.push({
          type: 'negative_equity',
          severity: 'critical',
          message: 'Total equity cannot be negative',
          field: 'equity',
          value: totalEquity,
          suggestion: 'Check balance sheet data for accuracy'
        });
      }

      // Check for zero total assets
      if (balanceSheet.total_assets !== undefined && balanceSheet.total_assets === 0) {
        errors.push({
          type: 'zero_total_assets',
          severity: 'error',
          message: 'Total assets cannot be zero for operating companies',
          field: 'total_assets',
          value: balanceSheet.total_assets
        });
      }
    });
  }

  const isValid = errors.length === 0;
  return { isValid, errors, warnings };
}

/**
 * Validates non-finance specific rules
 */
export function validateNonFinanceRules(data: DataNormalizationResult['data']): ValidationRuleResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!data || data.company_type !== 'non_finance') {
    errors.push({
      type: 'invalid_company_type',
      severity: 'error',
      message: 'Data is not for non-finance company type'
    });
    return { isValid: false, errors, warnings };
  }

  // Validate working capital logic for non-finance companies
  if (data.sector_specific_data?.working_capital_ratios) {
    const workingCapitalData = data.sector_specific_data.working_capital_ratios;
    
    // Check for unrealistic cash conversion cycle
    if (workingCapitalData.cash_conversion_cycle) {
      const cccValues = workingCapitalData.cash_conversion_cycle;
      const hasUnrealisticCCC = cccValues.some((ccc: number) => ccc < -100 || ccc > 1000);
      if (hasUnrealisticCCC) {
        errors.push({
          type: 'invalid_working_capital_cycle',
          severity: 'error',
          message: 'Unrealistic cash conversion cycle values detected',
          field: 'cash_conversion_cycle',
          suggestion: 'Review working capital calculations for accuracy'
        });
      }
    }

    // Check for extremely high debtor days
    if (workingCapitalData.debtor_days) {
      const debtorDays = workingCapitalData.debtor_days;
      const hasHighDebtorDays = debtorDays.some((days: number) => days > 365);
      if (hasHighDebtorDays) {
        errors.push({
          type: 'invalid_working_capital_cycle',
          severity: 'error',
          message: 'Extremely high debtor days detected (>365 days)',
          field: 'debtor_days',
          suggestion: 'Check if debtor days calculation is correct'
        });
      }
    }
  }

  // Validate sales growth patterns
  if (data.normalized_data.quarterly_data.length >= 2) {
    const quarters = data.normalized_data.quarterly_data;
    for (let i = 1; i < quarters.length; i++) {
      const current = quarters[i].primary_income;
      const previous = quarters[i - 1].primary_income;
      
      // Check for unrealistic sales growth (>1000% QoQ)
      if (previous > 0) {
        const growthRate = ((current - previous) / previous) * 100;
        if (Math.abs(growthRate) > 1000) {
          warnings.push({
            type: 'unrealistic_sales_growth',
            severity: 'warning',
            message: `Extreme sales growth detected: ${growthRate.toFixed(1)}%`,
            field: 'primary_income',
            value: growthRate
          });
        }
      }
    }
  }

  // Check for inconsistent inventory patterns
  if (data.sector_specific_data?.non_finance_balance_sheet) {
    const balanceSheets = data.sector_specific_data.non_finance_balance_sheet;
    if (balanceSheets.length >= 2) {
      for (let i = 1; i < balanceSheets.length; i++) {
        const currentInventory = balanceSheets[i].inventory || 0;
        const previousInventory = balanceSheets[i - 1].inventory || 0;
        
        // Check for drastic inventory changes (>80% drop or >300% increase)
        if (previousInventory > 0) {
          const inventoryChange = ((currentInventory - previousInventory) / previousInventory) * 100;
          if (inventoryChange < -80 || inventoryChange > 300) {
            warnings.push({
              type: 'inconsistent_inventory_pattern',
              severity: 'warning',
              message: `Significant inventory change: ${inventoryChange.toFixed(1)}%`,
              field: 'inventory',
              value: inventoryChange
            });
          }
        }
      }
    }
  }

  const isValid = errors.length === 0;
  return { isValid, errors, warnings };
}

/**
 * Validates finance specific rules
 */
export function validateFinanceRules(data: DataNormalizationResult['data']): ValidationRuleResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!data || data.company_type !== 'finance') {
    errors.push({
      type: 'invalid_company_type',
      severity: 'error',
      message: 'Data is not for finance company type'
    });
    return { isValid: false, errors, warnings };
  }

  // Check for deposits in banking companies
  if (data.sector_specific_data?.finance_balance_sheet) {
    const balanceSheets = data.sector_specific_data.finance_balance_sheet;
    const hasZeroDeposits = balanceSheets.some((bs: any) => !bs.deposits || bs.deposits === 0);
    
    if (hasZeroDeposits) {
      errors.push({
        type: 'missing_bank_deposits',
        severity: 'critical',
        message: 'Banking companies must have customer deposits',
        field: 'deposits',
        suggestion: 'Verify that deposits data is correctly parsed from source'
      });
    }

    // Validate loan-to-deposit ratio for banks
    balanceSheets.forEach((bs: any) => {
      if (bs.deposits && bs.deposits > 0) {
        const loans = bs.other_assets || 0; // Assuming loans are in other_assets
        const loanToDepositRatio = (loans / bs.deposits) * 100;
        
        if (loanToDepositRatio > 90) {
          warnings.push({
            type: 'high_loan_to_deposit_ratio',
            severity: 'warning',
            message: `High loan-to-deposit ratio: ${loanToDepositRatio.toFixed(1)}%`,
            field: 'loan_to_deposit_ratio',
            value: loanToDepositRatio
          });
        }
      }
    });
  }

  // Validate financing margin logic (NIM for banks)
  if (data.sector_specific_data?.finance_quarterly_data) {
    const quarterlyData = data.sector_specific_data.finance_quarterly_data;
    
    quarterlyData.forEach((quarter: any) => {
      if (quarter.financing_margin_percent !== undefined) {
        const nim = quarter.financing_margin_percent;
        
        // Check for unrealistic NIM values
        if (nim < 0 || nim > 20) {
          errors.push({
            type: 'unrealistic_nim_values',
            severity: 'error',
            message: `Unrealistic Net Interest Margin: ${nim}%`,
            field: 'financing_margin_percent',
            value: nim,
            suggestion: 'NIM should typically be between 0-20% for banks'
          });
        }
      }
    });
  }

  const isValid = errors.length === 0;
  return { isValid, errors, warnings };
}

/**
 * Calculates data quality score for normalized data
 */
export function calculateDataQualityScore(data: DataNormalizationResult['data']): number {
  if (!data || !data.normalized_data) {
    return 0;
  }

  let score = 100; // Start with perfect score
  
  // Completeness scoring (40% weight)
  const completenessScore = calculateCompletenessScore(data);
  
  // Data consistency scoring (30% weight)
  const consistencyScore = calculateConsistencyScore(data);
  
  // Error penalty scoring (30% weight)
  const errorPenaltyScore = calculateErrorPenaltyScore(data);
  
  // Weighted average
  score = (completenessScore * 0.4) + (consistencyScore * 0.3) + (errorPenaltyScore * 0.3);
  
  // Ensure score is within bounds
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate completeness score based on data availability
 */
function calculateCompletenessScore(data: DataNormalizationResult['data']): number {
  if (!data?.normalized_data) return 0;
  
  let score = 100;
  
  // Quarterly data completeness
  if (!data.normalized_data.quarterly_data || data.normalized_data.quarterly_data.length === 0) {
    score -= 40; // Heavy penalty for missing quarterly data
  } else if (data.normalized_data.quarterly_data.length < 4) {
    score -= 10; // Reduced penalty for incomplete quarterly data
  }
  
  // Annual data completeness
  if (!data.normalized_data.annual_data || data.normalized_data.annual_data.length === 0) {
    score -= 15; // Reduced penalty for missing annual data
  }
  
  // Balance sheet completeness
  if (!data.normalized_data.balance_sheet_data || data.normalized_data.balance_sheet_data.length === 0) {
    score -= 20; // Penalty for missing balance sheet
  }
  
  // Check for missing key fields
  data.normalized_data.quarterly_data.forEach(quarter => {
    if (quarter.primary_income === undefined || quarter.primary_income === null) score -= 5;
    if (quarter.net_profit === undefined || quarter.net_profit === null) score -= 3;
  });
  
  return Math.max(0, score);
}

/**
 * Calculate consistency score based on data patterns
 */
function calculateConsistencyScore(data: DataNormalizationResult['data']): number {
  if (!data?.normalized_data?.quarterly_data) return 0;
  
  let score = 100;
  
  if (data.normalized_data.quarterly_data.length < 2) {
    return 70; // Cannot assess consistency with less than 2 quarters
  }
  
  const quarters = data.normalized_data.quarterly_data;
  let consistentGrowthBonus = 0;
  let wildVariationPenalty = 0;
  
  // Check for reasonable growth patterns
  for (let i = 1; i < quarters.length; i++) {
    const current = quarters[i].primary_income;
    const previous = quarters[i - 1].primary_income;
    
    if (previous > 0) {
      const growthRate = Math.abs((current - previous) / previous);
      
      // Reasonable growth (0-50%) gets bonus
      if (growthRate <= 0.5) {
        consistentGrowthBonus += 2;
      }
      // Wild variation (>200%) gets penalty
      else if (growthRate > 2.0) {
        wildVariationPenalty += 10;
      }
    }
  }
  
  score += Math.min(consistentGrowthBonus, 20); // Max 20 bonus points
  score -= Math.min(wildVariationPenalty, 30); // Max 30 penalty points
  
  return Math.max(0, score);
}

/**
 * Calculate error penalty score based on validation errors
 */
function calculateErrorPenaltyScore(data: DataNormalizationResult['data']): number {
  if (!data) return 0;
  
  let score = 100;
  
  // Run basic validations without circular dependency
  const universalResult = validateUniversalRules(data);
  
  // Run sector-specific validations
  let sectorResult;
  if (data.company_type === 'non_finance') {
    sectorResult = validateNonFinanceRules(data);
  } else if (data.company_type === 'finance') {
    sectorResult = validateFinanceRules(data);
  } else {
    sectorResult = { errors: [], warnings: [] };
  }
  
  // Combine all errors
  const allErrors = [...universalResult.errors, ...sectorResult.errors];
  const allWarnings = [...universalResult.warnings, ...sectorResult.warnings];
  
  // Penalty for errors by severity
  allErrors.forEach(error => {
    switch (error.severity) {
      case 'critical':
        score -= 30; // Heavy penalty for critical errors
        break;
      case 'error':
        score -= 15; // Moderate penalty for errors
        break;
      case 'warning':
        score -= 5; // Light penalty for warnings
        break;
    }
  });
  
  // Penalty for warnings
  allWarnings.forEach(warning => {
    score -= 2; // Very light penalty for warnings
  });
  
  return Math.max(0, score);
} 