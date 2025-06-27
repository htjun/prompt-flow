import { NodeTextInput } from '@/components/NodeTextInput'
import { usePromptStore } from '@/stores/promptStore'
import { useFlowActions } from '@/context/FlowActionsContext'
import { useNodeHandles } from '@/hooks/useNodeHandles'
import { HANDLE_IDS } from '@/constants/flowConstants'

export const PromptNode = () => {
  const getBasicPrompt = usePromptStore((s) => s.getBasicPrompt)
  const setBasicPrompt = usePromptStore((s) => s.setBasicPrompt)

  const prompt = getBasicPrompt('prompt')
  const setPrompt = (text: string) => setBasicPrompt('prompt', text)
  const { enhancePrompt, generateImage } = useFlowActions()

  const { renderSourceHandle } = useNodeHandles('prompt')

  const handleEnhance = async () => {
    if (!prompt.trim()) return
    await enhancePrompt(prompt, 'prompt')
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    await generateImage(prompt, 'prompt', 'generate')
  }

  const actions = [
    { label: 'Enhance', onClick: handleEnhance },
    { label: 'Generate', onClick: handleGenerate },
  ]

  const actionLabels = actions.map((action) => action.label)

  return (
    <div className="flex flex-col gap-1">
      <NodeTextInput value={prompt} onChange={setPrompt} actions={actions} />

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
    </div>
  )
}
