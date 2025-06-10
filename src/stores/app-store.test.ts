import { renderHook, act } from '@testing-library/react'
import { useAppStore } from './app-store'

describe('AppStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAppStore.getState().reset()
  })

  describe('loading state', () => {
    it('should initialize with loading false', () => {
      const { result } = renderHook(() => useAppStore())
      expect(result.current.isLoading).toBe(false)
    })

    it('should set loading state', () => {
      const { result } = renderHook(() => useAppStore())
      
      act(() => {
        result.current.setLoading(true)
      })
      
      expect(result.current.isLoading).toBe(true)
    })
  })

  describe('error state', () => {
    it('should initialize with no error', () => {
      const { result } = renderHook(() => useAppStore())
      expect(result.current.error).toBeNull()
    })

    it('should set error message', () => {
      const { result } = renderHook(() => useAppStore())
      const errorMessage = 'Something went wrong'
      
      act(() => {
        result.current.setError(errorMessage)
      })
      
      expect(result.current.error).toBe(errorMessage)
    })

    it('should clear error', () => {
      const { result } = renderHook(() => useAppStore())
      
      act(() => {
        result.current.setError('Error')
        result.current.clearError()
      })
      
      expect(result.current.error).toBeNull()
    })
  })

  describe('theme state', () => {
    it('should initialize with system theme', () => {
      const { result } = renderHook(() => useAppStore())
      expect(result.current.theme).toBe('system')
    })

    it('should set theme', () => {
      const { result } = renderHook(() => useAppStore())
      
      act(() => {
        result.current.setTheme('dark')
      })
      
      expect(result.current.theme).toBe('dark')
    })
  })

  describe('sidebar state', () => {
    it('should initialize with sidebar open on desktop', () => {
      const { result } = renderHook(() => useAppStore())
      expect(result.current.sidebarOpen).toBe(true)
    })

    it('should toggle sidebar', () => {
      const { result } = renderHook(() => useAppStore())
      
      act(() => {
        result.current.toggleSidebar()
      })
      
      expect(result.current.sidebarOpen).toBe(false)
      
      act(() => {
        result.current.toggleSidebar()
      })
      
      expect(result.current.sidebarOpen).toBe(true)
    })
  })

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() => useAppStore())
      
      act(() => {
        result.current.setLoading(true)
        result.current.setError('Error')
        result.current.setTheme('dark')
        result.current.toggleSidebar()
      })
      
      act(() => {
        result.current.reset()
      })
      
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.theme).toBe('system')
      expect(result.current.sidebarOpen).toBe(true)
    })
  })
}) 