import { useInView, useReducedMotion } from 'motion/react'
import { Lock } from 'lucide-react'
import { useRef } from 'react'
import { accentStyles, TAIL_ACCENT } from '@/components/sections/experience/accents'
import { NODE_REACHED_MARGIN } from '@/components/sections/experience/rail'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/utils/cn'

interface TimelineTailProps {
  /** The confidentiality note from the content file. */
  note: string
}

/**
 * Closes the timeline: the rail ends in a small node, with the confidentiality
 * note next to it as a discreet footnote.
 */
export function TimelineTail({ note }: TimelineTailProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()
  const reached = useInView(ref, { margin: NODE_REACHED_MARGIN })

  return (
    <div className={cn('experience-tail', accentStyles[TAIL_ACCENT].scope)}>
      <span
        ref={ref}
        aria-hidden="true"
        className="experience-tail-node"
        data-lit={Boolean(reduceMotion) || reached}
      >
        <Lock size={13} strokeWidth={1.9} focusable="false" />
      </span>

      <Reveal y={12}>
        <p className="flex max-w-2xl items-start gap-2 text-xs leading-relaxed text-pretty text-faint sm:text-[0.8125rem] lg:pt-1">
          <Lock aria-hidden="true" focusable="false" size={13} strokeWidth={1.9} className="mt-[0.2em] shrink-0 lg:hidden" />
          <span className="min-w-0">{note}</span>
        </p>
      </Reveal>
    </div>
  )
}
