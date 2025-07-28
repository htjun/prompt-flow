import { useFlowStore } from '@/stores/flowStore'
import { useImageStore } from '@/stores/imageStore'
import { usePromptStore } from '@/stores/promptStore'
import { useGlobalModelStore } from '@/stores/globalModelStore'

// Configuration for memory management
export const MEMORY_CONFIG = {
  // Age limits (in milliseconds)
  MAX_NODE_AGE: 24 * 60 * 60 * 1000, // 24 hours
  MAX_IMAGE_AGE: 12 * 60 * 60 * 1000, // 12 hours
  MAX_PROMPT_AGE: 24 * 60 * 60 * 1000, // 24 hours
  
  // Count limits
  MAX_NODES: 100,
  MAX_IMAGES: 50,
  MAX_PROMPTS: 100,
  
  // Cleanup intervals
  CLEANUP_INTERVAL: 5 * 60 * 1000, // 5 minutes
  AGGRESSIVE_CLEANUP_INTERVAL: 60 * 1000, // 1 minute when memory usage is high
}

export class MemoryManager {
  private static instance: MemoryManager
  private cleanupInterval: NodeJS.Timeout | null = null
  private isAggressiveMode = false

  private constructor() {}

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager()
    }
    return MemoryManager.instance
  }

  startAutoCleanup() {
    if (this.cleanupInterval) return

    const interval = this.isAggressiveMode 
      ? MEMORY_CONFIG.AGGRESSIVE_CLEANUP_INTERVAL 
      : MEMORY_CONFIG.CLEANUP_INTERVAL

    this.cleanupInterval = setInterval(() => {
      this.performCleanup()
    }, interval)

    // Initial cleanup
    this.performCleanup()
  }

  stopAutoCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }

  enableAggressiveMode() {
    this.isAggressiveMode = true
    this.stopAutoCleanup()
    this.startAutoCleanup()
  }

  disableAggressiveMode() {
    this.isAggressiveMode = false
    this.stopAutoCleanup()
    this.startAutoCleanup()
  }

  performCleanup() {
    try {
      const flowStore = useFlowStore.getState()
      const imageStore = useImageStore.getState()
      const promptStore = usePromptStore.getState()

      // Age-based cleanup
      flowStore.pruneOldNodes(MEMORY_CONFIG.MAX_NODE_AGE)
      imageStore.pruneOldImages(MEMORY_CONFIG.MAX_IMAGE_AGE)
      promptStore.pruneOldPrompts(MEMORY_CONFIG.MAX_PROMPT_AGE)

      // Count-based cleanup
      flowStore.limitNodeCount(MEMORY_CONFIG.MAX_NODES)
      imageStore.limitImageCount(MEMORY_CONFIG.MAX_IMAGES)
      promptStore.limitPromptCount(MEMORY_CONFIG.MAX_PROMPTS)

      console.log('Memory cleanup completed', {
        timestamp: new Date().toISOString(),
        aggressiveMode: this.isAggressiveMode
      })
    } catch (error) {
      console.error('Memory cleanup failed:', error)
    }
  }

  getMemoryStats() {
    const flowStore = useFlowStore.getState()
    const imageStore = useImageStore.getState()
    const promptStore = usePromptStore.getState()

    return {
      nodes: flowStore.nodes.length,
      edges: flowStore.edges.length,
      images: Object.keys(imageStore.images).length,
      imageOperations: Object.keys(imageStore.operations).length,
      basicPrompts: Object.keys(promptStore.entities.basic).length,
      atomizedPrompts: Object.keys(promptStore.entities.atomized).length,
      promptOperations: Object.keys(promptStore.operations).length,
      timestamp: Date.now()
    }
  }

  forceCleanup() {
    this.performCleanup()
  }

  resetAllStores() {
    const flowStore = useFlowStore.getState()
    const imageStore = useImageStore.getState()
    const promptStore = usePromptStore.getState()
    const modelStore = useGlobalModelStore.getState()

    flowStore.cleanup()
    imageStore.cleanup()
    promptStore.cleanup()
    modelStore.reset()

    console.log('All stores reset')
  }

  // Check if memory usage is high and enable aggressive cleanup
  checkMemoryUsage() {
    const stats = this.getMemoryStats()
    const totalItems = stats.nodes + stats.images + stats.basicPrompts + stats.atomizedPrompts

    if (totalItems > (MEMORY_CONFIG.MAX_NODES + MEMORY_CONFIG.MAX_IMAGES + MEMORY_CONFIG.MAX_PROMPTS) * 0.8) {
      if (!this.isAggressiveMode) {
        console.warn('High memory usage detected, enabling aggressive cleanup')
        this.enableAggressiveMode()
      }
    } else if (this.isAggressiveMode && totalItems < (MEMORY_CONFIG.MAX_NODES + MEMORY_CONFIG.MAX_IMAGES + MEMORY_CONFIG.MAX_PROMPTS) * 0.5) {
      console.log('Memory usage normalized, disabling aggressive cleanup')
      this.disableAggressiveMode()
    }
  }
}

// Export singleton instance
export const memoryManager = MemoryManager.getInstance()

// Utility functions for component usage
export const startMemoryManagement = () => memoryManager.startAutoCleanup()
export const stopMemoryManagement = () => memoryManager.stopAutoCleanup()
export const forceCleanup = () => memoryManager.forceCleanup()
export const getMemoryStats = () => memoryManager.getMemoryStats()
export const resetAll = () => memoryManager.resetAllStores()