import type { Article } from '@/types/content'

/**
 * Helpers for laying out the series from the content file: which article gets
 * the large card, and the link and heading id of each article.
 *
 * The section deliberately shows no post count and no progress bar. The posts
 * themselves live on LinkedIn, and a count written into the site would be out
 * of date as soon as the next post is published.
 */

/** An article together with its position in the content file, which selects its artwork. */
export interface SeriesEntry {
  article: Article
  index: number
}

export interface SeriesLayout {
  /** The article given the large card: one marked as the current topic, or else the last one in the content file. */
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
