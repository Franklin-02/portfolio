import '@/components/sections/experience/experience.css'

import { engagementAccent, HEAD_ACCENT, TAIL_ACCENT } from '@/components/sections/experience/accents'
import { EngagementCard } from '@/components/sections/experience/EngagementCard'
import { RoleCard } from '@/components/sections/experience/RoleCard'
import { TimelineItem } from '@/components/sections/experience/TimelineItem'
import { TimelineTail } from '@/components/sections/experience/TimelineTail'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { experience } from '@/data/experience'
import type { Engagement, IconName } from '@/types/content'

/** Icon on the timeline node of an engagement, matching its illustration. */
const engagementIcons: Record<Engagement['visual'], IconName> = {
  'policy-lifecycle': 'repeat',
  'api-validation': 'braces',
  'application-analysis': 'scan-search',
}

/**
 * Professional Experience: a vertical timeline that opens with the company and
 * role, continues with one entry per project engagement and closes with the
 * confidentiality note. Everything is rendered from src/data/experience.ts.
 *
 * The rail on the left is drawn as the visitor scrolls (see
 * experience/RailSegment.tsx); each node and card appears as it enters view.
 */
export function Experience() {
  const { engagements } = experience

  return (
    <Section
      id="experience"
      tone="canvas"
      decoration={
        <>
          <div className="bg-grid absolute inset-x-0 top-0 h-[40rem] opacity-80" />
          <div className="bg-glow-primary absolute top-[12%] left-[-16%] size-[44rem] opacity-70" />
          <div className="bg-glow-secondary absolute right-[-14%] bottom-[4%] size-[44rem] opacity-70" />
        </>
      }
    >
      <SectionHeading
        id="experience-heading"
        eyebrow={experience.eyebrow}
        title={experience.heading}
        description={experience.description}
      />

      <div className="experience-timeline mt-12 lg:mt-16">
        <ol>
          <TimelineItem
            kind="head"
            icon="building"
            accent={HEAD_ACCENT}
            nextAccent={engagements.length > 0 ? engagementAccent(0) : TAIL_ACCENT}
            last={engagements.length === 0}
          >
            <Reveal>
              <RoleCard content={experience} />
            </Reveal>
          </TimelineItem>

          {engagements.map((engagement, index) => {
            const last = index === engagements.length - 1
            const accent = engagementAccent(index)

            return (
              <TimelineItem
                key={engagement.id}
                kind="entry"
                icon={engagementIcons[engagement.visual]}
                accent={accent}
                nextAccent={last ? TAIL_ACCENT : engagementAccent(index + 1)}
                last={last}
              >
                <Reveal>
                  <EngagementCard engagement={engagement} accent={accent} />
                </Reveal>
              </TimelineItem>
            )
          })}
        </ol>

        <TimelineTail note={experience.confidentialityNote} />
      </div>
    </Section>
  )
}
