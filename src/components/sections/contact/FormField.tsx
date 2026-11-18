import { CircleExclamationPoint } from 'lucide-react'
import type { ReactNode } from 'react'

interface FormFieldProps {
  /** Id of the control. The error message gets the id `${id}-error`. */
  id: string
  label: string
  /** Current validation message, if any. */
  error?: string
  /** Content at the end of the message row, e.g. the character counter. */
  aside?: ReactNode
  /** The input or textarea. It must carry `id` and reference `${id}-error` in aria-describedby. */
  children: ReactNode
}

/**
 * Label, control and message row of one required form field.
 *
 * The message row is always rendered and keeps one line of height free, so a
 * validation message appearing or clearing does not move the fields below it.
 */
export function FormField({ id, label, error, aside, children }: FormFieldProps) {
  return (
    <div className="grid">
      <label htmlFor={id} className="mb-2 justify-self-start text-sm font-medium text-ink">
        {label}
        <span aria-hidden="true" className="ml-1 text-primary-soft">
          *
        </span>
      </label>

      {children}

      <div className="mt-1.5 flex min-h-5 items-start justify-between gap-4">
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-[0.8125rem] leading-5 font-medium text-danger">
          {error ? (
            <>
              <CircleExclamationPoint
                aria-hidden="true"
                focusable="false"
                size={15}
                strokeWidth={2}
                className="mt-[0.15625rem] shrink-0"
              />
              {error}
            </>
          ) : null}
        </p>
        {aside}
      </div>
    </div>
  )
}
