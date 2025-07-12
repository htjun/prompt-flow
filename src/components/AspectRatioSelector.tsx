import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useModelStore } from '@/stores/modelStore'
import { AspectRatioService } from '@/lib/aspectRatioService'
import { useEffect } from 'react'

export const AspectRatioSelector = () => {
  const { selectedImageModel, selectedAspectRatio, setSelectedAspectRatio } = useModelStore()

  const availableRatios = AspectRatioService.getAvailableRatios(selectedImageModel)
  const defaultRatio = AspectRatioService.getDefaultRatio(selectedImageModel)

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

  return (
    <Select value={selectedAspectRatio} onValueChange={setSelectedAspectRatio}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Aspect Ratio" />
      </SelectTrigger>
      <SelectContent>
        {availableRatios.map((ratio) => (
          <SelectItem key={ratio} value={ratio}>
            {ratioLabels[ratio] || ratio}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
