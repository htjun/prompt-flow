import { useEnhancePrompt } from '@/hooks/useEnhancePrompt'
import { usePromptStore } from '@/stores/promptStore'
import { useFlowStore } from '@/stores/flowStore'
import { useNodeDimensions } from '@/lib/flowHelpers'

export const usePromptEnhancementFlow = () => {
  const { enhance, isEnhancing } = useEnhancePrompt()
  const { setEnhancedPrompt, setEnhancedPromptStatusById, setEnhancedPromptStatus } =
    usePromptStore()
  const addNode = useFlowStore((state) => state.addNode)
  const updateNode = useFlowStore((state) => state.updateNode)
  const addEdge = useFlowStore((state) => state.addEdge)
  const getNodeById = useFlowStore((state) => state.getNodeById)
  const getNodeDimensions = useNodeDimensions()

  const enhancePromptNode = async (prompt: string, sourceNodeId: string) => {
    if (!prompt.trim()) return null

    // Generate a unique ID for this enhanced prompt
    const enhancedPromptId = `enhanced-prompt-${crypto.randomUUID()}`
    const promptNode = getNodeById(sourceNodeId)

    if (!promptNode) return null

    // Set loading state for this specific node
    setEnhancedPromptStatusById(enhancedPromptId, 'loading')

    // Keep global status for backward compatibility
    setEnhancedPromptStatus('loading')

    // Get the source node for positioning
    const sourceNode = getNodeById(sourceNodeId)
    if (!sourceNode) return null

    // Add the enhanced prompt node with loading state
    addNode(
      {
        id: enhancedPromptId,
        type: 'enhanced-prompt',
        data: {
          text: '', // Empty text while loading
          nodeId: enhancedPromptId, // Store the node ID in data
        },
      },
      'enhance',
      sourceNodeId,
      getNodeDimensions
    )

    // Connect the nodes
    addEdge({
      id: `${sourceNodeId}->${enhancedPromptId}`,
      source: sourceNodeId,
      sourceHandle: 'enhance',
      target: enhancedPromptId,
      animated: true,
    })

    try {
      // Enhance the prompt
      const enhancedText = await enhance(prompt)

      if (enhancedText) {
        // Update the node with the enhanced text
        updateNode(enhancedPromptId, { text: enhancedText })

        // Update store with the ID and text
        setEnhancedPrompt(enhancedPromptId, enhancedText)
        setEnhancedPromptStatusById(enhancedPromptId, 'success')
        setEnhancedPromptStatus('success')
        return enhancedText
      } else {
        setEnhancedPromptStatusById(enhancedPromptId, 'error')
        setEnhancedPromptStatus('error')
        return null
      }
    } catch {
      setEnhancedPromptStatusById(enhancedPromptId, 'error')
      setEnhancedPromptStatus('error')
      return null
    }
  }

  return {
    enhancePromptNode,
    isEnhancing,
  }
}
