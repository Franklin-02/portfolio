import { animate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/utils/cn'

interface CountUpProps {
  /** Final value. */
  value: number
  prefix?: string
  suffix?: string
  /** Animation length in seconds. */
  duration?: number
  className?: string
}

/**
 * Counts from 0 to `value` the first time it scrolls into view.
 *
 * - Visitors who prefer reduced motion see the final value immediately.
 * - Screen readers always get the final value, never the intermediate ticks.
 * - `tabular-nums` keeps the width steady while the digits change.
 */
export function CountUp({ value, prefix = '', suffix = '', duration = 1.8, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView || reduceMotion) return

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })

    return () => controls.stop()
  }, [inView, reduceMotion, value, duration])

  const shown = reduceMotion ? value : display

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      <span aria-hidden="true">
        {prefix}
        {shown}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {value}
        {suffix}
      </span>
    </span>
  )
}
