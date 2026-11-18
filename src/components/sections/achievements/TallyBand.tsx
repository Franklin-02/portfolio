import { useState } from 'react'
import { BandHeader } from '@/components/sections/achievements/BandHeader'
import { MetricFigure } from '@/components/sections/achievements/MetricFigure'
import { useFigureStart } from '@/components/sections/achievements/useFigureStart'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import type { AchievementGroup, Metric } from '@/types/content'
import { cn } from '@/utils/cn'

/**
 * A band of volume metrics: one continuous strip divided into compact cells,
 * each with its icon. No gauge here — a count has no scale to be measured on.
 */
export function TallyBand({ group }: { group: AchievementGroup }) {
  const titleId = `achievements-${group.id}-title`
  const [revealed, setRevealed] = useState(false)

  return (
    <div>
      <BandHeader id={titleId} title={group.title} description={group.description} accent="highlight" />

      <Reveal className="mt-6 lg:mt-7" onAnimationComplete={() => setRevealed(true)}>
        <Card className="achievements-tally card-sheen overflow-hidden">
          <ul aria-labelledby={titleId} className="grid grid-cols-2 lg:grid-cols-4">
            {group.metrics.map((metric, index) => (
              <TallyCell key={metric.id} metric={metric} index={index} revealed={revealed} />
            ))}
          </ul>
        </Card>
      </Reveal>
    </div>
  )
}

interface TallyCellProps {
  metric: Metric
  /** Position in the strip: decides which hairlines the cell draws. */
  index: number
  revealed: boolean
}

function TallyCell({ metric, index, revealed }: TallyCellProps) {
  const { ref, started } = useFigureStart(revealed)

  return (
    <li
      className={cn(
        // Three rows of the strip's grid, so labels and descriptions line up across the cells.
        'row-span-3 grid min-w-0 grid-rows-subgrid gap-y-0 border-line p-4 sm:p-6 lg:p-7',
        // Hairlines between cells: two columns below the desktop breakpoint, four from it.
        index % 2 === 1 && 'border-l',
        index % 4 === 2 && 'lg:border-l',
        index >= 2 && 'border-t',
        index >= 2 && index < 4 && 'lg:border-t-0',
      )}
    >
      {/* The label comes first for screen readers ("label: figure"); the figure is shown first. */}
      <h4 className="row-start-2 pt-3.5 font-sans text-sm leading-snug font-semibold text-balance text-ink sm:pt-4 sm:text-base">
        {metric.label}
      </h4>

      <div className="row-start-1 flex items-start justify-between gap-3">
        <p>
          <MetricFigure
            ref={ref}
            metric={metric}
            started={started}
            className="text-[1.875rem] sm:text-4xl lg:text-[2.5rem]"
            suffixClassName="text-highlight"
          />
        </p>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-highlight/25 bg-highlight/10 text-highlight sm:size-10 sm:rounded-xl">
          <Icon name={metric.icon} size={18} />
        </span>
      </div>

      {metric.description ? (
        <p className="row-start-3 pt-1 text-[0.8125rem] leading-relaxed text-pretty text-muted sm:pt-1.5 sm:text-sm">
          {metric.description}
        </p>
      ) : null}
    </li>
  )
}
