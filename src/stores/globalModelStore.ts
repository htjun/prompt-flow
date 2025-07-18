import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { AspectRatioService } from '@/lib/aspectRatioService'

interface GlobalModelState {
  // Global model selections
  selectedLanguageModel: string
  selectedImageModel: string
  selectedAspectRatio: string

  // Actions
  setSelectedLanguageModel: (modelId: string) => void
  setSelectedImageModel: (modelId: string) => void
  setSelectedAspectRatio: (ratio: string) => void
}

export const useGlobalModelStore = create<GlobalModelState>()(
  devtools(
    (set) => ({
      // Initial state
      selectedLanguageModel: 'gpt-4.1-mini',
      selectedImageModel: 'google/imagen-4-fast',
      selectedAspectRatio: AspectRatioService.getDefaultRatio('google/imagen-4-fast'),

      // Actions
      setSelectedLanguageModel: (modelId) =>
        set({ selectedLanguageModel: modelId }, false, 'setSelectedLanguageModel'),

      setSelectedImageModel: (modelId) =>
        set({ selectedImageModel: modelId }, false, 'setSelectedImageModel'),

      setSelectedAspectRatio: (ratio) =>
        set({ selectedAspectRatio: ratio }, false, 'setSelectedAspectRatio'),
    }),
    { name: 'global-model-store' }
  )
)