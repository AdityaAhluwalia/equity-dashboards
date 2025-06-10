import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'

interface AppState {
  // Loading state
  isLoading: boolean
  setLoading: (loading: boolean) => void

  // Error state
  error: string | null
  setError: (error: string) => void
  clearError: () => void

  // Theme state
  theme: Theme
  setTheme: (theme: Theme) => void

  // UI state
  sidebarOpen: boolean
  toggleSidebar: () => void

  // Reset function
  reset: () => void
}

const initialState = {
  isLoading: false,
  error: null,
  theme: 'system' as Theme,
  sidebarOpen: true,
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Loading actions
        setLoading: (loading: boolean) => set({ isLoading: loading }, false, 'setLoading'),

        // Error actions
        setError: (error: string) => set({ error }, false, 'setError'),
        clearError: () => set({ error: null }, false, 'clearError'),

        // Theme actions
        setTheme: (theme: Theme) => set({ theme }, false, 'setTheme'),

        // UI actions
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'toggleSidebar'),

        // Reset action
        reset: () => set(initialState, false, 'reset'),
      }),
      {
        name: 'equity-dashboard-app-store',
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    {
      name: 'AppStore',
    }
  )
) 