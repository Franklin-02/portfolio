import { assetUrl } from '@/utils/assets'

/**
 * Deployment-level configuration, read from environment variables at build
 * time (see .env.example). Nothing here is secret: every VITE_* value is
 * shipped to the browser.
 */

const env = import.meta.env

function clean(value: string | undefined): string {
  return (value ?? '').trim()
}

export const site = {
  title: 'Franklin Selvaraj M. | Senior QA Tester, Business Analyst & PMO',
  description:
    'Explore the professional portfolio of Franklin Selvaraj M., a Senior QA Tester / PMO specializing in Guidewire PolicyCenter, InsuranceNow, QA Automation, API Testing, Business Analysis, and Project Management.',
  /** Absolute site URL without a trailing slash, or '' when VITE_SITE_URL is not set. */
  url: clean(env.VITE_SITE_URL).replace(/\/+$/, ''),
} as const

/**
 * Resume download.
 *
 * Place the PDF at `public/resume/<fileName>`. `available` turns true
 * automatically once the file exists; until then the UI shows a clear
 * "coming soon" placeholder instead of a broken download.
 */
export const resume = {
  fileName: __RESUME_FILE__,
  available: __RESUME_AVAILABLE__,
  url: assetUrl(`resume/${encodeURIComponent(__RESUME_FILE__)}`),
} as const

/**
 * Contact form delivery.
 *
 * With VITE_CONTACT_ENDPOINT set, the form posts JSON to that endpoint.
 * Without it, the form opens the visitor's email app with the message
 * pre-filled (mailto fallback), so it always does something real.
 */
export const contactForm = {
  endpoint: clean(env.VITE_CONTACT_ENDPOINT),
  accessKey: clean(env.VITE_CONTACT_ACCESS_KEY),
  mode: clean(env.VITE_CONTACT_ENDPOINT) ? 'endpoint' : 'mailto',
} as const satisfies { endpoint: string; accessKey: string; mode: 'endpoint' | 'mailto' }

/** Privacy-friendly analytics (Plausible). Disabled unless a domain is configured. */
export const analytics = {
  plausibleDomain: clean(env.VITE_PLAUSIBLE_DOMAIN),
  plausibleSrc: clean(env.VITE_PLAUSIBLE_SRC) || 'https://plausible.io/js/script.js',
} as const
