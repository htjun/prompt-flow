import { useImageStore } from '../imageStore'

const initial = useImageStore.getState()

beforeEach(() => {
  useImageStore.setState(initial)
})

describe('imageStore', () => {
  it('sets operation status and image data', () => {
    const store = useImageStore.getState()
    store.setOperationStatus('test-id', { status: 'loading' })
    expect(store.getOperationStatus('test-id')).toBe('loading')
    
    const imageData = {
      imageData: 'base64-data',
      modelUsed: 'test-model',
      prompt: 'test prompt'
    }
    store.setImageData('test-id', imageData)
    const storedData = store.getImageData('test-id')
    expect(storedData).toEqual({
      ...imageData,
      createdAt: expect.any(Number)
    })
  })
})
