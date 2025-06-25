import { useState } from 'react'
import { enhancePrompt } from '@/actions/enhancePrompt'
import { generateImageFromPrompt } from '@/actions/generateImage'
import { describeImage } from '@/actions/describeImage'
import { structurePrompt } from '@/actions/structurePrompt'
import { useModelStore } from '@/stores/modelStore'
import { type z } from 'zod'
import { imageStructureSchema } from '@/schema/imageStructure'

export type ImageStructure = z.infer<typeof imageStructureSchema>

interface AIActionsState {
  isEnhancing: boolean
  isGenerating: boolean
  isDescribing: boolean
  isStructuring: boolean
  error: Error | null
}

export const useAIActions = () => {
  const [state, setState] = useState<AIActionsState>({
    isEnhancing: false,
    isGenerating: false,
    isDescribing: false,
    isStructuring: false,
    error: null,
  })

  const { selectedImageModel } = useModelStore()

  const setOperationState = (operation: keyof AIActionsState, value: boolean | Error | null) => {
    setState(prev => ({
      ...prev,
      [operation]: value,
      ...(operation === 'error' ? {} : { error: null })
    }))
  }

  const enhance = async (prompt: string) => {
    try {
      setOperationState('isEnhancing', true)
      const result = await enhancePrompt(prompt)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to enhance prompt')
      setOperationState('error', error)
      return null
    } finally {
      setOperationState('isEnhancing', false)
    }
  }

  const generate = async (prompt: string) => {
    try {
      setOperationState('isGenerating', true)
      const result = await generateImageFromPrompt(prompt, selectedImageModel)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to generate image')
      setOperationState('error', error)
      return null
    } finally {
      setOperationState('isGenerating', false)
    }
  }

  const describe = async (imageData: string) => {
    try {
      setOperationState('isDescribing', true)
      const result = await describeImage(imageData)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to describe image')
      setOperationState('error', error)
      return null
    } finally {
      setOperationState('isDescribing', false)
    }
  }

  const structure = async (prompt: string): Promise<ImageStructure | null> => {
    try {
      setOperationState('isStructuring', true)
      const result = await structurePrompt(prompt)
      return result.object
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to structure prompt')
      setOperationState('error', error)
      return null
    } finally {
      setOperationState('isStructuring', false)
    }
  }

  return {
    enhance,
    generate,
    describe,
    structure,
    isEnhancing: state.isEnhancing,
    isGenerating: state.isGenerating,
    isDescribing: state.isDescribing,
    isStructuring: state.isStructuring,
    error: state.error,
  }
}