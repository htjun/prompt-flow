'use server'

import { google } from '@/lib/ai'
import { generateText } from 'ai'

export const generateImageFromPrompt = async (prompt: string) => {
  try {
    const result = await generateText({
      model: google('gemini-2.0-flash-exp'),
      prompt,
      providerOptions: {
        google: {
          responseModalities: ['TEXT', 'IMAGE'],
          size: '1024x1024',
        },
      },
    })

    // Find the first image file in the response
    const imageFile = result.files.find((file) => file.mimeType.startsWith('image/'))

    if (!imageFile) {
      throw new Error('No image was generated')
    }

    return imageFile.base64
  } catch (error) {
    console.error('Failed to generate image:', error)
    throw error
  }
}
