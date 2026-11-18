import { cn } from '@/utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonStyleOptions {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

const base =
  'relative inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap ' +
  'transition duration-200 ease-out select-none ' +
  'disabled:pointer-events-none disabled:opacity-60'

const variants: Record<ButtonVariant, string> = {
  /** The single most important action in a group. */
  primary:
    'bg-brand-gradient text-white shadow-glow hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:brightness-100',
  /** A strong alternative action. */
  secondary:
    'border border-line-strong bg-card text-ink shadow-card hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/8 active:translate-y-0',
  /** A quieter action that still reads as a button. */
  outline: 'border border-line-strong text-ink hover:border-primary/60 hover:bg-primary/8',
  /** The least prominent action. */
  ghost: 'text-muted hover:bg-ink/6 hover:text-ink',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[0.95rem]',
}

/**
 * Class names for anything that should look like a button: <button>, <a>,
 * or a router <Link>. Prefer the <Button>, <ButtonLink> and <SectionLink>
 * components; use this directly only for other elements.
 */
export function buttonClasses({ variant = 'primary', size = 'md', className }: ButtonStyleOptions = {}): string {
  return cn(base, variants[variant], sizes[size], className)
}
