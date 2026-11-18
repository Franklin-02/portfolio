import { LoaderCircle, RotateCw, TriangleExclamationPoint } from 'lucide-react'
import { Button } from '@/components/ui/Button'

/**
 * Shown while the detail view's code is being fetched (the first time a
 * project is opened). It fades in after a short delay, so it never flashes
 * on a fast connection.
 */
export function ProjectDialogLoading() {
  return (
    <div role="status" className="projects-dialog-loading fixed inset-0 z-70 grid place-items-center p-5">
      <p className="flex items-center gap-3 rounded-xl border border-line-strong bg-card px-4 py-3 text-sm font-medium text-ink shadow-elevated">
        <LoaderCircle aria-hidden="true" size={18} strokeWidth={2} className="animate-spin text-primary-soft" />
        Loading project details…
      </p>
    </div>
  )
}

/** Shown if the detail view could not be loaded, e.g. the connection dropped. */
export function ProjectDialogUnavailable() {
  return (
    <div
      role="alert"
      className="fixed inset-x-4 bottom-4 z-70 mx-auto flex max-w-lg items-center gap-3 rounded-xl border border-line-strong bg-card p-4 shadow-elevated"
    >
      <TriangleExclamationPoint
        aria-hidden="true"
        size={18}
        strokeWidth={1.75}
        className="shrink-0 self-start text-warning"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug font-semibold text-ink">Project details could not be loaded</p>
        <p className="mt-1 text-sm leading-relaxed text-pretty text-muted">
          Check your connection, then reload the page.
        </p>
      </div>
      <Button variant="outline" onClick={() => window.location.reload()}>
        <RotateCw aria-hidden="true" size={15} strokeWidth={2} />
        Reload
      </Button>
    </div>
  )
}
