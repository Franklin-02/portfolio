import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

interface FlowArrowProps {
  direction: 'left' | 'right'
  tone: 'primary' | 'secondary'
}

/**
 * A dashed connector with an arrowhead. The dashes drift in the direction the
 * information flows (the shared `animate-dash` animation, which stops for
 * visitors who prefer reduced motion). Decorative: the flow is described in text.
 */
export function FlowArrow({ direction, tone }: FlowArrowProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('flex items-center', tone === 'primary' ? 'text-primary' : 'text-secondary')}
    >
      {direction === 'left' ? <ChevronLeft size={16} strokeWidth={2.25} className="-mr-2 shrink-0" /> : null}
      <svg width="100%" height="2" focusable="false" className="min-w-0 flex-1 overflow-visible">
        <line
          x1="0"
          y1="1"
          x2="100%"
          y2="1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          strokeLinecap="round"
          className={cn('animate-dash', direction === 'left' && '[animation-direction:reverse]')}
        />
      </svg>
      {direction === 'right' ? <ChevronRight size={16} strokeWidth={2.25} className="-ml-2 shrink-0" /> : null}
    </span>
  )
}
