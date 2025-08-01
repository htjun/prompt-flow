import { Button } from '@/components/ui/button'
import { ChevronRightIcon } from 'lucide-react'

const MenuPanel = () => {
  return (
    <div className="flex items-center justify-center gap-2 rounded-full border border-slate-400/30 bg-white px-4 py-2">
      <img src="/logo.svg" alt="Logo" width={20} height={20} />
      <div className="flex items-center">
        <Button variant="ghost" size="xs">
          Projects
        </Button>
        <ChevronRightIcon className="size-3.5 text-slate-400" />
        <Button variant="ghost" size="xs" disabled>
          Untitled
        </Button>
      </div>
    </div>
  )
}

export default MenuPanel
