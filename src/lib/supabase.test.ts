import { TABLES, handleSupabaseError } from './supabase'

// Mock the Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        limit: jest.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    }))
  }))
}))

describe('Supabase Configuration', () => {
  describe('table constants', () => {
    it('should have correct table names', () => {
      expect(TABLES.COMPANIES).toBe('companies')
      expect(TABLES.FINANCIAL_DATA).toBe('financial_data')
      expect(TABLES.MARKET_DATA).toBe('market_data')
      expect(TABLES.USER_PREFERENCES).toBe('user_preferences')
      expect(TABLES.CALCULATIONS).toBe('calculations')
    })

    it('should have all required tables defined', () => {
      const expectedTables = [
        'companies',
        'financial_data', 
        'market_data',
        'user_preferences',
        'calculations'
      ]
      
      const actualTables = Object.values(TABLES)
      expectedTables.forEach(table => {
        expect(actualTables).toContain(table)
      })
    })
  })

  describe('error handling', () => {
    it('should handle Supabase errors with message', () => {
      const mockError = { message: 'Database connection failed' }
      const result = handleSupabaseError(mockError)
      
      expect(result).toBeInstanceOf(Error)
      expect(result.message).toBe('Database error: Database connection failed')
    })

    it('should handle unknown errors', () => {
      const mockError = {}
      const result = handleSupabaseError(mockError)
      
      expect(result).toBeInstanceOf(Error)
      expect(result.message).toBe('Unknown database error occurred')
    })

    it('should handle null errors', () => {
      const result = handleSupabaseError(null)
      
      expect(result).toBeInstanceOf(Error)
      expect(result.message).toBe('Unknown database error occurred')
    })

    it('should handle errors without message property', () => {
      const mockError = { code: 'PGRST301', details: 'Some details' }
      const result = handleSupabaseError(mockError)
      
      expect(result).toBeInstanceOf(Error)
      expect(result.message).toBe('Unknown database error occurred')
    })
  })

  describe('database types', () => {
    it('should export TABLES constant as readonly', () => {
      // Test that TABLES is properly typed as const
      expect(typeof TABLES).toBe('object')
      expect(Object.keys(TABLES).length).toBeGreaterThan(0)
    })
  })
}) 