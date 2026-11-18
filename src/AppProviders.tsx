import { domAnimation, LazyMotion, MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { ThemeProvider } from '@/context/ThemeProvider'

/**
 * Providers shared by every page entry (the portfolio and the 404 page):
 * theme, animation runtime and the top-level error boundary.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {/*
        LazyMotion loads only the animation features this site uses, which keeps the
        bundle small. Because of `strict`, animated elements must be the lightweight
        `m` components (import * as m from 'motion/react-m'), not `motion.*`.
      */}
      <LazyMotion features={domAnimation} strict>
        {/* reducedMotion="user": movement is skipped for visitors who ask for reduced motion. */}
        <MotionConfig reducedMotion="user">
          <ErrorBoundary>{children}</ErrorBoundary>
        </MotionConfig>
      </LazyMotion>
    </ThemeProvider>
  )
}
