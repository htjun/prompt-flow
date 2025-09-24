import { getModelDisplayName } from '@/lib/utils'
import { ActionGroup, ActionButton } from '@/components/ActionGroup'
import { ImageDisplay } from './ImageDisplay'
import { ImageNodeData } from './types'

type ImageNodeContentProps = {
  data: ImageNodeData
  copySuccess: boolean
  onCopy: () => void
  onDownload: () => void
  onDescribe: () => void
}

export const ImageNodeContent = ({
  data,
  copySuccess,
  onCopy,
  onDownload,
  onDescribe,
}: ImageNodeContentProps) => {
  const { imageData, isLoading, hasError, modelUsed } = data

  if (hasError) {
    return (
      <div className="flex min-h-28 items-center justify-center text-sm text-red-400">
        Failed to generate image
      </div>
    )
  }

  if (imageData) {
    return (
      <div className="space-y-3">
        <ImageDisplay
          imageData={imageData}
          copySuccess={copySuccess}
          onCopy={onCopy}
          onDownload={onDownload}
        />
        <div className="flex items-center justify-between">
          {modelUsed && (
            <div className="px-2.5 text-xs text-gray-400">{getModelDisplayName(modelUsed)}</div>
          )}
          <ActionGroup>
            <ActionButton onClick={onDescribe}>Describe</ActionButton>
          </ActionGroup>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-28 items-center justify-center text-sm text-gray-400">
        Generating image...
      </div>
    )
  }

  return (
    <div className="flex min-h-28 items-center justify-center text-sm text-gray-400">
      No image data
    </div>
  )
}
