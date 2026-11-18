import { profile } from '@/data/profile'
import { cn } from '@/utils/cn'

interface LogoMarkProps {
  className?: string
}

/** The FSM monogram, matching the favicon. Decorative: pair it with visible or sr-only text. */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'bg-brand-gradient inline-flex size-9 shrink-0 items-center justify-center rounded-[0.65rem] font-display text-[0.72rem] font-extrabold tracking-tight text-white shadow-glow',
        className,
      )}
    >
      {profile.initials}
    </span>
  )
}

interface LogoProps {
  /** Hide the name below the `sm` breakpoint to save space in tight headers. */
  compact?: boolean
  className?: string
}

/** Monogram plus name. Wrap it in a link where it should be clickable. */
export function Logo({ compact = false, className }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <LogoMark />
      <span className={cn('flex flex-col leading-tight', compact && 'max-sm:sr-only')}>
        <span className="font-display text-[0.95rem] font-bold tracking-tight text-ink">{profile.name}</span>
        <span className="text-[0.6875rem] font-medium tracking-wide text-faint">{profile.designation}</span>
      </span>
    </span>
  )
}
