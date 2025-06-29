import { AtomizedPromptNode } from '.'
import type { Meta, StoryObj } from '@storybook/react'
import { ReactFlowProvider } from '@xyflow/react'
import { mockAtomizedPromptData } from '@/mock/mockAtomizedPromptData'
import React from 'react'

const MOCK_ATOMIZED_PROMPT = {
  nodeId: 'test-node',
  object: mockAtomizedPromptData,
  isLoading: false,
}

// Wrapper component to provide required ReactFlow context
const AtomizedPromptNodeWithProvider = () => {
  return (
    <ReactFlowProvider>
      <AtomizedPromptNode data={MOCK_ATOMIZED_PROMPT} isProcessing={false} />
    </ReactFlowProvider>
  )
}

const meta = {
  title: 'Nodes/AtomizedPromptNode',
  component: AtomizedPromptNodeWithProvider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isProcessing: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof AtomizedPromptNodeWithProvider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Processing: Story = {
  args: {},
  render: () => (
    <ReactFlowProvider>
      <AtomizedPromptNode data={MOCK_ATOMIZED_PROMPT} isProcessing={true} />
    </ReactFlowProvider>
  ),
}
