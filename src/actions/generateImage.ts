'use server'

import { replicate } from '@/lib/ai'

export const generateImageFromPrompt = async (prompt: string, modelId?: string) => {
  try {
    // Use the provided modelId or default to google/imagen-4-fast
    const model = modelId || 'google/imagen-4-fast'

    console.log('Using model:', model)

    // Configure input based on the model
    let input: any = { prompt }

    if (model.includes('flux')) {
      input = {
        prompt,
        width: 1024,
        height: 1024,
        num_outputs: 1,
        guidance_scale: 3.5,
        num_inference_steps: 28,
      }
    } else if (model.includes('imagen')) {
      input = {
        prompt,
        width: 1024,
        height: 1024,
        num_outputs: 1,
      }
    } else if (model.includes('gpt-image')) {
      input = {
        prompt,
        size: '1024x1024',
        quality: 'standard',
        n: 1,
      }
    } else if (model.includes('phoenix')) {
      input = {
        prompt,
        size: '1024x1024',
      }
    } else if (model.includes('ideogram')) {
      input = {
        prompt,
        aspect_ratio: '1:1',
        model: 'V_2',
      }
    } else {
      // Default configuration
      input = {
        prompt,
        width: 1024,
        height: 1024,
        num_outputs: 1,
      }
    }

    console.log('Input:', input)

    // For Replicate streaming responses, we need to collect the results
    const output = await replicate.run(model as any, { input })

    console.log('Raw output:', output)
    console.log('Output type:', typeof output)
    console.log('Is array:', Array.isArray(output))

    // Handle different response formats
    let base64: string | null = null

    if (Array.isArray(output) && output.length > 0) {
      // If we get a URL, fetch and convert to base64
      const imageUrl = output[0]
      const response = await fetch(imageUrl)
      const arrayBuffer = await response.arrayBuffer()
      base64 = Buffer.from(arrayBuffer).toString('base64')
    } else if (typeof output === 'string') {
      // If we get a URL as string, fetch and convert to base64
      const response = await fetch(output)
      const arrayBuffer = await response.arrayBuffer()
      base64 = Buffer.from(arrayBuffer).toString('base64')
    } else if (output && typeof output === 'object' && 'getReader' in output) {
      // Handle ReadableStream with binary image data
      const reader = (output as ReadableStream).getReader()
      const chunks: Uint8Array[] = []

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          chunks.push(value)
        }

        // Concatenate all chunks to get the complete binary image
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
        const fullImageData = new Uint8Array(totalLength)
        let offset = 0

        for (const chunk of chunks) {
          fullImageData.set(chunk, offset)
          offset += chunk.length
        }

        // Convert binary data directly to base64
        base64 = Buffer.from(fullImageData).toString('base64')
        console.log('Successfully converted binary stream to base64')
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
    console.error('Failed to generate image:', error)
    throw error
  }
}
