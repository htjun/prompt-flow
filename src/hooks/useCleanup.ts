import { useEffect, useRef } from 'react'
import { useFlowStore } from '@/stores/flowStore'
import { useImageStore } from '@/stores/imageStore'
import { usePromptStore } from '@/stores/promptStore'
import { useGlobalModelStore } from '@/stores/globalModelStore'

// Configuration constants
const CLEANUP_CONFIG = {
  MAX_NODE_AGE: 24 * 60 * 60 * 1000, // 24 hours
  MAX_IMAGE_AGE: 12 * 60 * 60 * 1000, // 12 hours
  MAX_PROMPT_AGE: 24 * 60 * 60 * 1000, // 24 hours
  MAX_NODES: 100,
  MAX_IMAGES: 50,
  MAX_PROMPTS: 100,
  CLEANUP_INTERVAL: 5 * 60 * 1000, // 5 minutes
}

export function useMemoryCleanup() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const runCleanup = () => {
    const flowStore = useFlowStore.getState()
    const imageStore = useImageStore.getState()
    const promptStore = usePromptStore.getState()

    // Prune old data
    flowStore.pruneOldNodes(CLEANUP_CONFIG.MAX_NODE_AGE)
    imageStore.pruneOldImages(CLEANUP_CONFIG.MAX_IMAGE_AGE)
    promptStore.pruneOldPrompts(CLEANUP_CONFIG.MAX_PROMPT_AGE)

    // Limit counts
    flowStore.limitNodeCount(CLEANUP_CONFIG.MAX_NODES)
    imageStore.limitImageCount(CLEANUP_CONFIG.MAX_IMAGES)
    promptStore.limitPromptCount(CLEANUP_CONFIG.MAX_PROMPTS)
  }

  useEffect(() => {
    // Run initial cleanup
    runCleanup()

    // Set up periodic cleanup
    intervalRef.current = setInterval(runCleanup, CLEANUP_CONFIG.CLEANUP_INTERVAL)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return { runCleanup }
}

export function useComponentCleanup(nodeId?: string) {
  useEffect(() => {
    return () => {
      if (nodeId) {
        const imageStore = useImageStore.getState()
        const promptStore = usePromptStore.getState()

        // Clean up associated data when component unmounts
        imageStore.removeImage(nodeId)
        promptStore.clearPrompt(nodeId)
      }
    }
  }, [nodeId])
}

export function useGlobalCleanup() {
  const cleanupAll = () => {
    const flowStore = useFlowStore.getState()
    const imageStore = useImageStore.getState()
    const promptStore = usePromptStore.getState()
    const modelStore = useGlobalModelStore.getState()

    flowStore.cleanup()
    imageStore.cleanup()
    promptStore.cleanup()
    modelStore.reset()
  }

  return { cleanupAll }
}

// Hook for cleanup on route changes or app exit
export function useRouteCleanup() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Cleanup on page unload - directly call store methods
      const flowStore = useFlowStore.getState()
      const imageStore = useImageStore.getState()
      const promptStore = usePromptStore.getState()

      flowStore.pruneOldNodes(CLEANUP_CONFIG.MAX_NODE_AGE)
      imageStore.pruneOldImages(CLEANUP_CONFIG.MAX_IMAGE_AGE)
      promptStore.pruneOldPrompts(CLEANUP_CONFIG.MAX_PROMPT_AGE)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])
}
