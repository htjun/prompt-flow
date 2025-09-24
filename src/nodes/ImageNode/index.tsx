import { Handle, Position, useEdges } from '@xyflow/react'
import { calculateHandleOffset, cn } from '@/lib/utils'
import { isHandleConnected } from '@/lib/flowHelpers'
import { HANDLE_IDS } from '@/constants/flowConstants'
import { ImageNodeProps } from './types'
import { getContainerWidth } from './utils'
import { useImageHandlers } from './handlers'
import { ImageNodeContent } from './ImageNodeContent'

export const ImageNode = ({ data, id }: ImageNodeProps) => {
  const { aspectRatio } = data
  const edges = useEdges()

  const { copySuccess, handleDescribe, handleCopy, handleDownload } = useImageHandlers(
    data.imageData,
    id
  )

  const actionLabels = ['Describe']
  const isDescribeHandleConnected = isHandleConnected(edges, id, HANDLE_IDS.DESCRIBE, 'source')

  return (
    <div className="flex flex-col gap-1">
      <div className="node-label geist-mono">Image</div>
      <div
        className={cn(
          'node-container nodrag flex flex-col items-center justify-center gap-2',
          getContainerWidth(aspectRatio)
        )}
      >
        <ImageNodeContent
          data={data}
          copySuccess={copySuccess}
          onCopy={handleCopy}
          onDownload={handleDownload}
          onDescribe={handleDescribe}
        />
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
