'use server'

import { openai } from '@/lib/ai'
import { generateText } from 'ai'
import { enhancePromptSystemMessage } from '@/prompts/imageGeneration'
import { useModelStore } from '@/stores/modelStore'

export const enhancePrompt = async (prompt: string) => {
  const selectedModel = useModelStore.getState().selectedLanguageModel
  const result = await generateText({
    model: openai(selectedModel),
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
