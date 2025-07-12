import { imageModels } from '@/constants/models'

export class AspectRatioService {
  // Convert aspect ratio to dimensions
  static ratioDimensions(
    ratio: string,
    baseSize: number = 1024
  ): { width: number; height: number } {
    const [w, h] = ratio.split(':').map(Number)
    const aspectRatio = w / h

    if (aspectRatio > 1) {
      // Landscape
      return {
        width: Math.round(baseSize * aspectRatio),
        height: baseSize,
      }
    } else {
      // Portrait or square
      return {
        width: baseSize,
        height: Math.round(baseSize / aspectRatio),
      }
    }
  }

  // Convert ratio to size string (e.g., "1024x768")
  static ratioToSize(
    ratio: string,
    customDimensions?: Record<string, { width: number; height: number }>
  ): string {
    if (customDimensions && customDimensions[ratio]) {
      const { width, height } = customDimensions[ratio]
      return `${width}x${height}`
    }

    const { width, height } = this.ratioDimensions(ratio)
    return `${width}x${height}`
  }

  // Get model-specific input based on aspect ratio config
  static getModelInput(
    modelId: string,
    ratio: string,
    prompt: string,
    additionalParams?: Record<string, any>
  ): Record<string, any> {
    const model = imageModels.find((m) => m.id === modelId)
    if (!model) throw new Error(`Model ${modelId} not found`)

    const baseInput = { prompt, ...additionalParams }

    switch (model.aspectRatio.type) {
      case 'dimensions': {
        const dimensions =
          model.aspectRatio.customDimensions?.[ratio] || this.ratioDimensions(ratio)
        return { ...baseInput, ...dimensions }
      }

      case 'size': {
        return {
          ...baseInput,
          size: this.ratioToSize(ratio, model.aspectRatio.customDimensions),
        }
      }

      case 'ratio': {
        return { ...baseInput, aspect_ratio: ratio }
      }

      default:
        return baseInput
    }
  }

  // Get available ratios for a specific model
  static getAvailableRatios(modelId: string): string[] {
    const model = imageModels.find((m) => m.id === modelId)
    return model?.aspectRatio.supportedRatios || ['1:1']
  }

  // Get default ratio for a specific model
  static getDefaultRatio(modelId: string): string {
    const model = imageModels.find((m) => m.id === modelId)
    return model?.aspectRatio.defaultRatio || '1:1'
  }
}
