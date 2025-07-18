import { useState, useRef, useCallback } from 'react'

export const useHoverDropdown = (delay = 150) => {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handlePointerEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setOpen(true)
  }, [])

  const handlePointerLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false)
    }, delay)
  }, [delay])

  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setOpen(newOpen)
  }, [])

  return {
    open,
    onOpenChange: handleOpenChange,
    onPointerEnter: handlePointerEnter,
    onPointerLeave: handlePointerLeave,
  }
}
