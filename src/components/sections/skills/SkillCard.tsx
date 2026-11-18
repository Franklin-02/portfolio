import type { SkillAccent } from '@/components/sections/skills/accents'
import { skillCardId, skillTitleId } from '@/components/sections/skills/skillDom'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import type { Skill, SkillCategory } from '@/types/content'
import { cn } from '@/utils/cn'

/** `active`: this card is spotlighted. `dimmed`: another card is. `idle`: none is. */
export type SkillCardState = 'idle' | 'active' | 'dimmed'

interface SkillCardProps {
  category: SkillCategory
  accent: SkillAccent
  state: SkillCardState
}

/**
 * One skill category: icon, title, summary and every skill as a chip.
 * Skills are listed as plain facts. There are no proficiency bars, levels or
 * percentages; where knowledge is limited the skill carries its own note.
 */
export function SkillCard({ category, accent, state }: SkillCardProps) {
  const titleId = skillTitleId(category.id)
  const count = category.skills.length

  return (
    <Card
      as="article"
      id={skillCardId(category.id)}
      aria-labelledby={titleId}
      data-state={state}
      className={cn(
        'group/card flex h-full flex-col overflow-hidden p-6 transition duration-300 ease-out sm:p-7',
        'hover:-translate-y-1 hover:shadow-elevated data-[state=active]:shadow-elevated',
        // A dimmed card stays readable and comes back as soon as it is pointed at.
        'data-[state=dimmed]:opacity-40 data-[state=dimmed]:hover:opacity-100',
        accent.card,
      )}
    >
      <span
        aria-hidden="true"
        className={cn('absolute inset-x-0 top-0 h-px bg-linear-to-r to-transparent', accent.rule)}
      />
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -top-32 -right-32 size-80 opacity-0 transition-opacity duration-500 group-hover/card:opacity-70 group-data-[state=active]/card:opacity-100',
          accent.glow,
        )}
      />

      <div className="relative flex items-start justify-between gap-4">
        <span
          className={cn(
            'flex size-12 items-center justify-center rounded-xl border transition duration-300 group-hover/card:scale-105',
            accent.tile,
          )}
        >
          <Icon name={category.icon} size={22} />
        </span>
        <p className="flex items-baseline gap-1.5 pt-0.5">
          <span className="font-display text-lg leading-none font-extrabold text-ink tabular-nums">{count}</span>
          <span className="text-xs font-semibold tracking-[0.18em] text-faint uppercase">
            {count === 1 ? 'skill' : 'skills'}
          </span>
        </p>
      </div>

      <h3 id={titleId} className="relative mt-6 text-xl font-bold tracking-tight text-ink">
        {category.title}
      </h3>
      <p className="relative mt-2 text-[0.95rem] leading-relaxed text-pretty text-muted">{category.summary}</p>

      <ul className="relative mt-6 flex flex-wrap gap-2 border-t border-line pt-6">
        {category.skills.map((skill) => (
          <SkillChip key={skill.name} skill={skill} className={accent.chip} />
        ))}
      </ul>
    </Card>
  )
}

/** A skill. Its optional note (for example "Basic") is shown as a small qualifier inside the chip. */
function SkillChip({ skill, className }: { skill: Skill; className?: string }) {
  return (
    <li
      className={cn(
        'inline-flex max-w-full items-center rounded-md border border-line bg-ink/4 px-2.5 py-1.5 text-[0.8125rem] leading-snug font-medium text-ink/90 transition-colors duration-200 hover:text-ink',
        className,
      )}
    >
      <span className="min-w-0 break-words">{skill.name}</span>
      {skill.note ? (
        <>
          <span className="sr-only">, </span>
          <span className="ml-2 shrink-0 border-l border-line-strong pl-2 text-[0.6875rem] font-semibold tracking-[0.08em] text-muted uppercase">
            {skill.note}
          </span>
        </>
      ) : null}
    </li>
  )
}
