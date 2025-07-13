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
  const getOperationStatus = usePromptStore((s) => s.getOperationStatus)
  const setOperationStatus = usePromptStore((s) => s.setOperationStatus)

  const nodeId = id
  const prompt = getBasicPrompt(nodeId)
  const operationStatus = getOperationStatus(nodeId)
  const isEnhancing = operationStatus === 'loading'
  const hasBeenEnhanced = operationStatus === 'success'

  const setPrompt = (text: string) => setBasicPrompt(nodeId, text)
  const { generateImage, atomizePrompt, segmentPrompt } = useFlowActions()

  const { renderSourceHandle, renderTargetHandle } = useNodeHandles(nodeId)

  // Count words in the prompt
  const wordCount = prompt
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
  const isPromptLongEnough = wordCount > 20

  const handleEnhance = async () => {
    if (!prompt.trim() || isPromptLongEnough || isEnhancing) return

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

  // Define action configurations
  const actionConfigs = {
    enhance: {
      label: 'Enhance',
      onClick: handleEnhance,
      isInternal: true,
      disabled: isPromptLongEnough,
    },
    parse: {
      label: 'Parse',
      dropdown: {
        items: [
          { label: 'Atomize', onClick: handleAtomize },
          { label: 'Segment', onClick: handleSegment },
        ],
      },
    },
    generate: { label: 'Generate', onClick: handleGenerate },
  }

  // Define state-based configurations
  type StateConfig = {
    actions: (keyof typeof actionConfigs)[]
    handles: Array<{ id: string; actionKey: keyof typeof actionConfigs }>
  }

  const stateConfigs: Record<string, StateConfig> = {
    enhanced: {
      actions: ['parse', 'generate'],
      handles: [
        { id: HANDLE_IDS.PARSE, actionKey: 'parse' },
        { id: HANDLE_IDS.GENERATE, actionKey: 'generate' },
      ],
    },
    longPrompt: {
      actions: ['parse', 'generate'],
      handles: [
        { id: HANDLE_IDS.PARSE, actionKey: 'parse' },
        { id: HANDLE_IDS.GENERATE, actionKey: 'generate' },
      ],
    },
    default: {
      actions: isRootNode ? ['enhance', 'generate'] : ['parse', 'generate'],
      handles: isRootNode
        ? [{ id: HANDLE_IDS.GENERATE, actionKey: 'generate' }]
        : [
            { id: HANDLE_IDS.PARSE, actionKey: 'parse' },
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
