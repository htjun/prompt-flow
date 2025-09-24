'use server'

import { openai, mapModelId } from '@/lib/ai'
import { generateObject } from 'ai'
import { imageSegmentSchema } from '@/schema/imageSegmentSchema'
import { segmentPromptSystemMessage } from '@/prompts/promptParse'
import { useGlobalModelStore } from '@/stores/globalModelStore'
import { z } from 'zod'

export type CategorizedPrompt = {
  prompts: Array<{
    category:
      | 'scene'
      | 'style'
      | 'composition'
      | 'camera'
      | 'lighting'
      | 'color'
      | 'mood'
      | 'texture'
      | 'misc'
    text: string
  }>
}

const segmentPromptInputSchema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty').max(10000, 'Prompt is too long'),
})

export const segmentPrompt = async (prompt: string): Promise<CategorizedPrompt> => {
  const validationResult = segmentPromptInputSchema.safeParse({ prompt })

  if (!validationResult.success) {
    throw new Error(
      `Invalid input: ${validationResult.error.errors.map((e) => e.message).join(', ')}`
    )
  }
  try {
    const selectedModel = useGlobalModelStore.getState().selectedLanguageModel
    const result = await generateObject({
      model: openai(mapModelId(selectedModel), {
        structuredOutputs: true,
      }),
      schemaName: 'segmented-image-prompt',
      schema: imageSegmentSchema,
      messages: [
        {
          role: 'system',
          content: segmentPromptSystemMessage,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    // Convert to a plain serializable object
    return {
      prompts: JSON.parse(JSON.stringify(result.object.prompts)),
    }
  } catch (error) {
    throw error
  }
}
