import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useModelSystem } from '@/hooks/useModelSystem'
import { useEffect } from 'react'

export const AspectRatioSelector = () => {
  const modelSystem = useModelSystem()

  const selectedImageModel = modelSystem.global.selectedImageModel
  const selectedAspectRatio = modelSystem.global.selectedAspectRatio
  const setSelectedAspectRatio = modelSystem.global.setSelectedAspectRatio

  const availableRatios = modelSystem.service.getAvailableRatiosForModel(selectedImageModel)
  const defaultRatio = modelSystem.service.getDefaultRatioForModel(selectedImageModel)

  // Update aspect ratio when model changes
  useEffect(() => {
    if (!availableRatios.includes(selectedAspectRatio)) {
      setSelectedAspectRatio(defaultRatio)
    }
  }, [
    selectedImageModel,
    availableRatios,
    selectedAspectRatio,
    defaultRatio,
    setSelectedAspectRatio,
  ])

  const ratioLabels: Record<string, string> = {
    '1:1': 'Square (1:1)',
    '16:9': 'Landscape (16:9)',
    '9:16': 'Portrait (9:16)',
    '4:3': 'Landscape (4:3)',
    '3:4': 'Portrait (3:4)',
    '3:2': 'Landscape (3:2)',
    '2:3': 'Portrait (2:3)',
  }

  const getSelectedRatioLabel = () => {
    return ratioLabels[selectedAspectRatio] || selectedAspectRatio
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="xs" className="text-gray-500">
          <span className="text-xs">{getSelectedRatioLabel()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={selectedAspectRatio} onValueChange={setSelectedAspectRatio}>
          {availableRatios.map((ratio) => (
            <DropdownMenuRadioItem key={ratio} value={ratio} className="text-xs">
              {ratioLabels[ratio] || ratio}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
