import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { imageModels, languageModels } from '@/constants/models'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

// Helper function to get display name from any model ID
export const getModelDisplayName = (modelId: string): string => {
  const allModels = [...imageModels, ...languageModels]
  const model = allModels.find((m) => m.id === modelId)
  return model?.name || modelId
}
