import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { CopyIcon, DownloadIcon, CheckIcon } from 'lucide-react'
import { getImageSrc } from './utils'

type ImageDisplayProps = {
  imageData: string
  copySuccess: boolean
  onCopy: () => void
  onDownload: () => void
}

export const ImageDisplay = ({ imageData, copySuccess, onCopy, onDownload }: ImageDisplayProps) => {
  return (
    <div className="group relative space-y-2 px-2 pt-2">
      <div className="absolute top-3 right-3 flex rounded-md bg-neutral-800/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer hover:bg-neutral-800/50"
              onClick={onCopy}
            >
              {copySuccess ? (
                <CheckIcon className="h-4 w-4 text-white" />
              ) : (
                <CopyIcon className="h-4 w-4 text-white" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy image</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer hover:bg-neutral-800/50"
              onClick={onDownload}
            >
              <DownloadIcon className="h-4 w-4 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Download image</TooltipContent>
        </Tooltip>
      </div>
      <Image
        src={getImageSrc(imageData)}
        alt="Generated image"
        className="h-auto w-full rounded-sm"
        width={0}
        height={0}
        sizes="100vw"
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}
