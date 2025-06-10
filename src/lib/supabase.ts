import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'equity-dashboard-v1',
    },
  },
})

// Database table names
export const TABLES = {
  COMPANIES: 'companies',
  FINANCIAL_DATA: 'financial_data',
  MARKET_DATA: 'market_data',
  USER_PREFERENCES: 'user_preferences',
  CALCULATIONS: 'calculations',
} as const

// Type for database tables
export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          symbol: string
          sector: string
          market_cap: number
          current_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          symbol: string
          sector: string
          market_cap: number
          current_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          symbol?: string
          sector?: string
          market_cap?: number
          current_price?: number
          updated_at?: string
        }
      }
      financial_data: {
        Row: {
          id: string
          company_id: string
          quarter: string
          year: number
          revenue: number
          net_income: number
          total_assets: number
          total_liabilities: number
          cash_flow: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          quarter: string
          year: number
          revenue: number
          net_income: number
          total_assets: number
          total_liabilities: number
          cash_flow: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          quarter?: string
          year?: number
          revenue?: number
          net_income?: number
          total_assets?: number
          total_liabilities?: number
          cash_flow?: number
          updated_at?: string
        }
      }
      market_data: {
        Row: {
          id: string
          company_id: string
          price: number
          volume: number
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          price: number
          volume: number
          timestamp: string
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          price?: number
          volume?: number
          timestamp?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          theme: string
          sidebar_open: boolean
          favorite_companies: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme: string
          sidebar_open: boolean
          favorite_companies: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: string
          sidebar_open?: boolean
          favorite_companies?: string[]
          updated_at?: string
        }
      }
      calculations: {
        Row: {
          id: string
          company_id: string
          quarter: string
          year: number
          roe: number
          roa: number
          current_ratio: number
          debt_to_equity: number
          operating_cycle: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          quarter: string
          year: number
          roe: number
          roa: number
          current_ratio: number
          debt_to_equity: number
          operating_cycle: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          quarter?: string
          year?: number
          roe?: number
          roa?: number
          current_ratio?: number
          debt_to_equity?: number
          operating_cycle?: number
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any): Error {
  if (error?.message) {
    return new Error(`Database error: ${error.message}`)
  }
  return new Error('Unknown database error occurred')
}

// Connection test function
export async function testConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Supabase connection test failed:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Supabase connection test failed:', error)
    return false
  }
} 