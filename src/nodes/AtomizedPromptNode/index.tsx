import { Handle, Position, useEdges } from '@xyflow/react'
import { z } from 'zod'
import { imageAtomizationSchema } from '@/schema/imageAtomizationSchema'
import { ActionGroup, ActionButton } from '@/components/ActionGroup'
import { useState, useEffect } from 'react'
import { cn, calculateHandleOffset } from '@/lib/utils'
import { useFlowActions } from '@/context/FlowActionsContext'
import { isHandleConnected } from '@/lib/flowHelpers'
import { PromptCategoryTabs } from './PromptCategoryTabs'
import { HANDLE_IDS } from '@/constants/flowConstants'
import SettingsDropdown from '@/components/SettingsDropdown'

type ImageAtomization = z.infer<typeof imageAtomizationSchema>

type AtomizedPromptNodeProps = {
  data: {
    nodeId: string
    object: ImageAtomization
    isLoading?: boolean
    usage?: {
      promptTokens: number
      completionTokens: number
      totalTokens: number
    }
  }
  isProcessing?: boolean
}

export const AtomizedPromptNode = ({
  data,
  isProcessing: externalIsProcessing = false,
}: AtomizedPromptNodeProps) => {
  const { nodeId, object: initialAtomizedPromptObject, isLoading = false } = data
  const [currentData, setCurrentData] = useState<ImageAtomization>(initialAtomizedPromptObject)

  useEffect(() => {
    setCurrentData(initialAtomizedPromptObject)
  }, [initialAtomizedPromptObject])

  const { generateImage, duplicateAtomizedPrompt } = useFlowActions()
  const edges = useEdges()

  const isDuplicateHandleConnected = isHandleConnected(
    edges,
    nodeId,
    HANDLE_IDS.DUPLICATE,
    'source'
  )

  const isGenerateHandleConnected = isHandleConnected(edges, nodeId, HANDLE_IDS.GENERATE, 'source')

  const handleDataChange = (newData: ImageAtomization) => {
    setCurrentData(newData)
  }

  const handleDuplicate = () => {
    duplicateAtomizedPrompt(nodeId, currentData)
  }

  const handleGenerate = async () => {
    if (!currentData || Object.keys(currentData).length === 0) {
      return
    }
    const promptText = JSON.stringify(currentData)
    await generateImage(promptText, nodeId, 'generate')
  }

  // Define action labels for handle positioning
  const actionLabels = ['Duplicate', 'Generate']

  const isDisabled = !currentData || Object.keys(currentData).length === 0

  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="node-label geist-mono">Atomized Prompt</div>
        <div className="node-container nodrag flex min-h-80 w-md flex-col items-stretch justify-between">
          <div className="nodrag flex flex-1 flex-col p-2">
            {isLoading ? (
              <div className="my-auto self-center text-sm text-gray-400">Atomizing prompt...</div>
            ) : currentData && Object.keys(currentData).length > 0 ? (
              <PromptCategoryTabs data={currentData} onDataChange={handleDataChange} />
            ) : (
              <div className="my-auto self-center text-sm text-gray-400">No data available</div>
            )}
          </div>
          <ActionGroup
            isProcessing={externalIsProcessing}
            isDisabled={externalIsProcessing || isDisabled}
          >
            <SettingsDropdown nodeId={nodeId} />
            <div className="flex items-center">
              <ActionButton onClick={handleDuplicate} disabled={isDisabled}>
                Duplicate
              </ActionButton>
              <ActionButton onClick={handleGenerate} disabled={isDisabled}>
                Generate
              </ActionButton>
            </div>
          </ActionGroup>
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
