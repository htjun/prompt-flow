import { useAIActions, type ImageStructure } from '@/hooks/useAIActions'
import { usePromptStore } from '@/stores/promptStore'
import { useImageStore } from '@/stores/imageStore'
import { useFlowStore } from '@/stores/flowStore'
import { useNodeDimensions } from '@/lib/flowHelpers'

interface FlowOperationResult {
  nodeId: string
  data?: any
}

export const useFlowOperations = () => {
  const aiActions = useAIActions()
  const promptStore = usePromptStore()
  const imageStore = useImageStore()
  const flowStore = useFlowStore()
  const getNodeDimensions = useNodeDimensions()

  const createNodeWithPositioning = (
    nodeId: string,
    nodeType: string,
    nodeData: any,
    actionType: 'enhance' | 'generate' | 'structure' | 'describe',
    sourceNodeId: string
  ) => {
    flowStore.addNodeWithPositioning(
      {
        id: nodeId,
        type: nodeType,
        data: nodeData,
      },
      actionType,
      sourceNodeId,
      getNodeDimensions
    )
  }

  const createEdge = (sourceNodeId: string, targetNodeId: string, sourceHandle: string) => {
    flowStore.addEdge({
      id: `${sourceNodeId}->${targetNodeId}`,
      source: sourceNodeId,
      sourceHandle,
      target: targetNodeId,
      animated: true,
    })
  }

  const enhancePrompt = async (prompt: string, sourceNodeId: string): Promise<string | null> => {
    if (!prompt.trim()) return null

    const enhancedPromptId = `enhanced-prompt-${crypto.randomUUID()}`
    const sourceNode = flowStore.getNodeById(sourceNodeId)

    if (!sourceNode) return null

    // Set loading state
    promptStore.setOperationStatus(enhancedPromptId, { status: 'loading' })

    // Create node with loading state
    createNodeWithPositioning(
      enhancedPromptId,
      'enhanced-prompt',
      {
        text: '',
        nodeId: enhancedPromptId,
      },
      'enhance',
      sourceNodeId
    )

    // Create edge
    createEdge(sourceNodeId, enhancedPromptId, 'enhance')

    try {
      const enhancedText = await aiActions.enhance(prompt)

      if (enhancedText) {
        flowStore.updateNode(enhancedPromptId, { text: enhancedText })
        promptStore.setEnhancedPrompt(enhancedPromptId, enhancedText)
        promptStore.setOperationStatus(enhancedPromptId, { status: 'success' })
        return enhancedText
      } else {
        promptStore.setOperationStatus(enhancedPromptId, { status: 'error' })
        return null
      }
    } catch {
      promptStore.setOperationStatus(enhancedPromptId, { status: 'error' })
      return null
    }
  }

  const generateImage = async (
    prompt: string,
    sourceNodeId: string,
    sourceHandleId: string
  ): Promise<FlowOperationResult | null> => {
    if (!prompt.trim()) return null

    const newNodeId = `image-${crypto.randomUUID()}`
    const sourceNode = flowStore.getNodeById(sourceNodeId)

    if (!sourceNode) return null

    // Create node with loading state
    createNodeWithPositioning(
      newNodeId,
      'image',
      { isLoading: true },
      'generate',
      sourceNodeId
    )

    // Create edge
    flowStore.addEdge({
      id: `${sourceNodeId}-to-${newNodeId}`,
      source: sourceNodeId,
      sourceHandle: sourceHandleId,
      target: newNodeId,
      targetHandle: 'image-input',
      animated: true,
    })

    try {
      const result = await aiActions.generate(prompt)
      if (result) {
        flowStore.updateNode(newNodeId, {
          imageData: result.imageData,
          modelUsed: result.modelUsed,
          isLoading: false,
        })

        imageStore.setImageData(newNodeId, {
          imageData: result.imageData,
          modelUsed: result.modelUsed,
          prompt: prompt,
        })
        imageStore.setOperationStatus(newNodeId, { status: 'success' })
        return { nodeId: newNodeId, data: result }
      } else {
        flowStore.updateNode(newNodeId, {
          isLoading: false,
          hasError: true,
        })
        imageStore.setOperationStatus(newNodeId, { status: 'error' })
        return null
      }
    } catch {
      flowStore.updateNode(newNodeId, {
        isLoading: false,
        hasError: true,
      })
      imageStore.setOperationStatus(newNodeId, { status: 'error' })
      return null
    }
  }

  const structurePrompt = async (prompt: string, sourceNodeId: string): Promise<ImageStructure | null> => {
    if (!prompt.trim()) return null

    const structuredPromptId = `structured-prompt-${crypto.randomUUID()}`
    const sourceNode = flowStore.getNodeById(sourceNodeId)

    if (!sourceNode) return null

    // Create node with loading state
    createNodeWithPositioning(
      structuredPromptId,
      'structured-prompt-node',
      {
        object: {},
        nodeId: structuredPromptId,
        isLoading: true,
      },
      'structure',
      sourceNodeId
    )

    // Create edge
    createEdge(sourceNodeId, structuredPromptId, 'structure')

    try {
      const result = await aiActions.structure(prompt)

      if (result) {
        flowStore.updateNode(structuredPromptId, {
          object: result,
          isLoading: false,
        })

        // Store the result directly since new store accepts ImageStructure
        promptStore.setStructuredPrompt(structuredPromptId, result)
        promptStore.setOperationStatus(structuredPromptId, { status: 'success' })
        return result
      } else {
        flowStore.updateNode(structuredPromptId, { isLoading: false })
        promptStore.setOperationStatus(structuredPromptId, { status: 'error' })
        return null
      }
    } catch (error) {
      console.error('Error structuring prompt:', error)
      flowStore.updateNode(structuredPromptId, { isLoading: false })
      promptStore.setOperationStatus(structuredPromptId, { status: 'error' })
      return null
    }
  }

  const describeImage = async (imageData: string, sourceNodeId: string): Promise<string | null> => {
    if (!imageData.trim()) return null

    const enhancedPromptId = `enhanced-prompt-${crypto.randomUUID()}`
    const sourceNode = flowStore.getNodeById(sourceNodeId)

    if (!sourceNode) return null

    // Set loading state
    promptStore.setOperationStatus(enhancedPromptId, { status: 'loading' })

    // Create node with loading state
    createNodeWithPositioning(
      enhancedPromptId,
      'enhanced-prompt',
      {
        text: '',
        nodeId: enhancedPromptId,
      },
      'describe',
      sourceNodeId
    )

    // Create edge
    createEdge(sourceNodeId, enhancedPromptId, 'describe')

    try {
      const describedText = await aiActions.describe(imageData)

      if (describedText) {
        flowStore.updateNode(enhancedPromptId, { text: describedText })
        promptStore.setEnhancedPrompt(enhancedPromptId, describedText)
        promptStore.setOperationStatus(enhancedPromptId, { status: 'success' })
        return describedText
      } else {
        promptStore.setOperationStatus(enhancedPromptId, { status: 'error' })
        return null
      }
    } catch {
      promptStore.setOperationStatus(enhancedPromptId, { status: 'error' })
      return null
    }
  }

  const duplicateStructuredPrompt = (sourceNodeId: string, structuredData: ImageStructure): string | null => {
    if (!structuredData || Object.keys(structuredData).length === 0) return null

    const duplicatedNodeId = `structured-prompt-${crypto.randomUUID()}`
    const sourceNode = flowStore.getNodeById(sourceNodeId)

    if (!sourceNode) return null

    // Create duplicated node
    createNodeWithPositioning(
      duplicatedNodeId,
      'structured-prompt-node',
      {
        object: structuredData,
        nodeId: duplicatedNodeId,
        isLoading: false,
      },
      'structure',
      sourceNodeId
    )

    // Create edge
    flowStore.addEdge({
      id: `${sourceNodeId}-to-${duplicatedNodeId}`,
      source: sourceNodeId,
      sourceHandle: 'duplicate',
      target: duplicatedNodeId,
      targetHandle: 'image-input',
      animated: true,
    })

    return duplicatedNodeId
  }

  return {
    enhancePrompt,
    generateImage,
    structurePrompt,
    describeImage,
    duplicateStructuredPrompt,
    // Expose loading states from AI actions
    isEnhancing: aiActions.isEnhancing,
    isGenerating: aiActions.isGenerating,
    isStructuring: aiActions.isStructuring,
    isDescribing: aiActions.isDescribing,
    error: aiActions.error,
  }
}