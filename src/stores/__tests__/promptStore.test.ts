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

  it('manages atomized prompts', () => {
    const data = {
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
    const store = usePromptStore.getState()
    store.setAtomizedPrompt('id', data)
    expect(store.getAtomizedPrompt('id')).toEqual(data)
  })

  it('returns null for missing atomized prompt', () => {
    const store = usePromptStore.getState()
    expect(store.getAtomizedPrompt('missing')).toBeNull()
  })
})
