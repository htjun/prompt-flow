import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Improved image data structure
interface ImageData {
  imageData: string
  modelUsed: string
  prompt: string
  createdAt: number
}

interface OperationState {
  status: 'idle' | 'loading' | 'success' | 'error'
  error?: string
  timestamp: number
}

interface ImageState {
  // Normalized image storage by node ID
  images: Record<string, ImageData>

  // Operation tracking per image
  operations: Record<string, OperationState>

  // UI state
  ui: {
    selectedImageId: string | null
    viewMode: 'grid' | 'list'
  }

  // Actions
  setImageData: (nodeId: string, data: Omit<ImageData, 'createdAt'>) => void
  removeImage: (nodeId: string) => void

  // Operation management
  setOperationStatus: (nodeId: string, status: Omit<OperationState, 'timestamp'>) => void
  clearOperation: (nodeId: string) => void

  // Selectors
  getImageData: (nodeId: string) => ImageData | null
  getOperationStatus: (nodeId: string) => OperationState['status']
  getOperationError: (nodeId: string) => string | undefined
  getAllImages: () => ImageData[]

  // UI actions
  setSelectedImage: (nodeId: string | null) => void
  setViewMode: (mode: 'grid' | 'list') => void

  // Cleanup and memory management
  clearAllImages: () => void
  pruneOldImages: (maxAge: number) => void
  limitImageCount: (maxImages: number) => void
  cleanup: () => void
}

export const useImageStore = create<ImageState>()(
  devtools(
    (set, get) => ({
      // Initial state
      images: {},
      operations: {},
      ui: {
        selectedImageId: null,
        viewMode: 'grid',
      },

      // Image data management
      setImageData: (nodeId, data) =>
        set(
          (state) => ({
            images: {
              ...state.images,
              [nodeId]: {
                ...data,
                createdAt: Date.now(),
              },
            },
          }),
          false,
          'setImageData'
        ),

      removeImage: (nodeId) =>
        set(
          (state) => {
            const { [nodeId]: removed, ...rest } = state.images
            const { [nodeId]: removedOp, ...restOps } = state.operations
            return {
              images: rest,
              operations: restOps,
              ui: {
                ...state.ui,
                selectedImageId:
                  state.ui.selectedImageId === nodeId ? null : state.ui.selectedImageId,
              },
            }
          },
          false,
          'removeImage'
        ),

      // Operation management
      setOperationStatus: (nodeId, statusUpdate) =>
        set(
          (state) => ({
            operations: {
              ...state.operations,
              [nodeId]: {
                ...statusUpdate,
                timestamp: Date.now(),
              },
            },
          }),
          false,
          'setOperationStatus'
        ),

      clearOperation: (nodeId) =>
        set(
          (state) => {
            const { [nodeId]: removed, ...rest } = state.operations
            return { operations: rest }
          },
          false,
          'clearOperation'
        ),

      // Selectors
      getImageData: (nodeId) => get().images[nodeId] || null,
      getOperationStatus: (nodeId) => get().operations[nodeId]?.status || 'idle',
      getOperationError: (nodeId) => get().operations[nodeId]?.error,
      getAllImages: () => Object.values(get().images),

      // UI actions
      setSelectedImage: (nodeId) =>
        set(
          (state) => ({
            ui: { ...state.ui, selectedImageId: nodeId },
          }),
          false,
          'setSelectedImage'
        ),

      setViewMode: (mode) =>
        set(
          (state) => ({
            ui: { ...state.ui, viewMode: mode },
          }),
          false,
          'setViewMode'
        ),

      // Cleanup and memory management
      clearAllImages: () =>
        set(
          {
            images: {},
            operations: {},
            ui: {
              selectedImageId: null,
              viewMode: 'grid',
            },
          },
          false,
          'clearAllImages'
        ),

      pruneOldImages: (maxAge) => {
        const cutoffTime = Date.now() - maxAge
        set(
          (state) => {
            const filteredImages: Record<string, ImageData> = {}
            const filteredOperations: Record<string, OperationState> = {}

            Object.entries(state.images).forEach(([nodeId, imageData]) => {
              if (imageData.createdAt > cutoffTime) {
                filteredImages[nodeId] = imageData
                if (state.operations[nodeId]) {
                  filteredOperations[nodeId] = state.operations[nodeId]
                }
              }
            })

            return {
              images: filteredImages,
              operations: filteredOperations,
              ui: {
                ...state.ui,
                selectedImageId: filteredImages[state.ui.selectedImageId || '']
                  ? state.ui.selectedImageId
                  : null,
              },
            }
          },
          false,
          'pruneOldImages'
        )
      },

      limitImageCount: (maxImages) => {
        const { images } = get()
        const imageEntries = Object.entries(images)

        if (imageEntries.length <= maxImages) return

        const sortedImages = imageEntries.sort(([, a], [, b]) => b.createdAt - a.createdAt)
        const imagesToKeep = sortedImages.slice(0, maxImages)

        const filteredImages: Record<string, ImageData> = {}
        const filteredOperations: Record<string, OperationState> = {}

        imagesToKeep.forEach(([nodeId, imageData]) => {
          filteredImages[nodeId] = imageData
          const operation = get().operations[nodeId]
          if (operation) {
            filteredOperations[nodeId] = operation
          }
        })

        set(
          (state) => ({
            images: filteredImages,
            operations: filteredOperations,
            ui: {
              ...state.ui,
              selectedImageId: filteredImages[state.ui.selectedImageId || '']
                ? state.ui.selectedImageId
                : null,
            },
          }),
          false,
          'limitImageCount'
        )
      },

      cleanup: () => get().clearAllImages(),
    }),
    { name: 'image-store' }
  )
)

// Reusable selectors for better performance
export const selectImageById = (nodeId: string) => (state: ImageState) =>
  state.images[nodeId] || null

export const selectOperationStatusById = (nodeId: string) => (state: ImageState) =>
  state.operations[nodeId]?.status || 'idle'

export const selectOperationErrorById = (nodeId: string) => (state: ImageState) =>
  state.operations[nodeId]?.error

export const selectAllImages = (state: ImageState) => Object.values(state.images)

export const selectSelectedImageId = (state: ImageState) => state.ui.selectedImageId

export const selectViewMode = (state: ImageState) => state.ui.viewMode

// Derived selectors
export const selectIsImageLoading = (nodeId: string) => (state: ImageState) =>
  state.operations[nodeId]?.status === 'loading'

export const selectHasImageError = (nodeId: string) => (state: ImageState) =>
  state.operations[nodeId]?.status === 'error'

export const selectImageCount = (state: ImageState) => Object.keys(state.images).length

export const selectRecentImages =
  (limit: number = 10) =>
  (state: ImageState) =>
    Object.values(state.images)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit)
