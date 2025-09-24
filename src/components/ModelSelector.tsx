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
import { useModelSystem } from '@/hooks/useModelSystem'

export const ModelSelector = () => {
  const modelSystem = useModelSystem()

  const selectedLanguageModel = modelSystem.global.selectedLanguageModel
  const selectedImageModel = modelSystem.global.selectedImageModel

  const setSelectedLanguageModel = modelSystem.global.setSelectedLanguageModel
  const setSelectedImageModel = modelSystem.global.setSelectedImageModel

  const getSelectedImageModelName = () => {
    return modelSystem.service.getModelName(selectedImageModel)
  }

  const getSelectedLanguageModelName = () => {
    return modelSystem.service.getModelName(selectedLanguageModel)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="xs" className="text-gray-500">
          <span className="text-xs">{getSelectedImageModelName()}</span>
          <span className="text-xs opacity-30">/</span>
          <span className="text-xs">{getSelectedLanguageModelName()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs">Image Model</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={selectedImageModel} onValueChange={setSelectedImageModel}>
            {modelSystem.service.getAvailableImageModels().map((model) => (
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
            {modelSystem.service.getAvailableLanguageModels().map((model) => (
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
