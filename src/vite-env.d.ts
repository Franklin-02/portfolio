/// <reference types="vite/client" />

/** Environment variables read by the app. All are optional; see .env.example. */
interface ImportMetaEnv {
  /** Absolute URL of the deployed site, e.g. https://franklinselvaraj.dev */
  readonly VITE_SITE_URL?: string
  /** Base path when hosted in a sub-folder, e.g. /portfolio/ for GitHub Pages. */
  readonly VITE_BASE_PATH?: string
  /** Resume PDF filename inside public/resume/. */
  readonly VITE_RESUME_FILE?: string
  /** Form backend endpoint (Formspree, Web3Forms, Getform, ...). */
  readonly VITE_CONTACT_ENDPOINT?: string
  /** Public access key, only for providers that need one (Web3Forms). */
  readonly VITE_CONTACT_ACCESS_KEY?: string
  /** Domain registered in Plausible Analytics. Analytics stay off when empty. */
  readonly VITE_PLAUSIBLE_DOMAIN?: string
  /** Custom Plausible script URL (self-hosted or proxied). */
  readonly VITE_PLAUSIBLE_SRC?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** Resume PDF filename, resolved in vite.config.ts. */
declare const __RESUME_FILE__: string
/** True when the resume PDF exists in public/resume/ at build / dev-server start. */
declare const __RESUME_AVAILABLE__: boolean
