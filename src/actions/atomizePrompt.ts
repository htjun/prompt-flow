'use server'

import { openai, mapModelId } from '@/lib/ai'
import { generateObject } from 'ai'
import { imageAtomizationSchema } from '@/schema/imageAtomizationSchema'
import { atomizePromptSystemMessage } from '@/prompts/promptParse'
import { useModelStore } from '@/stores/modelStore'

export const atomizePrompt = async (prompt: string) => {
  try {
    const selectedModel = useModelStore.getState().selectedLanguageModel
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
    console.error('Error in atomizePrompt server action:', error)
    throw error
  }
}
