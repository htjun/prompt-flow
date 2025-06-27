import { Position, Handle, useEdges, type Edge } from '@xyflow/react'
import { cn, calculateHandleOffset } from '@/lib/utils'
import { isHandleConnected } from '@/lib/flowHelpers'
import { type ReactElement } from 'react'

interface RenderHandleOptions {
  /** The handle ID from HANDLE_IDS */
  handleId: string
  /** For source handles: the action labels array for positioning */
  actionLabels?: string[]
  /** For source handles: the index of this handle's action in the actionLabels array */
  actionIndex?: number
  /** Custom position (defaults to Bottom for source, Left for target) */
  position?: Position
  /** Additional className for the handle */
  className?: string
  /** Additional inline styles */
  style?: React.CSSProperties
}

export const useNodeHandles = (nodeId: string) => {
  const edges = useEdges()

  const renderSourceHandle = ({
    handleId,
    actionLabels,
    actionIndex,
    position = Position.Bottom,
    className,
    style,
  }: RenderHandleOptions): ReactElement => {
    const isConnected = isHandleConnected(edges, nodeId, handleId, 'source')

    return (
      <Handle
        key={handleId}
        type="source"
        position={position}
        id={handleId}
        className={cn(
          '!left-auto transition-opacity duration-200',
          isConnected ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={{
          ...(actionLabels && actionIndex !== undefined
            ? calculateHandleOffset(actionLabels, actionIndex)
            : {}),
          ...style,
        }}
      />
    )
  }

  const renderTargetHandle = ({
    handleId,
    position = Position.Left,
    className,
    style,
  }: RenderHandleOptions): ReactElement => {
    return (
      <Handle
        key={handleId}
        type="target"
        position={position}
        id={handleId}
        className={className}
        style={style}
      />
    )
  }

  const renderHandles = (handles: RenderHandleOptions[]): ReactElement[] => {
    return handles.map((handle) => {
      if (handle.actionLabels !== undefined) {
        return renderSourceHandle(handle)
      }
      return renderTargetHandle(handle)
    })
  }

  const isHandleConnectedCheck = (handleId: string, type: 'source' | 'target' = 'source') => {
    return isHandleConnected(edges, nodeId, handleId, type)
  }

  return {
    renderSourceHandle,
    renderTargetHandle,
    renderHandles,
    isHandleConnectedCheck,
    edges,
  }
}
