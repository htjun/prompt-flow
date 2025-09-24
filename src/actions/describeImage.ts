'use server'

import { openai } from '@/lib/ai'
import { generateText } from 'ai'
import { imageDescribePromptSystemMessage } from '@/prompts/imageDescribe'
import { z } from 'zod'

const describeImageSchema = z.object({
  imageData: z
    .string()
    .min(1, 'Image data cannot be empty')
    .refine((data) => {
      try {
        const base64Data = data.replace(/^data:image\/\w+;base64,/, '')
        return Buffer.from(base64Data, 'base64').length > 0
      } catch {
        return false
      }
    }, 'Invalid base64 image data'),
})

export const describeImage = async (imageData: string) => {
  const validationResult = describeImageSchema.safeParse({ imageData })

  if (!validationResult.success) {
    throw new Error(
      `Invalid input: ${validationResult.error.errors.map((e) => e.message).join(', ')}`
    )
  }
  const result = await generateText({
    model: openai('gpt-4o'),
    messages: [
      {
        role: 'system',
        content: imageDescribePromptSystemMessage,
      },
      {
        role: 'user',
        content: [
          {
            type: 'image',
            image: Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ''), 'base64'),
          },
        ],
      },
    ],
  })

  return result.text
}
