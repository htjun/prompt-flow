import { useState } from 'react'
import { describeImage } from '@/actions/describeImage'

export const useDescribeImage = () => {
  const [isDescribing, setIsDescribing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const describe = async (imageData: string) => {
    try {
      setIsDescribing(true)
      setError(null)
      const result = await describeImage(imageData)
      return result
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to describe image'))
      return null
    } finally {
      setIsDescribing(false)
    }
  }

  return {
    describe,
    isDescribing,
    error,
  }
}
