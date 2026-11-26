import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { ProjectDialogBoundary } from '@/components/sections/projects/ProjectDialogBoundary'
import { ProjectDialogLoading, ProjectDialogUnavailable } from '@/components/sections/projects/ProjectDialogFallback'
import { projectTriggerId } from '@/components/sections/projects/projectDom'
import { ProjectGrid } from '@/components/sections/projects/ProjectGrid'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getProjectBySlug, projects, projectsContent } from '@/data/projects'
import { PROJECT_PARAM, useProjectParam } from '@/hooks/useProjectParam'
import type { Project } from '@/types/content'

const SECTION_ID = 'projects'

/**
 * The detail view lives in its own chunk, fetched the first time it is needed:
 * when a visitor points at or focuses a "View Details" button, or arrives on a
 * shared /?project=<slug> link.
 */
const loadProjectDialog = () => import('@/components/sections/projects/ProjectDialog')
const ProjectDialog = lazy(loadProjectDialog)

function preloadProjectDialog(): void {
  // A failed preload is not reported: opening a project asks again and handles the failure.
  loadProjectDialog().catch(() => {})
}

/** The project slug in the address bar right now, if any. */
function readProjectParam(): string | undefined {
  return new URLSearchParams(window.location.search).get(PROJECT_PARAM) ?? undefined
}

/**
 * Freelance Projects: the showcase grid and the project detail view.
 *
 * Everything is generated from `projects` in src/data/projects.ts. The open
 * project lives in the URL (`?project=<slug>`, see useProjectParam), which
 * makes a detail view shareable and lets the browser Back button close it.
 */
export function Projects() {
  const { slug, open, replace, close } = useProjectParam()
  const activeProject = getProjectBySlug(slug ?? undefined)

  // The project opened most recently. Keeping it after the URL is cleared lets the
  // dialog stay mounted and fade out with its content still in place.
  const [shownProject, setShownProject] = useState<Project | undefined>(activeProject)
  if (activeProject && activeProject !== shownProject) setShownProject(activeProject)

  const [dialogFailed, setDialogFailed] = useState(false)

  /** The "View Details" button that opened the dialog: focus goes back to it. */
  const openerRef = useRef<HTMLElement | null>(null)
  /** True from a close request until the URL has changed, so one dialog never goes "back" twice. */
  const closeRequestedRef = useRef(false)
  const closeRetryTimerRef = useRef<number | undefined>(undefined)

  // A project is open (again): the next close request is a new one.
  useEffect(() => {
    if (!activeProject) return
    closeRequestedRef.current = false
    window.clearTimeout(closeRetryTimerRef.current)
  }, [activeProject])

  useEffect(() => () => window.clearTimeout(closeRetryTimerRef.current), [])

  // The address names a project that does not exist: tidy it up and show nothing.
  useEffect(() => {
    if (slug !== null && !activeProject) close()
  }, [slug, activeProject, close])

  // Arriving on a shared link: bring the project's card into view behind the dialog, so that
  // closing the dialog leaves the visitor in the projects section. This happens once, on
  // arrival; it is only repeated while the page is still settling (web fonts change the
  // height of everything above) and never after the dialog has been closed.
  useEffect(() => {
    const linked = getProjectBySlug(readProjectParam())
    if (!linked) return

    const align = () => {
      if (readProjectParam() === undefined) return // closed in the meantime: the visitor is in charge now

      const section = document.getElementById(SECTION_ID)
      const card = document.getElementById(projectTriggerId(linked.slug))?.closest('article')
      const target = linked === projects[0] ? section : (card ?? section)
      target?.scrollIntoView({ behavior: 'instant', block: 'start' })
    }

    let active = true
    const alignIfActive = () => {
      if (active) align()
    }

    align()
    void document.fonts.ready.then(alignIfActive)
    window.addEventListener('load', alignIfActive, { once: true })

    return () => {
      active = false
      window.removeEventListener('load', alignIfActive)
    }
  }, [])

  const handleOpen = useCallback(
    (project: Project, trigger: HTMLElement) => {
      if (dialogFailed) return // the notice below explains why nothing opens
      openerRef.current = trigger
      open(project.slug)
    },
    [dialogFailed, open],
  )

  const requestClose = useCallback(() => {
    if (closeRequestedRef.current) return
    closeRequestedRef.current = true
    close()
    // Safety net: if the address somehow did not change, allow another attempt.
    window.clearTimeout(closeRetryTimerRef.current)
    closeRetryTimerRef.current = window.setTimeout(() => {
      closeRequestedRef.current = false
    }, 1000)
  }, [close])

  const handleClosed = useCallback((closedSlug: string) => {
    const opener = openerRef.current
    openerRef.current = null
    // After a shared link there is no opener: use the card of the project that was open.
    const target = opener?.isConnected ? opener : document.getElementById(projectTriggerId(closedSlug))
    target?.focus()
  }, [])

  const handleDialogError = useCallback(() => {
    setDialogFailed(true)
    requestClose()
  }, [requestClose])

  return (
    <Section
      id={SECTION_ID}
      tone="canvas"
      decoration={
        <>
          <div className="bg-glow-primary absolute -top-48 right-[-14%] size-[44rem] opacity-80" />
          <div className="bg-glow-secondary absolute bottom-[-18rem] left-[-16%] size-[42rem] opacity-80" />
        </>
      }
    >
      <SectionHeading
        id="projects-heading"
        eyebrow={projectsContent.eyebrow}
        title={projectsContent.heading}
        description={projectsContent.description}
      />

      <ProjectGrid projects={projects} onOpen={handleOpen} onIntent={preloadProjectDialog} />

      {shownProject && !dialogFailed ? (
        <ProjectDialogBoundary onError={handleDialogError}>
          <Suspense fallback={activeProject ? <ProjectDialogLoading /> : null}>
            <ProjectDialog
              project={shownProject}
              projects={projects}
              open={Boolean(activeProject)}
              onRequestClose={requestClose}
              onNavigate={replace}
              onClosed={handleClosed}
            />
          </Suspense>
        </ProjectDialogBoundary>
      ) : null}

      {dialogFailed ? <ProjectDialogUnavailable /> : null}
    </Section>
  )
}
