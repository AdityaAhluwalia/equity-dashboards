import { supabase, TABLES, handleSupabaseError, type Database } from '@/lib/supabase'

// Type aliases for easier use
type CompanyRow = Database['public']['Tables']['companies']['Row']
type CompanyInsert = Database['public']['Tables']['companies']['Insert']
type CompanyUpdate = Database['public']['Tables']['companies']['Update']

type FinancialDataRow = Database['public']['Tables']['financial_data']['Row']
type FinancialDataInsert = Database['public']['Tables']['financial_data']['Insert']

type MarketDataRow = Database['public']['Tables']['market_data']['Row']
type MarketDataInsert = Database['public']['Tables']['market_data']['Insert']

// Company operations
export class CompanyService {
  static async getAll(): Promise<CompanyRow[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.COMPANIES)
        .select('*')
        .order('name')

      if (error) throw handleSupabaseError(error)
      return data || []
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch companies')
    }
  }

  static async getById(id: string): Promise<CompanyRow | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.COMPANIES)
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw handleSupabaseError(error)
      return data
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch company')
    }
  }

  static async getBySector(sector: string): Promise<CompanyRow[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.COMPANIES)
        .select('*')
        .eq('sector', sector)
        .order('market_cap', { ascending: false })

      if (error) throw handleSupabaseError(error)
      return data || []
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch companies by sector')
    }
  }

  static async create(company: CompanyInsert): Promise<CompanyRow> {
    try {
      const { data, error } = await supabase
        .from(TABLES.COMPANIES)
        .insert(company)
        .select()
        .single()

      if (error) throw handleSupabaseError(error)
      return data
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to create company')
    }
  }

  static async update(id: string, updates: CompanyUpdate): Promise<CompanyRow> {
    try {
      const { data, error } = await supabase
        .from(TABLES.COMPANIES)
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw handleSupabaseError(error)
      return data
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to update company')
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(TABLES.COMPANIES)
        .delete()
        .eq('id', id)

      if (error) throw handleSupabaseError(error)
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to delete company')
    }
  }
}

// Financial data operations
export class FinancialDataService {
  static async getByCompanyId(companyId: string): Promise<FinancialDataRow[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.FINANCIAL_DATA)
        .select('*')
        .eq('company_id', companyId)
        .order('year', { ascending: false })
        .order('quarter', { ascending: false })

      if (error) throw handleSupabaseError(error)
      return data || []
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch financial data')
    }
  }

  static async getLatest(companyId: string): Promise<FinancialDataRow | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.FINANCIAL_DATA)
        .select('*')
        .eq('company_id', companyId)
        .order('year', { ascending: false })
        .order('quarter', { ascending: false })
        .limit(1)
        .single()

      if (error) throw handleSupabaseError(error)
      return data
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch latest financial data')
    }
  }

  static async create(financialData: FinancialDataInsert): Promise<FinancialDataRow> {
    try {
      const { data, error } = await supabase
        .from(TABLES.FINANCIAL_DATA)
        .insert(financialData)
        .select()
        .single()

      if (error) throw handleSupabaseError(error)
      return data
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to create financial data')
    }
  }

  static async bulkInsert(financialDataArray: FinancialDataInsert[]): Promise<FinancialDataRow[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.FINANCIAL_DATA)
        .insert(financialDataArray)
        .select()

      if (error) throw handleSupabaseError(error)
      return data || []
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to bulk insert financial data')
    }
  }
}

// Market data operations
export class MarketDataService {
  static async getLatestPrice(companyId: string): Promise<MarketDataRow | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.MARKET_DATA)
        .select('*')
        .eq('company_id', companyId)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single()

      if (error) throw handleSupabaseError(error)
      return data
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch latest market data')
    }
  }

  static async getPriceHistory(
    companyId: string, 
    fromDate: string, 
    toDate: string
  ): Promise<MarketDataRow[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.MARKET_DATA)
        .select('*')
        .eq('company_id', companyId)
        .gte('timestamp', fromDate)
        .lte('timestamp', toDate)
        .order('timestamp', { ascending: true })

      if (error) throw handleSupabaseError(error)
      return data || []
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch price history')
    }
  }

  static async insertPrice(marketData: MarketDataInsert): Promise<MarketDataRow> {
    try {
      const { data, error } = await supabase
        .from(TABLES.MARKET_DATA)
        .insert(marketData)
        .select()
        .single()

      if (error) throw handleSupabaseError(error)
      return data
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to insert market data')
    }
  }
}

// Database health check
export class DatabaseService {
  static async healthCheck(): Promise<{
    isHealthy: boolean
    tables: Record<string, boolean>
    timestamp: string
  }> {
    const results = {
      isHealthy: true,
      tables: {} as Record<string, boolean>,
      timestamp: new Date().toISOString(),
    }

    // Test each table
    for (const [key, tableName] of Object.entries(TABLES)) {
      try {
        const { error } = await supabase
          .from(tableName)
          .select('count')
          .limit(1)
        
        results.tables[tableName] = !error
        if (error) results.isHealthy = false
      } catch {
        results.tables[tableName] = false
        results.isHealthy = false
      }
    }

    return results
  }
} 