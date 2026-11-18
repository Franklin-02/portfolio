import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

/** Centres content and applies the site's horizontal padding and max width. */
export function Container({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10', className)} {...props}>
      {children}
    </div>
  )
}
