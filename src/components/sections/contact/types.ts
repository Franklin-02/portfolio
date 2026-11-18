/** How a valid message leaves the page. The site default comes from `contactForm` in config/site.ts. */
export interface ContactDelivery {
  /** `endpoint` posts to a form backend; `mailto` hands the message to the visitor's email app. */
  mode: 'endpoint' | 'mailto'
  endpoint: string
  accessKey: string
}

/**
 * Where a submission stands. `attempt` changes with every submit, so a repeated
 * outcome is rendered as a new message and announced again.
 */
export type ContactFormStatus =
  | { kind: 'idle' }
  /** Endpoint mode: the request is in flight. */
  | { kind: 'submitting' }
  /** Endpoint mode: the form backend accepted the message. */
  | { kind: 'sent'; attempt: number }
  /** Mailto mode: the visitor's email app was asked to open. Nothing has left this page. */
  | { kind: 'mail-app'; attempt: number }
  /** Endpoint mode: the request failed. `reason` is safe to show. */
  | { kind: 'failed'; attempt: number; reason: string }
