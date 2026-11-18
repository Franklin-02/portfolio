import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react'
import { useState, type CSSProperties, type KeyboardEvent } from 'react'
import { flushSync } from 'react-dom'
import '@/components/sections/delivery/delivery.css'
import { StepPanel } from '@/components/sections/delivery/StepPanel'
import {
  formatStage,
  HORIZONTAL_QUERY,
  stepPanelId,
  stepTabId,
  trackTiming,
} from '@/components/sections/delivery/stepper'
import { Button } from '@/components/ui/Button'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import type { DeliveryStep } from '@/types/content'
import { cn } from '@/utils/cn'

/** What changed the selection: the stage list itself, or the Previous / Next buttons. */
type SelectionSource = 'initial' | 'tabs' | 'buttons'

interface Selection {
  index: number
  /** The stage selected before this one: the line on the track runs from there. */
  previous: number
  source: SelectionSource
}

interface ProcessStepperProps {
  steps: DeliveryStep[]
  /** Id of the heading that names the list of stages. */
  labelledBy: string
}

/**
 * The delivery process as an interactive stepper, built on the WAI-ARIA tabs
 * pattern: one tab per stage, one panel per stage.
 *
 * The same markup is laid out twice by delivery.css. From `lg` it is a
 * horizontal track with the detail panel underneath; below that it is a
 * vertical stepper in which the selected stage opens in place. Nothing
 * advances on its own: the visitor selects a stage, or walks through the flow
 * with the Previous / Next buttons.
 */
