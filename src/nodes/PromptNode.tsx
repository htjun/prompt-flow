import { type NodeProps } from '@xyflow/react'
import { NodeTextInput } from '@/components/NodeTextInput'
import { type ActionItem } from '@/components/ActionGroup'
import { usePromptStore } from '@/stores/promptStore'
import { useFlowActions } from '@/context/FlowActionsContext'
import { useNodeHandles } from '@/hooks/useNodeHandles'
import { HANDLE_IDS } from '@/constants/flowConstants'
import { enhancePrompt as enhancePromptAction } from '@/actions/enhancePrompt'

export const PromptNode = ({ id = 'prompt' }: Partial<NodeProps>) => {
  const getBasicPrompt = usePromptStore((s) => s.getBasicPrompt)
  const setBasicPrompt = usePromptStore((s) => s.setBasicPrompt)
  const getEnhancedPrompt = usePromptStore((s) => s.getEnhancedPrompt)
  const setEnhancedPrompt = usePromptStore((s) => s.setEnhancedPrompt)
  const getOperationStatus = usePromptStore((s) => s.getOperationStatus)
  const setOperationStatus = usePromptStore((s) => s.setOperationStatus)

  const nodeId = id
  const prompt = getBasicPrompt(nodeId)
  const enhancedPrompt = getEnhancedPrompt(nodeId)
  const operationStatus = getOperationStatus(nodeId)
  const isEnhancing = operationStatus === 'loading'
  const hasBeenEnhanced = enhancedPrompt !== ''

  const setPrompt = (text: string) => setBasicPrompt(nodeId, text)
  const { generateImage, structurePrompt } = useFlowActions()

  const { renderSourceHandle, renderTargetHandle } = useNodeHandles(nodeId)

  // Count words in the prompt
  const wordCount = prompt
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
  const isPromptLongEnough = wordCount > 20

  const handleEnhance = async () => {
    if (!prompt.trim() || isPromptLongEnough || isEnhancing) return

    // Store the original prompt before enhancement
    setEnhancedPrompt(nodeId, prompt)
    setOperationStatus(nodeId, { status: 'loading' })

    try {
      const enhancedText = await enhancePromptAction(prompt)
      if (enhancedText) {
        setBasicPrompt(nodeId, enhancedText)
        setOperationStatus(nodeId, { status: 'success' })
      } else {
        // Restore on failure
        setEnhancedPrompt(nodeId, '')
        setOperationStatus(nodeId, {
          status: 'error',
          error: 'Failed to enhance prompt',
        })
      }
    } catch (error) {
      // Restore on error
      setEnhancedPrompt(nodeId, '')
      setOperationStatus(nodeId, {
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to enhance prompt',
      })
    }
  }

  const handleUndo = () => {
    if (!hasBeenEnhanced) return

    // Swap the prompts back
    const originalPrompt = enhancedPrompt
    setBasicPrompt(nodeId, originalPrompt)

    // Clear the enhanced prompt and operation status
    setEnhancedPrompt(nodeId, '')
    setOperationStatus(nodeId, { status: 'idle' })
  }

  const handleStructure = async () => {
    if (!prompt.trim()) return
    await structurePrompt(prompt, nodeId)
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    await generateImage(prompt, nodeId, 'generate')
  }

  // Check if this is the root prompt node
  const isRootNode = nodeId === 'prompt'

  // Define action configurations
  const actionConfigs = {
    undo: { label: 'Undo', onClick: handleUndo, isInternal: true },
    enhance: {
      label: 'Enhance',
      onClick: handleEnhance,
      isInternal: true,
      disabled: isPromptLongEnough,
    },
    structure: { label: 'Structure', onClick: handleStructure },
    generate: { label: 'Generate', onClick: handleGenerate },
  }

  // Define state-based configurations
  type StateConfig = {
    actions: (keyof typeof actionConfigs)[]
    handles: Array<{ id: string; actionKey: keyof typeof actionConfigs }>
  }

  const stateConfigs: Record<string, StateConfig> = {
    enhanced: {
      actions: ['undo', 'structure', 'generate'],
      handles: [
        { id: HANDLE_IDS.STRUCTURE, actionKey: 'structure' },
        { id: HANDLE_IDS.GENERATE, actionKey: 'generate' },
      ],
    },
    longPrompt: {
      actions: ['structure', 'generate'],
      handles: [
        { id: HANDLE_IDS.STRUCTURE, actionKey: 'structure' },
        { id: HANDLE_IDS.GENERATE, actionKey: 'generate' },
      ],
    },
    default: {
      actions: isRootNode ? ['enhance', 'generate'] : ['structure', 'generate'],
      handles: isRootNode
        ? [{ id: HANDLE_IDS.GENERATE, actionKey: 'generate' }]
        : [
            { id: HANDLE_IDS.STRUCTURE, actionKey: 'structure' },
            { id: HANDLE_IDS.GENERATE, actionKey: 'generate' },
          ],
    },
  }

  // Determine current state
  const currentState = hasBeenEnhanced ? 'enhanced' : isPromptLongEnough ? 'longPrompt' : 'default'

  const config = stateConfigs[currentState]

  // Build actions from config
  const actions: ActionItem[] = config.actions.map((key) => actionConfigs[key])
  const actionLabels = actions.map((action) => action.label)

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
      <NodeTextInput
        value={prompt}
        onChange={setPrompt}
        actions={actions}
        isLoading={isEnhancing}
      />

      {/* Render target handle for non-root nodes */}
      {!isRootNode &&
        renderTargetHandle({
          handleId: HANDLE_IDS.PROMPT_INPUT,
        })}

      {handles}
    </div>
  )
}
