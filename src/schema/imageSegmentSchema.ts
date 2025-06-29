import { z } from 'zod'

/**
 * Schema for segmented image prompts
 * Defines the structure for categorizing prompt segments
 */
export const imageSegmentSchema = z.object({
  prompts: z
    .array(
      z.object({
        category: z
          .enum([
            'scene',
            'style',
            'composition',
            'camera',
            'lighting',
            'color',
            'mood',
            'texture',
            'misc',
          ])
          .describe('The category of the prompt segment.'),
        text: z.string().describe('The specific text for this prompt segment.'),
      })
    )
    .describe('An array of categorized text segments for image generation prompts.'),
})
