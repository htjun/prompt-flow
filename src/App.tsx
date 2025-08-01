import { ReactFlow, Background, Panel } from '@xyflow/react'
import { nodeTypes } from '@/nodes'
import { useFlowControls } from '@/hooks/useFlowControls'
import { FlowActionsProvider } from '@/context/FlowActionsContext'
import ActionPanel from '@/components/ActionPanel'
import MenuPanel from '@/components/MenuPanel'

export default function App() {
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
          <Background bgColor="#fcfcfd" />
          <Panel position="top-left">
            <MenuPanel />
          </Panel>
          <Panel position="top-right">
            <ActionPanel />
          </Panel>
        </ReactFlow>
      </FlowActionsProvider>
    </div>
  )
}
