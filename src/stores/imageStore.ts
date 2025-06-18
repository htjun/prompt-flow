import { create } from 'zustand'

interface ImageState {
  generatedImageStatus: 'none' | 'loading' | 'error' | 'success'
  setGeneratedImageStatus: (status: 'none' | 'loading' | 'error' | 'success') => void
  generatedImage: string | null
  setGeneratedImage: (image: string | null) => void
}

export const useImageStore = create<ImageState>((set) => ({
  generatedImageStatus: 'none',
  setGeneratedImageStatus: (status) => set({ generatedImageStatus: status }),
  generatedImage: null,
  setGeneratedImage: (image) => {
    set({ generatedImage: image })
  },
}))
