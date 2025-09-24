/**
 * Supported AI Models by Provider
 *
 * LANGUAGE MODELS
 * OpenAI:
 * - gpt-4.1-mini: Fast prompt processing
 * - gpt-4o: Advanced with vision capabilities
 *
 * IMAGE MODELS
 * Google:
 * - imagen-4-fast: Fast generation
 * - imagen-4: Higher quality
 *
 * Black Forest Labs:
 * - flux-dev-lora: LoRA + image input
 * - flux-kontext-pro: Image input + wide ratios
 *
 * Leonardo AI:
 * - phoenix-1.0: Extensive aspect ratios
 *
 * Ideogram:
 * - ideogram-v3-turbo: Text rendering
 *
 * ByteDance:
 * - seedream-3: Creative outputs
 */

interface AspectRatioConfig {
  type: 'dimensions' | 'ratio' | 'size'
  supportedRatios: string[]
  defaultRatio: string
  customDimensions?: Record<string, { width: number; height: number }>
}

interface ImageModel {
  id: string
  name: string
  imageInput: boolean // Accepts image input
  aspectRatio: AspectRatioConfig
}

export const imageModels: ImageModel[] = [
  // Google Models
  {
    id: 'google/imagen-4-fast',
    name: 'Imagen 4 Fast',
    imageInput: false,
    aspectRatio: {
      type: 'ratio',
      supportedRatios: ['1:1', '16:9', '9:16', '4:3', '3:4'],
      defaultRatio: '1:1',
    },
  },
  {
    id: 'google/imagen-4',
    name: 'Imagen 4',
    imageInput: false,
    aspectRatio: {
      type: 'ratio',
      supportedRatios: ['1:1', '16:9', '9:16', '4:3', '3:4'],
      defaultRatio: '1:1',
    },
  },

  // Black Forest Labs Models
  {
    id: 'black-forest-labs/flux-dev-lora',
    name: 'Flux Dev',
    imageInput: true,
    aspectRatio: {
      type: 'ratio',
      supportedRatios: [
        '1:1',
        '16:9',
        '9:16',
        '4:3',
        '3:4',
        '3:2',
        '2:3',
        '21:9',
        '9:21',
        '4:5',
        '5:4',
      ],
      defaultRatio: '1:1',
    },
  },
  {
    id: 'black-forest-labs/flux-kontext-pro',
    name: 'Flux Kontext Pro',
    imageInput: true,
    aspectRatio: {
      type: 'ratio',
      supportedRatios: [
        '1:1',
        '16:9',
        '9:16',
        '4:3',
        '3:4',
        '3:2',
        '2:3',
        '21:9',
        '9:21',
        '4:5',
        '5:4',
      ],
      defaultRatio: '1:1',
    },
  },

  // Leonardo AI
  {
    id: 'leonardoai/phoenix-1.0',
    name: 'Phoenix 1.0',
    imageInput: false,
    aspectRatio: {
      type: 'ratio',
      supportedRatios: [
        '1:1',
        '16:9',
        '9:16',
        '3:2',
        '2:3',
        '4:5',
        '5:4',
        '3:4',
        '4:3',
        '2:1',
        '1:2',
        '3:1',
        '1:3',
      ],
      defaultRatio: '3:2',
    },
  },

  // Ideogram
  {
    id: 'ideogram-ai/ideogram-v3-turbo',
    name: 'Ideogram V3 Turbo',
    imageInput: false,
    aspectRatio: {
      type: 'ratio',
      supportedRatios: ['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3'],
      defaultRatio: '1:1',
    },
  },

  // ByteDance
  {
    id: 'bytedance/seedream-3',
    name: 'Seedream-3',
    imageInput: false,
    aspectRatio: {
      type: 'ratio',
      supportedRatios: ['1:1', '3:4', '4:3', '16:9', '9:16', '2:3', '3:2', '21:9'],
      defaultRatio: '16:9',
    },
  },
]

export const languageModels = [
  { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini' },
  { id: 'gpt-4o', name: 'GPT-4o' },
]
