import * as m from 'motion/react-m'
import { useState } from 'react'
import { BandHeader } from '@/components/sections/achievements/BandHeader'
import { Gauge } from '@/components/sections/achievements/Gauge'
import { MetricFigure } from '@/components/sections/achievements/MetricFigure'
import { useFigureStart } from '@/components/sections/achievements/useFigureStart'
import { Card } from '@/components/ui/Card'
import type { AchievementGroup, Metric } from '@/types/content'
import { cn } from '@/utils/cn'
import { fadeUpItem, staggerContainer, VIEWPORT_ONCE } from '@/utils/motion'

/** Each card is three rows of the list's grid, so labels and descriptions line up across a row of cards. */
const cardRows = 'row-span-3 grid grid-rows-subgrid gap-y-0'

/**
 * A band of percentage metrics: one large card each, built around a ring
 * gauge that draws to the reported figure.
 */
export function GaugeBand({ group }: { group: AchievementGroup }) {
  const titleId = `achievements-${group.id}-title`

  return (
    <div>
      <BandHeader id={titleId} title={group.title} description={group.description} accent="primary" />

      <m.ul
        aria-labelledby={titleId}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:mt-7 lg:grid-cols-4"
      >
        {group.metrics.map((metric) => (
          <GaugeCard key={metric.id} metric={metric} />
        ))}
      </m.ul>
    </div>
  )
}

function GaugeCard({ metric }: { metric: Metric }) {
  const [revealed, setRevealed] = useState(false)
  const { ref, started } = useFigureStart(revealed)

  return (
    <m.li variants={fadeUpItem} onAnimationComplete={() => setRevealed(true)} className={cardRows}>
      <Card interactive className={cn('card-sheen overflow-hidden pb-4 sm:pb-6', cardRows)}>
        {/* The label comes first for screen readers ("label: figure"); the figure is shown first. */}
        <h4 className="row-start-2 px-4 pt-4 font-sans text-sm leading-snug font-semibold text-balance text-ink sm:px-6 sm:pt-5 sm:text-base">
          {metric.label}
        </h4>

        <div className="achievements-figure row-start-1 border-b border-line px-5 py-5 sm:py-7">
          <div className="@container relative mx-auto aspect-square w-full max-w-42">
            <Gauge id={`achievements-${metric.id}`} value={metric.value ?? 0} active={started} />
            <p className="absolute inset-0 grid place-items-center">
              <MetricFigure
                ref={ref}
                metric={metric}
                started={started}
                className="text-[length:29cqw]"
                suffixClassName="text-primary-soft"
              />
            </p>
          </div>
        </div>

        {metric.description ? (
          <p className="row-start-3 px-4 pt-1.5 text-[0.8125rem] leading-relaxed text-pretty text-muted sm:px-6 sm:pt-2 sm:text-sm">
            {metric.description}
          </p>
        ) : null}
      </Card>
    </m.li>
  )
}
