import type { ReactNode } from 'react'
import { Container } from '@/components/ui/Container'
import type { SectionId } from '@/types/content'
import { cn } from '@/utils/cn'

interface SectionProps {
  /** DOM id: the anchor target and the id tracked by the navigation bar. */
  id: SectionId
  /** `surface` uses the secondary background to create rhythm between sections. */
  tone?: 'canvas' | 'surface'
  /**
   * Decorative background layers (glows, grids). Rendered behind the content in
   * a clipped, non-interactive, aria-hidden layer.
   */
  decoration?: ReactNode
  className?: string
  containerClassName?: string
  children: ReactNode
}

/**
 * Standard page section: consistent vertical rhythm, an anchor id, and an
 * accessible name taken from the heading with id `${id}-heading`
 * (render <SectionHeading id={`${id}-heading`} /> inside).
 */
export function Section({ id, tone = 'canvas', decoration, className, containerClassName, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      tabIndex={-1}
      className={cn(
        'relative py-20 sm:py-24 lg:py-32',
        tone === 'surface' ? 'bg-surface' : 'bg-canvas',
        className,
      )}
    >
      {decoration ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {decoration}
        </div>
      ) : null}
      <Container className={cn('relative', containerClassName)}>{children}</Container>
    </section>
  )
}
