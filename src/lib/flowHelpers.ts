import { useReactFlow, Edge } from '@xyflow/react'

export const useNodeDimensions = () => {
  const { getNode } = useReactFlow()
  return (nodeId: string) => {
    const node = getNode(nodeId)
    if (node && node.measured && node.measured.width && node.measured.height) {
      return { width: node.measured.width, height: node.measured.height }
    }
    return null
  }
}

export const isHandleConnected = (
  edges: Edge[],
  nodeId: string,
  handleId: string,
  type: 'source' | 'target'
) => {
  return type === 'source'
    ? edges.some((e) => e.source === nodeId && e.sourceHandle === handleId)
    : edges.some((e) => e.target === nodeId && e.targetHandle === handleId)
}
