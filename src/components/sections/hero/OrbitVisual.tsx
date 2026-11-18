import { useSpring, useTransform, type MotionStyle, type MotionValue } from 'motion/react'
import * as m from 'motion/react-m'
import { useId, type CSSProperties } from 'react'
import { LogoMark } from '@/components/ui/Logo'
import { hero, profile } from '@/data/profile'
import { cn } from '@/utils/cn'
import { EASE_OUT } from '@/utils/motion'

/*
 * The illustration is drawn in a 640-unit square with the core in the middle.
 * Angles run clockwise from 12 o'clock, like a dial.
 */
const VIEW = 640
const CENTER = VIEW / 2

function polar(radius: number, angle: number) {
  const radians = (angle * Math.PI) / 180
  return { x: CENTER + radius * Math.sin(radians), y: CENTER - radius * Math.cos(radians) }
}

function percent(units: number) {
  return `${((units / VIEW) * 100).toFixed(3)}%`
}

function point(radius: number, angle: number) {
  const { x, y } = polar(radius, angle)
  return `${x.toFixed(2)} ${y.toFixed(2)}`
}

/* ------------------------------------------------------------------ Orbits */

interface Orbit {
  radius: number
  /** Theme colour of the travelling node, its trail and the index mark. */
  accent: string
  /** Seconds per revolution. Inner orbits are faster, as in a real system. */
  period: number
  /** Where the node rests on load (and stays, for reduced motion). */
  start: number
  /** Length of the trail behind the node, in degrees. */
  trail: number
  /** Node diameter in pixels. */
  node: number
}

/** One orbit per discipline in `profile.disciplines`, from the inside out. */
const orbits: Orbit[] = [
  { radius: 116, accent: 'var(--primary)', period: 42, start: 180, trail: 84, node: 7 },
  { radius: 196, accent: 'var(--secondary)', period: 66, start: 150, trail: 60, node: 8 },
  { radius: 276, accent: 'var(--highlight)', period: 104, start: 262, trail: 44, node: 9 },
]

/* Dial graduations around the outer edge: a short tick every 3°, a longer one every 15°. */
const BEZEL_RADIUS = 309
const BEZEL_CIRCUMFERENCE = 2 * Math.PI * BEZEL_RADIUS
const minorTicks = `1 ${(BEZEL_CIRCUMFERENCE / 120 - 1).toFixed(3)}`
const majorTicks = `1.4 ${(BEZEL_CIRCUMFERENCE / 24 - 1.4).toFixed(3)}`

/** Distance between an orbit and the baseline of its caption. */
const CAPTION_GAP = 9

/** Arc across the top of an orbit that its caption is set along, reading left to right. */
function captionArc(orbit: Orbit): string {
  const radius = orbit.radius + CAPTION_GAP
  return `M ${point(radius, -80)} A ${radius} ${radius} 0 0 1 ${point(radius, 80)}`
}

/* ------------------------------------------------------------------- Chips */

type Depth = 'near' | 'mid' | 'far'

interface ChipSlot {
  /** Full system (desktop): the orbit the chip rests on and its angle. */
  orbit: number
  angle: number
  /** Horizontal slice (tablet): centre of the chip in illustration units. */
  slice: { x: number; y: number }
  depth: Depth
  float: 'animate-float' | 'animate-float-slow'
  /** Negative delay so the chips never bob in unison. */
  delay: number
}

/**
 * Positions for `hero.focusAreas`, in order. Each one either covers a ring
 * clearly or clears it clearly, and the top of the dial stays free for the
 * captions.
 */
const chipSlots: ChipSlot[] = [
  { orbit: 2, angle: 200, slice: { x: 175, y: 242 }, depth: 'mid', float: 'animate-float-slow', delay: -2 },
  { orbit: 1, angle: 248, slice: { x: 92, y: 320 }, depth: 'far', float: 'animate-float', delay: -5 },
  { orbit: 1, angle: 288, slice: { x: 150, y: 400 }, depth: 'near', float: 'animate-float', delay: -1 },
  { orbit: 1, angle: 100, slice: { x: 486, y: 398 }, depth: 'mid', float: 'animate-float-slow', delay: -7 },
  { orbit: 2, angle: 140, slice: { x: 470, y: 244 }, depth: 'near', float: 'animate-float', delay: -3.5 },
  { orbit: 2, angle: 46, slice: { x: 556, y: 320 }, depth: 'far', float: 'animate-float-slow', delay: -9 },
]

