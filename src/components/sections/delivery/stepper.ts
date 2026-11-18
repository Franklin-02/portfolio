/**
 * Helpers for the delivery process stepper: element ids, the stage number
 * format, and the timing of the line that runs along the track.
 */

/** From this width the stepper is horizontal (Tailwind `lg`). Keep in sync with delivery.css. */
export const HORIZONTAL_QUERY = '(min-width: 64rem)'

export function stepTabId(stepId: string): string {
  return `delivery-tab-${stepId}`
}

export function stepPanelId(stepId: string): string {
  return `delivery-panel-${stepId}`
}

/** 3 -> "03" */
export function formatStage(position: number): string {
  return String(position).padStart(2, '0')
}

/** Time the line takes to cross one segment when moving to a neighbouring stage. */
const SEGMENT_MS = 220
/** Upper limit for the whole run, however many stages are crossed. */
const RUN_MS = 520

export interface TrackTiming {
  /** Duration of one segment of the line, in milliseconds. */
  segmentMs: number
  /** Delay before the segment after stage `index` starts to fill or empty. */
  connectorDelay: (index: number) => number
  /** Delay before the node of stage `index` changes, so it lights up as the line reaches it. */
  nodeDelay: (index: number) => number
}

const STILL: TrackTiming = { segmentMs: 0, connectorDelay: () => 0, nodeDelay: () => 0 }

/**
 * The line runs from the previously selected stage to the new one, one
 * segment after the other, in the direction of travel.
 */
export function trackTiming(previous: number, selected: number): TrackTiming {
  const distance = Math.abs(selected - previous)
  if (distance === 0) return STILL

  const segmentMs = Math.round(Math.min(SEGMENT_MS, RUN_MS / distance))
  const forward = selected > previous
  const low = Math.min(previous, selected)
  const high = Math.max(previous, selected)

  return {
    segmentMs,
    connectorDelay: (index) => {
      if (index < low || index >= high) return 0
      return (forward ? index - previous : previous - 1 - index) * segmentMs
    },
    nodeDelay: (index) => (index < low || index > high ? 0 : Math.abs(index - previous) * segmentMs),
  }
}
