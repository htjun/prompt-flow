import { createContext, useContext } from 'react'
import { type z } from 'zod'
import { imageStructureSchema } from '@/schema/imageStructure'
import { usePromptEnhancementFlow } from '@/hooks/usePromptEnhancementFlow'
import { useImageGenerationFlow } from '@/hooks/useImageGenerationFlow'
import { usePromptStructureFlow } from '@/hooks/usePromptStructureFlow'

export type ImageStructure = z.infer<typeof imageStructureSchema>

interface FlowActionsContextValue {
  enhancePrompt: (prompt: string, nodeId: string) => Promise<string | null>
  generateImage: (
    prompt: string,
    nodeId: string,
    handleId: string
  ) => Promise<{ nodeId: string; imageData: string } | null>
  structurePrompt: (
    prompt: string,
    nodeId: string
  ) => Promise<ImageStructure | null>
  duplicateStructuredPrompt: (
    nodeId: string,
    data: ImageStructure
  ) => string | null
  isEnhancing: boolean
  isStructuring: boolean
}

const FlowActionsContext = createContext<FlowActionsContextValue>({
  enhancePrompt: async () => null,
  generateImage: async () => null,
  structurePrompt: async () => null,
  duplicateStructuredPrompt: () => null,
  isEnhancing: false,
  isStructuring: false,
})

export const FlowActionsProvider = ({ children }: { children: React.ReactNode }) => {
  const { enhancePromptNode, isEnhancing } = usePromptEnhancementFlow()
  const { generateImageNode } = useImageGenerationFlow()
  const { structurePromptNode, duplicateStructuredPromptNode, isStructuring } =
    usePromptStructureFlow()

  const value: FlowActionsContextValue = {
    enhancePrompt: enhancePromptNode,
    generateImage: generateImageNode,
    structurePrompt: structurePromptNode,
    duplicateStructuredPrompt: duplicateStructuredPromptNode,
    isEnhancing,
    isStructuring,
  }

  return <FlowActionsContext.Provider value={value}>{children}</FlowActionsContext.Provider>
}

export const useFlowActions = () => useContext(FlowActionsContext)
