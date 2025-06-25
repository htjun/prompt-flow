import { renderHook, act } from '@testing-library/react'
import { useFlowOperations } from '../useFlowOperations'

// Mock all dependencies at the top level
jest.mock('../useAIActions', () => ({
  useAIActions: jest.fn(),
}))

jest.mock('@/stores/flowStore', () => ({
  useFlowStore: jest.fn(),
}))

jest.mock('@/stores/promptStore', () => ({
  usePromptStore: jest.fn(),
}))

jest.mock('@/stores/imageStore', () => ({
  useImageStore: jest.fn(),
}))

jest.mock('@/lib/flowHelpers', () => ({
  useNodeDimensions: () => jest.fn(() => ({ width: 320, height: 160 }))
}))

// Import after mocking
import { useAIActions } from '../useAIActions'

// Create mock implementations
const mockAIActions = {
  enhance: jest.fn(),
  generate: jest.fn(),
  describe: jest.fn(),
  structure: jest.fn(),
  isEnhancing: false,
  isGenerating: false,
  isDescribing: false,
  isStructuring: false,
  error: null,
}

const mockFlowStore = {
  addNode: jest.fn(),
  addEdge: jest.fn(),
  updateNode: jest.fn(),
  getNodeById: jest.fn(),
}

const mockPromptStore = {
  setEnhancedPromptStatusById: jest.fn(),
  setEnhancedPromptStatus: jest.fn(),
  setEnhancedPrompt: jest.fn(),
  setStructuredPrompt: jest.fn(),
  setStructuredPromptStatus: jest.fn(),
}

const mockImageStore = {
  setGeneratedImage: jest.fn(),
  setGeneratedImageStatus: jest.fn(),
}

