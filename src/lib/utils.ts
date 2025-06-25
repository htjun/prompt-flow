import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { imageModels, languageModels } from '@/constants/models'
import { CSSProperties } from 'react'

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

/**
 * Calculates the right offset for a handle to center it with action buttons
 * @param actions Array of action items
 * @param targetIndex Index of the action button to center the handle with
 * @returns Inline style object for right positioning
 */
export const calculateHandleOffset = (actions: string[], targetIndex: number): CSSProperties => {
  // Button dimensions for size="xs"
  const BUTTON_HEIGHT = 28 // h-7 = 1.75rem = 28px
  const BUTTON_PADDING_X = 10 // px-2.5 = 0.625rem = 10px each side
  const BUTTON_GAP = 6 // gap-1.5 = 0.375rem = 6px
  const CONTAINER_PADDING = 4 // p-1 = 0.25rem = 4px

  // Estimate character width for text-xs (12px font-size)
  const CHAR_WIDTH = 6 // Approximate width per character in pixels

  // Calculate button widths
  const buttonWidths = actions.map((action) => {
    const textWidth = action.length * CHAR_WIDTH
    return textWidth + BUTTON_PADDING_X * 2 // Add left and right padding
  })

  // Calculate position from right edge
  let rightOffset = CONTAINER_PADDING

  // Add widths of buttons to the right of target
  for (let i = actions.length - 1; i > targetIndex; i--) {
    rightOffset += buttonWidths[i]
    if (i > targetIndex + 1) rightOffset += BUTTON_GAP
  }

  // Add half width of target button to center the handle
  rightOffset += buttonWidths[targetIndex] / 2

  // Round to nearest pixel and return as inline style
  const offset = Math.round(rightOffset)
  return { right: `${offset}px` }
}
