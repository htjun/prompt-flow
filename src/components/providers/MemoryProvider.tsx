'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { memoryManager, getMemoryStats } from '@/lib/memoryManager'
import { useMemoryCleanup, useRouteCleanup } from '@/hooks/useCleanup'

interface MemoryContextValue {
  forceCleanup: () => void
  getStats: () => ReturnType<typeof getMemoryStats>
  resetAll: () => void
}

const MemoryContext = createContext<MemoryContextValue | null>(null)

interface MemoryProviderProps {
  children: ReactNode
}

export function MemoryProvider({ children }: MemoryProviderProps) {
  // Initialize memory management hooks
  useMemoryCleanup()
  useRouteCleanup()

  useEffect(() => {
    // Start automatic memory management
    memoryManager.startAutoCleanup()

    // Set up memory usage monitoring
    const monitoringInterval = setInterval(() => {
      memoryManager.checkMemoryUsage()
    }, 30000) // Check every 30 seconds

    // Setup performance observer for memory pressure detection
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          for (const entry of entries) {
            if (entry.name === 'memory-pressure') {
              console.warn('Memory pressure detected, forcing cleanup')
              memoryManager.enableAggressiveMode()
              memoryManager.forceCleanup()
            }
          }
        })
        observer.observe({ entryTypes: ['measure'] })

        return () => {
          observer.disconnect()
          clearInterval(monitoringInterval)
          memoryManager.stopAutoCleanup()
        }
      } catch (error) {
        console.warn('Performance observer not supported:', error)
      }
    }

    return () => {
      clearInterval(monitoringInterval)
      memoryManager.stopAutoCleanup()
    }
  }, [])

  const contextValue: MemoryContextValue = {
    forceCleanup: () => memoryManager.forceCleanup(),
    getStats: () => getMemoryStats(),
    resetAll: () => memoryManager.resetAllStores(),
  }

  return <MemoryContext.Provider value={contextValue}>{children}</MemoryContext.Provider>
}

export function useMemoryContext() {
  const context = useContext(MemoryContext)
  if (!context) {
    throw new Error('useMemoryContext must be used within a MemoryProvider')
  }
  return context
}

// Development helper component
export function MemoryStats() {
  const { getStats } = useMemoryContext()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const stats = getStats()

  return (
    <div className="fixed right-4 bottom-4 z-50 rounded bg-gray-800 p-2 text-xs text-white shadow-lg">
      <div>Nodes: {stats.nodes}</div>
      <div>Images: {stats.images}</div>
      <div>Prompts: {stats.basicPrompts + stats.atomizedPrompts}</div>
    </div>
  )
}
