import { useState } from 'react'
import { generateImageFromPrompt } from '@/actions/generateImage'

export const useGenerateImage = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const generate = async (prompt: string) => {
    try {
      setIsGenerating(true)
      setError(null)
      const imageBase64 = await generateImageFromPrompt(prompt)
      setGeneratedImage(imageBase64)
      return imageBase64
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
