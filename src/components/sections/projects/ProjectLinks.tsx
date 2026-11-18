import { ExternalLink, Link2Off } from 'lucide-react'
import { GitHubIcon } from '@/components/ui/BrandIcons'
import { ButtonLink } from '@/components/ui/Button'
import type { Project } from '@/types/content'
import { cn } from '@/utils/cn'

interface ProjectLinksProps {
  project: Project
  className?: string
}

/**
 * Repository and live-demo links for a project.
 *
 * A button is rendered only for a link that is actually set in
 * `src/data/projects.ts`. While a project has neither, its own `linksNote`
 * is shown instead, so the site never offers a link that does not exist.
 */
export function ProjectLinks({ project, className }: ProjectLinksProps) {
  const { github, demo } = project.links

  if (!github && !demo) {
    return (
      <p className={cn('flex min-w-0 items-start gap-2 text-xs leading-relaxed text-faint', className)}>
        <Link2Off aria-hidden="true" size={14} strokeWidth={1.75} className="mt-[0.2em] shrink-0" />
        <span className="min-w-0">{project.linksNote}</span>
      </p>
    )
  }

  return (
    <ul className={cn('flex flex-wrap gap-2.5', className)}>
      {github ? (
        <li>
          <ButtonLink href={github} external variant="outline">
            <GitHubIcon size={16} />
            GitHub
            <span className="sr-only">: {project.title}</span>
          </ButtonLink>
        </li>
      ) : null}
      {demo ? (
        <li>
          <ButtonLink href={demo} external variant="outline">
            <ExternalLink aria-hidden="true" size={16} strokeWidth={2} />
            Live demo
            <span className="sr-only">: {project.title}</span>
          </ButtonLink>
        </li>
      ) : null}
    </ul>
  )
}
