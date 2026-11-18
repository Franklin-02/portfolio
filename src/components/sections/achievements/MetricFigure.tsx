import type { Ref } from 'react'
import { COUNT_DURATION } from '@/components/sections/achievements/timing'
import { CountUp } from '@/components/ui/CountUp'
import type { Metric } from '@/types/content'
import { cn } from '@/utils/cn'

interface MetricFigureProps {
  metric: Metric
  /** False while the figure waits at zero (see useFigureStart). */
  started: boolean
  /** Attached to the box that holds the digits. */
  ref?: Ref<HTMLSpanElement>
  /** Sets the size: every part of the figure is sized in `em`. */
  className?: string
  /** Colour of the suffix (the "%" or "+"). */
  suffixClassName?: string
}

const cell = 'col-start-1 row-start-1'

/**
 * The headline figure of a metric: large display numerals that count up, with
 * a smaller suffix in the accent colour.
 *
 * The finished number is always in the layout, invisible, so the figure has
 * its final width from the start and counting never moves anything around it.
 * Screen readers get the finished value at all times.
 */
export function MetricFigure({ metric, started, ref, className, suffixClassName }: MetricFigureProps) {
  const { value, text, prefix = '', suffix } = metric

  return (
    <span
      className={cn('inline-flex items-start font-display leading-none font-extrabold tracking-tight text-ink', className)}
    >
      {value === undefined ? (
        <span ref={ref}>{text}</span>
      ) : (
        <span ref={ref} className="inline-grid tabular-nums">
          <span aria-hidden="true" className={cn(cell, 'invisible select-none')}>
            {prefix}
            {value}
          </span>
          {started ? (
            <CountUp
              value={value}
              prefix={prefix}
              duration={COUNT_DURATION}
              className={cn(cell, 'justify-self-end')}
            />
          ) : (
            <span className={cn(cell, 'justify-self-end')}>
              <span aria-hidden="true">{prefix}0</span>
              <span className="sr-only">
                {prefix}
                {value}
              </span>
            </span>
          )}
        </span>
      )}
      {suffix ? (
        <span className={cn('mt-[0.2em] ml-[0.06em] text-[0.5em] font-bold', suffixClassName)}>{suffix}</span>
      ) : null}
    </span>
  )
}
