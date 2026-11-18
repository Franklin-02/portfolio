import type { HTMLMotionProps } from 'motion/react'
import * as m from 'motion/react-m'
import { EASE_OUT, fadeUpItem, staggerContainer, VIEWPORT_ONCE } from '@/utils/motion'

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'whileInView' | 'viewport'> {
  /** Seconds to wait before animating. */
  delay?: number
  /** Distance in pixels the element travels upwards. Use 0 for a pure fade. */
  y?: number
}

/** Fades content in (with a short upward movement) the first time it scrolls into view. */
export function Reveal({ delay = 0, y = 22, children, ...props }: RevealProps) {
  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.65, ease: EASE_OUT, delay }}
      {...props}
    >
      {children}
    </m.div>
  )
}

type RevealGroupProps = Omit<HTMLMotionProps<'div'>, 'initial' | 'whileInView' | 'viewport' | 'variants'>

/**
 * Staggers its <RevealItem> children as the group scrolls into view.
 * For lists, use `m.ul` / `m.li` with the `staggerContainer` and `fadeUpItem`
 * variants from utils/motion instead.
 */
export function RevealGroup({ children, ...props }: RevealGroupProps) {
  return (
    <m.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT_ONCE} {...props}>
      {children}
    </m.div>
  )
}

type RevealItemProps = Omit<HTMLMotionProps<'div'>, 'variants'>

/** A child of <RevealGroup>. */
export function RevealItem({ children, ...props }: RevealItemProps) {
  return (
    <m.div variants={fadeUpItem} {...props}>
      {children}
    </m.div>
  )
}
