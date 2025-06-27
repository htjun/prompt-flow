import { NodeTextInput } from '@/components/NodeTextInput'
import { usePromptStore } from '@/stores/promptStore'
import { useFlowActions } from '@/context/FlowActionsContext'
import { useNodeHandles } from '@/hooks/useNodeHandles'
import { HANDLE_IDS } from '@/constants/flowConstants'

export const PromptNode = () => {
  const getBasicPrompt = usePromptStore((s) => s.getBasicPrompt)
  const setBasicPrompt = usePromptStore((s) => s.setBasicPrompt)

  // Use the prompt node's specific prompt
  const prompt = getBasicPrompt('prompt')
  const setPrompt = (text: string) => setBasicPrompt('prompt', text)
  const { enhancePrompt, generateImage } = useFlowActions()

  // Use the new hook
  const { renderSourceHandle } = useNodeHandles('prompt')

  const handleEnhance = async () => {
    if (!prompt.trim()) return
    await enhancePrompt(prompt, 'prompt')
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    await generateImage(prompt, 'prompt', 'generate')
  }

  // Define action labels for handle positioning
  const actionLabels = ['Enhance', 'Generate']

  return (
    <div className="flex flex-col gap-1">
      <NodeTextInput
        value={prompt}
        onChange={setPrompt}
        actions={[
          { label: 'Enhance', onClick: handleEnhance },
          { label: 'Generate', onClick: handleGenerate },
        ]}
      />

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
