import type { Meta, StoryObj } from '@storybook/react'
import { ImageNode } from './ImageNode'
import { ReactFlowProvider } from '@xyflow/react'
import React from 'react'

// Placeholder image - a simple colored rectangle
const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjY2NjY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIFBsYWNlaG9sZGVyPC90ZXh0Pgo8L3N2Zz4K'

const MOCK_IMAGE_DATA = {
  nodeId: 'mock-image-node-id',
  imageData: PLACEHOLDER_IMAGE,
  isLoading: false,
  hasError: false,
  modelUsed: 'dall-e-3',
}

// Wrapper component to provide required ReactFlow context
const ImageNodeWithProvider = () => {
  return (
    <ReactFlowProvider>
      <ImageNode id="mock-image-node-id" data={MOCK_IMAGE_DATA} />
    </ReactFlowProvider>
  )
}

const meta = {
  title: 'Nodes/ImageNode',
  component: ImageNodeWithProvider,
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
} satisfies Meta<typeof ImageNodeWithProvider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Loading: Story = {
  render: () => (
    <ReactFlowProvider>
      <ImageNode
        id="loading-image-node-id"
        data={{
          ...MOCK_IMAGE_DATA,
          imageData: undefined,
          isLoading: true,
        }}
      />
    </ReactFlowProvider>
  ),
}

export const Error: Story = {
  render: () => (
    <ReactFlowProvider>
      <ImageNode
        id="error-image-node-id"
        data={{
          ...MOCK_IMAGE_DATA,
          imageData: undefined,
          isLoading: false,
          hasError: true,
        }}
      />
    </ReactFlowProvider>
  ),
}

export const NoImageData: Story = {
  render: () => (
    <ReactFlowProvider>
      <ImageNode
        id="no-data-image-node-id"
        data={{
          ...MOCK_IMAGE_DATA,
          imageData: undefined,
          isLoading: false,
          hasError: false,
        }}
      />
    </ReactFlowProvider>
  ),
}

export const WithoutModel: Story = {
  render: () => (
    <ReactFlowProvider>
      <ImageNode
        id="no-model-image-node-id"
        data={{
          ...MOCK_IMAGE_DATA,
          modelUsed: undefined,
        }}
      />
    </ReactFlowProvider>
  ),
}
