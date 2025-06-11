/**
 * Integration Service Layer
 * Task 4.2: Parser Service Integration (Unified parsing service)
 * Connects calculation engine (Task 3.0) with database service (Task 4.1)
 */

import { parseNonFinanceData } from '../lib/parsers/non-finance-parser';
import { parseFinanceData } from '../lib/parsers/finance-parser';
import { calculateUniversalRatios } from '../lib/calculations/universal-ratios';
import { calculateNonFinanceRatios } from '../lib/calculations/non-finance-ratios';
import { calculateFinanceRatios } from '../lib/calculations/finance-ratios';
import { DatabaseService, getDatabaseService, Company, AnnualMetrics } from './database.service';
// Using existing types from parsers
type ScreenerData = any; // Raw screener data
type NormalizedData = any; // Normalized data from parsers
import { createHash } from 'crypto';

// =============================================
// INTEGRATION TYPES
// =============================================

export interface ImportResult {
  success: boolean;
  companyId: string | null;
  snapshotId: string | null;
  metricsCreated: boolean;
  ratiosCalculated: boolean;
  cycleDetected: boolean;
  errors: string[];
  warnings: string[];
}

export interface ImportOptions {
  validateData?: boolean;
  skipDuplicates?: boolean;
  calculateRatios?: boolean;
  detectCycles?: boolean;
  updateExisting?: boolean;
}

// =============================================
// INTEGRATION SERVICE CLASS
// =============================================

export class IntegrationService {
  private dbService: DatabaseService;

  constructor(databaseService?: DatabaseService) {
    this.dbService = databaseService || getDatabaseService();
  }

  // =============================================
  // SINGLE COMPANY IMPORT
  // =============================================

  async importCompanyData(
    screenerData: ScreenerData,
    options: ImportOptions = {}
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      companyId: null,
      snapshotId: null,
      metricsCreated: false,
      ratiosCalculated: false,
      cycleDetected: false,
      errors: [],
      warnings: [],
    };

    try {
      // Step 1: Validate input data
      if (options.validateData !== false) {
        const validation = this.validateScreenerData(screenerData);
        if (!validation.isValid) {
          result.errors.push(...validation.errors);
          return result;
        }
        if (validation.warnings.length > 0) {
          result.warnings.push(...validation.warnings);
        }
      }

      // Step 2: Parse and normalize data
      const normalizedData = await this.parseAndNormalizeData(screenerData);
      if (!normalizedData) {
        result.errors.push('Failed to parse company data');
        return result;
      }

      // Step 3: Create or get company
      const company = await this.createOrGetCompany(normalizedData, options.updateExisting || false);
      if (!company) {
        result.errors.push('Failed to create or retrieve company');
        return result;
      }
      result.companyId = company.id;

      // Step 4: Create financial snapshot
      const snapshot = await this.createFinancialSnapshot(company.id, screenerData);
      if (!snapshot) {
        result.errors.push('Failed to create financial snapshot');
        return result;
      }
      result.snapshotId = snapshot.id;

      // Step 5: Create annual metrics
      const metrics = await this.createAnnualMetrics(company.id, normalizedData, snapshot.id);
      if (metrics) {
        result.metricsCreated = true;
      } else {
        result.warnings.push('Failed to create annual metrics');
      }

      // Step 6: Calculate and store ratios
      if (options.calculateRatios !== false) {
        const ratiosStored = await this.calculateAndStoreRatios(company.id, normalizedData, snapshot.id);
        if (ratiosStored) {
          result.ratiosCalculated = true;
        } else {
          result.warnings.push('Failed to calculate or store ratios');
        }
      }

      result.success = true;
      return result;

    } catch (error) {
      result.errors.push(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return result;
    }
  }

  // =============================================
  // DATA PARSING AND NORMALIZATION
  // =============================================

  private async parseAndNormalizeData(screenerData: ScreenerData): Promise<NormalizedData | null> {
    try {
      // Determine company type based on sector
      const isFinanceCompany = this.isFinanceCompany(screenerData);

      if (isFinanceCompany) {
        return parseFinanceData(screenerData);
      } else {
        return parseNonFinanceData(screenerData);
      }
    } catch (error) {
      console.error('Failed to parse data:', error);
      return null;
    }
  }

