import { useImageStore } from '@/stores/imageStore'

export const useImageActions = () => {
  const setGeneratedImage = useImageStore((s) => s.setGeneratedImage)
  const setGeneratedImageStatus = useImageStore((s) => s.setGeneratedImageStatus)
  return {
    setGeneratedImage,
    setGeneratedImageStatus,
  }
}
