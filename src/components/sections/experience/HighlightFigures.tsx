import type { CSSProperties } from 'react'
import { CountUp } from '@/components/ui/CountUp'
import type { EngagementHighlight } from '@/types/content'
import { cn } from '@/utils/cn'

/** Figures per row once the card is wide enough. More than this wrap onto another row. */
const MAX_COLUMNS = 4

interface HighlightFiguresProps {
  highlights: EngagementHighlight[]
  /** Text colour class for the accent-coloured part of a figure, e.g. the "+". */
  accentText: string
}

/**
 * The figures of an engagement as a compact strip: two per row on a narrow
 * card, all in one row on a wide one, separated by hairlines. The values come
 * straight from the content file.
 */
export function HighlightFigures({ highlights, accentText }: HighlightFiguresProps) {
  const columns = Math.min(highlights.length, MAX_COLUMNS)

  return (
    <dl
      style={{ '--experience-figures': columns } as CSSProperties}
      className="grid grid-cols-2 gap-px border-t border-line bg-line @xl/card:grid-cols-[repeat(var(--experience-figures),minmax(0,1fr))]"
    >
      {highlights.map((highlight) => (
        <div
          key={highlight.label}
          className="flex min-w-0 flex-col-reverse justify-end gap-2 bg-card px-5 py-5 @max-xl/card:last:odd:col-span-2 sm:px-8 sm:py-6 lg:px-10"
        >
          <dt className="text-xs leading-snug text-pretty text-muted sm:text-[0.8125rem]">{highlight.label}</dt>
          <dd className="font-display text-2xl leading-none font-extrabold tracking-tight text-ink tabular-nums sm:text-3xl">
            <Figure value={highlight.value} accentText={accentText} />
          </dd>
        </div>
      ))}
    </dl>
  )
}

interface FigureProps {
  value: string
  accentText: string
}

/** Counts a whole number up when it scrolls into view and sets any suffix in the accent colour. */
function Figure({ value, accentText }: FigureProps) {
  const match = /^(\d+)(\D*)$/.exec(value)
  if (!match) return value

  const [, digits, suffix] = match

  return (
    <>
      <CountUp value={Number(digits)} />
      {suffix ? <span className={cn('ml-px', accentText)}>{suffix}</span> : null}
    </>
  )
}
