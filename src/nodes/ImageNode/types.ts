export type ImageNodeData = {
  imageData?: string
  isLoading?: boolean
  hasError?: boolean
  modelUsed?: string
  aspectRatio?: string
}

export type ImageNodeProps = {
  id: string
  data: ImageNodeData
}
