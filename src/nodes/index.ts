import type { NodeTypes } from '@xyflow/react'

import { PromptNode } from './PromptNode'
import { ImageNode } from './ImageNode'
import { AtomizedPromptNode } from './AtomizedPromptNode'
import { SegmentedPromptNode } from './SegmentedPromptNode'

export const nodeTypes = {
  prompt: PromptNode,
  image: ImageNode,
  'atomized-prompt-node': AtomizedPromptNode,
  'segmented-prompt-node': SegmentedPromptNode,
} as const

export { PromptNode, ImageNode, AtomizedPromptNode, SegmentedPromptNode }
