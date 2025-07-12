'use server'

import { replicate } from '@/lib/ai'
import { AspectRatioService } from '@/lib/aspectRatioService'

export const generateImageFromPrompt = async (
  prompt: string,
  modelId?: string,
  aspectRatio?: string
) => {
  try {
    const model = modelId || 'google/imagen-4-fast'
    const ratio = aspectRatio || AspectRatioService.getDefaultRatio(model)

    // Model-specific parameters
    const modelSpecificParams: Record<string, any> = {}

    if (model.includes('flux')) {
      modelSpecificParams.num_outputs = 1
      modelSpecificParams.guidance_scale = 3.5
      modelSpecificParams.num_inference_steps = 28
    } else if (model.includes('imagen')) {
      modelSpecificParams.num_outputs = 1
    } else if (model.includes('ideogram')) {
      modelSpecificParams.model = 'V_2'
    } else if (model.includes('gpt-image')) {
      modelSpecificParams.quality = 'standard'
      modelSpecificParams.n = 1
    }

    // Get input with aspect ratio handling
    const input = AspectRatioService.getModelInput(model, ratio, prompt, modelSpecificParams)

    const output = await replicate.run(model as any, { input })
    let base64: string | null = null

    if (Array.isArray(output) && output.length > 0) {
      const imageUrl = output[0]
      const response = await fetch(imageUrl)
      const arrayBuffer = await response.arrayBuffer()
      base64 = Buffer.from(arrayBuffer).toString('base64')
    } else if (typeof output === 'string') {
      const response = await fetch(output)
      const arrayBuffer = await response.arrayBuffer()
      base64 = Buffer.from(arrayBuffer).toString('base64')
    } else if (output && typeof output === 'object' && 'getReader' in output) {
      const reader = (output as ReadableStream).getReader()
      const chunks: Uint8Array[] = []

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          chunks.push(value)
        }

        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
        const fullImageData = new Uint8Array(totalLength)
        let offset = 0

        for (const chunk of chunks) {
          fullImageData.set(chunk, offset)
          offset += chunk.length
        }

        base64 = Buffer.from(fullImageData).toString('base64')
      } finally {
        reader.releaseLock()
      }
    }

    if (!base64) {
      throw new Error('No image data found in response')
    }

    return {
      imageData: base64,
      modelUsed: model,
    }
  } catch (error) {
    throw error
  }
}
