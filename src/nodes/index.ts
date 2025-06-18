import type { NodeTypes } from '@xyflow/react'

import { PromptNode } from './PromptNode'
import { EnhancedPromptNode } from './EnhancedPromptNode'
import { ImageNode } from './ImageNode'
import { StructuredPromptNode } from './StructuredPromptNode'

export const nodeTypes = {
  prompt: PromptNode,
  'enhanced-prompt': EnhancedPromptNode,
  'structured-prompt-node': StructuredPromptNode,
  image: ImageNode,
} satisfies NodeTypes
