import '@/styles/fonts.css'
import '@/styles/index.css'

import { lazy, StrictMode, Suspense, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import { AppProviders } from '@/AppProviders'
import { initAnalytics } from '@/utils/analytics'

let Root: ComponentType = App

// Development-only component preview at /__preview/<path>. Removed from production builds.
if (import.meta.env.DEV && window.location.pathname.startsWith(`${import.meta.env.BASE_URL}__preview/`)) {
  Root = lazy(() => import('@/dev/ComponentPreview'))
}

const container = document.getElementById('root')
if (!container) throw new Error('Root element #root is missing from index.html.')

createRoot(container).render(
  <StrictMode>
    <AppProviders>
      <Suspense fallback={null}>
        <Root />
      </Suspense>
    </AppProviders>
  </StrictMode>,
)

initAnalytics()
