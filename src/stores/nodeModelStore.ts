import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useGlobalModelStore } from './globalModelStore'

interface NodeModelState {
  // Per-node settings storage
  nodeSettings: Record<
    string,
    {
      selectedLanguageModel?: string
      selectedImageModel?: string
      selectedAspectRatio?: string
    }
  >

  // Actions
  setNodeSelectedLanguageModel: (nodeId: string, modelId: string) => void
  setNodeSelectedImageModel: (nodeId: string, modelId: string) => void
  setNodeSelectedAspectRatio: (nodeId: string, ratio: string) => void
  getNodeSelectedLanguageModel: (nodeId: string) => string
  getNodeSelectedImageModel: (nodeId: string) => string
  getNodeSelectedAspectRatio: (nodeId: string) => string
  clearNodeSettings: (nodeId: string) => void
}

export const useNodeModelStore = create<NodeModelState>()(
  devtools(
    (set, get) => ({
      // Initial state
      nodeSettings: {},

      // Actions
      setNodeSelectedLanguageModel: (nodeId, modelId) =>
        set(
          (state) => ({
            nodeSettings: {
              ...state.nodeSettings,
              [nodeId]: {
                ...state.nodeSettings[nodeId],
                selectedLanguageModel: modelId,
              },
            },
          }),
          false,
          'setNodeSelectedLanguageModel'
        ),

      setNodeSelectedImageModel: (nodeId, modelId) =>
        set(
          (state) => ({
            nodeSettings: {
              ...state.nodeSettings,
              [nodeId]: {
                ...state.nodeSettings[nodeId],
                selectedImageModel: modelId,
              },
            },
          }),
          false,
          'setNodeSelectedImageModel'
        ),

      setNodeSelectedAspectRatio: (nodeId, ratio) =>
        set(
          (state) => ({
            nodeSettings: {
              ...state.nodeSettings,
              [nodeId]: {
                ...state.nodeSettings[nodeId],
                selectedAspectRatio: ratio,
              },
            },
          }),
          false,
          'setNodeSelectedAspectRatio'
        ),

      getNodeSelectedLanguageModel: (nodeId) => {
        const { nodeSettings } = get()
        const globalState = useGlobalModelStore.getState()
        return nodeSettings[nodeId]?.selectedLanguageModel ?? globalState.selectedLanguageModel
      },

      getNodeSelectedImageModel: (nodeId) => {
        const { nodeSettings } = get()
        const globalState = useGlobalModelStore.getState()
        return nodeSettings[nodeId]?.selectedImageModel ?? globalState.selectedImageModel
      },

      getNodeSelectedAspectRatio: (nodeId) => {
        const { nodeSettings } = get()
        const globalState = useGlobalModelStore.getState()
        return nodeSettings[nodeId]?.selectedAspectRatio ?? globalState.selectedAspectRatio
      },

      clearNodeSettings: (nodeId) =>
        set(
          (state) => {
            const { [nodeId]: _, ...rest } = state.nodeSettings
            return { nodeSettings: rest }
          },
          false,
          'clearNodeSettings'
        ),
    }),
    { name: 'node-model-store' }
  )
)
