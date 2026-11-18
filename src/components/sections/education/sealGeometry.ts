/**
 * Geometry for the certification seal and the engraved rosette behind it.
 * Both are original abstract ornaments: they borrow the visual language of a
 * printed certificate without imitating any issuer's mark.
 */

const TAU = Math.PI * 2

function round(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Outline of a seal: a circle whose edge is a ring of small outward arcs.
 * A `depth` of 1 makes every scallop a half circle; larger values flatten them.
 */
export function scallopedCircle(center: number, radius: number, scallops: number, depth = 1.15): string {
  const chord = 2 * radius * Math.sin(Math.PI / scallops)
  const arcRadius = round((chord / 2) * depth)

  const corner = (step: number) => {
    const angle = (step / scallops) * TAU - Math.PI / 2
    return `${round(center + radius * Math.cos(angle))} ${round(center + radius * Math.sin(angle))}`
  }

  let path = `M${corner(0)}`
  for (let step = 1; step <= scallops; step++) {
    path += `A${arcRadius} ${arcRadius} 0 0 1 ${corner(step)}`
  }
  return `${path}Z`
}

/** Dash pattern that turns a circle's stroke into `count` evenly spaced radial ticks. */
export function tickDashArray(radius: number, count: number, tickWidth = 1): string {
  const step = (TAU * radius) / count
  return `${tickWidth} ${round(step - tickWidth)}`
}

/** Rotation angles, in degrees, for `count` copies of a shape spread evenly over half a turn. */
export function halfTurnAngles(count: number): number[] {
  return Array.from({ length: count }, (_, index) => round((index * 180) / count))
}
