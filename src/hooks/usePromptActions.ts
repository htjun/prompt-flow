import { usePromptStore } from '@/stores/promptStore'

export const usePromptActions = () => {
  const prompt = usePromptStore((s) => s.prompt)
  const setPrompt = usePromptStore((s) => s.setPrompt)
  const setEnhancedPrompt = usePromptStore((s) => s.setEnhancedPrompt)
  const getEnhancedPrompt = usePromptStore((s) => s.getEnhancedPrompt)
  const getEnhancedPromptStatus = usePromptStore((s) => s.getEnhancedPromptStatus)
  return {
    prompt,
    setPrompt,
    setEnhancedPrompt,
    getEnhancedPrompt,
    getEnhancedPromptStatus,
  }
}
