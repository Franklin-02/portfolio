import type { Article, ArticleStatus } from '@/types/content'

/**
 * Everything the section shows about the state of the series is worked out
 * here from the content file: which article is featured, how many posts are
 * published, and what the progress track looks like. No count is written by hand.
 */

/** An article together with its position in the content file, which selects its artwork. */
export interface SeriesEntry {
  article: Article
  index: number
}

export interface SeriesLayout {
  /** The article given the large card: the current topic, or the newest post when none is marked current. */
  featured: SeriesEntry | undefined
  /** Every other article, in the order of the content file. */
  others: SeriesEntry[]
}

export function splitSeries(articles: readonly Article[]): SeriesLayout {
  const entries: SeriesEntry[] = articles.map((article, index) => ({ article, index }))
  const featured = entries.find((entry) => entry.article.status === 'current') ?? entries.at(-1)

  return { featured, others: entries.filter((entry) => entry !== featured) }
}

/**
 * The address of the article's LinkedIn post, or undefined when the content
 * file has none. Only a real web address counts, so a card never shows a link
 * that leads nowhere.
 */
export function articleUrl(article: Article): string | undefined {
  const url = article.url?.trim()
  return url && /^https?:\/\/\S+$/i.test(url) ? url : undefined
}

/** DOM id of an article's heading. */
export function articleTitleId(article: Article): string {
  return `insights-article-${article.number.replace(/[^a-zA-Z0-9_-]/g, '')}-title`
}

export type SegmentStatus = ArticleStatus | 'planned'

export interface SeriesSegment {
  /** Position in the series, starting at 1. */
  position: number
  status: SegmentStatus
}

export interface SeriesProgress {
  /** Number of published articles. */
  published: number
  /** Number of articles marked as the current topic. */
  current: number
  /** Number of posts planned for the whole series. */
  planned: number
  /** One segment per planned post, in series order. */
  segments: SeriesSegment[]
  /** Segments per row of the track: all of them on wide screens, half on narrow ones. */
  columns: { wide: number; narrow: number }
  /** Positions that get a label under the track. */
  ticks: number[]
  /** Width of a position label, in digits. */
  digits: number
  /** The track in words. */
  summary: string
}

/** Longest row of the track that still reads well on a wide screen. */
const MAX_ROW = 40

export function getSeriesProgress(articles: readonly Article[], plannedCount: number): SeriesProgress {
  const published = articles.filter((article) => article.status === 'published').length
  const current = articles.filter((article) => article.status === 'current').length
  const planned = Math.max(0, Math.floor(plannedCount))

  // The track never hides an article: it grows if the list is longer than the plan.
  const length = Math.max(planned, articles.length)
  const segments: SeriesSegment[] = Array.from({ length }, (_, position) => ({
    position: position + 1,
    status: articles[position]?.status ?? 'planned',
  }))

  const rows = Math.max(1, Math.ceil(length / MAX_ROW))
  const wide = Math.max(1, Math.ceil(length / rows))

  // Labels on the first post, every fifth one and the last one (skipping a fifth right next to the last).
  const ticks = segments
    .map((segment) => segment.position)
    .filter(
      (position) => position === 1 || position === length || (position % 5 === 0 && length - position !== 1),
    )

  const parts = [`${published} of ${planned} planned ${planned === 1 ? 'post' : 'posts'} published`]
  if (current > 0) parts.push(`${current} current ${current === 1 ? 'topic' : 'topics'}`)

  return {
    published,
    current,
    planned,
    segments,
    columns: { wide, narrow: Math.max(1, Math.ceil(wide / 2)) },
    ticks: rows === 1 ? ticks : [],
    digits: Math.max(2, String(length).length),
    summary: `Series progress: ${parts.join(', ')}.`,
  }
}
