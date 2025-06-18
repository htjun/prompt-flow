import { Button } from '@/components/ui/button'

export type ActionItem = {
  label: string
  onClick: () => void
  disabled?: boolean
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
  return (
    <div className={`flex justify-end p-1 ${className || ''}`}>
      {actions.map((action, index) => (
        <Button
          key={index}
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
  )
}
