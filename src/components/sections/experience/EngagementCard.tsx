import { accentStyles, type ExperienceAccent } from '@/components/sections/experience/accents'
import { EngagementVisual } from '@/components/sections/experience/EngagementVisual'
import { HighlightFigures } from '@/components/sections/experience/HighlightFigures'
import { ResponsibilityList } from '@/components/sections/experience/ResponsibilityList'
import { Card } from '@/components/ui/Card'
import { Tag, type TagTone } from '@/components/ui/Tag'
import type { Engagement } from '@/types/content'
import { cn } from '@/utils/cn'

const metaLabel = 'font-sans text-xs font-semibold tracking-[0.18em] text-faint uppercase'

interface EngagementCardProps {
  engagement: Engagement
  accent: ExperienceAccent
}

/**
 * One project engagement: what it was, the platforms and tools involved, an
 * original illustration, the figures (when the content has any) and every
 * responsibility. The card lays itself out from its own width (container
 * queries), so it works in any column the timeline gives it.
 */
export function EngagementCard({ engagement, accent }: EngagementCardProps) {
  const style = accentStyles[accent]
  const headingId = `experience-${engagement.id}-heading`
  const listId = `experience-${engagement.id}-responsibilities`
  const { responsibilities } = engagement

  return (
    <Card
      as="article"
      aria-labelledby={headingId}
      className={cn(
        'card-sheen @container/card overflow-hidden transition-colors duration-300',
        style.scope,
        style.hoverBorder,
      )}
    >
      <div className="grid @3xl/card:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]">
        <div className="min-w-0 p-5 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className={cn('text-xs font-semibold tracking-[0.18em] uppercase', style.text)}>{engagement.label}</p>
            {engagement.current ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[0.6875rem] leading-none font-semibold text-success">
                <span aria-hidden="true" className="size-1.5 animate-pulse-soft rounded-full bg-success" />
                Current project
              </span>
            ) : null}
          </div>
          <h3
            id={headingId}
            className="mt-2.5 text-xl leading-snug font-bold tracking-tight text-balance text-ink sm:text-2xl"
          >
            {engagement.name}
          </h3>
          {engagement.summary ? (
            <p className="mt-3.5 text-[0.95rem] leading-relaxed text-pretty text-muted">{engagement.summary}</p>
          ) : null}

          <dl className="mt-6 space-y-5 sm:mt-7">
            <TagGroup label="Platforms" items={engagement.platforms} tone={style.tag} />
            <TagGroup label="Tools" items={engagement.tools} tone="neutral" />
          </dl>
        </div>

        <EngagementVisual
          visual={engagement.visual}
          className="border-t border-line @3xl/card:border-t-0 @3xl/card:border-l"
        />
      </div>

      {engagement.highlights.length > 0 ? (
        <HighlightFigures highlights={engagement.highlights} accentText={style.text} />
      ) : null}

      <div className="border-t border-line p-5 sm:p-8 lg:px-10">
        <div className="flex items-center gap-2.5">
          <h4 className={metaLabel}>Key responsibilities</h4>
          <span
            aria-hidden="true"
            className="rounded-md border border-line bg-ink/4 px-1.5 py-0.5 text-[0.6875rem] leading-none font-semibold text-muted tabular-nums"
          >
            {responsibilities.length}
          </span>
        </div>

        <div className="mt-4">
          <ResponsibilityList id={listId} items={responsibilities} accentText={style.text} />
        </div>
      </div>
    </Card>
  )
}

interface TagGroupProps {
  label: string
  items: string[]
  tone: TagTone
}

function TagGroup({ label, items, tone }: TagGroupProps) {
  if (items.length === 0) return null

  return (
    <div>
      <dt className={metaLabel}>{label}</dt>
      <dd className="mt-2.5">
        <ul className="flex flex-wrap gap-2">
          {items.map((item) => (
            <li key={item}>
              <Tag tone={tone}>{item}</Tag>
            </li>
          ))}
        </ul>
      </dd>
    </div>
  )
}
