import * as m from 'motion/react-m'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import type { EducationEntry } from '@/types/content'
import { cn } from '@/utils/cn'
import { fadeUpItem, staggerContainer, VIEWPORT_ONCE } from '@/utils/motion'

/** The entry with the latest completion year, which gets the filled marker on the rail. */
function latestEntryId(entries: readonly EducationEntry[]): string | undefined {
  let latest: { id: string; year: number } | undefined

  for (const entry of entries) {
    const year = Number.parseInt(entry.completed, 10)
    if (Number.isNaN(year)) continue
    if (!latest || year > latest.year) latest = { id: entry.id, year }
  }

  return latest?.id
}

function AcademicCard({ entry }: { entry: EducationEntry }) {
  const titleId = `education-${entry.id}-title`

  return (
    <Card as="article" interactive aria-labelledby={titleId} className="group flex h-full flex-col p-6 sm:p-7">
      <span className="flex size-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary-soft transition duration-300 group-hover:scale-105">
        <Icon name="graduation-cap" size={21} />
      </span>

      <h4
        id={titleId}
        className="mt-6 text-lg leading-snug font-bold tracking-tight text-balance text-ink sm:text-xl"
      >
        {entry.degree}
      </h4>

      <dl className="flex flex-1 flex-col">
        {entry.field ? (
          <div className="mt-1.5">
            <dt className="sr-only">Field of study</dt>
            <dd className="text-sm font-medium text-primary-soft">{entry.field}</dd>
          </div>
        ) : null}

        <div className="mt-auto pt-5">
          <dt className="sr-only">Institution</dt>
          <dd className="flex items-center gap-2.5 border-t border-line pt-4 text-sm text-muted">
            <Icon name="building" size={16} className="shrink-0 text-faint" />
            <span className="min-w-0 break-words">{entry.institution}</span>
          </dd>
        </div>

        {/* Read after the degree, shown in the top corner of the card. */}
        <div className="absolute top-6 right-6 text-right sm:top-7 sm:right-7">
          <dt className="text-[0.6875rem] font-semibold tracking-[0.18em] text-faint uppercase">Completed</dt>
          <dd className="mt-1 font-display text-2xl leading-none font-extrabold tracking-tight text-ink tabular-nums sm:text-[1.75rem]">
            {entry.completed}
          </dd>
        </div>
      </dl>
    </Card>
  )
}

interface AcademicTimelineProps {
  entries: readonly EducationEntry[]
  className?: string
}

/**
 * Academic qualifications in the order of the content file, joined by a fine
 * rail that suggests progression. The cards share the available height
 * equally, so the column lines up with whatever sits beside it.
 */
export function AcademicTimeline({ entries, className }: AcademicTimelineProps) {
  const latestId = latestEntryId(entries)

  return (
    <m.ol
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      className={cn('grid auto-rows-fr gap-5', className)}
    >
      {entries.map((entry, index) => (
        <m.li key={entry.id} variants={fadeUpItem} className="relative pl-8 sm:pl-10">
          {/* Rail to the next entry: it starts just below this marker and stops just above the next one. */}
          {index < entries.length - 1 ? (
            <span
              aria-hidden="true"
              className="absolute top-[3.5625rem] left-[5px] h-[calc(100%-3px)] w-px bg-linear-to-b from-primary/60 to-line-strong sm:top-[3.8125rem]"
            />
          ) : null}
          <span
            aria-hidden="true"
            className={cn(
              'absolute top-[2.5rem] left-0 size-[11px] rounded-full border-2 sm:top-[2.75rem]',
              entry.id === latestId
                ? 'border-primary bg-primary-soft ring-4 ring-primary/15'
                : 'border-line-strong bg-canvas',
            )}
          />
          <AcademicCard entry={entry} />
        </m.li>
      ))}
    </m.ol>
  )
}
