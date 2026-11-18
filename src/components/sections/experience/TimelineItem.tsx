import type { ReactNode } from 'react'
import { accentStyles, type ExperienceAccent } from '@/components/sections/experience/accents'
import { RailNode } from '@/components/sections/experience/RailNode'
import { RailSegment } from '@/components/sections/experience/RailSegment'
import type { IconName } from '@/types/content'
import { cn } from '@/utils/cn'

interface TimelineItemProps {
  /** `head` is the company card that opens the timeline, `entry` a project engagement. */
  kind: 'head' | 'entry'
  icon: IconName
  accent: ExperienceAccent
  /** Accent of whatever follows on the rail. */
  nextAccent: ExperienceAccent
  /** Nothing but the closing footnote follows this item. */
  last?: boolean
  children: ReactNode
}

/**
 * One entry of the timeline: its node, the stretch of rail down to the next
 * node, and the card. The rail sits in the gutter to the left of the card.
 */
export function TimelineItem({ kind, icon, accent, nextAccent, last = false, children }: TimelineItemProps) {
  return (
    <li className={cn('experience-item', accentStyles[accent].scope)} data-kind={kind}>
      <RailSegment toAccent={nextAccent} toTail={last} />
      <RailNode kind={kind} icon={icon} />
      {children}
    </li>
  )
}
