import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from './ui/dropdown-menu'
import { RadioGroupSubmenu } from './ui/RadioGroupSubmenu'
import { Button } from './ui/button'
import { Settings2 } from 'lucide-react'
import { imageModels, languageModels } from '@/constants/models'
import { useModelStore } from '@/stores/modelStore'
import { AspectRatioService } from '@/lib/aspectRatioService'

const SettingsDropdown = () => {
  const {
    selectedImageModel,
    selectedLanguageModel,
    selectedAspectRatio,
    setSelectedImageModel,
    setSelectedLanguageModel,
    setSelectedAspectRatio,
  } = useModelStore()

  const getSelectedImageModelName = () => {
    return imageModels.find((model) => model.id === selectedImageModel)?.name || ''
  }

  const getSelectedLanguageModelName = () => {
    return languageModels.find((model) => model.id === selectedLanguageModel)?.name || ''
  }

  const availableRatios = AspectRatioService.getAvailableRatios(selectedImageModel)
  
  const ratioLabels: Record<string, string> = {
    '1:1': 'Square (1:1)',
    '16:9': 'Landscape (16:9)',
    '9:16': 'Portrait (9:16)',
    '4:3': 'Landscape (4:3)',
    '3:4': 'Portrait (3:4)',
    '3:2': 'Landscape (3:2)',
    '2:3': 'Portrait (2:3)',
  }

  const getSelectedAspectRatioLabel = () => {
    return ratioLabels[selectedAspectRatio] || selectedAspectRatio
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="xs">
          <Settings2 className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Models</DropdownMenuLabel>
        <DropdownMenuGroup>
          <RadioGroupSubmenu
            label={getSelectedImageModelName()}
            value={selectedImageModel}
            onValueChange={setSelectedImageModel}
            options={imageModels.map((model) => ({
              value: model.id,
              label: model.name,
            }))}
          />
          <RadioGroupSubmenu
            label={getSelectedLanguageModelName()}
            value={selectedLanguageModel}
            onValueChange={setSelectedLanguageModel}
            options={languageModels.map((model) => ({
              value: model.id,
              label: model.name,
            }))}
          />
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Image Options</DropdownMenuLabel>
          <DropdownMenuGroup>
            <RadioGroupSubmenu
              label={getSelectedAspectRatioLabel()}
              value={selectedAspectRatio}
              onValueChange={setSelectedAspectRatio}
              options={availableRatios.map((ratio) => ({
                value: ratio,
                label: ratioLabels[ratio] || ratio,
              }))}
            />
          </DropdownMenuGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SettingsDropdown
