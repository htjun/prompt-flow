import { Textarea } from '@/components/ui/textarea'

export const ParameterInput = ({
  label,
  value,
  onChange,
}: {
  label: string
  value: string | null | undefined
  onChange: (value: string) => void
}) => {
  return (
    <>
      <div className="py-3 text-xs">{label}</div>
      <Textarea
        className="min-h-4 resize-none"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  )
}
