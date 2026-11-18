/**
 * Geometry of the ring gauge. The dial is drawn on a 200 × 200 canvas and
 * scaled by CSS, so every number here is in viewBox units.
 */

export const GAUGE_SIZE = 200

const CENTER = GAUGE_SIZE / 2

/** Radius of the ring: the hairline track and the value arc share it. */
export const GAUGE_RADIUS = 88

/**
 * A full circle that starts at 12 o'clock and runs clockwise. With
 * `pathLength={100}` on the element, stroke dashes are measured in per cent
 * from the top of the dial.
 */
export const GAUGE_PATH = [
  `M ${CENTER} ${CENTER - GAUGE_RADIUS}`,
  `A ${GAUGE_RADIUS} ${GAUGE_RADIUS} 0 0 1 ${CENTER} ${CENTER + GAUGE_RADIUS}`,
  `A ${GAUGE_RADIUS} ${GAUGE_RADIUS} 0 0 1 ${CENTER} ${CENTER - GAUGE_RADIUS}`,
].join(' ')

/** The scale: one tick every 5%, a longer one at each quarter. */
const TICK_COUNT = 20
const TICK_OUTER = 77.5
const TICK_INNER = 73.5
const QUARTER_TICK_INNER = 70.5

export interface GaugeTick {
  /** Degrees clockwise from 12 o'clock. */
  angle: number
  quarter: boolean
  /** Distance of each end from the top edge of the canvas, before rotation. */
  y1: number
  y2: number
}

export const GAUGE_TICKS: GaugeTick[] = Array.from({ length: TICK_COUNT }, (_, index) => {
  const quarter = index % (TICK_COUNT / 4) === 0
  return {
    angle: (index * 360) / TICK_COUNT,
    quarter,
    y1: CENTER - TICK_OUTER,
    y2: CENTER - (quarter ? QUARTER_TICK_INNER : TICK_INNER),
  }
})

/** Keeps a reported percentage on the dial. */
export function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value))
}

/**
 * How far down the dial the end of the arc sits: 0 at the top, 1 at the bottom.
 * The arc is coloured by a top-to-bottom gradient, so this is also the mix of
 * the two gradient colours at the tip.
 */
export function tipBlend(percent: number): number {
  return (1 - Math.cos((clampPercent(percent) / 100) * 2 * Math.PI)) / 2
}
