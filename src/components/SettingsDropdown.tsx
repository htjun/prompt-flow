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

interface SettingsDropdownProps {
  nodeId?: string
}

const SettingsDropdown = ({ nodeId }: SettingsDropdownProps) => {
  const {
    selectedImageModel,
    selectedLanguageModel,
    selectedAspectRatio,
    setSelectedImageModel,
    setSelectedLanguageModel,
    setSelectedAspectRatio,
    getNodeSelectedImageModel,
    getNodeSelectedLanguageModel,
    getNodeSelectedAspectRatio,
    setNodeSelectedImageModel,
    setNodeSelectedLanguageModel,
    setNodeSelectedAspectRatio,
  } = useModelStore()

  // Use node-specific settings if nodeId is provided, otherwise use global settings
  const currentImageModel = nodeId ? getNodeSelectedImageModel(nodeId) : selectedImageModel
  const currentLanguageModel = nodeId ? getNodeSelectedLanguageModel(nodeId) : selectedLanguageModel
  const currentAspectRatio = nodeId ? getNodeSelectedAspectRatio(nodeId) : selectedAspectRatio

  const handleImageModelChange = (modelId: string) => {
    if (nodeId) {
      setNodeSelectedImageModel(nodeId, modelId)
    } else {
      setSelectedImageModel(modelId)
    }
  }

  const handleLanguageModelChange = (modelId: string) => {
    if (nodeId) {
      setNodeSelectedLanguageModel(nodeId, modelId)
    } else {
      setSelectedLanguageModel(modelId)
    }
  }

  const handleAspectRatioChange = (ratio: string) => {
    if (nodeId) {
      setNodeSelectedAspectRatio(nodeId, ratio)
    } else {
      setSelectedAspectRatio(ratio)
    }
  }

  const getSelectedImageModelName = () => {
    return imageModels.find((model) => model.id === currentImageModel)?.name || ''
  }

  const getSelectedLanguageModelName = () => {
    return languageModels.find((model) => model.id === currentLanguageModel)?.name || ''
  }

  const availableRatios = AspectRatioService.getAvailableRatios(currentImageModel)
  
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
    return ratioLabels[currentAspectRatio] || currentAspectRatio
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
            value={currentImageModel}
            onValueChange={handleImageModelChange}
            options={imageModels.map((model) => ({
              value: model.id,
              label: model.name,
            }))}
          />
          <RadioGroupSubmenu
            label={getSelectedLanguageModelName()}
            value={currentLanguageModel}
            onValueChange={handleLanguageModelChange}
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
              value={currentAspectRatio}
              onValueChange={handleAspectRatioChange}
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
