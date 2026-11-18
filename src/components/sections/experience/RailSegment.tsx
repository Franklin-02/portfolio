import { useReducedMotion, useScroll, useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import { useRef } from 'react'
import { accentStyles, type ExperienceAccent } from '@/components/sections/experience/accents'
import { SEGMENT_OFFSET } from '@/components/sections/experience/rail'
import { cn } from '@/utils/cn'

interface RailSegmentProps {
  /** Accent of the node this stretch of rail runs to: the line blends into it. */
  toAccent: ExperienceAccent
  /** The stretch ends at the closing node under the last entry. */
  toTail?: boolean
}

/**
 * One stretch of the timeline rail, from the node of its own item to the next
 * node (see experience.css for the geometry). The gradient line is drawn as
 * the visitor scrolls. Visitors who prefer reduced motion get the finished line.
 */
export function RailSegment({ toAccent, toTail = false }: RailSegmentProps) {
  const reduceMotion = useReducedMotion()
  const className = cn('experience-segment', accentStyles[toAccent].scope)
  const end = toTail ? 'tail' : 'node'

  if (reduceMotion) {
    return (
      <span aria-hidden="true" className={className} data-to={end}>
        <span className="experience-fill" />
      </span>
    )
  }

  return <ScrollDrawnSegment className={className} end={end} />
}

interface ScrollDrawnSegmentProps {
  className: string
  end: 'node' | 'tail'
}

function ScrollDrawnSegment({ className, end }: ScrollDrawnSegmentProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: SEGMENT_OFFSET })

  // The point of light rides on the end of the line: its carrier is as tall as the
  // track, so moving it up by the undrawn share puts its lower edge on the fill's end.
  const pointY = useTransform(scrollYProgress, (progress) => `${(progress - 1) * 100}%`)
  // Hidden while the line rests at either node.
  const pointOpacity = useTransform(scrollYProgress, [0, 0.02, 0.98, 1], [0, 1, 1, 0])

  return (
    <span ref={ref} aria-hidden="true" className={className} data-to={end}>
      <m.span className="experience-fill" style={{ scaleY: scrollYProgress }} />
      <m.span className="experience-point-carrier" style={{ y: pointY, opacity: pointOpacity }}>
        <span className="experience-point" />
      </m.span>
    </span>
  )
}
