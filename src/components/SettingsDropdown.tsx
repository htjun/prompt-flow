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
import { useModelSystem } from '@/hooks/useModelSystem'

interface SettingsDropdownProps {
  nodeId?: string
}

const SettingsDropdown = ({ nodeId }: SettingsDropdownProps) => {
  const modelSystem = useModelSystem()

  // Get effective settings (node-specific or global)
  const currentImageModel = modelSystem.getEffectiveImageModel(nodeId)
  const currentLanguageModel = modelSystem.getEffectiveLanguageModel(nodeId)
  const currentAspectRatio = modelSystem.getEffectiveAspectRatio(nodeId)

  // Handler functions using the unified API
  const handleImageModelChange = (modelId: string) => {
    modelSystem.setImageModel(modelId, nodeId)
  }

  const handleLanguageModelChange = (modelId: string) => {
    modelSystem.setLanguageModel(modelId, nodeId)
  }

  const handleAspectRatioChange = (ratio: string) => {
    modelSystem.setAspectRatio(ratio, nodeId)
  }

  const getSelectedImageModelName = () => {
    return modelSystem.service.getModelName(currentImageModel)
  }

  const getSelectedLanguageModelName = () => {
    return modelSystem.service.getModelName(currentLanguageModel)
  }

  const availableRatios = modelSystem.service.getAvailableRatiosForModel(currentImageModel)
  
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
            options={modelSystem.service.getAvailableImageModels().map((model) => ({
              value: model.id,
              label: model.name,
            }))}
          />
          <RadioGroupSubmenu
            label={getSelectedLanguageModelName()}
            value={currentLanguageModel}
            onValueChange={handleLanguageModelChange}
            options={modelSystem.service.getAvailableLanguageModels().map((model) => ({
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
