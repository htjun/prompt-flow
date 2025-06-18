import { create } from 'zustand'

interface ModelState {
  selectedLanguageModel: string
  setSelectedLanguageModel: (modelId: string) => void
  selectedImageModel: string
  setSelectedImageModel: (modelId: string) => void
}

export const useModelStore = create<ModelState>((set) => ({
  selectedImageModel: 'google/imagen-4-fast',
  setSelectedImageModel: (modelId) => set({ selectedImageModel: modelId }),
  selectedLanguageModel: 'gpt-4.1-mini',
  setSelectedLanguageModel: (modelId) => set({ selectedLanguageModel: modelId }),
}))
