import type { NodeTypes } from '@xyflow/react'

import { PromptNode } from './PromptNode'
import { ImageNode } from './ImageNode'
import { AtomizedPromptNode } from './AtomizedPromptNode'

export const nodeTypes = {
  prompt: PromptNode,
  image: ImageNode,
  'atomized-prompt-node': AtomizedPromptNode,
} as const

export { PromptNode, ImageNode, AtomizedPromptNode }
