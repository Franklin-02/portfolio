import type { ReactNode } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/utils/cn'

interface SectionHeadingProps {
  /** Heading id. Use `${sectionId}-heading` so the section is labelled by it. */
  id: string
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

/** Eyebrow label, h2 title and optional intro paragraph used at the top of every section. */
export function SectionHeading({ id, eyebrow, title, description, align = 'left', className }: SectionHeadingProps) {
  return (
    <Reveal className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      <p className="eyebrow">{eyebrow}</p>
      <h2
        id={id}
        className="mt-5 text-3xl font-bold leading-[1.12] tracking-tight text-balance text-ink sm:text-4xl lg:text-[2.75rem]"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-relaxed text-pretty text-muted sm:text-lg">{description}</p>
      ) : null}
    </Reveal>
  )
}
