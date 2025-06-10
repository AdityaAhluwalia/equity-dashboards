// Export all stores
export { useAppStore, type Theme } from './app-store'
export { 
  useCompanyStore, 
  type Company, 
  type FinancialData, 
  type CompanyFilters 
} from './company-store'

// Import stores for utilities
import { useAppStore } from './app-store'
import { useCompanyStore } from './company-store'

// Store utilities
export const resetAllStores = () => {
  useAppStore.getState().reset()
  useCompanyStore.getState().reset()
} 