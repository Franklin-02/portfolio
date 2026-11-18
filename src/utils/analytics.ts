import { analytics } from '@/config/site'

/**
 * Loads Plausible Analytics (cookieless, no personal data) only when:
 *  - a domain is configured through VITE_PLAUSIBLE_DOMAIN,
 *  - this is a production build, and
 *  - the visitor has not enabled "Do Not Track".
 *
 * With no configuration nothing is loaded and no request is made.
 */
export function initAnalytics(): void {
  if (!import.meta.env.PROD || !analytics.plausibleDomain) return
  if (navigator.doNotTrack === '1') return

  const script = document.createElement('script')
  script.defer = true
  script.src = analytics.plausibleSrc
  script.dataset.domain = analytics.plausibleDomain
  document.head.appendChild(script)
}
