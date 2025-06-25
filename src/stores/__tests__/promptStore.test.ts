import { usePromptStore } from '../promptStore'

const initial = JSON.parse(JSON.stringify(usePromptStore.getState()))

beforeEach(() => {
  usePromptStore.setState(JSON.parse(JSON.stringify(initial)))
})

describe('promptStore', () => {
  it('sets basic prompt and operation status', () => {
    usePromptStore.getState().setBasicPrompt('test-id', 'basic prompt')
    expect(usePromptStore.getState().getBasicPrompt('test-id')).toBe('basic prompt')
    usePromptStore.getState().setOperationStatus('test-id', { status: 'loading' })
    expect(usePromptStore.getState().getOperationStatus('test-id')).toBe('loading')
  })

  it('manages enhanced prompts', () => {
    const store = usePromptStore.getState()
    store.setEnhancedPrompt('id', 'enhanced prompt')
    expect(store.getEnhancedPrompt('id')).toBe('enhanced prompt')
    store.setOperationStatus('id', { status: 'success' })
    expect(store.getOperationStatus('id')).toBe('success')
    expect(store.getEnhancedPrompt('missing')).toBe('')
    expect(store.getOperationStatus('missing')).toBe('idle')
  })

  it('manages structured prompts', () => {
    const data = {
      scene: { setting: 'forest', time: 'dawn', weather: null, background: null, context: null },
      subjects: null,
      style: { art_style: 'realism', color_palette: 'warm', mood: 'peaceful', lighting: 'soft' },
      camera: { focal_length: '50mm', aperture: 'f/2.8', angle: 'eye-level', depth_of_field: 'shallow' }
    }
    const store = usePromptStore.getState()
    store.setStructuredPrompt('id', data)
    expect(store.getStructuredPrompt('id')).toEqual(data)
    store.setOperationStatus('id', { status: 'success' })
    expect(store.getOperationStatus('id')).toBe('success')
    expect(store.getStructuredPrompt('missing')).toBeNull()
  })
})
