import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { imageModels, languageModels } from '@/constants/models'
import { AspectRatioService } from '@/lib/aspectRatioService'

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

interface ModelState {
  // Model selection
  selectedLanguageModel: string
  selectedImageModel: string
  selectedAspectRatio: string

  // Model configurations and availability
  availableModels: {
    language: ModelConfig[]
    image: ModelConfig[]
  }

  // Model health/status
  modelStatus: Record<string, 'healthy' | 'degraded' | 'unavailable'>

  // User preferences
  preferences: {
    autoSelectBestModel: boolean
    preferredProvider: 'openai' | 'google' | 'replicate' | 'auto'
    lastUsedModels: {
      language: string[]
      image: string[]
    }
  }

  // Actions
  setSelectedLanguageModel: (modelId: string) => void
  setSelectedImageModel: (modelId: string) => void
  setSelectedAspectRatio: (ratio: string) => void
  updateModelStatus: (modelId: string, status: 'healthy' | 'degraded' | 'unavailable') => void
  updateModelAvailability: (modelId: string, available: boolean) => void
  setPreference: <K extends keyof ModelState['preferences']>(
    key: K,
    value: ModelState['preferences'][K]
  ) => void

  // Selectors
  getSelectedLanguageModel: () => ModelConfig | null
  getSelectedImageModel: () => ModelConfig | null
  getAvailableLanguageModels: () => ModelConfig[]
  getAvailableImageModels: () => ModelConfig[]
  getModelById: (id: string) => ModelConfig | null
  getModelStatus: (id: string) => 'healthy' | 'degraded' | 'unavailable'

  // Utilities
  addToRecentModels: (modelId: string, type: 'language' | 'image') => void
  getRecentModels: (type: 'language' | 'image') => string[]

  // Aspect ratio helpers
  getAvailableRatiosForModel: (modelId: string) => string[]
  getDefaultRatioForModel: (modelId: string) => string
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

export const useModelStore = create<ModelState>()(
  devtools(
    (set, get) => ({
      // Initial state
      selectedLanguageModel: 'gpt-4.1-mini',
      selectedImageModel: 'google/imagen-4-fast',
      selectedAspectRatio: AspectRatioService.getDefaultRatio('google/imagen-4-fast'),

      availableModels: {
        language: defaultLanguageModels,
        image: defaultImageModels,
      },

      modelStatus: {},

      preferences: {
        autoSelectBestModel: false,
        preferredProvider: 'auto',
        lastUsedModels: {
          language: [],
          image: [],
        },
      },

      // Model selection actions
      setSelectedLanguageModel: (modelId) => {
        // Check if the model exists in the language models
        const modelExists = get().availableModels.language.some((m) => m.id === modelId)
        if (modelExists) {
          set((state) => ({ selectedLanguageModel: modelId }), false, 'setSelectedLanguageModel')
          get().addToRecentModels(modelId, 'language')
        }
      },

      setSelectedImageModel: (modelId) => {
        // Check if the model exists in the image models
        const modelExists = get().availableModels.image.some((m) => m.id === modelId)
        if (modelExists) {
          set((state) => ({ selectedImageModel: modelId }), false, 'setSelectedImageModel')
          get().addToRecentModels(modelId, 'image')
        }
      },

      setSelectedAspectRatio: (ratio) =>
        set(
          (state) => ({
            selectedAspectRatio: ratio,
          }),
          false,
          'setSelectedAspectRatio'
        ),

      // Model status management
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

      // Preferences
      setPreference: (key, value) =>
        set(
          (state) => ({
            preferences: { ...state.preferences, [key]: value },
          }),
          false,
          'setPreference'
        ),

      // Selectors
      getSelectedLanguageModel: () => {
        const { selectedLanguageModel, availableModels } = get()
        return availableModels.language.find((m) => m.id === selectedLanguageModel) || null
      },

      getSelectedImageModel: () => {
        const { selectedImageModel, availableModels } = get()
        return availableModels.image.find((m) => m.id === selectedImageModel) || null
      },

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

      // Utilities
      addToRecentModels: (modelId, type) =>
        set(
          (state) => {
            const currentRecent = state.preferences.lastUsedModels[type]
            const newRecent = [modelId, ...currentRecent.filter((id) => id !== modelId)].slice(0, 5)

            return {
              preferences: {
                ...state.preferences,
                lastUsedModels: {
                  ...state.preferences.lastUsedModels,
                  [type]: newRecent,
                },
              },
            }
          },
          false,
          'addToRecentModels'
        ),

      getRecentModels: (type) => get().preferences.lastUsedModels[type],

      // Aspect ratio helpers
      getAvailableRatiosForModel: (modelId) => {
        const model = get().getModelById(modelId)
        if (!model) return []
        return AspectRatioService.getAvailableRatios(model.id)
      },
      getDefaultRatioForModel: (modelId) => {
        const model = get().getModelById(modelId)
        if (!model) return '16:9'
        return AspectRatioService.getDefaultRatio(model.id)
      },
    }),
    { name: 'model-store' }
  )
)

// Reusable selectors
export const selectSelectedLanguageModelId = (state: ModelState) => state.selectedLanguageModel
export const selectSelectedImageModelId = (state: ModelState) => state.selectedImageModel

export const selectSelectedLanguageModel = (state: ModelState) =>
  state.availableModels.language.find((m) => m.id === state.selectedLanguageModel) || null

export const selectSelectedImageModel = (state: ModelState) =>
  state.availableModels.image.find((m) => m.id === state.selectedImageModel) || null

export const selectAvailableLanguageModels = (state: ModelState) =>
  state.availableModels.language.filter((model) => model.available)

export const selectAvailableImageModels = (state: ModelState) =>
  state.availableModels.image.filter((model) => model.available)

export const selectModelStatus = (modelId: string) => (state: ModelState) =>
  state.modelStatus[modelId] || 'healthy'

export const selectPreferences = (state: ModelState) => state.preferences

export const selectRecentLanguageModels = (state: ModelState) =>
  state.preferences.lastUsedModels.language

export const selectRecentImageModels = (state: ModelState) => state.preferences.lastUsedModels.image

// Derived selectors
export const selectHealthyLanguageModels = (state: ModelState) =>
  state.availableModels.language.filter(
    (model) => model.available && (state.modelStatus[model.id] || 'healthy') === 'healthy'
  )

export const selectHealthyImageModels = (state: ModelState) =>
  state.availableModels.image.filter(
    (model) => model.available && (state.modelStatus[model.id] || 'healthy') === 'healthy'
  )
