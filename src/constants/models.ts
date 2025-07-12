interface AspectRatioConfig {
  type: 'dimensions' | 'ratio' | 'size' // How the model expects aspect ratio
  supportedRatios: string[] // e.g., ['1:1', '16:9', '9:16', '4:3', '3:4']
  defaultRatio: string
  // Optional custom dimensions for specific ratios
  customDimensions?: Record<string, { width: number; height: number }>
}

interface ImageModel {
  id: string
  name: string
  imageInput: boolean
  aspectRatio: AspectRatioConfig
}

export const imageModels: ImageModel[] = [
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
  {
    id: 'black-forest-labs/flux-dev-lora',
    name: 'Flux Dev',
    imageInput: true,
    aspectRatio: {
      type: 'ratio',
      supportedRatios: ['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3', '21:9', '9:21', '4:5', '5:4'],
      defaultRatio: '1:1',
    },
  },
  {
    id: 'black-forest-labs/flux-kontext-pro',
    name: 'Flux Kontext Pro',
    imageInput: true,
    aspectRatio: {
      type: 'ratio',
      supportedRatios: ['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3', '21:9', '9:21', '4:5', '5:4'],
      defaultRatio: '1:1',
    },
  },
  {
    id: 'leonardoai/phoenix-1.0',
    name: 'Phoenix 1.0',
    imageInput: false,
    aspectRatio: {
      type: 'size',
      supportedRatios: ['1:1', '16:9', '9:16'],
      defaultRatio: '1:1',
      customDimensions: {
        '1:1': { width: 1024, height: 1024 },
        '16:9': { width: 1344, height: 768 },
        '9:16': { width: 768, height: 1344 },
      },
    },
  },
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
]

export const languageModels = [
  { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini' },
  { id: 'gpt-4o', name: 'GPT-4o' },
]
