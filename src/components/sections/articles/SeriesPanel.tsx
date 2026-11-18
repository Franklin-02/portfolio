import type { Variants } from 'motion/react'
import * as m from 'motion/react-m'
import type { CSSProperties } from 'react'
import type { SegmentStatus, SeriesProgress } from '@/components/sections/articles/series'
import { LinkedInIcon } from '@/components/ui/BrandIcons'
import { ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CountUp } from '@/components/ui/CountUp'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/utils/cn'
import { EASE_OUT, VIEWPORT_ONCE } from '@/utils/motion'

const TITLE_ID = 'insights-series-title'

const metaLabel = 'text-xs font-semibold tracking-[0.18em] text-faint uppercase'

/** How a post is drawn on the track and in the legend. The three differ in shape, not only in colour. */
const segmentStyles: Record<SegmentStatus, string> = {
  published: 'bg-primary',
  current: 'border border-primary bg-primary/25 ring-2 ring-primary/20',
  planned: 'border border-line bg-ink/4',
}

const trackVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.018, delayChildren: 0.15 } },
}

const segmentVariants: Variants = {
  hidden: { opacity: 0, scaleY: 0.4 },
  visible: { opacity: 1, scaleY: 1, transition: { duration: 0.45, ease: EASE_OUT } },
}

interface SeriesPanelProps {
  title: string
  description: string
  progress: SeriesProgress
  /** Label and address of the call to action. */
  followLabel: string
  followUrl: string
}

/**
 * The series as a whole: what it is, how far it has come, and where to follow
 * it. The figures and the track come from `getSeriesProgress`, so they always
 * match the articles and the planned count in the content file.
 */
export function SeriesPanel({ title, description, progress, followLabel, followUrl }: SeriesPanelProps) {
  const stats: { id: SegmentStatus; label: string; value: number }[] = [
    { id: 'published', label: 'Published', value: progress.published },
    { id: 'current', label: progress.current === 1 ? 'Current topic' : 'Current topics', value: progress.current },
    { id: 'planned', label: 'Posts planned', value: progress.planned },
  ]

  const trackColumns = {
    '--track-narrow': progress.columns.narrow,
    '--track-wide': progress.columns.wide,
  } as CSSProperties

  return (
    <Card role="group" aria-labelledby={TITLE_ID} className="card-sheen overflow-hidden">
      <div className="grid lg:grid-cols-12 lg:grid-rows-[auto_1fr]">
        {/* What the series is */}
        <div className="p-6 sm:p-8 lg:col-span-5 lg:p-10 lg:pb-0">
          <div className="flex items-center gap-3.5">
            <span className="flex size-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary-soft">
              <Icon name="book-open" size={21} />
            </span>
            <p className={metaLabel}>The series</p>
          </div>
          <h3 id={TITLE_ID} className="mt-5 text-xl font-bold tracking-tight text-balance text-ink sm:text-2xl">
            {title}
          </h3>
          <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-pretty text-muted">{description}</p>
        </div>

        {/* How far it has come */}
        <div className="flex flex-col justify-center border-t border-line p-6 sm:p-8 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:border-t-0 lg:border-l lg:p-10">
          <p className={metaLabel}>Series progress</p>

          <dl className="mt-5 grid grid-cols-3 gap-x-4">
            {stats.map((stat) => (
              <div key={stat.id} className="flex min-w-0 flex-col-reverse justify-end gap-2">
                <dt className="flex items-center gap-2 text-[0.8125rem] leading-snug text-muted">
                  <span
                    aria-hidden="true"
                    className={cn('h-3 w-1.5 shrink-0 rounded-[2px]', segmentStyles[stat.id])}
                  />
                  {stat.label}
                </dt>
                <dd className="font-display text-3xl leading-none font-extrabold tracking-tight text-ink sm:text-4xl">
                  <CountUp value={stat.value} duration={1.2} />
                </dd>
              </div>
            ))}
          </dl>

          {/* One segment per planned post */}
          <m.div
            role="img"
            aria-label={progress.summary}
            variants={trackVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            style={trackColumns}
            className="mt-7 grid grid-cols-[repeat(var(--track-narrow),minmax(0,1fr))] gap-1 sm:grid-cols-[repeat(var(--track-wide),minmax(0,1fr))] sm:gap-[5px]"
          >
            {progress.segments.map((segment) => (
              <m.span
                key={segment.position}
                variants={segmentVariants}
                className={cn('relative h-7 origin-bottom rounded-[4px] sm:h-8', segmentStyles[segment.status])}
              >
                {segment.status === 'current' ? (
                  <span className="absolute inset-0 animate-pulse-soft rounded-[3px] bg-primary/45" />
                ) : null}
              </m.span>
            ))}
          </m.div>

          {progress.ticks.length > 0 ? (
            <div
              aria-hidden="true"
              style={trackColumns}
              className="mt-2 hidden grid-cols-[repeat(var(--track-wide),minmax(0,1fr))] gap-[5px] sm:grid"
            >
              {progress.ticks.map((position) => (
                <span
                  key={position}
                  style={{ gridColumnStart: position, gridRowStart: 1 }}
                  className="flex justify-center text-[0.625rem] font-medium text-faint tabular-nums"
                >
                  <span className="whitespace-nowrap">{String(position).padStart(progress.digits, '0')}</span>
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {/* Where to follow it */}
        <div className="px-6 pb-6 sm:px-8 sm:pb-8 lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:px-10 lg:pt-7 lg:pb-10">
          <ButtonLink href={followUrl} external size="md" className="w-full sm:w-auto">
            <LinkedInIcon size={17} />
            {followLabel}
          </ButtonLink>
        </div>
      </div>
    </Card>
  )
}
