import { ArrowRight } from 'lucide-react'
import type { MouseEvent } from 'react'
import { coverPalette } from '@/components/sections/projects/coverArt'
import { ProjectCover } from '@/components/sections/projects/ProjectCover'
import { projectTitleId, projectTriggerId } from '@/components/sections/projects/projectDom'
import { ProjectLinks } from '@/components/sections/projects/ProjectLinks'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Tag } from '@/components/ui/Tag'
import type { Project } from '@/types/content'
import { cn } from '@/utils/cn'

/** Features listed on a card. The detail view shows the full list. */
const FEATURES_ON_CARD = 4

const metaLabel = 'font-sans text-xs font-semibold tracking-[0.18em] text-faint uppercase'

interface ProjectCardProps {
  project: Project
  /** Position in the list: selects the cover treatment and accent colour. */
  index: number
  /** The lead card carries the single brand-coloured button of the section. */
  lead?: boolean
  /** Opens the detail view. `trigger` is the button focus returns to afterwards. */
  onOpen: (project: Project, trigger: HTMLElement) => void
  /** The visitor is about to open a project: a good moment to start loading the detail view. */
  onIntent: () => void
}

/**
 * One project in the showcase. The card lays itself out from its own width
 * (container queries): cover on top when narrow, cover at the side when wide.
 * That keeps the grid free to change shape as projects are added.
 */
export function ProjectCard({ project, index, lead = false, onOpen, onIntent }: ProjectCardProps) {
  const palette = coverPalette(index)
  const titleId = projectTitleId(project.slug)
  const features = project.features.slice(0, FEATURES_ON_CARD)
  const moreFeatures = project.features.length - features.length
  const { technologies } = project
  const hasLinks = Boolean(project.links.github || project.links.demo)

  // Pointer convenience: the whole card opens the details. The button remains the real control.
  const handleCardClick = (event: MouseEvent<HTMLElement>) => {
    const target = event.target instanceof Element ? event.target : null
    if (!target || target.closest('a, button')) return
    if (window.getSelection()?.toString()) return // the visitor is selecting text

    const trigger = event.currentTarget.querySelector<HTMLElement>('[data-project-trigger]')
    if (trigger) onOpen(project, trigger)
  }

  return (
    <Card
      as="article"
      aria-labelledby={titleId}
      onClick={handleCardClick}
      onPointerEnter={onIntent}
      className={cn(
        // scroll-mt: a shared link scrolls the card into view; keep it clear of the fixed navigation bar.
        'projects-card @container/card h-full scroll-mt-6 cursor-pointer overflow-hidden transition duration-300 ease-out hover:shadow-elevated motion-safe:hover:-translate-y-1',
        palette.hoverBorder,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-linear-to-r to-transparent',
          palette.rule,
        )}
      />

      <div className="flex h-full flex-col @2xl/card:flex-row">
        <ProjectCover
          project={project}
          index={index}
          className="h-44 shrink-0 border-b border-line @md/card:h-52 @2xl/card:h-auto @2xl/card:w-[42%] @2xl/card:border-r @2xl/card:border-b-0"
        />

        <div className="@container/body flex min-w-0 flex-1 flex-col p-6 @md/card:p-7 @5xl/card:p-10">
          <p className={cn('text-xs font-semibold tracking-[0.18em] uppercase', palette.text)}>{project.category}</p>
          <h3
            id={titleId}
            className="mt-2.5 text-xl leading-snug font-bold tracking-tight text-balance text-ink @5xl/card:text-2xl"
          >
            {project.title}
          </h3>

          <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <StatusBadge label={project.status.label} tone={project.status.tone} />
            {project.status.detail ? <p className="text-xs text-muted">{project.status.detail}</p> : null}
          </div>

          <p className="mt-4 text-[0.95rem] leading-relaxed text-pretty text-muted">{project.description}</p>

          <div className="mt-6">
            <h4 className={metaLabel}>{project.featuresLabel}</h4>
            <ul className="mt-3 grid gap-x-6 gap-y-2 @md/body:grid-cols-2">
              {features.map((feature) => (
                <li key={feature} className="flex min-w-0 items-start gap-2.5 text-sm leading-snug text-ink/90">
                  <span
                    aria-hidden="true"
                    className={cn('mt-[0.45em] size-1.5 shrink-0 rounded-full', palette.bullet)}
                  />
                  <span className="min-w-0 break-words">{feature}</span>
                </li>
              ))}
            </ul>
            {moreFeatures > 0 ? (
              <p className="mt-2.5 pl-4 text-xs font-medium text-faint">
                +{moreFeatures} more<span className="sr-only"> in the project details</span>
              </p>
            ) : null}
          </div>

          <div className="mt-6">
            <h4 className={metaLabel}>{technologies.label}</h4>
            {technologies.items.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {technologies.items.map((item) => (
                  <li key={item}>
                    <Tag>{item}</Tag>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-muted">{technologies.note ?? 'Not specified yet.'}</p>
            )}
          </div>

          <div className="mt-auto pt-7">
            <div
              className={cn(
                'flex flex-col gap-4 border-t border-line pt-5 @sm/body:flex-row @sm/body:items-center @sm/body:justify-between',
                // Link buttons cannot shrink, so they may wrap; the note simply wraps its own text.
                hasLinks && '@sm/body:flex-wrap',
              )}
            >
              <ProjectLinks project={project} />
              <Button
                id={projectTriggerId(project.slug)}
                variant={lead ? 'primary' : 'secondary'}
                aria-haspopup="dialog"
                data-project-trigger=""
                onClick={(event) => onOpen(project, event.currentTarget)}
                onPointerEnter={onIntent}
                onFocus={onIntent}
                className="group/details w-full @sm/body:ml-auto @sm/body:w-auto"
              >
                View Details
                <span className="sr-only">: {project.title}</span>
                <ArrowRight
                  aria-hidden="true"
                  size={16}
                  strokeWidth={2}
                  className="transition-transform duration-200 group-hover/details:translate-x-0.5"
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
