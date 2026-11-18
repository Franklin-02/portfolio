import { Check, ChevronDown } from 'lucide-react'
import { useRef, useState, type CSSProperties } from 'react'
import { cn } from '@/utils/cn'

/** Entries shown on a narrow card before the visitor asks for the rest. */
const COLLAPSED_COUNT = 6

interface ResponsibilityListProps {
  /** Id of the list: the toggle button refers to it. */
  id: string
  items: string[]
  /** Text colour class of the check markers. */
  accentText: string
}

/**
 * The responsibilities of an engagement.
 *
 * On a wide card every entry is shown, in two columns that read downwards.
 * On a narrow card (a phone) the list is a single column: the first six
 * entries are shown and a button reveals the rest. Which of the two applies is
 * decided in CSS from the width of the card, so nothing changes after load.
 */
export function ResponsibilityList({ id, items, accentText }: ResponsibilityListProps) {
  const [expanded, setExpanded] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const rows = Math.ceil(items.length / 2)
  const collapsible = items.length > COLLAPSED_COUNT

  const toggle = () => {
    const collapsing = expanded
    setExpanded(!expanded)

    // Once the list has its new height:
    window.requestAnimationFrame(() => {
      // the list shrank above the button, so make sure the button is still on screen;
      if (collapsing) buttonRef.current?.scrollIntoView({ block: 'nearest' })
      // and let scroll-linked animation (the timeline rail) measure the page again.
      window.dispatchEvent(new Event('scroll'))
    })
  }

  return (
    <>
      <ul
        id={id}
        style={{ '--experience-rows': rows } as CSSProperties}
        className="grid @xl/card:grid-flow-col @xl/card:grid-cols-2 @xl/card:grid-rows-[repeat(var(--experience-rows),auto)] @xl/card:gap-x-10 @5xl/card:gap-x-14"
      >
        {items.map((item, index) => {
          const extra = index >= COLLAPSED_COUNT

          return (
            <li
              key={item}
              style={extra ? ({ '--experience-order': index - COLLAPSED_COUNT } as CSSProperties) : undefined}
              className={cn(
                'flex min-w-0 items-start gap-3 border-t border-line py-3 text-[0.9375rem] leading-relaxed text-muted',
                extra && !expanded && '@max-xl/card:hidden',
                extra && expanded && 'experience-reveal',
              )}
            >
              <Check
                aria-hidden="true"
                focusable="false"
                size={15}
                strokeWidth={2.25}
                className={cn('mt-[0.3em] shrink-0', accentText)}
              />
              <span className="min-w-0 break-words">{item}</span>
            </li>
          )
        })}
      </ul>

      {collapsible ? (
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={expanded}
          aria-controls={id}
          onClick={toggle}
          className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-line-strong px-4 py-2.5 text-sm font-semibold text-ink transition duration-200 ease-out hover:border-primary/60 hover:bg-primary/8 @xl/card:hidden"
        >
          {expanded ? 'Show fewer responsibilities' : `Show all ${items.length} responsibilities`}
          <ChevronDown
            aria-hidden="true"
            focusable="false"
            size={16}
            strokeWidth={2}
            className={cn('shrink-0 transition-transform duration-300', expanded && 'rotate-180')}
          />
        </button>
      ) : null}
    </>
  )
}
