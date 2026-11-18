import { useEffect } from 'react'

/**
 * Prevents the page behind an overlay (mobile menu, dialog) from scrolling.
 * Compensates for the scrollbar width so the layout does not shift.
 */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return

    const { style } = document.body
    const previousOverflow = style.overflow
    const previousPaddingRight = style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    style.overflow = 'hidden'
    if (scrollbarWidth > 0) style.paddingRight = `${scrollbarWidth}px`

    return () => {
      style.overflow = previousOverflow
      style.paddingRight = previousPaddingRight
    }
  }, [locked])
}
