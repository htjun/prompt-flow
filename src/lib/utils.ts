import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { imageModels, languageModels } from '@/constants/models'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

// Helper function to get display name from any model ID
export const getModelDisplayName = (modelId: string): string => {
  const allModels = [...imageModels, ...languageModels]
  const model = allModels.find((m) => m.id === modelId)
  return model?.name || modelId
}

// Helper function to copy image data to clipboard
export const copyImageToClipboard = (imageData: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!imageData) {
      reject(new Error('No image data provided'))
      return
    }

    // Create a canvas to convert base64 to blob
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)

      canvas.toBlob((blob) => {
        if (blob) {
          const clipboardItem = new ClipboardItem({ 'image/png': blob })
          navigator.clipboard.write([clipboardItem]).then(resolve).catch(reject)
        } else {
          reject(new Error('Failed to create image blob'))
        }
      }, 'image/png')
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    // Handle both base64 and data URL formats
    const imageSrc = imageData.startsWith('data:')
      ? imageData
      : `data:image/png;base64,${imageData}`
    img.src = imageSrc
  })
}

// Helper function to download image data
export const downloadImage = (
  imageData: string,
  filename: string = 'generated-image.png'
): void => {
  if (!imageData) {
    throw new Error('No image data provided')
  }

  const getImageSrc = (data: string) => {
    if (data.startsWith('data:')) {
      return data
    }
    return `data:image/png;base64,${data}`
  }

  const link = document.createElement('a')
  link.href = getImageSrc(imageData)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
