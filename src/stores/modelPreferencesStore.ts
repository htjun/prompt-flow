import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface ModelPreferencesState {
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
  setPreference: <K extends keyof ModelPreferencesState['preferences']>(
    key: K,
    value: ModelPreferencesState['preferences'][K]
  ) => void
  addToRecentModels: (modelId: string, type: 'language' | 'image') => void
  getRecentModels: (type: 'language' | 'image') => string[]
}

export const useModelPreferencesStore = create<ModelPreferencesState>()(
  devtools(
    (set, get) => ({
      // Initial state
      preferences: {
        autoSelectBestModel: false,
        preferredProvider: 'auto',
        lastUsedModels: {
          language: [],
          image: [],
        },
      },

      // Actions
      setPreference: (key, value) =>
        set(
          (state) => ({
            preferences: { ...state.preferences, [key]: value },
          }),
          false,
          'setPreference'
        ),

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
    { name: 'model-preferences-store' }
  )
)