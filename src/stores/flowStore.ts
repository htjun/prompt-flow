import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react'
import { NodePositioningService, type ActionType } from '@/lib/nodePositioning'

interface FlowState {
  // Core state
  nodes: Node[]
  edges: Edge[]

  // UI state
  ui: {
    selectedNodeIds: string[]
    viewportState: {
      x: number
      y: number
      zoom: number
    }
    isSelectionMode: boolean
  }

  // Core actions
  addNode: (node: Omit<Node, 'position'> & { position?: { x: number; y: number } }) => void
  updateNode: (id: string, data: Record<string, unknown>) => void
  removeNode: (id: string) => void
  clearAllNodes: () => void

  addEdge: (edge: Edge) => void
  removeEdge: (id: string) => void
  clearAllEdges: () => void

  // Flow-specific actions with positioning
  addNodeWithPositioning: (
    node: Omit<Node, 'position'> & { position?: { x: number; y: number } },
    actionType?: ActionType,
    referenceNodeId?: string,
    getNodeDimensions?: (nodeId: string) => { width: number; height: number } | null
  ) => void

  // React Flow handlers
  handleNodesChange: (changes: NodeChange[]) => void
  handleEdgesChange: (changes: EdgeChange[]) => void

  // Selectors
  getNodeById: (id: string) => Node | undefined
  getNodesByType: (type: string) => Node[]
  getConnectedNodes: (nodeId: string) => { incoming: Node[]; outgoing: Node[] }
  getEdgesByNodeId: (nodeId: string) => { incoming: Edge[]; outgoing: Edge[] }

  // UI actions
  setSelectedNodes: (nodeIds: string[]) => void
  addToSelection: (nodeId: string) => void
  removeFromSelection: (nodeId: string) => void
  clearSelection: () => void
  setViewportState: (viewport: { x: number; y: number; zoom: number }) => void
  setSelectionMode: (enabled: boolean) => void

  // Bulk operations
  duplicateNodes: (nodeIds: string[]) => void
  deleteSelectedNodes: () => void

  // Layout utilities
  arrangeNodesInGrid: (nodeIds: string[]) => void
  autoLayoutNodes: () => void

  // Memory management
  cleanup: () => void
  pruneOldNodes: (maxAge: number) => void
  limitNodeCount: (maxNodes: number) => void
}

