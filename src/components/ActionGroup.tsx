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

  const DropdownAction = ({
    action,
    index,
    keyPrefix,
  }: {
    action: ActionItem
    index: number
    keyPrefix: string
  }) => {
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
      return <DropdownAction key={actionKey} action={action} index={index} keyPrefix={keyPrefix} />
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
      <div className="flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {internalActions.map((action, index) => renderAction(action, index, 'internal'))}
      </div>

      <div className="flex gap-1">
        {externalActions.map((action, index) => renderAction(action, index, 'external'))}
      </div>
    </div>
  )
}
