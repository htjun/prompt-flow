'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export type ActionItem = {
  label: string
  onClick?: () => void
  disabled?: boolean
  isPrimary?: boolean
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
  const secondaryActions = actions.filter((action) => !action.isPrimary)
  const primaryActions = actions.filter((action) => action.isPrimary)

  const DropdownAction = ({ action }: { action: ActionItem }) => {
    const [open, setOpen] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleMouseEnter = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      setOpen(true)
    }

    const handleMouseLeave = () => {
      timeoutRef.current = setTimeout(() => {
        setOpen(false)
      }, 150) // Small delay to prevent flickering
    }

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    return (
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="xs"
            disabled={action.disabled || isProcessing || isDisabled}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {action.label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sideOffset={8}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          align="start"
        >
          {action.dropdown!.items.map((item, idx) => (
            <DropdownMenuItem
              key={`${action.label}-item-${idx}-${item.label}`}
              onClick={item.onClick}
              disabled={item.disabled || isProcessing || isDisabled}
              className="text-xs font-medium hover:cursor-pointer"
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const renderAction = (action: ActionItem, index: number, keyPrefix: string) => {
    const actionKey = `${keyPrefix}-${index}`

    if (action.dropdown) {
      return <DropdownAction key={actionKey} action={action} />
    }

    return (
      <Button
        key={actionKey}
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
      <div className="flex gap-1">
        {secondaryActions.map((action, index) => renderAction(action, index, 'secondary'))}
      </div>

      <div className="flex gap-1">
        {primaryActions.map((action, index) => renderAction(action, index, 'primary'))}
      </div>
    </div>
  )
}
