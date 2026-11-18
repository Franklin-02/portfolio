import type { SectionId } from '@/types/content'

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** URL of a home-page section, honouring the deployment base path. */
export function sectionHref(section: SectionId): string {
  return `${import.meta.env.BASE_URL}${section === 'home' ? '' : `#${section}`}`
}

/**
 * Scrolls to a home-page section. Scrolling is smooth unless the visitor
 * prefers reduced motion. Focus moves to the section so keyboard and screen
 * reader users continue from the new position.
 */
export function scrollToSection(id: SectionId): void {
  const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth'

  if (id === 'home') {
    window.scrollTo({ top: 0, behavior })
    document.getElementById(id)?.focus({ preventScroll: true })
    return
  }

  const element = document.getElementById(id)
  if (!element) return
  element.scrollIntoView({ behavior, block: 'start' })
  element.focus({ preventScroll: true })
}

export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}
