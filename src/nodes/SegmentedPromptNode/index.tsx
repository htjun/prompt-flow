import { Handle, Position, useEdges } from '@xyflow/react'
import { z } from 'zod'
import { imageSegmentSchema } from '@/schema/imageSegmentSchema'
import { ActionGroup, type ActionItem } from '@/components/ActionGroup'
import { useState, useEffect, useRef } from 'react'
import { cn, calculateHandleOffset } from '@/lib/utils'
import { useFlowActions } from '@/context/FlowActionsContext'
import { isHandleConnected } from '@/lib/flowHelpers'
import { HANDLE_IDS } from '@/constants/flowConstants'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

type SegmentedPrompt = z.infer<typeof imageSegmentSchema>

const SegmentInput = ({
  segment,
  index,
  handleSegmentTextChange,
}: {
  segment: SegmentedPrompt['prompts'][0]
  index: number
  handleSegmentTextChange: (index: number, newText: string) => void
}) => {
  const [isTextareaLarge, setIsTextareaLarge] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const checkHeight = () => {
      setIsTextareaLarge(textarea.offsetHeight > 40)
    }

    checkHeight()

    const resizeObserver = new ResizeObserver(checkHeight)
    resizeObserver.observe(textarea)

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <div className="relative">
      <span
        ref={(el) => {
          if (el && el.offsetWidth > 0) {
            const textarea = el.parentElement?.querySelector('textarea')
            if (textarea) {
              textarea.style.textIndent = `${el.offsetWidth - 4}px`
            }
          }
        }}
        className="absolute top-0 left-0 z-1"
      >
        <Badge
          variant="outline"
          className={cn(
            'rounded-none rounded-tl-md rounded-br-md bg-neutral-50 px-2 py-1 text-xs font-medium text-neutral-500',
            isTextareaLarge ? 'h-full' : ''
          )}
        >
          {segment.category}
        </Badge>
      </span>
      <Textarea
        ref={textareaRef}
        value={segment.text}
        onChange={(e) => handleSegmentTextChange(index, e.target.value)}
        className="min-h-8 resize-none text-sm"
        placeholder="Enter description..."
      />
    </div>
  )
}

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
          <div className="nodrag flex flex-1 flex-col gap-3 overflow-y-auto p-2">
            {isLoading ? (
              <div className="my-auto self-center text-sm text-gray-400">Segmenting prompt...</div>
            ) : currentData && currentData.prompts && currentData.prompts.length > 0 ? (
              currentData.prompts.map((segment, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <SegmentInput
                    segment={segment}
                    index={index}
                    handleSegmentTextChange={handleSegmentTextChange}
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
