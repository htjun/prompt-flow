import { NodePositioningService } from '../nodePositioning'

describe('NodePositioningService', () => {
  describe('findNonOverlappingPosition', () => {
    it('should return original position when no overlap exists', () => {
      const targetPosition = { x: 100, y: 100 }
      const existingNodes = [
        {
          position: { x: 500, y: 500 },
          dimensions: { width: 320, height: 160 }
        }
      ]

      const result = NodePositioningService.findNonOverlappingPosition(
        targetPosition,
        existingNodes
      )

      expect(result).toEqual(targetPosition)
    })

    it('should offset position when overlap exists', () => {
      const targetPosition = { x: 100, y: 100 }
      const existingNodes = [
        {
          position: { x: 100, y: 100 },
          dimensions: { width: 320, height: 160 }
        }
      ]

      const result = NodePositioningService.findNonOverlappingPosition(
        targetPosition,
        existingNodes
      )

      // Should be offset by 20 pixels
      expect(result.x).toBeGreaterThanOrEqual(100)
      expect(result.y).toBeGreaterThanOrEqual(100)
      expect(result).not.toEqual(targetPosition)
    })

    it('should find non-overlapping position with multiple existing nodes', () => {
      const targetPosition = { x: 100, y: 100 }
      const existingNodes = [
        {
          position: { x: 100, y: 100 },
          dimensions: { width: 320, height: 160 }
        },
        {
          position: { x: 120, y: 120 },
          dimensions: { width: 320, height: 160 }
        }
      ]

      const result = NodePositioningService.findNonOverlappingPosition(
        targetPosition,
        existingNodes
      )

      // Verify no overlap with any existing nodes
      const hasOverlap = existingNodes.some(node =>
        NodePositioningService.doNodesOverlap(
          result,
          { width: 320, height: 160 },
          node.position,
          node.dimensions
        )
      )

      expect(hasOverlap).toBe(false)
    })
  })

  describe('doNodesOverlap', () => {
    it('should detect overlap when nodes overlap', () => {
      const pos1 = { x: 100, y: 100 }
      const dim1 = { width: 320, height: 160 }
      const pos2 = { x: 120, y: 120 }
      const dim2 = { width: 320, height: 160 }

      const result = NodePositioningService.doNodesOverlap(pos1, dim1, pos2, dim2)
      expect(result).toBe(true)
    })

    it('should not detect overlap when nodes are separate', () => {
      const pos1 = { x: 100, y: 100 }
      const dim1 = { width: 320, height: 160 }
      const pos2 = { x: 500, y: 500 }
      const dim2 = { width: 320, height: 160 }

      const result = NodePositioningService.doNodesOverlap(pos1, dim1, pos2, dim2)
      expect(result).toBe(false)
    })
  })
})