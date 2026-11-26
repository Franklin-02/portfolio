import { LinkedInIcon } from '@/components/ui/BrandIcons'
import { ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'

const TITLE_ID = 'insights-series-title'

interface SeriesPanelProps {
  title: string
  description: string
  /** Label and address of the call to action. */
  followLabel: string
  followUrl: string
}

/**
 * The series as a whole: what it is and where to follow it.
 *
 * It shows no post count and no progress bar on purpose: new posts go up on
 * LinkedIn, not here, so any number on this panel would soon be wrong. The
 * button leads to LinkedIn, where every post is.
 */
export function SeriesPanel({ title, description, followLabel, followUrl }: SeriesPanelProps) {
  return (
    <Card role="group" aria-labelledby={TITLE_ID} className="card-sheen overflow-hidden">
      <div className="flex flex-col gap-7 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:p-10">
        <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-start">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary-soft">
            <Icon name="book-open" size={21} />
          </span>

          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.18em] text-faint uppercase">The series</p>
            <h3 id={TITLE_ID} className="mt-2 text-xl font-bold tracking-tight text-balance text-ink sm:text-2xl">
              {title}
            </h3>
            <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-pretty text-muted">{description}</p>
          </div>
        </div>

        <ButtonLink href={followUrl} external size="md" className="w-full shrink-0 sm:w-auto">
          <LinkedInIcon size={17} />
          {followLabel}
        </ButtonLink>
      </div>
    </Card>
  )
}