describe('useFlowOperations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup mock returns
    ;(useAIActions as jest.MockedFunction<typeof useAIActions>).mockReturnValue(mockAIActions)
    
    // Mock the test node
    mockFlowStore.getNodeById.mockReturnValue({
      id: 'test-node',
      type: 'prompt',
      position: { x: 100, y: 100 },
      data: {},
    })
    
    // Set up store mocks to return our mock objects
    const { useFlowStore } = require('@/stores/flowStore')
    const { usePromptStore } = require('@/stores/promptStore')
    const { useImageStore } = require('@/stores/imageStore')
    
    ;(useFlowStore as jest.MockedFunction<any>).mockImplementation(() => mockFlowStore)
    ;(usePromptStore as jest.MockedFunction<any>).mockImplementation(() => mockPromptStore)
    ;(useImageStore as jest.MockedFunction<any>).mockImplementation(() => mockImageStore)
  })

  it('exposes all expected operations', () => {
    const { result } = renderHook(() => useFlowOperations())
    
    expect(typeof result.current.enhancePrompt).toBe('function')
    expect(typeof result.current.generateImage).toBe('function')
    expect(typeof result.current.structurePrompt).toBe('function')
    expect(typeof result.current.describeImage).toBe('function')
    expect(typeof result.current.duplicateStructuredPrompt).toBe('function')
    expect(result.current.isEnhancing).toBe(false)
    expect(result.current.isGenerating).toBe(false)
    expect(result.current.isStructuring).toBe(false)
    expect(result.current.isDescribing).toBe(false)
  })

  describe('enhancePrompt', () => {
    it('successfully enhances a prompt and creates node', async () => {
      const mockEnhancedText = 'Enhanced prompt text'
      mockAIActions.enhance.mockResolvedValue(mockEnhancedText)

      const { result } = renderHook(() => useFlowOperations())

      let enhanceResult: string | null = null
      await act(async () => {
        enhanceResult = await result.current.enhancePrompt('test prompt', 'source-node')
      })

      expect(mockAIActions.enhance).toHaveBeenCalledWith('test prompt')
      expect(mockFlowStore.addNode).toHaveBeenCalled()
      expect(mockFlowStore.addEdge).toHaveBeenCalled()
      expect(enhanceResult).toBe(mockEnhancedText)
    })

    it('handles empty prompt', async () => {
      const { result } = renderHook(() => useFlowOperations())

      const enhanceResult = await act(async () => {
        return await result.current.enhancePrompt('', 'source-node')
      })

      expect(enhanceResult).toBe(null)
      expect(mockAIActions.enhance).not.toHaveBeenCalled()
    })

    it('handles missing source node', async () => {
      mockFlowStore.getNodeById.mockReturnValue(undefined)

      const { result } = renderHook(() => useFlowOperations())

      const enhanceResult = await act(async () => {
        return await result.current.enhancePrompt('test prompt', 'missing-node')
      })

      expect(enhanceResult).toBe(null)
      expect(mockAIActions.enhance).not.toHaveBeenCalled()
    })
  })

  describe('generateImage', () => {
    it('successfully generates an image and creates node', async () => {
      const mockImageResult = {
        imageData: 'base64-image-data',
        modelUsed: 'test-model',
      }
      mockAIActions.generate.mockResolvedValue(mockImageResult)

      const { result } = renderHook(() => useFlowOperations())

      let generateResult: any = null
      await act(async () => {
        generateResult = await result.current.generateImage('test prompt', 'source-node', 'generate')
      })

      expect(mockAIActions.generate).toHaveBeenCalledWith('test prompt')
      expect(mockFlowStore.addNode).toHaveBeenCalled()
      expect(mockFlowStore.addEdge).toHaveBeenCalled()
      expect(generateResult).toEqual({
        nodeId: expect.stringContaining('image-'),
        data: mockImageResult,
      })
    })

    it('handles generate error', async () => {
      mockAIActions.generate.mockResolvedValue(null)

      const { result } = renderHook(() => useFlowOperations())

      const generateResult = await act(async () => {
        return await result.current.generateImage('test prompt', 'source-node', 'generate')
      })

      expect(generateResult).toBe(null)
      expect(mockImageStore.setGeneratedImageStatus).toHaveBeenCalledWith('error')
    })
  })

  describe('structurePrompt', () => {
    it('successfully structures a prompt and creates node', async () => {
      const mockStructureResult = {
        scene: { setting: 'forest', time: 'dawn', weather: null, background: null, context: null },
        subjects: null,
        style: { art_style: 'realism', color_palette: 'warm', mood: 'peaceful', lighting: 'soft' },
        camera: { focal_length: '50mm', aperture: 'f/2.8', angle: 'eye-level', depth_of_field: 'shallow' }
      }
      mockAIActions.structure.mockResolvedValue(mockStructureResult)

      const { result } = renderHook(() => useFlowOperations())

      let structureResult: any = null
      await act(async () => {
        structureResult = await result.current.structurePrompt('test prompt', 'source-node')
      })

      expect(mockAIActions.structure).toHaveBeenCalledWith('test prompt')
      expect(mockFlowStore.addNode).toHaveBeenCalled()
      expect(mockFlowStore.addEdge).toHaveBeenCalled()
      expect(structureResult).toEqual(mockStructureResult)
    })
  })

  describe('describeImage', () => {
    it('successfully describes an image and creates node', async () => {
      const mockDescription = 'A beautiful landscape image'
      mockAIActions.describe.mockResolvedValue(mockDescription)

      const { result } = renderHook(() => useFlowOperations())

      let describeResult: string | null = null
      await act(async () => {
        describeResult = await result.current.describeImage('base64-image-data', 'source-node')
      })

      expect(mockAIActions.describe).toHaveBeenCalledWith('base64-image-data')
      expect(mockFlowStore.addNode).toHaveBeenCalled()
      expect(mockFlowStore.addEdge).toHaveBeenCalled()
      expect(describeResult).toBe(mockDescription)
    })
  })

  describe('duplicateStructuredPrompt', () => {
    it('successfully duplicates a structured prompt', async () => {
      const mockStructuredData = {
        scene: { setting: 'forest', time: 'dawn', weather: null, background: null, context: null },
        subjects: null,
        style: { art_style: 'realism', color_palette: 'warm', mood: 'peaceful', lighting: 'soft' },
        camera: { focal_length: '50mm', aperture: 'f/2.8', angle: 'eye-level', depth_of_field: 'shallow' }
      }

      const { result } = renderHook(() => useFlowOperations())

      let duplicateResult: string | null = null
      act(() => {
        duplicateResult = result.current.duplicateStructuredPrompt('source-node', mockStructuredData)
      })

      expect(mockFlowStore.addNode).toHaveBeenCalled()
      expect(mockFlowStore.addEdge).toHaveBeenCalled()
      expect(duplicateResult).toMatch(/^structured-prompt-/)
    })

    it('handles empty structured data', () => {
      const { result } = renderHook(() => useFlowOperations())

      const duplicateResult = result.current.duplicateStructuredPrompt('source-node', {} as any)

      expect(duplicateResult).toBe(null)
      expect(mockFlowStore.addNode).not.toHaveBeenCalled()
    })
  })

  it('exposes loading states from AI actions', () => {
    const updatedMockAIActions = {
      ...mockAIActions,
      isEnhancing: true,
      isGenerating: true,
      isStructuring: false,
      isDescribing: false,
    }
    ;(useAIActions as jest.MockedFunction<typeof useAIActions>).mockReturnValue(updatedMockAIActions)

    const { result } = renderHook(() => useFlowOperations())

    expect(result.current.isEnhancing).toBe(true)
    expect(result.current.isGenerating).toBe(true)
    expect(result.current.isStructuring).toBe(false)
    expect(result.current.isDescribing).toBe(false)
  })
})