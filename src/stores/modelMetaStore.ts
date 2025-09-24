import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { imageModels, languageModels } from '@/constants/models'

// Model types for better type safety
interface ModelConfig {
  id: string
  name: string
  provider?: 'openai' | 'google' | 'replicate'
  type?: 'language' | 'image'
  available?: boolean
  features?: string[]
  imageInput?: boolean
}

interface ModelMetaState {
  // Model configurations and availability
  availableModels: {
    language: ModelConfig[]
    image: ModelConfig[]
  }

  // Model health/status
  modelStatus: Record<string, 'healthy' | 'degraded' | 'unavailable'>

  // Actions
  updateModelStatus: (modelId: string, status: 'healthy' | 'degraded' | 'unavailable') => void
  updateModelAvailability: (modelId: string, available: boolean) => void

  // Selectors
  getAvailableLanguageModels: () => ModelConfig[]
  getAvailableImageModels: () => ModelConfig[]
  getModelById: (id: string) => ModelConfig | null
  getModelStatus: (id: string) => 'healthy' | 'degraded' | 'unavailable'
}

// Use models from constants file
const defaultLanguageModels: ModelConfig[] = languageModels.map((model) => ({
  ...model,
  type: 'language' as const,
  available: true,
}))

const defaultImageModels: ModelConfig[] = imageModels.map((model) => ({
  ...model,
  type: 'image' as const,
  available: true,
}))

export const useModelMetaStore = create<ModelMetaState>()(
  devtools(
    (set, get) => ({
      // Initial state
      availableModels: {
        language: defaultLanguageModels,
        image: defaultImageModels,
      },

      modelStatus: {},

      // Actions
      updateModelStatus: (modelId, status) =>
        set(
          (state) => ({
            modelStatus: { ...state.modelStatus, [modelId]: status },
          }),
          false,
          'updateModelStatus'
        ),

      updateModelAvailability: (modelId, available) =>
        set(
          (state) => ({
            availableModels: {
              ...state.availableModels,
              language: state.availableModels.language.map((model) =>
                model.id === modelId ? { ...model, available } : model
              ),
              image: state.availableModels.image.map((model) =>
                model.id === modelId ? { ...model, available } : model
              ),
            },
          }),
          false,
          'updateModelAvailability'
        ),

      // Selectors
      getAvailableLanguageModels: () =>
        get().availableModels.language.filter((model) => model.available),

      getAvailableImageModels: () => get().availableModels.image.filter((model) => model.available),

      getModelById: (id) => {
        const { availableModels } = get()
        return (
          [...availableModels.language, ...availableModels.image].find((m) => m.id === id) || null
        )
      },

      getModelStatus: (id) => get().modelStatus[id] || 'healthy',
    }),
    { name: 'model-meta-store' }
  )
)

// Export types for use in other files
export type { ModelConfig }
