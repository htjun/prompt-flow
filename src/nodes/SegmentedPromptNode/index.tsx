import { Handle, Position, useEdges } from '@xyflow/react'
import { z } from 'zod'
import { imageSegmentSchema } from '@/schema/imageSegmentSchema'
import { ActionGroup, type ActionItem } from '@/components/ActionGroup'
import { useState, useEffect } from 'react'
import { cn, calculateHandleOffset } from '@/lib/utils'
import { useFlowActions } from '@/context/FlowActionsContext'
import { isHandleConnected } from '@/lib/flowHelpers'
import { HANDLE_IDS } from '@/constants/flowConstants'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

type SegmentedPrompt = z.infer<typeof imageSegmentSchema>

type SegmentedPromptNodeProps = {
  data: {
    nodeId: string
    object: SegmentedPrompt
    isLoading?: boolean
    usage?: {
      promptTokens: number
      completionTokens: number
      totalTokens: number
    }
  }
  isProcessing?: boolean
}

const categoryColors: Record<string, string> = {
  scene: 'bg-blue-100 text-blue-800 border-blue-200',
  style: 'bg-purple-100 text-purple-800 border-purple-200',
  composition: 'bg-green-100 text-green-800 border-green-200',
  camera: 'bg-orange-100 text-orange-800 border-orange-200',
  lighting: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  color: 'bg-pink-100 text-pink-800 border-pink-200',
  mood: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  texture: 'bg-gray-100 text-gray-800 border-gray-200',
  misc: 'bg-slate-100 text-slate-800 border-slate-200',
}

export const SegmentedPromptNode = ({
  data,
  isProcessing: externalIsProcessing = false,
}: SegmentedPromptNodeProps) => {
  const { nodeId, object: initialSegmentedPromptObject, isLoading = false } = data
  const [currentData, setCurrentData] = useState<SegmentedPrompt>(initialSegmentedPromptObject)

  useEffect(() => {
    setCurrentData(initialSegmentedPromptObject)
  }, [initialSegmentedPromptObject])

  const { generateImage, duplicateSegmentedPrompt } = useFlowActions()
  const edges = useEdges()

  const isDuplicateHandleConnected = isHandleConnected(
    edges,
    nodeId,
    HANDLE_IDS.DUPLICATE,
    'source'
  )

  const isGenerateHandleConnected = isHandleConnected(edges, nodeId, HANDLE_IDS.GENERATE, 'source')

  const handleDataChange = (newData: SegmentedPrompt) => {
    setCurrentData(newData)
  }

  const handleSegmentTextChange = (index: number, newText: string) => {
    const updatedData = {
      ...currentData,
      prompts: currentData.prompts.map((prompt, i) =>
        i === index ? { ...prompt, text: newText } : prompt
      ),
    }
    handleDataChange(updatedData)
  }

  const handleDuplicate = () => {
    if (duplicateSegmentedPrompt) {
      duplicateSegmentedPrompt(nodeId, currentData)
    }
  }

  const handleGenerate = async () => {
    if (!currentData || !currentData.prompts || currentData.prompts.length === 0) {
      return
    }
    // Combine all segment texts into a single prompt
    const combinedPrompt = currentData.prompts.map((p) => p.text).join(', ')
    await generateImage(combinedPrompt, nodeId, 'generate')
  }

  const duplicateAction: ActionItem = {
    label: 'Duplicate',
    onClick: handleDuplicate,
    disabled: !currentData || !currentData.prompts || currentData.prompts.length === 0,
  }

  const generateAction: ActionItem = {
    label: 'Generate',
    onClick: handleGenerate,
    disabled: !currentData || !currentData.prompts || currentData.prompts.length === 0,
  }

  const allActions = [duplicateAction, generateAction]

  // Define action labels for handle positioning
  const actionLabels = ['Duplicate', 'Generate']

  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="node-label geist-mono">Segmented Prompt</div>
        <div className="node-container nodrag flex min-h-80 w-md flex-col items-stretch justify-between">
          <div className="nodrag flex max-h-96 flex-1 flex-col gap-3 overflow-y-auto p-2">
            {isLoading ? (
              <div className="my-auto self-center text-sm text-gray-400">Segmenting prompt...</div>
            ) : currentData && currentData.prompts && currentData.prompts.length > 0 ? (
              currentData.prompts.map((segment, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium capitalize ${categoryColors[segment.category] || categoryColors.misc}`}
                    >
                      {segment.category}
                    </Badge>
                  </div>
                  <Textarea
                    value={segment.text}
                    onChange={(e) => handleSegmentTextChange(index, e.target.value)}
                    className="min-h-[60px] resize-none text-sm"
                    placeholder={`Enter ${segment.category} description...`}
                  />
                </div>
              ))
            ) : (
              <div className="my-auto self-center text-sm text-gray-400">No segments available</div>
            )}
          </div>
          <ActionGroup
            actions={allActions}
            isProcessing={externalIsProcessing}
            isDisabled={
              externalIsProcessing ||
              !currentData ||
              !currentData.prompts ||
              currentData.prompts.length === 0
            }
          />
        </div>
        <Handle type="target" position={Position.Left} id={HANDLE_IDS.PROMPT_INPUT} />
        <Handle
          type="source"
          id={HANDLE_IDS.DUPLICATE}
          position={Position.Bottom}
          className={cn(
            '!left-auto transition-opacity duration-200',
            isDuplicateHandleConnected ? 'opacity-100' : 'opacity-0'
          )}
          style={calculateHandleOffset(actionLabels, 0)}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id={HANDLE_IDS.GENERATE}
          className={cn(
            '!left-auto transition-opacity duration-200',
            isGenerateHandleConnected ? 'opacity-100' : 'opacity-0'
          )}
          style={{ ...calculateHandleOffset(actionLabels, 1), background: '#555' }}
        />
      </div>
    </>
  )
}
