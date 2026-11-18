import type { Variants } from 'motion/react'

/**
 * Shared animation presets so every section moves the same way.
 * Motion is deliberately restrained: short distances, one easing curve.
 *
 * Usage: animated elements are the lightweight `m` components
 *   import * as m from 'motion/react-m'
 *   <m.ul variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT_ONCE}>
 *     <m.li variants={fadeUpItem}>...</m.li>
 *   </m.ul>
 * (`<MotionConfig reducedMotion="user">` in main.tsx disables the movement for
 * visitors who prefer reduced motion.)
 */

export const EASE_OUT = [0.22, 1, 0.36, 1] as const

/** Viewport settings for scroll reveals: animate once, slightly before fully in view. */
export const VIEWPORT_ONCE = { once: true, margin: '0px 0px -10% 0px' } as const

/** Parent variant that staggers its children. Pair with `fadeUpItem`. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

/** Child variant: fade in while moving up a short distance. */
export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
}

/** Child variant: fade in without movement. */
export const fadeItem: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
}
