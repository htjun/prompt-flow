// @xyflow/react mocking is handled in jest.setup.js
import { useFlowStore } from '../flowStore'
import { Edge } from '@xyflow/react'

const initial = JSON.parse(JSON.stringify(useFlowStore.getState()))

beforeEach(() => {
  useFlowStore.setState(JSON.parse(JSON.stringify(initial)))
})

describe('flowStore', () => {
  it('adds nodes with default position', () => {
    useFlowStore.getState().addNode({ id: 'n1', type: 'x', data: {} })
    expect(useFlowStore.getState().getNodeById('n1')?.position).toEqual({ x: 100, y: 100 })
  })

  it('positions generate nodes to the right', () => {
    useFlowStore
      .getState()
      .addNodeWithPositioning({ id: 'n2', type: 'x', data: {} }, 'generate', 'prompt', () => ({
        width: 80,
        height: 40,
      }))
    expect(useFlowStore.getState().getNodeById('n2')?.position).toEqual({ x: 230, y: 100 })
  })

  it('positions enhance nodes below', () => {
    useFlowStore.getState().addNodeWithPositioning({ id: 'n3', type: 'x', data: {} }, 'enhance', 'prompt', () => ({
      width: 80,
      height: 40,
    }))
    expect(useFlowStore.getState().getNodeById('n3')?.position).toEqual({ x: 100, y: 190 })
  })

  it('updates and removes nodes and edges', () => {
    const store = useFlowStore.getState()
    store.addNode({ id: 'n4', type: 'x', data: {} })
    store.updateNode('n4', { v: 1 })
    expect(useFlowStore.getState().getNodeById('n4')?.data).toEqual({ v: 1 })

    store.addEdge({ id: 'e1', source: 'prompt', target: 'n4' } as Edge)
    expect(useFlowStore.getState().edges).toHaveLength(1)

    store.removeEdge('e1')
    expect(useFlowStore.getState().edges).toHaveLength(0)

    store.addEdge({ id: 'e2', source: 'prompt', target: 'n4' } as Edge)
    store.removeNode('n4')
    expect(useFlowStore.getState().getNodeById('n4')).toBeUndefined()
    expect(useFlowStore.getState().edges).toHaveLength(0)
  })

  it('handles change callbacks', () => {
    const store = useFlowStore.getState()
    store.handleNodesChange([])
    store.handleEdgesChange([])
    expect(store.nodes).toBeDefined()
    expect(store.edges).toBeDefined()
  })
})
