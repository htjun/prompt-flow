import { useFlowStore } from '@/stores/flowStore'
import { usePromptStore } from '@/stores/promptStore'
import { structurePrompt } from '@/actions/structurePrompt'
import { useNodeDimensions } from '@/lib/flowHelpers'
import { z } from 'zod'
import { imageStructureSchema } from '@/schema/imageStructure'

type ImageStructure = z.infer<typeof imageStructureSchema>

export const usePromptStructureFlow = () => {
  const { setStructuredPrompt, setStructuredPromptStatus, structuredPromptStatus } =
    usePromptStore()

  const addNode = useFlowStore((state) => state.addNode)
  const updateNode = useFlowStore((state) => state.updateNode)
  const addEdge = useFlowStore((state) => state.addEdge)
  const getNodeById = useFlowStore((state) => state.getNodeById)
  const getNodeDimensions = useNodeDimensions()

  const structurePromptNode = async (prompt: string, sourceNodeId: string) => {
    if (!prompt.trim()) return null

    // Generate a unique ID for this structured prompt
    const structuredPromptId = `structured-prompt-${crypto.randomUUID()}`

    // Get the source node for positioning
    const sourceNode = getNodeById(sourceNodeId)
    if (!sourceNode) return null

    // Add the structured prompt node with loading state
    addNode(
      {
        id: structuredPromptId,
        type: 'structured-prompt-node',
        data: {
          object: {},
          nodeId: structuredPromptId,
          isLoading: true,
        },
      },
      'structure',
      sourceNodeId,
      getNodeDimensions
    )

    // Connect the nodes
    addEdge({
      id: `${sourceNodeId}->${structuredPromptId}`,
      source: sourceNodeId,
      sourceHandle: 'structure',
      target: structuredPromptId,
      animated: true,
    })

    try {
      // Structure the prompt
      const result = await structurePrompt(prompt)

      if (result) {
        // Update the node with the structured data and remove loading state
        updateNode(structuredPromptId, {
          object: result.object,
          isLoading: false,
        })

        // Store the structured result in the prompt store
        setStructuredPrompt(structuredPromptId, result.object)
        setStructuredPromptStatus('success')
        return result.object
      } else {
        // Remove loading state on error
        updateNode(structuredPromptId, { isLoading: false })
        setStructuredPromptStatus('error')
        return null
      }
    } catch (error) {
      console.error('Error structuring prompt:', error)
      // Remove loading state on error
      updateNode(structuredPromptId, { isLoading: false })
      setStructuredPromptStatus('error')
      return null
    }
  }

  const duplicateStructuredPromptNode = (sourceNodeId: string, structuredData: ImageStructure) => {
    if (!structuredData || Object.keys(structuredData).length === 0) return null

    // Generate a unique ID for the duplicated node
    const duplicatedNodeId = `structured-prompt-${crypto.randomUUID()}`

    // Get the source node for positioning
    const sourceNode = getNodeById(sourceNodeId)
    if (!sourceNode) return null

    // Add the duplicated node with the same data
    addNode(
      {
        id: duplicatedNodeId,
        type: 'structured-prompt-node',
        data: {
          object: structuredData,
          nodeId: duplicatedNodeId,
          isLoading: false,
        },
      },
      'structure',
      sourceNodeId,
      getNodeDimensions
    )

    // Create connection between source node and the duplicated node
    addEdge({
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
    structurePromptNode,
    duplicateStructuredPromptNode,
    isStructuring: structuredPromptStatus === 'loading',
    structureStatus: structuredPromptStatus,
  }
}
