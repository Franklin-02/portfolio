import '@/styles/fonts.css'
import '@/styles/index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from '@/AppProviders'
import { RootLayout } from '@/components/layout/RootLayout'
import NotFound from '@/pages/NotFound'

/**
 * Entry for 404.html. Static hosts (Vercel, Netlify, GitHub Pages) serve that
 * file, with a real 404 status, for any address that does not exist.
 */
const container = document.getElementById('root')
if (!container) throw new Error('Root element #root is missing from 404.html.')

createRoot(container).render(
  <StrictMode>
    <AppProviders>
      <RootLayout>
        <NotFound />
      </RootLayout>
    </AppProviders>
  </StrictMode>,
)
