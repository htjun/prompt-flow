import { useState, useEffect } from 'react'
import { copyImageToClipboard, downloadImage } from '@/lib/utils'
import { useFlowActions } from '@/context/FlowActionsContext'

export const useImageHandlers = (imageData?: string, nodeId?: string) => {
  const [copySuccess, setCopySuccess] = useState(false)
  const { describeImage } = useFlowActions()

  const handleDescribe = () => {
    if (!imageData || !nodeId) return
    describeImage(imageData, nodeId)
  }

  const handleCopy = async () => {
    if (!imageData) return

    try {
      await copyImageToClipboard(imageData)
      setCopySuccess(true)
    } catch (error) {
      console.error('Failed to copy image:', error)
    }
  }

  const handleDownload = () => {
    if (!imageData) return

    try {
      downloadImage(imageData)
    } catch (error) {
      console.error('Failed to download image:', error)
    }
  }

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => {
        setCopySuccess(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [copySuccess])

  return {
    copySuccess,
    handleDescribe,
    handleCopy,
    handleDownload,
  }
}
