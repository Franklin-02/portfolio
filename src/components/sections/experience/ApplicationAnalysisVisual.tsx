import { Check } from 'lucide-react'
import { VisualFrame } from '@/components/sections/experience/VisualFrame'
import { cn } from '@/utils/cn'

/** The generic aspects of an application that analysis looks at. */
const sources = ['Interface', 'Workflows', 'APIs', 'Database']

/** Abstract document body: bars of different lengths stand in for written findings. */
const documentLines = ['w-24', 'w-32', 'w-20', 'w-28']

/** Generic kinds of document the analysis produces. */
const outputs = ['Requirements', 'FRD', 'Knowledge transfer']

interface ApplicationAnalysisVisualProps {
  className?: string
}

/**
 * Original, abstract illustration of application analysis: findings from the
 * interface, workflows, APIs and database gathered into documentation.
 * No real screen, field, code or client detail is shown.
 */
export function ApplicationAnalysisVisual({ className }: ApplicationAnalysisVisualProps) {
  return (
    <VisualFrame
      // Kept short so the title bar never truncates on a phone; the full description is in `label`.
      title="App analysis"
      label="Illustration of application analysis: findings from the interface, workflows, APIs and database gathered into requirements documentation."
      className={className}
    >
      <div className="space-y-2.5 p-3.5 text-[0.6875rem] leading-none sm:p-4">
        {/* What is analysed */}
        <div className="grid grid-cols-2 gap-1.5">
          {sources.map((source) => (
            <span
              key={source}
              className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-line bg-ink/4 px-2 text-[0.625rem] font-medium text-muted"
            >
              <span className="size-1.5 shrink-0 rounded-full bg-(--experience-accent)" />
              <span className="truncate">{source}</span>
            </span>
          ))}
        </div>

        {/* Findings flow down into the document */}
        <div className="flex justify-center">
          <span className="h-3.5 border-l border-dotted border-line-strong" />
        </div>

        {/* The document */}
        <div className="rounded-lg border border-line bg-canvas/45 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-16 rounded-full bg-(--experience-accent)/60" />
            <span className="ml-auto font-mono text-[0.5625rem] tracking-wider text-faint uppercase">Document</span>
          </div>
          <div className="mt-3 space-y-2">
            {documentLines.map((width, index) => (
              <div key={width} className="flex items-center gap-1.5">
                <span className="font-mono text-[0.5625rem] text-faint tabular-nums">{index + 1}</span>
                <span className={cn('h-1.5 rounded-full bg-ink/14', width)} />
                {/* Leader that ties the line to its check */}
                <span className="mx-1 h-0 min-w-3 flex-1 border-t border-dotted border-line-strong" />
                <Check aria-hidden="true" focusable="false" size={12} strokeWidth={2.75} className="shrink-0 text-success" />
              </div>
            ))}
          </div>
        </div>

        {/* What it produces */}
        <div className="flex flex-wrap gap-1.5">
          {outputs.map((output) => (
            <span
              key={output}
              className="inline-flex items-center gap-1 rounded-md border border-line bg-ink/4 px-1.5 py-1 text-[0.625rem] font-medium text-muted"
            >
              <Check aria-hidden="true" focusable="false" size={10} strokeWidth={3} className="text-success" />
              {output}
            </span>
          ))}
        </div>
      </div>
    </VisualFrame>
  )
}