export const useFlowStore = create<FlowState>()(
  devtools(
    (set, get) => ({
      // Initial state
      nodes: [
        {
          id: 'prompt',
          type: 'prompt',
          position: { x: 100, y: 200 },
          data: {},
        },
      ],
      edges: [],
      ui: {
        selectedNodeIds: [],
        viewportState: { x: 0, y: 0, zoom: 1 },
        isSelectionMode: false,
      },

      // Core node actions
      addNode: (node) =>
        set(
          (state) => ({
            nodes: [...state.nodes, { ...node, position: node.position || { x: 100, y: 100 } }],
          }),
          false,
          'addNode'
        ),

      updateNode: (id, data) =>
        set(
          (state) => ({
            nodes: state.nodes.map((node) =>
              node.id === id ? { ...node, data: { ...node.data, ...data } } : node
            ),
          }),
          false,
          'updateNode'
        ),

      removeNode: (id) =>
        set(
          (state) => ({
            nodes: state.nodes.filter((node) => node.id !== id),
            edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
            ui: {
              ...state.ui,
              selectedNodeIds: state.ui.selectedNodeIds.filter((nodeId) => nodeId !== id),
            },
          }),
          false,
          'removeNode'
        ),

      clearAllNodes: () =>
        set(
          {
            nodes: [],
            edges: [],
            ui: {
              selectedNodeIds: [],
              viewportState: { x: 0, y: 0, zoom: 1 },
              isSelectionMode: false,
            },
          },
          false,
          'clearAllNodes'
        ),

      // Core edge actions
      addEdge: (edge) =>
        set(
          (state) => ({
            edges: [...state.edges, edge],
          }),
          false,
          'addEdge'
        ),

      removeEdge: (id) =>
        set(
          (state) => ({
            edges: state.edges.filter((edge) => edge.id !== id),
          }),
          false,
          'removeEdge'
        ),

      clearAllEdges: () => set((state) => ({ edges: [] }), false, 'clearAllEdges'),

      // Flow-specific positioning action
      addNodeWithPositioning: (node, actionType, referenceNodeId, getNodeDimensions) => {
        let position = node.position || { x: 100, y: 100 }

        // Calculate position if actionType and referenceNodeId are provided
        if (actionType && referenceNodeId) {
          const referenceNode = get().getNodeById(referenceNodeId)
          if (referenceNode) {
            position = NodePositioningService.calculatePosition(
              actionType,
              referenceNode,
              getNodeDimensions
            )
          }
        }

        // Check for collisions and find non-overlapping position
        const existingNodes = get().nodes.map((existingNode) => ({
          position: existingNode.position,
          dimensions: getNodeDimensions 
            ? getNodeDimensions(existingNode.id) || { width: 320, height: 160 }
            : { width: 320, height: 160 }
        }))

        const finalPosition = NodePositioningService.findNonOverlappingPosition(
          position,
          existingNodes
        )

        get().addNode({ ...node, position: finalPosition })
      },

      // React Flow handlers
      handleNodesChange: (changes) =>
        set(
          (state) => ({
            nodes: applyNodeChanges(changes, state.nodes),
          }),
          false,
          'handleNodesChange'
        ),

      handleEdgesChange: (changes) =>
        set(
          (state) => ({
            edges: applyEdgeChanges(changes, state.edges),
          }),
          false,
          'handleEdgesChange'
        ),

      // Selectors
      getNodeById: (id) => get().nodes.find((node) => node.id === id),

      getNodesByType: (type) => get().nodes.filter((node) => node.type === type),

      getConnectedNodes: (nodeId) => {
        const { nodes, edges } = get()
        const incomingEdges = edges.filter((edge) => edge.target === nodeId)
        const outgoingEdges = edges.filter((edge) => edge.source === nodeId)

        return {
          incoming: incomingEdges
            .map((edge) => nodes.find((node) => node.id === edge.source))
            .filter(Boolean) as Node[],
          outgoing: outgoingEdges
            .map((edge) => nodes.find((node) => node.id === edge.target))
            .filter(Boolean) as Node[],
        }
      },

      getEdgesByNodeId: (nodeId) => {
        const { edges } = get()
        return {
          incoming: edges.filter((edge) => edge.target === nodeId),
          outgoing: edges.filter((edge) => edge.source === nodeId),
        }
      },

      // UI actions
      setSelectedNodes: (nodeIds) =>
        set(
          (state) => ({
            ui: { ...state.ui, selectedNodeIds: nodeIds },
          }),
          false,
          'setSelectedNodes'
        ),

      addToSelection: (nodeId) =>
        set(
          (state) => ({
            ui: {
              ...state.ui,
              selectedNodeIds: state.ui.selectedNodeIds.includes(nodeId)
                ? state.ui.selectedNodeIds
                : [...state.ui.selectedNodeIds, nodeId],
            },
          }),
          false,
          'addToSelection'
        ),

      removeFromSelection: (nodeId) =>
        set(
          (state) => ({
            ui: {
              ...state.ui,
              selectedNodeIds: state.ui.selectedNodeIds.filter((id) => id !== nodeId),
            },
          }),
          false,
          'removeFromSelection'
        ),

      clearSelection: () =>
        set(
          (state) => ({
            ui: { ...state.ui, selectedNodeIds: [] },
          }),
          false,
          'clearSelection'
        ),

      setViewportState: (viewport) =>
        set(
          (state) => ({
            ui: { ...state.ui, viewportState: viewport },
          }),
          false,
          'setViewportState'
        ),

      setSelectionMode: (enabled) =>
        set(
          (state) => ({
            ui: { ...state.ui, isSelectionMode: enabled },
          }),
          false,
          'setSelectionMode'
        ),

      // Bulk operations
      duplicateNodes: (nodeIds) => {
        const { nodes } = get()
        const nodesToDuplicate = nodes.filter((node) => nodeIds.includes(node.id))

        nodesToDuplicate.forEach((node, index) => {
          const newId = `${node.id}-copy-${Date.now()}-${index}`
          const targetPosition = {
            x: node.position.x + 50,
            y: node.position.y + 50,
          }

          // Check for collisions and find non-overlapping position
          const existingNodes = get().nodes.map((existingNode) => ({
            position: existingNode.position,
            dimensions: { width: 320, height: 160 }
          }))

          const finalPosition = NodePositioningService.findNonOverlappingPosition(
            targetPosition,
            existingNodes
          )

          get().addNode({
            ...node,
            id: newId,
            position: finalPosition,
          })
        })
      },

      deleteSelectedNodes: () => {
        const { ui } = get()
        ui.selectedNodeIds.forEach((nodeId) => {
          get().removeNode(nodeId)
        })
        get().clearSelection()
      },

      // Layout utilities
      arrangeNodesInGrid: (nodeIds) => {
        const { nodes } = get()
        const nodesToArrange = nodes.filter((node) => nodeIds.includes(node.id))

        nodesToArrange.forEach((node, index) => {
          const position = NodePositioningService.calculateGridPosition(index)
          get().updateNode(node.id, { position })
        })
      },

      autoLayoutNodes: () => {
        // Simple auto-layout: arrange all nodes in a grid
        const { nodes } = get()
        nodes.forEach((node, index) => {
          const position = NodePositioningService.calculateGridPosition(index)
          set(
            (state) => ({
              nodes: state.nodes.map((n) => (n.id === node.id ? { ...n, position } : n)),
            }),
            false,
            'autoLayoutNodes'
          )
        })
      },

      // Memory management
      cleanup: () =>
        set(
          {
            nodes: [
              {
                id: 'prompt',
                type: 'prompt',
                position: { x: 100, y: 200 },
                data: {},
              },
            ],
            edges: [],
            ui: {
              selectedNodeIds: [],
              viewportState: { x: 0, y: 0, zoom: 1 },
              isSelectionMode: false,
            },
          },
          false,
          'cleanup'
        ),

      pruneOldNodes: (maxAge) => {
        const cutoffTime = Date.now() - maxAge
        set(
          (state) => {
            const filteredNodes = state.nodes.filter((node) => {
              const nodeData = node.data as any
              const createdAt = nodeData?.createdAt || Date.now()
              return createdAt > cutoffTime
            })
            
            const validNodeIds = new Set(filteredNodes.map(n => n.id))
            const filteredEdges = state.edges.filter(
              edge => validNodeIds.has(edge.source) && validNodeIds.has(edge.target)
            )

            return {
              nodes: filteredNodes,
              edges: filteredEdges,
              ui: {
                ...state.ui,
                selectedNodeIds: state.ui.selectedNodeIds.filter(id => validNodeIds.has(id)),
              },
            }
          },
          false,
          'pruneOldNodes'
        )
      },

      limitNodeCount: (maxNodes) => {
        const { nodes } = get()
        if (nodes.length <= maxNodes) return

        const sortedNodes = [...nodes].sort((a, b) => {
          const aCreated = (a.data as any)?.createdAt || 0
          const bCreated = (b.data as any)?.createdAt || 0
          return bCreated - aCreated
        })

        const nodesToKeep = sortedNodes.slice(0, maxNodes)
        const validNodeIds = new Set(nodesToKeep.map(n => n.id))

        set(
          (state) => ({
            nodes: nodesToKeep,
            edges: state.edges.filter(
              edge => validNodeIds.has(edge.source) && validNodeIds.has(edge.target)
            ),
            ui: {
              ...state.ui,
              selectedNodeIds: state.ui.selectedNodeIds.filter(id => validNodeIds.has(id)),
            },
          }),
          false,
          'limitNodeCount'
        )
      },
    }),
    { name: 'flow-store' }
  )
)

// Reusable selectors for better performance
export const selectNodes = (state: FlowState) => state.nodes
export const selectEdges = (state: FlowState) => state.edges
export const selectSelectedNodeIds = (state: FlowState) => state.ui.selectedNodeIds
export const selectViewportState = (state: FlowState) => state.ui.viewportState
export const selectIsSelectionMode = (state: FlowState) => state.ui.isSelectionMode

export const selectNodeById = (id: string) => (state: FlowState) =>
  state.nodes.find((node) => node.id === id)

export const selectNodesByType = (type: string) => (state: FlowState) =>
  state.nodes.filter((node) => node.type === type)

export const selectSelectedNodes = (state: FlowState) =>
  state.nodes.filter((node) => state.ui.selectedNodeIds.includes(node.id))

// Derived selectors
export const selectNodeCount = (state: FlowState) => state.nodes.length
export const selectEdgeCount = (state: FlowState) => state.edges.length
export const selectSelectedNodeCount = (state: FlowState) => state.ui.selectedNodeIds.length

export const selectHasSelection = (state: FlowState) => state.ui.selectedNodeIds.length > 0
