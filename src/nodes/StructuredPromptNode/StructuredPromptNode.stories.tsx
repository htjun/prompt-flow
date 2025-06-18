import type { Meta, StoryObj } from '@storybook/react'
import { StructuredPromptNode } from '.'
import { ReactFlowProvider } from '@xyflow/react'
import { mockStructuredPromptData } from '@/mock/mockStructuredPromptData'
import React from 'react'

const MOCK_STRUCTURED_PROMPT = {
  nodeId: 'mock-node-id',
  object: mockStructuredPromptData,
  usage: {
    promptTokens: 1028,
    completionTokens: 218,
    totalTokens: 1246,
  },
}

// Wrapper component to provide required ReactFlow context
const StructuredPromptNodeWithProvider = () => {
  return (
    <ReactFlowProvider>
      <StructuredPromptNode data={MOCK_STRUCTURED_PROMPT} isProcessing={false} />
    </ReactFlowProvider>
  )
}

const meta = {
  title: 'Nodes/StructuredPromptNode',
  component: StructuredPromptNodeWithProvider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ height: '500px', width: '500px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StructuredPromptNodeWithProvider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Pending: Story = {
  render: () => (
    <ReactFlowProvider>
      <StructuredPromptNode data={MOCK_STRUCTURED_PROMPT} isProcessing={true} />
    </ReactFlowProvider>
  ),
}
