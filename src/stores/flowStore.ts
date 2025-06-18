import { create } from 'zustand'
import {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react'

interface FlowState {
  nodes: Node[]
  edges: Edge[]
  addNode: (
    node: Omit<Node, 'position'> & { position?: { x: number; y: number } },
    actionType?: 'enhance' | 'structure' | 'generate',
    referenceNodeId?: string,
    getNodeDimensions?: (nodeId: string) => { width: number; height: number } | null
  ) => void
  updateNode: (id: string, data: Record<string, unknown>) => void
  getNodeById: (id: string) => Node | undefined
  addEdge: (edge: Edge) => void
  removeNode: (id: string) => void
  removeEdge: (id: string) => void
  handleNodesChange: (changes: NodeChange[]) => void
  handleEdgesChange: (changes: EdgeChange[]) => void
}

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [
    {
      id: 'prompt',
      type: 'prompt',
      position: { x: 100, y: 100 },
      data: {},
    },
  ],
  edges: [],

  addNode: (node, actionType, referenceNodeId, getNodeDimensions) => {
    let position = node.position || { x: 100, y: 100 }

    // If actionType and referenceNodeId are provided, calculate position based on action
    if (actionType && referenceNodeId) {
      const { nodes } = get()
      const referenceNode = nodes.find((n) => n.id === referenceNodeId)

      if (referenceNode) {
        const gap = 50

        // Try to get actual node dimensions, fallback to defaults
        let nodeHeight = 160
        let nodeWidth = 320

        if (getNodeDimensions) {
          const dimensions = getNodeDimensions(referenceNodeId)
          if (dimensions) {
            nodeHeight = dimensions.height
            nodeWidth = dimensions.width
          }
        }

        switch (actionType) {
          case 'enhance':
          case 'structure':
            // Position below the reference node (same x, y + height + gap)
            position = {
              x: referenceNode.position.x,
              y: referenceNode.position.y + nodeHeight + gap,
            }
            break
          case 'generate':
            // Position to the right of the reference node (x + width + gap, same y)
            position = {
              x: referenceNode.position.x + nodeWidth + gap,
              y: referenceNode.position.y,
            }
            break
        }
      }
    }

    set((state) => ({
      nodes: [...state.nodes, { ...node, position }],
    }))
  },

  updateNode: (id, data) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      ),
    }))
  },

  getNodeById: (id) => {
    const { nodes } = get()
    return nodes.find((node) => node.id === id)
  },

  addEdge: (edge) => {
    set((state) => ({
      edges: [...state.edges, edge],
    }))
  },

  removeNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
    }))
  },

  removeEdge: (id) => {
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== id),
    }))
  },

  handleNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }))
  },

  handleEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }))
  },
}))
