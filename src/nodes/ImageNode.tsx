import { Handle, Position } from '@xyflow/react'

type ImageNodeProps = {
  id: string
  data: {
    imageData?: string
    isLoading?: boolean
    hasError?: boolean
    modelUsed?: string
  }
}

export const ImageNode = ({ data }: ImageNodeProps) => {
  const { imageData, isLoading, hasError, modelUsed } = data

  // Get the display name from the model ID
  const getModelDisplayName = (modelId: string) => {
    const modelMap: Record<string, string> = {
      'google/imagen-4-fast': 'Imagen 4 Fast',
      'google/imagen-4': 'Imagen 4',
      'openai/gpt-image-1': 'GPT Image 1',
      'stability-ai/flux-dev': 'Flux Dev',
      'stability-ai/flux-kontext-pro': 'Flux Kontext Pro',
      'fal-ai/phoenix-1.0': 'Phoenix 1.0',
      'ideogram/ideogram-v3-turbo': 'Ideogram v3 Turbo',
    }
    return modelMap[modelId] || modelId
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="node-label geist-mono">Generated Image</div>
      <div className="node-container nodrag flex min-h-60 w-80 flex-col items-center justify-center gap-2 p-2">
        {hasError ? (
          <div className="flex min-h-28 items-center justify-center text-sm text-red-400">
            Failed to generate image
          </div>
        ) : imageData ? (
          <img
            src={`data:image/png;base64,${imageData}`}
            alt="Generated image"
            className="max-h-[500px] max-w-full rounded-sm"
          />
        ) : isLoading ? (
          <div className="flex min-h-28 items-center justify-center text-sm text-gray-400">
            Generating image...
          </div>
        ) : (
          <div className="flex min-h-28 items-center justify-center text-sm text-gray-400">
            No image data
          </div>
        )}
        {modelUsed && (
          <div className="text-xs text-gray-500">Model: {getModelDisplayName(modelUsed)}</div>
        )}
      </div>
      <Handle type="target" position={Position.Left} id="image-input" />
    </div>
  )
}
