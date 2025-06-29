import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDownIcon } from 'lucide-react'

export type ActionItem = {
  label: string
  onClick?: () => void
  disabled?: boolean
  isInternal?: boolean
  dropdown?: {
    items: Array<{
      label: string
      onClick: () => void
      disabled?: boolean
    }>
  }
}

type ActionGroupProps = {
  actions: ActionItem[]
  isProcessing?: boolean
  isDisabled?: boolean
  className?: string
}

export const ActionGroup = ({
  actions,
  isProcessing = false,
  isDisabled = false,
  className,
}: ActionGroupProps) => {
  const internalActions = actions.filter((action) => action.isInternal)
  const externalActions = actions.filter((action) => !action.isInternal)

  const renderAction = (action: ActionItem, index: number, keyPrefix: string) => {
    if (action.dropdown) {
      return (
        <DropdownMenu key={`${keyPrefix}-${index}`}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="xs"
              className="hover:cursor-pointer"
              disabled={action.disabled || isProcessing || isDisabled}
            >
              {action.label}
              <ChevronDownIcon className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {action.dropdown.items.map((item, idx) => (
              <DropdownMenuItem
                key={idx}
                onClick={item.onClick}
                disabled={item.disabled || isProcessing || isDisabled}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <Button
        key={`${keyPrefix}-${index}`}
        variant="ghost"
        size="xs"
        className="hover:cursor-pointer"
        onClick={action.onClick}
        disabled={action.disabled || isProcessing || isDisabled}
      >
        {action.label}
      </Button>
    )
  }

  return (
    <div className={`flex justify-between p-1 ${className || ''}`}>
      <div className="flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {internalActions.map((action, index) => renderAction(action, index, 'internal'))}
      </div>

      <div className="flex gap-1">
        {externalActions.map((action, index) => renderAction(action, index, 'external'))}
      </div>
    </div>
  )
}
