import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/utils/cn'

export type BandAccent = 'primary' | 'highlight'

interface BandHeaderProps {
  /** Id of the title: the band's list is labelled by it. */
  id: string
  title: string
  description: string
  accent: BandAccent
}

const markers: Record<BandAccent, string> = {
  primary: 'bg-primary ring-primary/20',
  highlight: 'bg-highlight ring-highlight/20',
}

/** Title row of a dashboard band: a marker in the band's accent, the title, its one-line summary and a rule. */
export function BandHeader({ id, title, description, accent }: BandHeaderProps) {
  return (
    <Reveal className="flex flex-col gap-1.5 lg:flex-row lg:items-baseline lg:gap-5">
      <h3 id={id} className="relative shrink-0 pl-5 text-lg font-bold tracking-tight text-ink sm:text-xl">
        <span
          aria-hidden="true"
          className={cn('absolute top-1/2 left-0.5 size-2 -translate-y-1/2 rounded-full ring-4', markers[accent])}
        />
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-pretty text-muted sm:text-[0.95rem]">{description}</p>
      <span
        aria-hidden="true"
        className="hidden h-px min-w-10 flex-1 self-center bg-linear-to-r from-line-strong to-transparent lg:block"
      />
    </Reveal>
  )
}
