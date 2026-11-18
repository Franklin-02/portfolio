import { AreaCards } from '@/components/sections/delivery/AreaCards'
import { ProcessStepper } from '@/components/sections/delivery/ProcessStepper'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { delivery } from '@/data/delivery'

const PROCESS_HEADING_ID = 'delivery-process-heading'

/**
 * Business Analysis & PMO: the areas of responsibility beyond testing, and
 * the delivery process as an interactive walk-through.
 *
 * Everything is generated from `delivery` in src/data/delivery.ts — the cards
 * from `areas`, the stepper from `steps`, however many there are.
 */
export function DeliveryShowcase() {
  return (
    <Section
      id="delivery"
      tone="surface"
      decoration={
        <>
          <div className="bg-glow-primary absolute top-0 right-[-12%] size-[44rem] opacity-70" />
          <div className="bg-glow-secondary absolute bottom-0 left-[-14%] size-[42rem] opacity-70" />
        </>
      }
    >
      <SectionHeading
        id="delivery-heading"
        eyebrow={delivery.eyebrow}
        title={delivery.heading}
        description={delivery.description}
      />

      <AreaCards areas={delivery.areas} />

      <div className="mt-20 lg:mt-28">
        <Reveal className="lg:flex lg:items-end lg:justify-between lg:gap-16">
          <h3
            id={PROCESS_HEADING_ID}
            className="text-2xl leading-tight font-bold tracking-tight text-balance text-ink sm:text-3xl lg:max-w-[55%] lg:shrink-0"
          >
            {delivery.processTitle}
          </h3>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-pretty text-muted lg:mt-0">
            {delivery.processDescription}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-8 lg:mt-12">
          <ProcessStepper steps={delivery.steps} labelledBy={PROCESS_HEADING_ID} />
        </Reveal>
      </div>
    </Section>
  )
}
