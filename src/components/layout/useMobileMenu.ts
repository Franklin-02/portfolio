import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { useMediaQuery } from '@/hooks/useMediaQuery'

/** Tailwind's `xl` breakpoint: from here up the full link row replaces the hamburger menu. */
const DESKTOP_QUERY = '(min-width: 80rem)'

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Focusable elements that are actually rendered (skips `display: none` and `visibility: hidden`). */
function visibleFocusables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden',
  )
}

interface MobileMenuController {
  open: boolean
  /** Attach to the element holding both the toggle and the menu. Focus is kept inside it. */
  scopeRef: RefObject<HTMLElement | null>
  /** Attach to the toggle button. Focus returns to it when the menu is dismissed. */
  toggleRef: RefObject<HTMLButtonElement | null>
  toggle: () => void
  /** Closes the menu and returns focus to the toggle (Escape, backdrop, toggle). */
  dismiss: () => void
  /** Call just before a link inside the scope is followed. */
  beforeNavigate: () => void
  /** Call after a link inside the scope was followed. */
  afterNavigate: () => void
}

/**
 * State and accessibility behaviour of the hamburger menu:
 *
 * - page scrolling is locked while it is open;
 * - Escape closes it and focus goes back to the toggle;
 * - focus cannot leave the header: Tab wraps around inside it and the rest of
 *   the page is inert (out of the tab order and hidden from assistive tech);
 * - reaching the desktop breakpoint closes it.
 *
 * Destructure the result where it is used: the lint rules treat an object
 * that carries refs as a ref itself.
 *
 * @param menuId DOM id of the element that contains the menu links.
 */
export function useMobileMenu(menuId: string): MobileMenuController {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery(DESKTOP_QUERY)

  const scopeRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const releasePageRef = useRef<(() => void) | null>(null)

  // The menu does not exist on desktop layouts: reaching the breakpoint closes it,
  // so it does not reappear when the window is narrowed again.
  if (isDesktop && open) setOpen(false)

  useLockBodyScroll(open)

  const dismiss = useCallback(() => {
    setOpen(false)
    toggleRef.current?.focus()
  }, [])

  const toggle = useCallback(() => {
    if (open) dismiss()
    else setOpen(true)
  }, [open, dismiss])

  const beforeNavigate = useCallback(() => {
    // The link is about to move focus to its target section, which must be focusable again.
    releasePageRef.current?.()
  }, [])

  const afterNavigate = useCallback(() => {
    setOpen(false)
    // Normally focus has already moved to the target section. If it is still on a
    // menu link (for example the link was opened in a new tab), that link is about
    // to disappear, so hand focus back to the toggle.
    if (document.getElementById(menuId)?.contains(document.activeElement)) toggleRef.current?.focus()
  }, [menuId])

  useEffect(() => {
    if (!open) return
    const scope = scopeRef.current
    if (!scope) return

    // Everything outside the header becomes inert while the menu is open.
    const outside = Array.from(scope.parentElement?.children ?? []).filter(
      (element): element is HTMLElement => element instanceof HTMLElement && element !== scope && !element.inert,
    )
    const releasePage = () => {
      for (const element of outside) element.inert = false
    }
    for (const element of outside) element.inert = true
    releasePageRef.current = releasePage

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dismiss()
        return
      }
      if (event.key !== 'Tab') return

      const focusables = visibleFocusables(scope)
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const current = document.activeElement

      if (!scope.contains(current)) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
      } else if (event.shiftKey && current === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && current === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      releasePage()
      releasePageRef.current = null
    }
  }, [open, dismiss])

  return { open, scopeRef, toggleRef, toggle, dismiss, beforeNavigate, afterNavigate }
}
