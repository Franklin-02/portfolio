import '@/components/sections/projects/project-dialog.css'

import { ArrowLeft, ArrowRight, Info, X } from 'lucide-react'
import {
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react'
import { coverPalette } from '@/components/sections/projects/coverArt'
import { ProjectCover } from '@/components/sections/projects/ProjectCover'
import { ProjectLinks } from '@/components/sections/projects/ProjectLinks'
import { Icon } from '@/components/ui/Icon'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Tag } from '@/components/ui/Tag'
import { profile } from '@/data/profile'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { usePageMeta } from '@/hooks/usePageMeta'
import type { Project } from '@/types/content'
import { cn } from '@/utils/cn'

interface ProjectDialogProps {
  /** The project to show. It stays set while the dialog closes, so the content can fade out with it. */
  project: Project
  /** Every project in display order: gives the position and the previous / next targets. */
  projects: readonly Project[]
  /** Whether the URL currently points at a project. The dialog element follows this. */
  open: boolean
  /** Asks for the project to be removed from the URL (close button, Escape, backdrop). */
  onRequestClose: () => void
  /** Switches to another project without adding a history entry. */
  onNavigate: (slug: string) => void
  /** Runs once the dialog element has closed, whatever closed it. Receives the project it was showing. */
  onClosed: (slug: string) => void
}

const blockLabel = 'font-sans text-xs font-semibold tracking-[0.18em] text-faint uppercase'

/**
 * Detail view for one project, built on the native <dialog> element:
 * showModal() provides the focus trap, the inert page behind and the top layer.
 *
 * The URL is the single source of truth. Closing always goes through
 * `onRequestClose`, which removes `?project=` from the address; the effect
 * below then closes the element. This file is loaded on demand (React.lazy).
 */
