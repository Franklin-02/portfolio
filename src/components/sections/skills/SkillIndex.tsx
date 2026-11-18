import { LayoutGrid } from 'lucide-react'
import * as m from 'motion/react-m'
import { useState, type CSSProperties, type KeyboardEvent, type Ref } from 'react'
import { skillAccent } from '@/components/sections/skills/accents'
import { indexGrid } from '@/components/sections/skills/bentoLayout'
import { centreInTrack } from '@/components/sections/skills/skillDom'
import { Icon } from '@/components/ui/Icon'
import type { SkillCategory } from '@/types/content'
import { cn } from '@/utils/cn'
import { EASE_OUT, VIEWPORT_ONCE } from '@/utils/motion'
import '@/components/sections/skills/skills.css'

interface SkillIndexProps {
  ref?: Ref<HTMLDivElement>
  categories: readonly SkillCategory[]
  /** Id of the spotlighted category, or null while every category is shown equally. */
  activeId: string | null
  /** Id of the element that names the toolbar. */
  labelledBy: string
  onSelect: (categoryId: string | null) => void
  className?: string
}

/**
 * The category index: one toggle button per category plus "All categories".
 * Pressing a category spotlights its card; pressing it again, pressing
 * "All categories" or pressing Escape clears the spotlight.
 *
 * It is a toolbar: a single tab stop, with the Left and Right arrow keys
 * (and Home / End) moving between the buttons.
 */
export function SkillIndex({ ref, categories, activeId, labelledBy, onSelect, className }: SkillIndexProps) {
  const [tabStop, setTabStop] = useState(0)
  const currentStop = Math.min(tabStop, categories.length)
  const { columns, leadSpan } = indexGrid(categories.length + 1)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button'))
    const current = buttons.findIndex((button) => button === document.activeElement)
    if (current === -1) return

    let next = current
    switch (event.key) {
      case 'ArrowRight':
        next = (current + 1) % buttons.length
        break
      case 'ArrowLeft':
        next = (current - 1 + buttons.length) % buttons.length
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = buttons.length - 1
        break
      case 'Escape':
        if (activeId === null) return
        onSelect(null)
        break
      default:
        return
    }

    event.preventDefault()
    buttons[next]?.focus()
  }

  const select = (stop: number, categoryId: string | null, button: HTMLButtonElement) => {
    setTabStop(stop)
    centreInTrack(button)
    // Pressing the spotlighted category again releases it.
    onSelect(categoryId !== null && categoryId === activeId ? null : categoryId)
  }

  return (
    // The index is pinned with `position: sticky`, so it only fades in: a transform would be one more thing to undo.
    <m.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.65, ease: EASE_OUT, delay: 0.15 }}
      className={cn('skills-index', className)}
      data-engaged={activeId !== null}
    >
      <div
        role="toolbar"
        aria-labelledby={labelledBy}
        className="skills-index-track"
        style={{ '--skills-index-columns': columns, '--skills-index-lead': leadSpan } as CSSProperties}
        onKeyDown={handleKeyDown}
      >
        <button
          type="button"
          className="skills-index-item"
          aria-pressed={activeId === null}
          tabIndex={currentStop === 0 ? 0 : -1}
          onFocus={() => setTabStop(0)}
          onClick={(event) => select(0, null, event.currentTarget)}
        >
          <LayoutGrid aria-hidden="true" focusable="false" size={16} strokeWidth={1.75} className="skills-index-icon" />
          <span className="skills-index-label">
            All<span className="max-lg:sr-only"> categories</span>
          </span>
        </button>

        {categories.map((category, index) => {
          const accent = skillAccent(index)
          const stop = index + 1
          const count = category.skills.length

          return (
            <button
              key={category.id}
              type="button"
              className="skills-index-item"
              style={{ '--skills-accent': accent.fill, '--skills-accent-text': accent.text } as CSSProperties}
              aria-pressed={category.id === activeId}
              tabIndex={currentStop === stop ? 0 : -1}
              onFocus={() => setTabStop(stop)}
              onClick={(event) => select(stop, category.id, event.currentTarget)}
            >
              <Icon name={category.icon} size={16} className="skills-index-icon" />
              <span className="skills-index-label">{category.title}</span>
              <span className="sr-only">, </span>
              <span className="skills-index-count">
                {count}
                <span className="skills-index-unit sr-only lg:not-sr-only"> {count === 1 ? 'skill' : 'skills'}</span>
              </span>
            </button>
          )
        })}
      </div>
    </m.div>
  )
}
