import { buildMailtoUrl } from '@/utils/mailto'

export interface ContactFormValues {
  name: string
  email: string
  subject: string
  message: string
}

export type ContactField = keyof ContactFormValues
export type ContactFormErrors = Partial<Record<ContactField, string>>

export const EMPTY_CONTACT_FORM: ContactFormValues = { name: '', email: '', subject: '', message: '' }

/** Length limits, also used for the inputs' maxLength attributes. */
export const CONTACT_LIMITS = {
  name: { min: 2, max: 80 },
  email: { min: 5, max: 254 },
  subject: { min: 3, max: 120 },
  message: { min: 10, max: 4000 },
} as const satisfies Record<ContactField, { min: number; max: number }>

/** Submissions faster than this after the form appears are treated as automated. */
export const MIN_FILL_TIME_MS = 2500

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

/** Returns the error message for one field, or undefined when it is valid. */
export function validateContactField(field: ContactField, rawValue: string): string | undefined {
  const value = rawValue.trim()
  const { min, max } = CONTACT_LIMITS[field]

  switch (field) {
    case 'name':
      if (!value) return 'Please enter your name.'
      if (value.length < min) return `Your name should be at least ${min} characters.`
      break
    case 'email':
      if (!value) return 'Please enter your email address.'
      if (!isValidEmail(value)) return 'Please enter a valid email address, for example name@example.com.'
      break
    case 'subject':
      if (!value) return 'Please enter a subject.'
      if (value.length < min) return `The subject should be at least ${min} characters.`
      break
    case 'message':
      if (!value) return 'Please enter your message.'
      if (value.length < min) return `Your message should be at least ${min} characters.`
      break
  }

  if (value.length > max) return `Please keep this under ${max} characters.`
  return undefined
}

/** Validates every field. An empty object means the form is valid. */
export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {}
  for (const field of Object.keys(CONTACT_LIMITS) as ContactField[]) {
    const error = validateContactField(field, values[field])
    if (error) errors[field] = error
  }
  return errors
}

/** Builds the pre-filled email used when no form backend is configured. */
export function buildContactMailto(values: ContactFormValues, to: string): string {
  const body = `${values.message.trim()}\n\n--\n${values.name.trim()}\n${values.email.trim()}`
  return buildMailtoUrl({ to, subject: values.subject.trim(), body })
}

export class ContactSubmitError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContactSubmitError'
  }
}

interface SubmitOptions {
  endpoint: string
  /** Public access key for providers that need one in the payload (Web3Forms). */
  accessKey?: string
  timeoutMs?: number
}

/**
 * Posts the message as JSON to the configured form backend.
 * Works with Formspree, Web3Forms, Getform and any endpoint that accepts a JSON
 * POST and answers with a 2xx status. Throws ContactSubmitError on failure.
 */
export async function submitContactForm(
  values: ContactFormValues,
  { endpoint, accessKey, timeoutMs = 15000 }: SubmitOptions,
): Promise<void> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
        ...(accessKey ? { access_key: accessKey } : {}),
      }),
      signal: controller.signal,
    })

    // Some providers answer 200 with `{ success: false }`, so check the body too.
    const payload = (await response.json().catch(() => null)) as { success?: boolean } | null
    if (!response.ok || payload?.success === false) {
      throw new ContactSubmitError(`The form service answered with status ${response.status}.`)
    }
  } catch (error) {
    if (error instanceof ContactSubmitError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ContactSubmitError('The request timed out.')
    }
    throw new ContactSubmitError('The message could not be sent. Please check your connection.')
  } finally {
    window.clearTimeout(timer)
  }
}
