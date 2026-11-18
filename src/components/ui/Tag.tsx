import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export type TagTone = 'neutral' | 'primary' | 'secondary' | 'highlight'

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: TagTone
  size?: 'sm' | 'md'
}

const tones: Record<TagTone, string> = {
  neutral: 'border-line bg-ink/4 text-muted',
  primary: 'border-primary/25 bg-primary/10 text-primary-soft',
  secondary: 'border-secondary/25 bg-secondary/10 text-secondary-soft',
  highlight: 'border-highlight/25 bg-highlight/10 text-highlight',
}

const sizes = {
  sm: 'px-2 py-0.5 text-[0.6875rem]',
  md: 'px-2.5 py-1 text-xs',
}

/** Small label for skills, technologies, platforms and other short facts. */
export function Tag({ tone = 'neutral', size = 'md', className, children, ...props }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border font-medium leading-snug',
        tones[tone],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