  private isFinanceCompany(screenerData: ScreenerData): boolean {
    const financeSectors = ['Financial Services', 'Banking', 'Insurance', 'NBFC'];
    const sector = screenerData.company?.sector || '';
    return financeSectors.some(fs => sector.toLowerCase().includes(fs.toLowerCase()));
  }

  // =============================================
  // COMPANY MANAGEMENT
  // =============================================

  private async createOrGetCompany(normalizedData: NormalizedData, updateExisting: boolean): Promise<Company | null> {
    try {
      // Try to get existing company
      const existingCompany = await this.dbService.getCompanyBySymbol(normalizedData.company.symbol);

      if (existingCompany) {
        return existingCompany;
      }

      // Create new company
      const companyType = this.isFinanceCompany(normalizedData as any) ? 
        (normalizedData.company.sector?.toLowerCase().includes('bank') ? 'banking' : 'finance') : 
        'general';

      const newCompany = await this.dbService.createCompany({
        symbol: normalizedData.company.symbol,
        name: normalizedData.company.name,
        sector: normalizedData.company.sector || null,
        industry: normalizedData.company.industry || null,
        company_type: companyType,
        market_cap: normalizedData.company.marketCap || null,
        is_active: true,
      });

      return newCompany;
    } catch (error) {
      console.error('Failed to create or get company:', error);
      return null;
    }
  }

  // =============================================
  // SNAPSHOT MANAGEMENT
  // =============================================

  private async createFinancialSnapshot(companyId: string, screenerData: ScreenerData): Promise<any> {
    try {
      const jsonString = JSON.stringify(screenerData);
      const jsonHash = createHash('sha256').update(jsonString).digest('hex');

      const snapshot = await this.dbService.createFinancialSnapshot({
        company_id: companyId,
        snapshot_date: new Date().toISOString().split('T')[0],
        raw_json: screenerData,
        json_hash: jsonHash,
      });

      return snapshot;
    } catch (error) {
      console.error('Failed to create financial snapshot:', error);
      return null;
    }
  }

  // =============================================
  // METRICS CREATION
  // =============================================

  private async createAnnualMetrics(
    companyId: string, 
    normalizedData: NormalizedData, 
    snapshotId: string
  ): Promise<AnnualMetrics | null> {
    try {
      // Get the latest year's data
      const latestYear = Math.max(...Object.keys(normalizedData.annualData).map(Number));
      const yearData = normalizedData.annualData[latestYear];

      if (!yearData) {
        return null;
      }

      const metrics = await this.dbService.createAnnualMetrics({
        company_id: companyId,
        fiscal_year: latestYear,
        
        // Revenue & Profitability
        revenue: yearData.revenue || null,
        operating_profit: yearData.operatingProfit || null,
        net_profit: yearData.netProfit || null,
        ebitda: yearData.ebitda || null,
        
        // Margins
        opm_percent: yearData.operatingMargin || null,
        npm_percent: yearData.netMargin || null,
        ebitda_margin_percent: yearData.ebitdaMargin || null,
        
        // Balance Sheet
        total_assets: yearData.totalAssets || null,
        total_equity: yearData.totalEquity || null,
        total_debt: yearData.totalDebt || null,
        cash_and_equivalents: yearData.cash || null,
        
        // Cash Flow
        operating_cash_flow: yearData.operatingCashFlow || null,
        investing_cash_flow: yearData.investingCashFlow || null,
        financing_cash_flow: yearData.financingCashFlow || null,
        free_cash_flow: yearData.freeCashFlow || null,
        
        // Per Share
        eps: yearData.eps || null,
        book_value_per_share: yearData.bookValuePerShare || null,
        
        // Growth Rates
        revenue_growth_yoy: this.calculateGrowthRate(normalizedData.annualData, latestYear, 'revenue'),
        profit_growth_yoy: this.calculateGrowthRate(normalizedData.annualData, latestYear, 'netProfit'),
        eps_growth_yoy: this.calculateGrowthRate(normalizedData.annualData, latestYear, 'eps'),
        
        snapshot_id: snapshotId,
      });

      return metrics;
    } catch (error) {
      console.error('Failed to create annual metrics:', error);
      return null;
    }
  }

