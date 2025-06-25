import { Position, Handle, useEdges, NodeProps } from '@xyflow/react'
import { NodeTextInput } from '@/components/NodeTextInput'
import { cn } from '@/lib/utils'
import { usePromptStore } from '@/stores/promptStore'
import { useFlowActions } from '@/context/FlowActionsContext'
import { isHandleConnected } from '@/lib/flowHelpers'

const NODE_LABEL = 'Prompt'

export const EnhancedPromptNode = ({ id }: NodeProps) => {
  const getEnhancedPrompt = usePromptStore((s) => s.getEnhancedPrompt)
  const setEnhancedPrompt = usePromptStore((s) => s.setEnhancedPrompt)
  const getOperationStatus = usePromptStore((s) => s.getOperationStatus)
  const { structurePrompt, generateImage, isStructuring } = useFlowActions()
  const edges = useEdges()

  // Get the specific enhanced prompt for this node
  const nodeId = id
  const enhancedPrompt = getEnhancedPrompt(nodeId)
  const operationStatus = getOperationStatus(nodeId)

  // Check if the target handle is connected to any node
  const isTargetHandleConnected = isHandleConnected(edges, nodeId, 'image-input', 'target')

  // Check if the structure handle is connected to any node
  const isStructureHandleConnected = isHandleConnected(edges, nodeId, 'structure', 'source')

  // Check if the generate handle is connected to any node
  const isGenerateHandleConnected = isHandleConnected(edges, nodeId, 'generate', 'source')

  const handleStructure = async () => {
    if (!enhancedPrompt.trim() || isStructuring) return
    await structurePrompt(enhancedPrompt, nodeId)
  }

  const handleGenerate = async () => {
    if (!enhancedPrompt.trim()) return
    await generateImage(enhancedPrompt, nodeId, 'generate')
  }

  const handleChange = (value: string) => {
    setEnhancedPrompt(nodeId, value)
  }

  return (
    <>
      <NodeTextInput
        label={NODE_LABEL}
        value={enhancedPrompt}
        onChange={handleChange}
        actions={[
          { label: 'Structure', onClick: handleStructure },
          { label: 'Generate', onClick: handleGenerate },
        ]}
        hasOutputHandle={false}
        isLoading={operationStatus === 'loading'}
        loadingMessage="Enhancing prompt..."
      />

      <Handle
        type="target"
        position={Position.Left}
        className={cn(
          'transition-opacity duration-200',
          isTargetHandleConnected ? 'opacity-100' : 'opacity-0'
        )}
      />
      <Handle
        type="source"
        id="structure"
        position={Position.Bottom}
        className={cn(
          'right-[110px] !left-auto transition-opacity duration-200',
          isStructureHandleConnected ? 'opacity-100' : 'opacity-0'
        )}
      />
      <Handle
        type="source"
        id="generate"
        position={Position.Bottom}
        className={cn(
          'right-[36px] !left-auto transition-opacity duration-200',
          isGenerateHandleConnected ? 'opacity-100' : 'opacity-0'
        )}
      />
    </>
  )
}
