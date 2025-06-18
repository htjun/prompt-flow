import { useImageStore } from '../imageStore'

const initial = useImageStore.getState()

beforeEach(() => {
  useImageStore.setState(initial)
})

describe('imageStore', () => {
  it('sets status and image', () => {
    useImageStore.getState().setGeneratedImageStatus('loading')
    expect(useImageStore.getState().generatedImageStatus).toBe('loading')
    useImageStore.getState().setGeneratedImage('data')
    expect(useImageStore.getState().generatedImage).toBe('data')
  })
})
