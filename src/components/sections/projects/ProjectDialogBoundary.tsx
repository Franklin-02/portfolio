import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ProjectDialogBoundaryProps {
  /** Runs once when the detail view fails to load or render. */
  onError: () => void
  children: ReactNode
}

interface ProjectDialogBoundaryState {
  failed: boolean
}

/**
 * Contains a failure of the on-demand detail view (for example its code could
 * not be fetched) so that it does not take the whole page down with it. The
 * section shows a small notice instead; see Projects.tsx.
 */
export class ProjectDialogBoundary extends Component<ProjectDialogBoundaryProps, ProjectDialogBoundaryState> {
  state: ProjectDialogBoundaryState = { failed: false }

  static getDerivedStateFromError(): ProjectDialogBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) console.error('The project detail view failed:', error, info.componentStack)
    this.props.onError()
  }

  render(): ReactNode {
    return this.state.failed ? null : this.props.children
  }
}
