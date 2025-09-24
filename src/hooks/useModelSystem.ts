import { useGlobalModelStore } from '@/stores/globalModelStore'
import { useNodeModelStore } from '@/stores/nodeModelStore'
import { useModelMetaStore } from '@/stores/modelMetaStore'
import { useModelPreferencesStore } from '@/stores/modelPreferencesStore'
import { ModelService } from '@/services/ModelService'

/**
 * Composite hook that provides a unified interface to the model system
 * This hook combines all model-related stores and services for easy consumption
 */
export const useModelSystem = () => {
  // Global model state
  const globalStore = useGlobalModelStore()

  // Node-specific model state
  const nodeStore = useNodeModelStore()

  // Model metadata and availability
  const metaStore = useModelMetaStore()

  // User preferences
  const preferencesStore = useModelPreferencesStore()

  // Convenience methods that combine global and node logic
  const getEffectiveImageModel = (nodeId?: string): string => {
    if (nodeId) {
      return nodeStore.getNodeSelectedImageModel(nodeId)
    }
    return globalStore.selectedImageModel
  }

  const getEffectiveLanguageModel = (nodeId?: string): string => {
    if (nodeId) {
      return nodeStore.getNodeSelectedLanguageModel(nodeId)
    }
    return globalStore.selectedLanguageModel
  }

  const getEffectiveAspectRatio = (nodeId?: string): string => {
    if (nodeId) {
      return nodeStore.getNodeSelectedAspectRatio(nodeId)
    }
    return globalStore.selectedAspectRatio
  }

  const setImageModel = (modelId: string, nodeId?: string) => {
    // Validate model exists
    if (!ModelService.validateImageModel(modelId)) {
      console.warn(`Invalid image model ID: ${modelId}`)
      return
    }

    if (nodeId) {
      nodeStore.setNodeSelectedImageModel(nodeId, modelId)
    } else {
      globalStore.setSelectedImageModel(modelId)
    }

    // Track in preferences
    preferencesStore.addToRecentModels(modelId, 'image')
  }

  const setLanguageModel = (modelId: string, nodeId?: string) => {
    // Validate model exists
    if (!ModelService.validateLanguageModel(modelId)) {
      console.warn(`Invalid language model ID: ${modelId}`)
      return
    }

    if (nodeId) {
      nodeStore.setNodeSelectedLanguageModel(nodeId, modelId)
    } else {
      globalStore.setSelectedLanguageModel(modelId)
    }

    // Track in preferences
    preferencesStore.addToRecentModels(modelId, 'language')
  }

  const setAspectRatio = (ratio: string, nodeId?: string) => {
    if (nodeId) {
      nodeStore.setNodeSelectedAspectRatio(nodeId, ratio)
    } else {
      globalStore.setSelectedAspectRatio(ratio)
    }
  }

  return {
    // Global state
    global: globalStore,

    // Node state
    node: nodeStore,

    // Meta state
    meta: metaStore,

    // Preferences
    preferences: preferencesStore,

    // Service methods
    service: ModelService,

    // Convenience methods
    getEffectiveImageModel,
    getEffectiveLanguageModel,
    getEffectiveAspectRatio,
    setImageModel,
    setLanguageModel,
    setAspectRatio,
  }
}

// Export individual stores for cases where only specific functionality is needed
export { useGlobalModelStore, useNodeModelStore, useModelMetaStore, useModelPreferencesStore }
