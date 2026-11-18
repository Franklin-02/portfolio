import { useInView, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useRef } from 'react'
import { NODE_REACHED_MARGIN } from '@/components/sections/experience/rail'
import { Icon } from '@/components/ui/Icon'
import type { IconName } from '@/types/content'
import { EASE_OUT, VIEWPORT_ONCE } from '@/utils/motion'

interface RailNodeProps {
  /** `head` is the current role: always lit. An `entry` lights up when the rail reaches it. */
  kind: 'head' | 'entry'
  /** Shown from the `lg` breakpoint, where the node is an icon tile. */
  icon: IconName
}

/**
 * A node on the timeline rail: a compact dot on small screens, an icon tile on
 * large ones. It appears as it scrolls into view and takes its accent colour
 * once the drawn line reaches it. Decorative: the cards carry the content.
 */
export function RailNode({ kind, icon }: RailNodeProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()
  const reached = useInView(ref, { margin: NODE_REACHED_MARGIN })
  const lit = kind === 'head' || Boolean(reduceMotion) || reached

  return (
    <span ref={ref} aria-hidden="true" className="experience-node" data-kind={kind} data-lit={lit}>
      <m.span
        className="experience-node-mark"
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        <Icon name={icon} size={20} />
      </m.span>
    </span>
  )
}
