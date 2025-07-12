import Image from 'next/image'
import { ModelSelector } from './ModelSelector'
import { AspectRatioSelector } from './AspectRatioSelector'

export const Header = () => {
  return (
    <header className="bg-background flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="Logo" className="h-3.5 w-3.5" width={14} height={14} />
        <h1 className="text-sm font-medium">Prompt Flow</h1>
      </div>
      <div className="flex items-center gap-2">
        <ModelSelector />
        <AspectRatioSelector />
      </div>
    </header>
  )
}
