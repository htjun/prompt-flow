import { createContext, useContext, ReactNode } from 'react'
import { useFlowOperations } from '@/hooks/useFlowOperations'
import { type ImageAtomization } from '@/hooks/useAIActions'
import { type CategorizedPrompt } from '@/actions/segmentPrompt'

interface FlowActionsContextValue {
  generateImage: (prompt: string, sourceNodeId: string, sourceHandleId: string) => Promise<any>
  atomizePrompt: (prompt: string, nodeId: string) => Promise<ImageAtomization | null>
  segmentPrompt: (prompt: string, nodeId: string) => Promise<CategorizedPrompt | null>
  duplicateAtomizedPrompt: (nodeId: string, data: ImageAtomization) => string | null
  duplicateSegmentedPrompt: (nodeId: string, data: CategorizedPrompt) => string | null
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
  duplicateAtomizedPrompt: () => null,
  duplicateSegmentedPrompt: () => null,
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
    duplicateAtomizedPrompt: flowOperations.duplicateAtomizedPrompt,
    duplicateSegmentedPrompt: flowOperations.duplicateSegmentedPrompt,
    describeImage: flowOperations.describeImage,
    isGenerating: flowOperations.isGenerating,
    isAtomizing: flowOperations.isAtomizing,
    isSegmenting: flowOperations.isSegmenting,
    isDescribing: flowOperations.isDescribing,
  }

  return <FlowActionsContext.Provider value={value}>{children}</FlowActionsContext.Provider>
}

export const useFlowActions = () => useContext(FlowActionsContext)
