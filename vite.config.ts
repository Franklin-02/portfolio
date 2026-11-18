import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { htmlHeadPlugin, resumeWatcherPlugin } from './build/vite-plugins'

/**
 * Default resume filename. Drop the PDF at `public/resume/<this name>` and the
 * "Download Resume" buttons switch on automatically. Override the name with the
 * VITE_RESUME_FILE environment variable (see .env.example).
 */
const DEFAULT_RESUME_FILE = 'Franklin-Selvaraj-M-Resume.pdf'

/** Normalises a base path to the `/segment/` shape Vite expects. */
function normalizeBase(value: string | undefined): string {
  const trimmed = (value ?? '').trim()
  if (!trimmed || trimmed === '/') return '/'
  return `/${trimmed.replace(/^\/+|\/+$/g, '')}/`
}

export default defineConfig(({ mode }) => {
  const root = fileURLToPath(new URL('.', import.meta.url))
  const env = loadEnv(mode, root, 'VITE_')

  const base = normalizeBase(env.VITE_BASE_PATH)
  const siteUrl = (env.VITE_SITE_URL ?? '').trim().replace(/\/+$/, '')
  const resumeFile = (env.VITE_RESUME_FILE ?? '').trim() || DEFAULT_RESUME_FILE
  const resumePath = resolve(root, 'public', 'resume', resumeFile)

  return {
    base,
    plugins: [react(), tailwindcss(), htmlHeadPlugin({ siteUrl }), resumeWatcherPlugin({ resumePath })],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    define: {
      __RESUME_FILE__: JSON.stringify(resumeFile),
      __RESUME_AVAILABLE__: JSON.stringify(existsSync(resumePath)),
    },
    build: {
      rollupOptions: {
        // Two pages: the portfolio, and the 404 page static hosts serve for unknown addresses.
        input: {
          main: resolve(root, 'index.html'),
          notFound: resolve(root, '404.html'),
        },
        output: {
          // Keep rarely-changing libraries in their own long-cacheable chunks.
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined
            if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react'
            if (/[\\/]node_modules[\\/](motion|framer-motion|motion-dom|motion-utils)[\\/]/.test(id)) return 'motion'
            return undefined
          },
        },
      },
    },
  }
})
