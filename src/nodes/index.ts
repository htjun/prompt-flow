import type { NodeTypes } from '@xyflow/react'

import { PromptNode } from './PromptNode'
import { ImageNode } from './ImageNode'
import { StructuredPromptNode } from './StructuredPromptNode'

export const nodeTypes = {
  prompt: PromptNode,
  image: ImageNode,
  'structured-prompt-node': StructuredPromptNode,
} as const

export { PromptNode, ImageNode, StructuredPromptNode }
