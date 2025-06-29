'use server'

export type CategorizedPrompt = {
  prompts: Array<{
    category: 'scene' | 'style' | 'composition' | 'camera' | 'lighting'
    text: string
  }>
}

export const segmentPrompt = async (prompt: string): Promise<CategorizedPrompt> => {
  // TODO: Implement prompt segmentation logic
  console.log('segmentPrompt called with:', prompt)

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
