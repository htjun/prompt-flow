'use client'

import { ReactFlow, Background, Controls } from '@xyflow/react'
import { nodeTypes } from '@/nodes'
import { useFlowControls } from '@/hooks/useFlowControls'
import { FlowActionsProvider } from '@/context/FlowActionsContext'
import { Header } from '@/components/Header'

export default function HomePage() {
  const { nodes, edges, handleNodesChange, handleEdgesChange, onConnect } = useFlowControls()

  return (
    <div className="relative h-screen w-screen">
      <FlowActionsProvider>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={edges}
          onConnect={onConnect}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          snapToGrid={true}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </FlowActionsProvider>
    </div>
  )
}
