'use server'

import { openai, mapModelId } from '@/lib/ai'
import { generateText } from 'ai'
import { enhancePromptSystemMessage } from '@/prompts/promptEnhance'
import { useGlobalModelStore } from '@/stores/globalModelStore'

export const enhancePrompt = async (prompt: string) => {
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
