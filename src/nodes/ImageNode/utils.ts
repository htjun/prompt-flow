export const getContainerWidth = (aspectRatio?: string): string => {
  if (!aspectRatio) return 'max-w-lg' // default

  const [w, h] = aspectRatio.split(':').map(Number)
  const ratio = w / h

  if (ratio >= 2.1) return 'max-w-2xl' // Ultra-wide (21:9)
  if (ratio >= 1.6) return 'max-w-xl' // Wide (16:9)
  if (ratio >= 1.2) return 'max-w-lg' // Landscape (4:3)
  if (ratio >= 0.9) return 'max-w-md' // Square (1:1)
  if (ratio >= 0.6) return 'max-w-sm' // Portrait (3:4)
  return 'max-w-xs' // Tall (1:3)
}

export const getImageSrc = (data: string): string => {
  if (data.startsWith('data:')) {
    return data
  }

  return `data:image/png;base64,${data}`
}
