import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from './ui/dropdown-menu'
import { RadioGroupSubmenu } from './ui/RadioGroupSubmenu'
import { Button } from './ui/button'
import { Settings2 } from 'lucide-react'
import { imageModels, languageModels } from '@/constants/models'

const SettingsDropdown = () => {
  const [selectedImageModel, setSelectedImageModel] = useState<string>('google/imagen-4-fast')
  const [selectedLanguageModel, setSelectedLanguageModel] = useState<string>('gpt-4o')

  const getSelectedImageModelName = () => {
    return imageModels.find((model) => model.id === selectedImageModel)?.name || ''
  }

  const getSelectedLanguageModelName = () => {
    return languageModels.find((model) => model.id === selectedLanguageModel)?.name || ''
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
          <DropdownMenuGroup></DropdownMenuGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SettingsDropdown
