import { renderHook, act } from '@testing-library/react'
import { useCompanyStore } from './company-store'

// Mock company data for testing
const mockCompany = {
  id: 'RELIANCE',
  name: 'Reliance Industries Limited',
  sector: 'Oil & Gas',
  marketCap: 1500000,
  currentPrice: 2500,
  lastUpdated: new Date().toISOString(),
}

const mockFinancialData = {
  companyId: 'RELIANCE',
  quarter: 'Q1FY24',
  revenue: 200000,
  netIncome: 15000,
  totalAssets: 800000,
  totalLiabilities: 400000,
  cashFlow: 25000,
}

describe('CompanyStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useCompanyStore.getState().reset()
  })

  describe('companies state', () => {
    it('should initialize with empty companies array', () => {
      const { result } = renderHook(() => useCompanyStore())
      expect(result.current.companies).toEqual([])
    })

    it('should set companies', () => {
      const { result } = renderHook(() => useCompanyStore())
      const companies = [mockCompany]
      
      act(() => {
        result.current.setCompanies(companies)
      })
      
      expect(result.current.companies).toEqual(companies)
    })

    it('should add a company', () => {
      const { result } = renderHook(() => useCompanyStore())
      
      act(() => {
        result.current.addCompany(mockCompany)
      })
      
      expect(result.current.companies).toContain(mockCompany)
    })

    it('should update a company', () => {
      const { result } = renderHook(() => useCompanyStore())
      
      act(() => {
        result.current.addCompany(mockCompany)
        result.current.updateCompany('RELIANCE', { currentPrice: 2600 })
      })
      
      const updatedCompany = result.current.companies.find(c => c.id === 'RELIANCE')
      expect(updatedCompany?.currentPrice).toBe(2600)
    })

    it('should remove a company', () => {
      const { result } = renderHook(() => useCompanyStore())
      
      act(() => {
        result.current.addCompany(mockCompany)
        result.current.removeCompany('RELIANCE')
      })
      
      expect(result.current.companies).not.toContain(mockCompany)
    })
  })

  describe('selected company', () => {
    it('should initialize with no selected company', () => {
      const { result } = renderHook(() => useCompanyStore())
      expect(result.current.selectedCompany).toBeNull()
    })

    it('should set selected company', () => {
      const { result } = renderHook(() => useCompanyStore())
      
      act(() => {
        result.current.setSelectedCompany(mockCompany)
      })
      
      expect(result.current.selectedCompany).toEqual(mockCompany)
    })

    it('should clear selected company', () => {
      const { result } = renderHook(() => useCompanyStore())
      
      act(() => {
        result.current.setSelectedCompany(mockCompany)
        result.current.clearSelectedCompany()
      })
      
      expect(result.current.selectedCompany).toBeNull()
    })
  })

  describe('financial data', () => {
    it('should initialize with empty financial data', () => {
      const { result } = renderHook(() => useCompanyStore())
      expect(result.current.financialData).toEqual({})
    })

    it('should set financial data for a company', () => {
      const { result } = renderHook(() => useCompanyStore())
      
      act(() => {
        result.current.setFinancialData('RELIANCE', [mockFinancialData])
      })
      
      expect(result.current.financialData['RELIANCE']).toEqual([mockFinancialData])
    })

    it('should get financial data for a company', () => {
      const { result } = renderHook(() => useCompanyStore())
      
      act(() => {
        result.current.setFinancialData('RELIANCE', [mockFinancialData])
      })
      
      const data = result.current.getFinancialData('RELIANCE')
      expect(data).toEqual([mockFinancialData])
    })

    it('should return empty array for company with no financial data', () => {
      const { result } = renderHook(() => useCompanyStore())
      
      const data = result.current.getFinancialData('NONEXISTENT')
      expect(data).toEqual([])
    })
  })

  describe('filters', () => {
    it('should initialize with default filters', () => {
      const { result } = renderHook(() => useCompanyStore())
      expect(result.current.filters.sector).toBe('')
      expect(result.current.filters.marketCapMin).toBe(0)
      expect(result.current.filters.marketCapMax).toBe(Infinity)
    })

    it('should set filters', () => {
      const { result } = renderHook(() => useCompanyStore())
      const newFilters = {
        sector: 'Technology',
        marketCapMin: 1000,
        marketCapMax: 50000,
      }
      
      act(() => {
        result.current.setFilters(newFilters)
      })
      
      expect(result.current.filters).toEqual(newFilters)
    })

    it('should clear filters', () => {
      const { result } = renderHook(() => useCompanyStore())
      
      act(() => {
        result.current.setFilters({ sector: 'Technology', marketCapMin: 1000, marketCapMax: 50000 })
        result.current.clearFilters()
      })
      
      expect(result.current.filters.sector).toBe('')
      expect(result.current.filters.marketCapMin).toBe(0)
      expect(result.current.filters.marketCapMax).toBe(Infinity)
    })
  })

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() => useCompanyStore())
      
      act(() => {
        result.current.setCompanies([mockCompany])
        result.current.setSelectedCompany(mockCompany)
        result.current.setFinancialData('RELIANCE', [mockFinancialData])
        result.current.setFilters({ sector: 'Technology', marketCapMin: 1000, marketCapMax: 50000 })
      })
      
      act(() => {
        result.current.reset()
      })
      
      expect(result.current.companies).toEqual([])
      expect(result.current.selectedCompany).toBeNull()
      expect(result.current.financialData).toEqual({})
      expect(result.current.filters.sector).toBe('')
    })
  })
}) 