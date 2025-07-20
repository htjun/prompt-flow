'use client'

import { ReactNode, cloneElement, isValidElement, Children } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useHoverDropdown } from '@/hooks/useHoverDropdown'
import { cn } from '@/lib/utils'

type ActionGroupProps = {
  children: ReactNode
  isProcessing?: boolean
  isDisabled?: boolean
  className?: string
}

type ActionButtonProps = {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

type ActionDropdownProps = {
  label: ReactNode
  children: ReactNode
  disabled?: boolean
  className?: string
}

type ActionDropdownItemProps = {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
}

export const ActionButton = ({ children, onClick, disabled, className }: ActionButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="xs"
      className={cn('rounded-lg hover:cursor-pointer', className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  )
}

export const ActionDropdownItem = ({ children, onClick, disabled }: ActionDropdownItemProps) => {
  return (
    <DropdownMenuItem
      onClick={onClick}
      disabled={disabled}
      className="text-xs font-medium hover:cursor-pointer"
    >
      {children}
    </DropdownMenuItem>
  )
}

export const ActionDropdown = ({ label, children, disabled, className }: ActionDropdownProps) => {
  const { open, onOpenChange, onPointerEnter, onPointerLeave } = useHoverDropdown(150)

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange} modal={false}>
      <DropdownMenuTrigger asChild className="data-[state=open]:bg-accent">
        <Button
          variant="ghost"
          size="xs"
          disabled={disabled}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          className={cn('rounded-lg', className)}
        >
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={8}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onCloseAutoFocus={(event) => event.preventDefault()}
        align="start"
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const ActionGroup = ({
  children,
  isProcessing = false,
  isDisabled = false,
  className,
}: ActionGroupProps) => {
  const processChildren = (children: ReactNode) => {
    return Children.map(children, (child) => {
      if (isValidElement(child)) {
        // Apply global disabled/processing state to action components
        if (child.type === ActionButton || child.type === ActionDropdown) {
          return cloneElement(child, {
            ...(child.props as any),
            disabled: (child.props as any).disabled || isProcessing || isDisabled,
          })
        }
      }
      return child
    })
  }

  const processedChildren = processChildren(children)

  return <div className={`flex justify-between p-1 ${className || ''}`}>{processedChildren}</div>
}
