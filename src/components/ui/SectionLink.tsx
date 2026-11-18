import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import type { SectionId } from '@/types/content'
import { scrollToSection, sectionHref } from '@/utils/scroll'

interface SectionLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** Home-page section to go to. */
  section: SectionId
  /** Runs after the link is activated, e.g. to close the mobile menu. */
  onNavigate?: () => void
}

/**
 * Link to a section of the home page.
 *
 * - On the home page it scrolls smoothly (respecting reduced motion), works
 *   every time it is clicked, moves focus to the section, and keeps the URL
 *   hash in sync without adding history entries.
 * - On any other page (the 404 page) it is a normal link back to the home
 *   page, landing on the section.
 *
 * Always use this for in-page navigation instead of a plain <a href="#...">.
 * Combine with `buttonClasses()` to render it as a button.
 */
export function SectionLink({ section, onNavigate, onClick, children, ...props }: SectionLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return

    const isPlainClick =
      event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey

    // The target exists only on the home page; elsewhere let the browser follow the link.
    if (isPlainClick && document.getElementById(section)) {
      event.preventDefault()
      scrollToSection(section)
      const url = section === 'home' ? window.location.pathname + window.location.search : `#${section}`
      window.history.replaceState(window.history.state, '', url)
    }

    onNavigate?.()
  }

  return (
    <a href={sectionHref(section)} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
