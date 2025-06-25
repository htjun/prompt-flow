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
    flowStore.addNode(
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
    promptStore.setEnhancedPromptStatusById(enhancedPromptId, 'loading')
    promptStore.setEnhancedPromptStatus('loading')

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
        promptStore.setEnhancedPromptStatusById(enhancedPromptId, 'success')
        promptStore.setEnhancedPromptStatus('success')
        return enhancedText
      } else {
        promptStore.setEnhancedPromptStatusById(enhancedPromptId, 'error')
        promptStore.setEnhancedPromptStatus('error')
        return null
      }
    } catch {
      promptStore.setEnhancedPromptStatusById(enhancedPromptId, 'error')
      promptStore.setEnhancedPromptStatus('error')
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

        imageStore.setGeneratedImage(result.imageData)
        imageStore.setGeneratedImageStatus('success')
        return { nodeId: newNodeId, data: result }
      } else {
        flowStore.updateNode(newNodeId, {
          isLoading: false,
          hasError: true,
        })
        imageStore.setGeneratedImageStatus('error')
        return null
      }
    } catch {
      flowStore.updateNode(newNodeId, {
        isLoading: false,
        hasError: true,
      })
      imageStore.setGeneratedImageStatus('error')
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

        // Convert ImageStructure to StructuredPrompt format for store compatibility
        const structuredPrompt = {
          composition: {
            focal_point: result.camera.angle,
            balance: 'centered', // default value
            depth: result.camera.depth_of_field,
            motion: 'static', // default value
          },
          style: {
            art_style: result.style.art_style,
            color_palette: result.style.color_palette,
            mood: result.style.mood,
            lighting: result.style.lighting,
          },
          scene: {
            background: result.scene.background || '',
            time_of_day: result.scene.time || '',
            weather: result.scene.weather || '',
            location: result.scene.setting,
          },
          subjects: result.subjects?.map(subject => ({
            type: subject.type,
            description: subject.description,
            pose: subject.pose || undefined,
            emotion: subject.emotion || undefined,
            position: {
              x: 0, // default values - could be enhanced later
              y: 0,
              width: 100,
              height: 100,
            }
          })),
          camera: {
            focal_length: result.camera.focal_length,
            aperture: result.camera.aperture,
            angle: result.camera.angle,
            depth_of_field: result.camera.depth_of_field,
            aspect_ratio: '16:9', // default value
          },
        }
        promptStore.setStructuredPrompt(structuredPromptId, structuredPrompt)
        promptStore.setStructuredPromptStatus('success')
        return result
      } else {
        flowStore.updateNode(structuredPromptId, { isLoading: false })
        promptStore.setStructuredPromptStatus('error')
        return null
      }
    } catch (error) {
      console.error('Error structuring prompt:', error)
      flowStore.updateNode(structuredPromptId, { isLoading: false })
      promptStore.setStructuredPromptStatus('error')
      return null
    }
  }

  const describeImage = async (imageData: string, sourceNodeId: string): Promise<string | null> => {
    if (!imageData.trim()) return null

    const enhancedPromptId = `enhanced-prompt-${crypto.randomUUID()}`
    const sourceNode = flowStore.getNodeById(sourceNodeId)

    if (!sourceNode) return null

    // Set loading state
    promptStore.setEnhancedPromptStatusById(enhancedPromptId, 'loading')

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
        promptStore.setEnhancedPromptStatusById(enhancedPromptId, 'success')
        return describedText
      } else {
        promptStore.setEnhancedPromptStatusById(enhancedPromptId, 'error')
        return null
      }
    } catch {
      promptStore.setEnhancedPromptStatusById(enhancedPromptId, 'error')
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