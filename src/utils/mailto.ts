interface MailtoOptions {
  to: string
  subject?: string
  body?: string
}

/** Builds a `mailto:` URL with a correctly encoded subject and body. */
export function buildMailtoUrl({ to, subject, body }: MailtoOptions): string {
  const params: string[] = []
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`)
  // Mail clients expect CRLF line breaks in the body.
  if (body) params.push(`body=${encodeURIComponent(body.replace(/\r?\n/g, '\r\n'))}`)
  return `mailto:${to}${params.length > 0 ? `?${params.join('&')}` : ''}`
}
