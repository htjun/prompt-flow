import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useModelStore } from '@/stores/modelStore'

const imageModels = [
  { id: 'google/imagen-4-fast', name: 'Imagen 4 Fast' },
  { id: 'google/imagen-4', name: 'Imagen 4' },
  { id: 'openai/gpt-image-1', name: 'GPT Image 1' },
  { id: 'stability-ai/flux-dev', name: 'Flux Dev' },
  { id: 'stability-ai/flux-kontext-pro', name: 'Flux Kontext Pro' },
  { id: 'fal-ai/phoenix-1.0', name: 'Phoenix 1.0' },
  { id: 'ideogram/ideogram-v3-turbo', name: 'Ideogram v3 Turbo' },
]

const languageModels = [
  { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini' },
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'claude-3.5-haiku-20241022', name: 'Claude 3.5 Haiku' },
]

export const ModelSelector = () => {
  const {
    selectedLanguageModel,
    setSelectedLanguageModel,
    selectedImageModel,
    setSelectedImageModel,
  } = useModelStore()

  const getSelectedImageModelName = () => {
    return imageModels.find((model) => model.id === selectedImageModel)?.name || ''
  }

  const getSelectedLanguageModelName = () => {
    return languageModels.find((model) => model.id === selectedLanguageModel)?.name || ''
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="xs" className="text-gray-500">
          {getSelectedImageModelName()} / {getSelectedLanguageModelName()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs">Image Model</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={selectedImageModel} onValueChange={setSelectedImageModel}>
            {imageModels.map((model) => (
              <DropdownMenuRadioItem key={model.id} value={model.id} className="text-xs">
                {model.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs">Language Model</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={selectedLanguageModel}
            onValueChange={setSelectedLanguageModel}
          >
            {languageModels.map((model) => (
              <DropdownMenuRadioItem key={model.id} value={model.id} className="text-xs">
                {model.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
