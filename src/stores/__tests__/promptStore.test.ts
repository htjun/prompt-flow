import { usePromptStore } from '../promptStore'

const initial = JSON.parse(JSON.stringify(usePromptStore.getState()))

beforeEach(() => {
  usePromptStore.setState(JSON.parse(JSON.stringify(initial)))
})

describe('promptStore', () => {
  it('sets prompt and status', () => {
    usePromptStore.getState().setPrompt('a')
    expect(usePromptStore.getState().prompt).toBe('a')
    usePromptStore.getState().setEnhancedPromptStatus('loading')
    expect(usePromptStore.getState().enhancedPromptStatus).toBe('loading')
  })

  it('manages enhanced prompts', () => {
    const store = usePromptStore.getState()
    store.setEnhancedPrompt('id', 'prompt')
    expect(store.getEnhancedPrompt('id')).toBe('prompt')
    store.setEnhancedPromptStatusById('id', 'success')
    expect(store.getEnhancedPromptStatus('id')).toBe('success')
    expect(store.getEnhancedPrompt('missing')).toBe('')
    expect(store.getEnhancedPromptStatus('missing')).toBe('none')
    expect(store.getAllEnhancedPrompts()).toHaveProperty('id', 'prompt')
  })

  it('manages structured prompts', () => {
    const data = {
      composition: { focal_point: '', balance: '', depth: '', motion: '' },
      style: { art_style: '', color_palette: '', mood: '', lighting: '' },
      scene: { background: '', time_of_day: '', weather: '', location: '' },
      camera: { focal_length: '', aperture: '', angle: '', depth_of_field: '', aspect_ratio: '' },
    }
    const store = usePromptStore.getState()
    store.setStructuredPrompt('id', data)
    expect(store.getStructuredPrompt('id')).toEqual(data)
    store.setStructuredPromptStatus('success')
    expect(usePromptStore.getState().structuredPromptStatus).toBe('success')
    expect(store.getStructuredPrompt('missing')).toBeNull()
    expect(store.getAllStructuredPrompts()).toHaveProperty('id', data)
  })
})
