import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface Company {
  id: string
  name: string
  sector: string
  marketCap: number
  currentPrice: number
  lastUpdated: string
}

export interface FinancialData {
  companyId: string
  quarter: string
  revenue: number
  netIncome: number
  totalAssets: number
  totalLiabilities: number
  cashFlow: number
}

export interface CompanyFilters {
  sector: string
  marketCapMin: number
  marketCapMax: number
}

interface CompanyState {
  // Companies data
  companies: Company[]
  setCompanies: (companies: Company[]) => void
  addCompany: (company: Company) => void
  updateCompany: (id: string, updates: Partial<Company>) => void
  removeCompany: (id: string) => void

  // Selected company
  selectedCompany: Company | null
  setSelectedCompany: (company: Company) => void
  clearSelectedCompany: () => void

  // Financial data
  financialData: Record<string, FinancialData[]>
  setFinancialData: (companyId: string, data: FinancialData[]) => void
  getFinancialData: (companyId: string) => FinancialData[]

  // Filters
  filters: CompanyFilters
  setFilters: (filters: CompanyFilters) => void
  clearFilters: () => void

  // Reset function
  reset: () => void
}

const initialState = {
  companies: [],
  selectedCompany: null,
  financialData: {},
  filters: {
    sector: '',
    marketCapMin: 0,
    marketCapMax: Infinity,
  },
}

export const useCompanyStore = create<CompanyState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Companies actions
      setCompanies: (companies: Company[]) => set({ companies }, false, 'setCompanies'),
      
      addCompany: (company: Company) => 
        set((state) => ({ companies: [...state.companies, company] }), false, 'addCompany'),
      
      updateCompany: (id: string, updates: Partial<Company>) =>
        set((state) => ({
          companies: state.companies.map((company) =>
            company.id === id ? { ...company, ...updates } : company
          ),
        }), false, 'updateCompany'),
      
      removeCompany: (id: string) =>
        set((state) => ({
          companies: state.companies.filter((company) => company.id !== id),
        }), false, 'removeCompany'),

      // Selected company actions
      setSelectedCompany: (company: Company) => set({ selectedCompany: company }, false, 'setSelectedCompany'),
      clearSelectedCompany: () => set({ selectedCompany: null }, false, 'clearSelectedCompany'),

      // Financial data actions
      setFinancialData: (companyId: string, data: FinancialData[]) =>
        set((state) => ({
          financialData: { ...state.financialData, [companyId]: data },
        }), false, 'setFinancialData'),
      
      getFinancialData: (companyId: string) => {
        const state = get()
        return state.financialData[companyId] || []
      },

      // Filter actions
      setFilters: (filters: CompanyFilters) => set({ filters }, false, 'setFilters'),
      clearFilters: () => set({ filters: initialState.filters }, false, 'clearFilters'),

      // Reset action
      reset: () => set(initialState, false, 'reset'),
    }),
    {
      name: 'CompanyStore',
    }
  )
) 