import { createOpenAI } from '@ai-sdk/openai'
import Replicate from 'replicate'

// Map UI model IDs to actual API model IDs
export const mapModelId = (modelId: string): string => {
  const mapping: Record<string, string> = {
    'gpt-4.1-mini': 'gpt-4o-mini',
    'gpt-4o': 'gpt-4o',
  }
  return mapping[modelId] || modelId
}

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: 'strict',
})

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})
