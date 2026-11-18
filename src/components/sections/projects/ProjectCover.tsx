import '@/components/sections/projects/projects.css'

import { useMemo, type CSSProperties } from 'react'
import { COVER_VIEWBOX, createCoverArt } from '@/components/sections/projects/coverArt'
import { Icon } from '@/components/ui/Icon'
import type { Project } from '@/types/content'
import { cn } from '@/utils/cn'

interface ProjectCoverProps {
  project: Project
  /** Position of the project in the list: selects the palette, shape, texture and lighting. */
  index: number
  className?: string
}

/**
 * Original abstract cover for a project, used where a screenshot would
 * normally go. It is generated from the project itself: its number, its icon
 * and one node per listed feature, in a treatment chosen from its position in
 * the list (see coverArt.ts). Purely decorative, so it is hidden from
 * assistive technology. The layout adapts to the box it is given: a wide
 * banner on cards and in the detail view, a tall panel on wide cards.
 */
export function ProjectCover({ project, index, className }: ProjectCoverProps) {
  const featureCount = project.features.length
  const art = useMemo(() => createCoverArt(index, featureCount), [index, featureCount])

  const style = {
    '--cover-accent': art.palette.accent,
    '--cover-blend': art.palette.blend,
    '--cover-glow-x': art.glowX,
    '--cover-glow-y': art.glowY,
    '--cover-angle': art.angle,
  } as CSSProperties

  return (
    <div aria-hidden="true" className={cn('projects-cover', className)} style={style}>
      <span className="projects-cover-texture" data-texture={art.texture} />

      <div className="projects-cover-emblem">
        <span className="projects-cover-halo" />
        <svg
          className="projects-cover-rings"
          viewBox={`0 0 ${COVER_VIEWBOX} ${COVER_VIEWBOX}`}
          fill="none"
          focusable="false"
        >
          {art.rings.map((ring) => (
            <g key={ring.d}>
              <path
                d={ring.d}
                stroke="var(--cover-ring)"
                strokeWidth={1}
                strokeDasharray={ring.dashed ? '2 6' : undefined}
              />
              {ring.arc ? (
                <path
                  d={ring.d}
                  pathLength={100}
                  stroke="var(--cover-accent)"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeDasharray={`${ring.arc.length} ${100 - ring.arc.length}`}
                  strokeDashoffset={-ring.arc.offset}
                />
              ) : null}
            </g>
          ))}

          {art.nodes.map((node, nodeIndex) => (
            // The list is generated once per project and never reordered, so the position is a stable key.
            <g key={nodeIndex}>
              {nodeIndex === 0 ? (
                <circle cx={node.x} cy={node.y} r={9} fill="var(--cover-accent)" opacity={0.2} />
              ) : null}
              {node.kind === 'solid' ? <circle cx={node.x} cy={node.y} r={3.6} fill="var(--cover-accent)" /> : null}
              {node.kind === 'hollow' ? (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={3.4}
                  fill="var(--cover-base)"
                  stroke="var(--cover-accent)"
                  strokeWidth={1.5}
                />
              ) : null}
              {node.kind === 'blend' ? <circle cx={node.x} cy={node.y} r={2.6} fill="var(--cover-blend)" /> : null}
            </g>
          ))}
        </svg>

        <span className={cn('projects-cover-tile', art.palette.text)}>
          <Icon name={project.icon} size={26} strokeWidth={1.6} />
        </span>
      </div>

      <span className="projects-cover-number font-display font-extrabold tabular-nums">{project.number}</span>
    </div>
  )
}
