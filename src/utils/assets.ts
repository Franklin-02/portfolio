/**
 * Builds the URL of a file in `public/`, honouring the deployment base path
 * (for example `/portfolio/` on GitHub Pages).
 *
 * assetUrl('images/og-image.png') -> '/images/og-image.png'
 */
export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}