const depthStyles: Record<Depth, string> = {
  near: 'border-line-strong bg-card text-ink shadow-elevated',
  mid: 'border-line-strong bg-card/90 text-ink shadow-card',
  far: 'border-line bg-card/85 text-muted xl:scale-[0.94]',
}

/** How far a chip drifts with the pointer, in pixels at the edge of the hero. Nearer chips travel further. */
const depthDrift: Record<Depth, number> = { near: 9, mid: 6, far: 3 }

const DRIFT_SPRING = { stiffness: 60, damping: 18, mass: 0.7 }

interface OrbitChipProps {
  label: string
  slot: ChipSlot
  /** Position in the entrance sequence. */
  index: number
  driftX: MotionValue<number>
  driftY: MotionValue<number>
}

/** One focus area: a small glass chip floating over the orbits. */
function OrbitChip({ label, slot, index, driftX, driftY }: OrbitChipProps) {
  const drift = depthDrift[slot.depth]
  const x = useTransform(driftX, (value) => value * drift)
  const y = useTransform(driftY, (value) => value * drift)
  const full = polar(orbits[slot.orbit].radius, slot.angle)

  return (
    <m.span
      className="hero-chip hidden md:block"
      style={
        {
          x,
          y,
          '--hero-x': percent(full.x),
          '--hero-y': percent(full.y),
          '--hero-slice-x': percent(slot.slice.x),
          '--hero-slice-y': percent(slot.slice.y),
        } as MotionStyle
      }
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.3 + index * 0.04 }}
    >
      <span
        className={cn(
          'hero-chip-body rounded-md border font-medium whitespace-nowrap',
          depthStyles[slot.depth],
          slot.float,
        )}
        style={{ animationDelay: `${slot.delay}s` }}
      >
        <span className="hero-chip-dot bg-primary" />
        {label}
      </span>
    </m.span>
  )
}

/* ------------------------------------------------------------------ Visual */

interface OrbitVisualProps {
  /**
   * Pointer position over the hero, from -1 to 1 on each axis (0 at rest).
   * The chips follow it by a few pixels according to their depth.
   */
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
  className?: string
}

/**
 * Decorative orbital system: the FSM monogram at the centre, one orbit per
 * discipline, and the focus areas as chips floating over the orbits.
 *
 * CSS and inline SVG only. The rings are painted once; every moving part is a
 * small layer animated with `transform`, and all of it stops for visitors who
 * prefer reduced motion (see the global rule in styles/index.css).
 */
