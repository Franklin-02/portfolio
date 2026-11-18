import { RotateCw } from 'lucide-react'
import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { buttonClasses } from '@/components/ui/buttonClasses'
import { LogoMark } from '@/components/ui/Logo'
import { profile } from '@/data/profile'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

/**
 * Catches rendering errors anywhere below it and shows a recovery screen
 * instead of a blank page. Wraps the whole app (see AppProviders).
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) console.error('Unhandled rendering error:', error, info.componentStack)
  }

  render(): ReactNode {
    return this.state.hasError ? <ErrorFallback /> : this.props.children
  }
}

function ErrorFallback() {
  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-6 py-16 text-center text-ink">
      <LogoMark className="size-12 text-sm" />
      <p className="eyebrow mt-8 before:hidden">Something went wrong</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">This page could not be displayed</h1>
      <p role="alert" className="mt-4 max-w-md text-base leading-relaxed text-muted">
        {isOffline
          ? 'You appear to be offline. Check your connection and try again.'
          : 'An unexpected error stopped this page from loading. Reloading usually fixes it.'}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => window.location.reload()}>
          <RotateCw aria-hidden="true" size={16} strokeWidth={2} />
          Reload page
        </Button>
        <a href={import.meta.env.BASE_URL} className={buttonClasses({ variant: 'secondary' })}>
          Back to home
        </a>
      </div>
      <p className="mt-10 text-sm text-faint">
        Still stuck? Email{' '}
        <a className="font-medium text-primary-soft underline-offset-4 hover:underline" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
      </p>
    </main>
  )
}
