import { CircleCheck } from 'lucide-react'
import type { ArticleStatus } from '@/types/content'
import { cn } from '@/utils/cn'

const pill = 'inline-flex items-center rounded-full border py-1 text-xs font-semibold whitespace-nowrap'

interface ArticleStatusLabelProps {
  status: ArticleStatus
  className?: string
}

/** States where an article stands in the series: already published, or the topic being written now. */
export function ArticleStatusLabel({ status, className }: ArticleStatusLabelProps) {
  if (status === 'current') {
    return (
      <span className={cn(pill, 'gap-2 border-primary/30 bg-primary/10 px-3 text-primary-soft', className)}>
        <span aria-hidden="true" className="relative flex size-1.5">
          <span className="absolute -inset-1 animate-pulse-soft rounded-full bg-primary/35" />
          <span className="relative size-1.5 rounded-full bg-primary" />
        </span>
        Current topic
      </span>
    )
  }

  return (
    <span className={cn(pill, 'gap-1.5 border-line bg-ink/4 pr-3 pl-2 text-muted', className)}>
      <CircleCheck aria-hidden="true" focusable="false" size={14} strokeWidth={2} className="text-success" />
      Published
    </span>
  )
}
