import { useCallback, useSyncExternalStore } from 'react'

/** Query parameter that holds the open project, e.g. /?project=ecommerce-application */
export const PROJECT_PARAM = 'project'

/** Fired after this hook changes the URL, because pushState/replaceState emit no event. */
const CHANGE_EVENT = 'portfolio:project-param'

/** Marks history entries created by opening a project, so "close" can simply go back. */
interface ProjectHistoryState {
  projectDialog?: boolean
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener('popstate', onChange)
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener(CHANGE_EVENT, onChange)
  }
}

function readSlug(): string | null {
  return new URLSearchParams(window.location.search).get(PROJECT_PARAM)
}

function urlWithProject(slug: string | null): URL {
  const url = new URL(window.location.href)
  if (slug) url.searchParams.set(PROJECT_PARAM, slug)
  else url.searchParams.delete(PROJECT_PARAM)
  return url
}

function wasOpenedHere(): boolean {
  return Boolean((window.history.state as ProjectHistoryState | null)?.projectDialog)
}

/**
 * Keeps the open project in the URL (`?project=<slug>`), which makes project
 * details shareable and lets the browser Back button close them.
 *
 * - `open(slug)`    adds a history entry, so Back closes the details.
 * - `replace(slug)` switches project without adding another entry (previous / next).
 * - `close()`       goes back when the details were opened on this page, otherwise
 *                   just removes the parameter (e.g. after arriving from a shared link).
 */
export function useProjectParam() {
  const slug = useSyncExternalStore(subscribe, readSlug, () => null)

  const open = useCallback((nextSlug: string) => {
    window.history.pushState({ projectDialog: true } satisfies ProjectHistoryState, '', urlWithProject(nextSlug))
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [])

  const replace = useCallback((nextSlug: string) => {
    window.history.replaceState(window.history.state, '', urlWithProject(nextSlug))
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [])

  const close = useCallback(() => {
    if (wasOpenedHere()) {
      window.history.back() // popstate notifies subscribers
      return
    }
    window.history.replaceState(window.history.state, '', urlWithProject(null))
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [])

  return { slug, open, replace, close }
}
