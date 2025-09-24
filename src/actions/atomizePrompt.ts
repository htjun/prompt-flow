'use server'

import { openai, mapModelId } from '@/lib/ai'
import { generateObject } from 'ai'
import { imageAtomizationSchema } from '@/schema/imageAtomizationSchema'
import { atomizePromptSystemMessage } from '@/prompts/promptParse'
import { useGlobalModelStore } from '@/stores/globalModelStore'
import { z } from 'zod'

const atomizePromptInputSchema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty').max(10000, 'Prompt is too long'),
})

export const atomizePrompt = async (prompt: string) => {
  const validationResult = atomizePromptInputSchema.safeParse({ prompt })

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
      schemaName: 'atomized-image-prompt',
      schema: imageAtomizationSchema,
      messages: [
        {
          role: 'system',
          content: atomizePromptSystemMessage,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    // Convert to a plain serializable object
    return {
      object: JSON.parse(JSON.stringify(result.object)),
      usage: JSON.parse(JSON.stringify(result.usage)),
    }
  } catch (error) {
    throw error
  }
}
