import { type NodeProps } from '@xyflow/react'
import { NodeTextInput } from '@/components/NodeTextInput'
import { ActionButton, ActionDropdown, ActionDropdownItem } from '@/components/ActionGroup'
import { usePromptStore } from '@/stores/promptStore'
import { useFlowActions } from '@/context/FlowActionsContext'
import { useNodeHandles } from '@/hooks/useNodeHandles'
import { HANDLE_IDS } from '@/constants/flowConstants'
import { enhancePrompt as enhancePromptAction } from '@/actions/enhancePrompt'
import SettingsDropdown from '@/components/SettingsDropdown/SettingsDropdown'

export const PromptNode = ({ id = 'prompt' }: Partial<NodeProps>) => {
  const getBasicPrompt = usePromptStore((s) => s.getBasicPrompt)
  const setBasicPrompt = usePromptStore((s) => s.setBasicPrompt)
  const getOperationStatus = usePromptStore((s) => s.getOperationStatus)
  const setOperationStatus = usePromptStore((s) => s.setOperationStatus)

  const nodeId = id
  const prompt = getBasicPrompt(nodeId)
  const operationStatus = getOperationStatus(nodeId)
  const isEnhancing = operationStatus === 'loading'

  const setPrompt = (text: string) => setBasicPrompt(nodeId, text)
  const { generateImage, atomizePrompt, segmentPrompt } = useFlowActions()

  const { renderSourceHandle, renderTargetHandle } = useNodeHandles(nodeId)

  const handleEnhance = async () => {
    if (!prompt.trim() || isEnhancing) return

    setOperationStatus(nodeId, { status: 'loading' })

    try {
      const enhancedText = await enhancePromptAction(prompt)
      if (enhancedText) {
        setBasicPrompt(nodeId, enhancedText)
        setOperationStatus(nodeId, { status: 'success' })
      } else {
        setOperationStatus(nodeId, {
          status: 'error',
          error: 'Failed to enhance prompt',
        })
      }
    } catch (error) {
      setOperationStatus(nodeId, {
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to enhance prompt',
      })
    }
  }

  const handleAtomize = async () => {
    if (!prompt.trim()) return
    await atomizePrompt(prompt, nodeId)
  }

  const handleSegment = async () => {
    if (!prompt.trim()) return
    await segmentPrompt(prompt, nodeId)
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    await generateImage(prompt, nodeId, 'generate')
  }

  // Check if this is the root prompt node
  const isRootNode = nodeId === 'prompt'

  // Define configuration - always show Format and Generate
  const config = {
    actions: ['format', 'generate'] as const,
    handles: [
      { id: HANDLE_IDS.FORMAT, actionKey: 'format' as const },
      { id: HANDLE_IDS.GENERATE, actionKey: 'generate' as const },
    ],
  }

  const actionLabels = ['Format', 'Generate']

  // Render handles from config
  const handles = config.handles.map(({ id, actionKey }) =>
    renderSourceHandle({
      handleId: id,
      actionLabels,
      actionIndex: config.actions.indexOf(actionKey),
    })
  )

  return (
    <div className="flex flex-col gap-1">
      <NodeTextInput value={prompt} onChange={setPrompt} isLoading={isEnhancing}>
        <SettingsDropdown nodeId={nodeId} />
        <div className="flex items-center">
          <ActionDropdown label="Format">
            <ActionDropdownItem onClick={handleEnhance}>Enhance</ActionDropdownItem>
            <ActionDropdownItem onClick={handleAtomize}>Atomize</ActionDropdownItem>
            <ActionDropdownItem onClick={handleSegment}>Segment</ActionDropdownItem>
          </ActionDropdown>
          <ActionButton onClick={handleGenerate}>Generate</ActionButton>
        </div>
      </NodeTextInput>

      {/* Render target handle for non-root nodes */}
      {!isRootNode &&
        renderTargetHandle({
          handleId: HANDLE_IDS.PROMPT_INPUT,
        })}

      {handles}
    </div>
  )
}
