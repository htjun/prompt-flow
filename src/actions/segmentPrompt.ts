'use server'

export type CategorizedPrompt = {
  prompts: Array<{
    category: 'scene' | 'style' | 'composition' | 'camera' | 'lighting'
    text: string
  }>
}

export const segmentPrompt = async (prompt: string): Promise<CategorizedPrompt> => {
  // Placeholder return
  return {
    prompts: [
      {
        category: 'scene',
        text: 'Placeholder scene description',
      },
      {
        category: 'style',
        text: 'Placeholder style description',
      },
    ],
  }
}
