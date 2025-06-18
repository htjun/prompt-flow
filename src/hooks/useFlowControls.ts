import { useFlowStore } from '@/stores/flowStore'
import { type OnConnect } from '@xyflow/react'
import { useCallback } from 'react'

/**
 * Hook that provides all the flow controls needed for the App component
 */
export const useFlowControls = () => {
  const nodes = useFlowStore((state) => state.nodes)
  const edges = useFlowStore((state) => state.edges)
  const addEdge = useFlowStore((state) => state.addEdge)
  const handleNodesChange = useFlowStore((state) => state.handleNodesChange)
  const handleEdgesChange = useFlowStore((state) => state.handleEdgesChange)

  const onConnect: OnConnect = useCallback(
    (connection) => {
      const newEdge = {
        ...connection,
        id: `${connection.source}->${connection.target}`,
      }
      addEdge(newEdge)
    },
    [addEdge]
  )

  return {
    nodes,
    edges,
    handleNodesChange,
    handleEdgesChange,
    onConnect,
  }
}
