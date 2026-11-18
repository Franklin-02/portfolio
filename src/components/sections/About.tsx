import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { about, profile } from '@/data/profile'
import type { IconName } from '@/types/content'
import { cn } from '@/utils/cn'

/** One accent per capability card, so the three disciplines read as distinct. */
const capabilityAccents = [
  {
    tile: 'border-primary/25 bg-primary/10 text-primary-soft',
    number: 'text-primary-soft',
    rule: 'from-primary',
    hover: 'hover:border-primary/45',
  },
  {
    tile: 'border-secondary/25 bg-secondary/10 text-secondary-soft',
    number: 'text-secondary-soft',
    rule: 'from-secondary',
    hover: 'hover:border-secondary/45',
  },
  {
    tile: 'border-highlight/25 bg-highlight/10 text-highlight',
    number: 'text-highlight',
    rule: 'from-highlight',
    hover: 'hover:border-highlight/45',
  },
] as const

const facts: { icon: IconName; label: string; value: string }[] = [
  { icon: 'briefcase', label: 'Role', value: profile.designation },
  { icon: 'building', label: 'Organization', value: profile.organization },
  { icon: 'calendar', label: 'Experience', value: `${profile.experience} · ${profile.employmentPeriod}` },
  { icon: 'badge-check', label: 'Certification', value: profile.certification },
  { icon: 'map-pin', label: 'Location', value: profile.location },
]

/** One fact: room on the left for the icon, which is positioned inside the term. */
const factGroup = 'relative min-h-[4.25rem] py-3.5 pl-[3.25rem]'

const factIcon =
  'absolute top-4 left-0 flex size-9 items-center justify-center rounded-lg border border-line bg-ink/4 text-primary-soft'

export function About() {
  const [lead, ...paragraphs] = about.paragraphs

  return (
    <Section id="about" tone="surface">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Heading and quick facts */}
        <div className="lg:col-span-5">
          <SectionHeading id="about-heading" eyebrow={about.eyebrow} title={about.heading} />

          <Reveal delay={0.1} className="mt-10">
            <Card as="aside" aria-labelledby="about-facts-heading" className="card-sheen p-6 sm:p-7">
              <h3
                id="about-facts-heading"
                className="font-sans text-xs font-semibold tracking-[0.18em] text-faint uppercase"
              >
                At a glance
              </h3>

              {/* Each group holds its <dt> and <dd> directly (valid list markup); the icon sits inside the <dt>. */}
              <dl className="mt-1.5 divide-y divide-line">
                {facts.map((fact) => (
                  <div key={fact.label} className={factGroup}>
                    <dt className="text-xs font-medium text-faint">
                      <span aria-hidden="true" className={factIcon}>
                        <Icon name={fact.icon} size={17} />
                      </span>
                      {fact.label}
                    </dt>
                    <dd className="mt-0.5 text-sm leading-snug font-medium text-ink">{fact.value}</dd>
                  </div>
                ))}

                <div className={cn(factGroup, 'pb-0')}>
                  <dt className="text-xs font-medium text-faint">
                    <span aria-hidden="true" className={factIcon}>
                      <Icon name="languages" size={17} />
                    </span>
                    Languages
                  </dt>
                  <dd className="mt-1.5">
                    <ul className="flex flex-wrap gap-2">
                      {profile.languages.map((language) => (
                        <li
                          key={language.name}
                          className="rounded-md border border-line bg-ink/4 px-2.5 py-1 text-xs font-medium text-ink"
                        >
                          {language.name}
                          <span className="text-muted"> · {language.level}</span>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </Card>
          </Reveal>
        </div>

        {/* Introduction */}
        <div className="lg:col-span-7 lg:pt-2">
          <Reveal>
            <p className="text-lg leading-relaxed text-pretty text-ink sm:text-xl sm:leading-relaxed">{lead}</p>
          </Reveal>
          <div className="mt-6 space-y-5">
            {paragraphs.map((paragraph, index) => (
              <Reveal key={paragraph} delay={0.06 * (index + 1)}>
                <p className="text-base leading-relaxed text-pretty text-muted">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Capability cards */}
      <RevealGroup className="mt-16 grid gap-5 md:grid-cols-3 lg:mt-20">
        {about.capabilities.map((capability, index) => {
          const accent = capabilityAccents[index % capabilityAccents.length]

          return (
            <RevealItem key={capability.title} className="h-full">
              <Card
                as="article"
                interactive
                className={cn('group h-full overflow-hidden p-7 sm:p-8', accent.hover)}
              >
                <span
                  aria-hidden="true"
                  className={cn('absolute inset-x-0 top-0 h-px bg-linear-to-r to-transparent', accent.rule)}
                />
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={cn(
                      'flex size-12 items-center justify-center rounded-xl border transition duration-300 group-hover:scale-105',
                      accent.tile,
                    )}
                  >
                    <Icon name={capability.icon} size={22} />
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn('font-display text-sm font-bold tracking-[0.2em]', accent.number)}
                  >
                    {capability.number}
                  </span>
                </div>
                <h3 className="mt-7 text-xl font-bold tracking-tight text-ink">{capability.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{capability.description}</p>
              </Card>
            </RevealItem>
          )
        })}
      </RevealGroup>
    </Section>
  )
}
