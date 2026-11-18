import type { TagTone } from '@/components/ui/Tag'

/** Brand colours an item of the timeline can take. */
export type ExperienceAccent = 'primary' | 'secondary' | 'highlight'

interface AccentStyle {
  /** Sets --experience-accent for the rules in experience.css (nodes, rail, illustrations). */
  scope: string
  /** Small accent-coloured text. */
  text: string
  /** Matching tone of the shared <Tag>. */
  tag: TagTone
  /** Border colour of a card while it is hovered. */
  hoverBorder: string
}

export const accentStyles: Record<ExperienceAccent, AccentStyle> = {
  primary: {
    scope: 'experience-accent-primary',
    text: 'text-primary-soft',
    tag: 'primary',
    hoverBorder: 'hover:border-primary/35',
  },
  secondary: {
    scope: 'experience-accent-secondary',
    text: 'text-secondary-soft',
    tag: 'secondary',
    hoverBorder: 'hover:border-secondary/35',
  },
  highlight: {
    scope: 'experience-accent-highlight',
    text: 'text-highlight',
    tag: 'highlight',
    hoverBorder: 'hover:border-highlight/35',
  },
}

/** The company card opens the timeline in the primary brand colour. */
export const HEAD_ACCENT: ExperienceAccent = 'primary'

/** The footnote closes the timeline. */
export const TAIL_ACCENT: ExperienceAccent = 'highlight'

const engagementAccents: ExperienceAccent[] = ['primary', 'secondary', 'highlight']

/** One accent per project engagement, by position, so neighbouring entries read as distinct. */
export function engagementAccent(index: number): ExperienceAccent {
  return engagementAccents[index % engagementAccents.length]
}
