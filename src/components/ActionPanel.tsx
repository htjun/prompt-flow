import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Images, BookText, PlusIcon, Settings2Icon } from 'lucide-react'

type ActionPanelButtonProps = {
  icon: ReactNode
  label: string
}

const ActionPanelButton = ({ icon, label }: ActionPanelButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer rounded-full text-slate-900/50 transition-colors hover:text-slate-900"
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={8} collisionPadding={8}>
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const ActionPanel = () => {
  return (
    <div className="flex items-center justify-center rounded-full border border-slate-400/30 bg-white p-1">
      <ActionPanelButton icon={<PlusIcon className="size-4" />} label="Add Node" />
      <ActionPanelButton icon={<Images className="size-4" />} label="Inspiration" />
      <ActionPanelButton icon={<BookText className="size-4" />} label="Prompt Library" />
      <ActionPanelButton icon={<Settings2Icon className="size-4" />} label="Default Options" />
    </div>
  )
}

export default ActionPanel