export default function ProjectDialog({
  project,
  projects,
  open,
  onRequestClose,
  onNavigate,
  onClosed,
}: ProjectDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const pressStartedOnBackdrop = useRef(false)
  const titleId = useId()

  useLockBodyScroll(open)

  // Keep the element in step with the URL. `showModal()` moves focus into the dialog.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open, project.slug])

  const total = projects.length
  const index = Math.max(
    0,
    projects.findIndex((item) => item.slug === project.slug),
  )
  const previous = projects[(index - 1 + total) % total]
  const next = projects[(index + 1) % total]
  // Shown after the project's own number ("02 / 05"), padded the same way.
  const count = String(total).padStart(project.number.length, '0')
  const palette = coverPalette(index)
  const { technologies } = project

  // Escape: close through the URL instead, so the address bar and the Back button stay correct.
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault()
    onRequestClose()
  }

  // Fires after every close. If the element closed by itself (a second Escape
  // press cannot be cancelled), the URL still has to catch up.
  const handleClose = () => {
    if (open) onRequestClose()
    onClosed(project.slug)
  }

  // A press that starts and ends on the <dialog> element itself landed on the backdrop.
  const handlePointerDown = (event: PointerEvent<HTMLDialogElement>) => {
    pressStartedOnBackdrop.current = event.target === event.currentTarget
  }

  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget && pressStartedOnBackdrop.current) onRequestClose()
    pressStartedOnBackdrop.current = false
  }

  return (
    <dialog
      ref={dialogRef}
      className="projects-dialog"
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClose={handleClose}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      {open ? <ProjectPageMeta project={project} /> : null}

      <div className="projects-dialog-panel @container/dialog">
        <header className="flex shrink-0 items-start gap-4 border-b border-line px-5 py-4 sm:px-8 sm:py-5">
          <span
            aria-hidden="true"
            className={cn(
              'hidden size-12 shrink-0 items-center justify-center rounded-xl border sm:flex',
              palette.tile,
            )}
          >
            <Icon name={project.icon} size={22} />
          </span>

          <div className="min-w-0 flex-1">
            {/* Inline, so a long category wraps as text and the divider stays with the number. */}
            <p className="text-xs leading-relaxed font-semibold tracking-[0.16em] uppercase">
              <span className="font-display font-bold tabular-nums">
                <span className="sr-only">Project </span>
                <span className={palette.text}>{project.number}</span>
                {/* The total is visual noise on a phone-sized header, so it is read out but not shown there. */}
                <span className="text-faint max-sm:sr-only">
                  <span aria-hidden="true"> / </span>
                  <span className="sr-only"> of </span>
                  {count}
                </span>
              </span>
              <span aria-hidden="true" className="mx-2.5 inline-block h-3 w-px bg-line-strong align-[-0.15em]" />
              <span className="text-faint">{project.category}</span>
            </p>
            <h3
              id={titleId}
              className="mt-1.5 text-xl leading-snug font-bold tracking-tight text-balance text-ink sm:text-2xl"
            >
              {project.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onRequestClose}
            aria-label="Close project details"
            className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-line bg-ink/4 text-muted transition duration-200 hover:border-line-strong hover:bg-ink/8 hover:text-ink"
          >
            <X aria-hidden="true" size={20} strokeWidth={2} />
          </button>
        </header>

        {/* Keyed by project so that previous / next start at the top and replay the entry animation. */}
        <div
          key={project.slug}
          tabIndex={0}
          role="group"
          aria-label="Project details"
          className="projects-dialog-body -outline-offset-2"
        >
          <div className="px-5 pt-5 pb-8 sm:px-8 sm:pt-7 sm:pb-10">
            <ProjectCover project={project} index={index} className="h-36 rounded-xl border border-line sm:h-44" />

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
              <StatusBadge label={project.status.label} tone={project.status.tone} />
              {project.status.detail ? <p className="text-sm text-muted">{project.status.detail}</p> : null}
            </div>

            <p className="mt-5 text-base leading-relaxed text-pretty text-ink sm:text-lg sm:leading-relaxed">
              {project.description}
            </p>

            <div className="mt-8 grid gap-8 @2xl/dialog:grid-cols-[minmax(0,1fr)_17rem] @2xl/dialog:gap-x-10">
              <DetailBlock title="Overview" className="@2xl/dialog:col-start-1 @2xl/dialog:row-start-1">
                <div className="space-y-4">
                  {project.overview.map((paragraph) => (
                    <p key={paragraph} className="text-[0.95rem] leading-relaxed text-pretty text-muted">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </DetailBlock>

              <DetailBlock
                title={project.featuresLabel}
                className="@2xl/dialog:col-span-2 @2xl/dialog:row-start-2"
              >
                <ul className="grid gap-2.5 @lg/dialog:grid-cols-2">
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex min-w-0 items-start gap-3 rounded-lg border border-line bg-ink/3 px-3.5 py-2.5 text-sm leading-snug text-ink"
                    >
                      <span
                        aria-hidden="true"
                        className={cn('mt-[0.45em] size-1.5 shrink-0 rounded-full', palette.bullet)}
                      />
                      <span className="min-w-0 break-words">{feature}</span>
                    </li>
                  ))}
                </ul>
              </DetailBlock>

              {/* A recessed panel: darker than the card, so the small labels keep their contrast. */}
              <aside className="min-w-0 self-start rounded-xl border border-line bg-canvas/40 p-5 @2xl/dialog:col-start-2 @2xl/dialog:row-start-1">
                <DetailBlock title={technologies.label}>
                  {technologies.items.length > 0 ? (
                    <ul className="flex flex-wrap gap-2">
                      {technologies.items.map((item) => (
                        <li key={item}>
                          <Tag>{item}</Tag>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {technologies.note ? (
                    <p
                      className={cn(
                        'text-[0.8125rem] leading-relaxed text-pretty text-muted',
                        technologies.items.length > 0 && 'mt-3',
                      )}
                    >
                      {technologies.note}
                    </p>
                  ) : null}
                  {technologies.items.length === 0 && !technologies.note ? (
                    <p className="text-[0.8125rem] leading-relaxed text-muted">Not specified yet.</p>
                  ) : null}
                </DetailBlock>

                <DetailBlock title="Links" className="mt-5 border-t border-line pt-5">
                  <ProjectLinks project={project} />
                </DetailBlock>
              </aside>
            </div>

            {project.notice ? (
              <div
                role="note"
                className="mt-8 flex gap-3 rounded-xl border border-line bg-ink/3 p-4 text-sm leading-relaxed text-muted"
              >
                <Info aria-hidden="true" size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-primary-soft" />
                <p className="min-w-0 text-pretty">{project.notice}</p>
              </div>
            ) : null}
          </div>
        </div>

        {total > 1 ? (
          <nav
            aria-label="Other projects"
            className="flex shrink-0 items-stretch gap-3 border-t border-line px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-8 sm:pt-4 sm:pb-4"
          >
            {/* With exactly two projects "previous" and "next" are the same entry: offer it once. */}
            {previous.slug === next.slug ? (
              <div className="ml-auto flex w-full sm:w-1/2">
                <ProjectNavButton direction="next" project={next} onSelect={onNavigate} />
              </div>
            ) : (
              <>
                <ProjectNavButton direction="previous" project={previous} onSelect={onNavigate} />
                <ProjectNavButton direction="next" project={next} onSelect={onNavigate} />
              </>
            )}
          </nav>
        ) : null}

        {/* Announces previous / next navigation; the dialog's own label covers the first opening. */}
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          Project {index + 1} of {total}: {project.title}
        </p>
      </div>
    </dialog>
  )
}

/** Mounted only while the dialog is open, so the document title follows the project being read. */
function ProjectPageMeta({ project }: { project: Project }) {
  usePageMeta({ title: `${project.title} | ${profile.name}`, description: project.description })
  return null
}

interface DetailBlockProps {
  title: string
  className?: string
  children: ReactNode
}

function DetailBlock({ title, className, children }: DetailBlockProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <h4 className={blockLabel}>{title}</h4>
      <div className="mt-3.5">{children}</div>
    </div>
  )
}

interface ProjectNavButtonProps {
  direction: 'previous' | 'next'
  project: Project
  onSelect: (slug: string) => void
}

function ProjectNavButton({ direction, project, onSelect }: ProjectNavButtonProps) {
  const isNext = direction === 'next'
  const Arrow = isNext ? ArrowRight : ArrowLeft

  return (
    <button
      type="button"
      onClick={() => onSelect(project.slug)}
      className={cn(
        'group/nav flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-xl border border-line px-3.5 py-2 transition duration-200 hover:border-line-strong hover:bg-ink/5 sm:px-4 sm:py-2.5',
        isNext ? 'flex-row-reverse text-right' : 'text-left',
      )}
    >
      <Arrow
        aria-hidden="true"
        size={16}
        strokeWidth={2}
        className={cn(
          'shrink-0 text-muted transition duration-200 group-hover/nav:text-ink',
          isNext ? 'group-hover/nav:translate-x-0.5' : 'group-hover/nav:-translate-x-0.5',
        )}
      />
      {/* The title is shown where the panel is wide enough for it; it is always part of the button's name. */}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-ink @min-[47rem]/dialog:text-[0.6875rem] @min-[47rem]/dialog:tracking-[0.16em] @min-[47rem]/dialog:text-muted @min-[47rem]/dialog:uppercase">
          {isNext ? 'Next project' : 'Previous project'}
        </span>
        <span className="sr-only">: </span>
        <span className="sr-only @min-[47rem]/dialog:not-sr-only">
          <span className="mt-0.5 block truncate text-sm font-semibold text-ink">{project.title}</span>
        </span>
      </span>
    </button>
  )
}
