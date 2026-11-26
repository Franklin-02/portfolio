import * as m from 'motion/react-m'
import { ArticleCard } from '@/components/sections/articles/ArticleCard'
import { FeaturedArticle } from '@/components/sections/articles/FeaturedArticle'
import { splitSeries } from '@/components/sections/articles/series'
import { SeriesPanel } from '@/components/sections/articles/SeriesPanel'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { articles } from '@/data/articles'
import { profile } from '@/data/profile'
import { cn } from '@/utils/cn'
import { fadeUpItem, staggerContainer, VIEWPORT_ONCE } from '@/utils/motion'

/** Soft lighting behind the heading and the series panel. */
function ArticlesBackdrop() {
  return (
    <>
      <div className="bg-glow-secondary absolute -top-48 right-[-12%] size-[42rem] opacity-80" />
      <div className="bg-glow-primary absolute bottom-[-20rem] left-[-14%] size-[44rem] opacity-70" />
    </>
  )
}

/**
 * The LinkedIn content series: one topic as a featured card, the other topics
 * beside it, and a panel that describes the series and links to LinkedIn.
 *
 * The cards are a selection of topics. No post count or progress bar is shown,
 * so the section stays correct as more posts are published on LinkedIn.
 *
 * Everything is rendered from src/data/articles.ts. An article shows a
 * "Read on LinkedIn" link only once its `url` is filled in there.
 */
export function Articles() {
  const { series } = articles
  const { featured, others } = splitSeries(articles.articles)

  return (
    <Section id="insights" tone="surface" decoration={<ArticlesBackdrop />}>
      <SectionHeading
        id="insights-heading"
        eyebrow={articles.eyebrow}
        title={articles.heading}
        description={articles.description}
      />

      <div className="mt-12 grid gap-5 lg:mt-16 lg:gap-6 xl:grid-cols-12">
        {featured ? (
          <Reveal className="xl:col-span-5">
            <FeaturedArticle article={featured.article} index={featured.index} seriesTitle={series.title} />
          </Reveal>
        ) : null}

        {others.length > 0 ? (
          <m.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className={cn('grid gap-5 sm:grid-cols-2 lg:gap-6', featured ? 'xl:col-span-7' : 'xl:col-span-12')}
          >
            {others.map(({ article, index }) => (
              <m.li key={article.number} variants={fadeUpItem} className="min-w-0 sm:last:odd:col-span-2">
                <ArticleCard article={article} index={index} />
              </m.li>
            ))}
          </m.ul>
        ) : null}
      </div>

      <Reveal className="mt-5 lg:mt-6">
        <SeriesPanel
          title={series.title}
          description={series.description}
          followLabel={articles.followLabel}
          followUrl={profile.linkedin.url}
        />
      </Reveal>
    </Section>
  )
}
