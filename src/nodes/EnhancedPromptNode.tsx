import { Position, Handle, useEdges, NodeProps } from '@xyflow/react'
import { NodeTextInput } from '@/components/NodeTextInput'
import { cn, calculateHandleOffset } from '@/lib/utils'
import { usePromptStore } from '@/stores/promptStore'
import { useFlowActions } from '@/context/FlowActionsContext'
import { isHandleConnected } from '@/lib/flowHelpers'
import { HANDLE_IDS } from '@/constants/flowConstants'

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
  const isTargetHandleConnected = isHandleConnected(
    edges,
    nodeId,
    HANDLE_IDS.PROMPT_INPUT,
    'target'
  )

  // Check if the structure handle is connected to any node
  const isStructureHandleConnected = isHandleConnected(
    edges,
    nodeId,
    HANDLE_IDS.STRUCTURE,
    'source'
  )

  // Check if the generate handle is connected to any node
  const isGenerateHandleConnected = isHandleConnected(edges, nodeId, HANDLE_IDS.GENERATE, 'source')

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

  // Define action labels for handle positioning
  const actionLabels = ['Structure', 'Generate']

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

      <Handle type="target" position={Position.Left} id={HANDLE_IDS.PROMPT_INPUT} />
      <Handle
        type="source"
        id={HANDLE_IDS.STRUCTURE}
        position={Position.Bottom}
        className={cn(
          '!left-auto transition-opacity duration-200',
          isStructureHandleConnected ? 'opacity-100' : 'opacity-0'
        )}
        style={calculateHandleOffset(actionLabels, 0)}
      />
      <Handle
        type="source"
        id={HANDLE_IDS.GENERATE}
        position={Position.Bottom}
        className={cn(
          '!left-auto transition-opacity duration-200',
          isGenerateHandleConnected ? 'opacity-100' : 'opacity-0'
        )}
        style={calculateHandleOffset(actionLabels, 1)}
      />
    </>
  )
}
