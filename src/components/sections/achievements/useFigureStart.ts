import { useInView, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'

/**
 * Decides when a figure may start counting: once its card has finished its
 * entrance AND the number is on screen. That keeps the movement from being
 * hidden behind the fade-in or spent while the visitor is looking elsewhere.
 * The decision is final, so every figure animates exactly once.
 *
 * Visitors who prefer reduced motion get the finished state straight away.
 *
 * @param revealed True once the surrounding card has finished its entrance.
 * @returns `ref` for the element holding the digits, and `started`.
 */
export function useFigureStart(revealed: boolean) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()
  const [started, setStarted] = useState(false)

  // Same threshold as the shared CountUp, which is mounted at this moment and
  // must find itself in view. Observation stops once the figure has started.
  const inView = useInView(ref, { amount: 0.6, once: started })

  if (!started && revealed && inView) setStarted(true)

  return { ref, started: started || reduceMotion === true }
}
