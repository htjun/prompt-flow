import { useAIActions, type ImageAtomization } from '@/hooks/useAIActions'
import { type CategorizedPrompt } from '@/actions/segmentPrompt'
import { usePromptStore } from '@/stores/promptStore'
import { useImageStore } from '@/stores/imageStore'
import { useFlowStore } from '@/stores/flowStore'
import { useNodeDimensions } from '@/lib/flowHelpers'
import { HANDLE_IDS, createEdgeId } from '@/constants/flowConstants'

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
    actionType: 'enhance' | 'generate' | 'atomize' | 'describe' | 'parse',
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
    createNodeWithPositioning(newNodeId, 'image', { isLoading: true }, 'generate', sourceNodeId)

    // Create edge
    flowStore.addEdge({
      id: createEdgeId(sourceNodeId, newNodeId),
      source: sourceNodeId,
      sourceHandle: sourceHandleId,
      target: newNodeId,
      targetHandle: HANDLE_IDS.IMAGE_INPUT,
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

  const atomizePrompt = async (
    prompt: string,
    sourceNodeId: string
  ): Promise<ImageAtomization | null> => {
    if (!prompt.trim()) return null

    const atomizedPromptId = `atomized-prompt-${crypto.randomUUID()}`
    const sourceNode = flowStore.getNodeById(sourceNodeId)

    if (!sourceNode) return null

    // Create node with loading state
    createNodeWithPositioning(
      atomizedPromptId,
      'atomized-prompt-node',
      {
        object: {},
        nodeId: atomizedPromptId,
        isLoading: true,
      },
      'parse',
      sourceNodeId
    )

    // Create edge
    flowStore.addEdge({
      id: createEdgeId(sourceNodeId, atomizedPromptId),
      source: sourceNodeId,
      sourceHandle: HANDLE_IDS.ATOMIZE,
      target: atomizedPromptId,
      targetHandle: HANDLE_IDS.PROMPT_INPUT,
      animated: true,
    })

    try {
      const result = await aiActions.atomize(prompt)

      if (result) {
        flowStore.updateNode(atomizedPromptId, {
          object: result,
          isLoading: false,
        })

        // Store the result directly since new store accepts ImageAtomization
        promptStore.setAtomizedPrompt(atomizedPromptId, result)
        promptStore.setOperationStatus(atomizedPromptId, { status: 'success' })
        return result
      } else {
        flowStore.updateNode(atomizedPromptId, { isLoading: false })
        promptStore.setOperationStatus(atomizedPromptId, { status: 'error' })
        return null
      }
    } catch (error) {
      console.error('Error atomizing prompt:', error)
      flowStore.updateNode(atomizedPromptId, { isLoading: false })
      promptStore.setOperationStatus(atomizedPromptId, { status: 'error' })
      return null
    }
  }

  const describeImage = async (imageData: string, sourceNodeId: string): Promise<string | null> => {
    if (!imageData.trim()) return null

    const promptNodeId = `prompt-${crypto.randomUUID()}`
    const sourceNode = flowStore.getNodeById(sourceNodeId)

    if (!sourceNode) return null

    // Set loading state
    promptStore.setOperationStatus(promptNodeId, { status: 'loading' })

    // Create node with loading state
    createNodeWithPositioning(
      promptNodeId,
      'prompt',
      {
        id: promptNodeId,
      },
      'describe',
      sourceNodeId
    )

    // Create edge
    flowStore.addEdge({
      id: createEdgeId(sourceNodeId, promptNodeId),
      source: sourceNodeId,
      sourceHandle: HANDLE_IDS.DESCRIBE,
      target: promptNodeId,
      targetHandle: HANDLE_IDS.PROMPT_INPUT,
      animated: true,
    })

    try {
      const describedText = await aiActions.describe(imageData)

      if (describedText) {
        flowStore.updateNode(promptNodeId, { id: promptNodeId })
        promptStore.setBasicPrompt(promptNodeId, describedText)
        promptStore.setOperationStatus(promptNodeId, { status: 'success' })
        return describedText
      } else {
        promptStore.setOperationStatus(promptNodeId, { status: 'error' })
        return null
      }
    } catch {
      promptStore.setOperationStatus(promptNodeId, { status: 'error' })
      return null
    }
  }

  const duplicateAtomizedPrompt = (
    sourceNodeId: string,
    atomizedData: ImageAtomization
  ): string | null => {
    if (!atomizedData || Object.keys(atomizedData).length === 0) return null

    const duplicatedNodeId = `atomized-prompt-${crypto.randomUUID()}`
    const sourceNode = flowStore.getNodeById(sourceNodeId)

    if (!sourceNode) return null

    // Create duplicated node
    createNodeWithPositioning(
      duplicatedNodeId,
      'atomized-prompt-node',
      {
        object: atomizedData,
        nodeId: duplicatedNodeId,
        isLoading: false,
      },
      'parse',
      sourceNodeId
    )

    // Create edge
    flowStore.addEdge({
      id: createEdgeId(sourceNodeId, duplicatedNodeId),
      source: sourceNodeId,
      sourceHandle: HANDLE_IDS.DUPLICATE,
      target: duplicatedNodeId,
      targetHandle: HANDLE_IDS.PROMPT_INPUT,
      animated: true,
    })

    return duplicatedNodeId
  }

  const segmentPrompt = async (
    prompt: string,
    sourceNodeId: string
  ): Promise<CategorizedPrompt | null> => {
    if (!prompt.trim()) return null

    try {
      const result = await aiActions.segment(prompt)
      return result
    } catch (error) {
      console.error('Error segmenting prompt:', error)
      return null
    }
  }

  return {
    generateImage,
    atomizePrompt,
    segmentPrompt,
    describeImage,
    duplicateAtomizedPrompt,
    // Expose loading states from AI actions
    isGenerating: aiActions.isGenerating,
    isAtomizing: aiActions.isAtomizing,
    isSegmenting: aiActions.isSegmenting,
    isDescribing: aiActions.isDescribing,
    error: aiActions.error,
  }
}
