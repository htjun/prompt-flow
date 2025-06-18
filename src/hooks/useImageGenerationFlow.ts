import { useGenerateImage } from '@/hooks/useGenerateImage'
import { useImageStore } from '@/stores/imageStore'
import { useFlowStore } from '@/stores/flowStore'
import { useNodeDimensions } from '@/lib/flowHelpers'

export const useImageGenerationFlow = () => {
  const { generate } = useGenerateImage()
  const { setGeneratedImage, setGeneratedImageStatus } = useImageStore()
  const addNode = useFlowStore((state) => state.addNode)
  const addEdge = useFlowStore((state) => state.addEdge)
  const getNodeById = useFlowStore((state) => state.getNodeById)
  const getNodeDimensions = useNodeDimensions()

  const generateImageNode = async (
    prompt: string,
    sourceNodeId: string,
    sourceHandleId: string
  ) => {
    if (!prompt.trim()) return null

    // Create a unique ID for the new image node
    const newNodeId = `image-${crypto.randomUUID()}`

    // Get the source node for positioning
    const sourceNode = getNodeById(sourceNodeId)
    if (!sourceNode) return null

    // Add the image node to the flow with loading state
    addNode(
      {
        id: newNodeId,
        type: 'image',
        data: { isLoading: true },
      },
      'generate',
      sourceNodeId,
      getNodeDimensions
    )

    // Create connection between source node and the new image node
    addEdge({
      id: `${sourceNodeId}-to-${newNodeId}`,
      source: sourceNodeId,
      sourceHandle: sourceHandleId,
      target: newNodeId,
      targetHandle: 'image-input',
      animated: true,
    })

    try {
      // Generate the image
      const imageBase64 = await generate(prompt)
      if (imageBase64) {
        // Update image data in the node
        useFlowStore.getState().updateNode(newNodeId, {
          imageData: imageBase64,
          isLoading: false,
        })

        // Set the generated image in the store
        setGeneratedImage(imageBase64)
        setGeneratedImageStatus('success')
        return { nodeId: newNodeId, imageData: imageBase64 }
      } else {
        useFlowStore.getState().updateNode(newNodeId, {
          isLoading: false,
          hasError: true,
        })
        setGeneratedImageStatus('error')
        return null
      }
    } catch {
      useFlowStore.getState().updateNode(newNodeId, {
        isLoading: false,
        hasError: true,
      })
      setGeneratedImageStatus('error')
      return null
    }
  }

  return {
    generateImageNode,
  }
}
