import { useModelMetaStore, type ModelConfig } from '@/stores/modelMetaStore'
import { AspectRatioService } from '@/lib/aspectRatioService'

export class ModelService {
  /**
   * Validates if a model exists in the available models
   */
  static validateLanguageModel(modelId: string): boolean {
    const store = useModelMetaStore.getState()
    return store.availableModels.language.some((m) => m.id === modelId)
  }

  static validateImageModel(modelId: string): boolean {
    const store = useModelMetaStore.getState()
    return store.availableModels.image.some((m) => m.id === modelId)
  }

  /**
   * Gets model by ID with type safety
   */
  static getModelById(id: string): ModelConfig | null {
    const store = useModelMetaStore.getState()
    return store.getModelById(id)
  }

  /**
   * Gets available models by type
   */
  static getAvailableLanguageModels(): ModelConfig[] {
    const store = useModelMetaStore.getState()
    return store.getAvailableLanguageModels()
  }

  static getAvailableImageModels(): ModelConfig[] {
    const store = useModelMetaStore.getState()
    return store.getAvailableImageModels()
  }

  /**
   * Gets healthy models (available and not degraded)
   */
  static getHealthyLanguageModels(): ModelConfig[] {
    const store = useModelMetaStore.getState()
    return store.availableModels.language.filter(
      (model) => model.available && (store.modelStatus[model.id] || 'healthy') === 'healthy'
    )
  }

  static getHealthyImageModels(): ModelConfig[] {
    const store = useModelMetaStore.getState()
    return store.availableModels.image.filter(
      (model) => model.available && (store.modelStatus[model.id] || 'healthy') === 'healthy'
    )
  }

  /**
   * Gets model display name
   */
  static getModelName(modelId: string): string {
    const model = this.getModelById(modelId)
    return model?.name || ''
  }

  /**
   * Aspect ratio utilities
   */
  static getAvailableRatiosForModel(modelId: string): string[] {
    const model = this.getModelById(modelId)
    if (!model) return []
    return AspectRatioService.getAvailableRatios(model.id)
  }

  static getDefaultRatioForModel(modelId: string): string {
    const model = this.getModelById(modelId)
    if (!model) return '16:9'
    return AspectRatioService.getDefaultRatio(model.id)
  }

  /**
   * Gets model health status
   */
  static getModelStatus(modelId: string): 'healthy' | 'degraded' | 'unavailable' {
    const store = useModelMetaStore.getState()
    return store.getModelStatus(modelId)
  }
}