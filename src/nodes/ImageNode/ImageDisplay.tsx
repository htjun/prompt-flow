import Image from 'next/image'
import { Button } from '@/components/ui/button'
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
      <div className="absolute top-3 right-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
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
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer hover:bg-neutral-800/50"
          onClick={onDownload}
        >
          <DownloadIcon className="h-4 w-4 text-white" />
        </Button>
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