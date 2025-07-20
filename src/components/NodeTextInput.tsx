import { cn } from '@/lib/utils'
import { Loader2Icon } from 'lucide-react'
import { ActionGroup } from './ActionGroup'
import { ReactNode } from 'react'

type NodeTextInputProps = {
  label?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  children: ReactNode
  isLoading?: boolean
  className?: string
}

export const NodeTextInput = ({
  label = 'Prompt',
  placeholder = 'Enter your prompt',
  value,
  onChange,
  children,
  isLoading = false,
  className,
}: NodeTextInputProps) => {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="node-label geist-mono">{label}</div>
      <div className="node-container nodrag group w-80">
        {!isLoading ? (
          <>
            <textarea
              className="field-sizing-content min-h-20 w-full flex-1 resize-none border-none bg-transparent px-2.5 pt-2 text-sm text-gray-800 outline-none"
              value={value}
              placeholder={placeholder}
              onChange={(e) => onChange(e.target.value)}
            />
            <ActionGroup isDisabled={!value.trim()}>{children}</ActionGroup>
          </>
        ) : (
          <div className="nodrag flex min-h-28 items-center justify-center gap-2 text-sm text-gray-400">
            <Loader2Icon className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}
