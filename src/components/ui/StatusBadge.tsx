import type { ProjectStatusTone } from '@/types/content'
import { cn } from '@/utils/cn'

interface StatusBadgeProps {
  label: string
  tone: ProjectStatusTone
  className?: string
}

const tones: Record<ProjectStatusTone, { badge: string; dot: string }> = {
  professional: { badge: 'border-primary/30 bg-primary/10 text-primary-soft', dot: 'bg-primary' },
  'in-progress': { badge: 'border-warning/30 bg-warning/10 text-warning', dot: 'bg-warning' },
  concept: { badge: 'border-secondary/30 bg-secondary/10 text-secondary-soft', dot: 'bg-secondary' },
  planned: { badge: 'border-highlight/30 bg-highlight/10 text-highlight', dot: 'bg-highlight' },
}

/** Pill that states a project's real status. The tone only changes the colour. */
export function StatusBadge({ label, tone, className }: StatusBadgeProps) {
  const style = tones[tone]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap',
        style.badge,
        className,
      )}
    >
      <span aria-hidden="true" className={cn('size-1.5 rounded-full', style.dot)} />
      {label}
    </span>
  )
}
