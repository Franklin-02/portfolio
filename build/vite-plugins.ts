import { resolve } from 'node:path'
import type { HtmlTagDescriptor, Plugin } from 'vite'

/** Path (inside `public/`) of the social sharing image. */
const OG_IMAGE_PATH = 'images/og-image.png'

/** Emitted font files worth preloading: the Latin subsets declared in src/styles/fonts.css. */
const PRELOADED_FONTS = /(?:inter|manrope)-latin-wght-normal-[\w-]+\.woff2$/

interface HtmlHeadPluginOptions {
  /** Absolute site URL without a trailing slash, or '' when not configured. */
  siteUrl: string
}

/**
 * Build-time <head> wiring:
 *  - preloads the fonts used by the first screen (their hashed names are only
 *    known at build time);
 *  - on the portfolio page, injects canonical / og:url / social-image tags and
 *    completes the JSON-LD block from VITE_SITE_URL (these need absolute URLs,
 *    which only the deployment knows);
 *  - emits robots.txt and sitemap.xml.
 */
export function htmlHeadPlugin({ siteUrl }: HtmlHeadPluginOptions): Plugin {
  let base = '/'
  let isBuild = false

  return {
    name: 'portfolio:html-head',

    configResolved(config) {
      base = config.base
      isBuild = config.command === 'build'
    },

    buildStart() {
      if (isBuild && !siteUrl) {
        this.warn(
          'VITE_SITE_URL is not set: canonical URL, og:url and sitemap.xml are omitted and the ' +
            'social image URL is relative. Set VITE_SITE_URL to your deployed address (see .env.example).',
        )
      }
    },

    transformIndexHtml(html, context) {
      const tags: HtmlTagDescriptor[] = []

      for (const fileName of Object.keys(context.bundle ?? {})) {
        if (PRELOADED_FONTS.test(fileName)) {
          tags.push({
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `${base}${fileName}`, crossorigin: true },
            injectTo: 'head-prepend',
          })
        }
      }

      // The 404 page is not indexed, so it gets no canonical or social tags.
      if (/(?:^|[\\/])404\.html$/.test(context.filename)) return { html, tags }

      const imageUrl = siteUrl ? `${siteUrl}/${OG_IMAGE_PATH}` : `${base}${OG_IMAGE_PATH}`
      if (siteUrl) {
        tags.push(
          { tag: 'link', attrs: { rel: 'canonical', href: `${siteUrl}/` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:url', content: `${siteUrl}/` }, injectTo: 'head' },
        )
      }
      tags.push(
        { tag: 'meta', attrs: { property: 'og:image', content: imageUrl }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:image', content: imageUrl }, injectTo: 'head' },
      )

      // Add the absolute URL fields to the JSON-LD block when the site URL is known.
      const withStructuredData = html.replace(
        /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/,
        (match, open: string, json: string, close: string) => {
          if (!siteUrl) return match
          try {
            const data = JSON.parse(json) as Record<string, unknown>
            data.url = `${siteUrl}/`
            data.image = `${siteUrl}/${OG_IMAGE_PATH}`
            return `${open}\n${JSON.stringify(data, null, 2)}\n    ${close}`
          } catch {
            return match
          }
        },
      )

      return { html: withStructuredData, tags }
    },

    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /']
      if (siteUrl) robots.push('', `Sitemap: ${siteUrl}/sitemap.xml`)
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots.join('\n')}\n` })

      if (!siteUrl) return

      // The portfolio is a single page, so the sitemap has a single entry.
      const lastModified = new Date().toISOString().slice(0, 10)
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          `  <url>\n    <loc>${siteUrl}/</loc>\n    <lastmod>${lastModified}</lastmod>\n    <priority>1.0</priority>\n  </url>\n` +
          '</urlset>\n',
      })
    },
  }
}

interface ResumeWatcherOptions {
  /** Absolute path of the resume PDF inside `public/resume/`. */
  resumePath: string
}

/**
 * Resume availability is resolved when the config loads. During development,
 * restart the server when the PDF is added or removed so the buttons update
 * without a manual restart.
 */
export function resumeWatcherPlugin({ resumePath }: ResumeWatcherOptions): Plugin {
  const target = resolve(resumePath).toLowerCase()

  return {
    name: 'portfolio:resume-watcher',
    apply: 'serve',
    configureServer(server) {
      const onChange = (file: string) => {
        if (resolve(file).toLowerCase() === target) void server.restart()
      }
      server.watcher.on('add', onChange)
      server.watcher.on('unlink', onChange)
    },
  }
}
