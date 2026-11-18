import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { buttonClasses, type ButtonSize, type ButtonVariant } from '@/components/ui/buttonClasses'

interface ButtonStyleProps {
  variant?: ButtonVariant
  size?: ButtonSize
}

type ButtonProps = ButtonStyleProps & ButtonHTMLAttributes<HTMLButtonElement>

/** A <button> with the site's button styling. Defaults to type="button". */
export function Button({ variant, size, className, type = 'button', children, ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...props}>
      {children}
    </button>
  )
}

type ButtonLinkProps = ButtonStyleProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
    /** Opens in a new tab with safe rel attributes and a screen-reader hint. */
    external?: boolean
  }

/**
 * An <a> styled as a button, for mailto:, tel:, downloads and external URLs.
 * For links to page sections use <SectionLink>; for app routes use a router <Link>.
 */
export function ButtonLink({ variant, size, className, external = false, children, ...props }: ButtonLinkProps) {
  return (
    <a
      className={buttonClasses({ variant, size, className })}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {children}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  )
}
