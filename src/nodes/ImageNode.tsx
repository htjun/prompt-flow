import { Handle, Position, useEdges } from '@xyflow/react'
import {
  getModelDisplayName,
  copyImageToClipboard,
  downloadImage,
  calculateHandleOffset,
  cn,
} from '@/lib/utils'
import { ActionGroup } from '@/components/ActionGroup'
import { Button } from '@/components/ui/button'
import { CopyIcon, DownloadIcon, CheckIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { isHandleConnected } from '@/lib/flowHelpers'
import { useFlowActions } from '@/context/FlowActionsContext'
import { HANDLE_IDS } from '@/constants/flowConstants'
import Image from 'next/image'

type ImageNodeProps = {
  id: string
  data: {
    imageData?: string
    isLoading?: boolean
    hasError?: boolean
    modelUsed?: string
  }
}

export const ImageNode = ({ data, id }: ImageNodeProps) => {
  const { imageData, isLoading, hasError, modelUsed } = data
  const [copySuccess, setCopySuccess] = useState(false)
  const { describeImage } = useFlowActions()
  const edges = useEdges()

  const handleDescribe = () => {
    if (!imageData) return
    describeImage(imageData, id)
  }

  const getImageSrc = (data: string) => {
    if (data.startsWith('data:')) {
      return data
    }

    return `data:image/png;base64,${data}`
  }

  const handleCopy = async () => {
    if (!imageData) return

    try {
      await copyImageToClipboard(imageData)
      setCopySuccess(true)
    } catch (error) {
      console.error('Failed to copy image:', error)
    }
  }

  const handleDownload = () => {
    if (!imageData) return

    try {
      downloadImage(imageData)
    } catch (error) {
      console.error('Failed to download image:', error)
    }
  }

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => {
        setCopySuccess(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [copySuccess])

  const actions = [
    {
      label: 'Describe',
      onClick: handleDescribe,
    },
  ]

  // Define action labels for handle positioning (matches the filtered actions)
  const actionLabels = actions.map((action) => action.label)

  const isDescribeHandleConnected = isHandleConnected(edges, id, HANDLE_IDS.DESCRIBE, 'source')

  return (
    <div className="flex flex-col gap-1">
      <div className="node-label geist-mono">Generated Image</div>
      <div className="node-container nodrag flex min-h-60 w-80 flex-col items-center justify-center gap-2">
        {hasError ? (
          <div className="flex min-h-28 items-center justify-center text-sm text-red-400">
            Failed to generate image
          </div>
        ) : imageData ? (
          <div className="space-y-3">
            <div className="group relative space-y-2 px-2 pt-2">
              <div className="absolute top-3 right-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer hover:bg-neutral-800/50"
                  onClick={handleCopy}
                >
                  {copySuccess ? (
                    <CheckIcon className="h-4 w-4 text-white" />
                  ) : (
                    <CopyIcon className="h-4 w-4 text-white" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer hover:bg-neutral-800/50"
                  onClick={handleDownload}
                >
                  <DownloadIcon className="h-4 w-4 text-white" />
                </Button>
              </div>
              <Image
                src={getImageSrc(imageData)}
                alt="Generated image"
                className="max-h-[500px] max-w-full rounded-sm"
                width={500}
                height={500}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div className="flex items-center justify-between">
              {modelUsed && (
                <div className="px-2.5 text-xs text-gray-400">{getModelDisplayName(modelUsed)}</div>
              )}
              <ActionGroup actions={actions} />
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex min-h-28 items-center justify-center text-sm text-gray-400">
            Generating image...
          </div>
        ) : (
          <div className="flex min-h-28 items-center justify-center text-sm text-gray-400">
            No image data
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Left} id={HANDLE_IDS.IMAGE_INPUT} />
      <Handle
        type="source"
        position={Position.Bottom}
        id={HANDLE_IDS.DESCRIBE}
        className={cn(
          '!left-auto transition-opacity duration-200',
          isDescribeHandleConnected ? 'opacity-100' : 'opacity-0'
        )}
        style={calculateHandleOffset(actionLabels, actionLabels.indexOf('Describe'))}
      />
    </div>
  )
}
