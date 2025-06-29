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
  useNodeDimensions: () => jest.fn(() => ({ width: 320, height: 160 })),
}))

// Import after mocking
import { useAIActions } from '../useAIActions'

// Create mock implementations
const mockAIActions = {
  enhance: jest.fn(),
  generate: jest.fn(),
  describe: jest.fn(),
  atomize: jest.fn(),
  segment: jest.fn(),
  isEnhancing: false,
  isGenerating: false,
  isDescribing: false,
  isAtomizing: false,
  isSegmenting: false,
  error: null,
}

const mockFlowStore = {
  addNode: jest.fn(),
  addEdge: jest.fn(),
  updateNode: jest.fn(),
  getNodeById: jest.fn(),
  addNodeWithPositioning: jest.fn(),
}

const mockPromptStore = {
  setBasicPrompt: jest.fn(),
  setEnhancedPrompt: jest.fn(),
  setAtomizedPrompt: jest.fn(),
  setOperationStatus: jest.fn(),
  getBasicPrompt: jest.fn(),
  getEnhancedPrompt: jest.fn(),
  getAtomizedPrompt: jest.fn(),
  getOperationStatus: jest.fn(),
  getOperationError: jest.fn(),
  setActivePrompt: jest.fn(),
  clearPrompt: jest.fn(),
  clearOperation: jest.fn(),
}

const mockImageStore = {
  setImageData: jest.fn(),
  setOperationStatus: jest.fn(),
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

    expect(typeof result.current.generateImage).toBe('function')
    expect(typeof result.current.atomizePrompt).toBe('function')
    expect(typeof result.current.segmentPrompt).toBe('function')
    expect(typeof result.current.describeImage).toBe('function')
    expect(typeof result.current.duplicateAtomizedPrompt).toBe('function')
    expect(result.current.isGenerating).toBe(false)
    expect(result.current.isAtomizing).toBe(false)
    expect(result.current.isSegmenting).toBe(false)
    expect(result.current.isDescribing).toBe(false)
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
        generateResult = await result.current.generateImage(
          'test prompt',
          'source-node',
          'generate'
        )
      })

      expect(mockAIActions.generate).toHaveBeenCalledWith('test prompt')
      expect(mockFlowStore.addNodeWithPositioning).toHaveBeenCalled()
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
      expect(mockImageStore.setOperationStatus).toHaveBeenCalledWith(expect.any(String), {
        status: 'error',
      })
    })
  })

  describe('atomizePrompt', () => {
    it('successfully atomizes a prompt and creates node', async () => {
      const mockAtomizeResult = {
        scene: { setting: 'forest', time: 'dawn', weather: null, background: null, context: null },
        subjects: null,
        style: { art_style: 'realism', color_palette: 'warm', mood: 'peaceful', lighting: 'soft' },
        camera: {
          focal_length: '50mm',
          aperture: 'f/2.8',
          angle: 'eye-level',
          depth_of_field: 'shallow',
        },
      }
      mockAIActions.atomize.mockResolvedValue(mockAtomizeResult)

      const { result } = renderHook(() => useFlowOperations())

      let atomizeResult: any = null
      await act(async () => {
        atomizeResult = await result.current.atomizePrompt('test prompt', 'source-node')
      })

      expect(mockAIActions.atomize).toHaveBeenCalledWith('test prompt')
      expect(mockFlowStore.addNodeWithPositioning).toHaveBeenCalled()
      expect(mockFlowStore.addEdge).toHaveBeenCalled()
      expect(atomizeResult).toEqual(mockAtomizeResult)
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
      expect(mockFlowStore.addNodeWithPositioning).toHaveBeenCalled()
      expect(mockFlowStore.addEdge).toHaveBeenCalled()
      expect(mockPromptStore.setBasicPrompt).toHaveBeenCalledWith(
        expect.any(String),
        mockDescription
      )
      expect(describeResult).toBe(mockDescription)
    })

    it('handles describe error', async () => {
      mockAIActions.describe.mockResolvedValue(null)

      const { result } = renderHook(() => useFlowOperations())

      let describeResult: string | null = null
      await act(async () => {
        describeResult = await result.current.describeImage('base64-image-data', 'source-node')
      })

      expect(describeResult).toBe(null)
      expect(mockPromptStore.setOperationStatus).toHaveBeenCalledWith(expect.any(String), {
        status: 'error',
      })
    })
  })

  describe('duplicateAtomizedPrompt', () => {
    it('successfully duplicates an atomized prompt', async () => {
      const mockAtomizedData = {
        scene: { setting: 'forest', time: 'dawn', weather: null, background: null, context: null },
        subjects: null,
        style: { art_style: 'realism', color_palette: 'warm', mood: 'peaceful', lighting: 'soft' },
        camera: {
          focal_length: '50mm',
          aperture: 'f/2.8',
          angle: 'eye-level',
          depth_of_field: 'shallow',
        },
      }

      const { result } = renderHook(() => useFlowOperations())

      let duplicateResult: string | null = null
      act(() => {
        duplicateResult = result.current.duplicateAtomizedPrompt('source-node', mockAtomizedData)
      })

      expect(mockFlowStore.addNodeWithPositioning).toHaveBeenCalled()
      expect(mockFlowStore.addEdge).toHaveBeenCalled()
      expect(duplicateResult).toMatch(/^atomized-prompt-/)
    })

    it('handles empty atomized data', () => {
      const { result } = renderHook(() => useFlowOperations())

      const duplicateResult = result.current.duplicateAtomizedPrompt('source-node', {} as any)

      expect(duplicateResult).toBe(null)
      expect(mockFlowStore.addNodeWithPositioning).not.toHaveBeenCalled()
    })
  })

  it('exposes loading states from AI actions', () => {
    const updatedMockAIActions = {
      ...mockAIActions,
      isGenerating: true,
      isAtomizing: true,
      isSegmenting: false,
      isDescribing: false,
    }
    ;(useAIActions as jest.MockedFunction<typeof useAIActions>).mockReturnValue(
      updatedMockAIActions
    )

    const { result } = renderHook(() => useFlowOperations())

    expect(result.current.isGenerating).toBe(true)
    expect(result.current.isAtomizing).toBe(true)
    expect(result.current.isSegmenting).toBe(false)
    expect(result.current.isDescribing).toBe(false)
  })
})
