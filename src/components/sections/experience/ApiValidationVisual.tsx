import { Check } from 'lucide-react'
import { VisualFrame } from '@/components/sections/experience/VisualFrame'
import { cn } from '@/utils/cn'

/** Abstract response body: bars of different lengths stand in for keys and values. */
const responseLines = [
  { key: 'w-9', value: 'w-16' },
  { key: 'w-12', value: 'w-10' },
  { key: 'w-7', value: 'w-20' },
  { key: 'w-10', value: 'w-12' },
]

/** Generic kinds of check made on a response. */
const checks = ['Status', 'Schema', 'Values']

interface ApiValidationVisualProps {
  className?: string
}

/**
 * Original, abstract illustration of API validation: a request with a
 * placeholder path, a response body and the checks made on it. No real
 * endpoint, field name or value is shown.
 */
export function ApiValidationVisual({ className }: ApiValidationVisualProps) {
  return (
    <VisualFrame
      title="API validation"
      label="Illustration of API validation: a request with a placeholder path, its response and the checks made on it."
      className={className}
    >
      <div className="space-y-2.5 p-3.5 font-mono text-[0.6875rem] leading-none sm:p-4">
        {/* Request */}
        <div className="flex h-8 items-center gap-2 rounded-lg border border-line bg-ink/4 pr-2.5 pl-1.5">
          <span className="rounded-[5px] bg-(--experience-accent)/15 px-1.5 py-1 text-[0.625rem] font-bold tracking-wider text-(--experience-accent-soft)">
            GET
          </span>
          <span className="min-w-0 truncate text-muted">
            /resource/<span className="text-(--experience-accent-soft)">{'{id}'}</span>
          </span>
          <span className="ml-auto flex shrink-0 items-center gap-1.5 font-sans text-[0.625rem] font-semibold text-success">
            <span className="size-1.5 animate-pulse-soft rounded-full bg-success" />
            OK
          </span>
        </div>

        {/* Response */}
        <div className="rounded-lg border border-line bg-canvas/45 px-3 py-2.5 text-faint">
          <div>{'{'}</div>
          <div className="my-2 space-y-2 pl-3.5">
            {responseLines.map((line) => (
              <div key={`${line.key}-${line.value}`} className="flex items-center gap-1.5">
                <span className={cn('h-1.5 rounded-full bg-(--experience-accent)/45', line.key)} />
                <span>:</span>
                <span className={cn('h-1.5 rounded-full bg-ink/14', line.value)} />
                {/* Leader that ties the line to its check */}
                <span className="mx-1 h-0 min-w-3 flex-1 border-t border-dotted border-line-strong" />
                <Check aria-hidden="true" focusable="false" size={12} strokeWidth={2.75} className="shrink-0 text-success" />
              </div>
            ))}
          </div>
          <div>{'}'}</div>
        </div>

        {/* Checks */}
        <div className="flex flex-wrap gap-1.5 font-sans">
          {checks.map((check) => (
            <span
              key={check}
              className="inline-flex items-center gap-1 rounded-md border border-line bg-ink/4 px-1.5 py-1 text-[0.625rem] font-medium text-muted"
            >
              <Check aria-hidden="true" focusable="false" size={10} strokeWidth={3} className="text-success" />
              {check}
            </span>
          ))}
        </div>
      </div>
    </VisualFrame>
  )
}
