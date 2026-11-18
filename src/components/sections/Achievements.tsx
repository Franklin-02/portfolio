import '@/components/sections/achievements/achievements.css'

import { Info } from 'lucide-react'
import { GaugeBand } from '@/components/sections/achievements/GaugeBand'
import { TallyBand } from '@/components/sections/achievements/TallyBand'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { achievements } from '@/data/achievements'
import type { Metric } from '@/types/content'

/** A percentage can be drawn on a 0–100% dial; a count has no scale to be measured on. */
function isPercentage(metric: Metric): boolean {
  return metric.value !== undefined && metric.suffix === '%'
}

/** Ambient lighting behind the dashboard: a hairline at the top and one soft glow. */
function AchievementsBackdrop() {
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-line-strong to-transparent" />
      <div className="bg-glow-primary absolute top-[-14rem] right-[-12%] size-[46rem] opacity-70" />
    </>
  )
}

/**
 * Key Achievements: a statistics dashboard in two bands, generated from
 * `achievements` in src/data/achievements.ts. Groups of percentages become
 * large gauge cards; groups of counts become a compact strip.
 *
 * The figures are self-reported. Nothing here draws a trend or a comparison,
 * and the disclaimer from the data file is shown next to the heading.
 */
export function Achievements() {
  return (
    <Section id="achievements" tone="surface" decoration={<AchievementsBackdrop />}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <SectionHeading
          id="achievements-heading"
          eyebrow={achievements.eyebrow}
          title={achievements.heading}
          description={achievements.description}
        />

        <Reveal delay={0.1} className="lg:max-w-[17rem] lg:shrink-0 lg:pb-1">
          <p className="flex items-start gap-2.5 text-[0.8125rem] leading-relaxed text-muted">
            <Info aria-hidden="true" size={15} strokeWidth={1.75} className="mt-[0.2em] shrink-0 text-faint" />
            {achievements.disclaimer}
          </p>
        </Reveal>
      </div>

      <div className="mt-12 space-y-12 lg:mt-16 lg:space-y-14">
        {achievements.groups.map((group) =>
          group.metrics.every(isPercentage) ? (
            <GaugeBand key={group.id} group={group} />
          ) : (
            <TallyBand key={group.id} group={group} />
          ),
        )}
      </div>
    </Section>
  )
}
