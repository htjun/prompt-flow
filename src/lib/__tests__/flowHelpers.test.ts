// @xyflow/react mocking is handled in jest.setup.js
import { useNodeDimensions, isHandleConnected } from '../flowHelpers'
import { Edge } from '@xyflow/react'

describe('useNodeDimensions', () => {
  it('returns dimensions when available', () => {
    const getDims = useNodeDimensions()
    expect(getDims('a')).toEqual({ width: 10, height: 20 })
  })

  it('returns null when not found', () => {
    const getDims = useNodeDimensions()
    expect(getDims('b')).toBeNull()
  })
})

describe('isHandleConnected', () => {
  const edges = [
    { id: '1', source: 'n1', target: 'n2', sourceHandle: 'h1', targetHandle: 'h2' },
  ] as Edge[]

  it('checks source handle', () => {
    expect(isHandleConnected(edges, 'n1', 'h1', 'source')).toBe(true)
  })

  it('checks target handle', () => {
    expect(isHandleConnected(edges, 'n2', 'h2', 'target')).toBe(true)
  })
})
