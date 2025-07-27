import type { Node } from '@xyflow/react'

export type ActionType = 'enhance' | 'atomize' | 'generate' | 'describe' | 'format'

export interface NodeDimensions {
  width: number
  height: number
}

export interface Position {
  x: number
  y: number
}

export class NodePositioningService {
  private static readonly DEFAULT_NODE_WIDTH = 320
  private static readonly DEFAULT_NODE_HEIGHT = 160
  private static readonly NODE_GAP = 50

  /**
   * Calculate position for a new node based on action type and reference node
   */
  static calculatePosition(
    actionType: ActionType,
    referenceNode: Node,
    getNodeDimensions?: (nodeId: string) => NodeDimensions | null
  ): Position {
    const gap = this.NODE_GAP

    // Try to get actual node dimensions, fallback to defaults
    let nodeHeight = this.DEFAULT_NODE_HEIGHT
    let nodeWidth = this.DEFAULT_NODE_WIDTH

    if (getNodeDimensions) {
      const dimensions = getNodeDimensions(referenceNode.id)
      if (dimensions) {
        nodeHeight = dimensions.height
        nodeWidth = dimensions.width
      }
    }

    switch (actionType) {
      case 'enhance':
      case 'atomize':
      case 'format':
      case 'describe':
        // Position below the reference node (same x, y + height + gap)
        return {
          x: referenceNode.position.x,
          y: referenceNode.position.y + nodeHeight + gap,
        }

      case 'generate':
        // Position to the right of the reference node (x + width + gap, same y)
        return {
          x: referenceNode.position.x + nodeWidth + gap,
          y: referenceNode.position.y,
        }

      default:
        // Fallback position
        return {
          x: referenceNode.position.x + nodeWidth + gap,
          y: referenceNode.position.y,
        }
    }
  }

  /**
   * Calculate grid-based position for multiple nodes
   */
  static calculateGridPosition(index: number, columns: number = 3): Position {
    const row = Math.floor(index / columns)
    const col = index % columns

    return {
      x: col * (this.DEFAULT_NODE_WIDTH + this.NODE_GAP) + 100,
      y: row * (this.DEFAULT_NODE_HEIGHT + this.NODE_GAP) + 100,
    }
  }

  /**
   * Check if two nodes overlap
   */
  static doNodesOverlap(
    pos1: Position,
    dimensions1: NodeDimensions,
    pos2: Position,
    dimensions2: NodeDimensions
  ): boolean {
    return !(
      pos1.x + dimensions1.width < pos2.x ||
      pos2.x + dimensions2.width < pos1.x ||
      pos1.y + dimensions1.height < pos2.y ||
      pos2.y + dimensions2.height < pos1.y
    )
  }

  /**
   * Find a non-overlapping position near the target position
   */
  static findNonOverlappingPosition(
    targetPosition: Position,
    existingNodes: Array<{ position: Position; dimensions: NodeDimensions }>,
    newNodeDimensions: NodeDimensions = {
      width: this.DEFAULT_NODE_WIDTH,
      height: this.DEFAULT_NODE_HEIGHT,
    }
  ): Position {
    // First check if the target position is already free
    const hasInitialOverlap = existingNodes.some((node) =>
      this.doNodesOverlap(targetPosition, newNodeDimensions, node.position, node.dimensions)
    )

    if (!hasInitialOverlap) {
      return targetPosition
    }

    // If there's overlap, try positions with 20px increments
    let attempts = 0
    const maxAttempts = 100
    const offset = 20

    while (attempts < maxAttempts) {
      const offsetMultiplier = Math.floor(attempts / 4) + 1
      const direction = attempts % 4

      let position: Position

      switch (direction) {
        case 0: // right and down
          position = {
            x: targetPosition.x + offset * offsetMultiplier,
            y: targetPosition.y + offset * offsetMultiplier,
          }
          break
        case 1: // down only
          position = {
            x: targetPosition.x,
            y: targetPosition.y + offset * offsetMultiplier,
          }
          break
        case 2: // right only
          position = {
            x: targetPosition.x + offset * offsetMultiplier,
            y: targetPosition.y,
          }
          break
        case 3: // left and down
          position = {
            x: targetPosition.x - offset * offsetMultiplier,
            y: targetPosition.y + offset * offsetMultiplier,
          }
          break
        default:
          position = targetPosition
      }

      const hasOverlap = existingNodes.some((node) =>
        this.doNodesOverlap(position, newNodeDimensions, node.position, node.dimensions)
      )

      if (!hasOverlap) {
        return position
      }

      attempts++
    }

    // Fallback: return position with a simple offset
    return {
      x: targetPosition.x + offset,
      y: targetPosition.y + offset,
    }
  }
}
