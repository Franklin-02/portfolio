import { Award } from 'lucide-react'
import { halfTurnAngles, scallopedCircle, tickDashArray } from '@/components/sections/education/sealGeometry'
import { cn } from '@/utils/cn'

const SIZE = 160
const CENTER = SIZE / 2

const OUTER_EDGE = scallopedCircle(CENTER, 73, 30)
const INNER_EDGE = scallopedCircle(CENTER, 68.5, 30)

const TICK_RADIUS = 58
const TICKS = tickDashArray(TICK_RADIUS, 72)

const ORBIT_RADIUS = 45.5
/** Near-zero dashes with round caps draw as dots. */
const ORBIT_DOTS = tickDashArray(ORBIT_RADIUS, 48, 0.1)

const ROSETTE_SIZE = 480
const ROSETTE_CENTER = ROSETTE_SIZE / 2
const ROSETTE_ANGLES = halfTurnAngles(30)

interface CredentialSealProps {
  className?: string
}

/**
 * Seal-like emblem for a certification card: a scalloped edge, a ring of fine
 * ticks, a slowly turning dotted orbit and a medallion carrying an icon.
 *
 * Behind it sits a faint engraved rosette, which the certificate frame clips.
 * The emblem is an original ornament, not any issuer's mark, and it is purely
 * decorative: the credential itself is stated in text next to it.
 */
export function CredentialSeal({ className }: CredentialSealProps) {
  return (
    <div aria-hidden="true" className={cn('relative aspect-square shrink-0', className)}>
      {/* Engraved rosette: overlapping ellipses, the kind of line work printed on certificates. */}
      <svg
        viewBox={`0 0 ${ROSETTE_SIZE} ${ROSETTE_SIZE}`}
        fill="none"
        focusable="false"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[360%] max-w-none -translate-x-1/2 -translate-y-1/2 text-primary opacity-30 [mask-image:radial-gradient(closest-side,#000_38%,transparent_100%)]"
      >
        {ROSETTE_ANGLES.map((angle) => (
          <ellipse
            key={angle}
            cx={ROSETTE_CENTER}
            cy={ROSETTE_CENTER}
            rx={228}
            ry={76}
            stroke="currentColor"
            strokeWidth={0.75}
            transform={`rotate(${angle} ${ROSETTE_CENTER} ${ROSETTE_CENTER})`}
          />
        ))}
      </svg>

      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} fill="none" focusable="false" className="absolute inset-0 size-full">
        {/* Scalloped edge. The first layer is the card colour, so the rosette does not show through the seal. */}
        <path d={OUTER_EDGE} fill="var(--card)" />
        <path d={OUTER_EDGE} fill="var(--primary)" fillOpacity={0.08} stroke="var(--primary)" strokeOpacity={0.6} />
        <path d={INNER_EDGE} stroke="var(--primary)" strokeOpacity={0.28} strokeWidth={0.75} />

        {/* Ring of fine ticks */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={TICK_RADIUS}
          stroke="var(--primary-soft)"
          strokeOpacity={0.55}
          strokeWidth={5}
          strokeDasharray={TICKS}
        />
        <circle cx={CENTER} cy={CENTER} r={51} stroke="var(--line-strong)" strokeWidth={0.75} />

        {/* Dotted orbit that turns very slowly */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={ORBIT_RADIUS}
          stroke="var(--secondary-soft)"
          strokeOpacity={0.8}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray={ORBIT_DOTS}
          className="origin-center animate-spin-slow [transform-box:fill-box]"
        />
      </svg>

      {/* Medallion */}
      <span className="bg-brand-gradient absolute top-1/2 left-1/2 flex size-[47%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-glow ring-1 ring-white/20 ring-inset">
        <Award focusable="false" strokeWidth={1.6} className="size-[46%]" />
      </span>
    </div>
  )
}
