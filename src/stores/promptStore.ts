import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { type ImageStructure } from '@/hooks/useAIActions'

// Simplified and normalized state structure
interface OperationState {
  status: 'idle' | 'loading' | 'success' | 'error'
  error?: string
  timestamp: number
}

interface PromptEntities {
  basic: Record<string, string>
  enhanced: Record<string, string>
  structured: Record<string, StructuredPrompt>
}

interface PromptState {
  // Normalized entities
  entities: PromptEntities
  
  // Operation tracking per entity
  operations: Record<string, OperationState>
  
  // UI state
  ui: {
    activePromptId: string | null
  }
  
  // Simplified actions
  setBasicPrompt: (id: string, text: string) => void
  setEnhancedPrompt: (id: string, text: string) => void
  setStructuredPrompt: (id: string, data: StructuredPrompt) => void
  
  // Unified operation management
  setOperationStatus: (id: string, status: Omit<OperationState, 'timestamp'>) => void
  clearOperation: (id: string) => void
  
  // Selectors (kept for compatibility)
  getBasicPrompt: (id: string) => string
  getEnhancedPrompt: (id: string) => string
  getStructuredPrompt: (id: string) => StructuredPrompt | null
  getOperationStatus: (id: string) => OperationState['status']
  getOperationError: (id: string) => string | undefined
  
  // UI actions
  setActivePrompt: (id: string | null) => void
  
  // Cleanup
  clearPrompt: (id: string) => void
}

// Use ImageStructure type for structured prompts
type StructuredPrompt = ImageStructure

export const usePromptStore = create<PromptState>()(
  devtools(
    (set, get) => ({
      // Initial state
      entities: {
        basic: {},
        enhanced: {},
        structured: {},
      },
      operations: {},
      ui: {
        activePromptId: null,
      },

      // Basic prompt actions
      setBasicPrompt: (id, text) =>
        set(
          (state) => ({
            entities: {
              ...state.entities,
              basic: { ...state.entities.basic, [id]: text },
            },
          }),
          false,
          'setBasicPrompt'
        ),

      setEnhancedPrompt: (id, text) =>
        set(
          (state) => ({
            entities: {
              ...state.entities,
              enhanced: { ...state.entities.enhanced, [id]: text },
            },
          }),
          false,
          'setEnhancedPrompt'
        ),

      setStructuredPrompt: (id, data) =>
        set(
          (state) => ({
            entities: {
              ...state.entities,
              structured: { ...state.entities.structured, [id]: data },
            },
          }),
          false,
          'setStructuredPrompt'
        ),

      // Unified operation management
      setOperationStatus: (id, statusUpdate) =>
        set(
          (state) => ({
            operations: {
              ...state.operations,
              [id]: {
                ...statusUpdate,
                timestamp: Date.now(),
              },
            },
          }),
          false,
          'setOperationStatus'
        ),

      clearOperation: (id) =>
        set(
          (state) => {
            const { [id]: removed, ...rest } = state.operations
            return { operations: rest }
          },
          false,
          'clearOperation'
        ),

      // Selectors for compatibility
      getBasicPrompt: (id) => get().entities.basic[id] || '',
      getEnhancedPrompt: (id) => get().entities.enhanced[id] || '',
      getStructuredPrompt: (id) => get().entities.structured[id] || null,
      getOperationStatus: (id) => get().operations[id]?.status || 'idle',
      getOperationError: (id) => get().operations[id]?.error,

      // UI actions
      setActivePrompt: (id) =>
        set(
          (state) => ({
            ui: { ...state.ui, activePromptId: id },
          }),
          false,
          'setActivePrompt'
        ),

      // Cleanup
      clearPrompt: (id) =>
        set(
          (state) => {
            const { [id]: removedBasic, ...restBasic } = state.entities.basic
            const { [id]: removedEnhanced, ...restEnhanced } = state.entities.enhanced
            const { [id]: removedStructured, ...restStructured } = state.entities.structured
            const { [id]: removedOperation, ...restOperations } = state.operations

            return {
              entities: {
                basic: restBasic,
                enhanced: restEnhanced,
                structured: restStructured,
              },
              operations: restOperations,
            }
          },
          false,
          'clearPrompt'
        ),
    }),
    { name: 'prompt-store' }
  )
)

// Reusable selectors for better performance
export const selectBasicPromptById = (id: string) => (state: PromptState) =>
  state.entities.basic[id] || ''

export const selectEnhancedPromptById = (id: string) => (state: PromptState) =>
  state.entities.enhanced[id] || ''

export const selectStructuredPromptById = (id: string) => (state: PromptState) =>
  state.entities.structured[id] || null

export const selectOperationStatusById = (id: string) => (state: PromptState) =>
  state.operations[id]?.status || 'idle'

export const selectOperationErrorById = (id: string) => (state: PromptState) =>
  state.operations[id]?.error

export const selectActivePromptId = (state: PromptState) => state.ui.activePromptId

// Derived selectors
export const selectIsOperationLoading = (id: string) => (state: PromptState) =>
  state.operations[id]?.status === 'loading'

export const selectHasOperationError = (id: string) => (state: PromptState) =>
  state.operations[id]?.status === 'error'