export interface Period {
  /** First part of the range, e.g. "June 2022". */
  start: string
  /** Second part, e.g. "Present". Undefined when the text is not a range. */
  end?: string
  /** True while the range is still running. */
  ongoing: boolean
}

/**
 * Reads a period written as "June 2022 – Present": two parts separated by an
 * en dash, em dash or hyphen with spaces around it. Anything else is returned
 * whole as `start`.
 */
export function parsePeriod(duration: string): Period {
  const [start = duration, end] = duration.split(/\s+[–—-]\s+/, 2).map((part) => part.trim())

  return { start, end, ongoing: end?.toLowerCase() === 'present' }
}
