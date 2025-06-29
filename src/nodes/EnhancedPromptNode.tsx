import { type NodeProps } from '@xyflow/react'
import { NodeTextInput } from '@/components/NodeTextInput'
import { usePromptStore } from '@/stores/promptStore'
import { useFlowActions } from '@/context/FlowActionsContext'
import { useNodeHandles } from '@/hooks/useNodeHandles'
import { HANDLE_IDS } from '@/constants/flowConstants'

const NODE_LABEL = 'Prompt'

export const EnhancedPromptNode = ({ id }: NodeProps) => {
  const getEnhancedPrompt = usePromptStore((s) => s.getEnhancedPrompt)
  const setEnhancedPrompt = usePromptStore((s) => s.setEnhancedPrompt)
  const getOperationStatus = usePromptStore((s) => s.getOperationStatus)
  const { structurePrompt, generateImage, isStructuring } = useFlowActions()

  const { renderSourceHandle, renderTargetHandle } = useNodeHandles(id)

  const nodeId = id
  const enhancedPrompt = getEnhancedPrompt(nodeId)
  const operationStatus = getOperationStatus(nodeId)

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

  const actions = [
    { label: 'Structure', onClick: handleStructure },
    { label: 'Generate', onClick: handleGenerate },
  ]

  const actionLabels = actions.map((action) => action.label)

  return (
    <>
      <NodeTextInput
        label={NODE_LABEL}
        value={enhancedPrompt}
        onChange={handleChange}
        actions={actions}
        isLoading={operationStatus === 'loading'}
      />

      {renderTargetHandle({
        handleId: HANDLE_IDS.PROMPT_INPUT,
      })}

      {renderSourceHandle({
        handleId: HANDLE_IDS.STRUCTURE,
        actionLabels,
        actionIndex: 0,
      })}

      {renderSourceHandle({
        handleId: HANDLE_IDS.GENERATE,
        actionLabels,
        actionIndex: 1,
      })}
    </>
  )
}
