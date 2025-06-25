import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Model types for better type safety
interface ModelConfig {
  id: string
  name: string
  provider: 'openai' | 'google' | 'replicate'
  type: 'language' | 'image'
  available: boolean
  features: string[]
}

interface ModelState {
  // Current selections
  selectedLanguageModel: string
  selectedImageModel: string
  
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
}

// Default model configurations
const defaultLanguageModels: ModelConfig[] = [
  {
    id: 'gpt-4.1-mini',
    name: 'GPT-4.1 Mini',
    provider: 'openai',
    type: 'language',
    available: true,
    features: ['fast', 'efficient', 'structured-output'],
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openai',
    type: 'language',
    available: true,
    features: ['high-quality', 'reasoning', 'structured-output'],
  },
]

const defaultImageModels: ModelConfig[] = [
  {
    id: 'google/imagen-4-fast',
    name: 'Imagen 4 Fast',
    provider: 'google',
    type: 'image',
    available: true,
    features: ['fast', 'high-quality'],
  },
]

export const useModelStore = create<ModelState>()(
  devtools(
    (set, get) => ({
      // Initial state
      selectedLanguageModel: 'gpt-4.1-mini',
      selectedImageModel: 'google/imagen-4-fast',
      
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
        const model = get().getModelById(modelId)
        if (model && model.type === 'language' && model.available) {
          set(
            (state) => ({ selectedLanguageModel: modelId }),
            false,
            'setSelectedLanguageModel'
          )
          get().addToRecentModels(modelId, 'language')
        }
      },

      setSelectedImageModel: (modelId) => {
        const model = get().getModelById(modelId)
        if (model && model.type === 'image' && model.available) {
          set(
            (state) => ({ selectedImageModel: modelId }),
            false,
            'setSelectedImageModel'
          )
          get().addToRecentModels(modelId, 'image')
        }
      },

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

      getAvailableImageModels: () =>
        get().availableModels.image.filter((model) => model.available),

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

export const selectRecentImageModels = (state: ModelState) =>
  state.preferences.lastUsedModels.image

// Derived selectors
export const selectHealthyLanguageModels = (state: ModelState) =>
  state.availableModels.language.filter(
    (model) => model.available && (state.modelStatus[model.id] || 'healthy') === 'healthy'
  )

export const selectHealthyImageModels = (state: ModelState) =>
  state.availableModels.image.filter(
    (model) => model.available && (state.modelStatus[model.id] || 'healthy') === 'healthy'
  )