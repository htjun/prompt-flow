import { SegmentedPromptNode } from '.'
import type { Meta, StoryObj } from '@storybook/react'
import { ReactFlowProvider } from '@xyflow/react'
import { mockSegmentedPromptData } from '@/mock/mockSegmentedPromptData'
import React from 'react'

const MOCK_SEGMENTED_PROMPT = {
  nodeId: 'test-segmented-node',
  object: mockSegmentedPromptData,
  isLoading: false,
}

// Wrapper component to provide required ReactFlow context
const SegmentedPromptNodeWithProvider = () => {
  return (
    <ReactFlowProvider>
      <SegmentedPromptNode data={MOCK_SEGMENTED_PROMPT} isProcessing={false} />
    </ReactFlowProvider>
  )
}

const meta = {
  title: 'Nodes/SegmentedPromptNode',
  component: SegmentedPromptNodeWithProvider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isProcessing: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof SegmentedPromptNodeWithProvider>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Loading: Story = {
  args: {},
  render: () => (
    <ReactFlowProvider>
      <SegmentedPromptNode
        data={{
          ...MOCK_SEGMENTED_PROMPT,
          isLoading: true,
        }}
        isProcessing={false}
      />
    </ReactFlowProvider>
  ),
}

export const Processing: Story = {
  args: {},
  render: () => (
    <ReactFlowProvider>
      <SegmentedPromptNode data={MOCK_SEGMENTED_PROMPT} isProcessing={true} />
    </ReactFlowProvider>
  ),
}

export const EmptySegments: Story = {
  args: {},
  render: () => (
    <ReactFlowProvider>
      <SegmentedPromptNode
        data={{
          nodeId: 'test-empty-node',
          object: { prompts: [] },
          isLoading: false,
        }}
        isProcessing={false}
      />
    </ReactFlowProvider>
  ),
}
