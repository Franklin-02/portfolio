import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface VisualFrameProps {
  /** Short caption in the title bar of the window. */
  title: string
  /** Text alternative for the whole illustration. */
  label: string
  className?: string
  children: ReactNode
}

/**
 * Stage shared by the engagement illustrations: a recessed, lightly textured
 * panel with one abstract window on it. The window is deliberately generic and
 * carries an "Illustrative" tag, so it cannot be mistaken for a screenshot of a
 * real product. It takes its colour from the accent of the card around it.
 */
export function VisualFrame({ title, label, className, children }: VisualFrameProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        'experience-visual flex items-center justify-center p-4 select-none sm:p-7 @3xl/card:p-8',
        className,
      )}
    >
      <div className="w-full max-w-[26rem] overflow-hidden rounded-xl border border-line-strong bg-card shadow-elevated">
        <div className="flex h-9 items-center gap-2.5 border-b border-line px-3.5">
          <span className="size-2 shrink-0 rounded-[3px] bg-(--experience-accent)" />
          <span className="truncate text-[0.625rem] leading-none font-semibold tracking-[0.16em] text-muted uppercase">
            {title}
          </span>
          <span className="ml-auto shrink-0 rounded-sm border border-line px-1.5 py-1 text-[0.5625rem] leading-none font-semibold tracking-[0.12em] text-faint uppercase">
            Illustrative
          </span>
        </div>

        {children}
      </div>
    </div>
  )
}
