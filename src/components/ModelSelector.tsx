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
import { imageModels, languageModels } from '@/constants/models'

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
