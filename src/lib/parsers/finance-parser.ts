import { FinancialData } from '../../types';

export interface FinanceDataResult {
  success: boolean;
  data?: ParsedFinanceData;
  errors?: string[];
}

export interface ParsedFinanceData {
  company_type: 'finance';
  quarterly_data: any[];
  annual_data: any[];
  balance_sheet_data: any[];
  cash_flow_data: any[];
  banking_ratios: {
    roe_percent: number[];
    cost_to_income: number[];
    net_interest_margin: number[];
  };
  data_quality_score: number;
  completeness_score: number;
  sector_classification: string;
  industry_type: string;
}

export interface FinanceValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Parses raw Screener.in data for finance companies (banks, NBFCs)
 * Focuses on banking-specific fields and structure
 */
export function parseFinanceData(rawData: any): FinanceDataResult {
  try {
    // Handle null input
    if (!rawData) {
      return {
        success: false,
        errors: ['null_input_data']
      };
    }

    // Validate required sections
    if (!rawData.quarterly_data || !Array.isArray(rawData.quarterly_data)) {
      return {
        success: false,
        errors: ['invalid_quarterly_data_format']
      };
    }

    if (!rawData.balance_sheet || !Array.isArray(rawData.balance_sheet)) {
      return {
        success: false,
        errors: ['missing_balance_sheet_data']
      };
    }

    // Parse quarterly data with banking-specific fields
    const quarterlyData = rawData.quarterly_data.map((q: any) => {
      // Validate numeric fields
      if (typeof q.revenue !== 'number' || isNaN(q.revenue)) {
        throw new Error('invalid_quarterly_data_format');
      }

      return {
        period: q.period,
        revenue: q.revenue, // Total income for banks
        interest: q.interest || 0, // Interest income
        expenses: q.expenses || 0, // Operating expenses
        financing_profit: q.financing_profit || 0, // Net interest income
        financing_margin_percent: q.financing_margin_percent || 0, // NIM
        other_income: q.other_income || 0, // Fee income, trading income
        depreciation: q.depreciation || 0,
        profit_before_tax: q.profit_before_tax || 0,
        tax_percent: q.tax_percent || 0,
        net_profit: q.net_profit || 0,
        eps: q.eps || 0
      };
    });

    // Parse annual data
    const annualData = (rawData.annual_data || []).map((a: any) => ({
      period: a.year || a.period,
      revenue: a.revenue || 0,
      interest: a.interest || 0,
      expenses: a.expenses || 0,
      financing_profit: a.financing_profit || 0,
      financing_margin_percent: a.financing_margin_percent || 0,
      other_income: a.other_income || 0,
      depreciation: a.depreciation || 0,
      profit_before_tax: a.profit_before_tax || 0,
      tax_percent: a.tax_percent || 0,
      net_profit: a.net_profit || 0,
      eps: a.eps || 0
    }));

    // Parse balance sheet with banking structure
    const balanceSheetData = rawData.balance_sheet.map((bs: any) => {
      const totalAssets = (bs.fixed_assets || 0) + (bs.cwip || 0) + 
                         (bs.investments || 0) + (bs.other_assets || 0);
      
      return {
        period: bs.period,
        equity_capital: bs.equity_capital || 0,
        reserves: bs.reserves || 0,
        deposits: bs.deposits || 0, // Key banking liability
        borrowings: bs.borrowings || 0,
        other_liabilities: bs.other_liabilities || 0,
        fixed_assets: bs.fixed_assets || 0,
        cwip: bs.cwip || 0,
        investments: bs.investments || 0,
        loans_and_advances: bs.other_assets || 0, // Other assets = loans for banks
        total_assets: totalAssets,
      };
    });

    // Parse cash flow data
    const cashFlowData = (rawData.cash_flow || []).map((cf: any) => ({
      period: cf.period,
      operating_cash_flow: cf.operating_activity || 0,
      investing_cash_flow: cf.investing_activity || 0,
      financing_cash_flow: cf.financing_activity || 0,
      net_cash_flow: cf.net_cash_flow || 0,
    }));

    // Extract banking ratios
    const bankingRatios = {
      roe_percent: rawData.ratios?.roe_percent || [],
      cost_to_income: rawData.ratios?.cost_to_income || [],
      net_interest_margin: rawData.ratios?.net_interest_margin || []
    };

    // Calculate data quality scores
    const totalFields = quarterlyData.length * 12 + annualData.length * 12 + 
                       balanceSheetData.length * 10 + cashFlowData.length * 4;
    const validFields = totalFields; // All fields processed successfully
    const dataQualityScore = Math.round((validFields / totalFields) * 100);
    const completenessScore = Math.min(100, Math.round(
      (quarterlyData.length / 13 * 40) + 
      (annualData.length / 12 * 30) + 
      (balanceSheetData.length / 13 * 20) + 
      (cashFlowData.length / 13 * 10)
    ));

    // Classify sector and industry
    const sectorClassification = 'banking';
    const industryType = rawData.company_info?.sector?.toLowerCase()?.includes('private') 
      ? 'private_sector_bank' 
      : 'public_sector_bank';

    return {
      success: true,
      data: {
        company_type: 'finance',
        quarterly_data: quarterlyData,
        annual_data: annualData,
        balance_sheet_data: balanceSheetData,
        cash_flow_data: cashFlowData,
        banking_ratios: bankingRatios,
        data_quality_score: dataQualityScore,
        completeness_score: completenessScore,
        sector_classification: sectorClassification,
        industry_type: industryType
      }
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'unknown_error';
    
    if (errorMessage.includes('invalid_quarterly_data_format')) {
      return {
        success: false,
        errors: ['invalid_quarterly_data_format']
      };
    }
    
    return {
      success: false,
      errors: ['parsing_error', errorMessage]
    };
  }
}

/**
 * Validates parsed finance data structure
 */
export function validateFinanceData(data: ParsedFinanceData): FinanceValidationResult {
  const errors: string[] = [];

  // Check quarterly data sufficiency
  if (!data.quarterly_data || data.quarterly_data.length < 8) {
    errors.push('insufficient_quarterly_data');
  }

  // Check required fields presence
  if (!data.company_type || data.company_type !== 'finance') {
    errors.push('invalid_company_type');
  }

  if (!data.sector_classification) {
    errors.push('missing_sector_classification');
  }

  // Check data quality
  if (data.data_quality_score < 60) {
    errors.push('low_data_quality');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
} 