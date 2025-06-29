import { createContext, useContext } from 'react'
import { useFlowOperations } from '@/hooks/useFlowOperations'
import { type ImageStructure } from '@/hooks/useAIActions'
import { type CategorizedPrompt } from '@/actions/segmentPrompt'

interface FlowActionsContextValue {
  generateImage: (
    prompt: string,
    nodeId: string,
    handleId: string
  ) => Promise<{ nodeId: string; data?: any } | null>
  atomizePrompt: (prompt: string, nodeId: string) => Promise<ImageStructure | null>
  segmentPrompt: (prompt: string, nodeId: string) => Promise<CategorizedPrompt | null>
  duplicateStructuredPrompt: (nodeId: string, data: ImageStructure) => string | null
  describeImage: (imageData: string, nodeId: string) => Promise<string | null>
  isGenerating: boolean
  isAtomizing: boolean
  isSegmenting: boolean
  isDescribing: boolean
}

const FlowActionsContext = createContext<FlowActionsContextValue>({
  generateImage: async () => null,
  atomizePrompt: async () => null,
  segmentPrompt: async () => null,
  duplicateStructuredPrompt: () => null,
  describeImage: async () => null,
  isGenerating: false,
  isAtomizing: false,
  isSegmenting: false,
  isDescribing: false,
})

export const FlowActionsProvider = ({ children }: { children: React.ReactNode }) => {
  const flowOperations = useFlowOperations()

  const value: FlowActionsContextValue = {
    generateImage: flowOperations.generateImage,
    atomizePrompt: flowOperations.atomizePrompt,
    segmentPrompt: flowOperations.segmentPrompt,
    duplicateStructuredPrompt: flowOperations.duplicateStructuredPrompt,
    describeImage: flowOperations.describeImage,
    isGenerating: flowOperations.isGenerating,
    isAtomizing: flowOperations.isAtomizing,
    isSegmenting: flowOperations.isSegmenting,
    isDescribing: flowOperations.isDescribing,
  }

  return <FlowActionsContext.Provider value={value}>{children}</FlowActionsContext.Provider>
}

export const useFlowActions = () => useContext(FlowActionsContext)
