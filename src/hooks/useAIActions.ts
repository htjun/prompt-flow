import { useState, useEffect, useRef } from 'react'
import { enhancePrompt } from '@/actions/enhancePrompt'
import { atomizePrompt } from '@/actions/atomizePrompt'
import { segmentPrompt, type CategorizedPrompt } from '@/actions/segmentPrompt'
import { generateImageFromPrompt } from '@/actions/generateImage'
import { describeImage } from '@/actions/describeImage'
import { useModelSystem } from '@/hooks/useModelSystem'
import { z } from 'zod'
import { imageAtomizationSchema } from '@/schema/imageAtomizationSchema'

export type ImageAtomization = z.infer<typeof imageAtomizationSchema>

interface AIActionsState {
  isEnhancing: boolean
  isGenerating: boolean
  isDescribing: boolean
  isAtomizing: boolean
  isSegmenting: boolean
  error: Error | null
}

export const useAIActions = () => {
  const [state, setState] = useState<AIActionsState>({
    isEnhancing: false,
    isGenerating: false,
    isDescribing: false,
    isAtomizing: false,
    isSegmenting: false,
    error: null,
  })

  const modelSystem = useModelSystem()
  const abortControllerRef = useRef<AbortController | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const controller = abortControllerRef.current
      if (controller) {
        controller.abort()
      }
    }
  }, [])

  const setOperationState = (operation: keyof AIActionsState, value: boolean | Error | null) => {
    setState((prev) => ({
      ...prev,
      [operation]: value,
    }))
  }

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }))
  }

  const cleanup = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setState({
      isEnhancing: false,
      isGenerating: false,
      isDescribing: false,
      isAtomizing: false,
      isSegmenting: false,
      error: null,
    })
  }

  const enhance = async (prompt: string) => {
    try {
      clearError()
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

  const generate = async (prompt: string, nodeId?: string) => {
    try {
      clearError()
      setOperationState('isGenerating', true)

      // Use effective settings (node-specific or global)
      const imageModel = modelSystem.getEffectiveImageModel(nodeId)
      const aspectRatio = modelSystem.getEffectiveAspectRatio(nodeId)

      const result = await generateImageFromPrompt(prompt, imageModel, aspectRatio)
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
      clearError()
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

  const atomize = async (prompt: string): Promise<ImageAtomization | null> => {
    if (!prompt.trim()) return null

    try {
      clearError()
      setOperationState('isAtomizing', true)
      const result = await atomizePrompt(prompt)
      return result.object
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to atomize prompt')
      setOperationState('error', error)
      return null
    } finally {
      setOperationState('isAtomizing', false)
    }
  }

  const segment = async (prompt: string): Promise<CategorizedPrompt | null> => {
    try {
      clearError()
      setOperationState('isSegmenting', true)
      const result = await segmentPrompt(prompt)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to segment prompt')
      setOperationState('error', error)
      return null
    } finally {
      setOperationState('isSegmenting', false)
    }
  }

  return {
    enhance,
    generate,
    describe,
    atomize,
    segment,
    cleanup,
    isEnhancing: state.isEnhancing,
    isGenerating: state.isGenerating,
    isDescribing: state.isDescribing,
    isAtomizing: state.isAtomizing,
    isSegmenting: state.isSegmenting,
    error: state.error,
  }
}
