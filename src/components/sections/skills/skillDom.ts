import { prefersReducedMotion } from '@/utils/scroll'

/** DOM id of a category card. */
export function skillCardId(categoryId: string): string {
  return `expertise-card-${categoryId}`
}

/** DOM id of a category card's title. */
export function skillTitleId(categoryId: string): string {
  return `expertise-title-${categoryId}`
}

/** Height of the fixed navigation bar: what covers the top of the page when the category index is not pinned. */
const NAVBAR_HEIGHT = 72

/** Space kept between a card brought into view and the edges of the visible area. */
const MARGIN = 16

/**
 * Scrolls just far enough to show the whole card, and not at all when it is
 * already visible. `index` is the category index: while a category is
 * spotlighted it is pinned below the navigation bar and covers the top of the
 * page, so the card is placed underneath it.
 */
export function bringCardIntoView(card: HTMLElement, index: HTMLElement | null): void {
  let covered = NAVBAR_HEIGHT
  if (index) {
    const style = getComputedStyle(index)
    if (style.position === 'sticky') covered = (Number.parseFloat(style.top) || 0) + index.offsetHeight
  }

  const top = covered + MARGIN
  const bottom = window.innerHeight - MARGIN
  const rect = card.getBoundingClientRect()
  if (rect.top >= top && rect.bottom <= bottom) return

  // Align the top when the card is above the visible area (or taller than it), otherwise the bottom.
  const fits = rect.height <= bottom - top
  const distance = rect.top < top || !fits ? rect.top - top : rect.bottom - bottom

  window.scrollBy({ top: distance, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

/** Centres a button inside the scrolling line of the category index (small screens). */
export function centreInTrack(button: HTMLElement): void {
  const track = button.parentElement
  if (!track || track.scrollWidth <= track.clientWidth) return

  track.scrollTo({
    left: button.offsetLeft - (track.clientWidth - button.offsetWidth) / 2,
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  })
}
