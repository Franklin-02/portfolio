import { useCallback, useSyncExternalStore } from 'react'
import type { SectionId } from '@/types/content'

/** Notifies on scroll and resize, at most once per animation frame. */
function subscribeToViewport(onChange: () => void): () => void {
  let frame = 0

  const schedule = () => {
    if (frame !== 0) return
    frame = window.requestAnimationFrame(() => {
      frame = 0
      onChange()
    })
  }

  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)

  return () => {
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    if (frame !== 0) window.cancelAnimationFrame(frame)
  }
}

function readActiveSection(sectionIds: readonly SectionId[], offset: number): SectionId | null {
  const marker = window.innerHeight * offset
  let current: SectionId | null = null
  let last: SectionId | null = null

  for (const id of sectionIds) {
    const element = document.getElementById(id)
    if (!element) continue
    last = id
    if (current === null || element.getBoundingClientRect().top <= marker) current = id
  }

  // At the very bottom the last section may be too short to reach the marker.
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
  return atBottom && last ? last : current
}

/**
 * Tracks which section is currently being read.
 *
 * A section becomes active once its top edge passes a marker line placed
 * `offset` of the way down the viewport. This stays accurate for sections of
 * any height, which viewport-intersection ratios do not.
 *
 * @param sectionIds Section DOM ids in page order. Pass a stable array (module constant or memoised).
 * @param enabled Set to false on pages that do not contain the sections.
 */
export function useActiveSection(
  sectionIds: readonly SectionId[],
  enabled = true,
  offset = 0.35,
): SectionId | null {
  const getSnapshot = useCallback(
    () => (enabled ? readActiveSection(sectionIds, offset) : null),
    [sectionIds, enabled, offset],
  )

  return useSyncExternalStore(subscribeToViewport, getSnapshot, () => null)
}
