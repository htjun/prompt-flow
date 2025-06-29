import { cn } from '@/lib/utils'
import { Loader2Icon } from 'lucide-react'
import { ActionGroup, type ActionItem } from './ActionGroup'

type NodeTextInputProps = {
  label?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  actions: ActionItem[]
  isLoading?: boolean
  className?: string
}

export const NodeTextInput = ({
  label = 'Prompt',
  placeholder = 'Enter your prompt',
  value,
  onChange,
  actions,
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
              className="field-sizing-content min-h-16 w-full flex-1 resize-none border-none bg-transparent px-2.5 py-1.5 text-sm text-gray-800 outline-none"
              value={value}
              placeholder={placeholder}
              onChange={(e) => onChange(e.target.value)}
            />
            <ActionGroup actions={actions} isDisabled={!value.trim()} />
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
