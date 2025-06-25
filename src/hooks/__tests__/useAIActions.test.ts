import { renderHook, act } from '@testing-library/react'
import { useAIActions } from '../useAIActions'

// Mock the server actions
jest.mock('@/actions/enhancePrompt', () => ({
  enhancePrompt: jest.fn(),
}))

jest.mock('@/actions/generateImage', () => ({
  generateImageFromPrompt: jest.fn(),
}))

jest.mock('@/actions/describeImage', () => ({
  describeImage: jest.fn(),
}))

jest.mock('@/actions/structurePrompt', () => ({
  structurePrompt: jest.fn(),
}))

// Mock the model store with a simpler approach
jest.mock('@/stores/modelStore', () => ({
  useModelStore: jest.fn(() => ({
    selectedImageModel: 'test-model',
  })),
}))

import { enhancePrompt } from '@/actions/enhancePrompt'
import { generateImageFromPrompt } from '@/actions/generateImage'
import { describeImage } from '@/actions/describeImage'
import { structurePrompt } from '@/actions/structurePrompt'

const mockEnhancePrompt = enhancePrompt as jest.MockedFunction<typeof enhancePrompt>
const mockGenerateImage = generateImageFromPrompt as jest.MockedFunction<typeof generateImageFromPrompt>
const mockDescribeImage = describeImage as jest.MockedFunction<typeof describeImage>
const mockStructurePrompt = structurePrompt as jest.MockedFunction<typeof structurePrompt>

describe('useAIActions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useAIActions())
    
    expect(result.current.isEnhancing).toBe(false)
    expect(result.current.isGenerating).toBe(false)
    expect(result.current.isDescribing).toBe(false)
    expect(result.current.isStructuring).toBe(false)
    expect(result.current.error).toBe(null)
    expect(typeof result.current.enhance).toBe('function')
    expect(typeof result.current.generate).toBe('function')
    expect(typeof result.current.describe).toBe('function')
    expect(typeof result.current.structure).toBe('function')
  })

  describe('enhance', () => {
    it('successfully enhances a prompt', async () => {
      const mockEnhancedText = 'Enhanced prompt text'
      mockEnhancePrompt.mockResolvedValue(mockEnhancedText)

      const { result } = renderHook(() => useAIActions())

      let enhanceResult: string | null = null
      await act(async () => {
        enhanceResult = await result.current.enhance('test prompt')
      })

      expect(mockEnhancePrompt).toHaveBeenCalledWith('test prompt')
      expect(enhanceResult).toBe(mockEnhancedText)
      expect(result.current.isEnhancing).toBe(false)
      expect(result.current.error).toBe(null)
    })

    it('handles enhance error', async () => {
      const mockError = new Error('Enhance failed')
      mockEnhancePrompt.mockRejectedValue(mockError)

      const { result } = renderHook(() => useAIActions())

      let enhanceResult: string | null = null
      await act(async () => {
        enhanceResult = await result.current.enhance('test prompt')
      })

      expect(enhanceResult).toBe(null)
      expect(result.current.isEnhancing).toBe(false)
      expect(result.current.error).toEqual(mockError)
    })
  })

  describe('generate', () => {
    it('successfully generates an image', async () => {
      const mockImageResult = {
        imageData: 'base64-image-data',
        modelUsed: 'test-model',
      }
      mockGenerateImage.mockResolvedValue(mockImageResult)

      const { result } = renderHook(() => useAIActions())

      let generateResult: any = null
      await act(async () => {
        generateResult = await result.current.generate('test prompt')
      })

      expect(mockGenerateImage).toHaveBeenCalledWith('test prompt', 'test-model')
      expect(generateResult).toEqual(mockImageResult)
      expect(result.current.isGenerating).toBe(false)
      expect(result.current.error).toBe(null)
    })

    it('handles generate error', async () => {
      const mockError = new Error('Generate failed')
      mockGenerateImage.mockRejectedValue(mockError)

      const { result } = renderHook(() => useAIActions())

      let generateResult: any = null
      await act(async () => {
        generateResult = await result.current.generate('test prompt')
      })

      expect(generateResult).toBe(null)
      expect(result.current.isGenerating).toBe(false)
      expect(result.current.error).toEqual(mockError)
    })
  })

  describe('describe', () => {
    it('successfully describes an image', async () => {
      const mockDescription = 'A beautiful landscape image'
      mockDescribeImage.mockResolvedValue(mockDescription)

      const { result } = renderHook(() => useAIActions())

      let describeResult: string | null = null
      await act(async () => {
        describeResult = await result.current.describe('base64-image-data')
      })

      expect(mockDescribeImage).toHaveBeenCalledWith('base64-image-data')
      expect(describeResult).toBe(mockDescription)
      expect(result.current.isDescribing).toBe(false)
      expect(result.current.error).toBe(null)
    })

    it('handles describe error', async () => {
      const mockError = new Error('Describe failed')
      mockDescribeImage.mockRejectedValue(mockError)

      const { result } = renderHook(() => useAIActions())

      let describeResult: string | null = null
      await act(async () => {
        describeResult = await result.current.describe('base64-image-data')
      })

      expect(describeResult).toBe(null)
      expect(result.current.isDescribing).toBe(false)
      expect(result.current.error).toEqual(mockError)
    })
  })

  describe('structure', () => {
    it('successfully structures a prompt', async () => {
      const mockStructureResult = {
        object: {
          scene: { setting: 'forest', time: 'dawn', weather: null, background: null, context: null },
          subjects: null,
          style: { art_style: 'realism', color_palette: 'warm', mood: 'peaceful', lighting: 'soft' },
          camera: { focal_length: '50mm', aperture: 'f/2.8', angle: 'eye-level', depth_of_field: 'shallow' }
        }
      }
      mockStructurePrompt.mockResolvedValue(mockStructureResult)

      const { result } = renderHook(() => useAIActions())

      let structureResult: any = null
      await act(async () => {
        structureResult = await result.current.structure('test prompt')
      })

      expect(mockStructurePrompt).toHaveBeenCalledWith('test prompt')
      expect(structureResult).toEqual(mockStructureResult.object)
      expect(result.current.isStructuring).toBe(false)
      expect(result.current.error).toBe(null)
    })

    it('handles structure error', async () => {
      const mockError = new Error('Structure failed')
      mockStructurePrompt.mockRejectedValue(mockError)

      const { result } = renderHook(() => useAIActions())

      let structureResult: any = null
      await act(async () => {
        structureResult = await result.current.structure('test prompt')
      })

      expect(structureResult).toBe(null)
      expect(result.current.isStructuring).toBe(false)
      expect(result.current.error).toEqual(mockError)
    })
  })

  it('handles non-Error exceptions', async () => {
    mockEnhancePrompt.mockRejectedValue('String error')

    const { result } = renderHook(() => useAIActions())

    await act(async () => {
      await result.current.enhance('test prompt')
    })

    expect(result.current.error).toEqual(new Error('Failed to enhance prompt'))
  })
})