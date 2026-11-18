import { useCallback, useSyncExternalStore } from 'react'

function subscribeToScroll(onChange: () => void): () => void {
  window.addEventListener('scroll', onChange, { passive: true })
  return () => window.removeEventListener('scroll', onChange)
}

/** True once the page has been scrolled further than `threshold` pixels. */
export function useScrolled(threshold = 8): boolean {
  const getSnapshot = useCallback(() => window.scrollY > threshold, [threshold])
  return useSyncExternalStore(subscribeToScroll, getSnapshot, () => false)
}
