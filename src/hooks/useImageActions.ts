import { useImageStore } from '@/stores/imageStore'
import { useImageDescriptionFlow } from '@/hooks/useImageDescriptionFlow'

export const useImageActions = (imageId: string, imageData?: string) => {
  const setGeneratedImage = useImageStore((s) => s.setGeneratedImage)
  const setGeneratedImageStatus = useImageStore((s) => s.setGeneratedImageStatus)
  const { describeImageAndAddNode, isDescribing } = useImageDescriptionFlow()

  const describe = () => {
    if (!imageData) return
    describeImageAndAddNode(imageData, imageId)
  }

  const refine = () => {
    // TODO: Implement refine logic
  }

  return {
    setGeneratedImage,
    setGeneratedImageStatus,
    describe,
    isDescribing,
    refine,
  }
}
