import { parsePeriod } from '@/components/sections/experience/period'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import type { ExperienceContent, IconName } from '@/types/content'
import { cn } from '@/utils/cn'

const HEADING_ID = 'experience-role-heading'

interface RoleCardProps {
  content: ExperienceContent
}

/**
 * Head of the timeline: the company, the designation, and the facts of the
 * role as a strip along the bottom edge. The "Present" indicator is shown only
 * while the period in the content file is still running.
 */
export function RoleCard({ content }: RoleCardProps) {
  const period = parsePeriod(content.duration)
  const projectCount = content.engagements.length

  return (
    <Card as="article" aria-labelledby={HEADING_ID} className="card-sheen @container/role overflow-hidden">
      <div aria-hidden="true" className="bg-brand-tint absolute inset-0 opacity-45" />

      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4 p-5 sm:p-8 lg:px-10">
          <div className="min-w-0">
            <h3
              id={HEADING_ID}
              className="text-xl leading-snug font-bold tracking-tight text-balance text-ink sm:text-2xl"
            >
              {content.company}
            </h3>
            <p className="mt-1 text-base font-medium text-primary-soft sm:text-lg">{content.designation}</p>
          </div>

          {period.ongoing && period.end ? <CurrentBadge label={period.end} /> : null}
        </div>

        {/* Two rows on a narrow card (the period on its own row), one row of three on a wide one. */}
        <dl className="grid grid-cols-2 border-t border-line @xl/role:grid-cols-3">
          <Fact
            icon="calendar"
            label="Duration"
            value={content.duration}
            className="col-span-2 border-b @xl/role:col-span-1 @xl/role:border-b-0"
          />
          <Fact icon="map-pin" label="Location" value={content.location} className="@xl/role:border-l" />
          {projectCount > 0 ? (
            <Fact
              icon="layers"
              label="Projects"
              value={`${projectCount} ${projectCount === 1 ? 'engagement' : 'engagements'}`}
              className="border-l"
            />
          ) : null}
        </dl>
      </div>
    </Card>
  )
}

/** Live status pill: the role is the current one. */
function CurrentBadge({ label }: { label: string }) {
  return (
    <p className="inline-flex shrink-0 items-center gap-2 rounded-full border border-success/30 bg-success/10 py-1 pr-3 pl-2.5 text-xs font-semibold text-success">
      <span aria-hidden="true" className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-70" />
        <span className="relative inline-flex size-2 rounded-full bg-success" />
      </span>
      <span className="sr-only">Status: </span>
      {label}
    </p>
  )
}

interface FactProps {
  icon: IconName
  label: string
  value: string
  /** Borders that separate the cell from its neighbours. */
  className?: string
}

/** One cell of the facts strip. */
function Fact({ icon, label, value, className }: FactProps) {
  return (
    <div className={cn('min-w-0 border-line px-5 py-4 sm:px-8 sm:py-5 lg:px-10', className)}>
      <dt className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-faint uppercase">
        <Icon name={icon} size={14} className="shrink-0 text-primary-soft" />
        {label}
      </dt>
      <dd className="mt-1.5 text-[0.95rem] leading-snug font-semibold break-words text-ink">{value}</dd>
    </div>
  )
}
