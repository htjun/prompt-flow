import { create } from 'zustand'

// Define structured prompt type
type StructuredPrompt = {
  composition: {
    focal_point: string
    balance: string
    depth: string
    motion: string
  }
  style: {
    art_style: string
    color_palette: string
    mood: string
    lighting: string
  }
  scene: {
    background: string
    time_of_day: string
    weather: string
    location: string
  }
  subjects?: Array<{
    type: string
    description: string
    pose?: string
    emotion?: string
    position: {
      x: number
      y: number
      width: number
      height: number
    }
  }>
  camera: {
    focal_length: string
    aperture: string
    angle: string
    depth_of_field: string
    aspect_ratio: string
  }
}

interface PromptState {
  prompt: string
  setPrompt: (prompt: string) => void
  enhancedPromptStatus: 'none' | 'loading' | 'error' | 'success'
  setEnhancedPromptStatus: (status: 'none' | 'loading' | 'error' | 'success') => void
  enhancedPrompts: Record<string, string>
  setEnhancedPrompt: (id: string, prompt: string) => void
  getEnhancedPrompt: (id: string) => string
  getAllEnhancedPrompts: () => Record<string, string>
  enhancedPromptStatuses: Record<string, 'none' | 'loading' | 'error' | 'success'>
  setEnhancedPromptStatusById: (
    id: string,
    status: 'none' | 'loading' | 'error' | 'success'
  ) => void
  getEnhancedPromptStatus: (id: string) => 'none' | 'loading' | 'error' | 'success'
  structuredPromptStatus: 'idle' | 'loading' | 'success' | 'error'
  setStructuredPromptStatus: (status: 'idle' | 'loading' | 'success' | 'error') => void
  structuredPrompts: Record<string, StructuredPrompt>
  setStructuredPrompt: (id: string, prompt: StructuredPrompt) => void
  getStructuredPrompt: (id: string) => StructuredPrompt | null
  getAllStructuredPrompts: () => Record<string, StructuredPrompt>
}

export const usePromptStore = create<PromptState>((set, get) => ({
  prompt: '',
  setPrompt: (prompt) => set({ prompt }),
  enhancedPromptStatus: 'none',
  setEnhancedPromptStatus: (status) => set({ enhancedPromptStatus: status }),
  enhancedPrompts: {},
  setEnhancedPrompt: (id, prompt) =>
    set((state) => ({
      enhancedPrompts: {
        ...state.enhancedPrompts,
        [id]: prompt,
      },
    })),
  getEnhancedPrompt: (id) => get().enhancedPrompts[id] || '',
  getAllEnhancedPrompts: () => get().enhancedPrompts,
  enhancedPromptStatuses: {},
  setEnhancedPromptStatusById: (id, status) =>
    set((state) => ({
      enhancedPromptStatuses: {
        ...state.enhancedPromptStatuses,
        [id]: status,
      },
    })),
  getEnhancedPromptStatus: (id) => get().enhancedPromptStatuses[id] || 'none',
  structuredPromptStatus: 'idle',
  setStructuredPromptStatus: (status) => set({ structuredPromptStatus: status }),
  structuredPrompts: {},
  setStructuredPrompt: (id, prompt) =>
    set((state) => ({
      structuredPrompts: {
        ...state.structuredPrompts,
        [id]: prompt,
      },
    })),
  getStructuredPrompt: (id) => get().structuredPrompts[id] || null,
  getAllStructuredPrompts: () => get().structuredPrompts,
}))
