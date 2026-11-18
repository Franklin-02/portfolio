/** Class names shared by the pieces of the Contact section. */

/** A text link inside a sentence. */
export const inlineLinkClasses =
  'font-medium text-primary-soft underline decoration-primary/40 underline-offset-4 transition duration-200 hover:decoration-primary-soft'

/**
 * Text inputs and the textarea: a recessed field on the card, a 2px focus edge
 * with a soft halo, and a danger-coloured edge while `aria-invalid` is true.
 * The outline itself comes from the global `:focus-visible` style; it is only
 * pulled in over the border here.
 */
export const controlClasses =
  'block w-full rounded-xl border border-line-strong bg-canvas px-4 text-base text-ink -outline-offset-1 ' +
  'transition duration-200 ease-out placeholder:text-faint hover:border-ink/35 ' +
  'focus:border-primary focus:ring-4 focus:ring-primary/15 ' +
  'aria-invalid:border-danger aria-invalid:outline-danger aria-invalid:focus:border-danger aria-invalid:focus:ring-danger/15 ' +
  'read-only:cursor-progress read-only:text-muted'
