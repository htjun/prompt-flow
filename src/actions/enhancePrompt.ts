'use server'

import { openai, mapModelId } from '@/lib/ai'
import { generateText } from 'ai'
import { enhancePromptSystemMessage } from '@/prompts/promptEnhance'
import { useGlobalModelStore } from '@/stores/globalModelStore'
import { z } from 'zod'

const enhancePromptSchema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty').max(10000, 'Prompt is too long'),
})

export const enhancePrompt = async (prompt: string) => {
  const validationResult = enhancePromptSchema.safeParse({ prompt })

  if (!validationResult.success) {
    throw new Error(
      `Invalid input: ${validationResult.error.errors.map((e) => e.message).join(', ')}`
    )
  }
  const selectedModel = useGlobalModelStore.getState().selectedLanguageModel
  const result = await generateText({
    model: openai(mapModelId(selectedModel)),
    temperature: 1.2,
    topP: 1,
    messages: [
      {
        role: 'system',
        content: enhancePromptSystemMessage,
      },
      {
        role: 'user',
        content: `<image_prompt>${prompt}</image_prompt>`,
      },
    ],
  })

  return result.text
}
