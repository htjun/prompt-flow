import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { type ImageAtomization } from '@/hooks/useAIActions'

// Simplified and normalized state structure
interface OperationState {
  status: 'idle' | 'loading' | 'success' | 'error'
  error?: string
  timestamp: number
}

interface PromptEntities {
  basic: Record<string, string>
  atomized: Record<string, AtomizedPrompt>
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
  setAtomizedPrompt: (id: string, data: AtomizedPrompt) => void

  // Unified operation management
  setOperationStatus: (id: string, status: Omit<OperationState, 'timestamp'>) => void
  clearOperation: (id: string) => void

  // Selectors (kept for compatibility)
  getBasicPrompt: (id: string) => string
  getAtomizedPrompt: (id: string) => AtomizedPrompt | null
  getOperationStatus: (id: string) => OperationState['status']
  getOperationError: (id: string) => string | undefined

  // UI actions
  setActivePrompt: (id: string | null) => void

  // Cleanup
  clearPrompt: (id: string) => void
}

// Use ImageAtomization type for atomized prompts
type AtomizedPrompt = ImageAtomization

export const usePromptStore = create<PromptState>()(
  devtools(
    (set, get) => ({
      // Initial state
      entities: {
        basic: {},
        atomized: {},
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


      setAtomizedPrompt: (id, data) =>
        set(
          (state) => ({
            entities: {
              ...state.entities,
              atomized: { ...state.entities.atomized, [id]: data },
            },
          }),
          false,
          'setAtomizedPrompt'
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
      getAtomizedPrompt: (id) => get().entities.atomized[id] || null,
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
            const { [id]: removedAtomized, ...restAtomized } = state.entities.atomized
            const { [id]: removedOperation, ...restOperations } = state.operations

            return {
              entities: {
                basic: restBasic,
                atomized: restAtomized,
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


export const selectAtomizedPromptById = (id: string) => (state: PromptState) =>
  state.entities.atomized[id] || null

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
