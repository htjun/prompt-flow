'use server'

import { openai } from '@/lib/ai'
import { generateObject } from 'ai'
import { imageStructureSchema } from '@/schema/imageStructure'
import { structurePromptSystemMessage } from '@/prompts/imageGeneration'
import { useModelStore } from '@/stores/modelStore'

export const structurePrompt = async (prompt: string) => {
  try {
    const selectedModel = useModelStore.getState().selectedLanguageModel
    const result = await generateObject({
      model: openai(selectedModel, {
        structuredOutputs: true,
      }),
      schemaName: 'structured-image-prompt',
      schema: imageStructureSchema,
      messages: [
        {
          role: 'system',
          content: structurePromptSystemMessage,
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
    console.error('Error in analyzeImage server action:', error)
    throw error
  }
}
