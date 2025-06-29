'use server'

import { openai } from '@/lib/ai'
import { generateObject } from 'ai'
import { imageSegmentSchema } from '@/schema/imageSegmentSchema'
import { segmentPromptSystemMessage } from '@/prompts/promptParse'
import { useModelStore } from '@/stores/modelStore'

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

export const segmentPrompt = async (prompt: string): Promise<CategorizedPrompt> => {
  try {
    const selectedModel = useModelStore.getState().selectedLanguageModel
    const result = await generateObject({
      model: openai(selectedModel, {
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
    console.error('Error in segmentPrompt server action:', error)
    throw error
  }
}
