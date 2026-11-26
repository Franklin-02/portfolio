import { Check } from 'lucide-react'
import { VisualFrame } from '@/components/sections/experience/VisualFrame'
import { cn } from '@/utils/cn'

/** Generic stages of a workflow. The first two are done, the third is the one being checked. */
const steps = ['Start', 'Details', 'Review', 'Complete']
const CURRENT_STEP = 2

/** Abstract form fields: bars of different lengths stand in for labels and entered values. */
const fields = [
  { label: 'w-8', value: 'w-20' },
  { label: 'w-11', value: 'w-14' },
  { label: 'w-7', value: 'w-24' },
  { label: 'w-10', value: 'w-16' },
]

/** Generic kinds of check made on a form. */
const checks = ['Required fields', 'Formats', 'Rules']

interface FormsValidationVisualProps {
  className?: string
}

/**
 * Original, abstract illustration of workflow and forms validation: the stages
 * of a workflow and a form whose fields are checked one by one. No real screen,
 * field name or value is shown.
 */
export function FormsValidationVisual({ className }: FormsValidationVisualProps) {
  return (
    <VisualFrame
      title="Forms validation"
      label="Illustration of workflow and forms validation: the stages of a workflow and a form whose fields are checked one by one."
      className={className}
    >
      <div className="space-y-2.5 p-3.5 text-[0.6875rem] leading-none sm:p-4">
        {/* Workflow */}
        <div className="flex items-center">
          {steps.map((step, index) => (
            <div key={step} className={cn('flex items-center', index > 0 && 'min-w-0 flex-1')}>
              {index > 0 ? <span className="h-0 min-w-2 flex-1 border-t border-dotted border-line-strong" /> : null}
              <span
                className={cn(
                  'flex h-7 shrink-0 items-center gap-1 rounded-md border px-1.5 text-[0.5625rem] font-medium',
                  index === CURRENT_STEP
                    ? 'border-(--experience-accent)/45 bg-(--experience-accent)/15 text-(--experience-accent-soft)'
                    : 'border-line bg-ink/4 text-muted',
                )}
              >
                {index < CURRENT_STEP ? (
                  <Check aria-hidden="true" focusable="false" size={9} strokeWidth={3} className="text-success" />
                ) : null}
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* The form being checked */}
        <div className="rounded-lg border border-line bg-canvas/45 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-14 rounded-full bg-(--experience-accent)/60" />
            <span className="ml-auto font-mono text-[0.5625rem] tracking-wider text-faint uppercase">Form</span>
          </div>
          <div className="mt-3 space-y-2">
            {fields.map((field) => (
              <div key={`${field.label}-${field.value}`} className="flex items-center gap-2">
                <span className={cn('h-1.5 shrink-0 rounded-full bg-ink/14', field.label)} />
                <span className="flex h-5 min-w-0 flex-1 items-center rounded-[5px] border border-line bg-ink/4 px-1.5">
                  <span className={cn('h-1.5 max-w-full rounded-full bg-(--experience-accent)/40', field.value)} />
                </span>
                <Check aria-hidden="true" focusable="false" size={12} strokeWidth={2.75} className="shrink-0 text-success" />
              </div>
            ))}
          </div>
        </div>

        {/* Checks */}
        <div className="flex flex-wrap gap-1.5">
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
