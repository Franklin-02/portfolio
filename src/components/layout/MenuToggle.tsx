import type { Ref } from 'react'
import { cn } from '@/utils/cn'

interface MenuToggleProps {
  ref?: Ref<HTMLButtonElement>
  open: boolean
  /** DOM id of the menu this button shows and hides. */
  controls: string
  onToggle: () => void
  className?: string
}

const bar = 'absolute left-0 h-0.5 w-full rounded-full bg-current transition duration-300 ease-out-quint'

/** Hamburger button for the mobile menu. The three bars fold into a close icon while it is open. */
export function MenuToggle({ ref, open, controls, onToggle, className }: MenuToggleProps) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={controls}
      aria-label={open ? 'Close menu' : 'Open menu'}
      className={cn('group inline-flex size-11 shrink-0 items-center justify-center rounded-xl', className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex size-9 items-center justify-center rounded-xl border transition duration-200 group-hover:border-line-strong group-hover:bg-ink/6 group-hover:text-ink group-active:scale-95',
          open ? 'border-line-strong bg-ink/6 text-ink' : 'border-line text-muted',
        )}
      >
        <span className="relative block h-3.5 w-[1.125rem]">
          <span className={cn(bar, 'top-0', open && 'translate-y-1.5 rotate-45')} />
          <span className={cn(bar, 'top-1.5', open && 'scale-x-0 opacity-0')} />
          <span className={cn(bar, 'top-3', open && '-translate-y-1.5 -rotate-45')} />
        </span>
      </span>
    </button>
  )
}
