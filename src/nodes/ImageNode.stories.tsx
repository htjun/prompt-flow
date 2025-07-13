import type { Meta, StoryObj } from '@storybook/react'
import { ImageNode } from './ImageNode'
import { ReactFlowProvider } from '@xyflow/react'
import React from 'react'

// Helper function to create SVG placeholders for different aspect ratios
const createPlaceholderImage = (width: number, height: number, label: string) => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#666666"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#fff" text-anchor="middle" dy=".3em">${label}</text>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

// Aspect ratio placeholders
const ASPECT_RATIO_IMAGES = {
  '4:3': createPlaceholderImage(480, 360, 'Landscape (4:3)'),
  '3:4': createPlaceholderImage(360, 480, 'Portrait (3:4)'),
  '1:1': createPlaceholderImage(400, 400, 'Square (1:1)'),
  '16:9': createPlaceholderImage(640, 360, 'Widescreen (16:9)'),
  '21:9': createPlaceholderImage(1920, 840, 'Ultrawide (21:9)'),
  '1:3': createPlaceholderImage(640, 1920, 'Tall Portrait (1:3)'),
}

// Original placeholder for backwards compatibility
const PLACEHOLDER_IMAGE = ASPECT_RATIO_IMAGES['1:1']

const MOCK_IMAGE_DATA = {
  nodeId: 'mock-image-node-id',
  imageData: PLACEHOLDER_IMAGE,
  isLoading: false,
  hasError: false,
  modelUsed: 'Flux Dev',
  aspectRatio: '1:1',
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
      <div>
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

// Aspect Ratio Variants
export const Landscape4x3: Story = {
  render: () => (
    <ReactFlowProvider>
      <ImageNode
        id="landscape-4x3-image-node-id"
        data={{
          ...MOCK_IMAGE_DATA,
          imageData: ASPECT_RATIO_IMAGES['4:3'],
          aspectRatio: '4:3',
        }}
      />
    </ReactFlowProvider>
  ),
}

export const Portrait3x4: Story = {
  render: () => (
    <ReactFlowProvider>
      <ImageNode
        id="portrait-3x4-image-node-id"
        data={{
          ...MOCK_IMAGE_DATA,
          imageData: ASPECT_RATIO_IMAGES['3:4'],
          aspectRatio: '3:4',
        }}
      />
    </ReactFlowProvider>
  ),
}

export const Square1x1: Story = {
  render: () => (
    <ReactFlowProvider>
      <ImageNode
        id="square-1x1-image-node-id"
        data={{
          ...MOCK_IMAGE_DATA,
          imageData: ASPECT_RATIO_IMAGES['1:1'],
          aspectRatio: '1:1',
        }}
      />
    </ReactFlowProvider>
  ),
}

export const Widescreen16x9: Story = {
  render: () => (
    <ReactFlowProvider>
      <ImageNode
        id="widescreen-16x9-image-node-id"
        data={{
          ...MOCK_IMAGE_DATA,
          imageData: ASPECT_RATIO_IMAGES['16:9'],
          aspectRatio: '16:9',
        }}
      />
    </ReactFlowProvider>
  ),
}

export const Ultrawide21x9: Story = {
  render: () => (
    <ReactFlowProvider>
      <ImageNode
        id="ultrawide-21x9-image-node-id"
        data={{
          ...MOCK_IMAGE_DATA,
          imageData: ASPECT_RATIO_IMAGES['21:9'],
          aspectRatio: '21:9',
        }}
      />
    </ReactFlowProvider>
  ),
}

export const TallPortrait1x3: Story = {
  render: () => (
    <ReactFlowProvider>
      <ImageNode
        id="tall-portrait-1x3-image-node-id"
        data={{
          ...MOCK_IMAGE_DATA,
          imageData: ASPECT_RATIO_IMAGES['1:3'],
          aspectRatio: '1:3',
        }}
      />
    </ReactFlowProvider>
  ),
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
