import { ArticleCover } from '@/components/sections/articles/ArticleCover'
import { ArticleLink } from '@/components/sections/articles/ArticleLink'
import { ArticleStatusLabel } from '@/components/sections/articles/ArticleStatusLabel'
import { articleTitleId, articleUrl } from '@/components/sections/articles/series'
import { seriesPalette } from '@/components/sections/articles/seriesArt'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import type { Article } from '@/types/content'

/** The featured card always wears the brand colours, whatever its position in the series. */
const palette = seriesPalette(0)

interface FeaturedArticleProps {
  article: Article
  /** Position of the article in the content file: selects the route on its cover. */
  index: number
  seriesTitle: string
}

/**
 * The large card for the featured article of the series. It lays itself
 * out from its own width (container queries): cover on top when narrow, cover
 * at the side when wide. In a stretched grid cell the cover takes the spare height.
 */
export function FeaturedArticle({ article, index, seriesTitle }: FeaturedArticleProps) {
  const titleId = articleTitleId(article)
  const url = articleUrl(article)

  return (
    <Card
      as="article"
      aria-labelledby={titleId}
      className="@container/featured h-full overflow-hidden transition duration-300 ease-out hover:-translate-y-1 hover:border-primary/45 hover:shadow-elevated"
    >
      <div className="flex h-full flex-col @2xl/featured:flex-row">
        <ArticleCover
          article={article}
          index={index}
          palette={palette}
          seriesTitle={seriesTitle}
          className="min-h-48 flex-1 border-b border-line @2xl/featured:w-[42%] @2xl/featured:flex-none @2xl/featured:border-r @2xl/featured:border-b-0"
        />

        <div className="flex min-w-0 flex-col p-6 sm:p-8 lg:p-9 @2xl/featured:flex-1 @2xl/featured:justify-center">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <ArticleStatusLabel status={article.status} />
            <p className="text-xs font-semibold tracking-[0.18em] text-faint uppercase">
              Article <span className="text-ink tabular-nums">{article.number}</span>
            </p>
          </div>

          <h3
            id={titleId}
            className="mt-5 text-2xl leading-tight font-bold tracking-tight text-balance text-ink sm:text-[1.75rem]"
          >
            {article.title}
          </h3>
          <p className="mt-3.5 text-base leading-relaxed text-pretty text-muted">{article.description}</p>

          <div className="mt-6">
            <h4 className="font-sans text-xs font-semibold tracking-[0.18em] text-faint uppercase">Topics</h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {article.topics.map((topic) => (
                <li key={topic}>
                  <Tag tone="primary">{topic}</Tag>
                </li>
              ))}
            </ul>
          </div>

          {url ? (
            <div className="mt-6 border-t border-line pt-2.5">
              <ArticleLink href={url} title={article.title} />
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
