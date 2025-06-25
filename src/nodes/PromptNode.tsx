import { NodeTextInput } from '@/components/NodeTextInput'
import { cn } from '@/lib/utils'
import { Position, Handle, useEdges } from '@xyflow/react'
import { usePromptStore } from '@/stores/promptStore'
import { useFlowActions } from '@/context/FlowActionsContext'
import { isHandleConnected } from '@/lib/flowHelpers'

export const PromptNode = () => {
  const getBasicPrompt = usePromptStore((s) => s.getBasicPrompt)
  const setBasicPrompt = usePromptStore((s) => s.setBasicPrompt)
  
  // Use the prompt node's specific prompt
  const prompt = getBasicPrompt('prompt')
  const setPrompt = (text: string) => setBasicPrompt('prompt', text)
  const { enhancePrompt, generateImage } = useFlowActions()
  const edges = useEdges()

  // Check if the enhance handle is connected to any node
  const isEnhanceHandleConnected = isHandleConnected(edges, 'prompt', 'enhance', 'source')

  // Check if the generate handle is connected to any node
  const isGenerateHandleConnected = isHandleConnected(edges, 'prompt', 'generate', 'source')

  const handleEnhance = async () => {
    if (!prompt.trim()) return
    await enhancePrompt(prompt, 'prompt')
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    await generateImage(prompt, 'prompt', 'generate')
  }

  return (
    <div className="flex flex-col gap-1">
      <NodeTextInput
        value={prompt}
        onChange={setPrompt}
        hasOutputHandle={false}
        actions={[
          { label: 'Enhance', onClick: handleEnhance },
          { label: 'Generate', onClick: handleGenerate },
        ]}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        id="enhance"
        className={cn(
          'right-[107px] !left-auto transition-opacity duration-200',
          isEnhanceHandleConnected ? 'opacity-100' : 'opacity-0'
        )}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="generate"
        className={cn(
          'right-[36px] !left-auto transition-opacity duration-200',
          isGenerateHandleConnected ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  )
}
