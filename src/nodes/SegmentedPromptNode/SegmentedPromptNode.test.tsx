import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { SegmentedPromptNode } from '.'
import { mockSegmentedPromptData } from '@/mock/mockSegmentedPromptData'

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock the context
jest.mock('@/context/FlowActionsContext', () => ({
  useFlowActions: () => ({
    generateImage: jest.fn(),
    duplicateSegmentedPrompt: jest.fn(),
  }),
}))

// Mock the flow helpers
jest.mock('@/lib/flowHelpers', () => ({
  isHandleConnected: jest.fn().mockReturnValue(false),
}))

// Mock the hooks and components from @xyflow/react
jest.mock('@xyflow/react', () => ({
  ...jest.requireActual('@xyflow/react'),
  useEdges: () => [],
  Handle: ({ id, type, position, className, style }: any) => (
    <div
      data-testid={`handle-${id}`}
      data-type={type}
      data-position={position}
      className={className}
      style={style}
    />
  ),
  Position: {
    Top: 'top',
    Right: 'right',
    Bottom: 'bottom',
    Left: 'left',
  },
  ReactFlowProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const mockData = {
  nodeId: 'test-segmented-node',
  object: mockSegmentedPromptData,
  isLoading: false,
}

const renderWithProvider = (component: React.ReactElement) => {
  return render(component)
}

describe('SegmentedPromptNode', () => {
  it('renders with segmented prompt data', () => {
    renderWithProvider(<SegmentedPromptNode data={mockData} />)

    expect(screen.getByText('Segmented Prompt')).toBeInTheDocument()
    expect(
      screen.getByDisplayValue(
        'A futuristic cyberpunk city at night with towering neon-lit skyscrapers'
      )
    ).toBeInTheDocument()
    expect(screen.getByText('scene')).toBeInTheDocument()
    expect(screen.getByText('style')).toBeInTheDocument()
  })

  it('renders loading state', () => {
    const loadingData = { ...mockData, isLoading: true }
    renderWithProvider(<SegmentedPromptNode data={loadingData} />)

    expect(screen.getByText('Segmenting prompt...')).toBeInTheDocument()
  })

  it('renders empty state when no prompts', () => {
    const emptyData = { ...mockData, object: { prompts: [] } }
    renderWithProvider(<SegmentedPromptNode data={emptyData} />)

    expect(screen.getByText('No segments available')).toBeInTheDocument()
  })

  it('allows editing segment text', () => {
    renderWithProvider(<SegmentedPromptNode data={mockData} />)

    const sceneTextarea = screen.getByDisplayValue(
      'A futuristic cyberpunk city at night with towering neon-lit skyscrapers'
    )

    fireEvent.change(sceneTextarea, { target: { value: 'A modern city during the day' } })

    expect(sceneTextarea).toHaveValue('A modern city during the day')
  })

  it('shows correct category badges', () => {
    renderWithProvider(<SegmentedPromptNode data={mockData} />)

    const categories = ['scene', 'style', 'composition', 'lighting', 'mood', 'camera']
    categories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument()
    })
  })

  it('disables actions when no data', () => {
    const emptyData = { ...mockData, object: { prompts: [] } }
    renderWithProvider(<SegmentedPromptNode data={emptyData} />)

    const duplicateButton = screen.getByText('Duplicate')
    const generateButton = screen.getByText('Generate')

    expect(duplicateButton.closest('button')).toBeDisabled()
    expect(generateButton.closest('button')).toBeDisabled()
  })

  it('enables actions when data is available', () => {
    renderWithProvider(<SegmentedPromptNode data={mockData} />)

    const duplicateButton = screen.getByText('Duplicate')
    const generateButton = screen.getByText('Generate')

    expect(duplicateButton.closest('button')).not.toBeDisabled()
    expect(generateButton.closest('button')).not.toBeDisabled()
  })
})
