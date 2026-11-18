import { ArticleGlyph } from '@/components/sections/articles/ArticleGlyph'
import { ArticleLink } from '@/components/sections/articles/ArticleLink'
import { ArticleStatusLabel } from '@/components/sections/articles/ArticleStatusLabel'
import { articleTitleId, articleUrl } from '@/components/sections/articles/series'
import { seriesPalette } from '@/components/sections/articles/seriesArt'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import type { Article } from '@/types/content'
import { cn } from '@/utils/cn'

interface ArticleCardProps {
  article: Article
  /** Position of the article in the content file: selects its mark and accent colour. */
  index: number
}

/**
 * One article of the series: its mark, number, status, title, description and
 * topics. The "Read on LinkedIn" link appears only when the content file gives
 * the post's address; until then the card simply has no link.
 */
export function ArticleCard({ article, index }: ArticleCardProps) {
  const palette = seriesPalette(index)
  const titleId = articleTitleId(article)
  const url = articleUrl(article)

  return (
    <Card
      as="article"
      aria-labelledby={titleId}
      className={cn(
        'group flex h-full flex-col p-6 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-elevated sm:p-7',
        palette.hoverBorder,
      )}
    >
      <div className="flex items-start gap-4">
        <ArticleGlyph index={index} topicCount={article.topics.length} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
            <p className={cn('font-display text-sm font-bold tracking-[0.2em] tabular-nums', palette.text)}>
              <span className="sr-only">Article </span>
              {article.number}
            </p>
            <ArticleStatusLabel status={article.status} />
          </div>
          <h3 id={titleId} className="mt-2 text-lg leading-snug font-bold tracking-tight text-balance text-ink">
            {article.title}
          </h3>
        </div>
      </div>

      <p className="mt-5 text-[0.95rem] leading-relaxed text-pretty text-muted">{article.description}</p>

      <ul aria-label="Topics" className="mt-auto flex flex-wrap gap-2 pt-5">
        {article.topics.map((topic) => (
          <li key={topic}>
            <Tag>{topic}</Tag>
          </li>
        ))}
      </ul>

      {url ? (
        <div className="mt-5 border-t border-line pt-2.5">
          <ArticleLink href={url} title={article.title} />
        </div>
      ) : null}
    </Card>
  )
}
