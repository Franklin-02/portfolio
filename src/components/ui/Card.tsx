import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Rendered element. Use `article` for self-contained items and `li` inside lists. */
  as?: 'div' | 'article' | 'li' | 'section' | 'aside'
  /** Adds the hover lift, border highlight and deeper shadow. */
  interactive?: boolean
  /** Translucent, blurred surface for elements floating over imagery or glows. */
  glass?: boolean
}

/**
 * Base surface for all cards: card background, hairline border, soft shadow
 * and the standard 16px radius. Padding is left to the caller.
 * Add the `card-sheen` class for the gradient highlight along the top edge.
 */
export function Card({ as: Tag = 'div', interactive = false, glass = false, className, children, ...props }: CardProps) {
  return (
    <Tag
      className={cn(
        'relative rounded-2xl border border-line shadow-card',
        glass ? 'bg-glass backdrop-blur-xl' : 'bg-card',
        interactive &&
          'transition duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
