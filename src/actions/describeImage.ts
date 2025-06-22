'use server'

import { openai } from '@/lib/ai'
import { generateText } from 'ai'
import { imageDescribePromptSystemMessage } from '@/prompts/imageDescribe'

export const describeImage = async (imageData: string) => {
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
