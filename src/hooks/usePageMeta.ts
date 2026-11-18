import { useEffect } from 'react'

interface PageMeta {
  title: string
  description?: string
}

/**
 * Sets the document title (and optionally the meta description) while a page
 * is mounted, then restores the previous values. The home page keeps the
 * defaults from index.html.
 */
export function usePageMeta({ title, description }: PageMeta): void {
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousTitle = document.title
    const previousDescription = meta?.content

    document.title = title
    if (meta && description) meta.content = description

    return () => {
      document.title = previousTitle
      if (meta && previousDescription !== undefined) meta.content = previousDescription
    }
  }, [title, description])
}
