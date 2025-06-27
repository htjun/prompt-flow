import { renderHook } from '@testing-library/react'
import { useNodeHandles } from '../useNodeHandles'
import { ReactFlowProvider } from '@xyflow/react'
import type { ReactNode } from 'react'

// Mock the dependencies
jest.mock('@xyflow/react', () => ({
  ...jest.requireActual('@xyflow/react'),
  useEdges: jest.fn(() => []),
  Position: {
    Top: 'top',
    Right: 'right',
    Bottom: 'bottom',
    Left: 'left',
  },
  Handle: ({ type, position, id, className, style }: any) => (
    <div
      data-testid={`handle-${id}`}
      data-type={type}
      data-position={position}
      className={className}
      style={style}
    />
  ),
}))

jest.mock('@/lib/flowHelpers', () => ({
  isHandleConnected: jest.fn((edges, nodeId, handleId, type) => {
    // Mock some handles as connected
    return handleId === 'connected-handle'
  }),
}))

jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
  calculateHandleOffset: (labels: string[], index: number) => ({
    left: `${50 + index * 100}px`,
  }),
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <ReactFlowProvider>{children}</ReactFlowProvider>
)

describe('useNodeHandles', () => {
  const nodeId = 'test-node'

  it('should render source handles with correct props', () => {
    const { result } = renderHook(() => useNodeHandles(nodeId), { wrapper })

    const handle = result.current.renderSourceHandle({
      handleId: 'test-handle',
      actionLabels: ['Action1', 'Action2'],
      actionIndex: 0,
    }) as any

    expect(handle.props.type).toBe('source')
    expect(handle.props.position).toBe('bottom')
    expect(handle.props.id).toBe('test-handle')
    expect(handle.props.style).toEqual({ left: '50px' })
  })

  it('should render target handles with correct props', () => {
    const { result } = renderHook(() => useNodeHandles(nodeId), { wrapper })

    const handle = result.current.renderTargetHandle({
      handleId: 'target-handle',
    }) as any

    expect(handle.props.type).toBe('target')
    expect(handle.props.position).toBe('left')
    expect(handle.props.id).toBe('target-handle')
  })

  it('should apply visibility classes based on connection status', () => {
    const { result } = renderHook(() => useNodeHandles(nodeId), { wrapper })

    const connectedHandle = result.current.renderSourceHandle({
      handleId: 'connected-handle',
      actionLabels: ['Action'],
      actionIndex: 0,
    }) as any

    const disconnectedHandle = result.current.renderSourceHandle({
      handleId: 'disconnected-handle',
      actionLabels: ['Action'],
      actionIndex: 0,
    }) as any

    expect(connectedHandle.props.className).toContain('opacity-100')
    expect(disconnectedHandle.props.className).toContain('opacity-0')
  })

  it('should check handle connection status', () => {
    const { result } = renderHook(() => useNodeHandles(nodeId), { wrapper })

    expect(result.current.isHandleConnectedCheck('connected-handle')).toBe(true)
    expect(result.current.isHandleConnectedCheck('disconnected-handle')).toBe(false)
  })

  it('should render multiple handles with renderHandles', () => {
    const { result } = renderHook(() => useNodeHandles(nodeId), { wrapper })

    const handles = result.current.renderHandles([
      {
        handleId: 'source-1',
        actionLabels: ['Action1', 'Action2'],
        actionIndex: 0,
      },
      {
        handleId: 'source-2',
        actionLabels: ['Action1', 'Action2'],
        actionIndex: 1,
      },
      {
        handleId: 'target-1',
      },
    ])

    expect(handles).toHaveLength(3)
    expect((handles[0] as any).props.type).toBe('source')
    expect((handles[1] as any).props.type).toBe('source')
    expect((handles[2] as any).props.type).toBe('target')
  })

  it('should apply custom className and style', () => {
    const { result } = renderHook(() => useNodeHandles(nodeId), { wrapper })

    const handle = result.current.renderSourceHandle({
      handleId: 'custom-handle',
      className: 'custom-class',
      style: { background: 'red' },
    }) as any

    expect(handle.props.className).toContain('custom-class')
    expect(handle.props.style).toMatchObject({ background: 'red' })
  })
})
