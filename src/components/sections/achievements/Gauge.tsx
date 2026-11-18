import type { CSSProperties } from 'react'
import {
  clampPercent,
  GAUGE_PATH,
  GAUGE_RADIUS,
  GAUGE_SIZE,
  GAUGE_TICKS,
  tipBlend,
} from '@/components/sections/achievements/gaugeGeometry'
import { COUNT_DURATION } from '@/components/sections/achievements/timing'
import { cn } from '@/utils/cn'

interface GaugeProps {
  /** The reported percentage, 0–100. The arc ends exactly there. */
  value: number
  /** Draws the arc. Until then the dial shows only its empty scale. */
  active: boolean
  /** Unique on the page: names this dial's gradient definition. */
  id: string
  className?: string
}

const CENTER = GAUGE_SIZE / 2
const TOP = CENTER - GAUGE_RADIUS

/**
 * A ring gauge on a 0–100% scale: a hairline track with a tick every 5%, and
 * an arc that runs clockwise from 12 o'clock to the value. It depicts only the
 * number printed inside it, so it is decorative for assistive technology.
 * The drawing itself is done in achievements.css.
 */
export function Gauge({ value, active, id, className }: GaugeProps) {
  const percent = clampPercent(value)
  const gradientId = `${id}-gradient`

  const style = {
    '--achievements-gauge-value': percent,
    '--achievements-gauge-tip': `${(tipBlend(percent) * 100).toFixed(1)}%`,
    '--achievements-gauge-duration': `${COUNT_DURATION}s`,
  } as CSSProperties

  return (
    <svg
      viewBox={`0 0 ${GAUGE_SIZE} ${GAUGE_SIZE}`}
      aria-hidden="true"
      focusable="false"
      data-active={active}
      className={cn('achievements-gauge', className)}
      style={style}
    >
      <defs>
        {/* Top-to-bottom across the dial, so a given position always has the same colour. */}
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={CENTER}
          y1={TOP}
          x2={CENTER}
          y2={GAUGE_SIZE - TOP}
        >
          <stop offset="0" stopColor="var(--primary)" />
          <stop offset="1" stopColor="var(--secondary)" />
        </linearGradient>
      </defs>

      <g className="achievements-gauge-ticks">
        {GAUGE_TICKS.map((tick) => (
          <line
            key={tick.angle}
            x1={CENTER}
            y1={tick.y1}
            x2={CENTER}
            y2={tick.y2}
            transform={`rotate(${tick.angle} ${CENTER} ${CENTER})`}
            data-quarter={tick.quarter || undefined}
          />
        ))}
      </g>

      <circle className="achievements-gauge-track" cx={CENTER} cy={CENTER} r={GAUGE_RADIUS} />

      <path className="achievements-gauge-arc" d={GAUGE_PATH} pathLength={100} stroke={`url(#${gradientId})`} />

      {/* The end of the arc: its centre is the reading. */}
      <g className="achievements-gauge-tip">
        <circle className="achievements-gauge-tip-halo" cx={CENTER} cy={TOP} r={13} />
        <circle className="achievements-gauge-tip-dot" cx={CENTER} cy={TOP} r={6.5} />
      </g>
    </svg>
  )
}
