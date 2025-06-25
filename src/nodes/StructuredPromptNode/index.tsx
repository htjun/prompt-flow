import { Handle, Position, useEdges } from '@xyflow/react'
import { z } from 'zod'
import { imageStructureSchema } from '@/schema/imageStructure'
import { ActionGroup, type ActionItem } from '@/components/ActionGroup'
import { useState, useEffect } from 'react'
import { cn, calculateHandleOffset } from '@/lib/utils'
import { useFlowActions } from '@/context/FlowActionsContext'
import { isHandleConnected } from '@/lib/flowHelpers'
import { PromptCategoryTabs } from './PromptCategoryTabs'
import { HANDLE_IDS } from '@/constants/flowConstants'

type ImageStructure = z.infer<typeof imageStructureSchema>

type StructuredPromptNodeProps = {
  data: {
    nodeId: string
    object: ImageStructure
    isLoading?: boolean
    usage?: {
      promptTokens: number
      completionTokens: number
      totalTokens: number
    }
  }
  isProcessing?: boolean
}

export const StructuredPromptNode = ({
  data,
  isProcessing: externalIsProcessing = false,
}: StructuredPromptNodeProps) => {
  const { nodeId, object: initialStructuredPromptObject, isLoading = false } = data
  const [currentData, setCurrentData] = useState<ImageStructure>(initialStructuredPromptObject)

  useEffect(() => {
    setCurrentData(initialStructuredPromptObject)
  }, [initialStructuredPromptObject])

  const { generateImage, duplicateStructuredPrompt } = useFlowActions()
  const edges = useEdges()

  const isDuplicateHandleConnected = isHandleConnected(
    edges,
    nodeId,
    HANDLE_IDS.DUPLICATE,
    'source'
  )

  const isGenerateHandleConnected = isHandleConnected(edges, nodeId, HANDLE_IDS.GENERATE, 'source')

  const handleDataChange = (newData: ImageStructure) => {
    setCurrentData(newData)
  }

  const handleDuplicate = () => {
    duplicateStructuredPrompt(nodeId, currentData)
  }

  const handleGenerate = async () => {
    if (!currentData || Object.keys(currentData).length === 0) {
      return
    }
    const promptText = JSON.stringify(currentData)
    await generateImage(promptText, nodeId, 'generate')
  }

  const duplicateAction: ActionItem = {
    label: 'Duplicate',
    onClick: handleDuplicate,
    disabled: !currentData || Object.keys(currentData).length === 0,
  }

  const generateAction: ActionItem = {
    label: 'Generate',
    onClick: handleGenerate,
    disabled: !currentData || Object.keys(currentData).length === 0,
  }

  const allActions = [duplicateAction, generateAction]

  // Define action labels for handle positioning
  const actionLabels = ['Duplicate', 'Generate']

  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="node-label geist-mono">Structured Prompt</div>
        <div className="node-container nodrag flex min-h-80 w-md flex-col items-stretch justify-between">
          <div className="nodrag flex flex-1 flex-col p-2">
            {isLoading ? (
              <div className="my-auto self-center text-sm text-gray-400">Structuring prompt...</div>
            ) : currentData && Object.keys(currentData).length > 0 ? (
              <PromptCategoryTabs data={currentData} onDataChange={handleDataChange} />
            ) : (
              <div className="my-auto self-center text-sm text-gray-400">No data available</div>
            )}
          </div>
          <ActionGroup
            actions={allActions}
            isProcessing={externalIsProcessing}
            isDisabled={
              externalIsProcessing || !currentData || Object.keys(currentData).length === 0
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
