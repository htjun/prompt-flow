import { createContext, useContext } from 'react'
import { useFlowOperations } from '@/hooks/useFlowOperations'
import { type ImageStructure } from '@/hooks/useAIActions'

interface FlowActionsContextValue {
  enhancePrompt: (prompt: string, nodeId: string) => Promise<string | null>
  generateImage: (
    prompt: string,
    nodeId: string,
    handleId: string
  ) => Promise<{ nodeId: string; data?: any } | null>
  structurePrompt: (
    prompt: string,
    nodeId: string
  ) => Promise<ImageStructure | null>
  duplicateStructuredPrompt: (
    nodeId: string,
    data: ImageStructure
  ) => string | null
  describeImage: (imageData: string, nodeId: string) => Promise<string | null>
  isEnhancing: boolean
  isGenerating: boolean
  isStructuring: boolean
  isDescribing: boolean
}

const FlowActionsContext = createContext<FlowActionsContextValue>({
  enhancePrompt: async () => null,
  generateImage: async () => null,
  structurePrompt: async () => null,
  duplicateStructuredPrompt: () => null,
  describeImage: async () => null,
  isEnhancing: false,
  isGenerating: false,
  isStructuring: false,
  isDescribing: false,
})

export const FlowActionsProvider = ({ children }: { children: React.ReactNode }) => {
  const flowOperations = useFlowOperations()

  const value: FlowActionsContextValue = {
    enhancePrompt: flowOperations.enhancePrompt,
    generateImage: flowOperations.generateImage,
    structurePrompt: flowOperations.structurePrompt,
    duplicateStructuredPrompt: flowOperations.duplicateStructuredPrompt,
    describeImage: flowOperations.describeImage,
    isEnhancing: flowOperations.isEnhancing,
    isGenerating: flowOperations.isGenerating,
    isStructuring: flowOperations.isStructuring,
    isDescribing: flowOperations.isDescribing,
  }

  return <FlowActionsContext.Provider value={value}>{children}</FlowActionsContext.Provider>
}

export const useFlowActions = () => useContext(FlowActionsContext)
