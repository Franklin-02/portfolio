import * as m from 'motion/react-m'
import { ProjectCard } from '@/components/sections/projects/ProjectCard'
import type { Project } from '@/types/content'
import { cn } from '@/utils/cn'
import { EASE_OUT, VIEWPORT_ONCE } from '@/utils/motion'

interface ProjectGridProps {
  projects: readonly Project[]
  onOpen: (project: Project, trigger: HTMLElement) => void
  onIntent: () => void
}

/**
 * The project showcase grid. It works for any number of projects:
 *
 * - the first project is the lead card and spans the full width;
 * - the rest fill a two-column grid from the `lg` breakpoint;
 * - a card left alone on the last row spans the full width as well.
 *
 * The cards recompose themselves for the width they are given, so none of
 * these rules depends on how many projects there are.
 */
export function ProjectGrid({ projects, onOpen, onIntent }: ProjectGridProps) {
  return (
    <ul className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-2 lg:gap-6">
      {projects.map((project, index) => {
        // Cards that share a row arrive one after the other.
        const delay = index > 0 && index % 2 === 0 ? 0.08 : 0

        return (
          <m.li
            key={project.slug}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.65, ease: EASE_OUT, delay }}
            className={cn('min-w-0', index === 0 ? 'lg:col-span-2' : 'lg:last:even:col-span-2')}
          >
            <ProjectCard project={project} index={index} lead={index === 0} onOpen={onOpen} onIntent={onIntent} />
          </m.li>
        )
      })}
    </ul>
  )
}
