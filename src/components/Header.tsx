import { ModelSelector } from './ModelSelector'

export const Header = () => {
  return (
    <div className="flex w-full items-center justify-between border-b bg-white/70 px-4 py-1 backdrop-blur-xs">
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="Logo" className="h-3.5 w-3.5" />
        <h1 className="text-xs font-medium tracking-tight">Prompt Flow</h1>
      </div>
      <ModelSelector />
    </div>
  )
}
