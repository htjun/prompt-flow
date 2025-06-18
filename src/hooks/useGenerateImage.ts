import { useState } from 'react'
import { generateImageFromPrompt } from '@/actions/generateImage'
import { useModelStore } from '@/stores/modelStore'

export const useGenerateImage = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { selectedImageModel } = useModelStore()

  const generate = async (prompt: string) => {
    try {
      setIsGenerating(true)
      setError(null)
      const result = await generateImageFromPrompt(prompt, selectedImageModel)
      setGeneratedImage(result.imageData)
      return result
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate image'))
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    generate,
    generatedImage,
    isGenerating,
    error,
  }
}
