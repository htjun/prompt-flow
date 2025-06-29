// Handle IDs
export const HANDLE_IDS = {
  // Input handles
  PROMPT_INPUT: 'prompt-input',
  IMAGE_INPUT: 'image-input',

  // Output handles
  ENHANCE: 'enhance',
  GENERATE: 'generate',
  STRUCTURE: 'structure', // Still used for handle IDs, represents parse actions
  DESCRIBE: 'describe',
  REFINE: 'refine',
  DUPLICATE: 'duplicate',
} as const

// Button dimensions for xs size (used in calculateHandleOffset)
export const BUTTON_DIMENSIONS = {
  HEIGHT: 28, // h-7 = 1.75rem = 28px
  PADDING_X: 10, // px-2.5 = 0.625rem = 10px each side
  GAP: 6, // gap-1.5 = 0.375rem = 6px
  CONTAINER_PADDING: 4, // p-1 = 0.25rem = 4px
  // Estimate character width for text-xs (12px font-size)
  CHAR_WIDTH: 6, // Approximate width per character in pixels
} as const

// Edge utilities
export const createEdgeId = (sourceNodeId: string, targetNodeId: string): string => {
  return `${sourceNodeId}-to-${targetNodeId}`
}

// Type exports for better type safety
export type HandleId = (typeof HANDLE_IDS)[keyof typeof HANDLE_IDS]
export type HandleType = 'source' | 'target'
