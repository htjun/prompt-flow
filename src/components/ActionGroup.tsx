import { Button } from '@/components/ui/button'

export type ActionItem = {
  label: string
  onClick: () => void
  disabled?: boolean
  isInternal?: boolean
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

  return (
    <div className={`flex justify-between p-1 ${className || ''}`}>
      <div className="flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {internalActions.map((action, index) => (
          <Button
            key={`internal-${index}`}
            variant="ghost"
            size="xs"
            className="hover:cursor-pointer"
            onClick={action.onClick}
            disabled={action.disabled || isProcessing || isDisabled}
          >
            {action.label}
          </Button>
        ))}
      </div>

      <div className="flex gap-1">
        {externalActions.map((action, index) => (
          <Button
            key={`external-${index}`}
            variant="ghost"
            size="xs"
            className="hover:cursor-pointer"
            onClick={action.onClick}
            disabled={action.disabled || isProcessing || isDisabled}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
