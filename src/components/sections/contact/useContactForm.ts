import { useEffect, useRef, useState, type FormEvent } from 'react'
import { flushSync } from 'react-dom'
import type { ContactDelivery, ContactFormStatus } from '@/components/sections/contact/types'
import { profile } from '@/data/profile'
import {
  buildContactMailto,
  ContactSubmitError,
  EMPTY_CONTACT_FORM,
  MIN_FILL_TIME_MS,
  submitContactForm,
  validateContactField,
  validateContactForm,
  type ContactField,
  type ContactFormErrors,
  type ContactFormValues,
} from '@/utils/contactForm'

/** Fields in the order they appear on screen: decides which invalid field receives focus. */
const FIELD_ORDER: ContactField[] = ['name', 'email', 'subject', 'message']

const IDLE: ContactFormStatus = { kind: 'idle' }

/** Sets or removes one field's error, keeping the same object when nothing changes. */
function withFieldError(
  errors: ContactFormErrors,
  field: ContactField,
  message: string | undefined,
): ContactFormErrors {
  if (errors[field] === message) return errors
  const next = { ...errors }
  if (message) next[field] = message
  else delete next[field]
  return next
}

/**
 * State and behaviour of the contact form.
 *
 * Validation: a field the visitor has typed in is checked when they leave it,
 * and every field is checked on submit. Merely passing through an empty field
 * is not flagged, so tabbing across the form does not fill it with errors. An
 * error that is showing follows the input and disappears as soon as the value
 * is valid; typing never adds a new error.
 *
 * Spam protection: a submission that fills the hidden honeypot field, or that
 * arrives sooner than MIN_FILL_TIME_MS after the form appeared, sends nothing
 * and gets the same response as a real one.
 *
 * Delivery: `endpoint` posts the message to the form backend; `mailto` opens
 * the visitor's email app with the message pre-filled and says so honestly.
 */
export function useContactForm(delivery: ContactDelivery) {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_CONTACT_FORM)
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [status, setStatus] = useState<ContactFormStatus>(IDLE)
  const [honeypot, setHoneypot] = useState('')

  /** Fields the visitor has typed in ("touched"): only these are validated on blur. */
  const touched = useRef(new Set<ContactField>())
  /** When the form appeared, for the time trap. */
  const mountedAt = useRef<number | null>(null)
  /** Numbers the outcomes so a repeated one is announced again. */
  const attempts = useRef(0)
  /** Guards against a second submit while a request is in flight. */
  const inFlight = useRef(false)
  /** True from pointer-down on the submit button until that press has been handled. */
  const pressingSubmit = useRef(false)

  useEffect(() => {
    mountedAt.current = Date.now()
  }, [])

  function changeField(field: ContactField, value: string) {
    touched.current.add(field)
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) =>
      current[field] ? withFieldError(current, field, validateContactField(field, value)) : current,
    )
  }

  function blurField(field: ContactField, value: string) {
    if (!touched.current.has(field)) return
    // Pressing the submit button blurs the active field first. An error line added at that
    // moment can push the button away from the pointer before the click lands, and the click
    // is lost. The submit handler validates every field anyway, so skip this one check.
    if (pressingSubmit.current) return
    setErrors((current) => withFieldError(current, field, validateContactField(field, value)))
  }

  /** Back to an empty, untouched form after a delivered message. */
  function reset() {
    touched.current.clear()
    setValues(EMPTY_CONTACT_FORM)
  }

  /** Spread on the submit button and the form to track a press on the button. */
  const submitPress = {
    start: () => {
      pressingSubmit.current = true
    },
    end: () => {
      pressingSubmit.current = false
    },
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    pressingSubmit.current = false
    if (inFlight.current) return

    const form = event.currentTarget
    const nextErrors = validateContactForm(values)
    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field])

    if (firstInvalid) {
      // Render the messages before moving focus, so assistive technology reads the
      // error together with the field that receives focus.
      flushSync(() => {
        setErrors(nextErrors)
        setStatus(IDLE)
      })
      const target = form.elements.namedItem(firstInvalid)
      if (target instanceof HTMLElement) target.focus()
      return
    }

    setErrors({})
    attempts.current += 1
    const attempt = attempts.current

    const startedAt = mountedAt.current
    const looksAutomated =
      honeypot.trim() !== '' || startedAt === null || Date.now() - startedAt < MIN_FILL_TIME_MS

    if (delivery.mode === 'mailto') {
      // Nothing is sent from this page in this mode: the visitor finishes in their own email app.
      if (!looksAutomated) window.location.href = buildContactMailto(values, profile.email)
      setStatus({ kind: 'mail-app', attempt })
      return
    }

    if (looksAutomated) {
      // Send nothing, and respond exactly as a delivered message would.
      reset()
      setStatus({ kind: 'sent', attempt })
      return
    }

    inFlight.current = true
    setStatus({ kind: 'submitting' })
    try {
      await submitContactForm(values, { endpoint: delivery.endpoint, accessKey: delivery.accessKey })
      reset()
      setStatus({ kind: 'sent', attempt })
    } catch (error) {
      // The typed values stay in the form so nothing is lost.
      setStatus({
        kind: 'failed',
        attempt,
        reason: error instanceof ContactSubmitError ? error.message : 'The message could not be sent.',
      })
    } finally {
      inFlight.current = false
    }
  }

  return {
    values,
    errors,
    status,
    isSubmitting: status.kind === 'submitting',
    honeypot,
    setHoneypot,
    changeField,
    blurField,
    submitPress,
    submit,
  }
}
