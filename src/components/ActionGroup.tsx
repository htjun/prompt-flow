'use client'

import {
  useState,
  useRef,
  useEffect,
  ReactNode,
  cloneElement,
  isValidElement,
  Children,
} from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
  label: string
  children: ReactNode
  disabled?: boolean
  className?: string
}

type ActionDropdownItemProps = {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
}

// Individual action components
export const ActionButton = ({ children, onClick, disabled, className }: ActionButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="xs"
      className={`hover:cursor-pointer ${className || ''}`}
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
          disabled={disabled}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={className}
        >
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={8}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        align="start"
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Main ActionGroup component
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