export function ProcessStepper({ steps, labelledBy }: ProcessStepperProps) {
  const [selection, setSelection] = useState<Selection>({ index: 0, previous: 0, source: 'initial' })
  const horizontal = useMediaQuery(HORIZONTAL_QUERY)

  const count = steps.length
  if (count === 0) return null

  const selected = Math.min(selection.index, count - 1)
  const timing = trackTiming(Math.min(selection.previous, count - 1), selected)
  const total = formatStage(count)
  const isFirst = selected === 0
  const isLast = selected === count - 1
  const upNext = isLast ? undefined : steps[selected + 1]

  /**
   * Selects a stage. In the vertical layout the open panel moves, which shifts
   * everything below it; the page is scrolled by the same amount so that the
   * control the visitor just used (`anchor`) stays where it was on screen.
   */
  const select = (index: number, source: SelectionSource, anchor: HTMLElement | null | undefined) => {
    if (index === selected || index < 0 || index >= count) return

    const before = anchor?.getBoundingClientRect().top
    flushSync(() => setSelection({ index, previous: selected, source }))

    if (anchor && before !== undefined) {
      const shift = anchor.getBoundingClientRect().top - before
      if (Math.abs(shift) >= 1) window.scrollBy({ top: shift, behavior: 'instant' })
    }
  }

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return

    let target: number
    switch (event.key) {
      case 'ArrowRight':
        target = (index + 1) % count
        break
      case 'ArrowLeft':
        target = (index - 1 + count) % count
        break
      case 'ArrowDown':
        // Up and Down belong to the page when the stages run left to right.
        if (horizontal) return
        target = (index + 1) % count
        break
      case 'ArrowUp':
        if (horizontal) return
        target = (index - 1 + count) % count
        break
      case 'Home':
        target = 0
        break
      case 'End':
        target = count - 1
        break
      default:
        return
    }

    event.preventDefault()
    const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    const tab = tabs?.[target]
    select(target, 'tabs', tab)
    tab?.focus()
  }

  const stepperStyle = {
    '--delivery-count': count,
    '--delivery-segments': Math.max(1, count - 1),
    '--delivery-selected': selected,
    '--delivery-shell-row': selected * 2 + 2,
    '--delivery-step': `${timing.segmentMs}ms`,
  } as CSSProperties

  return (
    <div className="delivery-stepper lg:card-sheen" style={stepperStyle}>
      {/* Decoration of the horizontal track: a faint grid and a soft light under the selected stage. */}
      <div aria-hidden="true" className="delivery-backdrop" />
      <div aria-hidden="true" className="delivery-spot">
        <span />
      </div>

      {/* The line between each stage and the next. */}
      {steps.slice(0, -1).map((step, index) => (
        <span
          key={step.id}
          aria-hidden="true"
          className="delivery-connector"
          data-filled={index < selected}
          style={
            {
              '--delivery-index': index,
              '--delivery-row': index * 2 + 1,
              '--delivery-column': index + 1,
              '--delivery-delay': `${timing.connectorDelay(index)}ms`,
            } as CSSProperties
          }
        />
      ))}

      <div
        role="tablist"
        aria-labelledby={labelledBy}
        aria-orientation={horizontal ? 'horizontal' : 'vertical'}
        className="delivery-tablist"
      >
        {steps.map((step, index) => {
          const isSelected = index === selected

          return (
            <button
              key={step.id}
              type="button"
              role="tab"
              id={stepTabId(step.id)}
              aria-selected={isSelected}
              aria-controls={stepPanelId(step.id)}
              tabIndex={isSelected ? 0 : -1}
              data-state={isSelected ? 'current' : index < selected ? 'complete' : 'upcoming'}
              style={
                {
                  '--delivery-row': index * 2 + 1,
                  '--delivery-delay': `${timing.nodeDelay(index)}ms`,
                } as CSSProperties
              }
              className="delivery-tab flex w-full items-start gap-4 rounded-xl py-2 text-left lg:flex-col lg:items-center lg:gap-3.5 lg:px-1.5 lg:pb-2.5 lg:text-center"
              onClick={(event) => select(index, 'tabs', event.currentTarget)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              <span aria-hidden="true" className="delivery-node font-display text-[0.8125rem] font-bold tabular-nums">
                <span className="relative">{formatStage(index + 1)}</span>
              </span>
              <span className="delivery-label min-w-0 flex-1 pt-2 font-display text-base leading-6 font-semibold tracking-tight break-words lg:flex-none lg:pt-0 lg:text-sm lg:leading-snug lg:text-balance xl:text-[0.9375rem]">
                {step.title}
              </span>
              <ChevronDown
                aria-hidden="true"
                size={18}
                strokeWidth={2}
                className="delivery-chevron mt-[0.6875rem] shrink-0 lg:hidden"
              />
            </button>
          )
        })}
      </div>

      {/* Points from the detail panel up to the selected stage (horizontal layout). */}
      <span aria-hidden="true" className="delivery-caret" />

      <div className="delivery-shell">
        <div className="delivery-panels p-4 sm:p-6 lg:px-10 lg:pt-9 lg:pb-8">
          {steps.map((step, index) => (
            <StepPanel
              key={step.id}
              step={step}
              id={stepPanelId(step.id)}
              tabId={stepTabId(step.id)}
              number={formatStage(index + 1)}
              total={total}
              selected={index === selected}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-3.5 sm:px-6 sm:py-4 lg:px-10 lg:py-5">
          <p className="hidden min-w-0 text-sm text-muted sm:block">
            {upNext ? (
              <>
                Up next
                <span aria-hidden="true" className="mx-2 text-faint">
                  /
                </span>
                <span className="sr-only">: </span>
                <span className="font-medium text-ink">{upNext.title}</span>
              </>
            ) : (
              'Final stage of the flow'
            )}
          </p>

          <div className="flex w-full gap-2.5 sm:w-auto">
            <Button
              variant="outline"
              aria-disabled={isFirst || undefined}
              className={cn('grow basis-0 sm:grow-0 sm:basis-auto', isFirst && 'pointer-events-none opacity-45')}
              onClick={(event) => select(selected - 1, 'buttons', event.currentTarget)}
            >
              <ArrowLeft aria-hidden="true" size={16} strokeWidth={2} />
              Previous
              <span className="sr-only"> stage</span>
            </Button>
            <Button
              variant="secondary"
              aria-disabled={isLast || undefined}
              className={cn('group/next grow basis-0 sm:grow-0 sm:basis-auto', isLast && 'pointer-events-none opacity-45')}
              onClick={(event) => select(selected + 1, 'buttons', event.currentTarget)}
            >
              Next
              <span className="sr-only"> stage</span>
              <ArrowRight
                aria-hidden="true"
                size={16}
                strokeWidth={2}
                className="transition-transform duration-200 group-hover/next:translate-x-0.5"
              />
            </Button>
          </div>

          {/* Announces the new stage when the buttons change it; the tabs announce themselves. */}
          <p role="status" className="sr-only">
            {selection.source === 'buttons' ? `Stage ${selected + 1} of ${count}: ${steps[selected].title}` : ''}
          </p>
        </div>
      </div>
    </div>
  )
}
