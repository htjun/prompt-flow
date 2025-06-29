import { NodeTextInput } from '@/components/NodeTextInput'
import { usePromptStore } from '@/stores/promptStore'
import { useFlowActions } from '@/context/FlowActionsContext'
import { useNodeHandles } from '@/hooks/useNodeHandles'
import { HANDLE_IDS } from '@/constants/flowConstants'
import { enhancePrompt as enhancePromptAction } from '@/actions/enhancePrompt'

export const PromptNode = () => {
  const getBasicPrompt = usePromptStore((s) => s.getBasicPrompt)
  const setBasicPrompt = usePromptStore((s) => s.setBasicPrompt)
  const getEnhancedPrompt = usePromptStore((s) => s.getEnhancedPrompt)
  const setEnhancedPrompt = usePromptStore((s) => s.setEnhancedPrompt)
  const getOperationStatus = usePromptStore((s) => s.getOperationStatus)
  const setOperationStatus = usePromptStore((s) => s.setOperationStatus)

  const nodeId = 'prompt'
  const prompt = getBasicPrompt(nodeId)
  const enhancedPrompt = getEnhancedPrompt(nodeId)
  const operationStatus = getOperationStatus(nodeId)
  const isEnhancing = operationStatus === 'loading'
  const hasBeenEnhanced = enhancedPrompt !== ''

  const setPrompt = (text: string) => setBasicPrompt(nodeId, text)
  const { generateImage } = useFlowActions()

  const { renderSourceHandle } = useNodeHandles(nodeId)

  // Count words in the prompt
  const wordCount = prompt
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
  const isEnhanceDisabled = wordCount > 20

  const handleEnhance = async () => {
    if (!prompt.trim() || isEnhanceDisabled || isEnhancing) return

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
        setOperationStatus(nodeId, { status: 'error', error: 'Failed to enhance prompt' })
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

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    await generateImage(prompt, nodeId, 'generate')
  }

  const actions = hasBeenEnhanced
    ? [
        { label: 'Undo', onClick: handleUndo, isInternal: true },
        { label: 'Generate', onClick: handleGenerate },
      ]
    : [
        {
          label: 'Enhance',
          onClick: handleEnhance,
          isInternal: true,
          disabled: isEnhanceDisabled,
        },
        { label: 'Generate', onClick: handleGenerate },
      ]

  const actionLabels = actions.map((action) => action.label)

  return (
    <div className="flex flex-col gap-1">
      <NodeTextInput
        value={prompt}
        onChange={setPrompt}
        actions={actions}
        isLoading={isEnhancing}
      />

      {hasBeenEnhanced ? (
        <>
          {renderSourceHandle({
            handleId: HANDLE_IDS.GENERATE,
            actionLabels,
            actionIndex: 1,
          })}
        </>
      ) : (
        <>
          {renderSourceHandle({
            handleId: HANDLE_IDS.ENHANCE,
            actionLabels,
            actionIndex: 0,
          })}

          {renderSourceHandle({
            handleId: HANDLE_IDS.GENERATE,
            actionLabels,
            actionIndex: 1,
          })}
        </>
      )}
    </div>
  )
}