  private calculateGrowthRate(
    annualData: Record<number, any>, 
    currentYear: number, 
    metric: string
  ): number | null {
    const currentValue = annualData[currentYear]?.[metric];
    const previousValue = annualData[currentYear - 1]?.[metric];

    if (!currentValue || !previousValue || previousValue === 0) {
      return null;
    }

    return ((currentValue - previousValue) / previousValue) * 100;
  }

  // =============================================
  // RATIOS CALCULATION AND STORAGE
  // =============================================

  private async calculateAndStoreRatios(
    companyId: string,
    normalizedData: NormalizedData,
    snapshotId: string
  ): Promise<boolean> {
    try {
      // Calculate universal ratios first
      const universalRatios = calculateUniversalRatios({
        financialData: normalizedData.annualData ? Object.values(normalizedData.annualData) : [],
        marketData: normalizedData.marketData || {},
        companyInfo: normalizedData.company || {}
      });

      // Calculate sector-specific ratios
      let sectorRatios: any = {};
      if (this.isFinanceCompany(normalizedData)) {
        sectorRatios = calculateFinanceRatios({
          financialData: normalizedData.annualData ? Object.values(normalizedData.annualData) : [],
          companyInfo: normalizedData.company || {}
        });
      } else {
        sectorRatios = calculateNonFinanceRatios({
          quarterlyData: normalizedData.quarterlyData || {},
          balanceSheetData: normalizedData.balanceSheetData || {},
          cashFlowData: normalizedData.cashFlowData || {},
          workingCapitalRatios: normalizedData.workingCapitalRatios || {}
        });
      }

      // Combine all ratios
      const calculatedRatios = {
        valuation: {
          priceToBook: universalRatios.priceToBook,
          priceToSales: 0, // Not available in universal ratios
          peRatio: universalRatios.priceToEarnings,
          evToEbitda: 0, // Not available
          marketCapToCashFlow: 0 // Not available
        },
        profitability: {
          roe: universalRatios.roe,
          roce: sectorRatios.returnOnCapitalEmployed || 0,
          roa: 0 // Calculate from available data
        },
        efficiency: {
          assetTurnover: universalRatios.assetTurnover,
          equityTurnover: 0,
          workingCapitalDays: sectorRatios.workingCapitalDays || 0,
          cashConversionCycle: sectorRatios.cashConversionCycle || 0
        },
        leverage: {
          debtToEquity: universalRatios.debtToEquity,
          debtToAssets: 0,
          equityRatio: 0,
          interestCoverage: sectorRatios.interestCoverageRatio || 0
        },
        liquidity: {
          currentRatio: sectorRatios.currentRatio || 0,
          quickRatio: sectorRatios.quickRatio || 0
        },
        cashFlow: {
          operatingCashFlowMargin: 0,
          freeCashFlowYield: 0,
          cashConversionEfficiency: 0
        },
        quality: {
          earningsQualityScore: 'Good',
          revenueVolatility: 0,
          marginStability: 0
        },
        growth: {
          revenueCagr3y: universalRatios.revenueGrowth3Y,
          revenueCagr5y: universalRatios.revenueGrowth5Y,
          revenueCagr10y: 0,
          profitCagr3y: universalRatios.profitGrowth3Y,
          profitCagr5y: universalRatios.profitGrowth5Y,
          profitCagr10y: 0
        },
        financeSpecific: {
          npaPercent: 0,
          loanBookGrowth: sectorRatios.loanGrowthRate || 0,
          creditCostRatio: 0
        }
      };

      if (!calculatedRatios) {
        return false;
      }

      // Get the latest year for which we have data
      const latestYear = Math.max(...Object.keys(normalizedData.annualData).map(Number));
      const periodDate = `${latestYear}-12-31`;

      // Store ratios in database
      await this.dbService.upsertCalculatedRatios({
        company_id: companyId,
        period_date: periodDate,
        period_type: 'annual',
        
        // Valuation Ratios
        price_to_book: calculatedRatios.valuation?.priceToBook || null,
        price_to_sales: calculatedRatios.valuation?.priceToSales || null,
        pe_ratio: calculatedRatios.valuation?.peRatio || null,
        ev_to_ebitda: calculatedRatios.valuation?.evToEbitda || null,
        market_cap_to_cash_flow: calculatedRatios.valuation?.marketCapToCashFlow || null,
        
        // Profitability Ratios
        roe_percent: calculatedRatios.profitability?.roe || null,
        roce_percent: calculatedRatios.profitability?.roce || null,
        roa_percent: calculatedRatios.profitability?.roa || null,
        
        // Efficiency Ratios
        asset_turnover: calculatedRatios.efficiency?.assetTurnover || null,
        equity_turnover: calculatedRatios.efficiency?.equityTurnover || null,
        working_capital_days: calculatedRatios.efficiency?.workingCapitalDays || null,
        cash_conversion_cycle: calculatedRatios.efficiency?.cashConversionCycle || null,
        
        // Leverage Ratios
        debt_to_equity: calculatedRatios.leverage?.debtToEquity || null,
        debt_to_assets: calculatedRatios.leverage?.debtToAssets || null,
        equity_ratio: calculatedRatios.leverage?.equityRatio || null,
        interest_coverage: calculatedRatios.leverage?.interestCoverage || null,
        
        // Liquidity Ratios
        current_ratio: calculatedRatios.liquidity?.currentRatio || null,
        quick_ratio: calculatedRatios.liquidity?.quickRatio || null,
        
        // Cash Flow Ratios
        operating_cash_flow_margin: calculatedRatios.cashFlow?.operatingCashFlowMargin || null,
        free_cash_flow_yield: calculatedRatios.cashFlow?.freeCashFlowYield || null,
        cash_conversion_efficiency: calculatedRatios.cashFlow?.cashConversionEfficiency || null,
        
        // Quality Scores
        earnings_quality_score: calculatedRatios.quality?.earningsQualityScore || null,
        revenue_volatility: calculatedRatios.quality?.revenueVolatility || null,
        margin_stability: calculatedRatios.quality?.marginStability || null,
        
        // Growth Metrics
        revenue_cagr_3y: calculatedRatios.growth?.revenueCagr3y || null,
        revenue_cagr_5y: calculatedRatios.growth?.revenueCagr5y || null,
        revenue_cagr_10y: calculatedRatios.growth?.revenueCagr10y || null,
        profit_cagr_3y: calculatedRatios.growth?.profitCagr3y || null,
        profit_cagr_5y: calculatedRatios.growth?.profitCagr5y || null,
        profit_cagr_10y: calculatedRatios.growth?.profitCagr10y || null,
        
        // Finance-Specific
        npa_percent: calculatedRatios.financeSpecific?.npaPercent || null,
        loan_book_growth: calculatedRatios.financeSpecific?.loanBookGrowth || null,
        credit_cost_ratio: calculatedRatios.financeSpecific?.creditCostRatio || null,
        
        snapshot_id: snapshotId,
      });

      return true;
    } catch (error) {
      console.error('Failed to calculate and store ratios:', error);
      return false;
    }
  }

  // =============================================
  // DATA VALIDATION
  // =============================================

  private validateScreenerData(screenerData: ScreenerData): { 
    isValid: boolean; 
    errors: string[]; 
    warnings: string[] 
  } {
    const result: { isValid: boolean; errors: string[]; warnings: string[] } = { 
      isValid: true, 
      errors: [], 
      warnings: [] 
    };

    // Check required fields
    if (!screenerData.company?.symbol) {
      result.errors.push('Company symbol is required');
      result.isValid = false;
    }

    if (!screenerData.company?.name) {
      result.errors.push('Company name is required');
      result.isValid = false;
    }

    // Check if we have financial data
    if (!screenerData.annualData || Object.keys(screenerData.annualData).length === 0) {
      result.errors.push('Annual financial data is required');
      result.isValid = false;
    }

    return result;
  }
}

// Singleton factory
let integrationServiceInstance: IntegrationService | null = null;

export const getIntegrationService = (): IntegrationService => {
  if (!integrationServiceInstance) {
    integrationServiceInstance = new IntegrationService();
  }
  return integrationServiceInstance;
};

export const resetIntegrationService = (): void => {
  integrationServiceInstance = null;
}; 