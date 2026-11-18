import type { ReactNode } from 'react'
import { AcademicTimeline } from '@/components/sections/education/AcademicTimeline'
import { CertificationCard } from '@/components/sections/education/CertificationCard'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { education } from '@/data/education'
import type { IconName } from '@/types/content'

const CERTIFICATIONS_TITLE_ID = 'education-certifications-title'
const ACADEMIC_TITLE_ID = 'education-academic-title'

/** Soft lighting behind the two groups. */
function EducationBackdrop() {
  return (
    <>
      <div className="bg-glow-primary absolute top-[22%] left-[-14%] size-[44rem] opacity-70" />
      <div className="bg-glow-secondary absolute right-[-16%] bottom-[-18rem] size-[40rem] opacity-70" />
    </>
  )
}

/** Labels one of the two groups: an icon, the group name and a rule to the edge of the column. */
function GroupTitle({ id, icon, children }: { id: string; icon: IconName; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <Icon name={icon} size={17} className="shrink-0 text-primary-soft" />
      <h3 id={id} className="font-sans text-[0.8125rem] font-semibold tracking-[0.18em] text-ink uppercase">
        {children}
      </h3>
      <span aria-hidden="true" className="h-px flex-1 bg-linear-to-r from-line-strong to-transparent" />
    </div>
  )
}

/**
 * Certifications & Education. The two kinds of credential are kept apart, each
 * under its own label: the certification as a certificate on one side, the
 * academic qualifications as a short timeline on the other. Both lists are
 * rendered from src/data/education.ts, so an entry added there appears here.
 */
export function Education() {
  return (
    <Section id="education" tone="canvas" decoration={<EducationBackdrop />}>
      <SectionHeading
        id="education-heading"
        eyebrow={education.eyebrow}
        title={education.heading}
        description={education.description}
      />

      <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-8">
        <div role="group" aria-labelledby={CERTIFICATIONS_TITLE_ID} className="flex flex-col lg:col-span-7">
          <Reveal>
            <GroupTitle id={CERTIFICATIONS_TITLE_ID} icon="badge-check">
              {education.certificationsTitle}
            </GroupTitle>
          </Reveal>

          <ul className="mt-6 grid flex-1 auto-rows-fr gap-5">
            {education.certifications.map((certification, index) => (
              <li key={certification.id}>
                <Reveal delay={0.08 * index} className="h-full">
                  <CertificationCard certification={certification} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <div role="group" aria-labelledby={ACADEMIC_TITLE_ID} className="flex flex-col lg:col-span-5">
          <Reveal>
            <GroupTitle id={ACADEMIC_TITLE_ID} icon="graduation-cap">
              {education.educationTitle}
            </GroupTitle>
          </Reveal>

          <AcademicTimeline entries={education.education} className="mt-6 flex-1" />
        </div>
      </div>
    </Section>
  )
}
