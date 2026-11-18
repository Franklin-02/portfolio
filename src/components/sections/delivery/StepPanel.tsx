import { Icon } from '@/components/ui/Icon'
import { Tag } from '@/components/ui/Tag'
import type { DeliveryStep } from '@/types/content'

const metaLabel = 'text-xs font-semibold tracking-[0.18em] text-faint uppercase'

interface StepPanelProps {
  step: DeliveryStep
  id: string
  /** Id of the tab that labels this panel. */
  tabId: string
  /** Position of the stage, formatted: "03". */
  number: string
  /** Number of stages, formatted: "07". */
  total: string
  selected: boolean
}

/**
 * The detail of one stage: what it is about and what I contribute to it.
 *
 * In the vertical stepper the panel opens right under the stage title, so the
 * title is not repeated; in the horizontal one it carries its own title.
 */
export function StepPanel({ step, id, tabId, number, total, selected }: StepPanelProps) {
  const activitiesId = `${id}-activities`

  return (
    <div
      role="tabpanel"
      id={id}
      aria-labelledby={tabId}
      tabIndex={selected ? 0 : undefined}
      data-selected={selected}
      className="delivery-panel rounded-lg"
    >
      <div className="grid gap-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] content-start items-center gap-x-3.5 gap-y-3.5 lg:col-span-7 lg:items-start lg:gap-x-5 lg:gap-y-0">
          <span className="flex size-9 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary-soft lg:row-span-2 lg:size-12 lg:rounded-xl">
            <Icon name={step.icon} size={18} className="lg:size-[22px]" />
          </span>

          <div className="min-w-0">
            <p className={metaLabel}>
              <span className="text-primary-soft">Stage {number}</span>
              <span aria-hidden="true"> / </span>
              <span className="sr-only"> of </span>
              {total}
            </p>
            <h4 className="mt-1.5 hidden text-2xl leading-tight font-bold tracking-tight text-balance text-ink lg:block">
              {step.title}
            </h4>
          </div>

          <p className="col-span-2 max-w-xl text-[0.95rem] leading-relaxed text-pretty text-muted lg:col-span-1 lg:col-start-2 lg:mt-3 lg:text-base">
            {step.description}
          </p>
        </div>

        <div className="min-w-0 lg:col-span-5 lg:border-l lg:border-line lg:pl-10">
          <p id={activitiesId} className={metaLabel}>
            What I contribute
          </p>
          <ul role="list" aria-labelledby={activitiesId} className="mt-3 flex flex-wrap gap-2 lg:mt-4">
            {step.activities.map((activity) => (
              <li key={activity} className="max-w-full">
                <Tag tone="primary" className="max-w-full break-words">
                  {activity}
                </Tag>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
