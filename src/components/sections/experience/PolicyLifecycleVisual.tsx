import { ShieldCheck } from 'lucide-react'
import type { CSSProperties } from 'react'
import { VisualFrame } from '@/components/sections/experience/VisualFrame'

/** Drawing space of the diagram. The text labels are placed in the same proportions. */
const VIEW = { width: 320, height: 180 }

/** The loop the stages sit on: two straight edges joined by half circles. */
const LOOP = { left: 40, right: 280, top: 52, bottom: 128 }
const RADIUS = (LOOP.bottom - LOOP.top) / 2
const EDGE_START = LOOP.left + RADIUS
const EDGE_END = LOOP.right - RADIUS
const EDGE_LENGTH = EDGE_END - EDGE_START
const ARC_LENGTH = Math.PI * RADIUS
const LOOP_LENGTH = 2 * (EDGE_LENGTH + ARC_LENGTH)
const MIDDLE = (LOOP.top + LOOP.bottom) / 2

/** Horizontal positions of the stages on each edge. */
const COLUMNS = [86, 160, 234]

/** Distance between the centre of a stage and its label. */
const LABEL_GAP = 13

/** Stages of a generic policy life cycle, in order. Product-neutral on purpose. */
const STAGE_NAMES = ['Submission', 'Quote', 'Bind', 'Issue', 'Change', 'Renew']

/** The first three stages run along the upper edge, the last three back along the lower one. */
const stages = STAGE_NAMES.map((name, index) => {
  const upper = index < COLUMNS.length
  const x = upper ? COLUMNS[index] : COLUMNS[STAGE_NAMES.length - 1 - index]
  // Distance along the loop, clockwise from the start of the upper edge.
  const travelled = upper ? x - EDGE_START : EDGE_LENGTH + ARC_LENGTH + (EDGE_END - x)

  return { name, x, y: upper ? LOOP.top : LOOP.bottom, upper, at: travelled / LOOP_LENGTH }
})

const arc = `A${RADIUS} ${RADIUS} 0 0 1`
/** Submission round to renewal. */
const forwardPath = `M${EDGE_START} ${LOOP.top}H${EDGE_END}${arc} ${EDGE_END} ${LOOP.bottom}H${EDGE_START}`
/** Renewal back to the start of the next term. */
const returnPath = `M${EDGE_START} ${LOOP.bottom}${arc} ${EDGE_START} ${LOOP.top}`
const loopPath = `${forwardPath}${arc} ${EDGE_START} ${LOOP.top}Z`

const percent = (share: number) => `${(share * 100).toFixed(3)}%`

interface PolicyLifecycleVisualProps {
  className?: string
}

/**
 * Original, abstract illustration of a policy life cycle: six generic stages
 * on a loop around the policy. It does not reproduce any product screen.
 */
export function PolicyLifecycleVisual({ className }: PolicyLifecycleVisualProps) {
  return (
    <VisualFrame
      title="Policy life cycle"
      label="Illustration of a policy life cycle: submission, quote, bind, issue, change and renew."
      className={className}
    >
      <div className="relative aspect-[16/9]">
        <svg
          viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
          fill="none"
          focusable="false"
          className="absolute inset-0 size-full"
        >
          <path d={forwardPath} stroke="var(--line-strong)" strokeWidth={1.25} />
          <path d={returnPath} stroke="var(--line-strong)" strokeWidth={1.25} strokeDasharray="3 4.5" />

          {/* Direction of travel */}
          <path
            d={`M${LOOP.right - 4} ${MIDDLE - 2.25}l4 4.5 4-4.5`}
            stroke="var(--experience-accent)"
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={`M${LOOP.left - 4} ${MIDDLE + 2.25}l4-4.5 4 4.5`}
            stroke="var(--experience-accent)"
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.6}
          />

          {/* A point of light travels round the loop */}
          <path
            d={loopPath}
            pathLength={100}
            className="experience-orbit"
            stroke="var(--experience-accent-soft)"
            strokeWidth={2.25}
            strokeLinecap="round"
          />

          {stages.map((stage) => (
            <g key={stage.name}>
              <circle
                className="experience-stage-halo"
                style={{ '--experience-at': stage.at } as CSSProperties}
                cx={stage.x}
                cy={stage.y}
                r={11}
                fill="var(--experience-accent)"
              />
              <circle
                cx={stage.x}
                cy={stage.y}
                r={5.5}
                fill="var(--card)"
                stroke="var(--experience-accent)"
                strokeWidth={1.5}
              />
              <circle cx={stage.x} cy={stage.y} r={2} fill="var(--experience-accent)" />
            </g>
          ))}
        </svg>

        {stages.map((stage) => (
          <span
            key={stage.name}
            className="absolute -translate-x-1/2 text-[0.6875rem] leading-none font-medium whitespace-nowrap text-muted"
            style={{
              left: percent(stage.x / VIEW.width),
              ...(stage.upper
                ? { bottom: percent(1 - (stage.y - LABEL_GAP) / VIEW.height) }
                : { top: percent((stage.y + LABEL_GAP) / VIEW.height) }),
            }}
          >
            {stage.name}
          </span>
        ))}

        {/* The policy the cycle turns around */}
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
          <span className="flex aspect-square w-[10.5%] min-w-7 items-center justify-center rounded-lg border border-(--experience-accent)/35 bg-(--experience-accent)/12 text-(--experience-accent-soft)">
            <ShieldCheck aria-hidden="true" focusable="false" strokeWidth={1.75} className="size-[56%]" />
          </span>
          <span className="text-[0.5625rem] leading-none font-semibold tracking-[0.18em] text-faint uppercase">
            Policy
          </span>
        </span>
      </div>
    </VisualFrame>
  )
}
