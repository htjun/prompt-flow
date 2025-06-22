import { useDescribeImage } from '@/hooks/useDescribeImage'
import { useFlowStore } from '@/stores/flowStore'
import { useNodeDimensions } from '@/lib/flowHelpers'
import { usePromptStore } from '@/stores/promptStore'

export const useImageDescriptionFlow = () => {
  const { describe, isDescribing } = useDescribeImage()
  const { setEnhancedPrompt, setEnhancedPromptStatusById } = usePromptStore()
  const addNode = useFlowStore((state) => state.addNode)
  const updateNode = useFlowStore((state) => state.updateNode)
  const addEdge = useFlowStore((state) => state.addEdge)
  const getNodeById = useFlowStore((state) => state.getNodeById)
  const getNodeDimensions = useNodeDimensions()

  const describeImageAndAddNode = async (imageData: string, sourceNodeId: string) => {
    if (!imageData.trim()) return null

    const enhancedPromptId = `enhanced-prompt-${crypto.randomUUID()}`
    const sourceNode = getNodeById(sourceNodeId)

    if (!sourceNode) return null

    setEnhancedPromptStatusById(enhancedPromptId, 'loading')

    addNode(
      {
        id: enhancedPromptId,
        type: 'enhanced-prompt',
        data: {
          text: '',
          nodeId: enhancedPromptId,
        },
      },
      'describe',
      sourceNodeId,
      getNodeDimensions
    )

    addEdge({
      id: `${sourceNodeId}->${enhancedPromptId}`,
      source: sourceNodeId,
      sourceHandle: 'describe',
      target: enhancedPromptId,
      animated: true,
    })

    try {
      const describedText = await describe(imageData)

      if (describedText) {
        updateNode(enhancedPromptId, { text: describedText })
        setEnhancedPrompt(enhancedPromptId, describedText)
        setEnhancedPromptStatusById(enhancedPromptId, 'success')
        return describedText
      } else {
        setEnhancedPromptStatusById(enhancedPromptId, 'error')
        return null
      }
    } catch {
      setEnhancedPromptStatusById(enhancedPromptId, 'error')
      return null
    }
  }

  return {
    describeImageAndAddNode,
    isDescribing,
  }
}
