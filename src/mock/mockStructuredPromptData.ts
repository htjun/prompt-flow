export const mockStructuredPromptData = {
  scene: {
    setting: 'open park',
    time: null,
    weather: 'sunny',
    background: 'blurred expanse of greenery with vibrant trees and blooming flowers',
    context: 'lively, community-oriented',
  },
  subjects: [
    {
      type: 'character',
      description:
        'A man in a sporty outfit with a moisture-wicking T-shirt and athletic shorts, short dark hair, displaying joy and determination.',
      pose: 'mid-stride with a slight lean forward',
      emotion: 'joy and determination',
      position: 'foreground',
      size: 'large',
    },
    {
      type: 'animal',
      description:
        'A golden retriever with glistening fur, flapping ears, and a joyful expression, tongue lolling out.',
      pose: 'running alongside the man',
      emotion: 'exuberance',
      position: 'foreground',
      size: 'large',
    },
  ],
  style: {
    art_style: 'realism',
    color_palette: 'vibrant',
    mood: 'energetic and harmonious',
    lighting: 'dappled sunlight',
  },
  camera: {
    focal_length: '85mm',
    aperture: 'f/2.8',
    angle: 'eye-level',
    depth_of_field: 'shallow',
  },
}

export const mockEnhancedPromptDataWithNoSubjects = {
  ...mockStructuredPromptData,
  subjects: [],
}
