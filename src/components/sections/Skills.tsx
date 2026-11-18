import type { MotionStyle } from 'motion/react'
import * as m from 'motion/react-m'
import { useCallback, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { skillAccent } from '@/components/sections/skills/accents'
import { bentoSpans } from '@/components/sections/skills/bentoLayout'
import { SkillCard } from '@/components/sections/skills/SkillCard'
import { bringCardIntoView, skillCardId } from '@/components/sections/skills/skillDom'
import { SkillIndex } from '@/components/sections/skills/SkillIndex'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { skills } from '@/data/skills'
import { fadeUpItem, staggerContainer, VIEWPORT_ONCE } from '@/utils/motion'

const INDEX_LABEL_ID = 'expertise-index-label'

/** The width of every card, worked out from its content (see bentoLayout.ts). */
const spans = bentoSpans(skills.categories)

/**
 * Technical Skills & Expertise: every category and every skill is on the page
 * at all times. The category index above the cards only adds a spotlight: it
 * brings one category forward and dims the others, without hiding anything.
 */
export function Skills() {
  const { categories } = skills
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const indexRef = useRef<HTMLDivElement>(null)

  // A selection only counts while its category exists.
  const activeId = categories.some((category) => category.id === selectedId) ? selectedId : null

  const handleSelect = useCallback((categoryId: string | null) => {
    // Applied at once: a spotlight pins the index, which changes how much of the page it covers.
    flushSync(() => setSelectedId(categoryId))
    if (categoryId === null) return

    const card = document.getElementById(skillCardId(categoryId))
    if (card) bringCardIntoView(card, indexRef.current)
  }, [])

  return (
    <Section
      id="expertise"
      tone="surface"
      decoration={
        <>
          <div className="bg-grid absolute inset-x-0 top-0 h-[40rem]" />
          <div className="bg-glow-secondary absolute -top-40 right-[-12%] size-[42rem] opacity-70" />
        </>
      }
    >
      <SectionHeading
        id="expertise-heading"
        eyebrow={skills.eyebrow}
        title={skills.heading}
        description={skills.description}
      />

      <Reveal delay={0.1} className="mt-12 lg:mt-16">
        <p id={INDEX_LABEL_ID} className="text-xs font-semibold tracking-[0.18em] text-faint uppercase">
          Spotlight a category
        </p>
      </Reveal>

      <SkillIndex
        ref={indexRef}
        categories={categories}
        activeId={activeId}
        labelledBy={INDEX_LABEL_ID}
        onSelect={handleSelect}
        className="mt-1 lg:mt-3"
      />

      <m.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-12 lg:mt-6"
      >
        {categories.map((category, index) => (
          <m.li
            key={category.id}
            variants={fadeUpItem}
            style={{ '--skills-span-md': spans[index].medium, '--skills-span-xl': spans[index].wide } as MotionStyle}
            className="min-w-0 md:col-span-(--skills-span-md) xl:col-span-(--skills-span-xl)"
          >
            <SkillCard
              category={category}
              accent={skillAccent(index)}
              state={activeId === null ? 'idle' : activeId === category.id ? 'active' : 'dimmed'}
            />
          </m.li>
        ))}
      </m.ul>
    </Section>
  )
}
