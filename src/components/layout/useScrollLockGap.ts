import { useSyncExternalStore } from 'react'

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange)
  observer.observe(document.body, { attributes: true, attributeFilter: ['style'] })
  return () => observer.disconnect()
}

function getSnapshot(): number {
  const { overflow, paddingRight } = document.body.style
  return overflow === 'hidden' ? Number.parseFloat(paddingRight) || 0 : 0
}

/**
 * Width, in pixels, of the page scrollbar while a scroll lock has removed it
 * (0 otherwise, and always 0 where scrollbars overlay the page).
 *
 * `useLockBodyScroll` pads <body> by that width so the page does not jump when
 * the mobile menu or a dialog opens. Fixed elements are not affected by that
 * padding, so the navigation bar and the "Back to top" button read the same
 * value here and offset themselves to stay exactly where they were.
 */
export function useScrollLockGap(): number {
  return useSyncExternalStore(subscribe, getSnapshot, () => 0)
}