export function OrbitVisual({ pointerX, pointerY, className }: OrbitVisualProps) {
  const id = useId()
  const driftX = useSpring(pointerX, DRIFT_SPRING)
  const driftY = useSpring(pointerY, DRIFT_SPRING)
  const disciplines = profile.disciplines.slice(0, orbits.length)
  const focusAreas = hero.focusAreas.slice(0, chipSlots.length)

  return (
    <m.div
      aria-hidden="true"
      className={cn('hero-orbit pointer-events-none relative aspect-square w-full select-none', className)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.75, ease: EASE_OUT, delay: 0.1 }}
    >
      {/* Rings, glow and travelling nodes */}
      <div className="hero-field absolute inset-0">
        <div className="absolute inset-[4%] rounded-full bg-glow-primary" />
        <div className="absolute top-[6%] left-[38%] size-[54%] rounded-full bg-glow-secondary" />

        <svg viewBox={`0 0 ${VIEW} ${VIEW}`} fill="none" className="absolute inset-0 size-full">
          <defs>
            {/* Rings catch the light on the upper left and fall away on the lower right. */}
            <linearGradient id={`${id}-ring`} gradientUnits="userSpaceOnUse" x1="96" y1="64" x2="560" y2="592">
              <stop offset="0" style={{ stopColor: 'var(--ink)', stopOpacity: 0.5 }} />
              <stop offset="0.55" style={{ stopColor: 'var(--ink)', stopOpacity: 0.24 }} />
              <stop offset="1" style={{ stopColor: 'var(--ink)', stopOpacity: 0.14 }} />
            </linearGradient>
            <linearGradient id={`${id}-horizon`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={VIEW} y2="0">
              <stop offset="0" style={{ stopColor: 'var(--ink)', stopOpacity: 0 }} />
              <stop offset="0.18" style={{ stopColor: 'var(--ink)', stopOpacity: 0.16 }} />
              <stop offset="0.82" style={{ stopColor: 'var(--ink)', stopOpacity: 0.16 }} />
              <stop offset="1" style={{ stopColor: 'var(--ink)', stopOpacity: 0 }} />
            </linearGradient>
            {disciplines.map((discipline, index) => (
              <path key={discipline} id={`${id}-caption-${index}`} d={captionArc(orbits[index])} />
            ))}
          </defs>

          {/* Horizon line through the core */}
          <path
            d={`M 4 ${CENTER} H ${CENTER - 80} M ${CENTER + 80} ${CENTER} H ${VIEW - 4}`}
            stroke={`url(#${id}-horizon)`}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />

          {/* Dial graduations */}
          <g stroke={`url(#${id}-ring)`}>
            <circle cx={CENTER} cy={CENTER} r={BEZEL_RADIUS} strokeWidth="5" strokeDasharray={minorTicks} />
            <circle cx={CENTER} cy={CENTER} r={BEZEL_RADIUS} strokeWidth="10" strokeDasharray={majorTicks} />
          </g>

          {/* The three orbits */}
          <g stroke={`url(#${id}-ring)`} strokeWidth="1">
            <circle cx={CENTER} cy={CENTER} r={orbits[0].radius} vectorEffect="non-scaling-stroke" />
            <circle
              cx={CENTER}
              cy={CENTER}
              r={orbits[1].radius}
              strokeDasharray="1 6"
              strokeLinecap="round"
              strokeWidth="1.4"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx={CENTER} cy={CENTER} r={orbits[2].radius} vectorEffect="non-scaling-stroke" />
          </g>

          {/* Where each orbit crosses the horizon */}
          <g fill="var(--canvas)" stroke="var(--line-strong)" strokeWidth="1">
            {orbits.flatMap((orbit) =>
              [-1, 1].map((side) => (
                <circle
                  key={`${orbit.radius}-${side}`}
                  cx={CENTER + side * orbit.radius}
                  cy={CENTER}
                  r="2.6"
                  vectorEffect="non-scaling-stroke"
                />
              )),
            )}
          </g>

          {/* From 1280px, where the dial is large enough to read: an index mark on each orbit and the discipline engraved above it */}
          <g className="max-xl:hidden">
            {disciplines.map((discipline, index) => {
              const orbit = orbits[index]
              return (
                <g key={discipline}>
                  <path
                    d={`M ${CENTER} ${CENTER - orbit.radius - 4.5} V ${CENTER - orbit.radius + 4.5}`}
                    stroke={orbit.accent}
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                  <text className="hero-ring-label">
                    <textPath href={`#${id}-caption-${index}`} startOffset="50%" textAnchor="middle">
                      {discipline}
                    </textPath>
                  </text>
                </g>
              )
            })}
          </g>
        </svg>

        {orbits.map((orbit) => (
          <div
            key={orbit.radius}
            className="hero-track"
            style={
              {
                inset: percent(CENTER - orbit.radius),
                '--hero-accent': orbit.accent,
                '--hero-start': `${orbit.start}deg`,
                '--hero-period': `${orbit.period}s`,
                '--hero-trail': `${orbit.trail}deg`,
                '--hero-node': `${orbit.node}px`,
              } as CSSProperties
            }
          >
            <span className="hero-node" />
          </div>
        ))}
      </div>

      {/* Core: the monogram on a glass plate */}
      <div className="absolute top-1/2 left-1/2 flex aspect-square w-[clamp(4.25rem,19cqw,7.25rem)] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <span className="absolute -inset-[65%] animate-pulse-soft rounded-full bg-glow-primary" />
        <span className="absolute inset-0 rounded-full border border-line-strong bg-card shadow-elevated" />
        <span className="absolute inset-[9%] rounded-full border border-line bg-linear-to-b from-ink/6 to-transparent" />
        <span className="relative scale-110 md:scale-150 lg:scale-[1.15] xl:scale-[1.45] min-[90rem]:scale-[1.6]">
          <LogoMark />
        </span>
      </div>

      {/* Focus areas floating over the orbits */}
      {focusAreas.map((label, index) => (
        <OrbitChip key={label} label={label} slot={chipSlots[index]} index={index} driftX={driftX} driftY={driftY} />
      ))}
    </m.div>
  )
}
