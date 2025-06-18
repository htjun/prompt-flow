import { useState } from 'react'
import { enhancePrompt } from '@/actions/enhancePrompt'

export const useEnhancePrompt = () => {
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const enhance = async (prompt: string) => {
    try {
      setIsEnhancing(true)
      setError(null)
      const result = await enhancePrompt(prompt)
      setEnhancedPrompt(result)
      return result
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to enhance prompt'))
      return null
    } finally {
      setIsEnhancing(false)
    }
  }

  return {
    enhance,
    enhancedPrompt,
    isEnhancing,
    error,
  }
}
